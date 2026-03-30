# Claw-Empire 融入 `openclaw-agent-team` 评估报告

## 1. 任务目的

本报告用于回答一个具体问题：

> `claw-empire` 能否融入 `openclaw-agent-team`，如果能，应该以什么方式融入。

结论先行：

**可以融入，但不适合整仓合并。**

更准确地说：
- `claw-empire` 适合作为 **产品化控制中心 / orchestration 实现参考**
- `openclaw-agent-team` 继续作为 **多 Agent 治理规范仓 / 团队模板仓**
- 二者应通过 **契约、接入规范、模板映射** 建立关系，而不是混成一个仓

---

## 2. 两个项目的本质差异

## 2.1 `openclaw-agent-team` 的当前定位

当前主定位已经收口明确：

- 多 Agent 治理规范仓
- 团队模板仓
- 主 Agent / 协调层 / specialist 的边界规则仓
- handoff / review / risk / release / planning contract / control center contract 的文档仓

不再负责：
- task runtime 实现
- 状态机执行器
- supervisor
- 任务 CLI
- runtime acceptance demo

因此，本仓的核心职责是：

**定义规则，不承载完整运行时产品实现。**

---

## 2.2 `claw-empire` 的当前定位

`claw-empire` 不是纯规范仓，而是一个完整的产品型项目。

它已经具备：
- 前端 UI
- 后端 API
- SQLite 本地存储
- WebSocket 实时更新
- agent / department / task / meeting / report / messenger / provider 管理
- OpenClaw 可选接入
- inbox 指令入口
- git worktree 隔离执行
- Docker / deploy / E2E / lint / build / API 文档

因此，它的本质更接近：

**本地优先的多 Agent 办公控制台 / orchestration 产品。**

---

## 2.3 结论：二者不是同层项目

两边都和“多 Agent”有关，但层级不同：

- `openclaw-agent-team`：治理层 / 模板层 / 契约层
- `claw-empire`：产品层 / 控制台层 / 运行编排层

这意味着：

**两者高度相关，但不应被视为同一种仓库。**

---

## 3. 为什么不能直接整仓并入

## 3.1 会破坏已经收口的项目边界

`openclaw-agent-team` 已经完成一次关键收口：
- 从“规范 + runtime 混合仓”退回为“治理规范仓 / 团队模板仓”
- 明确不再继续维护 runtime 实现

如果现在把 `claw-empire` 这类完整产品型实现重新并入，就会再次把边界打乱。

这会导致：
- README 定位失真
- 文档口径混乱
- 治理规则与具体实现耦合
- 后续维护目标再次发散

---

## 3.2 `claw-empire` 的实现密度太高，不适合回流治理仓

`claw-empire` 包含大量实现型内容：
- UI 界面
- Express API
- DB schema
- OAuth / Messenger / API provider 管理
- workflow packs
- 任务状态推进
- worktree 管理
- 报告、会议、技能、消息等运行逻辑

这些内容对于产品仓是优点，
但对于治理仓而言会产生副作用：
- 过重
- 过具体
- 与治理文档层混层
- 容易把“规则真值”变成“某个实现版本的细节”

---

## 3.3 其 AGENTS 注入逻辑与我们现有主控口径并不等价

`claw-empire` 的安装器会把一段 orchestration 规则注入 `AGENTS.md`，其目标是：
- 处理 `$` 指令
- 绑定 `project_path` / `project_context`
- 调用 `/api/inbox`
- 驱动具体的产品任务流

这类规则是产品型 orchestration prompt。

而我们当前 `openclaw-agent-team` 的治理口径更强调：
- 主 Agent 先判断再分发
- 简单任务直接做
- 高风险必须复核
- specialist 只是辅助，不替代最终放行
- 团队结构、交接、复核和 release 的制度化表达

两者并不冲突，但也不是一回事。

**因此不能把 `claw-empire` 的 AGENTS 规则直接当成我们治理仓的主规则。**

---

## 4. `claw-empire` 最值得吸收的部分

## 4.1 控制中心产品化视角

