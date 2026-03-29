# openclaw-agent-team 插件化落地规划（第三版）

## 1. 文档定位

本文用于收口下一阶段主方向：

- 不把当前任务系统继续只当模板仓使用
- 不把全部复杂逻辑直接塞进 OpenClaw 插件
- 采用“外挂 daemon + OpenClaw 插件薄桥接”的双层结构
- 保持 **主 Agent 治理不变**，任务系统只负责持续推进、状态落盘、停滞检测、恢复与交接

本文是 `guihua.md` 的下一阶段落地规划补充，不替代主基线规则；若与主基线冲突，以主基线为准，再回写统一。

---

## 2. 当前阶段判断

当前 `openclaw-agent-team` 已经完成以下关键基础：

- 最小 runtime 账本已跑通：`task_state.json + task_events.jsonl`
- 5 类核心对象已落地：`Task / TaskStep / TaskEvent / ReviewCheckpoint / ExecutionAttempt`
- review / blocked / retry / done 最小闭环已跑通
- handoff / recap / archive 已具备导出能力
- shell CLI 第二版已接上 review 审批入口
- 首次正式验收样例已通过

这说明当前系统已不再只是“规划文档”，而是已经进入：

> **可被插件化、可被服务化、可开始接入 OpenClaw 内部能力的最小运行阶段。**

因此，下一阶段重点不再是继续补 demo，而是：

1. 明确插件化路线
2. 明确 daemon 与插件的职责边界
3. 明确停滞恢复与 agent 唤醒机制
4. 明确正式落地顺序与验收口径

---

## 3. 总体方案

### 3.1 一句话方案

下一阶段采用：

> **外挂 daemon 负责任务运行内核，OpenClaw 插件负责桥接 OpenClaw 内部能力。**

即：

- daemon 负责：状态账本、状态迁移、调度、停滞检测、恢复判断、导出与归档
- 插件负责：session / agent 唤醒、OpenClaw 工具桥接、消息续跑、主 Agent 交互入口

### 3.2 这样做的原因

核心原因有 4 个：

1. **运行内核不应与 OpenClaw 强耦合**
   - 状态机、账本、调度、归档属于任务系统本身，不应全部写死在插件层

2. **OpenClaw 内部能力适合由插件桥接**
   - session 恢复、子 agent 拉起、消息发送、内部工具调用，本来就更适合放在插件中

3. **更容易测试与排障**
   - daemon 可独立跑 demo、跑状态验证、做批量巡检，不依赖 OpenClaw 会话环境

4. **更容易守住治理边界**
   - 插件层只做桥接，不做第二总控，可避免插件直接越权推进高风险动作

---

## 4. 架构原则

### 4.1 总原则

必须始终保持以下原则：

1. **主 Agent 治理不变**
2. **任务系统不是自动总控**
3. **状态真相源优先于聊天上下文**
4. **高风险动作必须 review**
5. **导出文档不是主真相源，账本才是**

### 4.2 真相源原则

系统的唯一运行真相源仍应保持为：

- `task_state.json`
- `task_events.jsonl`

任何插件逻辑、恢复逻辑、唤醒逻辑、导出逻辑，都必须以这两类账本为依据。

不允许把以下内容作为主真相源：

- 单纯聊天记录
- 插件内存中的临时状态
- 手工补写的 recap/handoff 文稿

### 4.3 自动推进边界

系统可以自动检测停滞、自动建议恢复、自动触发允许范围内的续跑；
但不允许自动完成以下动作：

- 跳过 review
- 擅自改目标
- 擅自重定义 done
- 擅自结束高风险任务
- 在无审计记录下执行不可逆动作

---

## 5. 系统分层

### 5.1 Task Runtime Daemon

daemon 是任务运行内核，负责：

- 账本读写
- 状态迁移白名单校验
- review / retry / blocked / done 检查
- stalled task 检测
- `next_check_at` 计算
- 恢复资格判断
- handoff / recap / archive 导出
- resume context 生成

### 5.2 OpenClaw Task Plugin

插件是 OpenClaw 适配层，负责：

