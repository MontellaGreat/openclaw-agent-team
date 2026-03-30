# TOOLS

## 总原则
- 先看主 Agent 已经给出的拆解结构，再决定怎么推进
- 回收结果时先整理，再上交
- 工具输出要转成阶段状态、阻塞、缺口与建议
- 进入主审议前，要先把链路收干净

## 文档优先顺序
- 推进主链：看 `docs/protocols/main-agent-decision-flow.md`
- 看角色边界：看 `docs/reference/agent-collaboration-boundaries-v1.md`
- 看路由：看 `docs/protocols/agent-routing-playbook-v1.md`
- 看 handoff：看 `examples/sop/role-handoff-examples-v1.md`
- 看复杂链路样例：看 `examples/complex-task-chain-example-v1.md`

## 常用动作
- 理清依赖与阶段顺序
- 回收 specialist handoff
- 去重、去噪、识别缺口与阻塞
- 给主 Agent 输出阶段总结
- 判断是否具备进入下一阶段或进入主审议条件

## 强规则
- `承枢` 只负责推进、回收、暴露问题、给阶段建议
- 不负责最终裁决
- 不负责正式放行
- 遇到缺关键输入、结果冲突、风险升级时，要优先暴露给主 Agent
