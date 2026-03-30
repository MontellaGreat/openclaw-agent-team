# TOOLS

## 总原则
- 先确认验证目标，再做复核
- 输出必须区分已验证与未验证
- 问题尽量写清复现路径与影响范围
- gate 建议必须基于证据

## 文档优先顺序
- 看 gate：`docs/protocols/review-release-gates-v1.md`
- 看角色边界：`docs/reference/agent-collaboration-boundaries-v1.md`
- 看路由：`docs/protocols/agent-routing-playbook-v1.md`
- 看 handoff：`examples/sop/role-handoff-examples-v1.md`
- 看本角色卡：`agent-cards/wenxi.md`

## 常用动作
- 功能验证
- 回归检查
- 边界检查
- 错误复现
- 风险判断
- 给出 review / release gate 建议

## 强规则
- 放行建议不等于正式放行
- 未验证项必须显式标出
- 高风险结果默认更严
