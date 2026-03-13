# OpenClaw Multi-Agent Blueprint

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

---

## 角色设计

### 主 Agent：墨影
职责：
- 接收用户目标
- 判断任务性质和优先级
- 拆解任务
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
- 片场：多媒体制作

---

## 核心原则

1. 主 Agent 是唯一总控，附属 Agent 不能替代最终决策。
2. 高风险任务必须经过主 Agent 复核。
3. 对外发布、代码合并、配置变更、权限相关操作，必须经过主 Agent 审议。
4. 优先追求稳定、清晰、可执行。
5. 控制团队复杂度：能单线就不并行，能并行就不串行，能直出就不层层会审。
6. 附属 Agent 必须有明确任务边界、交付格式和完成标准。
7. 结果冲突由主 Agent 裁决，不能把冲突原样抛给用户。
8. 输出结论优先、简洁清晰、少废话。

---

## 适用场景

适合这些情况：
- 你想把 OpenClaw 从“单助手”变成“团队总控”
- 你已经有多个子 agent，希望职责更清晰
- 你希望高风险动作必须经主 Agent 复核
- 你希望迁移到别的 OpenClaw 实例时，直接复制一段提示词就能开工

---

## 快速开始

### 方案 A：只用提示词
直接复制 `prompt/one-shot-prompt.md` 的内容，放进你的主 Agent system prompt / persona / boot prompt 中。

### 方案 B：作为项目模板
把本仓库连同文档一起放进工作区，在 OpenClaw 中作为团队协作规范使用。

---

## 仓库结构

```text
openclaw-multiagent-blueprint/
├─ README.md
├─ LICENSE
├─ prompt/
│  ├─ one-shot-prompt.md
│  └─ modular-prompt.md
├─ docs/
│  ├─ architecture.md
│  ├─ routing-rules.md
│  ├─ risk-and-review.md
│  ├─ openclaw-adaptation.md
│  └─ rollout-checklist.md
└─ examples/
   ├─ example-user-requests.md
   └─ example-delegation-patterns.md
```

---

## 项目目标

本项目后续会继续完善到可直接用于：
- 新 OpenClaw 实例初始化
- 多 agent 协作规范沉淀
- 提示词即插即用
- 团队分工快速复制

---

## 当前状态

- [x] 项目初始化
- [x] 单段提示词草案
- [x] 团队规则草案
- [ ] OpenClaw 多实例迁移说明补全
- [ ] GitHub 发布
- [ ] 使用示例补全
- [ ] 精简版/完整版提示词双版本固化

---

## 许可证

MIT
