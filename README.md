# OpenClaw Agent Team

一个面向 OpenClaw 多 Agent 协作的模板仓，用于沉淀主 Agent、specialist、协作协议、handoff 规范、gate 规则与验收样例。

> 一句话快速安装提示词：直接使用 `prompt/PROMPT_FULL.md` 作为唯一正式主提示词入口。

## 当前结构
- `main-agent/moying.md`：主 Agent 正式角色卡
- `agent-cards/`：specialist 正式角色卡
- `agents/`：各角色正式运行包（`IDENTITY.md` / `SOUL.md` / `TOOLS.md` / `AGENTS.md`）
- `docs/core/`：定位、架构、总览
- `docs/protocols/`：路由、handoff、review/release gate 等协议
- `docs/operations/`：执行、排障、发布、接入
- `docs/reference/`：边界表、协作表、参考说明
- `examples/`：复杂链路、统一验收、handoff 示例
- `workspace/templates/AGENTS.md`：长期运行入口模板

## 正式角色卡
- `main-agent/moying.md`
- `agent-cards/chengshu.md`
- `agent-cards/tieshou.md`
- `agent-cards/biguan.md`
- `agent-cards/wenxi.md`
- `agent-cards/tanzhen.md`
- `agent-cards/guanxiang.md`
- `agent-cards/pianchang.md`

## 正式主提示词
- `prompt/PROMPT_FULL.md`

## 协议与样例
- `docs/protocols/agent-routing-playbook-v1.md`
- `docs/protocols/review-release-gates-v1.md`
- `docs/reference/agent-collaboration-boundaries-v1.md`
- `examples/sop/role-handoff-examples-v1.md`
- `examples/complex-task-chain-example-v1.md`
- `examples/unified-acceptance-example-v1.md`

## 说明
- GitHub 仓库只保留当前有效正式版与仍在使用的协议文档。
- 历史迭代稿不再保留在仓库主线；如需追溯，可查 Git 历史或本地 archive。
