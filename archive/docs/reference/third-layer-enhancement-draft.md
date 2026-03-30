# Third-Layer Enhancement Draft

本文件不是继续补“角色定义”，而是进入第三层：
**治理落地、观测闭环、上线纪律。**

前两层已经解决：
- 第一层：角色结构与主线组织
- 第二层：负边界、A2A delegation、session hygiene

第三层要解决的是：
- 这套制度怎么稳定跑起来
- 怎么判断它真的有效
- 怎么把 review、release、metrics、roster、rollout 接成闭环

---

## 一、第三层增强的目标

第三层不再主要回答“谁做什么”，而是回答：
1. 怎么验证团队设计在真实运行里没有跑偏
2. 怎么把调度、审查、放行、复盘做成可追踪闭环
3. 怎么让 control center / runtime / task board 真正吃到制度层信息
4. 怎么让这套团队方案具备长期运营能力，而不是一次性 prompt 工程

---

## 二、当前缺口判断

基于目前仓库状态，第三层最值得补的不是更多角色，而是以下 5 个缺口：

### 缺口 1：缺少 roster discipline
现在有角色定义，但还缺：
- 哪些角色默认常驻
- 哪些角色按需启用
- 哪些角色不能同时承担互斥职责
- 哪些任务需要强制双人链路（如实现 + QA）

### 缺口 2：缺少 release discipline
现在有 review gate，但还缺：
- 什么叫“允许进入 release 决策”
- 哪些结果只能是 draft，不能直接视为 releasable
- 什么叫“可放行但不建议默认执行”

### 缺口 3：metrics 还不够操作化
现在有指标定义，但还缺：
- 事件采集口径
- 最小 task board 字段
- 每次 handoff / review / release 该记什么

### 缺口 4：rollout checklist 太轻
现在 rollout 还是“上线前勾选项”，但还缺：
- 上线分阶段
- 验证样本要求
- 回退条件
- 失败判据

### 缺口 5：control center integration 还偏展示层
现在讲了“可集成”，但还缺：
- 哪些制度字段应映射成 UI
- 哪些状态是控制台必须看得见的
- 哪些 review / release / blocked 事件必须显式显示

---

## 三、建议的第三层增强包

建议把第三层增强拆成 5 份文档，而不是堆成一个大全：

### 1. `docs/roster-discipline.md`
回答：
- 团队常驻 roster 如何定义
- 哪些角色互斥
- 哪些角色默认串联
- 哪些角色默认只按需拉起

价值：
- 防止“角色都在，但谁都能上”
- 把组织结构从静态列表升级成可操作 roster

### 2. `docs/release-discipline.md`
回答：
- 草案 / reviewable / releasable / released 的区别
- 什么结果只能建议，不算可放行
- 高风险任务进入 release 决策前的最小门槛

价值：
- 把“review gate”再往前推进一层
- 防止把“可供审议”误当成“可以发布”

### 3. `docs/observability-schema.md`
回答：
- task card 最小字段
- handoff event 最小字段
- review card 最小字段
- release decision 最小字段

价值：
- 让 metrics、control center、runtime task board 说同一种结构化语言

### 4. `docs/staged-rollout.md`
回答：
- 这套制度如何分阶段上线
- 每一阶段的验证样本
- 升级条件与回退条件

价值：
- 避免“一次性全启用”导致定位困难

### 5. `docs/control-center-contract.md`
回答：
- 制度层与观察层之间该怎么接
- 哪些字段必须可视化
- 哪些状态必须高亮
- 什么事件应该触发告警

价值：
- 让 control center 真成为治理支撑，而不是旁观 UI

当前状态：
- 已落地正式版

---

## 四、建议优先级

如果只先做一部分，建议按这个顺序：

### 当前落地顺序（已完成）
1. `docs/release-discipline.md`
2. `docs/observability-schema.md`
3. `docs/roster-discipline.md`
4. `docs/staged-rollout.md`
5. `docs/control-center-contract.md`

结果：
- 第三层已从草案推进到完整闭环
- 已具备 release、observability、roster、rollout、control-center 五个治理支点

---

## 五、我对第三层的总判断

这个项目现在已经不是“缺不缺角色”的问题了。

它下一步的核心问题是：
- 如何让制度层变成可运行、可观测、可审议、可回退的治理系统

所以第三层增强不该再去加更多 agent 人设，
而应该把下面四件事钉死：
- roster
- release
- observability
- staged rollout

---

## 六、一句话原则

> 前两层解决“怎么分工”；第三层解决“怎么长期稳着跑”。
