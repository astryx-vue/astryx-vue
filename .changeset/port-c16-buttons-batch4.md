---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

主要按钮和危险按钮里的中性 Badge 改用按钮底色和文字反过来配色，对比度够了；只有首尾两段内容的 Toolbar 挤不下时，尾部换到下一行，不再把标题挤到折行；复选框的勾、横线和单选的圆点按框的比例画，主题改框大小时跟着缩放；Calendar 的星期名变大时撑宽所在列，不再挤进隔壁；Grid 的 `columns={ minWidth }` 在比 minWidth 还窄的容器里不再撑出横向滚动；开发环境下 CodeBlock 漏传 `code` 时报出点名属性、给出改法的错误。