- 读取 daemon API
- 在 OpenClaw 内部暴露任务相关工具
- 将 stalled task 转成“可唤醒动作”
- 决定调用主 Agent、当前 session、或 subagent
- 发送继续推进消息 / 提醒 / 审批提示

### 5.3 Agent Resume Layer

该层负责把任务账本转换成可执行恢复提示，至少应包含：

- 当前任务目标
- 当前状态
- 最近关键事件
- 当前阻塞原因
- 下一步允许动作
- 当前不允许动作
- done_checks 当前进度
- 本轮推进边界

### 5.4 Export Layer

该层负责对人类与第三方暴露可读结果：

- handoff
- recap
- archive
- 验收摘要

注意：

> 导出层服务于交接、复盘、验收，不直接主导状态机。

---

## 6. 模块拆分建议

### 6.1 daemon 模块

建议拆为：

- `api-gateway`：对外暴露 HTTP / 本地通信接口，统一鉴权、限流、trace id 与错误码
- `runtime-store`：账本读写与路径约定
- `state-machine`：状态迁移校验
- `done-checks`：完成条件汇总
- `review-engine`：审批与决策对象
- `scheduler`：`next_check_at` 计算与 due 判定
- `supervisor`：stalled task 规则评估
- `resume-planner`：恢复策略与恢复资格判断
- `tool-adapters`：shell / HTTP / OpenClaw tool proxy 等适配层
- `policy-guardrails`：风险等级、allowlist、路径与域名限制、超时上限
- `event-stream`：事件流输出、SSE/轮询兜底
- `observability`：结构化日志、健康检查、readyz/healthz
- `exports`：handoff / recap / archive 生成
- `api`：对插件暴露统一接口

### 6.2 插件模块

建议拆为：

- `plugin-entry`：OpenClaw 插件注册与工具入口
- `task-tools`：对 agent 暴露的任务工具集合
- `request-translator`：将 agent 调用参数转成 daemon 协议
- `auth-context-injector`：注入用户、会话、channel 等上下文
- `wake-bridge`：把可恢复任务转成 session 唤醒动作
- `review-bridge`：把 review_required 转成主 Agent 或用户审批入口
- `notify-bridge`：将 stalled / unresolved / blocked 转成消息提醒
- `resume-context`：把 daemon 返回的上下文转换为 agent 续跑提示
- `stream-poll-client`：接收事件流，并在断流时自动回退到查询模式
- `result-formatter`：将 daemon 结果转成 OpenClaw 工具返回格式
- `local-safeguard`：插件侧连通性、自检、降级与超时保护
- `task-hooks`：与 OpenClaw 运行期钩子结合（后置）

### 6.3 边界冻结原则

必须冻结以下边界：

1. **业务逻辑与状态机只留在 daemon**，插件不承载复杂业务编排
2. **任一任务只能有一个权威状态源**，第一版统一以 daemon 为准，插件只做镜像与交互
3. **daemon 可以做监督与建议，但不能越权跳过人工裁决**
4. **通信协议必须独立**，不能靠口头约定字段语义
5. **daemon 故障不应拖死主流程**，插件至少能报出诊断结果并进入保守模式

---

## 7. 建议目录结构

```text
multi agent test/openclaw-agent-team/
├─ guihua.md
├─ guihua3.md
├─ runtime-core/
│  ├─ daemon/
│  │  ├─ api/
│  │  ├─ runtime-store/
│  │  ├─ state-machine/
│  │  ├─ supervisor/
│  │  ├─ scheduler/
│  │  ├─ resume-planner/
│  │  └─ exports/
│  ├─ plugin/
│  │  ├─ task-tools/
│  │  ├─ wake-bridge/
│  │  ├─ review-bridge/
│  │  ├─ notify-bridge/
│  │  └─ resume-context/
│  └─ demos/
├─ runtime/
│  ├─ task-ledger/
│  ├─ generated/
│  └─ daemon-state/
└─ docs/
   ├─ plugin-interfaces.md
   ├─ daemon-api.md
   └─ acceptance-plugin-v1.md
```

---

## 8. 第一版接口建议

### 8.1 daemon 第一版核心接口

建议第一版至少冻结以下接口：

