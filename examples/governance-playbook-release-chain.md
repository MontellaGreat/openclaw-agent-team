# Governance Playbook — Release Chain

本示例演示第三层治理文档在一条真实链路中的最小闭环。

场景：
- 用户要求修复一个线上问题
- 同时问“能不能放行”

这类任务不是只要改完，而是要经过：
- 实现
- QA / 审查
- release decision

---

## 用户目标

“修一下登录页按钮点击无响应的问题，然后告诉我能不能放行。”

---

## 步骤 1：墨影判断

墨影先判断：
- 不是 L1
- 属于 `L3`
- 风险等级 `medium`
- 需要至少 `铁手 -> 问隙 -> 墨影`

此时：
- `status = decomposed`
- `current_release_stage = draft`

---

## 步骤 2：委派铁手

墨影或承枢发起 delegation，请求最少带：
- `task_id`
- 任务目标
- 任务边界
- 期望输出
- 风险等级
- handoff 要求

铁手完成后，不应直接说“可以放行”，而应交付：
- 改了什么
- 没改什么
- 产物位置
- 如何验证
- 风险点

此时结果最多进入：
- `draft`
- 或 `reviewable`

---

## 步骤 3：问隙做 review

问隙收到 handoff 后，输出：
- 覆盖范围
- 未覆盖范围
- 风险等级
- review 结论
- `release_suggestion`

如果结论是：
- 可放但有风险

则状态可进入：
- `status = review`
- `current_release_stage = releasable`

但仍然**不是** `released`。

---

## 步骤 4：墨影做 release decision

墨影统一看：
- 铁手结果
- 问隙 review
- 当前风险与未验证项

最后输出一种明确 decision：
- `released`
- `released_with_risks`
- `not_released`
- `stopped_pending_review`

只有到这一步，任务才真正进入：
- `current_release_stage = released`

---

## 步骤 5：控制台如何看这条链

control center 最少应能看见：
- 当前 `status`
- 当前 `current_release_stage`
- 最近一次 review 结果
- 最终 release decision
- 当前风险等级

这样 UI 才不会把：
- reviewable
- releasable
- released

混成一个“已完成”。

---

## 这个 playbook 说明了什么

1. 改完不等于可放行
2. QA 结论不等于最终放行
3. release discipline 必须由墨影收口
4. observability schema 要能把这个差异显示出来

---

## 一句话版

> Release chain 的关键，不是把东西做出来，而是把“能做、能审、能放”分清楚。
