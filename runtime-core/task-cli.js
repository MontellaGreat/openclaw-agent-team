"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const { bootstrapTask } = require("./index");
const { transitionTask } = require("./state-machine");
const { summarizeDoneChecks } = require("./done-checks");
const { findTaskStateFiles } = require("./supervisor-poll");

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith("--")) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        flags[key] = true;
      } else {
        flags[key] = next;
        i += 1;
      }
      continue;
    }
    positional.push(token);
  }
  return { positional, flags };
}

function makeTaskId(goal) {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const slug = String(goal)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24) || "task";
  return `task-${stamp}-${slug}`;
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function readEvents(eventsPath, limit = 20) {
  try {
    const raw = await fs.readFile(eventsPath, "utf8");
    const lines = raw.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    return lines.slice(-limit).map((line) => JSON.parse(line));
  } catch {
    return [];
  }
}

async function loadTask(runtimeDir, taskId) {
  const statePath = path.join(runtimeDir, taskId, "task_state.json");
  return readJson(statePath);
}

async function createTaskCommand(runtimeDir, options) {
  if (!options.goal) throw new Error("goal is required");
  const taskId = options.task_id || makeTaskId(options.goal);
  const { task } = await bootstrapTask(runtimeDir, {
    task_id: taskId,
    source: options.source || "shell",
    creator: options.creator || "human",
    goal: options.goal,
    context: options.context || "created from shell task cli",
    priority: options.priority || "normal",
    risk_level: options.risk_level || "medium",
    done_definition: options.done_definition || ["任务完成并留有可核查账本"],
  });
  return {
    task_id: task.task_id,
    status: task.status,
    priority: task.priority,
    risk_level: task.risk_level,
    state_path: task.state_file_path,
    events_path: task.events_file_path,
  };
}

async function listTasksCommand(runtimeDir, options = {}) {
  const files = await findTaskStateFiles(runtimeDir);
  const items = [];
  for (const statePath of files) {
    const task = await readJson(statePath).catch(() => null);
    if (!task) continue;
    if (options.status && task.status !== options.status) continue;
    if (options.source && task.source !== options.source) continue;
    if (options.assignee && !String(task.steps || []).includes(options.assignee)) continue;
    items.push({
      task_id: task.task_id,
      goal: task.goal,
      status: task.status,
      priority: task.priority,
      risk_level: task.risk_level,
      updated_at: task.updated_at,
      next_check_at: task.next_check_at || null,
    });
  }
  items.sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)));
  return items;
}

async function showTaskCommand(runtimeDir, taskId) {
  const task = await loadTask(runtimeDir, taskId);
  const events = await readEvents(task.events_file_path, 10);
  return {
    task_id: task.task_id,
    goal: task.goal,
    source: task.source,
    creator: task.creator,
    status: task.status,
    priority: task.priority,
    risk_level: task.risk_level,
    current_round: task.current_round,
    next_check_at: task.next_check_at || null,
    blocked_reason: task.blocked_reason || null,
    pending_review_count: task.pending_review_count || 0,
    done_check_summary: summarizeDoneChecks(task),
    done_checks: task.done_checks,
    reviews: task.reviews,
    attempts: task.attempts,
    recent_events: events,
  };
}

async function cancelTaskCommand(runtimeDir, taskId, reason) {
  const task = await loadTask(runtimeDir, taskId);
  if (["done", "failed", "cancelled"].includes(task.status)) {
    throw new Error(`cannot cancel task in status: ${task.status}`);
  }
  const outcome = await transitionTask(runtimeDir, task, {
    to_status: "cancelled",
    event_type: "TaskCancelled",
    actor_type: "human",
    actor_id: "shell-user",
    reason_code: reason || "cancel_requested",
    payload: { requested_via: "shell", reason: reason || null },
  });
  return {
    task_id: outcome.task.task_id,
    status_before: task.status,
    status_after: outcome.task.status,
    reason: reason || "cancel_requested",
    event_type: outcome.event.event_type,
  };
}

async function retryTaskCommand(runtimeDir, taskId, reason) {
  const task = await loadTask(runtimeDir, taskId);
  let toStatus;
  let eventType;
  if (["failed", "blocked"].includes(task.status)) {
    toStatus = "retrying";
    eventType = "RetryApproved";
  } else if (task.status === "review_required") {
    toStatus = "ready";
    eventType = "ReviewApproved";
  } else {
    throw new Error(`cannot retry task in status: ${task.status}`);
  }

  const outcome = await transitionTask(runtimeDir, task, {
    to_status: toStatus,
    event_type: eventType,
    actor_type: "human",
    actor_id: "shell-user",
    reason_code: reason || "retry_requested",
    payload: { requested_via: "shell", reason: reason || null },
  });
  return {
    task_id: outcome.task.task_id,
    status_before: task.status,
    status_after: outcome.task.status,
    reason: reason || "retry_requested",
    event_type: outcome.event.event_type,
  };
}

async function main() {
  const runtimeDir = process.env.RUNTIME_DIR || path.join(process.cwd(), "runtime", "task-ledger-cli");
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const command = positional[0];

  if (!command) {
    throw new Error("usage: node runtime-core/task-cli.js <create|list|show|cancel|retry> ...");
  }

  if (command === "create") {
    const goal = positional.slice(1).join(" ") || flags.goal;
    const result = await createTaskCommand(runtimeDir, {
      goal,
      context: flags.context,
      priority: flags.priority,
      risk_level: flags["risk-level"] || flags.risk_level,
      source: flags.source,
      creator: flags.creator,
    });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (command === "list") {
    const result = await listTasksCommand(runtimeDir, {
      status: flags.status,
      source: flags.source,
      assignee: flags.assignee,
    });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (command === "show") {
    const taskId = positional[1];
    if (!taskId) throw new Error("task_id is required");
    console.log(JSON.stringify(await showTaskCommand(runtimeDir, taskId), null, 2));
    return;
  }

  if (command === "cancel") {
    const taskId = positional[1];
    if (!taskId) throw new Error("task_id is required");
    console.log(JSON.stringify(await cancelTaskCommand(runtimeDir, taskId, flags.reason), null, 2));
    return;
  }

  if (command === "retry") {
    const taskId = positional[1];
    if (!taskId) throw new Error("task_id is required");
    console.log(JSON.stringify(await retryTaskCommand(runtimeDir, taskId, flags.reason), null, 2));
    return;
  }

  throw new Error(`unknown command: ${command}`);
}

module.exports = {
  createTaskCommand,
  listTasksCommand,
  showTaskCommand,
  cancelTaskCommand,
  retryTaskCommand,
};

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
