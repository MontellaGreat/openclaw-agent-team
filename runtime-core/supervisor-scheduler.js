"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const { findTaskStateFiles, pollTaskStateFiles } = require("./supervisor-poll");

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function scheduleSupervisor(runtimeDir, input = {}) {
  const now = input.now || new Date().toISOString();
  const actorId = input.actor_id || "supervisor";
  const limit = input.limit || 10;
  const files = await findTaskStateFiles(runtimeDir);
  const tasks = [];

  for (const statePath of files) {
    try {
      const task = await readJson(statePath);
      tasks.push({
        task_id: task.task_id,
        state_path: statePath,
        status: task.status,
        next_check_at: task.next_check_at || null,
      });
    } catch {
      // ignore broken states here; selected execution will surface them later if needed
    }
  }

  const dueTasks = tasks
    .filter((task) => !task.next_check_at || new Date(task.next_check_at).getTime() <= new Date(now).getTime())
    .sort((a, b) => {
      const aTime = a.next_check_at ? new Date(a.next_check_at).getTime() : 0;
      const bTime = b.next_check_at ? new Date(b.next_check_at).getTime() : 0;
      return aTime - bTime;
    });

  const scheduledTasks = tasks
    .filter((task) => task.next_check_at && new Date(task.next_check_at).getTime() > new Date(now).getTime())
    .sort((a, b) => new Date(a.next_check_at).getTime() - new Date(b.next_check_at).getTime());

  const next_batch = dueTasks.slice(0, limit);
  const selectedPaths = next_batch.map((item) => item.state_path);
  const pollResult = await pollTaskStateFiles(selectedPaths, { now, actor_id: actorId });

  return {
    runtime_dir: runtimeDir,
    now,
    due_count: dueTasks.length,
    scheduled_count: scheduledTasks.length,
    next_wake_at: scheduledTasks[0]?.next_check_at || null,
    next_batch,
    executed: pollResult.results,
    skipped_out_of_batch: tasks.filter((item) => !next_batch.some((picked) => picked.task_id === item.task_id)),
  };
}

module.exports = {
  scheduleSupervisor,
};

if (require.main === module) {
  const runtimeDir = process.argv[2] || path.join(process.cwd(), "runtime", "task-ledger-supervisor");
  const now = process.argv[3] || new Date().toISOString();
  const limit = Number(process.argv[4] || 10);
  scheduleSupervisor(runtimeDir, { now, actor_id: "supervisor", limit })
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