`claw-empire` 的最大价值之一，不在于它又多了几个 agent，
而在于它把多 Agent 协作行为变成了一个可观察、可操作、可管理的产品界面。

这给我们的启发是：

- 治理仓负责定义制度
- 但制度最终需要一个控制中心来承接
- 控制中心不一定等于 `claw-empire`，但 `claw-empire` 已经证明了一种可行路径

可吸收方向：
- dashboard / task board / report / meeting / agent presence 的控制台思路
- “主 Agent 保留审议权，但控制台提供观测与操作入口”的产品结构

---

## 4.2 任务入口与外部指令协议

`claw-empire` 已经把一些很实用的外部入口语言做成了产品能力，包括：
- `$` 指令
- `project_path`
- `project_context`
- `skipPlannedMeeting`
- decision inbox
- messenger session route pinning
- `INBOX_WEBHOOK_SECRET` 守卫

这些内容非常适合被抽象成：

**控制中心 / 外部消息系统 对接 多 Agent 团队的通用入口契约。**

这比“具体如何渲染一个办公室 UI”更值得沉淀到我们的治理文档中。

---

## 4.3 project / decision / messenger 三个中间层对象

从产品实现角度看，`claw-empire` 有三个很值得借鉴的中间层：

### A. `project`
让任务不再只是一个孤立工作项，而是挂靠到一个项目路径和上下文目标。

### B. `decision inbox`
把“需要主控裁决”的内容从普通执行流里分离出来。

### C. `messenger session`
让不同消息渠道与不同 agent/task 路由之间可以建立稳定绑定。

这三者都和我们当前的治理方向高度一致，因为它们能强化：
- 主控审议
- 上下文延续
- 外部渠道接入
- 执行与决策分层

---

## 4.4 安装器 / 接入器思路

`claw-empire` 的 `setup` 逻辑说明了一件事：

**团队协作规则不仅可以写文档，也可以被包装成“接入器”。**

这给我们的启发不是“照抄它的 AGENTS 模板”，而是：
- 未来可以做我们自己的模板注入器
- 让不同 OpenClaw 实例快速挂载主控规则、团队规则、handoff 模板、review 模板
- 将治理仓从“纯文档”升级为“文档 + 接入工具”

---

## 5. 不建议直接吸收的部分

## 5.1 整套 CEO / 虚拟公司叙事

`claw-empire` 的叙事非常完整：
- CEO
- 虚拟办公室
- 部门
- 员工
- 像素风公司

这在产品层非常有吸引力，
但不适合作为 `openclaw-agent-team` 的正式治理口径。

原因：
- 它更像产品包装语言
- 容易掩盖治理规则的抽象性和可迁移性
- 不适合作为所有团队都必须采用的官方表达

因此，应视为：
- 某种产品实现风格
- 某种控制台皮肤和交互叙事
- 而不是治理仓真值

---

## 5.2 workflow packs 的具体命名和组织形式

例如：
- `development`
- `report`
- `video_preprod`
- `roleplay`

这些 pack 很有产品使用价值，
但它们更像：
- 预置工作流模板
- 产品配置层
- 业务场景包

不应直接作为治理仓的核心对象模型真值。

治理仓更适合沉淀的是：
- pack 应该具备哪些能力
- pack 如何影响 routing / QA / output contract
- pack 如何接入主控规则

而不是把具体 pack 列表当成规范本体。

---

## 5.3 完整 runtime/API/DB 实现

这些内容应继续留在独立实现仓。

治理仓可以引用它们、分析它们、为它们定义接入契约，
但不应回流成本仓的日常维护负担。

否则会再次让 `openclaw-agent-team` 失去“轻治理、强迁移、强模板化”的优势。

---

## 6. 推荐的融入方式

## 6.1 路线 A：参考实现模式（最稳）

做法：
- 不改 `openclaw-agent-team` 的项目定位
- 在文档中明确把 `claw-empire` 作为“控制中心 / orchestration 产品参考实现”
- 补一份映射说明：哪些设计值得吸收，哪些只做参考

