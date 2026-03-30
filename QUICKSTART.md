# QUICKSTART.md

OpenClaw Agent Team 不是一个“展示多 Agent 设定”的项目。
它现在更明确是：

**一套把主 Agent 运行协议写清楚，并最终迁移到真实运行入口里的协作模板。**

你第一次使用时，不要试图一次接全。
先跑通主 Agent 的判断、拆解、分发、回收、总结闭环。

---

## 一、现在只看两个入口

你现在不用再选多份 prompt。
当前正式入口只保留两个：

1. `prompt/PROMPT_FULL.md`
2. `workspace-template/AGENTS.md`

理解：
- `PROMPT_FULL` 用于一键部署
- `workspace-template/AGENTS.md` 用于长期运行落地

其他 prompt 已退出正式主路径。

---

## 二、3 分钟最小接入

### 第一步：先贴唯一正式 Prompt
使用：
- `prompt/PROMPT_FULL.md`

### 第二步：跑 3 个验证任务

#### 1. 简单任务
示例：
- “帮我润色这段话”
- “看这张图里写了什么”

预期：
- 主 Agent 直接做
- 不过度拆解

#### 2. 多步骤任务
示例：
- “先调研一下方案，再写汇报，再给我一个执行建议”

预期：
- 主 Agent 先判断复杂度
- 再拆解子任务
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

### 第三步：判断是否跑通
如果以下 4 条成立，说明最小闭环已经成立：
1. 简单任务没被过度拆解
2. 多步骤任务被结构化拆解和分工
3. 高风险任务没被直接执行到底
4. 各 agent 结果最后由主 Agent 汇总，而不是原样照转

---

## 三、长期接入怎么做

如果你准备长期使用，不要只停留在 prompt。
下一步应把主 Agent 协议迁入：
- `workspace-template/AGENTS.md`

并以 docs 作为规划层：
- `docs/main-agent-decision-flow.md`
- `docs/handoff-protocol.md`
- `docs/review-quality-gates.md`
- `docs/risk-and-review.md`

目标不是“文档更多”，而是：
- 主 Agent 真会按协议判断
- 真会按协议拆解
- 真会按协议派单
- 真会按协议回收和总结

---

## 四、最先该看的文件

### 想最快跑起来
- `prompt/PROMPT_FULL.md`
- `workspace-template/AGENTS.md`
- `INSTALL.md`

### 想理解主 Agent 怎么运行
- `docs/main-agent-decision-flow.md`
- `docs/handoff-protocol.md`
- `docs/risk-and-review.md`

### 想搞清楚角色边界
- `docs/agent-specifications.md`
- `docs/agent-routing-matrix.md`

---

## 五、常见误区

### 误区 1：多 Agent 就该多分发
错。
重点不是拆得多，而是：
**能直做就直做，该拆再拆。**

### 误区 2：规则写在 docs 里就算生效
错。
真正生效要看它是否进入：
- `PROMPT_FULL`
- `AGENTS.md`

### 误区 3：交接完成就等于任务完成
错。
交接只是进入主 Agent 汇总、裁决、审议的前一步。

### 误区 4：高风险规则写上去就自动稳了
错。
要看主 Agent 是否真的做到：
- 不直接落地
- 先产出方案或执行稿
- 最终由主 Agent 决定是否放行

---

## 六、一句话结论

先跑通“主 Agent 收到任务后，能稳定判断、拆解、分发、回收、总结”的闭环。
跑通以后，再补真实多 Agent 映射和长期工作区模板。
