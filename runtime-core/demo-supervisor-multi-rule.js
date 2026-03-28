"use strict";

const path = require("node:path");
const { bootstrapTask } = require("./index");
const { createStep } = require("./types");
const { transitionTask } = require("./state-machine");
const { supervisorTick } = require("./supervisor");

async function demoSupervisorMultiRule(runtimeDir) {
  const taskId = `task-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-multi-rule-demo`;
  const { task: created } = await bootstrapTask(runtimeDir, {
    task_id: taskId,
    source: "main-agent",
    creator: "main",
    goal: "验证 supervisor 多规则命中后可按优先级选择升级动作",
    context: "由 runtime-core multi-rule demo 自动生成",
    max_wait_duration: "24h",
    heartbeat_timeout: "30m",
    done_definition: [
      "blocked_timeout 规则可命中",
      "可返回 matched_rules 与 selected_rule",
      "最终按优先级进入 review_required",
    ],
    steps: [
      createStep({ step_id: `${taskId}-s1`, task_id: taskId, title: "多规则验证", kind: "agent", status: "ready", assignee_type: "main-agent", assignee_id: "main" }),
    ],
  });

  let currentTask = created;
  ({ task: currentTask } = await transitionTask(runtimeDir, currentTask, {
    to_status: "planning",
    event_type: "TaskAccepted",
    actor_type: "orchestrator",
    actor_id: "orchestrator",
    reason_code: "task_accepted",
  }));
  ({ task: currentTask } = await transitionTask(runtimeDir, currentTask, {
    to_status: "ready",
    event_type: "PlanReady",
    actor_type: "orchestrator",
    actor_id: "orchestrator",
    reason_code: "plan_ready",
  }));
  ({ task: currentTask } = await transitionTask(runtimeDir, currentTask, {
    to_status: "running",
    event_type: "TaskStarted",
    actor_type: "executor",
    actor_id: "executor-demo",
    reason_code: "task_started",
  }));
  ({ task: currentTask } = await transitionTask(runtimeDir, currentTask, {
    to_status: "waiting",
    event_type: "WaitingEntered",
    actor_type: "executor",
    actor_id: "executor-demo",
    reason_code: "external_feedback_pending",
  }));
  ({ task: currentTask } = await transitionTask(runtimeDir, currentTask, {
    to_status: "blocked",
    event_type: "BlockedDetected",
    actor_type: "supervisor",
    actor_id: "supervisor",
    reason_code: "dependency_missing",
  }));

  const staleBlockedTask = {
    ...currentTask,
    blocked_since: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    last_progress_at: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    heartbeat_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  };

  const outcome = await supervisorTick(runtimeDir, staleBlockedTask, {
    now: new Date().toISOString(),
    actor_id: "supervisor",
  });

  return {
    taskId,
    statePath: path.join(runtimeDir, taskId, "task_state.json"),
    matched_rules: outcome.matched_rules,
    selected_rule: outcome.selected_rule,
    finalStatus: outcome.task.status,
    eventType: outcome.event?.event_type || null,
  };
}

module.exports = {
  demoSupervisorMultiRule,
};

if (require.main === module) {
  const runtimeDir = process.argv[2] || path.join(process.cwd(), "runtime", "task-ledger-multi-rule-demo");
  demoSupervisorMultiRule(runtimeDir)
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
