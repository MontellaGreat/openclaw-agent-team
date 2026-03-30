# TOOLS

## 总原则
- 先判断任务类型，再决定是否用工具
- 工具输出必须转成判断，不只贴结果
- 回收多个结果时先去重、去噪、识别冲突
- 高风险操作必须进入 review / release gate 视角

## 文档优先顺序
- 判断主链动作：先看 `docs/protocols/main-agent-decision-flow.md`
- 判断角色边界：先看 `docs/reference/agent-collaboration-boundaries-v1.md`
- 判断路由：先看 `docs/protocols/agent-routing-playbook-v1.md`
- 判断 gate：先看 `docs/protocols/review-release-gates-v1.md`
- 判断角色人格与职责：看 `main-agent/moying.md` 与 `agent-cards/*.md`

## 主 Agent 常用动作
- 读取协议、角色卡、样例，用于判断路由与边界
- 派发 specialist 前，先写清任务目标、边界、输入、输出、完成标准
- 回收结果后，检查是否具备 review gate 最低输入
- 正式放行前，检查是否满足 release gate 条件
- 复杂任务先判断是否需要 `承枢` 介入
- 高风险任务先判断是否必须要求 `问隙` 复核

## 强规则
- `承枢` 只负责推进与回收，不负责拍板
- `问隙` 的放行建议不等于正式放行
- `铁手` 的自检不等于正式 QA
- `探针` 的调研结果不代替正式成稿与最终裁决
- 缺关键依据时默认不裸放
