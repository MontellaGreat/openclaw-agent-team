"use strict";

const path = require("node:path");
const { bootstrapTask } = require("./index");
const { createStep } = require("./types");
const { transitionTask } = require("./state-machine");
const { scheduleSupervisor } = require("./supervisor-scheduler");

async function makeTask(runtimeDir, suffix, statusFlow, overrides = {}) {
  const taskId = `task-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${suffix}`;
  const { task: created } = await bootstrapTask(runtimeDir, {
    task_id: taskId,
    source: "main-agent",
    creator: "main",
    goal: `验证 scheduler 对 ${suffix} 的批次选择`,
    context: "由 runtime-core scheduler demo 自动生成",
    done_definition: ["state file created"],
    steps: [
      createStep({ step_id: `${taskId}-s1`, task_id: taskId, title: "scheduler", kind: "agent", status: "ready", assignee_type: "main-agent", assignee_id: "main" }),
    ],
    ...overrides,
  });

  let currentTask = created;
  for (const step of statusFlow) {
    ({ task: currentTask } = await transitionTask(runtimeDir, currentTask, step));
  }
  return currentTask;
}

async function demoSupervisorScheduler(runtimeDir) {
  const dueRunning = await makeTask(runtimeDir, "scheduler-due-running", [
    { to_status: "planning", event_type: "TaskAccepted", actor_type: "orchestrator", actor_id: "orchestrator", reason_code: "task_accepted" },
    { to_status: "ready", event_type: "PlanReady", actor_type: "orchestrator", actor_id: "orchestrator", reason_code: "plan_ready" },
    { to_status: "running", event_type: "TaskStarted", actor_type: "executor", actor_id: "executor-demo", reason_code: "task_started" },
  ], { heartbeat_timeout: "30m" });

  const futureRetry = await makeTask(runtimeDir, "scheduler-future-retry", [
    { to_status: "planning", event_type: "TaskAccepted", actor_type: "orchestrator", actor_id: "orchestrator", reason_code: "task_accepted" },
    { to_status: "ready", event_type: "PlanReady", actor_type: "orchestrator", actor_id: "orchestrator", reason_code: "plan_ready" },
    { to_status: "running", event_type: "TaskStarted", actor_type: "executor", actor_id: "executor-demo", reason_code: "task_started" },
    { to_status: "blocked", event_type: "BlockedDetected", actor_type: "supervisor", actor_id: "supervisor", reason_code: "dependency_missing" },
    { to_status: "retrying", event_type: "RetryApproved", actor_type: "main-agent", actor_id: "main", reason_code: "retry_approved" },
  ], { retry_backoff: "10m" });

  const now = new Date().toISOString();
  const firstPass = await scheduleSupervisor(runtimeDir, { now, actor_id: "supervisor", limit: 1 });
  const secondPass = await scheduleSupervisor(runtimeDir, { now: new Date(Date.now() + 31 * 60 * 1000).toISOString(), actor_id: "supervisor", limit: 2 });

  return {
    dueRunning: { task_id: dueRunning.task_id },
    futureRetry: { task_id: futureRetry.task_id },
    firstPass,
    secondPass,
  };
}

module.exports = {
  demoSupervisorScheduler,
};

if (require.main === module) {
  const runtimeDir = process.argv[2] || path.join(process.cwd(), "runtime", "task-ledger-scheduler-demo");
  demoSupervisorScheduler(runtimeDir)
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
