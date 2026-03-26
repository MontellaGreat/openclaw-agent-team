# Runtime SOP

本文件定义这套多 Agent 团队在真实运行中怎么做事。

目标不是补理念，而是回答：

> 主 Agent 收到任务后，第一步做什么；复杂任务推进时，文件怎么落；谁在什么时候留下什么痕迹。

---

## 一、主 Agent 收到任务后的 SOP

### 情况 A：简单任务（L1）
1. 判断任务清楚且低风险
2. 不建复杂协作链
3. 主会话直接完成
4. 必要时只留最终结果，不强行留 handoff

### 情况 B：中等任务（L2）
1. 判断只需要一个 specialist
2. 决定是否主会话内模拟推进，还是真实派发
3. 若真实派发，生成 delegation request
4. specialist 回 handoff
5. 墨影 review 后输出

### 情况 C：复杂任务（L3）
1. 建 task card
2. 建 planning / task tree（可选但推荐）
3. 决定是否让承枢介入
4. 承枢回收阶段 handoff
5. 墨影 review
6. 墨影 release

### 情况 D：高风险任务（L4）
1. 建 task card
2. 明确 review_required / release_required
3. 派发执行位与 QA / review 位
4. specialist 只能交方案、执行稿、验证结果
5. 墨影做最终放行或停止

---

## 二、推荐落文件动作

### 任务刚建立时
写入：
- `runtime/task-board.jsonl`

### 需要规划层时
写入：
- `runtime/task-tree.example.json` 风格的 plan 文件
- 或 `workspace-template/runtime/plans/`

### specialist 完成子任务时
写入：
- `runtime/handoffs/<task_id>-<agent>.md`

### 进入复核时
写入：
- `runtime/reviews/<task_id>-review.md`

### 最终裁决时
写入：
- `runtime/release/<task_id>-decision.json`

---

## 三、什么时候该 spawn

建议真实 `sessions_spawn` 的情况：
- 子任务边界清楚
- 执行耗时明显
- 需要隔离上下文
- 需要并行
- 需要 specialist 独立完成

不建议 spawn 的情况：
- 极短问题
- 只需一步判断
- 分发成本高于收益
- 当前只是探索方向，还没到执行阶段

一句话：
**能主会话收口就别硬开会话；该隔离时别怕开。**

---

## 四、什么时候该由承枢介入

建议承枢介入的情况：
- 多阶段任务
- 多个 handoff
- 依赖链明显
- 存在 blocked / pending / review 节点
- 主 Agent 不该长期自己催收状态

如果任务没有明显阶段推进成本，就不要为了“像团队”硬拉承枢。

---

## 五、结果回收 SOP

主 Agent 或承枢回收结果时，按这个顺序检查：
1. 任务边界是否清楚
2. 结果是否明确
3. 验证方式是否存在
4. 风险与未完成项是否明确
5. 是否需要 review
6. 是否已经达到 release 条件

任何一项缺失，都不应直接视为完成。

---

## 六、一句话原则

> 复杂任务必须留下 task / handoff / review / release 痕迹；否则就只是聊天，不是协作。
