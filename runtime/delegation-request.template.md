# Delegation Request Template

```json
{
  "task_id": "task-YYYYMMDD-001",
  "from": "main",
  "to": "tieshou",
  "role": "implementation",
  "goal": "在这里写任务目标",
  "scope": "在这里写任务边界",
  "inputs": [
    "相关文件路径",
    "已知现象",
    "补充约束"
  ],
  "expected_output": "在这里写交付格式",
  "risk_level": "low|medium|high",
  "needs_review": true,
  "handoff_required": true
}
```

## 使用提示
- `goal` 写结果，不写空泛动作
- `scope` 写清不该做什么
- `expected_output` 决定 specialist 怎么回你
- 高风险时不要写成“直接落地”
