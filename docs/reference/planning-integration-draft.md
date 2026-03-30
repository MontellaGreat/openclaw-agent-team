# Planning Integration Draft

本文件定义外部任务规划系统如何接入 `openclaw-agent-team`。

当前目标不是直接绑定某个固定平台，而是先定义：

> 任何“任务规划系统”想接入本仓库，必须怎样映射，才不会冲掉团队治理结构。

---

## 一、外部规划系统能做什么

允许增强：
- 任务拆解
- 子任务排序
- 依赖关系标注
- 阶段建议
- 任务树可视化

不允许替代：
- 墨影的复杂度定级
- 承枢的编排协调职责
- 问隙的 QA / 审查意见
- 墨影的最终 release decision

---

## 二、推荐接法

### 方式 A：Planning Skill
外部规划系统输出：
- 任务树
- 依赖关系
- 推荐执行顺序

然后由墨影确认，并落入：
- 外部任务系统 task board / 状态记录
- 外部任务系统 handoff 目录
- 外部任务系统 review 目录
- 外部任务系统 release 目录

### 方式 B：Experience / Integration Guide
如果外部系统更像“方法论产品”或“平台资产”，先不要深绑定。
先把它写成：
- 何时适用
- 何时不适用
- 输出字段怎么映射
- 风险是什么

### 方式 C：Control Center Sidecar
如果它更擅长看板和任务树展示，可作为观察层增强，而不是制度层替代。

---

## 三、最小字段映射

外部规划系统至少应能映射到以下字段：
- `task_id`
- `goal`
- `scope`
- `owner_agent`
- `support_agents`
- `dependencies`
- `status`
- `risk_level`
- `current_release_stage`

若做不到字段映射，只能作为参考材料，不能直接进入运行主链。

---

## 四、接入判断问题单

接入前先问：
1. 它是给建议，还是替你拍板？
2. 它能不能输出结构化任务对象？
3. 它会不会把承枢变成多余角色？
4. 它会不会让墨影失去最终控制？
5. 它的输出能不能被 QA / review / release 链继续消费？

只要第 3 或第 4 条答案偏向“会”，就不能直接深接。

---

## 五、对“智能任务规划系统”的当前判断

已安装包体并完成基础审查，当前判断如下：

- **适合作为 planning enhancement 候选**
- **不应直接替代本仓库的总控与治理层**
- **更适合先按参考型 planning skill / integration reference 的方式纳入**

当前已确认：
- 安装包只有 `SKILL.md` 与 `manifest.json`
- 文案强调 DAG、依赖、监控、重试、可视化
- 但包内没有可验证脚本、schema、runtime 对接文件或输出 contract

因此当前更像：
- 规划方法说明
- 设计灵感来源
- planning layer 候选方向

而不是：
- 已可直接接入主链的任务规划引擎

更完整评估见：
- `docs/smart-task-planner-assessment.md`

---

## 六、一句话原则

> 外部规划系统可以帮你拆任务，但不能替你治理团队。
