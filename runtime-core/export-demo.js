"use strict";

const path = require("node:path");
const fs = require("node:fs/promises");
const { buildHandoff, buildArchive, buildRecap } = require("./exports");

async function exportFromState(statePath) {
  const raw = await fs.readFile(statePath, "utf8");
  const task = JSON.parse(raw);
  return {
    handoff: buildHandoff(task),
    archive: buildArchive(task),
    recap: buildRecap(task),
  };
}

if (require.main === module) {
  const statePath = process.argv[2] || path.join(process.cwd(), "runtime", "task-ledger-blocked", "task-20260327-blocked-escalation-demo", "task_state.json");
  exportFromState(statePath)
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}

module.exports = { exportFromState };
