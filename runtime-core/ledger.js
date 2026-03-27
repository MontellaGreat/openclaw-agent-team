"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const { deepClone, validateTask } = require("./types");

function getLedgerPaths(baseDir, taskId) {
  return {
    dir: path.join(baseDir, taskId),
    statePath: path.join(baseDir, taskId, "task_state.json"),
    eventsPath: path.join(baseDir, taskId, "task_events.jsonl"),
  };
}

async function readLastSeq(eventsPath) {
  try {
    const raw = await fs.readFile(eventsPath, "utf8");
    const lines = raw.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    if (!lines.length) return 0;
    const last = JSON.parse(lines[lines.length - 1]);
    return Number.isFinite(last.seq) ? last.seq : 0;
  } catch {
    return 0;
  }
}

async function appendEvent(baseDir, input) {
  const paths = getLedgerPaths(baseDir, input.task_id);
  await fs.mkdir(paths.dir, { recursive: true });
  const seq = (await readLastSeq(paths.eventsPath)) + 1;
  const event = {
    event_id: crypto.randomUUID(),
    task_id: input.task_id,
    step_id: input.step_id,
    event_type: input.event_type,
    from_status: input.from_status,
    to_status: input.to_status,
    actor_type: input.actor_type,
    actor_id: input.actor_id,
    reason_code: input.reason_code,
    payload: input.payload || {},
    created_at: input.created_at || new Date().toISOString(),
    seq,
    correlation_id: input.correlation_id,
  };
  const line = JSON.stringify(event);
  let prefix = "";
  try {
    const raw = await fs.readFile(paths.eventsPath, "utf8");
    prefix = raw.trim() ? `${raw.trim()}\n` : "";
  } catch {
    prefix = "";
  }
  await fs.writeFile(paths.eventsPath, `${prefix}${line}\n`, "utf8");
  return event;
}

async function writeState(baseDir, task) {
  validateTask(task);
  const paths = getLedgerPaths(baseDir, task.task_id);
  await fs.mkdir(paths.dir, { recursive: true });
  const next = deepClone(task);
  next.state_file_path = paths.statePath;
  next.events_file_path = paths.eventsPath;
  await fs.writeFile(paths.statePath, JSON.stringify(next, null, 2), "utf8");
  return next;
}

async function createLedger(baseDir, task) {
  const event = await appendEvent(baseDir, {
    task_id: task.task_id,
    event_type: "TaskCreated",
    actor_type: "system",
    actor_id: task.creator,
    to_status: task.status,
    reason_code: "task_created",
    payload: { goal: task.goal, priority: task.priority, risk_level: task.risk_level },
  });
  const nextTask = {
    ...task,
    updated_at: event.created_at,
    last_progress_at: event.created_at,
    version: (task.version || 1),
    history_log: [...(task.history_log || []), `TaskCreated#${event.seq}`],
  };
  return { task: await writeState(baseDir, nextTask), event };
}

module.exports = {
  getLedgerPaths,
  appendEvent,
  writeState,
  createLedger,
};
