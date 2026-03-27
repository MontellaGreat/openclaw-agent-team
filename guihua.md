# openclaw-agent-team 统一规划总稿

## 1. 文档说明
本文件是 `openclaw-agent-team` 项目当前阶段的唯一主规划文件。

用途：
- 统一收束 `taolun.md` 与 `taolun2.md` 的讨论成果
- 作为项目本体 v1 与“智能任务规划系统专项”的正式上位规划依据
- 尽量避免后续阅读依赖多份分散文档

阅读原则：
- 日常优先看本文件
- 其他文件只作为配套明细或后续实现参考

本文分两部分：
- 第一部分：项目本体 v1 规划
- 第二部分：智能任务规划系统专项规划

---

# 第一部分：项目本体 v1 规划

## 2. 项目本体目标
`openclaw-agent-team` 项目本体的目标不是继续堆更多模板或角色设定，而是做成一套：

`能支持单个真实中小任务完成“发起—分发—执行—回收—验收—归档”的最小运行模板仓。`

它首先要证明自己：
- 可启动
- 可分发
- 可收口
- 可风控
- 可复盘

而不是先追求：
- 更多角色
- 更复杂结构
- 更大的制度层覆盖
- 更重的自动化或 planner 工程化

## 3. 项目本体 v1 边界

### 3.1 v1 要解决的问题
v1 只解决：
- 单任务真实闭环如何稳定跑起来
- 核心多 Agent 链路如何被第三方独立检查
- 风险节点如何按条件触发，而不是一刀切
- 任务结束后如何留下可接续、可检查、可复盘的 runtime 留档

### 3.2 v1 不解决的问题
v1 不解决：
- 多任务并发编排
- 长期项目群管理
- planner 的完整工程实现
- 重型发布链路
- 全 specialist 深度打磨
- 长周期度量体系
- 重型目录重构

## 4. 项目本体 v1 最小成立条件
项目本体 v1 的成立，不以“文件齐全”为证据，而以“第三方可独立检查主链路成立”为证据。

### 4.1 v1 完成定义（DoD）
- 可启动：新任务到来后，操作者能按初始化材料完成首轮建档与角色启用
- 可分发：主 Agent 能基于任务卡形成 delegation，并由承枢/执行位直接接手
- 可收口：执行完成后，能通过 handoff 把结果回收到主链，不出现悬空状态
- 可风控：低风险任务可轻量闭环；高风险任务可触发 review gate
- 可复盘：第三方只看 runtime 文件，就能复述任务目标、分工、结果与遗留项

## 5. 项目本体唯一验收样例
项目本体 v1 的唯一正式验收样例定为：

`已有仓库中的单文件规则/模板修订，并同步更新一处关联说明文档。`

### 5.1 选用原因
- 真实，不是演示性假任务
- 足够窄，不会把首次验收拖入重型工程链路
- 足够完整，可覆盖主链：`main -> chengshu -> tieshou -> 回收 -> 验收 -> 归档`
- 易于第三方检查：一致性、证据链、条件节点、交接质量

### 5.2 不采用的样例
- 纯新写文档：过轻，不能证明协作链和一致性控制成立
- 开发 + 测试 + 发布：过重，会把首次验收噪音放大

## 6. 项目本体初始化包
初始化包正式范围按 4 件收口：

1. `bootstrap checklist`
2. `team activation sheet`
3. `first-task starter pack`
4. `fallback / rollback note`

### 6.1 first-task starter pack 最小对象
- `task-card`
- `delegation-request`
- `handoff` 占位
- `review / release` 判定占位

### 6.2 初始化包原则
- 初始化包服务“第一次能开跑”
- 不追求把所有对象一次铺满
- 检查视图不计入初始化包，但属于首个真实任务中的必备检查面

## 7. 项目本体核心角色最小集
v1 核心角色最小集为：
- `main`
- `chengshu`
- `tieshou`

其他 specialist 为按需接入，不计入 v1 首轮成立条件。

## 8. 项目本体 runtime 最小对象
v1 最小 runtime 对象集包括：
- `task-card`
- `delegation-request`
- `handoff`
- `review`
- `release`
- `archive`
- `recap`

## 9. archive 与 recap 的对象边界
从 v1 开始，`archive` 与 `recap` 正式分对象。

### 9.1 archive
只记录结果性事实：
- 任务编号
- 任务目标
- 责任角色
- 最终状态
- 关键产物位置
- 是否放行
- 遗留事项

