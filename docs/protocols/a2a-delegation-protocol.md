# A2A Delegation Protocol

本文件定义主 Agent、承枢与 specialist 之间的最小委派协议。

目标：
- 让“派任务”不再只是一句自然语言
- 让委派请求、结果回收、补充追问、失败升级更结构化
- 让承枢的编排协调能落到明确协议，而不是纯口头默契

---

## 一、协议解决什么问题

没有委派协议时，常见问题是：
- 任务边界不清
- specialist 收到目标却不知道产出格式
- 回来的结果不一致
- 承枢无法统一回收 handoff
- 墨影难以快速判断是否可进入 Review

所以要定义：
- 委派请求最小字段
- 接单后的确认格式
- 结果交付格式
- 失败 / 阻塞 / 追问格式

---

## 二、委派请求最小字段

建议最少包含：

```json
{
  "task_id": "task-20260325-001",
  "from": "moying",
  "to": "tieshou",
  "role": "implementation",
  "goal": "修复登录页按钮点击无响应问题",
  "scope": "仅限 src/login.tsx 与相关样式，不改接口层",
  "inputs": [
    "复现描述",
    "相关文件路径"
  ],
  "expected_output": "改动说明 + 文件位置 + 最小验证方式",
  "risk_level": "medium",
  "needs_review": true,
  "handoff_required": true
}
```

最小语义解释：
- `task_id`：委派链路唯一标识
- `from`：发起者，通常是墨影或承枢
- `to`：目标角色
- `role`：本次委派的能力定位
- `goal`：任务目标
- `scope`：任务边界
- `inputs`：已给输入
- `expected_output`：希望怎么交付
- `risk_level`：低 / 中 / 高
- `needs_review`：是否必须回主控复核
- `handoff_required`：是否必须按交接协议返回

---

## 三、接单确认格式

specialist 接单后，建议先返回一个简版确认：

```json
{
  "task_id": "task-20260325-001",
  "agent": "tieshou",
  "status": "accepted",
  "understanding": "将在限定文件内修复按钮点击问题，并给出最小验证方式",
  "missing": [],
  "risk_note": "若涉及状态管理层将升级说明"
}
```

若信息不足，不应直接硬做，而应返回：

```json
{
  "task_id": "task-20260325-001",
  "agent": "tieshou",
  "status": "need_clarification",
  "missing": [
    "报错日志",
    "是否允许改状态管理层"
  ]
}
```

---

## 四、结果交付格式

任务完成后，建议最少返回：

```json
{
  "task_id": "task-20260325-001",
  "agent": "tieshou",
  "status": "done",
  "summary": "已修复按钮点击事件绑定缺失问题",
  "artifacts": [
    {
      "type": "code",
      "path": "src/login.tsx",
      "desc": "补回 onClick 绑定"
    }
  ],
  "verification": "运行 npm test 并手动点击登录按钮",
  "risks": [
    "未覆盖移动端回归"
  ],
  "release_suggestion": "review_required",
  "next_step": "建议问隙补边界验证"
}
```

---

## 五、阻塞与失败格式

### 阻塞
```json
{
  "task_id": "task-20260325-001",
  "agent": "tieshou",
  "status": "blocked",
  "reason": "缺少复现环境",
  "needed": [
    "报错日志",
    "最小复现步骤"
  ],
  "suggestion": "补齐输入后继续"
}
```

### 失败
```json
{
  "task_id": "task-20260325-001",
  "agent": "tieshou",
  "status": "failed",
  "reason": "依赖缺失导致本地无法启动",
  "attempted": "已尝试安装依赖并最小排查",
  "risk": "继续硬推会扩大改动不确定性",
  "suggestion": "回退到方案稿或由墨影决定是否换路"
}
```

---

## 六、承枢的协议职责

当任务是多步骤协作时，承枢的职责不是替别人执行，而是：
- 发起阶段性 delegation
- 检查 specialist 是否已确认接单
- 回收阶段 handoff
- 标记 blocked / failed / review_required
- 把阶段摘要交回墨影

承枢的阶段汇总建议格式：

```json
{
  "task_id": "task-20260325-001",
  "agent": "chengshu",
  "status": "in_progress",
  "phase": "implementation_complete_waiting_qa",
  "completed": [
    "探针完成资料核对",
    "铁手完成代码实现"
  ],
  "pending": [
    "问隙 QA 验证"
  ],
  "risks": [
    "移动端尚未覆盖"
  ],
  "needs_moying_review": false
}
```

---

## 七、什么时候必须升级给墨影

以下情况不要只在 specialist 或承枢内部消化，必须回墨影：
- 路线冲突
- 风险升级
- scope 需要扩张
- handoff 长期不完整
- specialist 结果互相矛盾
- 涉及高风险放行

---

## 八、一句话原则

> 委派不是“你去做一下”，而是一个有边界、有状态、有回收格式的协议动作。
