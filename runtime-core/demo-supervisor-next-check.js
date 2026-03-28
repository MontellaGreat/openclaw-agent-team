"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const { bootstrapTask } = require("./index");
const { createStep } = require("./types");
const { transitionTask } = require("./state-machine");
const { pollRuntimeDir } = require("./supervisor-poll");

async function readState(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function demoSupervisorNextCheck(runtimeDir) {
  const taskId = `task-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-next-check-demo`;
  const taskRoot = path.join(runtimeDir, taskId);
  const { task: created } = await bootstrapTask(runtimeDir, {
    task_id: taskId,
    source: "main-agent",
    creator: "main",
    goal: "验证 next_check_at 调度与轮询跳过逻辑",
    context: "由 runtime-core next-check demo 自动生成",
    heartbeat_timeout: "30m",
    done_definition: [
      "next_check_at 会在 running 状态被计算",
      "未到 next_check_at 时轮询会跳过",
      "到达 next_check_at 后轮询会触发升级",
    ],
    steps: [
      createStep({ step_id: `${taskId}-s1`, task_id: taskId, title: "调度验证", kind: "agent", status: "ready", assignee_type: "main-agent", assignee_id: "main" }),
    ],
  });

  let currentTask = created;
  ({ task: currentTask } = await transitionTask(runtimeDir, currentTask, {
    to_status: "planning",
    event_type: "TaskAccepted",
    actor_type: "orchestrator",
    actor_id: "orchestrator",
    reason_code: "task_accepted",
  }));
  ({ task: currentTask } = await transitionTask(runtimeDir, currentTask, {
    to_status: "ready",
    event_type: "PlanReady",
    actor_type: "orchestrator",
    actor_id: "orchestrator",
    reason_code: "plan_ready",
  }));
  ({ task: currentTask } = await transitionTask(runtimeDir, currentTask, {
    to_status: "running",
    event_type: "TaskStarted",
    actor_type: "executor",
    actor_id: "executor-demo",
    reason_code: "task_started",
  }));

  const firstPoll = await pollRuntimeDir(runtimeDir, { now: new Date().toISOString(), actor_id: "supervisor" });
  const afterFirstPoll = await readState(path.join(taskRoot, "task_state.json"));
  if (!afterFirstPoll.next_check_at) throw new Error("next_check_at not scheduled");

  const nextCheckMs = new Date(afterFirstPoll.next_check_at).getTime();
  const beforeDueIso = new Date(nextCheckMs - 60_000).toISOString();
  const dueIso = new Date(nextCheckMs + 60_000).toISOString();

  const beforeDuePoll = await pollRuntimeDir(runtimeDir, { now: beforeDueIso, actor_id: "supervisor" });
  const duePoll = await pollRuntimeDir(runtimeDir, { now: dueIso, actor_id: "supervisor" });
  const finalTask = await readState(path.join(taskRoot, "task_state.json"));

  return {
    taskId,
    statePath: path.join(taskRoot, "task_state.json"),
    firstPoll,
    nextCheckAt: afterFirstPoll.next_check_at,
    beforeDuePoll,
    duePoll,
    finalStatus: finalTask.status,
    finalNextCheckAt: finalTask.next_check_at || null,
  };
}

module.exports = {
  demoSupervisorNextCheck,
};

if (require.main === module) {
  const runtimeDir = process.argv[2] || path.join(process.cwd(), "runtime", "task-ledger-next-check-demo");
  demoSupervisorNextCheck(runtimeDir)
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