### 9.2 recap
只记录复盘性判断：
- 判断是否成立
- 信息损失点
- 低效节点
- 模板缺口
- 下次改进动作

### 9.3 原则
- `archive` 追求短、稳、可检索
- `recap` 追求解释偏差与改进动作
- 不把复盘情绪和未证实猜测塞进归档

## 10. 项目本体第三方检查入口
项目本体需要固定的第三方检查入口，例如：
- `runtime/check-entry.md`
- `runtime/acceptance-overview.md`

该入口页只回答：
- 当前检查哪个任务
- 当前验收结论是什么
- 检查人先看哪几个文件
- 每个文件验证什么
- 已知限制与未通过点是什么

## 11. 项目本体正式验收口径
正式验收必须改写成第三方检查视角，统一采用：

`检查目标 / 检查动作 / 通过证据 / 不通过信号`

### 11.1 验收条款
- 可启动
- 可分发
- 可收口
- 可风控
- 可复盘

### 11.2 反证原则
凡是必须靠聊天记录、口头说明、个人记忆补齐的，一律不算通过证据。

## 12. 首次验收目标档位
首次验收目标正式定为：

`有条件通过`

### 12.1 含义
- 主链路成立
- 第三方可核验
- 边界已写清
- 但尚不主张体系已适用于所有任务类型

### 12.2 首次有条件通过的适用边界
- 单任务
- 低/中风险
- 核心链路：`main + chengshu + tieshou`

### 12.3 暂不纳入首次正式通过范围
- 高风险任务
- 重型开发/测试/发布链
- 长周期任务
- 多任务并发编排

---

# 第二部分：智能任务规划系统专项规划

## 13. 专项定位
“智能任务规划系统”专项正式收敛为：

`一个由 shell 与主 Agent 双入口驱动，具备任务编排、状态持久化、持续推进、异常监督、有限自动重试与升级回主 Agent 机制的任务编排系统。`

### 13.1 核心立场
- 它不是自动总控
- 它不是去中心化治理替代品
- 它是执行编排中枢 + 监督内核
- 主 Agent 的治理中心地位不变

一句话：

`主 Agent 负责治理，任务编排系统负责持续推进。`

## 14. 专项目标
专项要解决 4 件事：
- 把来自人或主 Agent 的任务统一收口到同一任务总线
- 把任务转成可跟踪、可派发、可推进、可中断的状态对象
- 在后台持续监督任务进度，按轮次或事件推进后续动作
- 在不越权的前提下，把阻塞、失败、超时和高风险步骤稳定抬回主 Agent

## 15. 专项不解决的问题
- 不替代主 Agent 做最终裁决
- 不自动放行高风险动作
- 不默认对外发送、配置变更、权限变更、删除覆盖、正式发布
- 不为了持续推进而无限循环、自主扩权、自主改目标

## 16. 系统结构
专项系统正式收敛为四层：

### 16.1 入口层
- shell 命令入口
- 主 Agent 委托接口

### 16.2 编排层
- 输入整形
- 任务拆解
- 依赖建模
- 派发执行
- 轮次推进

### 16.3 监督层
- 事件触发推进
- 轮询兜底检查
- 超时识别
- 阻塞识别
- 异常升级

### 16.4 状态持久化层
- 当前状态快照
- 历史事件日志
- 可恢复、可追溯、可审计

其上始终覆盖：
- 主 Agent 准入权
- 主 Agent 审议权
- 主 Agent 升级处理权
- 主 Agent 最终收口权

## 17. 术语统一表
- `任务编排系统`：专项系统全称
- `主 Agent 委托接口`：主 Agent 发起任务的统一入口
- `任务状态账本`：统一代替共享状态文件 / 状态账本 / STATE 文件等叫法
- `任务监督器`：统一代替监督器 / 后台监督器 / supervisor 等叫法
- `任务持有者`：统一代替 PM 子 Agent 的口语叫法，强调其非治理角色
- `升级至主 Agent`：统一代替抬回 / 上交 / 回收等表述
- `任务终止条件`：统一代替止损机制 / 熔断 / 硬限制等泛称

## 18. shell 最小命令集
shell 最小命令集正式收敛为：
- `openclaw task create "<goal>"`
- `openclaw task list`
- `openclaw task show <task_id>`
- `openclaw task cancel <task_id>`
- `openclaw task retry <task_id>`

### 18.1 命令原则
- 最小命令集优先
- shell 只负责：创建、观察、停止、恢复请求
- shell 不负责：高风险审批、修改主目标、强制越权放行、直接篡改账本快照
- 所有 shell 命令执行后，必须先写事件，再更新快照

