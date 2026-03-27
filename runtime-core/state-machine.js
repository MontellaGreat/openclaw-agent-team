"use strict";

const { appendEvent, writeState } = require("./ledger");
const { applyEventDrivenDoneChecks } = require("./done-checks");

const TERMINAL = new Set(["done", "failed", "cancelled"]);
const TRANSITIONS = {
  queued: ["planning", "cancelled"],
  planning: ["ready", "cancelled"],
  ready: ["running", "cancelled"],
  running: ["waiting", "blocked", "review_required", "done", "failed", "cancelled"],
  waiting: ["blocked", "review_required", "done", "failed", "cancelled"],
  blocked: ["review_required", "retrying", "cancelled"],
  retrying: ["running", "failed", "cancelled"],
  review_required: ["ready", "cancelled"],
  done: [],
  failed: ["retrying"],
  cancelled: [],
};

function canTransition(fromStatus, toStatus) {
  return (TRANSITIONS[fromStatus] || []).includes(toStatus);
}

function assertTransition(fromStatus, toStatus) {
  if (!canTransition(fromStatus, toStatus)) {
    throw new Error(`illegal transition: ${fromStatus} -> ${toStatus}`);
  }
}

async function transitionTask(baseDir, task, input) {
  assertTransition(task.status, input.to_status);
  if (input.to_status === "done" && ((task.pending_review_count || 0) > 0)) {
    throw new Error("cannot enter done while pending_review_count > 0");
  }
  if (input.to_status === "done") {
    const checks = task.done_checks || [];
    const allPassed = checks.length > 0 && checks.every((item) => item.status === "passed");
    if (!allPassed) throw new Error("cannot enter done before done_checks all passed");
  }

  const event = await appendEvent(baseDir, {
    task_id: task.task_id,
    step_id: input.step_id,
    event_type: input.event_type,
    actor_type: input.actor_type,
    actor_id: input.actor_id,
    from_status: task.status,
    to_status: input.to_status,
    reason_code: input.reason_code,
    payload: input.payload,
    correlation_id: input.correlation_id,
  });

  let next = {
    ...task,
    status: input.to_status,
    updated_at: event.created_at,
    updated_by: input.actor_id,
    version: (task.version || 1) + 1,
    history_log: [...(task.history_log || []), `${input.event_type}#${event.seq}`],
  };

  if (TERMINAL.has(input.to_status)) {
    next.terminal_reason = input.reason_code || input.event_type;
  }
  if (input.to_status === "blocked") next.blocked_since = event.created_at;
  if (input.to_status !== "blocked") next.blocked_since = undefined;
  if (input.to_status === "review_required") next.pending_review_count = (task.pending_review_count || 0) + 1;
  if (input.to_status === "ready" && task.status === "review_required") next.pending_review_count = Math.max(0, (task.pending_review_count || 0) - 1);
  if (input.to_status === "cancelled" && task.status === "review_required") next.pending_review_count = Math.max(0, (task.pending_review_count || 0) - 1);
  if (["running", "waiting", "done", "failed"].includes(input.to_status)) next.last_progress_at = event.created_at;
  next = applyEventDrivenDoneChecks(next, event, { output_refs: input.output_refs || [] });
  return { task: await writeState(baseDir, next), event };
}

module.exports = {
  TRANSITIONS,
  canTransition,
  assertTransition,
  transitionTask,
};
