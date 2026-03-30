# Feishu + 多 Agent 接入说明

## 结论先说
按 OpenClaw 官方口径：

- **多 agent** 是通过 `agents.list` + `bindings` 实现的
- **Feishu** 是通过 `channels.feishu.accounts.<accountId>` 接入的
- **入站消息路由到哪个 agent**，不是靠 prompt 决定，而是靠 `bindings` 决定
- 如果你要把飞书私聊固定绑定到某个 agent，应该用：
  - `channel: "feishu"`
  - `accountId`
  - `peer.kind: "dm"`
  - `peer.id: "user:open_id"`

也就是说：
**多 agent 接入的核心不是“写很多 prompt”，而是“配置 agents + bindings + channel account”。**

---

## 一、官方接入骨架

### 1. 多 agent
官方文档里的核心字段是：
- `agents.list`
- `bindings`

每个 agent 至少有：
- `id`
- `workspace`
- 可选 `agentDir`
- 可选 `default`
- 可选 `model`

### 2. Feishu
官方文档里的核心字段是：
- `channels.feishu.enabled`
- `channels.feishu.dmPolicy`
- `channels.feishu.accounts.<accountId>.appId`
- `channels.feishu.accounts.<accountId>.appSecret`

如果是国际版 Lark，可加：
- `domain: "lark"`

### 3. 路由
把消息路由给指定 agent，用：
- `bindings[].agentId`
- `bindings[].match.channel`
- `bindings[].match.accountId`
- `bindings[].match.peer`

---

## 二、飞书私聊绑定到指定 agent 的最小方法

如果你的目标是：

- 一个 Feishu 机器人账户
- 指定某个用户私聊
- 永远进 `moying` 这个 agent

最小写法就是：

```json5
{
  "bindings": [
    {
      "agentId": "moying",
      "match": {
        "channel": "feishu",
        "accountId": "default",
        "peer": {
          "kind": "dm",
          "id": "user:ou_xxx"
        }
      }
    }
  ]
}
```

这里的 `ou_xxx` 要用飞书用户的 `open_id`。

---

## 三、适合你现在这套仓库的接法

你现在这个仓更像：
- 治理规范仓
- 角色卡仓
- 运行包仓

所以接入时更适合：

### 方案 A：单飞书账户 + 多 agent 路由
适用：
- 一个飞书机器人
- 不同用户 / 不同群 / 不同场景 进入不同 agent

核心：
- `channels.feishu.accounts.default`
- `bindings` 做精确路由

### 方案 B：先只绑定 `moying`
适用：
- 先把主 Agent 跑稳
- specialist 暂时只作为运行包和子 agent 逻辑存在

核心：
- Feishu 入口先全部进 `moying`
- 复杂任务再由 `moying` 内部调 `sessions_spawn` / `subagents`

我判断你当前最稳的是：
- **先走方案 B**

因为这样：
- 飞书入口简单
- 路由不乱
- 先把主链跑稳
- specialist 先不做外部直连入口

---

## 四、子 agent / specialist 怎么接

按官方文档：
- 子 agent 不是靠渠道直接暴露出去的
- 更适合通过：
  - `sessions_spawn`
  - `subagents`

这意味着：

### 对你现在这套角色
更合理的是：
- Feishu 外部入口：`moying`
- 内部协作：`chengshu` / `tieshou` / `wenxi` / `tanzhen` ...
- 由主 Agent 在复杂任务时再生成子运行

这比“让每个 specialist 都直接挂一个飞书入口”更稳。

---

## 五、试验配置怎么理解

试验配置文件重点演示 4 件事：
1. 如何声明多个 agent
2. 如何配置 Feishu 账户
3. 如何把 Feishu 私聊绑定到 `moying`
4. 如何给后续 specialist 预留 agent 位

注意：
- 这份文件是**试验配置样例**
- `appId` / `appSecret` / `open_id` 需要你自己替换
- 修改后要重启 Gateway：
  - `openclaw gateway restart`

---

## 六、我的最终判断

如果你问：
**“OpenClaw 官方口径下，多 agent + Feishu 应该怎么接？”**

答案是：
- **入口靠 `channels.feishu.accounts`**
- **路由靠 `bindings`**
- **多 agent 靠 `agents.list`**
- **复杂任务内部协作靠 `sessions_spawn` / `subagents`**

对你当前阶段，最推荐的试验方式是：
- **Feishu 外部只接 `moying`**
- **specialist 保持内部子 agent 形态**
- **先把主链跑稳，再扩路由**
