"use strict";

const path = require("node:path");
const fs = require("node:fs/promises");
const { exportFromState } = require("./export-demo");
const { renderHandoffMarkdown, renderRecapMarkdown, renderArchiveMarkdown } = require("./renderers");

async function renderFromState(statePath, outDir) {
  const exported = await exportFromState(statePath);
  const handoffDir = path.join(outDir, 'handoff');
  const recapDir = path.join(outDir, 'recap');
  const archiveDir = path.join(outDir, 'archive');
  await fs.mkdir(handoffDir, { recursive: true });
  await fs.mkdir(recapDir, { recursive: true });
  await fs.mkdir(archiveDir, { recursive: true });
  const handoffPath = path.join(handoffDir, 'runtime-handoff.generated.md');
  const recapPath = path.join(recapDir, 'chengshu-phase-summary.generated.md');
  const archivePath = path.join(archiveDir, 'runtime-archive.generated.md');
  await fs.writeFile(handoffPath, renderHandoffMarkdown(exported.handoff), 'utf8');
  await fs.writeFile(recapPath, renderRecapMarkdown(exported.recap), 'utf8');
  await fs.writeFile(archivePath, renderArchiveMarkdown(exported.archive), 'utf8');
  return { handoffPath, recapPath, archivePath, exported };
}

if (require.main === module) {
  const statePath = process.argv[2] || path.join(process.cwd(), 'runtime', 'task-ledger-blocked', 'task-20260327-blocked-escalation-demo', 'task_state.json');
  const outDir = process.argv[3] || path.join(process.cwd(), 'runtime', 'generated');
  renderFromState(statePath, outDir)
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}

module.exports = { renderFromState };
