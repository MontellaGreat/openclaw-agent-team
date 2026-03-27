"use strict";

const path = require("node:path");
const { bootstrapTask } = require("./index");
const { createStep } = require("./types");
const { transitionTask } = require("./state-machine");
const { persistDoneCheckUpdate, summarizeDoneChecks } = require("./done-checks");

async function demoBlockedEscalation(runtimeDir) {
  const taskId = `task-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-blocked-escalation-demo`;
  const { task: created } = await bootstrapTask(runtimeDir, {
    task_id: taskId,
    source: "main-agent",
    creator: "main",
    goal: "验证 blocked 超时升级后 unresolved 语义",
    context: "由 openclaw-agent-team runtime-core blocked escalation demo 自动生成",
    done_definition: [
      "task_state.json 成功落盘",
      "task_events.jsonl 成功落盘",
      "主链状态迁移成立",
    ],
    steps: [
      createStep({ step_id: `${taskId}-s1`, task_id: taskId, title: "阻塞升级验证", kind: "agent", status: "ready", assignee_type: "main-agent", assignee_id: "main" }),
    ],
  });

  let currentTask = created;
  currentTask = await persistDoneCheckUpdate(runtimeDir, currentTask, {
    description_includes: "task_state.json",
    status: "passed",
    verified_by: "system",
    evidence_kind: "file",
    evidence_ref: currentTask.state_file_path,
    note: "bootstrap state file created",
  });
  currentTask = await persistDoneCheckUpdate(runtimeDir, currentTask, {
    description_includes: "task_events.jsonl",
    status: "passed",
    verified_by: "system",
    evidence_kind: "file",
    evidence_ref: currentTask.events_file_path,
    note: "bootstrap events file created",
  });

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
    event_type: "ExecutionStarted",
    actor_type: "orchestrator",
    actor_id: "orchestrator",
    reason_code: "execution_started",
  }));
  ({ task: currentTask } = await transitionTask(runtimeDir, currentTask, {
    to_status: "blocked",
    event_type: "BlockedDetected",
    actor_type: "supervisor",
    actor_id: "supervisor",
    reason_code: "wait_timeout",
  }));
  ({ task: currentTask } = await transitionTask(runtimeDir, currentTask, {
    to_status: "review_required",
    event_type: "BlockedEscalatedToReview",
    actor_type: "supervisor",
    actor_id: "supervisor",
    reason_code: "wait_timeout_escalated",
  }));

  return {
    taskId,
    statePath: path.join(runtimeDir, taskId, "task_state.json"),
    eventsPath: path.join(runtimeDir, taskId, "task_events.jsonl"),
    finalStatus: currentTask.status,
    doneCheckSummary: summarizeDoneChecks(currentTask),
  };
}

if (require.main === module) {
  const runtimeDir = process.argv[2] || path.join(process.cwd(), "runtime", "task-ledger-blocked");
  demoBlockedEscalation(runtimeDir)
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}

module.exports = { demoBlockedEscalation };