1. `POST /v1/runtime/tasks`：创建并启动任务
2. `GET /v1/runtime/tasks/:task_id`：查询任务当前状态与摘要
3. `POST /v1/runtime/tasks/:task_id/cancel`：取消任务
4. `GET /v1/runtime/tasks/:task_id/events`：以事件流方式输出进度与结果
5. `POST /v1/runtime/tools/validate`：执行前校验风险、权限与边界
6. `GET /v1/runtime/tools`：列出 daemon 当前支持能力
7. `GET /v1/admin/sessions/:session_id`：查询某个会话下的任务摘要与错误概览
8. `GET /healthz` / `GET /readyz`：健康检查与就绪检查

同时保留以下运行内核方法作为内部服务契约：

- `appendEvent(taskId, event)`
- `transitionTask(taskId, action)`
- `requestReview(taskId, input)`
- `decideReview(taskId, decision)`
- `retryTask(taskId, reason)`
- `pollDueTasks()`
- `buildResumeContext(taskId)`
- `resumeTask(taskId)`
- `exportTaskArtifacts(taskId)`

### 8.2 插件第一版核心能力

建议第一版至少具备：

1. `bridge.start_task`
2. `bridge.get_task`
3. `bridge.stream_task`
4. `bridge.cancel_task`
5. `bridge.validate_request`
6. `bridge.list_capabilities`
7. `bridge.run_sync`
8. `bridge.diagnose`

同时在任务运行语义上暴露以下交互能力：

- `task_review_request`
- `task_review_decide`
- `task_retry`
- `task_export`
- `task_list_stalled`
- `task_wake_assigned_agent`
- `task_notify_owner`

### 8.3 协议冻结要求

第一版必须先冻结：

- 请求/响应 schema
- 事件类型清单
- 错误码
- 协议版本号
- trace id / task_id / session_id 透传规范

不能先写实现、后补协议。

---

## 9. stalled task 处理策略

### 9.1 运行原则

插件版正式运行必须遵守：

- **薄桥接原则**：插件仅承担任务受理、状态同步、结果回传、人工裁决入口，不承载重业务逻辑与长事务编排
- **单一执行面原则**：任一任务任一时刻只能有一个权威执行面；调度、重试、锁、回滚、归档，以 daemon 为准
- **显式状态机原则**：至少明确区分 `queued / running / blocked / awaiting_review / awaiting_decision / done / failed / archived / stale`
- **可追溯原则**：每次状态迁移、人工介入、重试、回滚、归档都必须有事件记录
- **Review Gate 前置原则**：高风险动作、跨边界写操作、对外发送、删除覆盖、权限变更、生产发布一律 review 前置
- **Handoff 标准化原则**：主 Agent、插件、daemon、子 agent 之间的交接必须采用统一结构
- **Recap/Archive 分层原则**：recap 服务续接，archive 服务审计，二者不能互相替代
- **可恢复优先原则**：优先保证任务可暂停、可续跑、可人工接管，而非追求一次跑通
- **最小自动化原则**：首次正式阶段仅自动推进低风险、低歧义、可验证闭环步骤
- **验收先于扩张原则**：先证明链路可信、review 可控、stalled 可恢复，再扩任务范围

### 9.2 可自动续跑

仅在满足以下条件时允许自动续跑：

- 存在明确 `next_action`
- 当前不处于 `review_required` / `awaiting_review`
- 当前不涉及高风险不可逆动作
- 当前状态属于可恢复集合
- 最近失败次数未超阈值
- 已有足够上下文可生成恢复提示
- 该步骤属于低风险只读、机械流转、可程序验真、模板化 handoff / recap / archive、或显式授权的有限重试

### 9.3 必须人工裁决

以下情形禁止自动推进：

- 高风险动作待批
- 任务目标发生变化
- 外部依赖缺失且无替代路径
- 连续重试失败超过阈值
- 状态账本与导出摘要明显冲突
- 终态判定存在争议
- 价值判断与口径取舍
- 结果不可机器验真
- 超出授权范围
- 首次接入的新任务类型
- 用户明确要求“先看再做”

### 9.4 stalled task 分类