### 18.2 暂不纳入最小集
- `pause`
- `resume`
- `approve`
- `reject`
- `reassign`
- `watch`
- `logs`
- `nudge`

## 19. 主 Agent 最小 contract
主 Agent 发起任务时，最小 contract 正式字段如下：
- `goal`
- `context`
- `context_refs`
- `constraints`
- `done_definition`
- `priority`
- `risk_level`
- `approval_required`
- `approval_points`
- `source`
- `creator`
- `contract_version`

### 19.1 规则
- 编排系统不能靠猜测理解任务
- `done_definition` 必须可验证
- `risk_level` 与 `approval_required` 共同定义治理边界
- `steps / status / retry_count` 这类运行态字段不应由入口 contract 预先指定
- `context_refs` 用于避免把大段原始文本直接塞进主对象

## 20. 最小 runtime 对象模型
系统最小 runtime 对象统一定义为：
- `Task`
- `TaskStep`
- `TaskEvent`
- `ReviewCheckpoint`
- `ExecutionAttempt`

### 20.1 对象关系原则
- `Task.status` 是当前快照
- `TaskEvent` 是历史真相
- 所有状态变更必须对应至少一条 `TaskEvent`
- 审批与 review 不能只靠状态名，必须有结构化对象

## 21. 共享状态账本协议
系统采用“当前快照 + 事件日志”的最小持久化方案。

### 21.1 文件结构
- `task_state.json`：任务当前快照
- `task_events.jsonl`：按时间与序号追加的事件历史

### 21.2 原则
- `task_events.jsonl` 是历史真相来源
- `task_state.json` 是读取优化后的当前快照
- 任一状态变更都必须先形成事件，再更新快照
- 不允许脱离事件日志直接手工改写快照；若需修正，必须追加纠偏事件
- 快照与日志不一致时，以日志为准重建快照
- 共享状态账本是唯一事实源；消息流只作通知，不能替代状态写入

### 21.3 写入规范
- 任何写操作必须记录：`timestamp / actor / reason / prev_state / next_state`
- 任何状态迁移必须同时写入：当前快照 + 事件日志
- 必须采用原子写或版本控制机制，避免并发写覆盖

## 22. 角色写权限矩阵
### 22.1 main-agent
可：
- 创建任务
- 修改 `goal`
- 修改 `done_definition`
- 审批 / 拒绝 review
- 终止任务
- 最终收口

### 22.2 orchestrator / planner
可：
- 生成 / 重排步骤
- 更新可执行队列
- 写 planning 结果

不可：
- 修改原始 `goal`
- 放行高风险动作

### 22.3 supervisor
可：
- 写检查类事件
- 写超时标记
- 写升级标记
- 触发推进

不可：
- 直接把 `review_required` 改回 `running`
- 修改目标
- 补上下文
- 自动放行高风险动作

### 22.4 任务持有者（PM 子 Agent）
可：
- 维护项目级共享状态
- 汇总并行子任务
- 提请 review
- 建议步骤重排

不可：
- 修改治理边界字段
- 审批 review
- 替代主 Agent 裁决

### 22.5 executor / subagent
可：
- 提交 step_result
- 提交 heartbeat
- 报告 blocked / fail

不可：
- 直接宣告任务 `done`
- 修改任务主目标

### 22.6 human(shell)
可：
- `create / list / show / cancel / retry`
- 按规则补充 context

不可：
- 绕过治理边界直接放行

## 23. 规划级 schema 摘要
### 23.1 Task 必填核心字段
- `task_id`
- `source`
- `creator`
- `contract_version`
- `goal`
- `context`
- `done_definition`
- `priority`
- `risk_level`
- `status`
- `created_at`
- `updated_at`
- `updated_by`
- `state_file_path`
- `events_file_path`
- `version`

### 23.2 Task 关键扩展字段
- `context_refs`
- `constraints`
- `approval_required`
- `approval_points`
- `review_reason_code`
- `current_round`
- `heartbeat_at`
- `last_progress_at`
- `next_check_at`
- `blocked_since`
- `deadline_at`
- `max_rounds`
- `max_retries`
- `max_wait_duration`
- `nudge_limit`
- `task_ttl`
- `retry_budget_remaining`
- `round_budget_remaining`
- `result_summary`
- `terminal_reason`
- `blocked_reason`
- `review_reason`
- `history_log`
- `escalation_count`

