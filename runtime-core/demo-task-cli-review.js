"use strict";

const path = require("node:path");
const {
  createTaskCommand,
  requestReviewCommand,
  approveTaskCommand,
  rejectTaskCommand,
  showTaskCommand,
} = require("./task-cli");

async function demoTaskCliReview(runtimeDir) {
  const reviewTask = await createTaskCommand(runtimeDir, {
    goal: "验证 shell 审批入口 approve",
    context: "由 task-cli review demo 自动生成",
    source: "shell",
    creator: "human",
  });
  const requested = await requestReviewCommand(runtimeDir, reviewTask.task_id, "need human review");
  const approved = await approveTaskCommand(runtimeDir, reviewTask.task_id, "approved by shell");
  const approvedState = await showTaskCommand(runtimeDir, reviewTask.task_id);

  const rejectTask = await createTaskCommand(runtimeDir, {
    goal: "验证 shell 审批入口 reject",
    context: "由 task-cli review demo 自动生成",
    source: "shell",
    creator: "human",
  });
  const requestedReject = await requestReviewCommand(runtimeDir, rejectTask.task_id, "need human review");
  const rejected = await rejectTaskCommand(runtimeDir, rejectTask.task_id, "rejected by shell");
  const rejectedState = await showTaskCommand(runtimeDir, rejectTask.task_id);

  return {
    approve_flow: {
      created: reviewTask,
      requested,
      approved,
      final: approvedState,
    },
    reject_flow: {
      created: rejectTask,
      requested: requestedReject,
      rejected,
      final: rejectedState,
    },
  };
}

module.exports = {
  demoTaskCliReview,
};

if (require.main === module) {
  const runtimeDir = process.argv[2] || path.join(process.cwd(), "runtime", "task-ledger-cli-review-demo");
  demoTaskCliReview(runtimeDir)
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
