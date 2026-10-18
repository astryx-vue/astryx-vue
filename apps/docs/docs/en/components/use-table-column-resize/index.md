---
layout: component-docs
title: useTableColumnResize
outline: false
footer: false
---

<script setup lang="ts">
import { useTableColumnResizeDraggableColumns } from '../../../../components/demos/use-table-column-resize'
</script>

## Usage

Hook that returns a `TablePlugin` adding draggable resize handles to column header borders. Dragging the right edge of a header previews a new width for that column. The width is committed when the pointer is released: the plugin hands `onColumnResizeEnd` a map of every column key whose width changed, and you merge it into `columnWidths`. The narrowest width is 60px.

```ts
import { useTableColumnResize } from '@astryx-vue/core/Table'
```

The config is read again on every access, so pass a getter when the widths live in a `ref`. A plain object works too, but it keeps whatever widths it had the first time the table asked.

The hook only reports and stores widths. It does not resize the neighbouring column, and it has no keyboard or RTL resizing.

## Examples

<DemoExample
  :demo="useTableColumnResizeDraggableColumns"
  description="A Table using useTableColumnResize. Drag the right edge of any column header to resize; the width is kept when you release the pointer. The remaining proportional columns share what is left."
  locale="en"
  title="useTableColumnResize — Draggable Columns"
/>