### 23.3 Step 核心字段
- `step_id`
- `task_id`
- `title`
- `kind`
- `status`
- `depends_on[]`
- `assignee_type`
- `assignee_id`
- `input_refs`
- `output_refs`
- `retry_count`
- `timeout_sec`
- `idempotent`
- `risk_level`
- `approval_required`
- `started_at`
- `finished_at`
- `last_error_code`
- `parent_task_id`
- `step_index`

### 23.4 Event 核心字段
- `event_id`
- `task_id`
- `step_id`
- `event_type`
- `from_status`
- `to_status`
- `actor_type`
- `actor_id`
- `reason_code`
- `payload`
- `created_at`
- `seq`
- `correlation_id`

### 23.5 Review 核心字段
- `review_id`
- `task_id`
- `step_id`
- `approval_point`
- `requested_by`
- `requested_at`
- `review_status`
- `decision`
- `decision_by`
- `decision_at`
- `decision_note`

## 24. 状态机与状态迁移原则
最小状态集为：
- `queued`
- `planning`
- `ready`
- `running`
- `waiting`
- `blocked`
- `retrying`
- `review_required`
- `done`
- `failed`
- `cancelled`

### 24.1 状态迁移要求
每次迁移都必须明确：
- `from_status`
- `to_status`
- `trigger`
- `guard`
- `actor`
- `event_type`

### 24.2 状态迁移表示意
| From | To | Trigger | Guard | Actor | Event Type |
|------|----|---------|-------|-------|------------|
| `queued` | `planning` | 任务受理 | contract 基本字段完整 | orchestrator | `TaskAccepted` |
| `planning` | `ready` | 规划完成 | 步骤图与约束检查通过 | orchestrator | `PlanReady` |
| `ready` | `running` | 派发执行 | 存在可执行 step | orchestrator | `ExecutionStarted` |
| `running` | `waiting` | 等待外部反馈 | 活动步骤均进入等待 | supervisor / orchestrator | `WaitingEntered` |
| `running` | `blocked` | 阻塞成立 | 依赖缺失或外部条件不可满足 | supervisor | `BlockedDetected` |
| `waiting` | `blocked` | 超时阻塞 | 超过 `max_wait_duration` | supervisor | `BlockedEscalated` |
| `running` | `review_required` | 触发审议 | 高风险 / 目标漂移 / 审批点到达 | supervisor / orchestrator | `ReviewRequested` |
| `waiting` | `review_required` | 触发审议 | 超时升级 / 冲突升级 | supervisor | `ReviewRequested` |
| `blocked` | `review_required` | 升级审议 | 阻塞不可自动恢复 | supervisor / task-holder | `BlockedEscalatedToReview` |
| `failed` | `retrying` | 允许重试 | 幂等、低/中风险、预算未耗尽、失败原因可重试 | supervisor / main-agent | `RetryApproved` |
| `blocked` | `retrying` | 允许重试 | 阻塞原因消除且可安全重试 | supervisor / main-agent | `RetryApproved` |
| `review_required` | `ready` | 审议通过 | review 明确批准，且需重新派发 | main-agent | `ReviewApproved` |
| `review_required` | `cancelled` | 审议终止 | main-agent 决定停止 | main-agent | `ReviewCancelled` |
| `retrying` | `running` | 重试重派 | 退避时间结束且预算未耗尽 | supervisor / orchestrator | `RetryDispatched` |
| `running` | `done` | 达成终态 | `done_checks` 全通过且无未决 review | main-agent / orchestrator | `TaskCompleted` |
| `waiting` | `done` | 达成终态 | 汇总与验收已完成 | main-agent / orchestrator | `TaskCompleted` |
| `running` | `failed` | 失败终止 | 达到不可恢复条件 | supervisor / main-agent | `TaskFailed` |
| `waiting` | `failed` | 失败终止 | 等待耗尽且不可恢复 | supervisor / main-agent | `TaskFailed` |
| `retrying` | `failed` | 预算耗尽 | `retry_count >= max_retries` | supervisor | `RetryExhausted` |
| `*` | `cancelled` | 人工终止 | 已收到取消请求 | main-agent / human | `TaskCancelled` |

### 24.3 非法迁移示例
- `done -> *`
- `failed -> done`
- `review_required -> done`
- `cancelled -> running`

## 25. round、step、attempt 关系定义
- `round` = 一次可执行步骤集合的推进周期
- 一个 round 可以包含多个并行 step
- step 失败重试不自动增加 round
- 只有进入下一批新可执行步骤时才增加 round
- `max_rounds` 限制的是推进波次，不是 retry 次数

