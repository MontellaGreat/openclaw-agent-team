# openclaw-agent-team 项目规划（项目本体 v1）

## 1. 项目定位
`openclaw-agent-team` 的 v1 不是一个“角色说明大全”，而是一套能支持单个真实中小任务完成 `发起 → 分发 → 执行 → 回收 → 验收 → 归档` 的多 agent 协作模板仓。

## 2. v1 目标
v1 必须证明 5 件事：
1. 可启动
2. 可分发
3. 可收口
4. 可风控
5. 可复盘

判断标准不是“文件齐不齐”，而是“第三方能否独立检查闭环是否成立”。

## 3. v1 边界
### 3.1 覆盖范围
- 单任务闭环
- 低/中风险任务
- 核心角色链：`main + chengshu + tieshou`
- 条件触发的 `review / release`
- 第三方可检查的 runtime 留档

### 3.2 暂不覆盖
- 高风险任务的正式放行体系
- 开发 + 测试 + 发布重链路
- 长周期项目治理
- 多任务并发编排
- 长期运营指标与度量看板
- planner 工程实现与自动映射脚本

## 4. v1 唯一验收样例
正式采用：
- `已有仓库中的单文件规则/模板修订，并同步更新一处关联说明文档`

### 采用原因
- 真实
- 边界清楚
- 主链完整
- 风险适中
- 易于第三方检查证据与一致性

### 不采用的样例
- 纯新写文档
- 开发 + 测试 + 发布

## 5. 初始化包（最小正式范围）
初始化包正式只包含 4 件：
1. `bootstrap checklist`
2. `team activation sheet`
3. `first-task starter pack`
4. `fallback / rollback note`

### 5.1 first-task starter pack 最小对象
- `task-card`
- `delegation-request`
- `handoff` 占位
- `review / release` 判定占位

### 5.2 初始化包原则
- 目标是“第一次能开跑”
- 不是“把所有对象都预生成”
- specialist 默认不进入初始化正式范围

## 6. 检查面与总览面
虽然 `acceptance-overview` 不属于初始化包正式成员，但它属于 v1 的必备检查面，必须在首个真实任务运行中同步产出。

### 6.1 acceptance-overview 最少回答的问题
1. 这次检查的是哪一个任务
2. 当前验收结论是什么
3. 检查人先看哪几个文件
4. 每个文件验证什么
5. 当前限制与未通过点是什么

### 6.2 第三方检查动线
#### 30 秒层
- 看当前结论
- 看是否存在红色阻断
- 看适用边界

#### 3 分钟层
- `task-card`
- `team activation sheet`
- `delegation-request`
- `handoff`
- `review / release`

#### 10 分钟层
- `archive`
- `recap`
- `rollback note`
- 检查状态一致性、证据完整性、限制项与遗留项

## 7. archive 与 recap 边界
### 7.1 archive
只记录结果性事实：
- 任务编号
- 目标
- 责任角色
- 最终状态
- 关键产物位置
- 是否放行
- 遗留事项

### 7.2 recap
只记录复盘性判断：
- 偏差与原因
- 信息损失点
- 模板缺口
- 改进动作
- 下轮建议

### 7.3 规则
- v1 起即分对象
- `archive` 追求短、稳、可检索
- `recap` 可以轻，但不能并入 `archive`

## 8. 状态维护的人机分工
### 8.1 人负责判定
- `main`：任务总状态、是否通过、是否归档
- `chengshu`：流转状态、是否进入下一节点、是否触发 review/release
- 执行位：执行结果、完成边界、handoff 回交

### 8.2 结构化层负责支持
- 统一状态字段
- 挂证据链接
- 扫描状态冲突
- 标记异常
- 生成 acceptance-overview / 总览视图

### 8.3 强规则
- 系统不替代人宣布“通过”
- 所有 `完成 / 通过 / 已归档` 状态必须带 `evidence` 或 `reason`
- 缺证据、状态冲突、条件节点漏判必须显式暴露

## 9. 首次验收口径
### 9.1 首次验收目标
- 正式定为：`有条件通过`

### 9.2 含义
首次验收不是证明体系全面成熟，而是证明：
- 主链路成立
- 第三方可核验
- 适用边界明确
- 已知缺口已圈定

### 9.3 首次适用范围
- 单任务
- 低/中风险
- 核心角色链路 `main + chengshu + tieshou`

### 9.4 暂不纳入首次通过范围
- 高风险任务
- 重型开发/测试/发布链
- 长周期项目
- 多任务并发管理

## 10. v1 必需项
- 核心角色最小集：`main / chengshu / tieshou`
- 最小 runtime 对象集：`task-card / delegation-request / handoff / review / release / archive / recap`
- 初始化包四件套
- `runtime-sop`
- `spawn-decision-guide`
- 唯一验收样例
- 正式验收口径
- 第三方检查入口与总览面
- 失败收束机制

## 11. v1 非必需项
- 所有 specialist 的深度完善
- planner 工程实现
- 复杂依赖树与自动映射
- 长期运营度量体系
- 复杂 release 分级与多层 review
- 重型目录治理与长期归档机制

## 12. 执行顺序
### P0 初始化层
- 固化初始化包四件套
- 明确首轮角色启用方式

### P1 样例与验收层并行
- 以唯一验收样例跑第一条真实链路
- 同步形成第三方检查口径与 overview

### P2 状态面与检查面
- 落状态字段
- 落证据链接规则
- 落异常展示规则

### P3 归档与复盘分层
- 固化 `archive`
- 固化 `recap`
- 固化 rollback / failure 收口规则

### P4 扩展层
- 再决定 specialist 深化
- 再决定 planner 工程化
- 再决定长期机制和看板

## 13. 当前下一步
1. 补 `acceptance-overview` 模板
2. 用唯一样例跑首条真实闭环
3. 按“有条件通过”做首次验收
4. 验收后补 `archive` 与 `recap`
5. 再决定是否进入 v1.1 / v2 扩展
