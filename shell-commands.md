# shell-commands

## 目的
本文件定义智能任务规划系统专项的最小 shell 命令集，作为 `guihua.md` 的配套规则文件。

## 一、设计原则
- 最小命令集优先
- 先保证创建、查看、停止、恢复闭环
- 不把 shell CLI 做成第二个治理控制台
- 高风险判断与正式放行仍归主 Agent

## 二、最小命令集

### 1. create
```bash
openclaw task create "<goal>" [--context <text_or_ref>] [--priority low|normal|high] [--risk-level low|medium|high]
```

用途：
- 创建任务
- 支持纯文本快速下发
- 支持补充少量结构化参数

最小要求：
- 必须提供 `goal`

行为：
- 写入 `TaskCreated` 事件
- 初始化任务快照为 `queued`

### 2. list
```bash
openclaw task list [--status <status>] [--source <source>] [--assignee <id>]
```

用途：
- 查看任务池
- 用于快速扫视当前系统中的任务

建议输出：
- `task_id`
- `goal`
- `status`
- `priority`
- `risk_level`
- `updated_at`

### 3. show
```bash
openclaw task show <task_id>
```

用途：
- 查看单任务详情
- 查看当前轮次、阻塞原因、下一次检查时间、审议状态

建议输出：
- 基础信息
- 当前状态
- 当前 round
- 活跃 steps
- `done_checks` 状态
- 风险与审批信息
- 事件摘要

### 4. cancel
```bash
openclaw task cancel <task_id> [--reason <text>]
```

用途：
- 人工终止任务

行为：
- 写入 `CancelRequested` / `TaskCancelled` 事件
- 将任务迁移至 `cancelled`

规则：
- `cancel` 是正式终止，不是暂停
- 已完成任务不应再被 cancel 改写主结果

### 5. retry
```bash
openclaw task retry <task_id> [--reason <text>]
```

用途：
- 人工允许任务从 `failed / blocked / review_required` 中尝试恢复

规则：
- 不能对 `done` 任务使用
- 不等于直接改回 `running`
- 仍需满足自动/人工重试规则、预算规则与风险边界

## 三、暂不纳入最小集的命令
以下命令当前不属于最小闭环：
- `pause`
- `resume`
- `approve`
- `reject`
- `reassign`
- `watch`
- `logs`
- `nudge`

原因：
- 容易过早把 shell CLI 膨胀成运维控制台
- 容易和主 Agent 治理边界重叠
- 当前阶段优先保障最小闭环

## 四、命令与权限边界
| 命令 | 默认执行者 | 说明 |
|------|------------|------|
| `create` | user / human | 允许创建任务 |
| `list` | user / human | 允许查看任务列表 |
| `show` | user / human | 允许查看任务详情 |
| `cancel` | user / main-agent | 允许人工正式终止 |
| `retry` | user / main-agent | 允许人工发起恢复流程 |

## 五、命令语义边界
- shell 命令负责：创建、观察、停止、恢复请求
- shell 命令不负责：
  - 高风险审批
  - 修改主目标
  - 强制越权放行
  - 直接篡改账本快照

## 六、与账本的关系
所有 shell 命令执行后，都必须：
- 先写事件
- 再更新快照
- 不能只在命令输出中宣布结果而不落账

## 七、后续可扩展方向
后续若系统稳定，可考虑增加：
- `pause / resume`
- `approve / reject`
- `reassign`
- `watch`
- `logs`
- IM / API / Web 面板入口

但这些扩展必须以后续实现验证为前提，不属于当前最小范围。
