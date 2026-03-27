"use strict";

const { ensureDoneChecks } = require("./done-definition");

const DEFAULTS = {
  contractVersion: "v1",
  priority: "normal",
  riskLevel: "medium",
  approvalRequired: false,
  maxRounds: 8,
  maxRetries: 2,
  maxWaitDuration: "24h",
  heartbeatTimeout: "30m",
  retryBackoff: "exponential(base=5m, cap=2h)",
  nudgeLimit: 2,
  taskTtl: "7d",
  fanoutLimit: 3,
};

const TASK_STATUSES = [
  "queued",
  "planning",
  "ready",
  "running",
  "waiting",
  "blocked",
  "retrying",
  "review_required",
  "done",
  "failed",
  "cancelled",
];

const STEP_STATUSES = ["pending", "ready", "running", "waiting", "blocked", "retrying", "done", "failed", "cancelled"];
const STEP_KINDS = ["agent", "manual", "tool", "review", "wait", "summary"];
const ACTOR_TYPES = ["main-agent", "orchestrator", "supervisor", "task-holder", "executor", "human", "system"];

function isoNow() {
  return new Date().toISOString();
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createTask(input) {
  const now = input.createdAt || isoNow();
  return {
    task_id: input.task_id,
    source: input.source,
    creator: input.creator,
    contract_version: input.contract_version || DEFAULTS.contractVersion,
    goal: input.goal,
    context: input.context,
    context_refs: input.context_refs || [],
    constraints: input.constraints || [],
    done_definition: input.done_definition,
    done_checks: ensureDoneChecks(input),
    priority: input.priority || DEFAULTS.priority,
    risk_level: input.risk_level || DEFAULTS.riskLevel,
    approval_required: input.approval_required ?? DEFAULTS.approvalRequired,
    approval_points: input.approval_points || [],
    review_reason_code: input.review_reason_code,
    status: input.status || "queued",
    current_round: input.current_round || 0,
    created_at: now,
    updated_at: now,
    updated_by: input.updated_by || input.creator,
    heartbeat_at: input.heartbeat_at,
    last_progress_at: input.last_progress_at,
    next_check_at: input.next_check_at,
    blocked_since: input.blocked_since,
    deadline_at: input.deadline_at,
    heartbeat_timeout: input.heartbeat_timeout || DEFAULTS.heartbeatTimeout,
    max_rounds: input.max_rounds ?? DEFAULTS.maxRounds,
    max_retries: input.max_retries ?? DEFAULTS.maxRetries,
    max_wait_duration: input.max_wait_duration || DEFAULTS.maxWaitDuration,
    retry_backoff: input.retry_backoff || DEFAULTS.retryBackoff,
    nudge_limit: input.nudge_limit ?? DEFAULTS.nudgeLimit,
    task_ttl: input.task_ttl || DEFAULTS.taskTtl,
    fanout_limit: input.fanout_limit ?? DEFAULTS.fanoutLimit,
    max_concurrent_subtasks: input.max_concurrent_subtasks,
    max_subagent_sessions: input.max_subagent_sessions,
    retry_budget_remaining: input.retry_budget_remaining ?? (input.max_retries ?? DEFAULTS.maxRetries),
    round_budget_remaining: input.round_budget_remaining ?? (input.max_rounds ?? DEFAULTS.maxRounds),
    pending_review_count: input.pending_review_count || 0,
    active_step_count: input.active_step_count || 0,
    result_summary: input.result_summary,
    terminal_reason: input.terminal_reason,
    blocked_reason: input.blocked_reason,
    review_reason: input.review_reason,
    history_log: input.history_log || [],
    escalation_count: input.escalation_count || 0,
    state_file_path: input.state_file_path,
    events_file_path: input.events_file_path,
    version: input.version || 1,
    steps: input.steps || [],
    reviews: input.reviews || [],
    attempts: input.attempts || [],
  };
}

function createStep(input) {
  return {
    step_id: input.step_id,
    task_id: input.task_id,
    title: input.title,
    kind: input.kind,
    status: input.status || "pending",
    depends_on: input.depends_on || [],
    assignee_type: input.assignee_type,
    assignee_id: input.assignee_id,
    input_refs: input.input_refs || [],
    output_refs: input.output_refs || [],
    retry_count: input.retry_count || 0,
    timeout_sec: input.timeout_sec,
    idempotent: input.idempotent || false,
    risk_level: input.risk_level || DEFAULTS.riskLevel,
    approval_required: input.approval_required || false,
    started_at: input.started_at,
    finished_at: input.finished_at,
    last_error_code: input.last_error_code,
    parent_task_id: input.parent_task_id,
    step_index: input.step_index,
  };
}

function createReviewCheckpoint(input) {
  return {
    review_id: input.review_id,
    task_id: input.task_id,
    step_id: input.step_id,
    approval_point: input.approval_point,
    requested_by: input.requested_by,
    requested_at: input.requested_at || isoNow(),
    review_status: input.review_status || "pending",
    decision: input.decision,
    decision_by: input.decision_by,
    decision_at: input.decision_at,
    decision_note: input.decision_note,
  };
}

function createExecutionAttempt(input) {
  return {
    attempt_id: input.attempt_id,
    task_id: input.task_id,
    step_id: input.step_id,
    attempt_no: input.attempt_no,
    trigger: input.trigger || "initial_dispatch",
    status: input.status || "running",
    actor_type: input.actor_type || "executor",
    actor_id: input.actor_id,
    reason_code: input.reason_code,
    started_at: input.started_at || isoNow(),
    finished_at: input.finished_at,
    output_refs: input.output_refs || [],
    error_code: input.error_code,
    summary: input.summary,
  };
}

function assertTaskStatus(status) {
  if (!TASK_STATUSES.includes(status)) throw new Error(`invalid task status: ${status}`);
}

function assertStepStatus(status) {
  if (!STEP_STATUSES.includes(status)) throw new Error(`invalid step status: ${status}`);
}

function assertStepKind(kind) {
  if (!STEP_KINDS.includes(kind)) throw new Error(`invalid step kind: ${kind}`);
}

function assertActorType(actorType) {
  if (!ACTOR_TYPES.includes(actorType)) throw new Error(`invalid actor type: ${actorType}`);
}

function validateTask(task) {
  for (const field of ["task_id", "source", "creator", "goal", "context", "done_definition", "status", "created_at", "updated_at", "updated_by", "state_file_path", "events_file_path"]) {
    if (!task[field]) throw new Error(`missing task field: ${field}`);
  }
  assertTaskStatus(task.status);
  return task;
}

module.exports = {
  DEFAULTS,
  TASK_STATUSES,
  STEP_STATUSES,
  STEP_KINDS,
  ACTOR_TYPES,
  isoNow,
  deepClone,
  createTask,
  createStep,
  createReviewCheckpoint,
  createExecutionAttempt,
  assertTaskStatus,
  assertStepStatus,
  assertStepKind,
  assertActorType,
  validateTask,
};
