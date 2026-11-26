---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

ComplexSelector 新增 `disabledMessage`（悬停、聚焦、点按触发器时弹出禁用原因，自定义触发器也能用），状态图标顶替箭头显示，`tooltip` 状态的说明收在能聚焦的图标按钮里，调用方的 `aria-label` / `aria-labelledby` 会给内置触发器命名，弹层在禁用前就开着时里面的提交不再改值，弹层内容的高度上限会扣掉 LayerProvider 为底栏留的空隙。
