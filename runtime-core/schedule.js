"use strict";

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

function parseRetryBackoffMs(input) {
  if (!input) return 0;
  const value = String(input).trim();
  const simple = value.match(/^exponential\(base=(\d+(?:ms|s|m|h|d)),\s*cap=(\d+(?:ms|s|m|h|d))\)$/);
  if (!simple) return parseDurationMs(value);
  const baseMs = parseDurationMs(simple[1]);
  const capMs = parseDurationMs(simple[2]);
  return Math.min(baseMs, capMs);
}

function addMs(isoTime, ms) {
  if (!isoTime || !ms) return undefined;
  return new Date(new Date(isoTime).getTime() + ms).toISOString();
}

function getRunningBase(task) {
  return task.heartbeat_at || task.last_progress_at || task.created_at;
}

function getWaitingBase(task) {
  return task.last_progress_at || task.created_at;
}

function computeNextCheckAt(task) {
  if (!task || !task.status) return undefined;

  if (["done", "failed", "cancelled", "review_required", "queued", "planning", "ready"].includes(task.status)) {
    return undefined;
  }

  if (task.status === "running") {
    return addMs(getRunningBase(task), parseDurationMs(task.heartbeat_timeout));
  }

  if (task.status === "waiting") {
    return addMs(getWaitingBase(task), parseDurationMs(task.max_wait_duration));
  }

  if (task.status === "blocked") {
    return addMs(task.blocked_since || getWaitingBase(task), parseDurationMs(task.max_wait_duration));
  }

  if (task.status === "retrying") {
    return addMs(task.last_progress_at || task.updated_at || task.created_at, parseRetryBackoffMs(task.retry_backoff));
  }

  return undefined;
}

function isDue(nextCheckAt, nowIso) {
  if (!nextCheckAt) return true;
  return new Date(nextCheckAt).getTime() <= new Date(nowIso).getTime();
}

function withScheduledNextCheck(task) {
  const nextCheckAt = computeNextCheckAt(task);
  if (nextCheckAt === task.next_check_at) return task;
  return {
    ...task,
    next_check_at: nextCheckAt,
  };
}

module.exports = {
  parseDurationMs,
  parseRetryBackoffMs,
  computeNextCheckAt,
  isDue,
  withScheduledNextCheck,
};