优点：
- 风险低
- 不破坏边界
- 易于后续继续研究更多类似项目

缺点：
- 融入深度有限
- 更偏方法论层

适用：
- 当前阶段
- 需要先稳住治理口径时

---

## 6.2 路线 B：契约抽象模式（最推荐）

做法：
- 从 `claw-empire` 中抽象出：
  - inbox contract
  - project context contract
  - decision inbox contract
  - messenger routing contract
  - control center interaction contract
- 在 `openclaw-agent-team` 新增一组文档，作为控制中心接入补充规范

优点：
- 吸收的是高价值结构，不是表层实现
- 与我们当前治理仓定位一致
- 为后续独立 runtime / control center 项目预留统一语言

缺点：
- 需要认真抽象，不能直接复制 README

适用：
- 当前到下一阶段之间
- 适合作为正式推进方向

---

## 6.3 路线 C：双仓协同模式（长期推荐）

做法：
- `openclaw-agent-team` 继续作为治理上游
- 另起或选择一个独立实现仓，承接控制中心 / runtime / orchestration 产品化
- `claw-empire` 作为现成参考样本之一
- 两边通过 contract 对齐，而不是代码混并

优点：
- 结构最清晰
- 最符合当前项目边界
- 有利于后续演化成真正的“治理 + 产品”双层体系

缺点：
- 需要额外规划和维护

适用：
- 中长期
- 当我们决定认真推进控制中心产品时

---

## 7. 对 `openclaw-agent-team` 的具体启发

基于本次研究，我认为本仓后续最值得新增的不是 runtime 代码，
而是以下几类文档能力：

### 7.1 控制中心接入补充文档
建议新增：
- 控制中心如何向主 Agent 发起任务
- 何时进入 meeting / 何时跳过 meeting
- 如何标记“需要主控裁决”的 decision 对象
- project_path / project_context 如何成为稳定输入

### 7.2 外部消息系统接入文档
建议新增：
- messenger session 的角色
- route pinning 原则
- inbox secret / auth 原则
- 外部渠道与 agent/task 的映射边界

### 7.3 decision inbox 治理文档
建议新增：
- 哪些事项必须进 decision inbox
- decision inbox 与 review gate 的关系
- 需要主 Agent 亲自裁决的对象范围
- 决策通过 / 驳回 / 补充请求的标准动作

### 7.4 产品参考实现目录
建议在文档里增加一个固定章节：
- 已研究的产品型控制中心样本
- 每个样本的可借鉴点 / 不建议照搬点
- 与本仓治理口径的映射关系

---

## 8. 最终结论

本次评估的最终判断如下：

### 结论 1
`claw-empire` **值得研究，也值得吸收**。

### 结论 2
它最有价值的部分不是“又一个多 agent 项目”，
而是它把：
- 控制台
- 消息入口
- 项目路由
- 决策收口
- 可视化协作
- provider 混编

做成了一个接近完整的产品。

### 结论 3
它**不适合整仓并入** `openclaw-agent-team`。

### 结论 4
最合理的吸收方式是：

**把它作为控制中心 / orchestration 产品参考实现，抽象其高价值契约，再补强我们的治理仓文档。**

### 结论 5
若未来要继续推进，推荐优先走：

**路线 B：契约抽象模式**

也就是：
- 不混仓
- 不回流完整 runtime
- 重点提炼：control center / inbox / decision / messenger / project context 的接入语言

---

## 9. 下一步建议

建议按以下顺序推进：

1. 在 `openclaw-agent-team` 补一份“控制中心接入补充规范”草稿
2. 单独整理 `claw-empire` 可吸收能力矩阵
3. 定义 decision inbox / project context / messenger route pinning 的治理口径
4. 再决定是否启动独立的控制中心 / runtime 产品仓

如果只做一个最小高价值动作，
优先建议：

**先把 `claw-empire` 抽象成一份能力矩阵与契约映射文档。**

这样既不会破坏边界，
又能把研究成果直接沉淀进我们的体系。