建议至少分为：

- `retry_due`
- `blocked_waiting_input`
- `blocked_waiting_review`
- `heartbeat_missed`
- `waiting_timeout`
- `blocked_external_dependency`
- `execution_control_plane_error`
- `stale`
- `unresolved_manual_judgement`

不同 stalled 类型必须有明确 next_action 与处理人。

### 9.5 stalled task 分类处理规则

- **A 类：外部依赖阻塞**
  - 进入 `blocked`
  - 记录依赖名与最近错误
  - 按退避策略有限重试
  - 超阈值转人工
- **B 类：输入缺失阻塞**
  - 立即停止自动推进
  - 生成一次性补充清单
  - 置为 `awaiting_decision` 或 `blocked_input`
- **C 类：口径冲突阻塞**
  - 自动整理冲突项、影响面、可选裁决方案
  - 提交人工
  - 未裁决前不得自行选择口径
- **D 类：执行控制面异常**
  - 优先修复控制面一致性
  - 以 daemon 为主状态源重建镜像态
  - 必要时人工执行 rebind / replay / requeue
- **E 类：结果待审阻塞**
  - 转 `awaiting_review`
  - 自动附上摘要、差异、证据、风险
  - 超时仅提醒，不得自动视为通过
- **F 类：长期停滞任务**
  - 进入 `stale`
  - 自动生成当前快照、已知阻塞、恢复建议
  - 允许人工选择 `close / archive / resume`

### 9.6 恢复通用规则

恢复必须基于最近一次完整快照与事件日志，而不是瞬时上下文。恢复优先顺序为：

1. 校验任务身份与幂等键
2. 校验权威状态源
3. 校验证据完整性
4. 决定 `resume / retry / requeue / abort`

同一 stalled 原因重复出现达到阈值后，禁止继续自动重试，必须升级人工裁决。

---

## 10. 三阶段实施路线

### 10.1 P0：打通 daemon 最小内核

目标：

- 保持现有 runtime-core 不推倒重来
- 在当前基础上收口为 daemon 风格接口
- 保留现有 demo 与验收链

本阶段完成后，应做到：

- daemon 可独立读写账本
- 可生成 resume context
- 可对 stalled task 做最小判断
- 可导出 handoff / recap / archive

### 10.2 P1：接入 OpenClaw 插件薄桥接

目标：

- 插件不接管全部逻辑，只桥接 OpenClaw 能力
- 可从 OpenClaw 内部发起 `task_resume`
- 可从 OpenClaw 内部触发 review / retry / export
- 可将 stalled task 转成唤醒动作或提醒动作

本阶段完成后，应做到：

- agent 可通过插件读取任务状态
- stalled task 可在 OpenClaw 内部发起续跑
- review_required 可转成明确审批入口

### 10.3 P2：进入半自动持续推进

目标：

- 建立定期巡检
- 建立可恢复任务自动续跑
- 建立不可恢复任务告警与人工裁决流程
- 建立插件版正式验收口径

本阶段完成后，应做到：

- 插件可持续感知停滞任务
- 可自动恢复低风险任务
- 高风险与异常任务可稳定升级给主 Agent / 用户

---

## 11. 首次插件版验收目标

首次插件版验收不追求“大而全”，只追求以下闭环成立：

1. 创建一个真实中小任务
2. daemon 正常落账并可查询状态
3. 任务进入 stalled / review / retry 其中至少两种情况
4. 插件能正确读取状态并触发一次恢复
5. 恢复后任务可继续推进
6. 高风险动作不会被自动绕过
7. 最终能产出 handoff / recap / archive
8. 第三方只看账本与导出材料，可独立复述任务过程

---

## 12. 两个会议议题

### 12.1 会议一：插件与 daemon 边界冻结会

**目标：**
- 冻结第一版职责边界
- 明确哪些逻辑留在 daemon，哪些逻辑进插件
- 明确哪些动作允许自动续跑，哪些必须人工裁决

**建议参会角色：**
- 主 Agent
- 铁手（工程实现）
- 成熟（治理与验收）
- 探针（架构边界与风险）

