"use strict";

const path = require("node:path");
const { bootstrapTask } = require("./index");
const { createStep } = require("./types");
const { recordExecutionAttempt } = require("./governance");
const { transitionTask } = require("./state-machine");
const { supervisorTick } = require("./supervisor");
const { summarizeDoneChecks } = require("./done-checks");

async function demoSupervisor(runtimeDir) {
  const blockedTaskId = `task-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-supervisor-blocked-demo`;
  const { task: blockedCreated } = await bootstrapTask(runtimeDir, {
    task_id: blockedTaskId,
    source: 'main-agent',
    creator: 'main',
    goal: '验证 supervisor 对 blocked 超时升级',
    context: 'supervisor blocked escalation demo',
    max_wait_duration: '1m',
    done_definition: ['主链状态迁移成立'],
    steps: [createStep({ step_id: `${blockedTaskId}-s1`, task_id: blockedTaskId, title: 'blocked supervisor', kind: 'agent', status: 'ready', assignee_type: 'main-agent', assignee_id: 'main' })],
  });

  let blockedTask = blockedCreated;
  ({ task: blockedTask } = await transitionTask(runtimeDir, blockedTask, { to_status: 'planning', event_type: 'TaskAccepted', actor_type: 'orchestrator', actor_id: 'orchestrator', reason_code: 'task_accepted' }));
  ({ task: blockedTask } = await transitionTask(runtimeDir, blockedTask, { to_status: 'ready', event_type: 'PlanReady', actor_type: 'orchestrator', actor_id: 'orchestrator', reason_code: 'plan_ready' }));
  ({ task: blockedTask } = await recordExecutionAttempt(runtimeDir, blockedTask, { actor_id: 'executor-demo', actor_type: 'executor', step_id: `${blockedTaskId}-s1`, trigger: 'initial_dispatch', to_status: 'running' }));
  ({ task: blockedTask } = await transitionTask(runtimeDir, blockedTask, { to_status: 'blocked', event_type: 'BlockedDetected', actor_type: 'supervisor', actor_id: 'supervisor', reason_code: 'dependency_missing' }));
  ({ task: blockedTask } = await supervisorTick(runtimeDir, blockedTask, { now: new Date(Date.parse(blockedTask.blocked_since) + 61_000).toISOString(), actor_id: 'supervisor' }));

  const heartbeatTaskId = `task-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-supervisor-heartbeat-demo`;
  const { task: heartbeatCreated } = await bootstrapTask(runtimeDir, {
    task_id: heartbeatTaskId,
    source: 'main-agent',
    creator: 'main',
    goal: '验证 supervisor 对 heartbeat 超时升级',
    context: 'supervisor heartbeat escalation demo',
    heartbeat_timeout: '1m',
    done_definition: ['主链状态迁移成立'],
    steps: [createStep({ step_id: `${heartbeatTaskId}-s1`, task_id: heartbeatTaskId, title: 'heartbeat supervisor', kind: 'agent', status: 'ready', assignee_type: 'main-agent', assignee_id: 'main' })],
  });

  let heartbeatTask = heartbeatCreated;
  ({ task: heartbeatTask } = await transitionTask(runtimeDir, heartbeatTask, { to_status: 'planning', event_type: 'TaskAccepted', actor_type: 'orchestrator', actor_id: 'orchestrator', reason_code: 'task_accepted' }));
  ({ task: heartbeatTask } = await transitionTask(runtimeDir, heartbeatTask, { to_status: 'ready', event_type: 'PlanReady', actor_type: 'orchestrator', actor_id: 'orchestrator', reason_code: 'plan_ready' }));
  ({ task: heartbeatTask } = await recordExecutionAttempt(runtimeDir, heartbeatTask, { actor_id: 'executor-demo', actor_type: 'executor', step_id: `${heartbeatTaskId}-s1`, trigger: 'initial_dispatch', to_status: 'running' }));
  ({ task: heartbeatTask } = await supervisorTick(runtimeDir, heartbeatTask, { now: new Date(Date.parse(heartbeatTask.last_progress_at) + 61_000).toISOString(), actor_id: 'supervisor' }));

  return {
    blocked: {
      taskId: blockedTaskId,
      finalStatus: blockedTask.status,
      doneCheckSummary: summarizeDoneChecks(blockedTask),
      statePath: path.join(runtimeDir, blockedTaskId, 'task_state.json'),
    },
    heartbeat: {
      taskId: heartbeatTaskId,
      finalStatus: heartbeatTask.status,
      doneCheckSummary: summarizeDoneChecks(heartbeatTask),
      statePath: path.join(runtimeDir, heartbeatTaskId, 'task_state.json'),
    },
  };
}

module.exports = { demoSupervisor };

if (require.main === module) {
  const runtimeDir = process.argv[2] || path.join(process.cwd(), 'runtime', 'task-ledger-supervisor');
  demoSupervisor(runtimeDir)
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
