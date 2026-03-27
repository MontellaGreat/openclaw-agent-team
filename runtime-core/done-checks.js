"use strict";

const { writeState } = require("./ledger");

function attachEvidence(check, evidence) {
  return {
    ...check,
    evidence: [...(check.evidence || []), evidence],
  };
}

function matchCheck(check, input) {
  if (input.check_id && check.id === input.check_id) return true;
  if (input.type && check.type === input.type) return true;
  if (input.description_includes && check.description.includes(input.description_includes)) return true;
  return false;
}

function updateDoneCheck(task, input) {
  let touched = false;
  const done_checks = (task.done_checks || []).map((check) => {
    if (!matchCheck(check, input)) return check;
    touched = true;
    return {
      ...attachEvidence(check, {
        kind: input.evidence_kind || 'event',
        ref: input.evidence_ref,
        event_seq: input.event_seq,
        output_refs: input.output_refs || [],
        note: input.note,
      }),
      status: input.status || check.status,
      verified_by: input.verified_by || check.verified_by,
      verified_at: input.verified_at || new Date().toISOString(),
    };
  });
  if (!touched) {
    throw new Error(`done_check not found: ${input.check_id || input.type || input.description_includes}`);
  }
  return { ...task, done_checks };
}

async function persistDoneCheckUpdate(baseDir, task, input) {
  const next = updateDoneCheck(task, input);
  next.updated_at = input.verified_at || new Date().toISOString();
  next.updated_by = input.verified_by || task.updated_by;
  next.version = (task.version || 1) + 1;
  next.history_log = [...(task.history_log || []), `DoneCheckUpdated#${input.event_seq || 'manual'}`];
  return writeState(baseDir, next);
}

function summarizeDoneChecks(task) {
  const checks = task.done_checks || [];
  return {
    total: checks.length,
    passed: checks.filter((item) => item.status === 'passed').length,
    failed: checks.filter((item) => item.status === 'failed').length,
    pending: checks.filter((item) => item.status === 'pending').length,
    unresolved: checks.filter((item) => item.status === 'unresolved').length,
  };
}

function applyEventDrivenDoneChecks(task, event, meta = {}) {
  let next = task;
  const outputs = meta.output_refs || [];

  if (["ReviewApproved", "ExecutionAttemptStarted"].includes(event.event_type)) {
    const hasStatusCheck = (next.done_checks || []).some((item) => item.type === 'status_match');
    if (hasStatusCheck) {
      next = updateDoneCheck(next, {
        type: 'status_match',
        status: 'passed',
        verified_by: event.actor_id,
        verified_at: event.created_at,
        evidence_kind: 'event',
        evidence_ref: event.event_type,
        event_seq: event.seq,
        output_refs: outputs,
        note: `pre-done chain satisfied by ${event.event_type}`,
      });
    }
  }

  if (event.event_type === 'BlockedDetected' || event.to_status === 'blocked') {
    next = {
      ...next,
      done_checks: (next.done_checks || []).map((check) => {
        const status = check.type === 'status_match' ? 'pending' : check.status;
        return {
          ...attachEvidence(check, {
            kind: 'event',
            ref: event.event_type || 'BlockedDetected',
            event_seq: event.seq,
            output_refs: outputs,
            note: 'blocked state observed',
          }),
          status,
        };
      }),
    };
  }

  if (event.event_type === 'BlockedEscalated' || event.event_type === 'BlockedEscalatedToReview') {
    next = {
      ...next,
      done_checks: (next.done_checks || []).map((check) => {
        let status = check.status;
        if (check.type === 'status_match') status = 'unresolved';
        return {
          ...attachEvidence(check, {
            kind: 'event',
            ref: event.event_type,
            event_seq: event.seq,
            output_refs: outputs,
            note: 'blocked escalation observed',
          }),
          status,
        };
      }),
    };
  }

  if (event.event_type === 'HeartbeatMissedEscalatedToReview') {
    next = {
      ...next,
      done_checks: (next.done_checks || []).map((check) => {
        let status = check.status;
        if (check.type === 'status_match') status = 'unresolved';
        return {
          ...attachEvidence(check, {
            kind: 'event',
            ref: event.event_type,
            event_seq: event.seq,
            output_refs: outputs,
            note: 'heartbeat escalation observed',
          }),
          status,
          verified_by: event.actor_id,
          verified_at: event.created_at,
        };
      }),
    };
  }

  if (event.event_type === 'TaskFailed' || event.to_status === 'failed' || event.event_type === 'RetryExhausted') {
    next = {
      ...next,
      done_checks: (next.done_checks || []).map((check) => {
        let status = check.status;
        if (check.type === 'status_match') status = 'failed';
        else if (check.type === 'file_exists') status = check.status;
        else if (check.type === 'human_check') status = check.status === 'passed' ? 'passed' : 'pending';
        else status = check.status === 'passed' ? 'passed' : 'failed';
        return {
          ...attachEvidence(check, {
            kind: 'event',
            ref: event.event_type || 'TaskFailed',
            event_seq: event.seq,
            output_refs: outputs,
            note: 'failure state observed',
          }),
          status,
          verified_by: event.actor_id,
          verified_at: event.created_at,
        };
      }),
    };
  }

  if (event.event_type === 'RetryApproved' || event.event_type === 'RetryDispatched' || event.to_status === 'retrying') {
    next = {
      ...next,
      done_checks: (next.done_checks || []).map((check) => {
        let status = check.status;
        if (check.type === 'status_match' && check.status === 'failed') status = 'pending';
        else if (check.type !== 'file_exists' && check.status === 'failed') status = 'pending';
        return {
          ...attachEvidence(check, {
            kind: 'event',
            ref: event.event_type || 'RetryApproved',
            event_seq: event.seq,
            output_refs: outputs,
            note: 'retry state observed',
          }),
          status,
        };
      }),
    };
  }

  if (event.event_type === 'TaskCompleted') {
    next = {
      ...next,
      done_checks: (next.done_checks || []).map((check) => (
        check.status === 'failed' ? check : {
          ...attachEvidence(check, {
            kind: 'event',
            ref: 'TaskCompleted',
            event_seq: event.seq,
            output_refs: outputs,
            note: 'completion event observed',
          }),
        }
      )),
    };
  }

  return next;
}

module.exports = {
  attachEvidence,
  updateDoneCheck,
  persistDoneCheckUpdate,
  summarizeDoneChecks,
  applyEventDrivenDoneChecks,
};
