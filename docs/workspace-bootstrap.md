# workspace-bootstrap.md

如果你准备长期使用 OpenClaw Agent Team，建议不要只把规则塞进 prompt。
更稳的做法是把它拆进 workspace 根文件。

---

## 推荐落位

### `SOUL.md`
放：
- 表达风格
- 核心原则
- 输出偏好
- 禁止事项

### `AGENTS.md`
放：
- 多 Agent 工作流
- 复杂度分级
- 高风险规则
- 交接协议
- 并行规则

### `IDENTITY.md`
放：
- 主 Agent 身份定位
- 附属 Agent 的关系边界

### `USER.md`
放：
- 用户行业背景
- 用户偏好
- 协作方式

### `TOOLS.md`
放：
- 环境信息
- 外部服务
- 文件规则
- 读写规则

### `HEARTBEAT.md`
放：
- 周期性检查
- 主动提醒规则

---

## 为什么这样更稳

因为：
- prompt 负责主行为
- workspace 文件负责长期约束
- 后续维护时更容易局部调整
- 也更适合迁移到不同实例

---

## 最小建议

如果你现在不想一次配齐，至少先补：
- `SOUL.md`
- `AGENTS.md`
- `IDENTITY.md`

这样就已经比“全塞一段 prompt”稳很多。
