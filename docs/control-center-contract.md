# Control Center Contract

本文件定义 `openclaw-agent-team` 与 `openclaw-control-center` 之间的最小治理契约。

目标：
- 让 control center 不只是“看日志的 UI”
- 让制度层的关键字段、状态、风险、放行结果能被稳定可视化
- 让观察层真正服务于调度、审查、放行与复盘

---

## 一、为什么需要 contract

只有集成说明还不够。

如果没有明确 contract，会出现：
- control center 只能看自然语言输出
- 看得到聊天，看不到任务状态
- 看得到任务，看不到 release stage
- 看得到运行热闹，看不到风险与 blocked 的区别

所以第三层最后必须补：
**制度层和观察层之间，到底交换哪些字段、展示哪些状态、触发哪些提醒。**

---

## 二、控制台最少应接收的对象

建议 control center 至少能接收以下 4 类对象：
1. Task Card
2. Handoff Event
3. Review Card
4. Release Decision

这些对象定义已在：
- `docs/observability-schema.md`

本文件只进一步规定：
- 哪些字段必须可见
- 哪些状态必须高亮
- 哪些事件必须提醒

---

## 三、必须可见的核心字段

### 任务层
控制台至少应能看见：
- `task_id`
- `goal`
- `scope`
- `complexity`
- `risk_level`
- `owner_agent`
- `support_agents`
- `status`
- `current_release_stage`
- `last_updated_at`

### 交接层
控制台至少应能看见：
- `from_agent`
- `to_agent`
- `summary`
- `verification`
- `risks`
- `session_id`

### 审查层
控制台至少应能看见：
- `reviewer_agent`
- `result`
- `risk_level`
- `unverified`
- `release_suggestion`

### 放行层
控制台至少应能看见：
- `decider_agent`
- `decision`
- `reason`
- `risk_acknowledged`
- `follow_up_required`

---

## 四、必须高亮的状态

以下状态在 UI 中不应只是普通文本，建议显式高亮：

### 1. `blocked`
意义：
- 当前链路停住了
- 需要输入补齐、依赖恢复或主控判断

### 2. `review`
意义：
- 已进入审查阶段
- 结果尚未可视为已放行

### 3. `released_with_risks`
意义：
- 已放行，但带风险承认
- 后续需要跟进

### 4. `not_released`
意义：
- 当前结果明确不可放行
- 不应再被 UI 误显示为完成

### 5. `stopped_pending_review`
意义：
- 主控主动踩刹车
- 不是失败，而是等待进一步审查

---

## 五、必须能区分的两个维度

### 维度 1：运行状态 vs 放行阶段
控制台必须同时区分：
- `status`
- `current_release_stage`

原因：
- 一个任务可以 `status = review`
- 同时 `current_release_stage = reviewable`

如果 UI 只显示一种状态，就会把“正在审”与“已可放”混成一团。

### 维度 2：风险等级 vs 放行结果
控制台必须同时显示：
- `risk_level`
- `decision`

原因：
- 高风险不一定不能放
- 低风险也不代表自动放

---

## 六、建议的控制台视图

### 1. 任务总览视图
至少显示：
- 任务目标
- 当前 owner
- 当前 status
- 当前 release stage
- 风险等级
- 是否 blocked

### 2. 协作链路视图
至少显示：
- 任务由谁交给谁
- handoff 顺序
- 当前卡在哪一段
- 哪个 session 在承载哪段任务

### 3. 审查与放行视图
至少显示：
- 最近一次 review 结果
- 最近一次 release decision
- 当前是否可放行
- 哪些未验证项仍存在

### 4. 风险视图
至少显示：
- 高风险任务列表
- 当前 blocked 任务
- released_with_risks 任务
- not_released 任务

---

## 七、建议的提醒事件

以下事件建议触发 UI 提醒或告警：
- 任务进入 `blocked`
- 高风险任务进入 `review`
- 出现 `not_released`
- 出现 `released_with_risks`
- handoff 长时间未回收
- review 长时间未决

---

## 八、控制台不该做什么

### 不该替代制度判断
control center 可以展示，不应替代墨影做 release decision。

### 不该把“有日志”误显示成“有结果”
有过程输出，不等于任务已完成。

### 不该把 `reviewable` 自动显示成 `released`
这是最危险的 UI 误导之一。

### 不该只看 agent 聊天记录而忽略 task object
控制台应该优先吃结构化对象，而不是只展示会话文本。

---

## 九、与现有文档的关系

- 角色与边界：`docs/agent-specifications.md`
- release 口径：`docs/release-discipline.md`
- 观测字段：`docs/observability-schema.md`
- rollout 路线：`docs/staged-rollout.md`
- control center 集成概览：`docs/control-center-integration.md`

本文件相当于把上述几份文档中与控制台相关的部分收束成一份治理契约。

---

## 十、一句话原则

> control center 不是看聊天热闹，而是看任务真相。