**预期产出：**
- 第一版模块边界表
- 自动推进边界清单
- 插件第一版接口冻结清单

### 12.2 会议二：首次插件版验收路线会

**目标：**
- 选定一个真实中小任务作为插件版首次试跑对象
- 明确 P0/P1/P2 的交付顺序与验收口径
- 冻结首次插件版通过标准与不通过信号

**建议参会角色：**
- 主 Agent
- 成熟（验收口径）
- 笔官（文档与总结）
- 铁手（实施顺序）

**预期产出：**
- 首次插件版试跑任务清单
- 分阶段交付路线
- 首次插件版验收 checklist

---

## 13. 当前不建议优先做的事项

当前不建议抢先做：

- Web 控制台先行
- 复杂多入口接入
- 大而全自动编排
- 插件内直接承载全部逻辑
- 先做观感层，再补事实源

原因：

> 当前最值钱的不是“看起来像系统”，而是“它真的能持续推进并可恢复”。

---

## 14. 当前结论

当前最合理的下一阶段方向，不是继续孤立补 demo，也不是把全部逻辑硬塞进 OpenClaw 插件，
而是：

> **把现有 runtime-core 收口为外挂 daemon，把 OpenClaw 插件做成薄桥接层，依旧坚持主 Agent 治理不变。**

这样做的结果是：

- 任务系统获得常驻运行能力
- OpenClaw 获得任务恢复与续跑能力
- 插件获得可解释、可审计、可回放的任务真相源
- 主 Agent 仍保留最终治理与高风险裁决权

这条路线比“纯模板仓”更进一步，
也比“全塞插件”更稳。

---

## 15. 状态机定义表

### 15.1 第一版正式状态集合

| 状态 | 含义 | 是否允许自动推进 | 是否需要人工裁决 | 说明 |
|------|------|------------------|------------------|------|
| `queued` | 任务已创建，尚未开始执行 | 是 | 否 | 允许进入 planning / running 前准备 |
| `planning` | 正在明确边界、步骤与 done_checks | 是 | 否 | 仍属前置整理态，不视为正式执行 |
| `ready` | 前置条件齐备，可进入执行 | 是 | 否 | 可由主 Agent、插件或 daemon 触发进入 running |
| `running` | 正在执行中 | 有条件允许 | 否 | 允许低风险续跑，不允许无限挂起 |
| `blocked` | 遇到阻塞，当前不能继续执行 | 否 | 视原因而定 | 必须带 blocked_reason 与 next_action |
| `awaiting_review` | 已有结果，等待人工 review / 放行 | 否 | 是 | 高风险与结果待审统一进入该态 |
| `awaiting_decision` | 输入缺失、口径冲突或目标未定 | 否 | 是 | 未裁决前不得自动选择路线 |
| `retrying` | 已批准或允许重试，正在准备再执行 | 有条件允许 | 否 | 必须绑定 attempt 记录 |
| `done` | 已完成，done_checks 全通过 | 否 | 终态 | 必须有 acceptance_result 与结果摘要 |
| `failed` | 已失败，当前不再自动继续 | 否 | 视情况而定 | 必须带 terminal_reason |
| `cancelled` | 已取消，不再继续 | 否 | 终态 | 可由人工取消或 review reject 导致 |
| `archived` | 已归档，仅供追溯 | 否 | 终态 | 用于审计与沉淀 |
| `stale` | 长期停滞，等待人工决定 resume / archive / close | 否 | 是 | 不允许继续留在 running |

### 15.2 第一版关键迁移白名单

建议最少允许：

- `queued -> planning`
- `queued -> ready`
- `planning -> ready`
- `ready -> running`
- `running -> blocked`
- `running -> awaiting_review`
- `running -> awaiting_decision`
- `running -> retrying`
- `running -> done`
- `running -> failed`
- `blocked -> retrying`
- `blocked -> awaiting_decision`
- `blocked -> awaiting_review`
- `blocked -> stale`
- `retrying -> running`
- `retrying -> failed`
- `awaiting_review -> ready`
- `awaiting_review -> cancelled`
- `awaiting_decision -> ready`
- `awaiting_decision -> cancelled`
- `done -> archived`
- `failed -> archived`
- `cancelled -> archived`
- `stale -> ready`
- `stale -> archived`

