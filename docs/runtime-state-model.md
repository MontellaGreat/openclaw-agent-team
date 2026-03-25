# Runtime State Model

本文件定义多 Agent 方案在真实运行时的最小状态模型。

目标：
- 把文档中的生命周期落到可记录、可追踪、可恢复的状态对象
- 让墨影、附属 agent、控制台、日志与后续自动化共享同一套任务状态语义
- 避免“文档里有流程，系统里没状态”

---

## 一、为什么需要运行时状态模型

当前仓库已经定义了：
- 角色边界
- 路由矩阵
- 生命周期
- 交接协议
- 质量门禁

但如果没有统一状态模型，实际运行时会出现：
- 墨影知道自己做到哪，系统不知道
- 附属 agent 做完了，但外部无法判断当前阶段
- 控制中心无法稳定显示任务流转
- 失败后难以恢复，复盘成本高

所以必须补一层：**运行时状态对象**。

---

## 二、最小任务对象

每个复杂任务，建议至少维护一个任务对象。

推荐字段：

```json
{
  "task_id": "task-20260325-001",
  "parent_task_id": null,
  "goal": "用户要解决的目标",
  "scope": "本任务边界",
  "complexity": "L1|L2|L3|L4",
  "risk_level": "low|medium|high|critical",
  "owner_agent": "main",
  "support_agents": ["tanzhen", "tieshou"],
  "status": "judging",
  "review_required": true,
  "release_required": true,
  "artifacts": [],
  "handoff_from": null,
  "handoff_to": null,
  "blocked_reason": null,
  "last_updated_at": "2026-03-25T11:30:00+08:00"
}
```

---

## 三、核心字段说明

### 1. `task_id`
唯一任务 ID。

要求：
- 同一任务链路中唯一
- 可用于日志、交接、控制台、复盘引用

### 2. `parent_task_id`
父任务 ID。

用途：
- 让复杂任务的子任务能挂回主任务
- 支持树状或链式追踪

### 3. `goal`
用户真正要的结果。

要求：
- 用一句清楚的话描述
- 不能写成模糊标签

### 4. `scope`
本任务边界。

要求：
- 说明“这一步做什么，不做什么”
- 防止附属 agent 越权扩写

### 5. `complexity`
复杂度分级：`L1` / `L2` / `L3` / `L4`

来源：
- 与 `docs/task-complexity-levels.md` 对齐

### 6. `risk_level`
风险等级：
- `low`
- `medium`
- `high`
- `critical`

说明：
- 复杂度高不等于风险高
- 风险等级决定是否必须复核与是否允许直接放行

### 7. `owner_agent`
当前主责 agent。

说明：
- 简单任务通常是 `main`
- 复杂子任务可临时归属附属 agent
- 但最终放行仍由墨影控制

### 8. `support_agents`
当前参与但非主责的 agent 列表。

用途：
- 用于显示协作关系
- 用于后续统计多 agent 参与情况

### 9. `status`
当前状态。

推荐值：
- `inbox`
- `judging`
- `direct_execute`
- `decomposed`
- `assigned`
- `in_progress`
- `handoff`
- `review`
- `released`
- `failed`
- `blocked`
- `stopped`

说明：
- 状态值与 `docs/task-lifecycle.md` 对齐
- 不建议再创造一套新名字

### 10. `review_required`
是否必须进入 Review。

### 11. `release_required`
是否需要墨影放行。

说明：
- 对外内容、配置变更、部署、权限相关默认都应为 `true`

### 12. `artifacts`
本任务相关产物列表。

推荐结构：

```json
[
  {
    "type": "doc|code|image|video|report|log",
    "path": "workspace-relative-path",
    "desc": "产物说明"
  }
]
```

### 13. `handoff_from` / `handoff_to`
记录交接来源与目标。

用途：
- 让 handoff 轨迹清楚可追

### 14. `blocked_reason`
阻塞原因。

要求：
- 若状态是 `blocked`，必须填写
- 不允许只写“卡住了”

### 15. `last_updated_at`
最后更新时间。

---

## 四、状态更新原则

### 规则 1：最终状态由墨影控制
附属 agent 可建议状态，但最终写入和裁决由墨影决定。

### 规则 2：状态变化必须伴随理由
以下状态变化建议带说明：
- `judging -> direct_execute`
- `judging -> decomposed`
- `in_progress -> blocked`
- `handoff -> review`
- `review -> released`
- `review -> failed`
- `review -> stopped`

### 规则 3：交接不等于 released
附属 agent 完成结果后，最多更新到：
- `handoff`
- 或 `review`

不得直接判定为 `released`。

### 规则 4：失败与中止是合法终态
- `failed`
- `blocked`
- `stopped`

都应被视为合法结束，不伪装成“完成”。

---

## 五、建议落地方式

v2 第一阶段不要求上数据库，建议先采用轻量方式：

### 方案 A：JSONL 任务板
建议路径：
- `runtime/task-board.example.jsonl`

每行一个任务对象，适合：
- 追踪
- 调试
- 控制台读取
- 后续脚本处理

### 方案 B：任务卡 Markdown
建议路径：
- `runtime/tasks/<task_id>.md`

适合：
- 需要人工直接阅读
- 任务较少时

### 建议
先用 JSONL 为主，Markdown 为辅。

---

## 六、与现有文档的关系

本文件不替代以下文档，只负责把它们“落到运行态”：
- `docs/task-lifecycle.md`
- `docs/handoff-protocol.md`
- `docs/review-quality-gates.md`
- `docs/main-agent-decision-flow.md`

关系如下：
- 生命周期定义状态名
- handoff 定义交接内容
- review 定义放行门禁
- 本文件定义状态对象如何承载这些规则

---

## 七、一句话原则

> 生命周期负责说明任务怎么走；运行时状态模型负责让系统知道任务走到了哪。