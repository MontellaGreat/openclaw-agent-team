# Planning Contract

本文件定义任务规划层如何与 `openclaw-agent-team` 对接。

目标不是让规划层替代总控，而是让复杂任务拆解结果可以稳定进入运行主链。

---

## 一、Planning 层职责
Planning 层允许负责：
- 任务拆解
- 依赖关系表达
- 阶段划分
- 执行顺序建议
- 并行机会识别

Planning 层不负责：
- 最终复杂度定级
- 最终风险拍板
- QA 判断
- Release decision

---

## 二、输入 Contract
Planning 输入建议至少包含：
- `goal`
- `scope`
- `constraints`
- `risk_hints`
- `preferred_agents`
- `must_not_do`

示例：
```json
{
  "goal": "调研方案、起草汇报、准备配图方向",
  "scope": "只出方案、文稿和方向稿，不直接发布",
  "constraints": ["明天中午前完成", "文风偏正式"],
  "risk_hints": ["正式对外内容", "可能涉及配置建议"],
  "preferred_agents": ["tanzhen", "biguan", "pianchang"],
  "must_not_do": ["不要直接对外发送"]
}
```

---

## 三、输出 Contract
Planning 输出建议至少包含：
- `plan_id`
- `task_id`
- `goal`
- `complexity_suggestion`
- `risk_suggestion`
- `stages`
- `nodes`
- `dependencies`
- `parallel_candidates`
- `review_points`

---

## 四、Node Schema
每个 planning node 建议包含：
- `node_id`
- `title`
- `owner_agent`
- `objective`
- `depends_on`
- `deliverable`
- `verification`
- `risk_level`
- `status`

---

## 五、进入主链前的确认
任何 planning 输出进入主链前，必须由墨影确认：
1. 是否接受该任务拆解
2. 是否接受复杂度建议
3. 是否接受风险建议
4. 是否需要承枢介入
5. 哪些节点必须进入 review

未经墨影确认，planning 输出不能直接等于真实执行计划。

---

## 六、落地映射
确认后的 planning 结果应映射到：
- 外部任务系统任务板或状态记录
- 外部 planning 输出目录（可选）
- handoff / review / release 链

---

## 七、一句话原则
Planning 层给出任务树；墨影确认任务树；承枢推进任务树；团队执行任务树。
