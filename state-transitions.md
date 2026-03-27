# state-transitions

## 目的
本文件用于把 `guihua.md` 中的状态机原则展开成可直接执行的状态迁移规则表。

适用范围：
- 智能任务规划系统专项
- 任务状态账本驱动的运行态判断
- 监督器、编排器、主 Agent、任务持有者的状态迁移边界

## 一、状态集合
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

## 二、迁移总原则
- 每一次迁移都必须产生一条事件记录
- 每一次迁移都必须具备：`from_status / to_status / trigger / guard / actor / event_type`
- 任何迁移都不能绕过任务状态账本直接只在消息里宣布
- 非法迁移必须被拒绝并记录拒绝原因
- `done / failed / cancelled` 为终态，除非显式定义恢复路径，否则不得直接跳出

## 三、状态迁移表
| From | To | Trigger | Guard | Actor | Event Type | 说明 |
|------|----|---------|-------|-------|------------|------|
| `queued` | `planning` | 任务受理 | contract 基本字段完整 | orchestrator | `TaskAccepted` | 创建后进入规划阶段 |
| `planning` | `ready` | 规划完成 | 步骤图、约束、预算检查通过 | orchestrator | `PlanReady` | 可以开始派发 |
| `ready` | `running` | 派发执行 | 存在至少一个可执行 step | orchestrator | `ExecutionStarted` | 进入执行态 |
| `running` | `waiting` | 等待反馈 | 所有活动 step 已进入等待 | supervisor / orchestrator | `WaitingEntered` | 等待外部结果或依赖 |
| `running` | `blocked` | 阻塞成立 | 依赖缺失、外部条件不可满足、步骤明确阻塞 | supervisor | `BlockedDetected` | 进入阻塞 |
| `waiting` | `blocked` | 超时阻塞 | 超过 `max_wait_duration` | supervisor | `BlockedEscalated` | 等待超时升级为阻塞 |
| `running` | `review_required` | 触发审议 | 高风险、目标漂移、审批点到达、上下文冲突 | supervisor / orchestrator | `ReviewRequested` | 等待主 Agent 决策 |
| `waiting` | `review_required` | 触发审议 | 长等待升级、冲突升级、异常升级 | supervisor | `ReviewRequested` | 进入待审 |
| `blocked` | `review_required` | 升级审议 | 阻塞不可自动恢复 | supervisor / task-holder | `BlockedEscalatedToReview` | 阻塞抬回主 Agent |
| `failed` | `retrying` | 允许重试 | 幂等、低/中风险、预算未耗尽、失败原因可重试 | supervisor / main-agent | `RetryApproved` | 进入重试冷却 |
| `blocked` | `retrying` | 允许重试 | 阻塞原因消除且可安全重试 | supervisor / main-agent | `RetryApproved` | 进入重试冷却 |
| `review_required` | `ready` | 审议通过 | review 明确批准，且需重新派发 | main-agent | `ReviewApproved` | 恢复到可执行前状态 |
| `review_required` | `cancelled` | 审议终止 | main-agent 决定停止 | main-agent | `ReviewCancelled` | 任务终止 |
| `retrying` | `running` | 重试重派 | 退避时间到、预算未耗尽、条件仍满足 | supervisor / orchestrator | `RetryDispatched` | 重新进入执行 |
| `running` | `done` | 达成终态 | `done_checks` 全通过、无未决 review、证据齐全 | main-agent / orchestrator | `TaskCompleted` | 正式完成 |
| `waiting` | `done` | 达成终态 | 汇总完成、验收通过、证据齐全 | main-agent / orchestrator | `TaskCompleted` | 等待后完成 |
| `running` | `failed` | 失败终止 | 达到不可恢复条件 | supervisor / main-agent | `TaskFailed` | 正式失败 |
| `waiting` | `failed` | 失败终止 | 等待耗尽且不可恢复 | supervisor / main-agent | `TaskFailed` | 正式失败 |
| `retrying` | `failed` | 预算耗尽 | `retry_count >= max_retries` | supervisor | `RetryExhausted` | 重试用尽后失败 |
| `*` | `cancelled` | 人工取消 | 收到有效取消请求 | main-agent / human | `TaskCancelled` | 任意态可取消 |

## 四、非法迁移示例
- `done -> *`
- `failed -> done`
- `review_required -> done`
- `cancelled -> running`
- `queued -> done`
- `planning -> done`

## 五、特殊规则

### 5.1 review_required 规则
- `review_required` 不是终态，但它是强中断态
- 进入 `review_required` 后，监督器不得自动恢复为 `running`
- 必须由主 Agent 明确做出 `approve / reject / hold` 决策

### 5.2 retrying 规则
- `retrying` 只表示“允许重试且正在等待退避结束”
- `retrying` 不是执行态
- 自动重试只适用于幂等、低/中风险、失败原因可重试的场景

### 5.3 cancel 规则
- `cancel` 是正式终止，不是临时暂停
- 对有活跃 step 的任务，先记 `CancelRequested` 事件，再进入 `cancelled`
- 已 `done` 的任务不允许 `retry`

### 5.4 done 规则
- 没有 `done_checks[]` 全通过，不得进入 `done`
- 有未决 review，不得进入 `done`
- 没有必要 evidence，不得进入 `done`

## 六、状态判定补充

### 6.1 活着
满足以下任一：
- 在 `heartbeat_timeout` 内有心跳
- 在最近检查窗口内有新事件
- 最近一轮检查内有结构化进展

### 6.2 卡死
满足以下全部或主要条件：
- 超过 `max_wait_duration`
- 无新事件
- 无有效进展
- 无审批结果
- 无可安全自动恢复动作

### 6.3 假推进
若仅更新时间变化，但以下都无变化，则视为假推进：
- `done_checks`
- `completed_steps`
- `dependency_resolution`
- `evidence_count`
- `review_result`
- `output_refs`

## 七、监督器最低检查字段
监督器执行判断时，至少读取：
- `status`
- `heartbeat_at`
- `last_progress_at`
- `next_check_at`
- `blocked_since`
- `deadline_at`
- `retry_budget_remaining`
- `round_budget_remaining`
- `pending_review_count`
- `active_step_count`

## 八、默认阈值
- `supervisor_poll_interval = 5m`
- `heartbeat_timeout = 30m`
- `max_wait_duration = 24h`
- `max_retries = 2`
- `max_rounds = 8`
- `task_ttl = 7d`
- `nudge_limit = 2`
