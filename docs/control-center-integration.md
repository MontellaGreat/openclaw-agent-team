# OpenClaw Control Center Integration

本项目支持把 `TianyiDataScience/openclaw-control-center` 作为 **配套控制台** 接入，用来给这套多 Agent 分工提供一个可视化总控界面。

目标不是把两个项目强行揉成一个巨石仓库，而是保持：
- `openclaw-agent-team` 负责 **提示词、分工制度、调度规则、放行规则**
- `openclaw-control-center` 负责 **本地控制中心 UI / 运行态观察 / 风险与任务可视化**

这样更稳，也更容易迁移到别的 OpenClaw 实例。

---

## 推荐集成方式

### 方式 A：文档级集成（默认推荐）
适合：
- 想先把多 agent 分工规范跑起来
- 不想一上来就引入大量前端/Node 代码
- 希望仓库职责清晰

做法：
1. 本仓库保留团队规范与 one-shot prompt
2. 单独 clone `openclaw-control-center`
3. 按 control-center 自己的安装说明完成接线
4. 在控制中心中把本项目当作“团队制度层”使用

优点：
- 风险低
- 维护清晰
- 便于独立升级

### 方式 B：Git Submodule 集成
适合：
- 希望一个总仓库管理多个配套仓库
- 接受 submodule 的维护成本

示例：
```bash
git submodule add https://github.com/TianyiDataScience/openclaw-control-center.git integrations/openclaw-control-center
```

优点：
- 可以固定版本
- 保留上游独立更新能力

注意：
- submodule 对非技术用户不够友好
- clone 时需要额外初始化

### 方式 C：代码拷贝 / vendor（不默认推荐）
除非后续明确要做深度二次开发，否则不建议直接把对方仓库源码整体搬进本仓库。

原因：
- 仓库体积变大
- 升级难
- 容易和上游分叉失控

---

## 在这套项目中的定位

你可以把整个系统理解成两层：

### 第一层：制度层（本仓库）
回答：
- 谁负责什么
- 什么任务怎么分
- 什么算高风险
- 谁来复核
- 什么条件才能放行

### 第二层：观察层（Control Center）
回答：
- 系统是否稳定
- 谁在工作
- 哪些任务卡住了
- 风险和状态如何可视化
- 当前运行态是否符合预期

---

## 推荐落地路径

1. 先使用本仓库的 `prompt/one-shot-prompt.md` 建立多 agent 分工
2. 再部署 `openclaw-control-center`
3. 用控制中心观察这套分工在真实 OpenClaw 中是否稳定运行
4. 之后再决定是否做更深的联动（例如预置任务视图、agent roster 映射、规则检查）

---

## 后续可做的深度联动

如果后续要做进一步集成，建议按下面顺序推进：

1. **Roster 映射**
   - 把 `墨影 / 探针 / 铁手 / 笔官 / 问隙 / 观象 / 片场` 映射成控制中心里的标准角色显示

2. **风险标签联动**
   - 把“高风险任务必须复核”的规则映射成 UI 标识

3. **放行状态联动**
   - 在控制中心里展示：待审议 / 已复核 / 可放行 / 不建议放行

4. **调度规则观测**
   - 标记当前任务是否单线、是否并行、是否超出边界

5. **团队制度可视化**
   - 在控制中心展示本仓库中的团队规则与角色定义

---

## 上游项目

- GitHub: https://github.com/TianyiDataScience/openclaw-control-center

建议把它视为：
**这套多 Agent 协作蓝图的控制台搭档，而不是强耦合源码依赖。**