## 26. 并行任务与汇总协议
### 26.1 原则
- 并行不等于无限派发
- 任何并行派发必须声明：
  - `fanout_limit`
  - `join_condition`
  - `failure_policy`
- 无汇总节点的并行链不得进入下一阶段

### 26.2 汇总节点
- 每个并行任务组必须指定汇总节点
- 汇总节点可为：任务持有者（PM 子 Agent）或编排器
- 汇总节点负责检查所有子任务状态并决定是否推进父任务

### 26.3 汇总产物最小字段
- `completed`
- `failed`
- `blocked`
- `unresolved`
- `next_action`
- `risk_change`

### 26.4 部分子任务失败时
汇总节点必须根据预设策略决定：
- 继续
- 阻塞
- 升级主 Agent

## 27. handoff contract
所有交接至少包含：
- 任务边界
- 当前状态
- 已做事项
- 产出位置
- 未决问题
- 风险
- 验证结果
- 请求接手动作

凡是“看起来完成了，但不可直接接手”的 handoff，不算有效交接。

## 28. 监督器协议
监督器正式采用：

`事件驱动为主 + 轮询兜底`

### 28.1 必须触发事件的情况
- 任务创建
- 步骤完成
- 步骤失败
- 审议返回
- 人工 cancel / retry
- 依赖解除

### 28.2 轮询兜底负责发现
- `next_check_at` 已到但未推进
- `running / waiting` 长时间无更新
- `blocked` 停留过久
- `retrying` 超限
- 依赖已满足但未推进
- 监督器心跳丢失

### 28.3 监督器直接依赖的结构化字段
- `next_check_at`
- `heartbeat_at`
- `last_progress_at`
- `blocked_since`
- `retry_budget_remaining`
- `round_budget_remaining`
- `pending_review_count`
- `active_step_count`
- `deadline_at`

### 28.4 监督器边界
可：
- 检查
- 触发推进
- 标记异常
- 升级主 Agent

不可：
- 改目标
- 补上下文
- 自动放行高风险动作
- 裁决 review

### 28.5 监督器自监控
- 监督器必须写心跳
- 心跳丢失必须告警
- 监督器每次轮询后应输出摘要日志
- 监督器重启后必须从事件日志恢复未完成检查

## 29. 活着 / 卡死 / 假推进 定义
### 29.1 活着
满足以下之一：
- 在 `heartbeat_timeout` 内有 step 心跳
- 在最近检查窗口内有新事件
- 最近一轮检查内有结构化进展

### 29.2 卡死
满足以下之一：
- 超过 `max_wait_duration` 且无可恢复动作
- 无新事件
- 无审批结果
- 重试预算耗尽且无法继续

### 29.3 假推进
若仅更新时间变化，但以下都无变化，则视为假推进：
- `done_checks`
- `completed_steps`
- `dependency_resolution`
- `evidence_count`
- `review_result`
- `output_refs`

## 30. review 与审批规则
- `review_required` 是强中断态，不是普通等待态
- 进入 `review_required` 后，监督器不得自动恢复为 `running`
- 必须由主 Agent 明确做出 `approve / reject / hold` 决策
- `review_reason_code` 至少支持：
  - `high_risk_action`
  - `approval_point_reached`
  - `context_conflict`
  - `goal_drift`
  - `retry_exhausted`
  - `timeout_escalation`
  - `manual_hold`
- 有未决 review，不得进入 `done`

## 31. done_definition 结构化验收协议
`done_definition` 不得仅保留为自由文本，必须在进入 `ready` 前转换为 `done_checks[]`。

每个 `done_check` 至少包含：
- `id`
- `description`
- `type`
- `evidence_required`
- `status`

### 31.1 done 判定
只有当：
- 全部 `done_checks = passed`
- 无未决审批点
- 所有必要 evidence 已挂接

任务才允许进入 `done`。

## 32. 自动重试、自动恢复、升级的分界
### 32.1 自动重试
仅适用于：
- 幂等操作
- 低/中风险
- 失败属于可重试集合
- 上下文未变化
- `retry_count < max_retries`

### 32.2 自动恢复
不等于自动重试。
- 若任务已部分执行，不能简单重试
- 应进入阻塞 / review / 恢复逻辑

### 32.3 必须升级主 Agent 的情况
- 高风险动作
- 权限 / 配置 / 外发 / 发布 / 删除覆盖
- 失败原因不确定
- 上下文冲突或缺失
- 连续重试仍失败
- 长时间卡死
- 目标漂移
- 需要人工判断或方案裁决

