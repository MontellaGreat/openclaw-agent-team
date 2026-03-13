# Example Control Center Pairing

## 目标
让 `openclaw-agent-team` 负责“团队制度”，让 `openclaw-control-center` 负责“运行观察”。

## 最小组合
1. 主 Agent 注入 `prompt/one-shot-prompt.md`
2. 独立部署 `openclaw-control-center`
3. 通过控制中心观察 agent roster、任务状态、风险信号、使用量

## 推荐说明语
这套系统由两部分组成：
- openclaw-agent-team：定义谁负责什么、什么时候复核、什么时候放行
- openclaw-control-center：把系统状态、任务卡点、运行风险以界面方式展示出来

## 什么时候需要更深集成
- 想把“高风险待复核”直接显示在 UI
- 想把放行状态作为任务字段展示
- 想把角色定义直接映射到控制中心的员工/任务视图
