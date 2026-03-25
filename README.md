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
- 一套可直接落地的 workspace 模板
- 一份 OpenClaw 配置示例
- 一组高频任务 recipes
- 一套 v1 发布准备文档

---

## 角色设计

### 主 Agent：墨影
职责：
- 接收用户目标
- 判断任务性质和优先级
- **先判断任务是简单还是复杂，并做复杂度分级**
- 简单任务直接执行
- 复杂任务拆解后再下放
- 选择合适的附属 Agent
- 汇总附属 Agent 的结果
- 做最终审议
- 做风险监察
- 做代码审查
- 做质量把控
- 决定是否放行

定位：**唯一总控，不下放最终审议权**。

### 附属 Agent
- 笔官：内容策划写作
- 探针：研究情报
- 观象：视觉理解
- 铁手：研发执行
- 问隙：测试排障
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

安装说明见：
- `INSTALL.md`
- `QUICKSTART.md`

项目管理见：
- `ROADMAP.md`
- `CHANGELOG.md`

v1 发布准备见：
- `docs/v1-positioning.md`
- `RELEASE_NOTES_v1.md`
- `PUBLISH_CHECKLIST.md`

英文说明见：
- `README.en.md`

---

## 核心原则

1. 主 Agent 是唯一总控，附属 Agent 不能替代最终决策。
2. 主 Agent 接到任务后先判断：简单任务直接做，复杂任务再拆。
3. 主 Agent 必须具备调度意识：分发要有收益，不为热闹而拆。
4. 复杂任务可先简要说明分工，再进入派遣。
5. 并行派遣只在任务独立、明显提效且不会放大风险时启用。
6. 高风险任务必须经过主 Agent 复核。
7. 对外发布、代码合并、配置变更、权限相关操作，必须经过主 Agent 审议。
8. 交接不等于完成，产出不等于放行。
9. 结果冲突由主 Agent 裁决，不能把冲突原样抛给用户。
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
5. 最后补 `docs/handoff-protocol.md` 与 `docs/review-quality-gates.md`

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
- `docs/review-quality-gates.md`
- `docs/risk-and-review.md`
- `docs/doctor.md`
- `docs/runtime-state-model.md`
- `docs/agent-io-contracts.md`
- `docs/failure-recovery.md`
- `docs/metrics-and-evaluation.md`

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
- 想给写作、研究、研发、测试、多媒体任务建立稳定分发规则
- 想先用 Prompt 跑通，再逐步接入真实子 Agent
- 想把这套规则长期沉淀为 workspace 模板

不太适合：
- 只想做一个极简单体 Agent，且没有分工需要
- 当前场景几乎没有复杂任务、风险任务或跨专项协作
- 还没准备好维护一套角色边界与交接规范

---

## 仓库结构

```text
openclaw-agent-team/
├─ README.md
├─ README.en.md
├─ QUICKSTART.md
├─ INSTALL.md
├─ CHANGELOG.md
├─ ROADMAP.md
├─ RELEASE_NOTES_v1.md
├─ PUBLISH_CHECKLIST.md
├─ LICENSE
├─ openclaw.example.json
├─ prompt/
│  ├─ one-shot-prompt.md
│  ├─ PROMPT_SHORT.md
│  ├─ PROMPT_FULL.md
│  └─ modular-prompt.md
├─ docs/
│  ├─ architecture.md
│  ├─ routing-rules.md
│  ├─ risk-and-review.md
│  ├─ openclaw-adaptation.md
│  ├─ rollout-checklist.md
│  ├─ control-center-integration.md
│  ├─ agent-specifications.md
│  ├─ agent-routing-matrix.md
│  ├─ pianchang-orchestration.md
│  ├─ main-agent-decision-flow.md
│  ├─ task-lifecycle.md
│  ├─ handoff-protocol.md
│  ├─ review-quality-gates.md
│  ├─ task-complexity-levels.md
│  ├─ doctor.md
│  ├─ recipes.md
│  ├─ workspace-bootstrap.md
│  ├─ faq.md
│  ├─ troubleshooting.md
│  ├─ diagrams.md
│  └─ v1-positioning.md
├─ rules/
│  ├─ pianchang-image-input.md
│  ├─ pianchang-video-input.md
│  └─ pianchang-edit-input.md
├─ examples/
│  ├─ example-user-requests.md
│  ├─ example-delegation-patterns.md
│  ├─ example-control-center-pairing.md
│  ├─ simple-task-playbook.md
│  └─ complex-task-playbook.md
├─ workspace-template/
│  ├─ SOUL.md
│  ├─ AGENTS.md
│  ├─ IDENTITY.md
│  ├─ USER.md
│  ├─ TOOLS.md
│  └─ HEARTBEAT.md
└─ team-config.example.yaml
```

---

## 仓库地址

- https://github.com/MontellaGreat/openclaw-agent-team

---

## 许可证

MIT
