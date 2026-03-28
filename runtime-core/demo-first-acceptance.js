"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const {
  createTaskCommand,
  requestReviewCommand,
  approveTaskCommand,
  retryTaskCommand,
  showTaskCommand,
} = require("./task-cli");
const { loadTask } = require("./task-cli-helpers");
const { transitionTask } = require("./state-machine");
const { persistDoneCheckUpdate, summarizeDoneChecks } = require("./done-checks");
const { renderFromState } = require("./render-demo");
const { exportFromState } = require("./export-demo");

async function assertFileContains(filePath, includes) {
  const text = await fs.readFile(filePath, "utf8");
  for (const token of includes) {
    if (!text.includes(token)) {
      throw new Error(`expected ${path.basename(filePath)} to include: ${token}`);
    }
  }
  return text;
}

async function demoFirstAcceptance(runtimeDir) {
  const created = await createTaskCommand(runtimeDir, {
    goal: "首次验收样例：单文件规则修订与关联文档更新",
    context: "目标是验证 shell + runtime + supervisor + 导出文档的最小验收链",
    source: "acceptance-demo",
    creator: "human",
    priority: "high",
    risk_level: "medium",
    done_definition: [
      "task_state.json 成功落盘",
      "验收样例交接与归档文稿成功生成",
      "主链经过 review blocked retry 并最终进入 done",
    ],
  });

  const taskId = created.task_id;
  let task = await loadTask(runtimeDir, taskId);

  task = await persistDoneCheckUpdate(runtimeDir, task, {
    description_includes: "task_state.json",
    status: "passed",
    verified_by: "system",
    evidence_kind: "file",
    evidence_ref: created.state_path,
    note: "state file exists",
  });

  ({ task } = await transitionTask(runtimeDir, task, {
    to_status: "planning",
    event_type: "TaskAccepted",
    actor_type: "orchestrator",
    actor_id: "orchestrator",
    reason_code: "task_accepted",
  }));
  ({ task } = await transitionTask(runtimeDir, task, {
    to_status: "ready",
    event_type: "PlanReady",
    actor_type: "orchestrator",
    actor_id: "orchestrator",
    reason_code: "plan_ready",
  }));
  ({ task } = await transitionTask(runtimeDir, task, {
    to_status: "running",
    event_type: "TaskStarted",
    actor_type: "executor",
    actor_id: "executor-demo",
    reason_code: "task_started",
  }));

  const reviewRequested = await requestReviewCommand(runtimeDir, taskId, "high risk change needs approval");
  const reviewApproved = await approveTaskCommand(runtimeDir, taskId, "approved for acceptance demo");

  task = await loadTask(runtimeDir, taskId);
  ({ task } = await transitionTask(runtimeDir, task, {
    to_status: "running",
    event_type: "TaskStarted",
    actor_type: "executor",
    actor_id: "executor-demo",
    reason_code: "post_review_restart",
  }));
  ({ task } = await transitionTask(runtimeDir, task, {
    to_status: "blocked",
    event_type: "BlockedDetected",
    actor_type: "supervisor",
    actor_id: "supervisor",
    reason_code: "dependency_missing",
  }));

  const retried = await retryTaskCommand(runtimeDir, taskId, "manual_retry_for_acceptance_demo");

  task = await loadTask(runtimeDir, taskId);
  ({ task } = await transitionTask(runtimeDir, task, {
    to_status: "running",
    event_type: "TaskStarted",
    actor_type: "executor",
    actor_id: "executor-demo",
    reason_code: "retry_dispatch",
  }));

  task = await persistDoneCheckUpdate(runtimeDir, task, {
    description_includes: "交接与归档文稿成功生成",
    status: "passed",
    verified_by: "system",
    evidence_kind: "event",
    evidence_ref: "acceptance-docs-ready",
    note: "docs generation step completed",
  });

  task = await loadTask(runtimeDir, taskId);
  task = await persistDoneCheckUpdate(runtimeDir, task, {
    description_includes: "主链经过 review blocked retry 并最终进入 done",
    status: "passed",
    verified_by: "system",
    evidence_kind: "event",
    evidence_ref: "acceptance-flow-validated",
    note: "review + blocked + retry chain observed",
  });

  ({ task } = await transitionTask(runtimeDir, task, {
    to_status: "done",
    event_type: "TaskCompleted",
    actor_type: "main-agent",
    actor_id: "main",
    reason_code: "acceptance_demo_complete",
  }));

  const outDir = path.join(runtimeDir, taskId, "acceptance-generated");
  const rendered = await renderFromState(created.state_path, outDir);

  const exported = await exportFromState(created.state_path);
  const handoffText = await assertFileContains(rendered.handoffPath, ["当前任务状态：done", "风险变化：stable"]);
  const archiveText = await assertFileContains(rendered.archivePath, [taskId, "验收结果：pass", "最终状态：done"]);
  const recapText = await assertFileContains(rendered.recapPath, ["当前状态：done", "验收结果：pass"]);

  const finalShown = await showTaskCommand(runtimeDir, taskId);
  const finalSummary = summarizeDoneChecks(task);
  if (finalShown.status !== "done") throw new Error("final task is not done");
  if (finalSummary.pending > 0 || finalSummary.failed > 0 || finalSummary.unresolved > 0) {
    throw new Error(`done checks not clean: ${JSON.stringify(finalSummary)}`);
  }

  return {
    task_id: taskId,
    created,
    reviewRequested,
    reviewApproved,
    retried,
    final_status: finalShown.status,
    done_check_summary: finalSummary,
    exports: exported,
    rendered_paths: {
      handoff: rendered.handoffPath,
      recap: rendered.recapPath,
      archive: rendered.archivePath,
    },
    recap_preview: recapText.slice(0, 240),
    archive_preview: archiveText.slice(0, 240),
    handoff_preview: handoffText.slice(0, 240),
  };
}

module.exports = {
  demoFirstAcceptance,
};

if (require.main === module) {
  const runtimeDir = process.argv[2] || path.join(process.cwd(), "runtime", "task-ledger-first-acceptance-demo");
  demoFirstAcceptance(runtimeDir)
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
