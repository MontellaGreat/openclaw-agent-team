# Observability Schema

本文件定义多 Agent 团队在治理层、运行层、控制台层之间共享的最小观测结构。

目标：
- 让 metrics、task board、handoff、review、release 说同一种字段语言
- 让 control center 接入时不是只看自然语言日志
- 让复盘与统计建立在统一对象上，而不是散乱口径

---

## 一、为什么需要 schema

如果没有统一 schema，会出现：
- task board 记录一套字段
- handoff 写另一套格式
- review 卡片又是另一套口径
- metrics 无法稳定统计
- control center 只能展示文本，难以高亮关键状态

所以第三层必须补一层：
**统一观测结构。**

---

## 二、最小对象族

建议至少统一 4 类对象：
1. Task Card
2. Handoff Event
3. Review Card
4. Release Decision

这 4 类对象已经足够支撑：
- 任务状态追踪
- 委派回收
- 审查记录
- 放行记录
- metrics 统计
- control center 可视化

---

## 三、Task Card

Task Card 是任务主对象。

建议字段：

```json
{
  "task_id": "task-20260325-001",
  "parent_task_id": null,
  "goal": "修复登录页按钮点击无响应问题",
  "scope": "仅处理登录页点击链路，不改接口层",
  "complexity": "L3",
  "risk_level": "medium",
  "owner_agent": "main",
  "support_agents": ["tieshou", "wenxi"],
  "status": "review",
  "review_required": true,
  "release_required": true,
  "current_release_stage": "reviewable",
  "artifacts": [],
  "last_updated_at": "2026-03-25T14:00:00+08:00"
}
```

关键补充：
- `current_release_stage`: `draft | reviewable | releasable | released`

---

## 四、Handoff Event

Handoff Event 记录一次明确交接。

建议字段：

```json
{
  "event_type": "handoff",
  "task_id": "task-20260325-001",
  "from_agent": "tieshou",
  "to_agent": "wenxi",
  "session_id": "sess-abc123",
  "summary": "已完成按钮点击修复，待 QA 验证",
  "artifacts": [
    {
      "type": "code",
      "path": "src/login.tsx",
      "desc": "补回点击绑定"
    }
  ],
  "verification": "运行 npm test 并手动点击按钮",
  "risks": ["未覆盖移动端"],
  "needs_moying_review": false,
  "created_at": "2026-03-25T14:05:00+08:00"
}
```

作用：
- 让承枢知道链路推进到哪
- 让墨影知道结果来源于谁
- 让 metrics 可以统计 handoff 质量

---

## 五、Review Card

Review Card 记录一次审查动作。

建议字段：

```json
{
  "event_type": "review",
  "task_id": "task-20260325-001",
  "reviewer_agent": "wenxi",
  "review_target": "src/login.tsx",
  "review_scope": "登录页点击修复与基础回归",
  "result": "pass_with_risks",
  "risk_level": "medium",
  "unverified": ["移动端回归未覆盖"],
  "findings": ["桌面端点击行为正常"],
  "release_suggestion": "releasable_with_risks",
  "created_at": "2026-03-25T14:10:00+08:00"
}
```

建议 `result` 取值：
- `pass`
- `pass_with_risks`
- `needs_changes`
- `blocked`

---

## 六、Release Decision

Release Decision 记录墨影的最终放行判断。

建议字段：

```json
{
  "event_type": "release_decision",
  "task_id": "task-20260325-001",
  "decider_agent": "main",
  "decision": "released_with_risks",
  "reason": "桌面端已满足当前目标，移动端风险已显式说明",
  "risk_acknowledged": true,
  "follow_up_required": true,
  "follow_up": "补做移动端回归",
  "created_at": "2026-03-25T14:15:00+08:00"
}
```

建议 `decision` 取值：
- `released`
- `released_with_risks`
- `not_released`
- `stopped_pending_review`

---

## 七、字段统一规则

### 规则 1：`task_id` 必须贯穿全链路
Task Card、handoff、review、release 都应共用同一个 `task_id`。

### 规则 2：角色名用统一映射
建议统一用运行时映射值：
- `main`
- `chengshu`
- `tanzhen`
- `biguan`
- `tieshou`
- `wenxi`
- `guanxiang`
- `pianchang`

### 规则 3：时间字段统一
建议统一使用：
- `created_at`
- `last_updated_at`

### 规则 4：不要把自然语言长段落塞进核心状态字段
状态字段要短、稳定、可统计；长说明可放 `summary` / `reason` / `findings`。

---

## 八、给 metrics 的最小支撑

有了这套 schema，下面这些指标就可以稳定统计：
- 直做命中率
- 拆分收益率
- handoff 返工率
- review 拦截率
- 高风险复核覆盖率
- 错放率
- 子任务超时率
- 阻塞率

---

## 九、给 control center 的最小支撑

如果接 control center，建议最少把这些字段做成 UI 可见：
- `task_id`
- `goal`
- `owner_agent`
- `support_agents`
- `status`
- `risk_level`
- `current_release_stage`
- 最近一次 review 结果
- 最近一次 release decision
- 是否 blocked

这样控制台才能真正看见：
- 哪个任务卡住了
- 哪个任务还只是 draft
- 哪个任务已经可审但未放
- 哪个任务已 released 但带风险

---

## 十、一句话原则

> 没有统一 schema，观测就只是看热闹；有了统一 schema，治理才开始成系统。
