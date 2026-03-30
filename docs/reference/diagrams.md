# Diagrams

本文件先用文字版图示说明项目结构，后续可再补成图片。

---

## 1. 主 Agent 决策流

```text
用户目标
  ↓
墨影判断
  ├─ 简单任务 -> 直接执行 -> 审议 -> 放行
  └─ 复杂任务 -> 分级(L2/L3/L4)
                    ↓
                 拆解 / 不拆解判断
                    ↓
              说明分工（必要时）
                    ↓
                分发给附属 agent
                    ↓
                 回收结果 / 交接
                    ↓
                  Review / 裁决
                    ↓
                    放行
```

---

## 2. 复杂任务协作流

```text
Inbox -> Judging -> Decomposed -> Assigned -> In Progress -> Handoff -> Review -> Released
                                                      └-> Failed / Blocked / Stopped
```

---

## 3. 片场调度流

```text
多媒体需求
  ↓
片场判断任务类型
  ├─ 生图 -> 片场-生图
  ├─ 视频 -> 片场-视频
  └─ 修图 -> 片场-修图
        ↓
    汇总产物与限制
        ↓
      墨影审议
        ↓
      放行/迭代
```

---

## 4. Review Gate

```text
附属 agent 产出
   ↓
Handoff
   ↓
Review
   ↓
墨影裁决
   ↓
Released / Failed / Stopped
```

---

## 5. 核心理念一句话图

```text
能直做就直做，复杂再拆，高风险必审，交接不等于完成，放行必须由墨影决定。
```
