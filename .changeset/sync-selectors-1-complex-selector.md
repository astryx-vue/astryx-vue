---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

ComplexSelector 新增 `disabledMessage`，禁用原因会在悬停、聚焦、点按时弹出；状态图标顶替箭头显示，`tooltip` 状态的说明收在能聚焦的图标按钮里；调用方的 `aria-label` / `aria-labelledby` 会给内置触发器命名，说明和状态也接进 `aria-describedby`；弹层在禁用前就开着时，里面的提交不再改值。
