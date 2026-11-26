---
layout: component-docs
title: useTableColumnsVirtualization
outline: false
footer: false
---

<script setup lang="ts">
import { useTableColumnsVirtualizationWideTable } from '../../../../components/demos/use-table-columns-virtualization'
</script>

## Usage

Hook that returns a TablePlugin for rendering only the columns that are visible in a wide table. Spacer cells keep the horizontal scroll width the same as if every column were rendered, and a few extra columns are mounted on each side of the viewport.

```ts
import { useTableColumnsVirtualization } from '@astryx-vue/core/Table'
```

When the scroll region fits the whole table, every column renders. Columns pinned with `useTableStickyColumns` always stay mounted; only the columns between them take part in windowing.

## Examples

<DemoExample
  :demo="useTableColumnsVirtualizationWideTable"
  description="A 49-column temperature table with the first column pinned. Only the columns near the viewport are in the page while you scroll sideways."
  locale="en"
  title="useTableColumnsVirtualization — Wide table"
/>

## Best practices

- Size columns with `pixel()` or a `proportional()` with a floor. While windowed, every column renders at its pixel width under the table's minimum width; the table no longer stretches columns to fill spare space.
- With the plugin on, cells default to a single truncated line. An explicit `textOverflow="wrap"`, a table `style.minWidth` wider than the column floors, or columns with `renderCell` render every column instead.
- The column of a focused cell stays mounted after it scrolls out of view, until focus leaves the table or moves to another cell. Screen readers get the real column count and each cell's column position.
- For long tables, add `useTableRowsVirtualization` and put both plugins in `plugins`.
