# OpenClaw Agent Team

一个面向 OpenClaw 的 **多 Agent 协作治理规范仓**。

> 它不是多 Agent runtime 引擎，也不是控制台源码仓。  
> 它负责把：**分工、边界、委派、交接、复核、放行、观测、上线** 这整套规则钉清楚。

<p align="center">
  <img src="https://img.shields.io/badge/OpenClaw-Multi--Agent-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Main%20Agent-%E5%A2%A8%E5%BD%B1-black?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Coordination-%E6%89%BF%E6%9E%A2-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Governance-3%20Layers-green?style=for-the-badge" />
</p>

---

## 📌 目录

- [这是什么](#-这是什么)
- [核心原则](#-核心原则)
- [团队结构](#-团队结构)
- [三层治理架构](#-三层治理架构)
- [快速开始](#-快速开始)
- [适用场景](#-适用场景)
- [关键文档地图](#-关键文档地图)
- [示例与样例](#-示例与样例)
- [项目现状](#-项目现状)
- [许可证](#-许可证)

---

## 🎯 这是什么

`openclaw-agent-team` 是一套可直接复用的 **OpenClaw 多 Agent 治理层规范**。

它提供：
- **主 Agent 总控规则** —— 让主 Agent 保持总控，不退化为消息中转站
- **附属 Agent 分工方案** —— 清晰的角色边界与职责定义
- **多步骤任务编排机制** —— 复杂的任务拆解与协调流程
- **交接 / Review / Release 纪律** —— 稳定的质量门禁与放行规则
- **Runtime 观测口径** —— 统一的字段语言与状态模型
- **Control Center 接入契约** —— 与外部控制台的集成规范

**它解决的核心问题：**
| 问题 | 后果 | 本方案解决方式 |
|------|------|----------------|
| 主 Agent 既当总控又亲自乱下场 | 职责混乱、效率低下 | 明确总控边界，简单任务直做、复杂任务拆解 |
| Specialist 没边界 | 越权、重复劳动 | 负面边界 + 职责规格 + 交接协议 |
| 多步骤任务没人协调 | Handoff 散落、状态丢失 | 承枢编排层 + 任务生命周期管理 |
| Review/Release 无稳定口径 | 质量不可控、风险不可见 | 质量门禁 + 放行纪律 + 风险分级 |
| Runtime/Console 无统一语言 | 集成困难、观测困难 | 观测 Schema + 控制契约 |

---

## 🧭 核心原则

这套方案的核心哲学，可以用五句话概括：

```
1. 先判断，再调度     —— 主 Agent 先判断任务性质，再决定是否分发
2. 简单任务直接做     —— 不为了显得像团队而硬拆任务
3. 复杂任务才拆解     —— 拆解必须带来效率、质量或风险控制收益
4. 高风险必须复核     —— 附属 Agent 可分析实现，但最终放行权不下放
5. 交接不等于完成     —— 产出后还需 Handoff → Review → 裁决 → 放行
```

**调度意识：**
> 调度是为了解决问题，不是为了显得团队很热闹。

---

## 👥 团队结构

这套团队不是"很多 Agent 平铺着摆在一起"，而是一个三层结构：

```
用户
  ↓
墨影（主 Agent / 唯一总控 / 最终裁决者）
  ↓
承枢（编排协调层 / 过程推进位）
  ↓
专项层（按任务类型拉起，非同时全开）
  ├── 探针（研究情报）
  ├── 笔官（内容成稿）
  ├── 铁手（研发执行）
  ├── 问隙（QA/审查）
  ├── 观象（Structured Ops）
  └── 片场（多媒体调度）
```

### 角色速查表

| 角色 | 定位 | 核心职责 | 一句话理解 |
|------|------|----------|------------|
| **墨影** | 总控中枢 | 任务判断、复杂度定级、最终裁决与放行 | 不是消息中转站，是总控中枢 |
| **承枢** | 编排协调 | 多步骤编排、Handoff 回收、阻塞暴露 | 分担过程劳动，不拿走最终权力 |
| **探针** | 研究情报 | 调研、预研、方案对比、推荐路径 | 把原始信息压缩成可决策结论 |
| **笔官** | 内容成稿 | 文章、汇报稿、脚本、结构化文本 | 产出可直接使用的文本成品 |
| **铁手** | 研发执行 | 代码、脚本、自动化、配置实现 | 给出可验证、可回滚的实现结果 |
| **问隙** | QA/审查 | 测试排障、边界检查、风险补洞 | 结果进入 Release 前的"第二双眼" |
| **观象** | Structured Ops | 巡检、Cron 任务、例行执行、汇总 | 承担日常运营与结构化重复任务 |
| **片场** | 多媒体调度 | 生图/视频/修图任务分发与汇总 | 调度中枢，不是万能执行器 |

**详细规格见：** `docs/agent-specifications.md`

---

## 🏗️ 三层治理架构

本项目形成三层完整结构，从流程到纪律到闭环：

```
┌─────────────────────────────────────────────────────────┐
│  第三层：治理闭环                                         │
│  draft → reviewable → releasable → released             │
│  统一字段语言 + 分阶段上线 + Control Center 契约          │
├─────────────────────────────────────────────────────────┤
│  第二层：边界与运行纪律                                   │
│  负面边界 + A2A 委派协议 + Session 卫生                   │
├─────────────────────────────────────────────────────────┤
│  第一层：组织与流程                                       │
│  主 Agent 判断 + Specialist 分工 + 任务拆解 + Handoff    │
└─────────────────────────────────────────────────────────┘
```

### 第一层：组织与流程

**解决：** 主 Agent 怎么判断、Specialist 怎么分工、多步骤任务怎么拆、Lifecycle/Handoff/Review 怎么走

**核心文档：**
- `docs/main-agent-decision-flow.md` — 主 Agent 决策流程
- `docs/agent-routing-matrix.md` — 任务 → 角色路由矩阵
- `docs/task-lifecycle.md` — 任务生命周期定义
- `docs/handoff-protocol.md` — 交接协议与格式
- `docs/review-quality-gates.md` — 质量门禁标准

### 第二层：边界与运行纪律

**解决：** 谁不该做什么、委派请求怎么结构化、Session 什么时候新开/复用/停用

**核心文档：**
- `docs/negative-boundaries.md` — 各角色负面边界（不该做什么）
- `docs/a2a-delegation-protocol.md` — Agent 间委派协议
- `docs/session-hygiene.md` — Session 管理规范

### 第三层：治理闭环

**解决：** 状态定义、统一字段、团队编组稳定、分阶段上线、Control Center 看见什么

**核心文档：**
- `docs/release-discipline.md` — Release 纪律与状态流转
- `docs/observability-schema.md` — 可观测性 Schema
- `docs/roster-discipline.md` — 团队编组规范
- `docs/staged-rollout.md` — 分阶段上线策略
- `docs/control-center-contract.md` — 控制台接入契约

---

## 🚀 快速开始

### 三种接入方式

| 方式 | 适合场景 | 建议顺序 |
|------|----------|----------|
| **A. 只跑 Prompt** | 验证组织结构是否顺手，暂不接 Runtime | `QUICKSTART.md` → `prompt/PROMPT_SHORT.md` |
| **B. 工作区治理模板** | 放进 OpenClaw Workspace 做长期规范 | `INSTALL.md` → `docs/workspace-bootstrap.md` |
| **C. 接入真实多 Agent** | 让制度进入运行层，接 Control Center | `docs/openclaw-runtime-mapping.md` → `docs/control-center-contract.md` |

### 3 分钟最小验证

无论选择哪种方式，建议先跑通这三个验证任务：

| 任务类型 | 示例 | 预期行为 |
|----------|------|----------|
| **简单任务** | "帮我润色这段话" | 主 Agent 直接做，不过度拆解 |
| **复杂任务** | "先调研方案，再写汇报，再配图" | 先说明分工方案，再派发，最后汇总 |
| **高风险任务** | "帮我改生产配置并发布" | 识别为高风险，先给方案/执行稿，不直接落地 |

**验证通过标准：**
1. ✅ 简单任务没被过度拆解
2. ✅ 复杂任务先说明分工再拆解
3. ✅ 高风险任务没被直接执行到底
4. ✅ 子 Agent 没越权拍最终结论

---

## ✅ 适用场景

### 适合使用本方案的情况

- ✅ 想给 OpenClaw 建一套清晰的主 Agent + Specialist 团队
- ✅ 想让主 Agent 保持总控而不是退化为转发器
- ✅ 想让高风险任务有 Review / Release 纪律
- ✅ 想给 Control Center / Runtime 一个统一治理口径
- ✅ 想先从 Prompt 起步，再逐步接运行时

### 不太适合的情况

- ❌ 只需要一个极轻量单 Agent
- ❌ 完全不需要 Specialist 分工
- ❌ 不关心 Handoff、Review、Release、Risk 的使用场景
- ❌ 只想做一次性演示，不打算长期运营

---

## 📚 关键文档地图

### 按需求查找

| 如果你想... | 先看这些文档 |
|------------|-------------|
| 理解项目定位 | `docs/v1-positioning.md` · `docs/upgrade-announcement.md` |
| 直接拿来用 | `QUICKSTART.md` · `prompt/one-shot-prompt.md` |
| 理解主 Agent 判断逻辑 | `docs/main-agent-decision-flow.md` · `docs/task-complexity-levels.md` |
| 理解角色分工 | `docs/agent-specifications.md` · `docs/agent-routing-matrix.md` |
| 做好交接与复核 | `docs/handoff-protocol.md` · `docs/review-quality-gates.md` |
| 理解三层治理 | `docs/release-discipline.md` · `docs/observability-schema.md` |
| 接入 Runtime | `docs/openclaw-runtime-mapping.md` · `runtime/` 示例 |
| 接入控制台 | `docs/control-center-contract.md` · `docs/control-center-integration.md` |
| 配置多媒体调度 | `docs/pianchang-orchestration.md` · `rules/pianchang-*.md` |

### 完整文档分类

**1. 定位与整体设计**
`docs/v1-positioning.md` · `docs/architecture.md` · `docs/final-audit-and-upgrade-summary.md`

**2. 判断、分发、编排**
`docs/main-agent-decision-flow.md` · `docs/agent-routing-matrix.md` · `docs/agent-specifications.md`

**3. 生命周期、交接、风险**
`docs/task-lifecycle.md` · `docs/handoff-protocol.md` · `docs/review-quality-gates.md` · `docs/risk-and-review.md`

**4. 第二层纪律**
`docs/negative-boundaries.md` · `docs/a2a-delegation-protocol.md` · `docs/session-hygiene.md`

**5. 第三层治理**
`docs/release-discipline.md` · `docs/observability-schema.md` · `docs/staged-rollout.md` · `docs/control-center-contract.md`

**6. OpenClaw 接入**
`docs/openclaw-runtime-mapping.md` · `docs/runtime-state-model.md` · `openclaw.example.json`

**7. 多媒体体系**
`docs/pianchang-orchestration.md` · `rules/pianchang-image-input.md` · `rules/pianchang-video-input.md`

---

## 📋 示例与样例

### Playbooks（场景化示例）

| 文件 | 说明 |
|------|------|
| `examples/simple-task-playbook.md` | 简单任务处理流程示例 |
| `examples/complex-task-playbook.md` | 复杂任务拆解与编排示例 |
| `examples/example-delegation-patterns.md` | 常见委派模式示例 |
| `examples/real-openclaw-multi-agent-playbook.md` | 真实 OpenClaw 多 Agent 场景 |
| `examples/governance-playbook-release-chain.md` | 发布链治理示例 |
| `examples/governance-playbook-ops-escalation.md` | 运营升级处理示例 |

### Runtime 样例（结构化数据）

| 文件 | 说明 |
|------|------|
| `runtime/task-board.example.jsonl` | 任务板状态示例 |
| `runtime/handoff-event.example.json` | Handoff 事件格式 |
| `runtime/review-card.example.md` | Review Card 模板 |
| `runtime/release-decision.example.json` | Release 决策格式 |

---

## 📊 项目现状

当前仓库已完成从"角色说明仓"到"治理规范仓"的升级：

- ✅ 角色结构重构（墨影/承枢/专项层三层结构）
- ✅ 第二层纪律补硬（负面边界 + 委派协议 + Session 卫生）
- ✅ 第三层治理闭环（Release 纪律 + 观测 Schema + 控制契约）
- ✅ 正式总结文档（`docs/final-audit-and-upgrade-summary.md`）
- ✅ Runtime 治理样例（`runtime/` 目录）
- ✅ Governance Playbooks（`examples/` 目录）

> **现在可以直接拿来搭建 OpenClaw 多 Agent 治理层。**

---

## 📄 许可证

MIT License · 详见 `LICENSE` 文件

---

## 🔗 相关链接

- **GitHub**: https://github.com/MontellaGreat/openclaw-agent-team
- **OpenClaw 文档**: https://docs.openclaw.ai
- **社区**: https://discord.com/invite/clawd
