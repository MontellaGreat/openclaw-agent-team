"use strict";

const { transitionTask } = require("./state-machine");
const { writeState } = require("./ledger");

function parseDurationMs(input) {
  if (!input) return 0;
  const value = String(input).trim();
  const match = value.match(/^(\d+)(ms|s|m|h|d)$/);
  if (!match) throw new Error(`unsupported duration: ${input}`);
  const n = Number(match[1]);
  const unit = match[2];
  const map = { ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return n * map[unit];
}

function isExpired(isoTime, duration, nowIso) {
  if (!isoTime || !duration) return false;
  const start = new Date(isoTime).getTime();
  const now = new Date(nowIso).getTime();
  return now - start >= parseDurationMs(duration);
}

async function recordHeartbeat(baseDir, task, input = {}) {
  const next = {
    ...task,
    heartbeat_at: input.at || new Date().toISOString(),
    updated_at: input.at || new Date().toISOString(),
    updated_by: input.actor_id || 'supervisor',
    version: (task.version || 1) + 1,
    history_log: [...(task.history_log || []), `HeartbeatRecorded@${input.at || new Date().toISOString()}`],
  };
  return writeState(baseDir, next);
}

async function supervisorTick(baseDir, task, input = {}) {
  const now = input.now || new Date().toISOString();
  if (task.status === 'blocked' && isExpired(task.blocked_since, task.max_wait_duration, now)) {
    return transitionTask(baseDir, task, {
      to_status: 'review_required',
      event_type: 'BlockedEscalatedToReview',
      actor_type: 'supervisor',
      actor_id: input.actor_id || 'supervisor',
      reason_code: 'blocked_timeout',
      payload: { blocked_since: task.blocked_since, max_wait_duration: task.max_wait_duration, supervisor_rule: 'blocked_timeout' },
    });
  }

  if (task.status === 'running' && isExpired(task.heartbeat_at || task.last_progress_at, task.heartbeat_timeout, now)) {
    return transitionTask(baseDir, task, {
      to_status: 'review_required',
      event_type: 'HeartbeatMissedEscalatedToReview',
      actor_type: 'supervisor',
      actor_id: input.actor_id || 'supervisor',
      reason_code: 'heartbeat_timeout',
      payload: {
        heartbeat_at: task.heartbeat_at,
        last_progress_at: task.last_progress_at,
        heartbeat_timeout: task.heartbeat_timeout,
        supervisor_rule: 'heartbeat_timeout',
      },
    });
  }

  return { task, skipped: true, reason: 'no_supervisor_rule_triggered' };
}

module.exports = {
  parseDurationMs,
  isExpired,
  recordHeartbeat,
  supervisorTick,
};
