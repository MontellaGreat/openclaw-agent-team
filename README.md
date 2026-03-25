# OpenClaw Agent Team

一个可直接复用的 **OpenClaw 多 Agent 分工方案**。

---

## 目录

- [这是什么](#这是什么)
- [角色设计](#角色设计)
- [核心原则](#核心原则)
- [快速开始](#快速开始)
- [推荐阅读路径](#推荐阅读路径)
- [关键文档索引](#关键文档索引)
- [适用场景](#适用场景)
- [仓库结构](#仓库结构)
- [仓库地址](#仓库地址)
- [许可证](#许可证)

目标：
- 用一段提示词定义主 Agent + 附属 Agent 的职责边界
- 让主 Agent 负责总控、分发、复核、放行
- 让附属 Agent 各司其职，避免越权
- 尽量做到：**换一台 OpenClaw，也能靠一段提示词快速启用**

---

## 这是什么

这是一个“多 Agent 团队协作蓝图”，不是某个特定业务项目。

它解决的问题是：
- 主 Agent 容易既当总控又亲自下场，角色混乱
- 附属 Agent 没边界，容易越权、跑偏、重复劳动
- 缺少统一的任务分发、审议、放行和风险控制规则
- 多步骤任务缺少明确的编排协调层

这个项目给出：
- 一套角色定义
- 一套团队调度规则
- 一段可直接复制使用的总提示词
- 一份适配 OpenClaw 的落地说明
- 一份与 `openclaw-control-center` 的集成说明
- 一份更细的 agent 职责规格说明
- 一份任务分发矩阵
- 一份片场调度规则
- 一套片场子 agent 输入规则
- 一份主 Agent 决策流程
- 一套简单/复杂任务示例流程
- 一份安装文档
- 一份路线图与更新日志
- 一套任务生命周期、交接协议、质量门禁与复杂度分级说明
- 一套负边界、委派协议与 session hygiene 规则
- 一套第三层治理文档（release / observability / roster / rollout / control center）
- 一套可直接落地的 workspace 模板
- 一份 OpenClaw 配置示例
- 一组高频任务 recipes
- 一套 v1 / v2 演进可用的制度层文档

---

## 角色设计

### 主 Agent：墨影
职责：
- 接收用户目标
- 判断任务性质和优先级
- 先判断任务是简单还是复杂，并做复杂度分级
- 简单任务直接执行
- 复杂任务拆解后再下放
- 决定由谁承担主责
- 做最终审议
- 做风险监察
- 做质量把控
- 决定是否放行

定位：**唯一总控，不下放最终审议权**。

### 编排协调层：承枢
职责：
- 在多步骤任务中承担编排协调劳动
- 跟踪状态推进
- 回收 handoff
- 暴露阻塞、依赖与缺口
- 向墨影提交阶段汇总

定位：**流程推进位，不替代墨影拍板**。

### 附属 Agent
- 笔官：内容成稿
- 探针：研究情报
- 铁手：研发执行
- 问隙：测试排障 / QA / 审查
- 观象：日常运营 / 例行执行 / structured ops
- 片场：多媒体调度中枢
  - 片场-生图
  - 片场-视频
  - 片场-修图

详细规格见：
- `docs/agent-specifications.md`
- `docs/agent-routing-matrix.md`
- `docs/pianchang-orchestration.md`
- `docs/main-agent-decision-flow.md`
- `docs/task-lifecycle.md`
- `docs/handoff-protocol.md`
- `docs/negative-boundaries.md`
- `docs/a2a-delegation-protocol.md`
- `docs/session-hygiene.md`
- `docs/review-quality-gates.md`
- `docs/task-complexity-levels.md`
- `docs/runtime-state-model.md`
- `docs/agent-io-contracts.md`
- `docs/failure-recovery.md`

规则文件见：
- `rules/pianchang-image-input.md`
- `rules/pianchang-video-input.md`
- `rules/pianchang-edit-input.md`

示例流程见：
- `examples/simple-task-playbook.md`
- `examples/complex-task-playbook.md`
- `examples/example-delegation-patterns.md`
- `examples/governance-playbook-release-chain.md`
- `examples/governance-playbook-ops-escalation.md`

安装说明见：
- `INSTALL.md`
- `QUICKSTART.md`

项目管理见：
- `ROADMAP.md`
- `CHANGELOG.md`

正式总结见：
- `docs/final-audit-and-upgrade-summary.md`
- `docs/upgrade-announcement.md`

英文说明见：
- `README.en.md`

---

## 核心原则

1. 墨影是唯一总控，附属 Agent 不能替代最终决策。
2. 墨影接到任务后先判断：简单任务直接做，复杂任务再拆。
3. 多步骤任务可由承枢承担编排协调劳动，但不替代墨影拍板。
4. 分发必须带来收益，不为热闹而拆。
5. 并行派遣只在任务独立、明显提效且不会放大风险时启用。
6. 高风险任务必须经过墨影复核。
7. 对外发布、代码合并、配置变更、权限相关操作，必须经过墨影审议。
8. 交接不等于完成，产出不等于放行。
9. 结果冲突由墨影裁决，不能把冲突原样抛给用户。
10. 输出结论优先、简洁清晰、少废话。

---

## 快速开始

### 方案 A：只用提示词
- 精简版：`prompt/PROMPT_SHORT.md`
- 完整版：`prompt/PROMPT_FULL.md`
- 单段版：`prompt/one-shot-prompt.md`

### 方案 B：作为项目模板
把本仓库连同文档一起放进工作区，在 OpenClaw 中作为团队协作规范使用。

### 方案 C：配合 Control Center 使用
如果你还想要一个可视化控制台来观察多 Agent 的运行状态，可以配合：
- `TianyiDataScience/openclaw-control-center`

集成说明见：
- `docs/control-center-integration.md`
- `examples/example-control-center-pairing.md`

---

## 推荐阅读路径

### 如果你只想先跑起来
1. 先读 `QUICKSTART.md`
2. 再读 `prompt/PROMPT_SHORT.md`
3. 再读 `INSTALL.md`
4. 最后用 `examples/simple-task-playbook.md` 做一次最小验证

### 如果你要按团队方式长期使用
1. 先读 `docs/v1-positioning.md`
2. 再读 `docs/main-agent-decision-flow.md`
3. 再读 `docs/agent-routing-matrix.md`
4. 再读 `docs/task-lifecycle.md`
5. 再补 `docs/handoff-protocol.md` 与 `docs/review-quality-gates.md`
6. 再补 `docs/negative-boundaries.md`
7. 再补 `docs/a2a-delegation-protocol.md`
8. 再补 `docs/session-hygiene.md`
9. 再补 `docs/runtime-state-model.md`
10. 再补 `docs/agent-io-contracts.md`
11. 再补 `docs/failure-recovery.md`
12. 最后看 `docs/openclaw-runtime-mapping.md`

### 如果你准备做真实多 Agent 接入
1. 先读 `QUICKSTART.md`
2. 再读 `INSTALL.md`
3. 再读 `docs/workspace-bootstrap.md`
4. 再读 `openclaw.example.json`
5. 再看 `docs/recipes.md`

---

## 关键文档索引

### 1. 定位与整体设计
- `docs/v1-positioning.md`
- `docs/architecture.md`
- `docs/openclaw-adaptation.md`
- `docs/openclaw-runtime-mapping.md`

### 2. 主 Agent 判断与分发
- `docs/main-agent-decision-flow.md`
- `docs/routing-rules.md`
- `docs/agent-routing-matrix.md`
- `docs/task-complexity-levels.md`

### 3. 生命周期、交接与复核
- `docs/task-lifecycle.md`
- `docs/handoff-protocol.md`
- `docs/negative-boundaries.md`
- `docs/a2a-delegation-protocol.md`
- `docs/session-hygiene.md`
- `docs/review-quality-gates.md`
- `docs/risk-and-review.md`
- `docs/doctor.md`
- `docs/runtime-state-model.md`
- `docs/agent-io-contracts.md`
- `docs/failure-recovery.md`
- `docs/release-discipline.md`
- `docs/observability-schema.md`
- `docs/roster-discipline.md`
- `docs/staged-rollout.md`
- `docs/metrics-and-evaluation.md`
- `docs/final-audit-and-upgrade-summary.md`

### 4. 各角色职责说明
- `docs/agent-specifications.md`
- `docs/pianchang-orchestration.md`

### 5. 接入与模板
- `QUICKSTART.md`
- `INSTALL.md`
- `docs/workspace-bootstrap.md`
- `openclaw.example.json`
- `workspace-template/SOUL.md`
- `workspace-template/AGENTS.md`
- `workspace-template/IDENTITY.md`
- `workspace-template/USER.md`
- `workspace-template/TOOLS.md`
- `workspace-template/HEARTBEAT.md`

### 6. 示例与高频工作流
- `examples/simple-task-playbook.md`
- `examples/complex-task-playbook.md`
- `examples/example-delegation-patterns.md`
- `examples/example-user-requests.md`
- `examples/real-openclaw-multi-agent-playbook.md`
- `runtime/task-board.example.jsonl`
- `runtime/handoff.example.md`
- `runtime/review-card.example.md`
- `docs/recipes.md`
- `docs/faq.md`
- `docs/troubleshooting.md`

---

## 适用场景

适合：
- 想把 OpenClaw 从“单个万能 Agent”升级成“有边界的团队协作模式”
- 想让主 Agent 保持总控权，而不是沦为消息中转站
- 想给研究、写作、研发、测试、structured ops、多媒体任务建立稳定分工
- 想先用 Prompt 跑通，再逐步接入真实子 Agent
- 想把这套规则长期沉淀为 workspace 模板

不太适合：
- 只想做一个极简单体 Agent，且没有分工需要
- 当前场景几乎没有复杂任务、风险任务或跨专项协作
- 还没准备好维护一套角色边界与交接规范

---

## 仓库地址

- https://github.com/MontellaGreat/openclaw-agent-team

---

## 许可证

MIT
