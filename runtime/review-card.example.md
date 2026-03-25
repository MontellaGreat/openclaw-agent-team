# Review Card Example

## 检查对象
- `configs/example.json`
- `reports/plugin-options.md`

## 检查结论
- 推荐路径清楚
- 配置修改稿边界明确
- 仍有运行时验证未覆盖项

## 风险等级
- high

## 未验证项
- 目标服务重启后的稳定性
- 权限边界是否会影响运行

## 是否建议放行
- `pass_with_risk`

## 放行建议
- 可作为内部执行稿继续推进
- 不建议直接对外宣告“已完全可用”