### 15.3 明确禁止的迁移

第一版必须明确禁止：

- `done -> running`
- `done -> failed`
- `archived -> *`
- `failed -> done`
- `cancelled -> done`
- `awaiting_review -> done`（必须先回到 `ready` 或显式放行后再推进）
- `blocked -> done`
- `stale -> done`

---

## 16. Handoff 最小模板

### 16.1 统一结构

任意主 Agent、插件、daemon、子 agent 间交接，最少必须包含：

- `task_id`
- `title`
- `goal`
- `current_status`
- `boundary`
- `completed_items`
- `pending_items`
- `evidence_refs`
- `risks`
- `review_points`
- `next_action`
- `recommended_owner`
- `updated_at`

### 16.2 Markdown 模板

```markdown
# Task Handoff

## 任务标识
- task_id:
- 标题:
- 当前状态:
- 更新时间:

## 任务边界
- 目标:
- 不在本轮处理范围内的事项:

## 已完成项
- 

## 未完成项
- 

## 当前证据
- 

## 当前风险
- 

## 待裁决点
- 

## 下一步建议
- 

## 建议接手方
- 
```

### 16.3 生成要求

- handoff 必须从 runtime state 导出，不允许完全手写替代
- handoff 中出现的完成/未完成项必须可回溯到事件或 done_checks
- handoff 不能只写结论，必须附最小证据引用

---

## 17. Review Gate 最小字段表

### 17.1 ReviewCheckpoint 最小字段

| 字段 | 含义 | 必填 |
|------|------|------|
| `review_id` | 审批节点唯一标识 | 是 |
| `task_id` | 所属任务 ID | 是 |
| `step_id` | 所属步骤 ID，可为空 | 否 |
| `approval_point` | 审批点名称 | 是 |
| `risk_level` | 风险等级 | 是 |
| `requested_by` | 发起方 | 是 |
| `requested_at` | 发起时间 | 是 |
| `review_status` | `pending / approved / rejected / held` | 是 |
| `reason` | 发起原因 | 是 |
| `impact_summary` | 影响摘要 | 是 |
| `proposed_action` | 计划执行动作 | 是 |
| `rollback_plan` | 回滚方案 | 高风险必填 |
| `evidence_refs` | 相关证据 | 是 |
| `decision_by` | 审批人 | 决策后必填 |
| `decision_at` | 决策时间 | 决策后必填 |
| `decision_note` | 审批说明 | 决策后建议填写 |

### 17.2 必须进入 Review Gate 的动作

第一版默认以下动作必须 review：

- 对外发送
- 删除 / 覆盖写入
- 权限变更
- 生产发布
- 金钱 / 法律 / 隐私相关动作
- 用户明确要求先确认再执行的动作

### 17.3 Review 输出规则

- `approved`：允许回到 `ready` 或进入明确下一步
- `rejected`：进入 `cancelled` 或回到 `awaiting_decision`
- `held`：保持待审，不得自动继续
- 任一 review 决策都必须写事件，不允许只改快照

---

## 18. 首次插件版验收清单细化

### 18.1 必验六大项

1. **链路一致性**
   - 插件创建任务、查询状态、接收结果、调用 review 与 retry 都能闭环
2. **状态一致性**
   - daemon 权威态与插件镜像态不分叉
3. **幂等与重试**
   - 相同 idempotency_key 不重复执行
4. **Review Gate**
   - 高风险动作无法绕过人工裁决
5. **Stalled Recovery**
   - 至少演练四类停滞场景并正确恢复或升级
6. **归档可追溯**
   - handoff / recap / archive 都能从 task_id 回查

### 18.2 四类必须演练的停滞场景

- 外部依赖失败
- 输入缺失
- 状态回写失败
- 人工待审超时

### 18.3 首次插件版通过信号

- 插件侧与 daemon 侧状态一致
- 一次低风险自动续跑真实生效
- 一次高风险动作被成功拦入 review
- 一次 stalled task 被正确分流到 `resume / review / stale` 之一
- 第三方只看账本与导出材料可复述任务过程

