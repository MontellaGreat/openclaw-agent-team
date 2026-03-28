"use strict";

const path = require("node:path");
const {
  createTaskCommand,
  listTasksCommand,
  showTaskCommand,
  cancelTaskCommand,
  retryTaskCommand,
} = require("./task-cli");
const { transitionTask } = require("./state-machine");
const { loadTask } = require("./task-cli-helpers");

async function demoTaskCli(runtimeDir) {
  const created = await createTaskCommand(runtimeDir, {
    goal: "验证 shell 最小入口闭环",
    context: "由 runtime-core task-cli demo 自动生成",
    priority: "high",
    risk_level: "medium",
    source: "shell",
    creator: "human",
  });

  const listedAfterCreate = await listTasksCommand(runtimeDir, {});
  const shownQueued = await showTaskCommand(runtimeDir, created.task_id);

  let task = await loadTask(runtimeDir, created.task_id);
  ({ task } = await transitionTask(runtimeDir, task, {
    to_status: "planning",
    event_type: "TaskAccepted",
    actor_type: "orchestrator",
    actor_id: "orchestrator",
    reason_code: "task_accepted",
  }));
  ({ task } = await transitionTask(runtimeDir, task, {
    to_status: "ready",
    event_type: "PlanReady",
    actor_type: "orchestrator",
    actor_id: "orchestrator",
    reason_code: "plan_ready",
  }));
  ({ task } = await transitionTask(runtimeDir, task, {
    to_status: "running",
    event_type: "TaskStarted",
    actor_type: "executor",
    actor_id: "executor-demo",
    reason_code: "task_started",
  }));
  ({ task } = await transitionTask(runtimeDir, task, {
    to_status: "blocked",
    event_type: "BlockedDetected",
    actor_type: "supervisor",
    actor_id: "supervisor",
    reason_code: "dependency_missing",
  }));

  const retried = await retryTaskCommand(runtimeDir, created.task_id, "manual_retry");
  const shownAfterRetry = await showTaskCommand(runtimeDir, created.task_id);
  const cancelled = await cancelTaskCommand(runtimeDir, created.task_id, "manual_cancel");
  const shownCancelled = await showTaskCommand(runtimeDir, created.task_id);

  return {
    created,
    listedAfterCreateCount: listedAfterCreate.length,
    shownQueued,
    retried,
    shownAfterRetry,
    cancelled,
    shownCancelled,
  };
}

module.exports = {
  demoTaskCli,
};

if (require.main === module) {
  const runtimeDir = process.argv[2] || path.join(process.cwd(), "runtime", "task-ledger-cli-demo");
  demoTaskCli(runtimeDir)
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
