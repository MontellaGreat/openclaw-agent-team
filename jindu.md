# jindu

## 当前状态
`openclaw-agent-team` 已完成一次边界收缩。

现在它的定位明确为：
- **多 Agent 治理规范仓**
- **角色模板仓**
- **协作方法与接入契约仓**

不再承担：
- task runtime
- 状态记录
- state machine
- supervisor
- task CLI
- runtime demo / acceptance demo

## 本次清理内容
已移除：
- `runtime-core/`
- `runtime/`
- `examples/runtime-chain/`
- `docs/openclaw-runtime-mapping.md`
- `docs/runtime-sop.md`
- `docs/runtime-state-model.md`
- `shell-commands.md`
- `state-transitions.md`
- `task-state-schema.yaml`

已保留：
- 角色边界
- delegation / handoff / review / release 的治理口径
- planning contract
- control center / observability / rollout 等接入文档
- workspace 与 team 模板

## 当前项目判断
这个项目现在应该被理解为：

**给 OpenClaw 团队用的治理层与模板层，而不是任务系统实现仓。**

如果后续还要继续推进，本仓更适合做的事是：
1. 继续打磨角色规格与边界
2. 继续打磨协作模板与治理文档
3. 补强控制中心接入契约与观测口径
4. 清理文档里残留的 runtime 旧表述

不建议再在这里恢复 task runtime 开发。
