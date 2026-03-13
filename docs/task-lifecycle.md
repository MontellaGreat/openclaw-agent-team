# Task Lifecycle

本文件定义多 Agent 协作中的标准任务生命周期。

---

## 一、设计目标

生命周期的作用：
- 让墨影清楚掌握任务当前处于什么阶段
- 让附属 agent 的交接不混乱
- 让“失败 / 中止 / 待复核”成为明确状态，而不是模糊描述
- 为后续控制中心可视化打基础

---

## 二、标准状态

推荐任务状态流：

```text
Inbox → Judging → Direct Execute | Decomposed → Assigned → In Progress → Handoff → Review → Released
                                          ↘ Failed / Blocked / Stopped
```

### 1. Inbox
任务刚进入系统，尚未处理。

### 2. Judging
墨影正在判断：
- 简单还是复杂
- 是否高风险
- 是否需要拆解
- 是否适合直接执行

### 3A. Direct Execute
简单任务进入主 Agent 直接执行路径。

### 3B. Decomposed
复杂任务已被拆解，准备进入多 agent 协作。

### 4. Assigned
子任务已经明确分配给某个附属 agent。

### 5. In Progress
附属 agent 正在执行任务。

### 6. Handoff
附属 agent 已交回结果，等待墨影或下游 agent 接手。

### 7. Review
结果进入复核、验证、终审或质量检查阶段。

### 8. Released
结果已被墨影放行，可交付给用户或进入下一外部动作。

---

## 三、合法终态

以下状态都是合法结束，不应被伪装成“完成”：

### Released
任务已完成并放行。

### Failed
任务执行失败，且当前不继续推进。

### Blocked
任务被阻塞，缺少必要信息、权限、依赖或环境。

### Stopped
任务因用户叫停、风险原因或策略原因被主动终止。

---

## 四、状态转移规则

### 规则 1：墨影拥有最终状态控制权
附属 agent 可以汇报状态建议，但最终状态由墨影判断和更新。

### 规则 2：Direct Execute 不强行走复杂流程
如果是简单任务，允许：
`Inbox -> Judging -> Direct Execute -> Review -> Released`

### 规则 3：复杂任务必须经过 Decomposed
需要拆分协作的任务，不应跳过：
`Judging -> Decomposed`

### 规则 4：交接不等于放行
附属 agent 提交结果后，状态最多进入 `Handoff` 或 `Review`，不能直接视为 `Released`。

### 规则 5：失败必须显式记录
失败不是丢弃，也不是沉默。必须明确：
- 为什么失败
- 卡在哪里
- 是否建议重试/换路径/终止

---

## 五、示例

### 简单任务
`Inbox -> Judging -> Direct Execute -> Released`

### 复杂任务
`Inbox -> Judging -> Decomposed -> Assigned -> In Progress -> Handoff -> Review -> Released`

### 高风险任务
`Inbox -> Judging -> Decomposed -> Assigned -> In Progress -> Handoff -> Review -> Released / Stopped`

### 遇到阻塞
`Inbox -> Judging -> Decomposed -> Assigned -> In Progress -> Blocked`

---

## 六、一句话原则

> 任务状态必须清楚，交接不等于完成，失败和中止都是合法终态。