## 33. 任务终止条件与优先级
系统必须内建：
- `max_rounds`
- `max_retries`
- `max_wait_duration`
- `nudge_limit`
- `task_ttl`
- 无进展检测
- 状态迁移白名单

### 33.1 终止条件优先级
建议优先级：
1. 人工终止
2. 高风险待审
3. TTL 到期
4. retry / round 上限
5. blocked 超时

### 33.2 终态要求
任务进入 `done / failed / cancelled` 前，必须写入：
- `terminal_reason`
- 最终摘要
- 必要 evidence / 审计记录

## 34. 默认值表
若未另行指定，系统默认：
- `priority = normal`
- `risk_level = medium`
- `approval_required = false`
- `max_rounds = 8`
- `max_retries = 2`
- `max_wait_duration = 24h`
- `nudge_limit = 2`
- `task_ttl = 7d`
- `heartbeat_timeout = 30m`
- `supervisor_poll_interval = 5m`
- `retry_backoff = exponential(base=5m, cap=2h)`
- `fanout_limit = 3`

## 35. 高风险动作清单
以下动作默认视为高风险，必须升级主 Agent：
- 配置变更
- 权限变更
- 外部消息发送
- 正式发布
- 删除 / 覆盖
- 涉及隐私 / 金钱 / 法务的动作

## 36. 风控、审计、回滚要求
### 36.1 审计
每次关键状态变更必须记录：
- 时间
- 操作主体
- 前值
- 后值
- 理由

### 36.2 审批链
高风险动作执行前，必须记录审批链。

### 36.3 回滚
任何可能不可逆的动作执行前，必须定义回滚方法或回滚标记点。

### 36.4 一致性
快照与事件日志不一致时，以事件日志为准重建快照。

## 37. 资源与熔断要求
### 37.1 资源预算
每个任务至少定义：
- 最大执行时长
- 最大重试次数
- 最大并发子任务数
- 最大子 Agent 会话数

### 37.2 熔断
- 任务级预算超限，必须强制升级主 Agent
- 系统级资源使用超阈值时，新任务排队，高优先级优先
- 监督器必须具备自监控与心跳机制，避免单点静默失效

## 38. 测试与验收要求
专项正式落地前，至少需要：
- 失败注入测试
- 边界测试
- 恢复测试
- 并发写测试
- 升级阈值测试
- 资源耗尽测试

## 39. 当前收口状态
### 39.1 已收口并可视为当前正式基线的内容
以下内容已在本文件内收口，可直接作为实现依据：
- 项目本体 v1 目标、边界、唯一验收样例、首次验收档位
- 主 Agent 治理边界：准入、审议、升级处理、最终收口不下放
- shell 最小命令集：`create / list / show / cancel / retry`
- 最小 runtime 对象：`Task / TaskStep / TaskEvent / ReviewCheckpoint / ExecutionAttempt`
- 任务状态账本：`task_state.json + task_events.jsonl`
- 最小状态集、状态迁移原则、review 强中断规则、done_checks 验收规则
- handoff 最小 contract、并行汇总协议、默认值、高风险动作清单
- 风控 / 审计 / 回滚 / 资源预算 / 熔断要求

### 39.2 仍属讨论层或待实现验证的内容
以下内容当前不应被表述成“已经落地”：
- shell 以外的 IM / API / Web 入口正式协议
- 复杂 review 流、多层审批链、细分 release 制度
- 多任务并发编排下的完整治理与资源竞争策略
- 任务持有者、监督器、编排器的工程化实现细节
- 长周期度量体系、全量观察面板、重型运维控制台能力
- 对所有任务类型都成立的通用化主张

### 39.3 当前主判断
当前项目已经完成“规划收口”，但还没有完成“实现收口”。
现阶段最重要的不是继续扩讨论，而是把：
- 对象层
- 账本层
- 状态机执行层
- review / 风控接缝
按最小顺序做成可验证闭环。

