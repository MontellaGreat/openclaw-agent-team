"use strict";

const path = require("node:path");
const { bootstrapTask } = require("./index");
const { createStep } = require("./types");
const { recordExecutionAttempt } = require("./governance");
const { transitionTask } = require("./state-machine");
const { pollRuntimeDir } = require("./supervisor-poll");

async function preparePollUpgradeDemo(runtimeDir) {
  const blockedTaskId = `task-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-poll-blocked-upgrade-demo`;
  const { task: blockedCreated } = await bootstrapTask(runtimeDir, {
    task_id: blockedTaskId,
    source: 'main-agent',
    creator: 'main',
    goal: '验证 supervisor-poll 对 blocked 超时任务执行批量升级',
    context: 'poll upgrade blocked demo',
    max_wait_duration: '1m',
    done_definition: ['主链状态迁移成立'],
    steps: [createStep({ step_id: `${blockedTaskId}-s1`, task_id: blockedTaskId, title: 'poll blocked', kind: 'agent', status: 'ready', assignee_type: 'main-agent', assignee_id: 'main' })],
  });

  let blockedTask = blockedCreated;
  ({ task: blockedTask } = await transitionTask(runtimeDir, blockedTask, { to_status: 'planning', event_type: 'TaskAccepted', actor_type: 'orchestrator', actor_id: 'orchestrator', reason_code: 'task_accepted' }));
  ({ task: blockedTask } = await transitionTask(runtimeDir, blockedTask, { to_status: 'ready', event_type: 'PlanReady', actor_type: 'orchestrator', actor_id: 'orchestrator', reason_code: 'plan_ready' }));
  ({ task: blockedTask } = await recordExecutionAttempt(runtimeDir, blockedTask, { actor_id: 'executor-demo', actor_type: 'executor', step_id: `${blockedTaskId}-s1`, trigger: 'initial_dispatch', to_status: 'running' }));
  ({ task: blockedTask } = await transitionTask(runtimeDir, blockedTask, { to_status: 'blocked', event_type: 'BlockedDetected', actor_type: 'supervisor', actor_id: 'supervisor', reason_code: 'dependency_missing' }));

  const heartbeatTaskId = `task-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-poll-heartbeat-upgrade-demo`;
  const { task: heartbeatCreated } = await bootstrapTask(runtimeDir, {
    task_id: heartbeatTaskId,
    source: 'main-agent',
    creator: 'main',
    goal: '验证 supervisor-poll 对 heartbeat 超时任务执行批量升级',
    context: 'poll upgrade heartbeat demo',
    heartbeat_timeout: '1m',
    done_definition: ['主链状态迁移成立'],
    steps: [createStep({ step_id: `${heartbeatTaskId}-s1`, task_id: heartbeatTaskId, title: 'poll heartbeat', kind: 'agent', status: 'ready', assignee_type: 'main-agent', assignee_id: 'main' })],
  });

  let heartbeatTask = heartbeatCreated;
  ({ task: heartbeatTask } = await transitionTask(runtimeDir, heartbeatTask, { to_status: 'planning', event_type: 'TaskAccepted', actor_type: 'orchestrator', actor_id: 'orchestrator', reason_code: 'task_accepted' }));
  ({ task: heartbeatTask } = await transitionTask(runtimeDir, heartbeatTask, { to_status: 'ready', event_type: 'PlanReady', actor_type: 'orchestrator', actor_id: 'orchestrator', reason_code: 'plan_ready' }));
  ({ task: heartbeatTask } = await recordExecutionAttempt(runtimeDir, heartbeatTask, { actor_id: 'executor-demo', actor_type: 'executor', step_id: `${heartbeatTaskId}-s1`, trigger: 'initial_dispatch', to_status: 'running' }));

  const now = new Date(Date.parse(heartbeatTask.last_progress_at) + 61_000).toISOString();
  const result = await pollRuntimeDir(runtimeDir, { now, actor_id: 'supervisor' });

  return {
    runtimeDir,
    blockedTaskId,
    heartbeatTaskId,
    pollResult: result,
    statePaths: {
      blocked: path.join(runtimeDir, blockedTaskId, 'task_state.json'),
      heartbeat: path.join(runtimeDir, heartbeatTaskId, 'task_state.json'),
    },
  };
}

module.exports = { preparePollUpgradeDemo };

if (require.main === module) {
  const runtimeDir = process.argv[2] || path.join(process.cwd(), 'runtime', 'task-ledger-supervisor-poll-demo');
  preparePollUpgradeDemo(runtimeDir)
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
