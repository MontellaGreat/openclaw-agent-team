"use strict";

const crypto = require("node:crypto");
const { appendEvent, writeState } = require("./ledger");
const { applyEventDrivenDoneChecks } = require("./done-checks");
const { createReviewCheckpoint, createExecutionAttempt } = require("./types");

async function requestReview(baseDir, task, input) {
  const review = createReviewCheckpoint({
    review_id: crypto.randomUUID(),
    task_id: task.task_id,
    step_id: input.step_id,
    approval_point: input.approval_point,
    requested_by: input.requested_by,
    requested_at: input.requested_at,
    review_status: "pending",
    decision_note: input.decision_note,
  });

  const event = await appendEvent(baseDir, {
    task_id: task.task_id,
    step_id: input.step_id,
    event_type: "ReviewRequested",
    actor_type: input.actor_type || "system",
    actor_id: input.actor_id || input.requested_by,
    from_status: task.status,
    to_status: "review_required",
    reason_code: input.reason_code || "approval_point_reached",
    payload: { review_id: review.review_id, approval_point: review.approval_point },
  });

  let next = {
    ...task,
    status: "review_required",
    updated_at: event.created_at,
    updated_by: input.actor_id || input.requested_by,
    review_reason_code: input.reason_code || "approval_point_reached",
    pending_review_count: (task.pending_review_count || 0) + 1,
    reviews: [...(task.reviews || []), review],
    history_log: [...(task.history_log || []), `ReviewRequested#${event.seq}`],
    version: (task.version || 1) + 1,
  };
  next = applyEventDrivenDoneChecks(next, event);
  return { task: await writeState(baseDir, next), review, event };
}

async function recordExecutionAttempt(baseDir, task, input) {
  const attemptNo = (task.attempts || []).length + 1;
  const attempt = createExecutionAttempt({
    attempt_id: crypto.randomUUID(),
    task_id: task.task_id,
    step_id: input.step_id,
    attempt_no: attemptNo,
    trigger: input.trigger || "initial_dispatch",
    status: input.status || "running",
    actor_type: input.actor_type || "executor",
    actor_id: input.actor_id,
    reason_code: input.reason_code,
    started_at: input.started_at,
    summary: input.summary,
  });

  const event = await appendEvent(baseDir, {
    task_id: task.task_id,
    step_id: input.step_id,
    event_type: "ExecutionAttemptStarted",
    actor_type: attempt.actor_type,
    actor_id: attempt.actor_id,
    from_status: task.status,
    to_status: input.to_status || "running",
    reason_code: input.reason_code || "execution_started",
    payload: { attempt_id: attempt.attempt_id, attempt_no: attempt.attempt_no, trigger: attempt.trigger },
  });

  let next = {
    ...task,
    status: input.to_status || "running",
    updated_at: event.created_at,
    updated_by: attempt.actor_id,
    attempts: [...(task.attempts || []), attempt],
    active_step_count: Math.max(1, task.active_step_count || 0),
    history_log: [...(task.history_log || []), `ExecutionAttemptStarted#${event.seq}`],
    version: (task.version || 1) + 1,
  };
  next = applyEventDrivenDoneChecks(next, event, { output_refs: attempt.output_refs || [] });
  return { task: await writeState(baseDir, next), attempt, event };
}

async function decideReview(baseDir, task, input) {
  const reviews = [...(task.reviews || [])];
  const targetIndex = reviews.findIndex((item) => item.review_id === input.review_id);
  if (targetIndex === -1) {
    throw new Error(`review not found: ${input.review_id}`);
  }

  const current = reviews[targetIndex];
  if (current.review_status !== "pending") {
    throw new Error(`review already decided: ${input.review_id}`);
  }

  const mapping = {
    approve: { review_status: "approved", event_type: "ReviewApproved", to_status: "ready", reason_code: "review_approved" },
    reject: { review_status: "rejected", event_type: "ReviewRejected", to_status: "cancelled", reason_code: "review_rejected" },
    hold: { review_status: "pending", event_type: "ReviewHeld", to_status: "review_required", reason_code: "manual_hold" },
  };
  const rule = mapping[input.decision];
  if (!rule) throw new Error(`invalid review decision: ${input.decision}`);

  const decided = {
    ...current,
    review_status: rule.review_status,
    decision: input.decision,
    decision_by: input.decision_by,
    decision_at: input.decision_at || new Date().toISOString(),
    decision_note: input.decision_note,
  };
  reviews[targetIndex] = decided;

  const event = await appendEvent(baseDir, {
    task_id: task.task_id,
    step_id: current.step_id,
    event_type: rule.event_type,
    actor_type: input.actor_type || "main-agent",
    actor_id: input.decision_by,
    from_status: task.status,
    to_status: rule.to_status,
    reason_code: input.reason_code || rule.reason_code,
    payload: { review_id: current.review_id, decision: input.decision, approval_point: current.approval_point },
  });

  let next = {
    ...task,
    status: rule.to_status,
    updated_at: event.created_at,
    updated_by: input.decision_by,
    reviews,
    pending_review_count: input.decision === "hold" ? (task.pending_review_count || 1) : Math.max(0, (task.pending_review_count || 1) - 1),
    review_reason_code: input.decision === "hold" ? (input.reason_code || "manual_hold") : undefined,
    terminal_reason: input.decision === "reject" ? (input.reason_code || rule.reason_code) : task.terminal_reason,
    history_log: [...(task.history_log || []), `${rule.event_type}#${event.seq}`],
    version: (task.version || 1) + 1,
  };
  next = applyEventDrivenDoneChecks(next, event);
  return { task: await writeState(baseDir, next), review: decided, event };
}

module.exports = {
  requestReview,
  recordExecutionAttempt,
  decideReview,
};
