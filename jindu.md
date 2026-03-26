# jindu

## 当前任务背景
用户要求把 `openclaw-agent-team` 从“看起来像多 agent 的规范仓”推进成“真正能组织多 agent 协作的项目模板”，并要求：
1. 梳理并同步项目内不协调内容
2. 补齐主 Agent / 子 Agent 的落地文件体系
3. 把规范落到 runtime、handoff、review、release、planning 等执行层
4. 评估并吸收“智能任务规划系统”相关能力

---

## 已完成阶段总览
截至当前，项目已经经历多轮推进，核心进度如下。

### 阶段 1：结构一致性修正
已完成：
- 修正 `openclaw.example.json`
- 修正 `team-config.example.yaml`
- 修正 `INSTALL.md`
- 修正 `docs/openclaw-adaptation.md`

解决问题：
- 补回 `承枢 = chengshu` 的真实映射
- 把 `观象` 从旧版“视觉理解”统一改为 `structured ops`
- 让运行时示例与制度层一致

对应提交：
- `b259ee4 align runtime configs with coordination model`

---

### 阶段 2：补工作区脚手架
已完成：
- 新增 `docs/agent-workspace-kit.md`
- 新增 `docs/execution-playbook.md`
- 新增 `docs/planning-integration-draft.md`
- 新增 `runtime/task-card.template.json`
- 新增 `workspace-template/runtime/`
- 新增 `workspace-template/team/` 基础结构

解决问题：
- 项目不再只有规范，还开始有 workspace 落地骨架
- 补出每个角色的独立模板目录
- 开始具备 task / handoff / review / release 的运行骨架

对应提交：
- `2a0865d add executable workspace scaffolding`

---

### 阶段 3：评估“智能任务规划系统”并升级核心角色模板
已完成：
- 安装 `smart-task-planner-skill`
- 审查安装包内容（只有 `SKILL.md + manifest.json`）
- 新增 `docs/smart-task-planner-assessment.md`
- 升级 `main / chengshu / tieshou` 三套高密度模板

解决问题：
- 确认“智能任务规划系统”目前适合作为参考型 planning skill，而不是可直接依赖的成熟规划引擎
- 把主控、协调、执行三类关键角色从占位版升级成高密度版本

对应提交：
- `a7d2f61 assess planner skill and deepen core agent templates`

---

### 阶段 4：补 planning contract 与完整团队模板
已完成：
- 补齐并升级 `tanzhen / biguan / wenxi / guanxiang / pianchang`
- 新增 `docs/planning-contract.md`
- 新增 `runtime/task-tree.example.json`
- 新增完整 runtime 链样例：
  - handoff
  - review
  - release
  - task-board sample

解决问题：
- 8 个核心角色的三件套全部成型
- planning 层开始有正式 contract
- 项目第一次拥有 planning -> task -> handoff -> review -> release 的完整链条

对应提交：
- `8d1c93b add planning contract and complete team templates`

---

### 阶段 5：补运行 SOP 与操作模板
已完成：
- 新增 `docs/runtime-sop.md`
- 新增 `docs/spawn-decision-guide.md`
- 新增运行模板：
  - `runtime/delegation-request.template.md`
  - `runtime/chengshu-phase-summary.template.md`
  - `runtime/specialist-handoff.template.md`
- 新增 SOP 示例：
  - `examples/sop/main-delegation.example.md`
  - `examples/sop/chengshu-phase-summary.example.md`
  - `examples/sop/specialist-handoff.example.md`

解决问题：
- 项目从“有模板”推进到“有操作手册 + 可复制文本模板”
- 主 Agent、承枢、specialist 的日常操作开始具备 SOP 化基础

对应提交：
- `9d2c54a add runtime SOP and operator templates`

---

## 当前项目状态判断

### 已经成立的部分
当前项目已经不再只是规范说明仓，而是具备了以下 6 层：

1. **制度层**
   - 角色边界
   - 风险与 review gate
   - 放行规则
   - roster discipline

2. **角色层**
   - 8 个核心角色已形成独立三件套：
     - `AGENTS.md`
     - `SOUL.md`
     - `IDENTITY.md`

3. **脚手架层**
   - `workspace-template/`
   - `workspace-template/team/`
   - `workspace-template/runtime/`

4. **对象层**
   - task card
   - task tree
   - handoff
   - review card
   - release decision

5. **操作层**
   - runtime SOP
   - spawn 决策手册
   - delegation / handoff / phase summary 模板

6. **样例层**
   - runtime chain 示例
   - SOP 示例

### 还未完全成立的部分
虽然项目已经明显从“空谈”推进为“可执行模板仓”，但仍未完全进入最终可运行阶段。当前仍缺：

1. **启动与验收层**
   - 还缺“首日初始化步骤”与“上线验收清单”的体系化沉淀

2. **planning 实现层**
   - 当前已有 planning contract，但还没有真实 planner 实现或映射脚本

3. **真实多 Agent 运行回路验证**
   - 仓库里已经有 runtime 对象与模板，但还未形成一套经过真实长期使用验证的闭环操作记录

4. **智能任务规划系统工程化实现**
   - 当前仅完成参考型评估，尚未进入真正设计、实现与集成开发阶段

---

## 对“智能任务规划系统”的当前判断
当前已完成：
- 安装：`openclawmp install skill/@u-d61a7c84254848ff8be0/smart-task-planner-skill`
- 审查结论：
  - 包体仅有 `SKILL.md` 与 `manifest.json`
  - 没有脚本、schema、runtime 对接文件或输出 contract
  - 更适合作为 planning enhancement 参考，不适合作为当前主链依赖

对应文档：
- `docs/smart-task-planner-assessment.md`
- `docs/planning-integration-draft.md`
- `docs/planning-contract.md`

---

## 当前仓库的准确定位
目前的 `openclaw-agent-team` 已经从：
- 角色设定仓

推进为：
- **多 Agent 团队操作系统雏形 / 可执行团队模板仓**

它已经具备：
- 制度
- 角色
- 模板
- planning contract
- runtime 对象
- SOP
- 示例链

但还没完成：
- 初始化层
- 验收层
- planner 实现层
- 长周期实战验证层

---

## 当前最值得继续推进的方向
结合当前状态，后续最值得推进的工作应集中在两条主线：

### 主线 A：项目本体进入“初始化 + 验收 + 长期运行”阶段
目标：
- 让这套模板不只是能读懂，而是真能部署、初始化、验收、运行

建议方向：
- 初始化手册
- 首日操作清单
- 团队上线验收清单
- runtime 目录进一步分层
- 长任务归档策略

### 主线 B：真正的智能任务规划系统工程化接入
目标：
- 从 planning concept 进入 planning system implementation

建议方向：
- 设计 planner input / output / node / dependency schema
- 设计 planning 到 task-board 的映射流程
- 设计 planner 与承枢 / 墨影的职责边界
- 逐步实现真正可运行的智能任务规划系统

---

## 当前 HEAD
当前最新提交：
- `9d2c54a add runtime SOP and operator templates`

在此基础上，下一步将进入：
1. 进度报告广播给所有子 Agent
2. 围绕项目本体与智能任务规划系统两条线进行多轮讨论
3. 汇总形成：
   - `guihua.md`
   - 智能任务规划系统专项计划书
