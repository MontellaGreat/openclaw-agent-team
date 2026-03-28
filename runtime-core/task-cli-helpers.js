"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");

async function loadTask(runtimeDir, taskId) {
  const statePath = path.join(runtimeDir, taskId, "task_state.json");
  const raw = await fs.readFile(statePath, "utf8");
  return JSON.parse(raw);
}

module.exports = {
  loadTask,
};
