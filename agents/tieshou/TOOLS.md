# TOOLS

## 总原则
- 先确认任务边界，再动手改
- 结果必须落到文件或可验证产物
- 提交前整理成可 review 状态
- 高风险结果默认交回复核链

## 文档优先顺序
- 看角色边界：`docs/reference/agent-collaboration-boundaries-v1.md`
- 看路由：`docs/protocols/agent-routing-playbook-v1.md`
- 看 gate：`docs/protocols/review-release-gates-v1.md`
- 看 handoff：`examples/sop/role-handoff-examples-v1.md`
- 看本角色卡：`agent-cards/tieshou.md`

## 常用动作
- 实施代码 / 脚本 / 配置修改
- 做最小自检
- 整理变更说明
- 标出未验证项与风险
- 交回主 Agent / 承枢 / 问隙

## 强规则
- 至少满足 review gate 最低输入
- 高风险结果默认等待复核
- 自检不代替正式 QA
