# openclaw-agent-team 统一规划总稿

## 1. 当前总定位
`openclaw-agent-team` 的正式定位已收口为：

**一个面向 OpenClaw 的多 Agent 治理规范仓与团队模板仓。**

它负责：
- 角色边界
- 主 Agent 治理原则
- delegation / handoff / review / release 规则
- planning contract
- control center / observability / rollout 接入口径
- workspace / team 模板

它不再负责：
- task runtime 实现
- 状态记录 / state machine / supervisor
- task CLI
- runtime acceptance demo
- 任务系统工程化开发

## 2. 本次边界调整
任务系统已拆到独立项目维护，因此本仓做如下收口：

### 2.1 从本仓移出的内容
- 运行态对象实现
- 状态机执行器
- 审批回写与账本逻辑
- supervisor 与轮询调度
- task CLI
- runtime demo 状态记录与验收样例

### 2.2 本仓继续保留的内容
- 多 Agent 组织设计
- 主 Agent 决策与分发口径
- specialist 角色规格
- handoff / review / risk / release 方法论
- planning contract 与规划协作口径
- control center 集成契约
- workspace-template / team 模板

## 3. v1 目标
本仓 v1 目标不是证明任务系统能跑，而是证明：

- 多 Agent 团队治理规则是清晰的
- 主 Agent 与协调层、specialist 的边界是稳定的
- review / release / risk 规则可复用
- 新团队可基于模板快速落地
- 外部 runtime 或控制中心有一致的接入语言

## 4. 文档优先级
后续阅读顺序建议：
1. `docs/v1-positioning.md`
2. `docs/architecture.md`
3. `docs/agent-specifications.md`
4. `docs/main-agent-decision-flow.md`
5. `docs/handoff-protocol.md`
6. `docs/review-quality-gates.md`
7. `docs/risk-and-review.md`
8. `docs/planning-contract.md`
9. `docs/control-center-contract.md`

## 5. 后续推进方向
本仓后续更值得继续做的方向：

### A. 治理层打磨
- 统一角色边界表述
- 继续压缩重复文档
- 把 delegation / handoff / review 的最小口径写得更稳

### B. 模板层打磨
- 清理 team / workspace 模板里的 runtime 旧痕迹
- 保留文本模板与治理模板
- 让新实例接入时更轻量

### C. 契约层打磨
- 对外只保留 runtime / control center 集成语言
- 不保留运行内核实现
- 明确“治理仓”和“任务系统仓”的边界

## 6. 当前结论
从现在开始，`openclaw-agent-team` 应只被表述为：

**OpenClaw 多 Agent 治理规范仓 / 团队模板仓。**

任何 task runtime、任务状态机、supervisor、CLI、状态记录相关实现，均不再在本仓继续推进。
