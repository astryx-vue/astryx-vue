---
layout: component-docs
title: useTableColumnsVirtualization
outline: false
footer: false
---

<script setup lang="ts">
import { useTableColumnsVirtualizationWideTable } from '../../../../components/demos/use-table-columns-virtualization'
</script>

## 使用方法

返回一个 `TablePlugin`，让列很多的宽表格只渲染横向看得见的那几列。没露出来的列用一格等宽的空白撑着，横向滚动条和全部渲染时一样长；视口左右各多渲染几列，快速滚动时不会露白。

```ts
import { useTableColumnsVirtualization } from '@astryx-vue/core/Table'
```

滚动区放得下整张表时，所有列都会渲染。用 `useTableStickyColumns` 钉住的列一直在页面上，只有夹在中间的列参与窗口化。

## 示例

<DemoExample
  :demo="useTableColumnsVirtualizationWideTable"
  description="49 列的温度表，第一列钉在左边。左右滚动时，只有视口附近的几列在页面上。"
  locale="zh"
  title="useTableColumnsVirtualization — 宽表格"
/>

## 建议

- 列宽用 `pixel()` 或带下限的 `proportional()`。窗口化时每一列按表格最小宽度下的像素宽度显示，表格不会再拉伸列去填满剩余空间。
- 开启后，单元格默认单行显示、超出部分用省略号截断。显式写 `textOverflow="wrap"`、表格 `style.minWidth` 比各列下限之和更宽，或者有 `renderCell` 的自定义列时，会退回渲染所有列。
- 焦点所在的格子滚出视口后，那一列会继续留在页面上，直到焦点离开表格或换到别的格子。读屏会读到真实的总列数和每一格的列位置。
- 行也很多时，再加上 `useTableRowsVirtualization`，两个插件一起放进 `plugins`。
