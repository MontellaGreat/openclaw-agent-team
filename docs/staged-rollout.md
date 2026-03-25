# Staged Rollout

本文件定义多 Agent 团队方案的分阶段上线方法。

目标：
- 避免一次性全量启用导致问题难定位
- 让制度上线也有灰度、验证、回退
- 把“能不能长期使用”从感觉变成可验证过程

---

## 一、为什么需要 staged rollout

如果这套制度一上来就全量启用，常见问题是：
- 不知道是哪一层规则在拖慢执行
- 出现问题时，不知道该回退哪一层
- prompt、handoff、review、runtime、control center 一起上，定位成本过高

所以更稳的做法是：
**分阶段启用。**

---

## 二、推荐的 4 个上线阶段

### Phase 1：主 Agent 基线期
目标：
- 只先验证墨影的判断与输出质量

启用内容：
- 主 Agent prompt
- L1 / L2 / L3 / L4 分级
- 高风险拦截
- 结论优先输出

验证样本：
- 1 个简单任务
- 1 个单专项任务
- 1 个高风险只出方案任务

通过标准：
- 简单任务不被过度拆解
- 高风险任务不会直接落地
- 输出能直接给用户使用

---

### Phase 2：协作链路期
目标：
- 验证角色分工、handoff、review gate 是否真正起作用

启用内容：
- specialist 分工
- handoff protocol
- negative boundaries
- A2A delegation
- session hygiene
- review gate

验证样本：
- 1 个探针 -> 笔官链路
- 1 个铁手 -> 问隙链路
- 1 个观象发现异常后升级链路

通过标准：
- handoff 不散
- specialist 不明显越界
- review 能拦住明显问题

---

### Phase 3：运行治理期
目标：
- 验证 release discipline 与 observability schema 是否可支撑真实运行

启用内容：
- release discipline
- observability schema
- runtime state model
- metrics 口径

验证样本：
- 1 个需要 reviewable -> releasable -> released 的任务
- 1 个 blocked 后恢复的任务
- 1 个带风险 released 的任务

通过标准：
- 状态记录可追踪
- release decision 口径一致
- blocked / review / released 能被清楚区分

---

### Phase 4：控制台与长期运营期
目标：
- 验证 control center / task board / 周期复盘是否形成闭环

启用内容：
- control center integration
- observability schema 接入
- metrics 周期复盘
- rollout checklist 升级为长期运营清单

验证样本：
- 1 周期轻复盘
- 1 次高风险链路演练
- 1 次多任务并发观察

通过标准：
- 能看清任务状态
- 能找出错路由 / 错放 / handoff 返工点
- 能据此调整规则

---

## 三、每阶段的回退原则

### 回退规则 1
如果新增一层后：
- 明显拖慢执行
- 让汇总成本大幅上升
- 增加大量无效流程话

先回退最近新增层，不要一下推翻整个体系。

### 回退规则 2
如果问题来自角色越界：
- 优先回查 negative boundaries 与 roster discipline
- 不先怀疑整个多 Agent 思路失效

### 回退规则 3
如果问题来自状态混乱：
- 优先回查 session hygiene、A2A delegation、observability schema

---

## 四、失败判据

若出现以下情况，说明当前阶段尚未通过：
- 简单任务仍大量被拆解
- 高风险任务仍会被默认直接执行
- handoff 返工率持续过高
- review 无法拦下明显问题
- released 状态口径混乱
- 控制台看不清 blocked / review / release 差异

---

## 五、与 `rollout-checklist.md` 的关系

- `docs/rollout-checklist.md` 更像最小检查清单
- 本文件定义的是分阶段上线策略

两者关系可以理解为：
- checklist = 每阶段内部检查
- staged rollout = 整体上线路线图

---

## 六、建议的最小上线顺序

如果只做最小可用上线，建议顺序是：
1. 主 Agent 基线期
2. 协作链路期
3. 运行治理期

如果前三阶段都稳定，再考虑长期控制台接入。

---

## 七、一句话原则

> 制度上线不要一把梭；能分阶段验证，就别把所有复杂度一次吃下。
