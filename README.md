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

## 目录

- [这是什么](#这是什么)
- [快速开始](#快速开始)
- [为什么这套方案有价值](#为什么这套方案有价值)
- [当前项目定位](#当前项目定位)
- [三层结构](#三层结构)
- [团队结构](#团队结构)
- [推荐阅读路径](#推荐阅读路径)
- [关键文档地图](#关键文档地图)
- [示例与 runtime 样例](#示例与-runtime-样例)
- [适用场景](#适用场景)
- [项目现状](#项目现状)
- [仓库地址](#仓库地址)
- [许可证](#许可证)

---

## 这是什么

`openclaw-agent-team` 现在不是一个“只放 prompt 的仓库”。

它是一套可以直接复用的：
- **主 Agent 总控规则**
- **附属 Agent 分工方案**
- **多步骤任务编排机制**
- **交接 / review / release 纪律**
- **runtime 观测口径**
- **control center 接入契约**

你可以把它理解成：

> **OpenClaw 多 Agent 的制度层 / 治理层 / 协作规范层。**

它解决的核心问题是：
- 主 Agent 既当总控又亲自乱下场
- specialist 没边界，容易越权或重复劳动
- 多步骤任务没人协调，handoff 容易散
- review、release、risk 没有稳定口径
- runtime 和 control center 没有统一字段语言

---

## 为什么这套方案有价值

很多多 Agent 项目会停在这一步：
- 角色很多
- prompt 很长
- 但运行一久就开始乱

这个项目的重点不是“再发明几个 agent”，而是把下面这些东西补硬：
- 谁做什么
- 谁不该做什么
- 什么时候值得派发
- 怎么交接
- 怎么审
- 怎么放
- 怎么观测
- 怎么分阶段上线

所以它更适合：
- 想长期跑，而不是只演示一下
- 想让主 Agent 保持总控，而不是退化成消息中转站
- 想把制度层和 runtime / control center 接起来的人

---

## 当前项目定位

一句话：

> `openclaw-agent-team` 是一个 **面向 OpenClaw 的多 Agent 协作治理规范仓**。

它不是：
- 多 Agent runtime 框架实现仓
- control center UI 源码仓
- 自动调度引擎仓

它主要负责：
- 团队分工
- 风险控制
- handoff 规范
- review / release 纪律
- observability 口径
- rollout 路线
- control center contract

正式总结见：
- `docs/final-audit-and-upgrade-summary.md`
- `docs/upgrade-announcement.md`

---

## 三层结构

本项目目前已经形成三层完整结构。

### 第一层：组织与流程
解决：
- 主 Agent 怎么判断
- specialist 怎么分工
- 多步骤任务怎么拆
- lifecycle / handoff / review 怎么走

核心文档：
- `docs/main-agent-decision-flow.md`
- `docs/agent-routing-matrix.md`
- `docs/task-lifecycle.md`
- `docs/handoff-protocol.md`
- `docs/review-quality-gates.md`

### 第二层：边界与运行纪律
解决：
- 谁不该做什么
- 委派请求怎么结构化
- session 什么时候新开 / 复用 / 停用

核心文档：
- `docs/negative-boundaries.md`
- `docs/a2a-delegation-protocol.md`
- `docs/session-hygiene.md`

### 第三层：治理闭环
解决：
- 什么叫 draft / reviewable / releasable / released
- task board / handoff / review / release 用什么统一字段
- 团队编组怎么长期稳定
- 怎么分阶段上线
- control center 应该看见什么

核心文档：
- `docs/release-discipline.md`
- `docs/observability-schema.md`
- `docs/roster-discipline.md`
- `docs/staged-rollout.md`
- `docs/control-center-contract.md`

---

## 团队结构

这套团队不是“很多 agent 平铺着摆在一起”，而是一个三层结构：

```text
用户
  ↓
墨影（主 Agent / 唯一总控）
  ↓
承枢（编排协调层）
  ↓
专项层（探针 / 笔官 / 铁手 / 问隙 / 观象 / 片场）
```

### 第一层：墨影
定位：**唯一总控 / 最终裁决者 / 放行者**

负责：
- 接收用户目标
- 判断任务性质、复杂度、风险等级
- 决定直做 / 拆解 / 复核
- 决定是否需要承枢介入
- 做最终裁决、最终审议与最终放行

一句话理解：
- **墨影不是消息中转站，而是总控中枢。**

### 第二层：承枢
定位：**编排协调层 / 过程推进位**

负责：
- 多步骤任务编排
- 阶段推进
- handoff 回收
- 阻塞、依赖与缺口暴露
- 向墨影提交阶段汇总

不负责：
- 最终裁决
- 最终放行
- 替 specialist 做结果

一句话理解：
- **承枢分担的是过程劳动，不拿走最终权力。**

### 第三层：专项层
专项层不是同时全开，而是按任务类型拉起。

#### 探针
- 研究情报位
- 负责调研、预研、资料比较、推荐路径

#### 笔官
- 内容成稿位
- 负责文章、提纲、说明文、汇报稿、脚本等文本成品

#### 铁手
- 研发执行位
- 负责代码、脚本、自动化、配置执行稿

#### 问隙
- QA / 审查位
- 负责测试排障、边界检查、风险补洞、放行建议

#### 观象
- structured ops 位
- 负责巡检、cron、例行执行、稳定结构化任务

#### 片场
- 多媒体调度位
- 负责把生图 / 视频 / 修图任务分发给对应子能力并汇总结果

### 团队结构的关键点
- `墨影` 保留最终总控权
- `承枢` 负责复杂链路推进
- specialist 只做明确子任务，不越权拍板
- `问隙` 与 `铁手` 默认形成实现 / QA 双位结构
- `观象` 不再是视觉理解位，而是 structured ops 位
- `片场` 是调度中枢，不是万能多媒体执行器

详细规格见：
- `docs/agent-specifications.md`
- `docs/agent-routing-matrix.md`
- `docs/pianchang-orchestration.md`

---

## 快速开始

### 方式 A：只先跑 prompt
适合：
- 想先验证组织结构是否顺手
- 暂时不接 runtime / control center

建议顺序：
1. `QUICKSTART.md`
2. `prompt/PROMPT_SHORT.md`
3. `prompt/one-shot-prompt.md`

### 方式 B：作为工作区治理模板
适合：
- 想直接把它放进 OpenClaw workspace
- 想把规则做成长期团队规范

建议顺序：
1. `INSTALL.md`
2. `docs/workspace-bootstrap.md`
3. `workspace-template/`

### 方式 C：接入真实多 Agent / 控制台
适合：
- 想让这套制度进入运行层
- 想把 control center 也接上

建议顺序：
1. `docs/openclaw-runtime-mapping.md`
2. `docs/observability-schema.md`
3. `docs/control-center-contract.md`
4. `docs/control-center-integration.md`

---

## 推荐阅读路径

### 如果你只想先理解项目
1. `docs/upgrade-announcement.md`
2. `README.md`
3. `docs/final-audit-and-upgrade-summary.md`

### 如果你想直接拿来用
1. `QUICKSTART.md`
2. `prompt/one-shot-prompt.md`
3. `docs/main-agent-decision-flow.md`
4. `docs/agent-routing-matrix.md`

### 如果你想理解第二层纪律
1. `docs/negative-boundaries.md`
2. `docs/a2a-delegation-protocol.md`
3. `docs/session-hygiene.md`

### 如果你想理解第三层治理闭环
1. `docs/release-discipline.md`
2. `docs/observability-schema.md`
3. `docs/roster-discipline.md`
4. `docs/staged-rollout.md`
5. `docs/control-center-contract.md`

### 如果你准备做 runtime / control center 接入
1. `docs/openclaw-runtime-mapping.md`
2. `runtime/task-board.example.jsonl`
3. `runtime/handoff-event.example.json`
4. `runtime/release-decision.example.json`
5. `docs/control-center-integration.md`

---

## 关键文档地图

### 1. 定位与整体设计
- `docs/v1-positioning.md`
- `docs/architecture.md`
- `docs/openclaw-adaptation.md`
- `docs/final-audit-and-upgrade-summary.md`
- `docs/upgrade-announcement.md`

### 2. 判断、分发、编排
- `docs/main-agent-decision-flow.md`
- `docs/agent-routing-matrix.md`
- `docs/routing-rules.md`
- `docs/task-complexity-levels.md`
- `docs/agent-specifications.md`

### 3. 生命周期、交接、风险与恢复
- `docs/task-lifecycle.md`
- `docs/handoff-protocol.md`
- `docs/review-quality-gates.md`
- `docs/risk-and-review.md`
- `docs/failure-recovery.md`
- `docs/doctor.md`

### 4. 第二层纪律
- `docs/negative-boundaries.md`
- `docs/a2a-delegation-protocol.md`
- `docs/session-hygiene.md`

### 5. 第三层治理
- `docs/release-discipline.md`
- `docs/observability-schema.md`
- `docs/roster-discipline.md`
- `docs/staged-rollout.md`
- `docs/control-center-contract.md`
- `docs/metrics-and-evaluation.md`

### 6. OpenClaw 接入
- `docs/openclaw-runtime-mapping.md`
- `docs/runtime-state-model.md`
- `docs/agent-io-contracts.md`
- `docs/control-center-integration.md`
- `openclaw.example.json`

### 7. 多媒体体系
- `docs/pianchang-orchestration.md`
- `rules/pianchang-image-input.md`
- `rules/pianchang-video-input.md`
- `rules/pianchang-edit-input.md`

---

## 示例与 runtime 样例

### 示例 playbooks
- `examples/simple-task-playbook.md`
- `examples/complex-task-playbook.md`
- `examples/example-delegation-patterns.md`
- `examples/real-openclaw-multi-agent-playbook.md`
- `examples/governance-playbook-release-chain.md`
- `examples/governance-playbook-ops-escalation.md`

### runtime 示例
- `runtime/task-board.example.jsonl`
- `runtime/handoff.example.md`
- `runtime/handoff-event.example.json`
- `runtime/review-card.example.md`
- `runtime/release-decision.example.json`

---

## 适用场景

适合：
- 想给 OpenClaw 建一套清晰的主 Agent + specialist 团队
- 想让主 Agent 保持总控而不是退化为转发器
- 想让高风险任务有 review / release 纪律
- 想给 control center / runtime 一个统一治理口径
- 想先从 prompt 起步，再逐步接运行时的人

不太适合：
- 只需要一个极轻量单 agent
- 完全不需要 specialist 分工
- 不关心 handoff、review、release、risk 的使用场景

---

## 项目现状

当前仓库已经完成：
- 角色结构重构
- 第二层纪律补硬
- 第三层治理闭环
- 正式总结
- 对外升级公告
- runtime 治理样例
- governance playbooks

也就是说，它现在已经从“角色说明仓”升级成：

> **可以直接拿来搭建 OpenClaw 多 Agent 治理层的规范仓。**

---

## 仓库地址

- GitHub: `https://github.com/MontellaGreat/openclaw-agent-team`

---

## 许可证

MIT
