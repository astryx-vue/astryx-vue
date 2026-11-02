---
'@astryx-vue/core': minor
---

`Item` 新增 `align="first-line"`：`startContent` 和 `endContent` 改为相对标签第一行居中，而不是相对整块多行内容居中。标签换行时，状态点、单选按钮、时间戳这类小标记能继续贴着第一行；插槽比第一行高时把文字压下去。默认值仍是 `center`，`center` 和 `start` 的对齐不变。
