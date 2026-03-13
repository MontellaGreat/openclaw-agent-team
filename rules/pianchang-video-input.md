# 片场-视频输入规则

来源：用户提供《文生视频使用说明.md》《图生动作视频使用说明.md》《参考生视频使用说明.md》《视频换人使用说明.md》整理。

---

## 一、片场-视频的职责范围

片场-视频负责：
- 文生视频
- 图生动作视频
- 参考生视频
- 视频换人
- 多镜头/单镜头视频生成
- 有声/无声视频生成判断

不负责：
- 单纯静态图片生成（应交给片场-生图）
- 单纯图片编辑（应交给片场-修图）

---

## 二、视频任务分类

片场在分发给片场-视频前，必须先判断属于哪一类：

### A. 文生视频（T2V）
适用模型示例：
- `wan2.6-t2v`
- `wan2.6-t2v-us`
- `wan2.5-t2v-preview`
- `wan2.2-t2v-plus`
- `wanx2.1-t2v-turbo`
- `wanx2.1-t2v-plus`

最小输入：
- `prompt`

常用参数：
- `size`
- `duration`
- `negative_prompt`
- `prompt_extend`
- `shot_type`
- `watermark`
- `seed`
- `audio_url`（部分模型）

### B. 图生动作视频（I2V Animate Move）
适用模型：
- `wan2.2-animate-move`

最小输入：
- `image_url`
- `video_url`
- `mode`（`wan-std` / `wan-pro`）

### C. 参考生视频（R2V）
适用模型：
- `wan2.6-r2v`
- `wan2.6-r2v-flash`

最小输入：
- `prompt`
- `reference_urls`

常用参数：
- `size`
- `duration`
- `shot_type`
- `audio`（仅 flash）
- `watermark`
- `seed`

### D. 视频换人（Video Swap）
适用模型：
- `wan2.2-animate-mix`

最小输入：
- `image_url`
- `video_url`
- `mode`（`wan-std` / `wan-pro`）

---

## 三、总调度前置检查

### 1. 地域一致性
模型、Endpoint、API Key 必须属于同一地域。
跨地域调用会失败。

### 2. 一律按异步任务处理
视频生成通常耗时 1-5 分钟，HTTP 调用默认按异步任务处理：
- 创建任务
- 获取 `task_id`
- 轮询查询

### 3. 不要重复创建任务
创建成功后，应轮询已有 `task_id`，不要重复提交同一任务。

### 4. 结果有 24 小时时效
- `task_id` 通常有效 24 小时
- `video_url` 通常有效 24 小时
片场回传时必须提醒及时下载或转存。

---

## 四、文生视频规则

### 输入要求
最少确认：
1. `prompt`
2. `size`
3. `duration`
4. 是否需要有声
5. 是否需要多镜头

### 关键规则
- `X-DashScope-Async: enable` 必填
- `size` 直接影响费用
- `duration` 直接影响费用
- `prompt_extend=true` 会提升短 prompt 效果，但增加耗时
- `shot_type` 优先级高于 prompt 内描述

### 有声/无声规则
- `wan2.6` / `wan2.5` 默认有声视频
- 若提供 `audio_url`，模型使用该音频
- `audio_url` 约束：wav/mp3，3-30s，<=15MB
- `wan2.2` / `wanx2.1` 可生成无声视频
- 自动配音、多镜头等能力受模型版本限制，片场必须先核对模型能力

### 尺寸与时长
片场必须明确写出：
- 分辨率档位：480P / 720P / 1080P
- 具体 size：如 `1280*720`
- duration：如 5 / 10 秒

---

## 五、图生动作视频规则

### 输入要求
最少确认：
1. `image_url`
2. `video_url`
3. `mode`：`wan-std` 或 `wan-pro`

### 输入素材约束
#### image_url
- 格式：JPG / JPEG / PNG / BMP / WEBP
- 宽高都在 `[200,4096]`
- 宽高比在 `1:3 ~ 3:1`
- 不超过 5MB
- 画面中仅有一人，正对镜头，人脸完整无遮挡，占比适中

#### video_url
- 格式：MP4 / AVI / MOV
- 时长：2-30s
- 宽高都在 `[200,2048]`
- 宽高比在 `1:3 ~ 3:1`
- 不超过 200MB
- 画面中仅有一人，正对镜头，人脸完整无遮挡，占比适中

### 调度规则
- 追求快速预览 -> `wan-std`
- 追求更高流畅度和效果 -> `wan-pro`
- 输入人像与参考视频人物比例差异过大时，不建议直接执行

---

## 六、参考生视频规则

### 输入要求
最少确认：
1. `prompt`
2. `reference_urls`
3. `size`
4. `duration`
5. `shot_type`

### reference_urls 规则
- 支持图像和视频混合
- 图像数量：0-5
- 视频数量：0-3
- 总数：图像 + 视频 <= 5
- 按数组顺序定义 `character1 / character2 / ...`
- 每个参考文件应只包含一个主体角色

### 素材限制
#### 参考视频
- MP4 / MOV
- 1-30s（文档部分示例旧字段写 2-30s，按新 `reference_urls` 规范优先）
- <=100MB

#### 参考图像
- JPEG / JPG / PNG（不支持透明）/ BMP / WEBP
- 宽高在 `[240,8000]`
- <=10MB

### 调度规则
- 多角色互动 -> `shot_type=multi`
- 单角色扮演也可用 `multi` 做多镜头叙事
- `wan2.6-r2v-flash` 支持 `audio` 参数
- 若要无声视频，必须显式 `audio=false`（仅 flash）
- 片场必须把 reference_urls 与 character 编号关系写清楚

---

## 七、视频换人规则

### 输入要求
最少确认：
1. `image_url`
2. `video_url`
3. `mode`

### 输入素材约束
#### image_url
- 格式：JPG / JPEG / PNG / BMP / WEBP
- 宽高都在 `[200,4096]`
- 宽高比在 `1:3 ~ 3:1`
- 不超过 5MB

#### video_url
- 格式：MP4 / AVI / MOV
- 宽高都在 `[200,2048]`
- 宽高比在 `1:3 ~ 3:1`
- 时长：2-30s
- 不超过 200MB

### 调度规则
- 固定模型：`wan2.2-animate-mix`
- 快速预览 / 成本优先 -> `wan-std`
- 效果优先 -> `wan-pro`
- 若用户希望大幅改动镜头结构或动作，不应当做“换人”，应改走其他视频路线
- 地域、Endpoint、API Key 必须匹配

---

## 八、统一轮询与结果回传规则

片场-视频回传时，至少包含：
1. 视频任务类型（文生 / 图生动作 / 参考生 / 换人）
2. 所选模型
3. 核心输入摘要
4. `task_id`
5. `task_status`
6. 成功时的 `video_url`
7. 关键 usage 信息（如 `duration` / `size` / `output_video_duration` / `video_ratio`）
8. 风险与限制
9. 24 小时保存提醒

建议轮询间隔：
- 约 15 秒

状态流转：
- `PENDING -> RUNNING -> SUCCEEDED / FAILED`

---

## 九、片场-视频标准输出

1. 视频目标
2. 视频任务类型
3. 所选模型
4. 输入摘要
5. 参数摘要
6. 任务状态
7. 结果说明
8. 风险与限制
9. 保存/转存提醒
