"use strict";

const path = require("node:path");
const { createTask, createStep } = require("./types");
const { getLedgerPaths, createLedger } = require("./ledger");
const { transitionTask } = require("./state-machine");
const { requestReview, recordExecutionAttempt, decideReview } = require("./governance");
const { persistDoneCheckUpdate, summarizeDoneChecks } = require("./done-checks");

async function bootstrapTask(runtimeDir, input) {
  const paths = getLedgerPaths(runtimeDir, input.task_id);
  const task = createTask({
    ...input,
    state_file_path: paths.statePath,
    events_file_path: paths.eventsPath,
  });
  return createLedger(runtimeDir, task);
}

async function demo(runtimeDir) {
  const taskId = `task-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-demo`;
  const { task: created } = await bootstrapTask(runtimeDir, {
    task_id: taskId,
    source: "main-agent",
    creator: "main",
    goal: "验证最小任务账本与状态迁移骨架可工作",
    context: "由 openclaw-agent-team runtime-core demo 自动生成",
    done_definition: [
      "task_state.json 成功落盘",
      "task_events.jsonl 成功落盘",
      "主链状态迁移成立",
    ],
    steps: [
      createStep({ step_id: `${taskId}-s1`, task_id: taskId, title: "初始化", kind: "agent", status: "ready", assignee_type: "main-agent", assignee_id: "main" }),
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

  const planning = await transitionTask(runtimeDir, currentTask, {
    to_status: "planning",
    event_type: "TaskAccepted",
    actor_type: "orchestrator",
    actor_id: "orchestrator",
    reason_code: "task_accepted",
  });

  const ready = await transitionTask(runtimeDir, planning.task, {
    to_status: "ready",
    event_type: "PlanReady",
    actor_type: "orchestrator",
    actor_id: "orchestrator",
    reason_code: "plan_ready",
  });

  const runningAttempt = await recordExecutionAttempt(runtimeDir, ready.task, {
    actor_id: "executor-demo",
    actor_type: "executor",
    step_id: `${taskId}-s1`,
    trigger: "initial_dispatch",
    to_status: "running",
  });

  const review = await requestReview(runtimeDir, runningAttempt.task, {
    actor_id: "supervisor",
    actor_type: "supervisor",
    requested_by: "supervisor",
    approval_point: "high_risk_action",
    reason_code: "high_risk_action",
    decision_note: "demo review gate",
  });

  const reviewDecision = await decideReview(runtimeDir, review.task, {
    review_id: review.review.review_id,
    decision: "approve",
    decision_by: "main",
    actor_type: "main-agent",
    decision_note: "demo approve",
  });

  const rerunAttempt = await recordExecutionAttempt(runtimeDir, reviewDecision.task, {
    actor_id: "executor-demo",
    actor_type: "executor",
    step_id: `${taskId}-s1`,
    trigger: "retry_dispatch",
    to_status: "running",
  });

  const summary = summarizeDoneChecks(rerunAttempt.task);
  if (summary.pending > 0 || summary.failed > 0) {
    throw new Error(`done checks not satisfied: ${JSON.stringify(summary)}`);
  }

  const doneTask = await transitionTask(runtimeDir, rerunAttempt.task, {
    to_status: "done",
    event_type: "TaskCompleted",
    actor_type: "main-agent",
    actor_id: "main",
    reason_code: "done_checks_passed",
  });

  return {
    taskId,
    statePath: path.join(runtimeDir, taskId, "task_state.json"),
    eventsPath: path.join(runtimeDir, taskId, "task_events.jsonl"),
    finalStatus: doneTask.task.status,
    doneCheckSummary: summary,
  };
}

async function demoFailure(runtimeDir) {
  const taskId = `task-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-failure-demo`;
  const { task: created } = await bootstrapTask(runtimeDir, {
    task_id: taskId,
    source: "main-agent",
    creator: "main",
    goal: "验证 blocked / failed / retrying 分支的 done_check 反向更新",
    context: "由 openclaw-agent-team runtime-core failure demo 自动生成",
    done_definition: [
      "task_state.json 成功落盘",
      "task_events.jsonl 成功落盘",
      "主链状态迁移成立",
    ],
    steps: [
      createStep({ step_id: `${taskId}-s1`, task_id: taskId, title: "失败链验证", kind: "agent", status: "ready", assignee_type: "main-agent", assignee_id: "main" }),
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
  ({ task: currentTask } = await recordExecutionAttempt(runtimeDir, currentTask, {
    actor_id: "executor-demo",
    actor_type: "executor",
    step_id: `${taskId}-s1`,
    trigger: "initial_dispatch",
    to_status: "running",
  }));
  ({ task: currentTask } = await transitionTask(runtimeDir, currentTask, {
    to_status: "blocked",
    event_type: "BlockedDetected",
    actor_type: "supervisor",
    actor_id: "supervisor",
    reason_code: "dependency_missing",
  }));
  ({ task: currentTask } = await transitionTask(runtimeDir, currentTask, {
    to_status: "retrying",
    event_type: "RetryApproved",
    actor_type: "main-agent",
    actor_id: "main",
    reason_code: "retry_approved",
  }));
  ({ task: currentTask } = await transitionTask(runtimeDir, currentTask, {
    to_status: "failed",
    event_type: "TaskFailed",
    actor_type: "supervisor",
    actor_id: "supervisor",
    reason_code: "retry_exhausted",
  }));

  return {
    taskId,
    statePath: path.join(runtimeDir, taskId, "task_state.json"),
    eventsPath: path.join(runtimeDir, taskId, "task_events.jsonl"),
    finalStatus: currentTask.status,
    doneCheckSummary: summarizeDoneChecks(currentTask),
  };
}

module.exports = {
  bootstrapTask,
  demo,
  demoFailure,
};

if (require.main === module) {
  const runtimeDir = process.argv[2] || path.join(process.cwd(), "runtime", "task-ledger");
  demo(runtimeDir)
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