---

## 19. 第二轮会议结论（2026-03-28）

### 19.1 会议主题

**监督器协议最小实现范围、事件日志压缩与归档策略、P0 工程入口、治理与验收冻结第二轮评审会**

本轮会议不再扩讨论范围，而是围绕“马上开工”收口四件事：

1. 协议边界与执行面冻结
2. P0 工程入口与首批协议文件
3. 治理与验收冻结
4. 监督器协议与事件日志归档的最小实施范围

### 19.2 议题 A：协议边界与执行面冻结

#### 决议

- **单一状态源原则**：任务状态、会话状态、审批状态的唯一真相源统一在 daemon；插件只允许读取镜像、缓存或通过 daemon API 交互。
- **写操作代理原则**：插件不得直接写任何 `.json` / `.jsonl` 账本文件，所有写操作必须通过 daemon 完成。
- **Review Gate 前置原则**：高风险动作的最终审批与拦截必须在 daemon 完成，插件只负责前置提示、展示与回传。
- **恢复校验原则**：任何 resume / retry / 续跑动作，必须先校验 daemon 权威态，不得基于插件内存状态直接恢复。
- **协议版本化原则**：daemon ↔ 插件通信必须带协议版本号、trace id、task_id、session_id，禁止口头约定字段语义。

#### 首版保留在 daemon 的能力

- 权威状态管理
- 执行调度与超时控制
- 审批与权限校验
- supervisor / scheduler
- 日志与追踪
- 健康检查

#### 首版保留在插件的能力

- OpenClaw 工具入口
- 参数转换与上下文注入
- 消息/结果格式化
- 连通性自检与降级
- 特定领域桥接能力

#### 首版明确不做

- 插件内嵌任务状态机
- 插件直接持久化任务真相源
- 插件绕过 daemon 直接唤醒高风险执行链
- 自动跨插件编排
- Web 控制台先行

### 19.3 议题 B：P0 工程入口与首批协议文件

#### 决议

- **P0 目标不是平台成型，而是工程可开工 + 单链路可跑通。**
- **首批必须先冻结 3 份协议文件**：
  1. `docs/protocols/agent-contract.md`
  2. `docs/protocols/runtime-model.md`
  3. `docs/protocols/task-lifecycle.md`
- **工程入口采用双入口策略**：
  - shell 入口
  - 主 Agent 入口
  二者共用同一套 Task Contract 与 Lifecycle。
- **P0 最小金链路固定为**：
  - 接任务 → 统一 contract → 轻规划 → 选择 executor → 执行 → result → 状态落盘 / 日志
- **P0 只验单链路，不验平台完整性。**

#### P0 先建目录/文件

- `docs/protocols/`
- `docs/decisions/`
- `src/cli/`
- `src/agent/`
- `src/runtime/`
- `src/executor/`
- `src/contracts/`
- `tests/contract/`
- `tests/runtime/`
- `tests/e2e/`

#### P0 暂缓项

- 多 Agent 编排
- GUI
- 深度记忆接入
- 并行调度
- 自动恢复编排
- 复杂插件体系

### 19.4 议题 C：治理与验收冻结

#### 决议

- **首版必须同时冻结**：
  - 治理规则
  - 人工裁决边界
  - 自动推进白名单
  - 通过 / 不通过信号
- **单一裁决出口**：跨任务、跨角色、跨阶段的冲突事项，统一由主 Agent 最终裁决。
- **最小 contract 不满足，不得进入执行态。**
- **默认保守原则**：规则未覆盖、证据不足、风险不明、口径冲突时，一律不自动放行。

#### 必须人工裁决的动作

- 目标定义新增、删除或实质性改写
- 任务范围扩大或缩小
- 优先级重排
- 高风险动作执行放行
- 验收标准变化
- 多解路径中的价值判断与路线选择
- 证据不足但要求继续推进的例外放行
- 对外正式沟通、权限授权、数据删除、生产写入

#### 自动推进白名单