### 39.4 当前实现推进状态（2026-03-28）
以下内容已经进入“已实现且已验证最小闭环”阶段：
- 五类最小对象骨架已落地：`Task / TaskStep / TaskEvent / ReviewCheckpoint / ExecutionAttempt`
- 任务状态账本已落地：`task_state.json + task_events.jsonl`
- 状态迁移执行器已落地，且会拒绝非法迁移
- review 已具备：`request -> approve / reject / hold -> 回写 -> 落账`
- `done_definition -> done_checks[]` 已接入 bootstrap 自动编译
- `done_checks[]` 已具备证据挂接、汇总校验、事件驱动部分自动更新
- 最小成功链已验证通过：`queued -> planning -> ready -> running -> review_required -> ready -> running -> done`
- 失败链第一版已验证通过：`planning -> ready -> running -> blocked -> retrying -> failed`
- 失败链第一版已具备类型化归责：`file_exists` 可保持通过，`status_match` 会在失败终态下转为 `failed`
- `blocked` 超时升级与 `unresolved` 语义已具备第一版运行态实现：blocked escalation demo 可进入 `review_required`，并在 done_check 汇总中表现为 `unresolved`
- handoff / archive / recap 导出器已落地，且已可从 `task_state.json` 自动生成 markdown 版 handoff / recap / archive 文稿
- supervisor 最小规则第一版已落地：已能基于 `blocked_timeout` 与 `heartbeat_timeout` 触发升级到 `review_required`
- supervisor 第一版验证已补齐：blocked timeout 与 heartbeat timeout 两条升级链当前都可稳定表现为 `review_required + unresolved`，不再出现 heartbeat 升级后 checks 仍显示通过的错位
- supervisor 最小轮询入口已落地：可扫描指定 ledger 目录下的 `task_state.json`，批量执行 `supervisorTick()`，并输出 `upgraded / skipped / failed` 摘要
- supervisor 轮询真实升级样例已验证通过：在同一批量扫描中，`blocked -> review_required` 与 `running -> review_required` 两类超时任务都可被正确升级，且 done_check 汇总都会进入 `unresolved = 1`；当前不只可跳过已处理任务，也可对待处理任务执行真实批量升级
- 仓库纳管关系已核对清楚：`multi agent test/openclaw-agent-team/` 不是根仓库纳管目录，也不是 submodule / gitlink，而是带独立 `.git/` 的内层独立仓库；根仓库当前仅把它视为未跟踪目录，最近代码未进入根仓历史并非提交失败，而是提交目标仓一直应为该 inner repo。后续本项目代码、文档、runtime 产物与项目内提交，应统一在该 inner repo 内完成；如需让根仓感知，只能显式决定改为 submodule 或移除 inner `.git` 后再纳入根仓。
- 方案 A 已开始落地：项目继续保持独立 inner repo，不调整为 submodule，也不并入根仓；已补 `.gitignore` 忽略 `*.bak-*`，并新增一轮清理提交以收口工作区。当前 push 到 GitHub 时被远端新提交阻塞，原因不是本地仓结构错误，而是 `origin/main` 在此期间新增了 README 相关提交；下一步应先基于远端做安全 rebase / 合并，再完成 push。

以下内容当前仍处于“部分实现 / 待继续补齐”阶段：
- handoff / archive / recap / output_refs 与 done_check 的自动映射仍是第一版，尚未完全接入正式归档与结果摘要体系
- supervisor 持续心跳、自监控、`next_check_at` 调度与多规则组合升级逻辑仍待补齐
- shell CLI 封装与真实入口闭环
- 并行汇总节点与 join_condition 的运行态实现

当前主判断更新为：
- 规划主线未偏离，当前实现方向与本文件一致
- 当前已不再停留在“纯规划”，而是进入“最小 runtime 骨架 + 主链验证”阶段
- 下一阶段重点不再是扩讨论，而是补失败链、阻塞链、重试链与监督链

## 40. 关键实现接缝映射
### 40.1 runtime 对象与状态机接缝
最小映射应固定为：
- `Task.status` = 当前任务主状态
- `TaskStep.status` = 当前步骤状态
- `TaskEvent` = 所有状态迁移与关键动作的唯一历史事件
- `ReviewCheckpoint` = 进入 `review_required` 的结构化承载对象
- `ExecutionAttempt` = 每次执行 / 重试的尝试记录

实现原则：
- 任何 `Task.status` 迁移，都必须先写 `TaskEvent`
- 涉及 review 的状态迁移，必须同时存在 `ReviewCheckpoint`
- 涉及 retry 的状态迁移，必须同时落一条新的 `ExecutionAttempt`
- `done / failed / cancelled` 终态必须带 `terminal_reason`

### 40.2 handoff / 并行 / 汇总接缝
最小实现时，以下对象关系必须打通：
- `delegation-request` 负责派发前语义收口
- `handoff` 负责子任务或执行结果回收
- 并行 step 只能在存在 `join_condition + 汇总节点` 时成立
- 汇总节点输出必须能回写：
  - `completed`
  - `failed`
  - `blocked`
  - `unresolved`
  - `next_action`
  - `risk_change`

