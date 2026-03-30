# Control Center Contract

本文件定义 control center 在接入这套多 Agent 治理规范时，应该遵守的最小显示口径、状态边界与交互约束。

目标：
- 让控制台显示的不是聊天热闹，而是任务真相
- 让 review / release / blocked 等关键状态不被 UI 误导
- 让控制台和主 Agent 共享同一套治理语言

---

## 一、控制台应展示什么
控制台优先展示：
- 任务对象
- 当前状态
- 主责角色
- 当前 gate
- 风险等级
- 已完成项
- 未完成项
- 阻塞项
- 是否需要主 Agent 裁决

不应只展示：
- 聊天记录
- 碎片化消息
- 未结构化对话

---

## 二、最小状态口径
控制台至少要区分：
- `Assigned`
- `In Progress`
- `Handoff`
- `Review`
- `Blocked`
- `Released`
- `Aborted`

强规则：
- `reviewable` 不等于 `released`
- `blocked` 不能伪装成“还在处理中”
- 高风险任务不能因为有产物就自动进入 `Released`

---

## 三、主 Agent 相关显示规则
对 `墨影`，控制台应突出：
- 当前任务是否已完成分级
- 是否已进入高风险路径
- 是否已完成最终审议
- 是否已正式放行

因为主 Agent 是：
- 判断者
- 裁决者
- 审议者
- 放行者

而不是单纯消息转发器。

---

## 四、specialist 显示规则
对 specialist，控制台应突出：
- 主责范围
- 当前产出
- 验证情况
- 风险说明
- 是否已完成 handoff

控制台不应暗示：
- specialist 可以直接替代主 Agent 放行
- `问隙` 的建议等于正式通过
- `承枢` 的阶段汇总等于最终结论

---

## 五、Handoff 显示规则
每次 handoff 最少应展示：
- 任务边界
- 已完成内容
- 核心结果 / 产物
- 验证方式
- 风险 / 未完成项
- 是否需要主 Agent 决策

如果缺这些字段：
- 应标记 handoff 不完整
- 不应被 UI 渲染成“已完成”

---

## 六、Gate 显示规则
### Review Gate
展示：
- 是否有真实产物
- 是否有变更说明
- 是否有验证结果 / 未验证项
- 是否有风险说明

### Release Gate
展示：
- 是否已通过 review
- 是否完成高风险复核
- 是否有明确未完成项
- 是否已由主 Agent 审议

---

## 七、风险显示规则
控制台应允许显式呈现：
- 风险等级
- 当前阻断项
- 可带条件放行项
- 仍需补做事项

避免把风险藏在长文本里。

---

## 八、错误显示规则
### 不该把 `reviewable` 自动显示成 `released`
这是最危险的 UI 误导之一。

### 不该只看 agent 聊天记录而忽略 task object
控制台应该优先吃结构化对象，而不是只展示会话文本。

---

## 九、与现有文档的关系
- 角色与边界：`docs/reference/agent-collaboration-boundaries-v1.md`
- release 口径：`docs/operations/release-discipline.md`
- 观测字段：`docs/reference/observability-schema.md`
- control center 集成概览：`docs/reference/control-center-integration.md`

本文件相当于把这些文档中与控制台相关的部分收束成一份治理契约。

---

## 十、一句话原则
> control center 不是看聊天热闹，而是看任务真相。
