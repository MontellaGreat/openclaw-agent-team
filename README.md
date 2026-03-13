# OpenClaw Agent Team

一个可直接复用的 **OpenClaw 多 Agent 分工方案**。

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

---

## 角色设计

### 主 Agent：墨影
职责：
- 接收用户目标
- 判断任务性质和优先级
- **先判断任务是简单还是复杂**
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

规则文件见：
- `rules/pianchang-image-input.md`
- `rules/pianchang-video-input.md`
- `rules/pianchang-edit-input.md`

示例流程见：
- `examples/simple-task-playbook.md`
- `examples/complex-task-playbook.md`

安装说明见：
- `INSTALL.md`

项目管理见：
- `ROADMAP.md`
- `CHANGELOG.md`

英文说明见：
- `README.en.md`

---

## 核心原则

1. 主 Agent 是唯一总控，附属 Agent 不能替代最终决策。
2. 主 Agent 接到任务后先判断：简单任务直接做，复杂任务再拆。
3. 高风险任务必须经过主 Agent 复核。
4. 对外发布、代码合并、配置变更、权限相关操作，必须经过主 Agent 审议。
5. 优先追求稳定、清晰、可执行。
6. 控制团队复杂度：能单线就不并行，能并行就不串行，能直出就不层层会审。
7. 附属 Agent 必须有明确任务边界、交付格式和完成标准。
8. 结果冲突由主 Agent 裁决，不能把冲突原样抛给用户。
9. 输出结论优先、简洁清晰、少废话。

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

## 仓库结构

```text
openclaw-agent-team/
├─ README.md
├─ README.en.md
├─ INSTALL.md
├─ CHANGELOG.md
├─ ROADMAP.md
├─ LICENSE
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
│  └─ main-agent-decision-flow.md
├─ rules/
│  ├─ pianchang-image-input.md
│  ├─ pianchang-video-input.md
│  └─ pianchang-edit-input.md
└─ examples/
   ├─ example-user-requests.md
   ├─ example-delegation-patterns.md
   ├─ example-control-center-pairing.md
   ├─ simple-task-playbook.md
   └─ complex-task-playbook.md
```

---

## 仓库地址

- https://github.com/MontellaGreat/openclaw-agent-team

---

## 许可证

MIT
