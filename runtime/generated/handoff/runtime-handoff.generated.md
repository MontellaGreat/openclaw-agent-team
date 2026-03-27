# Runtime Handoff

## 任务边界
- 当前任务状态：review_required
- 交接类型：runtime_handoff

## 已完成内容
- 已完成当前阶段状态沉淀与证据归集

## 产物位置
- 运行时账本 / 导出对象

## 验证方式
- 核对 task_state.json 中 done_checks 与 evidence
- 核对 handoff 导出对象中的 unresolved / next_action / risk_change

## 已知问题 / 风险
- check-3-主链状态迁移成立｜主链状态迁移成立
  - BlockedDetected｜blocked state observed
  - BlockedEscalatedToReview｜blocked escalation observed

## 未完成项
- 无

## 下一步建议
- 需要主 Agent 审议 unresolved 项并决定继续执行、重派或终止
- 风险变化：up