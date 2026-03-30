# Docs 规范落地核对 v1

## 结论
当前 `docs/` 里的核心规范，**大部分已经落到角色卡、运行包和主提示词里**，但还不是 100% 全覆盖。  
目前状态更准确地说是：

- **核心主链规则：已落地**
- **角色边界规则：已落地**
- **review / release gate：已落地**
- **handoff 最低要求：已落地**
- **复杂任务分级：已落地**
- **部分协议细节：只落到主提示词，未完全落到每个角色运行包**
- **少量旧 docs 仍停留在“说明层”，未完全转成运行约束**

---

## 一、已确认落地的部分

### 1. 主 Agent 决策流
来源：
- `docs/protocols/main-agent-decision-flow.md`

已落地到：
- `main-agent/moying.md`
- `agents/moying/AGENTS.md`
- `prompt/PROMPT_FULL.md`

已落地内容包括：
- 固定动作顺序
- `L1 / L2 / L3 / L4` 分级
- 什么时候直做 / 派发 / 暂停
- 复杂任务要先向用户说明为什么复杂、怎么拆、派给谁
- 最终裁决权保留在主 Agent

### 2. Review / Release Gate
来源：
- `docs/protocols/review-release-gates-v1.md`

已落地到：
- `agents/moying/AGENTS.md`
- `agents/wenxi/AGENTS.md`
- `agents/tieshou/AGENTS.md`
- `prompt/PROMPT_FULL.md`

已落地内容包括：
- review gate 最低输入
- release gate 最低输入
- `问隙` 的通过建议不等于正式放行
- 高风险结果默认不裸放

### 3. 角色边界与路由规则
来源：
- `docs/reference/agent-collaboration-boundaries-v1.md`
- `docs/protocols/agent-routing-playbook-v1.md`

已落地到：
- 各正式角色卡
- 各角色运行包
- `prompt/PROMPT_FULL.md`

已落地内容包括：
- 谁负责什么
- 谁不负责什么
- 典型任务怎么路由
- `承枢` 不拍板
- `探针` 不代替成稿
- `铁手` 不代替 QA
- `观象` 不代替正式排障闭环

---

## 二、部分落地的部分

### 1. 派单结构化程度
规范里要求：
- 子任务目标
- 边界
- 输入
- 输出
- 完成标准
- 风险等级
- 是否 review / handoff
- 下一接收方

当前状态：
- `prompt/PROMPT_FULL.md` 已写明
- `agents/moying/AGENTS.md` 已写主链和判断规则
- 但还没有单独做成一个主 Agent 派单模板文件挂到 `agents/moying/`

结论：
- **逻辑已落地**
- **模板化程度还可以再补**

### 2. 并行规则
规范里有明确并行条件。

当前状态：
- `prompt/PROMPT_FULL.md` 已收进
- `docs` 原文也在
- 但 `agents/moying/AGENTS.md` 里没有把并行规则单独展开

结论：
- **已落地到主提示词**
- **未完整落地到主 Agent 运行包**

### 3. 复杂链路样例与统一验收样例
这些已经写成样例文档，但还没有显式挂入每个相关角色的运行包索引。

结论：
- **样例已存在**
- **运行包引用还可再补强**

---

## 三、暂未完全落地的部分

### 1. docs 与 agents 的显式映射索引
现在已经有：
- 角色卡
- 运行包
- prompt
- protocol

但还缺一份非常明确的：
- “哪条 docs 规范，落到了哪个角色文件” 的映射索引

本文件正在承担这个作用，但还可以进一步结构化。

### 2. 某些 protocol 文档仍偏说明文
有些协议已经足够清楚，但还可以继续压成更直接的运行约束格式。

---

## 四、当前判断
如果问：

**“docs 里的规范有没有落到实处？”**

我的判断是：

- **主干规范已经落到实处了**
- **尤其是主链、路由、边界、gate，这几块已经不是纸面规则，而是已经进入角色卡、运行包和主提示词**
- **但还差最后一层收口：把剩余的说明性规范进一步模板化、索引化、运行化**

也就是说：

- 不是“还没落地”
- 也不是“已经完全收口”
- 而是：
  **已经完成 70%~85% 的有效落地，剩下的是精修和索引化收口**

---

## 五、下一步建议
优先做这 3 件：
1. 给 `agents/moying/` 增加结构化派单模板文件
2. 给 `agents/moying/AGENTS.md` 补并行规则与派单模板入口
3. 做一份 docs -> 角色运行包 -> prompt 的总映射索引
