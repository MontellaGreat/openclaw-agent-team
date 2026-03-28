"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const { supervisorTick } = require("./supervisor");
const { summarizeDoneChecks } = require("./done-checks");
const { isDue } = require("./schedule");

async function findTaskStateFiles(runtimeDir) {
  const entries = await fs.readdir(runtimeDir, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(runtimeDir, entry.name, "task_state.json"));
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function pollRuntimeDir(runtimeDir, input = {}) {
  const now = input.now || new Date().toISOString();
  const actorId = input.actor_id || "supervisor";
  const files = await findTaskStateFiles(runtimeDir);
  const results = [];

  for (const statePath of files) {
    try {
      const task = await readJson(statePath);
      const due = isDue(task.next_check_at, now);
      if (!due) {
        results.push({
          task_id: task.task_id,
          state_path: statePath,
          status_before: task.status,
          status_after: task.status,
          skipped: true,
          reason: "next_check_not_due",
          event_type: null,
          next_check_at: task.next_check_at || null,
          done_check_summary: summarizeDoneChecks(task),
        });
        continue;
      }

      const outcome = await supervisorTick(runtimeDir, task, { now, actor_id: actorId });
      results.push({
        task_id: task.task_id,
        state_path: statePath,
        status_before: task.status,
        status_after: outcome.task.status,
        skipped: Boolean(outcome.skipped),
        reason: outcome.reason || outcome.event?.reason_code || null,
        event_type: outcome.event?.event_type || null,
        next_check_at: outcome.task.next_check_at || null,
        done_check_summary: summarizeDoneChecks(outcome.task),
      });
    } catch (error) {
      results.push({
        task_id: path.basename(path.dirname(statePath)),
        state_path: statePath,
        error: error.message,
      });
    }
  }

  return {
    runtime_dir: runtimeDir,
    scanned: files.length,
    upgraded: results.filter((item) => item.status_before && item.status_before !== item.status_after).length,
    skipped: results.filter((item) => item.skipped).length,
    failed: results.filter((item) => item.error).length,
    results,
  };
}

module.exports = {
  findTaskStateFiles,
  pollRuntimeDir,
};

if (require.main === module) {
  const runtimeDir = process.argv[2] || path.join(process.cwd(), "runtime", "task-ledger-supervisor");
  const now = process.argv[3] || new Date().toISOString();
  pollRuntimeDir(runtimeDir, { now, actor_id: "supervisor" })
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
