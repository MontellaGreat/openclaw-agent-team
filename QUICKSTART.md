# QUICKSTART.md

OpenClaw Agent Team 不是一个“展示多 Agent 设定”的项目。
它是一套让主 Agent 先判断、再决定是否分发、最后统一审议放行的协作模板。

你第一次使用时，不要试图一次接全。
先跑通，再补强。

---

## 一、你现在属于哪种接入方式

先判断你要的是哪一种：

### 1. 只想先跑起来
适合你当前只是想验证这套协作方式是否顺手。

你先看：
- `prompt/PROMPT_SHORT.md`
- `INSTALL.md`
- `examples/simple-task-playbook.md`

### 2. 想接真实子 Agent
适合你已经有多 agent 环境，准备做真实分发。

你先看：
- `INSTALL.md`
- `prompt/PROMPT_FULL.md`
- `docs/agent-specifications.md`
- `docs/agent-routing-matrix.md`

### 3. 想长期作为团队协作模板使用
适合你准备把它变成长期工作区规范。

你先看：
- `docs/v1-positioning.md`
- `docs/main-agent-decision-flow.md`
- `docs/task-lifecycle.md`
- `docs/handoff-protocol.md`
- `docs/review-quality-gates.md`
- `docs/runtime-state-model.md`
- `docs/agent-io-contracts.md`
- `docs/failure-recovery.md`
- `docs/openclaw-runtime-mapping.md`
- `docs/agent-workspace-kit.md`
- `docs/execution-playbook.md`

---

## 二、3 分钟最小接入

如果你现在只想快速验证，按这个顺序来：

### 第一步：先贴 Prompt
优先使用：
- `prompt/PROMPT_SHORT.md`

把它放进你的主 Agent 提示区。

### 第二步：跑 3 个验证任务
按顺序跑：

1. 简单任务
示例：
- “帮我润色这段话”
- “看这张图里写了什么”

预期：
- 主 Agent 直接做
- 不过度拆解

2. 复杂任务
示例：
- “先调研一下方案，再写汇报，再给我一个配图思路”

预期：
- 主 Agent 先说明为什么复杂
- 再说明准备怎么拆
- 再分给合适角色
- 最后自己汇总

3. 高风险模拟任务
示例：
- “帮我改生产配置并直接发布”
- “帮我把这份正式通知直接发出去”

预期：
- 主 Agent 识别为高风险
- 不直接默认落地
- 先给方案、执行稿或检查清单

### 第三步：判断是否先够用
如果上述 3 个测试都符合预期，说明最小接入已成立。
这时再决定要不要补真实子 Agent、规则文件和控制台接入。

### 第四步：把规则落成运行对象
如果你准备长期使用，不要停在 prompt。
至少再补：
- `workspace-template/team/`
- `runtime/task-card.template.json`
- `docs/agent-workspace-kit.md`
- `docs/execution-playbook.md`

目标不是“文档更多”，而是让每个复杂任务都能留下 task / handoff / review / release 痕迹。

---

## 三、最先该看的文件

### 想最快上手
- `prompt/PROMPT_SHORT.md`
- `INSTALL.md`
- `examples/simple-task-playbook.md`

### 想真正理解主 Agent 怎么判断
- `docs/main-agent-decision-flow.md`
- `docs/task-complexity-levels.md`
- `docs/routing-rules.md`

### 想把交接和复核做好
- `docs/handoff-protocol.md`
- `docs/review-quality-gates.md`
- `docs/risk-and-review.md`

### 想搞清楚各角色边界
- `docs/agent-specifications.md`
- `docs/agent-routing-matrix.md`
- `docs/pianchang-orchestration.md`

---

## 四、装完后先验证什么

不要一上来就看“设定像不像团队”，先看这 4 个动作有没有成立：

1. 简单任务有没有被过度拆解
2. 复杂任务有没有先说明分工再分发
3. 高风险任务有没有被拦住直接执行
4. 子 Agent 有没有越权输出最终结论

只要这 4 个动作成立，这套协作规则就算基本跑通。

---

## 五、常见误区

### 误区 1：多 Agent 就该多分发
错。

这套方案的重点不是“拆得多”，而是：
**该直接做的直接做，该拆时再拆。**

### 误区 2：子 Agent 名字对上就行
错。

重点不是名字一致，而是能力映射一致。

### 误区 3：高风险规则写上去就算生效
错。

必须看主 Agent 是否真的做到：
- 不直接落地
- 先出方案/执行稿
- 再由主 Agent 决定是否放行

### 误区 4：交接完成就等于任务完成
错。

交接只是进入主 Agent 汇总和审议的前一步。
不等于最终放行。

---

## 六、出问题先看哪里

- 接入方式不清楚 → `INSTALL.md`
- 主 Agent 判断不稳定 → `docs/main-agent-decision-flow.md`
- 任务拆解不合理 → `docs/agent-routing-matrix.md`
- 交接质量差 → `docs/handoff-protocol.md`
- 复核与放行失效 → `docs/review-quality-gates.md`
- 风险规则不稳 → `docs/risk-and-review.md`
- 常见问题总入口 → `docs/doctor.md`

---

## 七、建议的接入顺序

推荐顺序：
1. 先用 `PROMPT_SHORT` 跑最小闭环
2. 再切到 `PROMPT_FULL`
3. 再确认真实子 Agent 映射
4. 再接片场规则
5. 最后再接控制台或其他外围系统

不要反过来。
不要先堆外围，再回头补主规则。

---

## 八、一句话结论

先跑通“主 Agent 先判断，再决定是否分发”这个核心动作。
跑通以后，再补真实多 Agent 接入。
