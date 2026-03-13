# OpenClaw Adaptation

## 目标
让这套多 Agent 分工可以迁移到别的 OpenClaw 实例，并尽量做到“一段提示词即可起用”。

## 最小要求
1. 目标 OpenClaw 支持主 Agent 的 system prompt / persona / boot prompt 注入
2. 如需真实多 agent 调度，目标实例应有可调用的子 agent 能力
3. 如果没有真实子 agent，也可以先把这套提示词作为“单 Agent 内部分工模拟”使用

## 推荐映射
- 墨影=main
- 探针=tanzhen
- 铁手=tieshou
- 笔官=biguan
- 问隙=wenxi
- 观象=guanxiang
- 片场=pianchang

## 使用方式
- 直接复制 `prompt/one-shot-prompt.md`
- 放入目标 OpenClaw 的主 Agent 提示区
- 如本地 agent 名称不同，只替换映射段即可

## 注意事项
- 提示词解决的是“分工规则”，不是“自动创建子 agent”
- 若目标实例尚无对应子 agent，需要先完成 agent 注册或建立等价映射
- 高风险规则建议保留，不要删
