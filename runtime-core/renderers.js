"use strict";

function renderList(items) {
  if (!items || items.length === 0) return '- 无';
  return items.map((item) => `- ${item}`).join('\n');
}

function renderUnresolved(unresolved) {
  if (!unresolved || unresolved.length === 0) return '- 无';
  return unresolved.map((item) => {
    const evidence = (item.evidence || []).map((ev) => `  - ${ev.ref}${ev.note ? `｜${ev.note}` : ''}`).join('\n');
    return `- ${item.check_id}｜${item.description}${evidence ? `\n${evidence}` : ''}`;
  }).join('\n');
}

function renderHandoffMarkdown(handoff) {
  return `# Runtime Handoff\n\n## 任务边界\n- 当前任务状态：${handoff.status}\n- 交接类型：${handoff.handoff_kind}\n\n## 已完成内容\n${renderList(handoff.failed_checks.length === 0 && handoff.pending_checks.length === 0 ? ['已完成当前阶段状态沉淀与证据归集'] : ['已完成当前状态写入与问题归类'])}\n\n## 产物位置\n- 运行时账本 / 导出对象\n\n## 验证方式\n- 核对 task_state.json 中 done_checks 与 evidence\n- 核对 handoff 导出对象中的 unresolved / next_action / risk_change\n\n## 已知问题 / 风险\n${renderUnresolved(handoff.unresolved)}\n\n## 未完成项\n${renderList([
  ...handoff.failed_checks.map((x) => `失败检查：${x}`),
  ...handoff.pending_checks.map((x) => `待完成检查：${x}`),
])}\n\n## 下一步建议\n- ${handoff.next_action}\n- 风险变化：${handoff.risk_change}`;
}

function renderRecapMarkdown(recap) {
  const r = recap.recap;
  return `# Chengshu Phase Summary\n\n1. 当前阶段\n- 当前状态：${r.current_status}\n- 验收结果：${r.acceptance_result}\n\n2. 已完成节点\n- unresolved 数：${r.unresolved_count}\n- failed 数：${r.failed_count}\n- pending 数：${r.pending_count}\n\n3. 当前阻塞 / 风险\n- 若 unresolved_count > 0，则当前存在待审议阻塞项\n\n4. 待回收 handoff\n- 需要结合 handoff 导出对象查看 unresolved 明细\n\n5. 是否需要墨影裁决\n- ${r.unresolved_count > 0 ? '需要' : '暂不需要'}\n\n6. 建议下一步\n- ${r.next_action}`;
}

function renderArchiveMarkdown(archive) {
  return `# Runtime Archive Summary\n\n## 最终状态\n- 任务 ID：${archive.task_id}\n- 最终状态：${archive.final_status}\n- 验收结果：${archive.acceptance_result}\n- 终态原因：${archive.terminal_reason || 'N/A'}\n\n## done_check 汇总\n- passed：${archive.done_check_summary.passed}\n- failed：${archive.done_check_summary.failed}\n- pending：${archive.done_check_summary.pending}\n- unresolved：${archive.done_check_summary.unresolved}\n\n## unresolved 明细\n${renderUnresolved(archive.unresolved)}\n\n## 结果摘要\n- ${archive.result_summary || 'N/A'}`;
}

module.exports = {
  renderHandoffMarkdown,
  renderRecapMarkdown,
  renderArchiveMarkdown,
};
