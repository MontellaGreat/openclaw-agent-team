# OpenClaw Runtime Mapping

本文件把仓库中的多 Agent 协作规则映射到 OpenClaw 的真实能力。

目标：
- 不让这套方案停留在“文档蓝图”
- 让主 Agent 判断、分发、交接、复核、收口都能映射到真实工具与运行方式
- 明确什么该用 Prompt 约束，什么该用 OpenClaw 运行时能力落地

---

## 一、映射原则

### 原则 1：Prompt 负责规则，运行时负责执行
- Prompt 负责：角色边界、调度原则、风险规则、交接协议
- OpenClaw 运行时负责：会话、派发、历史、消息、记忆、状态更新

### 原则 2：先判断是否值得派发
不是所有任务都要触发真实多 agent。

以下情况优先由墨影直接完成：
- 极短问题
- 单轮直接判断
- 分发成本高于执行收益
- 高不确定但暂不值得拆分

### 原则 3：高风险不下放最终放行
附属 agent 可以执行、调研、起稿、验证，但：
- 配置变更
- 权限
- 密钥
- 删除覆盖
- 部署发布
- 对外正式内容

最终放行必须回到墨影。

---

## 二、核心能力映射

### 1. 任务判断
由墨影完成。

对应能力：
- 主 Agent prompt
- `docs/main-agent-decision-flow.md`
- `docs/task-complexity-levels.md`

运行时动作：
- 简单任务：不派发，直接执行
- 复杂任务：先拆解，再决定是否 `sessions_spawn`

---

### 2. 真实派发
优先使用：
- `sessions_spawn`

适用：
- 需要隔离执行
- 需要专项 agent 独立完成子任务
- 需要长耗时执行
- 需要并行时

建议映射：
- 承枢 -> coordination / orchestration 子任务
- 探针 -> research / retrieval 子任务
- 铁手 -> coding / automation 子任务
- 笔官 -> writing / drafting 子任务
- 问隙 -> testing / validation / QA 子任务
- 观象 -> structured ops / cron / recurring execution 子任务
- 片场 -> 媒体调度或生成子任务

建议规则：
- 能直接做就不 spawn
- 只有独立子任务才 spawn
- 高风险结果必须回主 Agent review

---

### 3. 会话内推进
若任务还不值得 spawn，但又需要结构化推进，可由墨影在主会话内按角色协议模拟：
- 先按探针方式调研
- 再按铁手方式实现
- 再按问隙方式验证

适用：
- 中等复杂度
- 单次闭环
- 不值得开多个隔离会话

---

### 4. 结果回收
优先使用：
- `sessions_history`
- `sessions_send`

用途：
- 拉取子任务结果
- 补充追问
- 要求补齐 handoff

规则：
- handoff 不完整时，不进入 Released
- 若结果冲突，进入 Review，由墨影裁决
- 多步骤任务可先由承枢回收阶段 handoff，再交墨影终审

---

### 5. 运行中干预
优先使用：
- `subagents`

用途：
- 查看当前子任务
- 杀掉跑偏任务
- 对正在运行的子任务发 steering 指令

适用：
- 子任务跑偏
- 目标变更
- 需要中途补限制

---

### 6. 记忆与文档检索
优先区分：
- 文档 / 本地资料 -> `qmd` 或读文件
- 历史过程 -> `memos`
- 长期上下文 -> `openviking`

说明：
- 多 agent 协作前，应先按既定检索顺序 recall
- 不应每次派发都无脑全量 recall

---

## 三、推荐运行路径

### 路径 A：简单任务
`Inbox -> Judging -> Direct Execute -> Review -> Released`

运行建议：
- 墨影直接执行
- 不 spawn

### 路径 B：复杂但不值得真实派发
`Inbox -> Judging -> Decomposed -> Direct Internal Steps -> Review -> Released`

运行建议：
- 主会话内按角色协议模拟推进
- 不真实开多个隔离会话

### 路径 C：复杂且适合真实多 agent
`Inbox -> Judging -> Decomposed -> Assigned -> In Progress -> Handoff -> Review -> Released`

运行建议：
- 用 `sessions_spawn` 派发
- 用 `sessions_history` 回收
- 用 `subagents` 做干预
- 必要时由承枢做编排协调
- 墨影统一 review 与 release

### 路径 D：高风险复杂任务
`Inbox -> Judging -> Decomposed -> Assigned -> In Progress -> Handoff -> Review -> Released / Stopped`

运行建议：
- 可分发执行稿
- 不下放最终放行

---

## 四、并行与串行映射

### 适合并行
满足以下条件才建议并行 `sessions_spawn`：
1. 子任务彼此独立
2. 汇总成本低
3. 并行明显节省时间
4. 不会扩大风险

### 典型并行
- 探针查资料 + 观象执行例行任务
- 笔官起结构 + 片场做风格方向草案
- 铁手实现 + 问隙先设计验证点

### 不适合并行
- 路线未定时的实现与验证
- 文案未定稿时的正式素材
- 强依赖前一步结果的链路

---

## 五、最小运行时建议

若要让这套方案真进入“可执行阶段”，建议至少配齐：
- 主 Agent 的总控 prompt
- 子 agent 的命名映射
- handoff 协议
- review 门禁
- 任务状态记录（JSONL 或任务卡）

建议进一步增加：
- 控制台状态板
- 手动 release 清单
- 高风险动作确认清单
- 承枢视角的阶段状态板

---

## 六、一句话原则

> Prompt 决定怎么协作，OpenClaw 决定怎么执行；规则不映射到运行时，多 Agent 方案就只是纸面制度。
