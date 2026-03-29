# OpenClaw Agent Team

一个面向 OpenClaw 的 **多 Agent 协作治理规范仓**。

> 它不是任务 runtime 引擎，也不再承载任务系统实现。  
> `task runtime / ledger / supervisor / CLI / state machine` 已迁出到独立项目维护。

## 项目定位

`openclaw-agent-team` 现在只保留三类内容：

1. **治理规则**
   - 主 Agent 总控原则
   - Specialist 分工边界
   - 风险、review、release 纪律

2. **团队模板**
   - 主 Agent / 承枢 / specialist 的角色模板
   - workspace 使用约定
   - 交接、委派、阶段总结等文本模板

3. **规划与方法论**
   - 多 Agent 协作方法
   - planning contract
   - 控制中心 / 观测 / rollout 的治理口径

不再包含：
- 任务账本实现
- 状态机执行器
- supervisor
- task CLI
- demo ledger / acceptance runtime 样例

## 当前仓库适合做什么

适合：
- 给 OpenClaw 团队搭治理骨架
- 定义主 Agent / 协调层 / specialist 的职责
- 统一 review、release、handoff、风险边界
- 作为多 Agent 协作规范包或模板仓使用

不适合：
- 在本仓继续开发任务系统 runtime
- 把本仓当成 task orchestration engine
- 在本仓维护 ledger / scheduler / CLI 执行链

## 文档入口

- `docs/v1-positioning.md`：项目定位
- `docs/architecture.md`：整体架构
- `docs/agent-specifications.md`：角色规格
- `docs/main-agent-decision-flow.md`：主 Agent 判断与分发
- `docs/handoff-protocol.md`：交接协议
- `docs/review-quality-gates.md`：复核门禁
- `docs/risk-and-review.md`：风险与审议
- `docs/planning-contract.md`：planning 层契约
- `docs/control-center-contract.md`：控制中心接入契约

## 迁移说明

任务系统已经拆到独立项目。今后本仓只讨论：
- 治理
- 角色
- 协作规则
- 模板
- 接入契约

不再在这里继续堆 task runtime 代码或运行样例。

## 当前状态

当前已完成一次清理：
- 移除 `runtime-core/`
- 移除 `runtime/`
- 移除 task runtime 相关 schema / transition / shell 命令文件
- 移除 runtime 样例与 demo 账本产物
- README 与主规划改写为“治理仓”口径

## 相关链接

- GitHub: https://github.com/MontellaGreat/openclaw-agent-team
- OpenClaw Docs: https://docs.openclaw.ai