若缺少可执行 handoff 或缺少汇总节点，则不允许宣告父任务进入下一阶段。

### 40.3 review / approval / risk / audit 接缝
最小实现时，以下规则必须硬接入，而不是停留在文档层：
- 高风险动作默认进入 `review_required`
- 到达 `approval_point` 必须生成 `ReviewCheckpoint`
- 审批结果只能由主 Agent 写入 `approve / reject / hold`
- 所有关键状态变更必须留下审计字段：时间、主体、前值、后值、理由
- 任何不可逆动作执行前，必须明确回滚方法或回滚标记点

### 40.4 done_definition 接缝
最小实现时，`done_definition` 必须经历两步：
1. 入口 contract 接收自然语言或结构化完成定义
2. 在进入 `ready` 前转换为 `done_checks[]`

没有 `done_checks[]`，不得进入正式执行完成判定。

## 41. 最小实现顺序
当前最适合优先落地的顺序调整为：
1. 以本文件作为唯一主规划文件，冻结主规则口径
2. 实现 `Task / TaskStep / TaskEvent / ReviewCheckpoint / ExecutionAttempt` 五类最小对象
3. 实现任务状态账本：`task_state.json + task_events.jsonl`，并固定“先写事件，再更新快照”
4. 实现状态迁移执行器：按白名单迁移，拒绝非法迁移
5. 实现 `done_definition -> done_checks[]` 转换与完成判定
6. 实现最小 review / approval / audit 接缝
7. 实现监督器最小能力：事件驱动 + 轮询兜底 + 心跳
8. 实现 shell 最小命令集：`create / list / show / cancel / retry`
9. 最后再补并行汇总、风险分流增强、更多入口与观察面

### 41.1 不建议倒置的顺序
当前不建议先做：
- 重型 Web 控制台
- 多入口接入
- 复杂审批流
- 大而全的并发编排
- 面板化先行、账本落后

原因：这些都容易让系统先有“界面热闹”，但没有“事实源稳定”。

## 42. 最小验收路径
建议按以下 5 步做首次验收：
1. 用 shell 或主 Agent 创建一个真实低/中风险任务
2. 完成 `planning -> ready -> running -> handoff -> done` 的最小主链
3. 在过程中至少制造一次：等待、阻塞、或可重试失败，验证监督与迁移
4. 抽一条高风险步骤，验证能否正确进入 `review_required` 并回到 `ready` 或 `cancelled`
5. 最终由第三方只看账本、handoff、review、archive / recap，判断是否可独立复述

### 42.1 首次验收通过信号
- 快照与事件日志一致
- 状态迁移可追溯
- review 不被自动绕过
- handoff 可直接接手
- done 由 `done_checks[]` 支撑，而不是口头宣布
- 第三方可独立检查，不依赖聊天补上下文

### 42.2 首次验收不通过信号
- 只改快照，不写事件
- 有 review_required 但无结构化 review 对象
- 有并行派发但无汇总节点
- 任务标记 done，但 `done_checks[]` 未全通过
- 任务失败 / 取消后，没有 terminal_reason 与结果摘要

## 43. 与参考材料的吸收边界
可吸收：
- 共享状态文件
- PM 模式
- 并行协作
- 状态持久化与恢复

不照搬：
- 完全去中心化治理
- 极弱主 Agent 模式
- 把共享状态文件等同于完整系统
- 强绑定 Git 为最小依赖

## 44. 配套文件说明
虽然本文件是唯一主规划文件，但当前仍保留少量配套文件用于实现参考：
- `taolun.md`：项目本体讨论记录
- `taolun2.md`：专项讨论记录
- `task-state-schema.yaml`：结构化 schema 草案
- `state-transitions.md`：状态迁移规则明细
- `shell-commands.md`：shell 命令规则明细

原则：
- 日常阅读优先看本文件
- 其他文件只用于核对一致性或实现细化
- 若配套文件与本文件冲突，以本文件为准，并应回写修正配套文件

## 45. 最终结论
到当前阶段，`openclaw-agent-team` 的完整规划已经完成从“讨论”到“正式规划”的收束。

本文件可作为：
- 项目本体 v1 的正式规划依据
- 智能任务规划系统专项的正式规划依据
- 后续对象落地、文档拆分、接口设计、验证实施的统一上位文档

后续工作不应再回到泛讨论，而应以本文件为准，进入：
- schema 成稿
- 状态迁移表细化
- 命令与接口细化
- 最小实现与验证阶段
