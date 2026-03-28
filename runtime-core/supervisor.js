"use strict";

const { transitionTask } = require("./state-machine");
const { writeState } = require("./ledger");
const { parseDurationMs, withScheduledNextCheck, isDue } = require("./schedule");

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

function evaluateSupervisorRules(task, input = {}) {
  const now = input.now || new Date().toISOString();
  const actorId = input.actor_id || "supervisor";
  const matches = [];

  if (task.status === "blocked" && isExpired(task.blocked_since, task.max_wait_duration, now)) {
    matches.push({
      rule_name: "blocked_timeout",
      priority: 100,
      transition: {
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
      },
    });
  }

  if (task.status === "running" && isExpired(task.heartbeat_at || task.last_progress_at, task.heartbeat_timeout, now)) {
    matches.push({
      rule_name: "heartbeat_timeout",
      priority: 90,
      transition: {
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
      },
    });
  }

  if (task.status === "waiting" && isExpired(task.last_progress_at || task.updated_at || task.created_at, task.max_wait_duration, now)) {
    matches.push({
      rule_name: "waiting_timeout",
      priority: 80,
      transition: {
        to_status: "blocked",
        event_type: "WaitingTimedOutToBlocked",
        actor_type: "supervisor",
        actor_id: actorId,
        reason_code: "waiting_timeout",
        payload: {
          last_progress_at: task.last_progress_at,
          max_wait_duration: task.max_wait_duration,
          supervisor_rule: "waiting_timeout",
        },
      },
    });
  }

  if (task.status === "retrying" && isDue(task.next_check_at, now)) {
    matches.push({
      rule_name: "retry_due",
      priority: 70,
      transition: {
        to_status: "running",
        event_type: "RetryDispatched",
        actor_type: "supervisor",
        actor_id: actorId,
        reason_code: "retry_backoff_elapsed",
        payload: {
          next_check_at: task.next_check_at,
          retry_backoff: task.retry_backoff,
          supervisor_rule: "retry_due",
        },
      },
    });
  }

  matches.sort((a, b) => b.priority - a.priority);
  return {
    matched_rules: matches.map((item) => item.rule_name),
    selected_rule: matches[0] || null,
  };
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
  const evaluation = evaluateSupervisorRules(scheduledTask, { now, actor_id: actorId });

  if (evaluation.selected_rule) {
    const selected = evaluation.selected_rule;
    const outcome = await transitionTask(baseDir, scheduledTask, {
      ...selected.transition,
      payload: {
        ...(selected.transition.payload || {}),
        matched_rules: evaluation.matched_rules,
        selected_rule: selected.rule_name,
      },
    });
    outcome.task = withScheduledNextCheck(outcome.task);
    outcome.task = await writeState(baseDir, outcome.task);
    outcome.matched_rules = evaluation.matched_rules;
    outcome.selected_rule = selected.rule_name;
    return outcome;
  }

  if (scheduledTask.next_check_at !== task.next_check_at) {
    const persisted = await persistTask(baseDir, {
      ...scheduledTask,
      updated_at: task.updated_at,
      updated_by: task.updated_by,
      version: (task.version || 1) + 1,
    }, actorId, `NextCheckScheduled@${now}`);
    return { task: persisted, skipped: true, reason: "next_check_scheduled", matched_rules: evaluation.matched_rules };
  }

  return { task: scheduledTask, skipped: true, reason: "no_supervisor_rule_triggered", matched_rules: evaluation.matched_rules };
}

module.exports = {
  parseDurationMs,
  isExpired,
  evaluateSupervisorRules,
  recordHeartbeat,
  supervisorTick,
};
