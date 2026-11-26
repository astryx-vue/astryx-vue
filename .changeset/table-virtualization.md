---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

新增 `useTableRowsVirtualization` 和 `useTableColumnsVirtualization`：数据很多的表格只渲染看得见的行和列，滚动手感不变；开启后单元格默认单行截断，行版本会让表格填满父元素的高度并在里面滚动。
