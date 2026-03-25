# Upgrade Announcement

`openclaw-agent-team` 已完成一轮从“多 Agent 分工方案”到“多 Agent 协作治理规范仓”的系统升级。

这次升级不是只补了几份文档，也不是只换了角色名字。

它完成的是一条完整升级链：
- 先重构组织结构
- 再补边界与运行纪律
- 再补治理闭环
- 最后补正式总结与 runtime 示例

---

## 这次升级了什么

### 1. 组织结构重构
- `墨影` 保留最终总控、裁决、审议、放行
- 新增 `承枢` 作为编排协调层
- `观象` 重定义为日常运营 / 例行执行 / structured ops
- `问隙` 升级为测试排障 + QA / 审查位

### 2. 第二层补硬
新增：
- `docs/negative-boundaries.md`
- `docs/a2a-delegation-protocol.md`
- `docs/session-hygiene.md`

这意味着：
- 不只定义“谁负责什么”
- 也定义“谁不该做什么”
- 委派、交接、会话使用开始有运行纪律

### 3. 第三层闭环
新增：
- `docs/release-discipline.md`
- `docs/observability-schema.md`
- `docs/roster-discipline.md`
- `docs/staged-rollout.md`
- `docs/control-center-contract.md`

这意味着项目开始具备：
- 放行纪律
- 观测结构
- 编组纪律
- 分阶段上线方法
- 控制台治理契约

### 4. 正式总结与 runtime 示例
新增：
- `docs/final-audit-and-upgrade-summary.md`
- `runtime/handoff-event.example.json`
- `runtime/release-decision.example.json`
- 更新 `runtime/task-board.example.jsonl`

这意味着项目不再只有制度说明，
也开始给出可直接参考的运行时对象样例。

---

## 项目现在的定位

`openclaw-agent-team` 现在更准确的定位是：

**面向 OpenClaw 的多 Agent 协作治理规范仓。**

它不是：
- agent runtime 引擎
- control center 源码仓
- 自动调度框架实现仓

它主要负责的是：
- 分工规则
- 风险与放行
- handoff 与 review
- runtime 治理口径
- control center 接入契约

---

## 为什么这次升级重要

很多多 agent 项目停留在：
- 角色很热闹
- prompt 很长
- 但运行时缺少治理骨架

这次升级解决的不是“再加几个 agent”，而是：
- 让协作不容易跑偏
- 让高风险链路不容易误放
- 让控制台和 runtime 有共同语言
- 让这套制度具备长期运营可能

---

## 现在最适合谁使用

适合：
- 想把 OpenClaw 从单助手升级成有组织的主 Agent 协作系统
- 想让主 Agent 保留总控权，而不是沦为消息转发器
- 想先用制度层跑起来，再逐步接真实 sub-agent / control center
- 想要风险、review、release 有明确口径的人

---

## 下一步建议

如果你是第一次接触这个仓库，建议按这个顺序读：
1. `README.md`
2. `prompt/one-shot-prompt.md`
3. `docs/main-agent-decision-flow.md`
4. `docs/negative-boundaries.md`
5. `docs/release-discipline.md`
6. `docs/observability-schema.md`
7. `docs/final-audit-and-upgrade-summary.md`

如果你准备接 runtime 或 control center，再继续看：
- `docs/control-center-contract.md`
- `runtime/task-board.example.jsonl`
- `runtime/handoff-event.example.json`
- `runtime/release-decision.example.json`

---

## 一句话版本

> 这次升级让 `openclaw-agent-team` 从“多 Agent 角色说明仓”进化成了“多 Agent 协作治理规范仓”。
