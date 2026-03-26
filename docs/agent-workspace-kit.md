# Agent Workspace Kit

这不是“设定展示目录”，而是让多 Agent 真正落地的最小工作区脚手架。

## 目标
把本仓库从：
- 只有规则文档

推进到：
- 有主 Agent 根文件
- 有子 Agent 独立模板
- 有任务板与交接样板
- 有最小落地步骤
- 能明确区分“真实协调层”与“主会话内模拟协调”

---

## 推荐目录

```text
workspace/
├── AGENTS.md
├── SOUL.md
├── IDENTITY.md
├── TOOLS.md
├── USER.md
├── HEARTBEAT.md
├── team/
│   ├── main/
│   │   ├── IDENTITY.md
│   │   ├── SOUL.md
│   │   └── AGENTS.md
│   ├── chengshu/
│   │   ├── IDENTITY.md
│   │   ├── SOUL.md
│   │   └── AGENTS.md
│   ├── tanzhen/
│   │   ├── IDENTITY.md
│   │   ├── SOUL.md
│   │   └── AGENTS.md
│   ├── biguan/
│   │   ├── IDENTITY.md
│   │   ├── SOUL.md
│   │   └── AGENTS.md
│   ├── tieshou/
│   │   ├── IDENTITY.md
│   │   ├── SOUL.md
│   │   └── AGENTS.md
│   ├── wenxi/
│   │   ├── IDENTITY.md
│   │   ├── SOUL.md
│   │   └── AGENTS.md
│   ├── guanxiang/
│   │   ├── IDENTITY.md
│   │   ├── SOUL.md
│   │   └── AGENTS.md
│   └── pianchang/
│       ├── IDENTITY.md
│       ├── SOUL.md
│       └── AGENTS.md
├── runtime/
│   ├── task-board.jsonl
│   ├── handoffs/
│   ├── reviews/
│   └── release/
└── docs/
    └── execution-playbook.md
```

---

## 三层落地

### 1. 根文件：团队总规
负责全局共识：
- 总控原则
- 复杂度分级
- 高风险规则
- 交接最小字段
- 并行规则

### 2. team/：角色专属约束
每个角色只写 3 类东西：
- `IDENTITY.md`：我是谁、负责什么、不负责什么
- `SOUL.md`：语气、判断偏好、输出倾向
- `AGENTS.md`：接任务后怎么做、怎么交接、什么情况下升级

不要给每个子 Agent 复制一套庞大 `TOOLS.md` 和 `USER.md`。
这两类通常保留在根目录，避免多份漂移。

### 3. runtime/：运行痕迹
这里不讲理念，只存运行对象：
- task board
- handoff
- review card
- release decision

没有这一层，团队就只是在聊天，不是在协作。

---

## 最小运行闭环

1. 墨影接任务
2. 在 `runtime/task-board.jsonl` 记一条任务
3. 判断 L1/L2/L3/L4
4. 若需派发，按角色模板下发
5. 子 Agent 回传 handoff
6. 必要时生成 review card
7. 墨影给 release decision
8. 更新 task-board 状态

---

## 什么叫“真正落地”

满足以下 5 条，才算不是空谈：
- 有主 Agent 根文件
- 有子 Agent 独立模板
- 有任务状态对象
- 有 handoff 实物
- 有 review / release 记录

---

## 任务规划系统如何接入

像“智能任务规划系统”这类外部资产，不应直接替代本仓库。
更适合放在以下三种位置之一：

1. **planning skill**
   - 负责把用户目标拆成任务树
   - 输出到 `runtime/task-board.jsonl`

2. **experience / integration guide**
   - 作为外部规划系统接入说明
   - 说明何时用、怎么用、输出怎么映射到本仓库字段

3. **control-center sidecar**
   - 用来做任务树可视化或阶段推进
   - 但最终放行仍归墨影

接入前先问三件事：
- 它输出的是任务树，还是最终决策？
- 能否映射到本仓库的 task/handoff/review/release 字段？
- 会不会把承枢和墨影的职责冲掉？

若会冲掉总控与协调层，只能参考，不应硬接。
