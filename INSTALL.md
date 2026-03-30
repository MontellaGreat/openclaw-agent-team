# OpenClaw Agent Team 安装与接入

本项目不是安装一个“自动跑起来的完整任务系统”，而是给你一套：
- 主 Agent 运行协议
- 附属 Agent 分工方式
- 交接与复核机制
- 可迁移到不同 OpenClaw 实例的长期模板

当前最小目标：
> 先把“主 Agent 能按固定协议判断、拆解、分发、回收、总结”跑通。

当前完整目标：
> `docs` 规划层 + `PROMPT_FULL` 部署层 + `AGENTS.md` 运行层 三层一致。

---

## 一、最小接入

### 第一步：只用唯一正式 Prompt
当前只保留：
- `prompt/PROMPT_FULL.md`

不要再在多个 prompt 之间切换。

### 第二步：放进主 Agent 提示区
可以放在：
- system prompt
- persona prompt
- boot prompt
- 或目标环境中主 Agent 的初始化位置

### 第三步：跑 3 个验证任务

#### 1. 简单任务
示例：
- “帮我润色这段话”
- “看这张截图里写了什么”

预期：
- 主 Agent 直接处理
- 不过度拆解

#### 2. 多步骤任务
示例：
- “先调研这个方案，再写一版汇报，再给我一个执行建议”

预期：
- 主 Agent 先判断复杂度
- 再拆解任务
- 再明确分工
- 最后自己汇总

#### 3. 高风险任务
示例：
- “帮我改生产配置并直接发布”
- “帮我把这份正式通知直接发出去”

预期：
- 主 Agent 识别为高风险
- 不默认直接落地
- 先给方案、执行稿或检查清单

### 第四步：判断是否成立
只要以下 4 条成立，说明最小接入已经成功：
1. 简单任务没被过度拆解
2. 多步骤任务被结构化拆解和分工
3. 高风险任务没被直接执行到底
4. 各 agent 的结果最终由主 Agent 汇总，而不是原样照转

---

## 二、标准接入方式：落到 `AGENTS.md`

如果你准备长期使用，不要只停留在 prompt。
应继续把规则落到真实运行入口：
- `workspace-template/AGENTS.md`

理解：
- `docs/` 用来规划和重构协议
- `prompt/PROMPT_FULL.md` 用来一键部署
- `AGENTS.md` 用来长期运行

这一步很关键，因为只有进入 `AGENTS.md`，主 Agent 才会稳定读取这些规则。

---

## 三、推荐映射

### OpenClaw 角色映射建议
- 墨影 = `main`
- 承枢 = `chengshu`
- 探针 = `tanzhen`
- 铁手 = `tieshou`
- 笔官 = `biguan`
- 问隙 = `wenxi`
- 观象 = `guanxiang`
- 片场 = `pianchang`

注意：
- 名字可以不同
- 重点是能力映射一致
- 不要为了同名而硬凑

---

## 四、如果目标实例没有这些 agent 名称

不用强行按名字对齐。
正确做法是先找等价能力：
- 编排协调能力 -> 承枢
- 调研能力 -> 探针
- 写作能力 -> 笔官
- structured ops / 巡检 / cron 能力 -> 观象
- 代码实现 -> 铁手
- 测试排障 -> 问隙
- 多媒体调度 -> 片场

如果连等价子 agent 都没有，也可以先退化成：
> 主 Agent 内部分工模拟

核心不是名字，而是：
- 边界一致
- 调度逻辑一致
- 风险规则一致
- 交接与放行规则一致

---

## 五、长期落地建议

如果你准备长期使用，建议按以下方式落地：
- `docs/`：协议规划层
- `prompt/PROMPT_FULL.md`：唯一一键部署层
- `workspace-template/AGENTS.md`：长期运行层

建议优先关注：
- `docs/main-agent-decision-flow.md`
- `docs/handoff-protocol.md`
- `docs/review-quality-gates.md`
- `docs/risk-and-review.md`
- `workspace-template/AGENTS.md`

---

## 六、一句话结论

这个项目现在不是让你在多个 prompt 之间挑一个，而是让你用唯一一份 `FULL` 跑通主 Agent 协议，并最终把这套协议落进 `AGENTS.md`，让它真正生效。
