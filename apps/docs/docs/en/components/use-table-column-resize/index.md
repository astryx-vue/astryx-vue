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

Hook that returns a `TablePlugin` adding draggable resize handles to column header borders. Every resizable column gets a handle on its inline end, except the last proportional column: that one keeps flexing to fill whatever space is left. Dragging previews the new widths, and releasing the pointer commits them: `onColumnResizeEnd` receives a map of every column key whose width changed, and you merge it into `columnWidths`.

```ts
import { useTableColumnResize } from '@astryx-vue/core/Table'
```

A proportional column hands width to the next resizable column, so the table stays full width while you drag. A pixel column has no neighbour to lean on, so only its own width changes and the last column takes up the difference.

```ts
const columnWidths = ref<Record<string, number>>({})
const resizePlugin = useTableColumnResize(() => ({
  columnWidths: columnWidths.value,
  minWidth: 80,
  maxWidth: 400,
  onColumnResizeEnd(updates) {
    columnWidths.value = { ...columnWidths.value, ...updates }
  },
}))
```

The config is read again on every access, so pass a getter when the widths live in a `ref`. A plain object works too, but it keeps whatever widths it had the first time the table asked.

### How narrow and how wide

Each column's floor comes from the column itself: `proportional(n, { minWidth })` uses that `minWidth`, a `pixel(n)` column cannot get narrower than `n`, and a column without a `width` stops at 60px. Setting `minWidth` on the config overrides all of them, and `maxWidth` caps every column during a resize.

### Keyboard and RTL

The handle is a WAI-ARIA window splitter: focus it and use ArrowLeft / ArrowRight to move 10px, hold Shift for 50px, Home to jump to the narrowest allowed width, and End to jump to `maxWidth`. Right and left follow the writing direction, so in RTL the arrows resize the other way.

## Examples

<DemoExample
  :demo="useTableColumnResizeDraggableColumns"
  description="A Table using useTableColumnResize. Drag the right edge of any column header to resize; the width is committed when you release the pointer. The remaining proportional columns share what is left."
  locale="en"
  title="useTableColumnResize — Draggable Columns"
/>
