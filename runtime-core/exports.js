"use strict";

function summarizeByStatus(task) {
  const checks = task.done_checks || [];
  return {
    passed: checks.filter((item) => item.status === 'passed').map((item) => item.id),
    failed: checks.filter((item) => item.status === 'failed').map((item) => item.id),
    pending: checks.filter((item) => item.status === 'pending').map((item) => item.id),
    unresolved: checks.filter((item) => item.status === 'unresolved').map((item) => item.id),
  };
}

function extractUnresolved(task) {
  return (task.done_checks || [])
    .filter((item) => item.status === 'unresolved')
    .map((item) => ({
      check_id: item.id,
      description: item.description,
      evidence: item.evidence || [],
    }));
}

function inferAcceptance(task) {
  const summary = summarizeByStatus(task);
  if (summary.failed.length > 0) return 'fail';
  if (summary.unresolved.length > 0 || summary.pending.length > 0) return 'conditional_pass';
  if (task.status === 'done') return 'pass';
  return 'conditional_pass';
}

function buildHandoff(task) {
  const summary = summarizeByStatus(task);
  return {
    task_id: task.task_id,
    status: task.status,
    handoff_kind: 'runtime_handoff',
    unresolved: extractUnresolved(task),
    failed_checks: summary.failed,
    pending_checks: summary.pending,
    next_action: summary.unresolved.length > 0
      ? '需要主 Agent 审议 unresolved 项并决定继续执行、重派或终止'
      : task.status === 'failed'
        ? '需要判断是否允许 retry 或直接归档失败'
        : '按当前状态继续推进',
    risk_change: summary.unresolved.length > 0 || task.status === 'review_required' ? 'up' : 'stable',
    terminal_reason: task.terminal_reason,
  };
}

function buildArchive(task) {
  const summary = summarizeByStatus(task);
  return {
    task_id: task.task_id,
    final_status: task.status,
    acceptance_result: inferAcceptance(task),
    terminal_reason: task.terminal_reason,
    done_check_summary: {
      passed: summary.passed.length,
      failed: summary.failed.length,
      pending: summary.pending.length,
      unresolved: summary.unresolved.length,
    },
    unresolved: extractUnresolved(task),
    result_summary: task.result_summary,
  };
}

function buildRecap(task) {
  const summary = summarizeByStatus(task);
  return {
    task_id: task.task_id,
    recap: {
      current_status: task.status,
      acceptance_result: inferAcceptance(task),
      unresolved_count: summary.unresolved.length,
      failed_count: summary.failed.length,
      pending_count: summary.pending.length,
      next_action: buildHandoff(task).next_action,
    },
  };
}

module.exports = {
  summarizeByStatus,
  extractUnresolved,
  inferAcceptance,
  buildHandoff,
  buildArchive,
  buildRecap,
};
