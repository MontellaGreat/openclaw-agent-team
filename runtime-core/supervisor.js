"use strict";

const { transitionTask } = require("./state-machine");
const { writeState } = require("./ledger");
const { parseDurationMs, withScheduledNextCheck } = require("./schedule");

function isExpired(isoTime, duration, nowIso) {
  if (!isoTime || !duration) return false;
  const start = new Date(isoTime).getTime();
  const now = new Date(nowIso).getTime();
  return now - start >= parseDurationMs(duration);
}

async function persistTask(baseDir, task, actorId, marker) {
  const now = new Date().toISOString();
  const next = withScheduledNextCheck({
    ...task,
    updated_at: task.updated_at || now,
    updated_by: task.updated_by || actorId,
    version: task.version || 1,
    history_log: marker ? [...(task.history_log || []), marker] : (task.history_log || []),
  });
  return writeState(baseDir, next);
}

async function recordHeartbeat(baseDir, task, input = {}) {
  const at = input.at || new Date().toISOString();
  const next = {
    ...task,
    heartbeat_at: at,
    updated_at: at,
    updated_by: input.actor_id || "supervisor",
    version: (task.version || 1) + 1,
    history_log: [...(task.history_log || []), `HeartbeatRecorded@${at}`],
  };
  return persistTask(baseDir, next, input.actor_id || "supervisor");
}

async function supervisorTick(baseDir, task, input = {}) {
  const now = input.now || new Date().toISOString();
  const actorId = input.actor_id || "supervisor";
  const scheduledTask = withScheduledNextCheck(task);

  if (task.status === "blocked" && isExpired(task.blocked_since, task.max_wait_duration, now)) {
    const outcome = await transitionTask(baseDir, scheduledTask, {
      to_status: "review_required",
      event_type: "BlockedEscalatedToReview",
      actor_type: "supervisor",
      actor_id: actorId,
      reason_code: "blocked_timeout",
      payload: {
        blocked_since: task.blocked_since,
        max_wait_duration: task.max_wait_duration,
        supervisor_rule: "blocked_timeout",
      },
    });
    outcome.task = withScheduledNextCheck(outcome.task);
    outcome.task = await writeState(baseDir, outcome.task);
    return outcome;
  }

  if (task.status === "running" && isExpired(task.heartbeat_at || task.last_progress_at, task.heartbeat_timeout, now)) {
    const outcome = await transitionTask(baseDir, scheduledTask, {
      to_status: "review_required",
      event_type: "HeartbeatMissedEscalatedToReview",
      actor_type: "supervisor",
      actor_id: actorId,
      reason_code: "heartbeat_timeout",
      payload: {
        heartbeat_at: task.heartbeat_at,
        last_progress_at: task.last_progress_at,
        heartbeat_timeout: task.heartbeat_timeout,
        supervisor_rule: "heartbeat_timeout",
      },
    });
    outcome.task = withScheduledNextCheck(outcome.task);
    outcome.task = await writeState(baseDir, outcome.task);
    return outcome;
  }

  if (scheduledTask.next_check_at !== task.next_check_at) {
    const persisted = await persistTask(baseDir, {
      ...scheduledTask,
      updated_at: task.updated_at,
      updated_by: task.updated_by,
      version: (task.version || 1) + 1,
    }, actorId, `NextCheckScheduled@${now}`);
    return { task: persisted, skipped: true, reason: "next_check_scheduled" };
  }

  return { task: scheduledTask, skipped: true, reason: "no_supervisor_rule_triggered" };
}

module.exports = {
  parseDurationMs,
  isExpired,
  recordHeartbeat,
  supervisorTick,
};