- 目标/范围/责任/完成定义已明确后的常规流转
- 材料整理、信息汇总、文档沉淀、状态同步
- 既定验证方法下的常规检查与证据采集
- 低风险可回退的内部草案生成与修订
- 标准化 reminder / stalled 标记 / handoff / recap / archive
- 预设次数内的低风险重试

#### 首批通过信号

- 目标一致
- 流程闭环
- 证据完备
- 高风险动作正确进入 review gate
- 自动 / 人工边界清晰
- 异常处理可控
- 最终判定唯一且无冲突

#### 首批不通过信号

- 缺最小 contract 仍执行
- 越权修改目标、优先级、验收标准
- 高风险动作绕过 review
- 缺证据却输出已通过
- 自动推进越过白名单边界
- 状态流转混乱、不可追溯

### 19.5 议题 D：监督器协议最小实现范围

#### 决议

监督器 v1 的定位固定为：

> **保命层，不是智能调度层。**

只负责：检查、判断、记录、升级、恢复建议；不负责复杂编排与智能优化。

#### v1 必做能力

- due task 检查
- heartbeat / blocked / waiting / retry 规则判断
- stalled task 分类
- 事件写入与状态建议
- 状态变化推送
- 基本配置化
- 优雅停止

#### v1 可延后能力

- 优先级调度
- DAG / 依赖图
- 自动扩缩容
- 分布式 supervisor
- 指标平台
- Web 控制台
- 中间快照断点续跑
- 复杂资源配额

#### 监督器协议注意事项

- 事件驱动为主，轮询兜底
- supervisor 不直接承担完整任务分发器职责
- 心跳、blocked、waiting、retry 规则必须先冻结为明确字段与事件
- 任何升级建议都不能越过主 Agent 与 review gate

### 19.6 议题 E：事件日志压缩与归档策略

#### 决议

该议题定为 **v1 必做治理项**，采用：

> **热区 + 冷区 + 归档前快照 + manifest 索引 + gzip 压缩 + SOP 恢复**

的最小闭环方案。

#### v1 必做策略

- 热区保留当前 `task_state.json` 与近期 `task_events.jsonl`
- 冷区保存按批次归档的历史事件文件
- 同时支持体积阈值与周期阈值触发归档
- 每次归档前固化一次可恢复快照
- 归档文件采用 gzip 压缩的 jsonl
- 建立最小 `manifest` 索引，记录时间范围、事件数、校验值、快照版本
- 归档动作必须原子化/可回滚
- 恢复流程必须写成固定 SOP

#### v1 预留但不做

- 重型日志系统
- 复杂检索引擎
- 增量去重与事件重写
- 远端对象存储分层
- 自动化审计看板
- 自动恢复演练平台

#### 风险点

- 归档边界不清导致丢事件或重复回放
- 只压缩不建索引
- 无快照导致恢复过慢
- 归档流程非原子
- schema 演进后旧归档不可恢复
- 只设计不演练

### 19.7 本轮统一决议

1. `guihua3.md` 作为插件化路线与 P0 入口的正式落地文档继续维护。
2. P0 只打通单链路，不扩为多 Agent 平台。
3. daemon 作为唯一权威状态源，插件只做薄桥接。
4. 高风险动作默认人工 review，首版不追求高自动化率。
5. supervisor v1 只做保命层，不做智能调度层。
6. 事件日志压缩与归档在 v1 就落最小闭环，不能后置。

### 19.8 会后产物清单

本轮会议后，应继续补齐：

- `docs/protocols/agent-contract.md`
- `docs/protocols/runtime-model.md`
- `docs/protocols/task-lifecycle.md`
- `docs/protocols/supervisor-protocol.md`
- `docs/protocols/log-archive-policy.md`
- P0 实施清单与负责人口径

---

## 20. 文档收尾模板

```markdown
## 决策总结

| 决策项 | 结论 | 负责人 | 截止时间 |
|--------|------|--------|----------|
| | | | |

### 已确认事项
- [ ]
- [ ]

### 待跟进事项
- [ ] （跟进人：，预期完成：）
- [ ] （跟进人：，预期完成：）

### 风险与阻塞
| 风险描述 | 影响程度 | 缓解措施 | 升级路径 |
|----------|----------|----------|----------|
| | | | |
```
