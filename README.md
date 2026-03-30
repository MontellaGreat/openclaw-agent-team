# OpenClaw Agent Team

一个面向 OpenClaw 的 **多 Agent 协作治理规范仓**。

> 它不是任务 runtime 引擎，也不再承载任务系统实现。  
> `task runtime / 状态记录 / supervisor / CLI / state machine` 已迁出到独立项目维护。

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
- demo 状态记录 / acceptance runtime 样例

## 当前仓库最重要的事

这个仓现在最重要的，不是再写更多“说明文档”，而是把：
- 主 Agent 的能力范围与限制
- 收到任务后的判断顺序
- 拆解协议
- 分发协议
- 协作协议
- 结果回收与总结协议

从静态说明，推进成：

**主 Agent 真会读取、真会执行的运行协议。**

因此当前正式收口为：
- docs 用来规划协议
- `prompt/PROMPT_FULL.md` 是唯一正式一键部署入口
- `workspace-template/AGENTS.md` 是长期运行入口模板

## 当前仓库适合做什么

适合：
- 给 OpenClaw 团队搭治理骨架
- 定义主 Agent / 协调层 / specialist 的职责
- 把主 Agent 的运行协议写成可执行提示层
- 统一拆解、分发、handoff、review、release、风险边界
- 作为多 Agent 协作规范包或模板仓使用

不适合：
- 在本仓继续开发任务系统 runtime
- 把本仓当成 task orchestration engine
- 在本仓维护状态记录 / scheduler / CLI 执行链

## 入口文件

- `prompt/PROMPT_FULL.md`：唯一正式一键部署提示词
- `workspace-template/AGENTS.md`：长期运行入口模板
- `docs/main-agent-decision-flow.md`：主 Agent 运行协议
- `docs/handoff-protocol.md`：交接协议
- `docs/review-quality-gates.md`：复核门禁
- `docs/risk-and-review.md`：风险与审议
- `docs/planning-contract.md`：planning 层契约
- `docs/control-center-contract.md`：控制中心接入契约
- `guihua.md`：统一规划总稿

## 迁移说明

任务系统已经拆到独立项目。今后本仓只讨论：
- 治理
- 角色
- 协作规则
- 模板
- 接入契约
- 主 Agent 可执行运行协议

不再在这里继续堆 task runtime 代码或运行样例。

## 当前状态

当前已完成一次清理与一次入口收口：
- 移除 `runtime-core/`
- 移除 `runtime/`
- 移除 task runtime 相关 schema / transition / shell 命令文件
- 移除 runtime 样例与 demo 账本产物
- README 与主规划改写为“治理仓”口径
- prompt 入口收口为只保留 `PROMPT_FULL`
- 主 Agent 协议开始迁入 `workspace-template/AGENTS.md`

## 相关链接

- GitHub: https://github.com/MontellaGreat/openclaw-agent-team
- OpenClaw Docs: https://docs.openclaw.ai
