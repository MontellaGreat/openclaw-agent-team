# Architecture

## 目标
把 OpenClaw 从单助手模式，升级为：
- 主 Agent 统筹
- 附属 Agent 分工
- 风险统一复核
- 结果统一放行

## 结构
User -> 墨影（主 Agent） -> 附属 Agent（按任务分发） -> 墨影汇总 -> 最终输出

## 设计重点
1. 主 Agent 不下放最终审议权
2. 高风险任务必须回到主 Agent
3. 结果冲突由主 Agent 裁决
4. 输出尽量简洁、结论优先
