# Smart Task Planner Skill Assessment

## 结论
这个 skill **可以作为参考型 planning skill 纳入项目视野**，但**目前还不能当成“可直接接入本仓库主链”的成熟能力**。

原因很直接：
- 安装包里只有 `SKILL.md + manifest.json`
- 没有实际脚本
- 没有结构化输出格式
- 没有与本仓库 `task / handoff / review / release` 的字段映射
- 宣传里提到 DAG、执行监控、重试、可视化，但包内没有可验证实现

所以当前更像：
- 一个规划思路说明
- 一个概念性 skill
- 一个可作为设计参考的 planning 方向

而不是：
- 一个已经可落地的任务规划引擎

---

## 包内容审查
安装位置：
- `/root/.openclaw/skills/smart-task-planner-skill`

实际文件：
- `SKILL.md`
- `manifest.json`

未发现：
- Python/JS 脚本
- references 文档
- 任务模板
- DAG schema
- runtime 对接文件
- 输出 contract

---

## 能提供的价值
它对本项目的价值主要在 3 点：

### 1. 任务树思路
它强调：
- 多步骤任务分解
- 依赖关系
- 并行优化

这和本仓库的 L3/L4 协作链是同方向的。

### 2. 规划层提醒
它提醒我们：
- 复杂任务不应只靠主 Agent 临场口述拆解
- 应该存在任务树 / 依赖表达 / 阶段推进对象

### 3. 可以作为 planning enhancement 入口
它适合被吸收成：
- planning 方法说明
- 外部规划层接入 draft
- 将来 task board 的任务树扩展方向

---

## 不能直接拿来用的原因
### 1. 没有实际执行体
SKILL 里举了 `TaskPlanner` 的 Python 用法，但包里并没有这个实现。
所以现在不能把它当真实可调用规划器。

### 2. 没有结构化输出 contract
它没有定义：
- 输入格式
- 输出字段
- DAG 节点 schema
- 如何映射到 `task_id / owner_agent / support_agents / dependencies`

### 3. 没有接入治理边界
它没有说明：
- 规划层与承枢的关系
- 规划建议是否需要墨影确认
- 高风险规划如何进入 review gate

这意味着：
如果直接接，容易冲掉本仓库的总控逻辑。

---

## 适合放在项目里的位置
我建议当前把它放在 **“参考型 planning skill / integration reference”** 位置，而不是核心运行依赖。

更具体地说，有两个可行定位：

### 定位 A：参考 skill
把它当成：
- 任务拆解思路参考
- DAG / dependency 概念提醒
- planning enhancement 候选

### 定位 B：接入草案素材
把它纳入 `docs/planning-integration-draft.md` 这类文档中，作为：
- 外部规划系统候选
- 将来扩展 task board 的灵感来源

不建议当前定位为：
- 可直接执行的规划器
- 团队主流程核心依赖
- 可替代承枢 / 墨影的协调与定级模块

---

## 建议接法
如果后续真要把它吸收到项目里，建议分三步：

### 第一步：只吸收理念，不吸收实现宣称
先把它的有效部分吸收到项目文档：
- DAG / dependencies
- 并行优化判断
- 阶段推进

### 第二步：补本仓库自己的 planning contract
先在本仓库定义：
- planning input
- planning output
- task tree schema
- dependencies 字段
- 规划结果如何进入外部任务系统或任务板

### 第三步：再决定是否做成真正的 planning skill
到那时才值得新增：
- `docs/planning-contract.md`
- 外部任务系统中的任务树 schema
- 外部任务系统的 plan 输出目录
- 如果真要可执行，再补脚本或插件实现

---

## 一句话判断
这个“智能任务规划系统”现在**值得参考，不值得直接依赖**。
它更适合成为本项目未来的 planning layer 灵感来源，而不是马上接进主链当真引擎。
