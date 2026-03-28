# runtime-core

`openclaw-agent-team` 最小实现第一批骨架。

当前只做 4 件事：
- 5 类核心对象最小落地：`Task / TaskStep / TaskEvent / ReviewCheckpoint / ExecutionAttempt`
- 账本落盘：`task_state.json + task_events.jsonl`
- 状态迁移白名单检查
- review 请求 / 决策 / attempt 最小接缝

## 文件
- `types.js`：对象工厂与默认值
- `done-definition.js`：`done_definition -> done_checks[]` 编译器
- `done-checks.js`：done_check 更新、证据挂接、汇总
- `exports.js`：handoff / archive / recap 导出器
- `renderers.js`：将导出对象渲染为 handoff / recap / archive markdown
- `export-demo.js`：从 state 导出 handoff / archive / recap 示例
- `render-demo.js`：从 state 生成 markdown 版 handoff / recap / archive 示例，并写入正式子目录
- `supervisor.js`：supervisor 最小规则（blocked 超时 / heartbeat 超时升级）
- `schedule.js`：`next_check_at` 调度计算、backoff 解析、到点判断
- `demo-supervisor.js`：验证 supervisor 最小升级链的示例入口
- `supervisor-poll.js`：扫描 ledger 目录并批量执行 supervisorTick 的最小轮询入口
- `demo-supervisor-poll-upgrade.js`：验证轮询器可对超时任务执行真实批量升级的示例入口
- `demo-supervisor-next-check.js`：验证 `next_check_at` 补写、未到点跳过、到点后升级的示例入口
- `ledger.js`：事件追加、状态快照写入、账本路径
- `state-machine.js`：状态迁移白名单与 done 判定
- `governance.js`：review 请求 / 决策 / execution attempt 最小实现
- `index.js`：bootstrap 与 demo 入口

## 运行 demo
```bash
node runtime-core/index.js
```

默认会在：
- `runtime/task-ledger/<task_id>/task_state.json`
- `runtime/task-ledger/<task_id>/task_events.jsonl`

产出一条最小链路：
`queued -> planning -> ready -> running -> review_required -> ready -> running -> done`

## 已验证
- review 请求会写入结构化 `ReviewCheckpoint`
- review 决策会回写 `decision / decision_by / decision_at`
- `approve` 会把任务带回 `ready`
- 后续必须重新派发到 `running`，不能从 `ready` 直接跳 `done`
- `done_definition` 现在会在 bootstrap 阶段自动编译为 `done_checks[]`
- `done_checks[]` 现在可以按证据更新，并在进入 `done` 前先做汇总校验
- 状态迁移、review、execution attempt 已开始自动回写部分 done_check 证据
- `unresolved` 已开始接入 handoff / archive / recap 导出口径
- 已可从 state 自动生成 markdown 版 handoff / recap / archive 文档
- 已补 supervisor 最小规则：blocked 超时升级、heartbeat 超时升级
- 已补 supervisor 最小轮询入口：可扫描 ledger 目录并输出升级 / 跳过 / 失败摘要
- 已补 `next_check_at` 第一版调度：可按状态补写下一次检查时间，并在轮询时跳过未到点任务
- `demo-supervisor-next-check.js` 已验证：第一次轮询会补写 `next_check_at`，到点前返回 `next_check_not_due`，到点后才执行 heartbeat timeout 升级

## 当前边界
当前还没做：
- shell CLI 封装
- 并行汇总节点
- supervisor 轮询器
- handoff 文档对象回写
- 完整审计 / 回滚执行器
- `blocked / failed / retrying` 分支的更细粒度规则映射仍待继续补强

也就是说，这一批只是“事实源与状态机骨架”，不是完整编排系统。
