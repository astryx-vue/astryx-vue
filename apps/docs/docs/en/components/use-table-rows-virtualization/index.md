---
layout: component-docs
title: useTableRowsVirtualization
outline: false
footer: false
---

<script setup lang="ts">
import { useTableRowsVirtualizationThousandRows } from '../../../../components/demos/use-table-rows-virtualization'
</script>

## Usage

Hook that returns a TablePlugin for rendering only the visible rows of a long flat table. A few extra rows are mounted on each side of the viewport, and spacer rows keep the scroll height the same as if every row were rendered.

```ts
import { useTableRowsVirtualization } from '@astryx-vue/core/Table'
```

The table fills the height its parent gives it and scrolls vertically inside it, so give the parent a height: a fixed value, a percentage or a flex item. Pass data, columns, `idKey` and other plugins to the table as usual.

## Examples

<DemoExample
  :demo="useTableRowsVirtualizationThousandRows"
  description="A thousand orders in a 320px container, with selection and row numbers. Only a few dozen rows near the viewport are in the page while you scroll."
  locale="en"
  title="useTableRowsVirtualization — A thousand rows"
/>

## Best practices

- Set `rowHeight` to the full height of a row, padding and divider included. Rows never get shorter than that. When every row grows together (for example after the user enlarges the text), the table uses the measured height and warns in development.
- With the plugin on, cells default to a single truncated line so every row has the same height. An explicit `textOverflow="wrap"` renders every row instead.
- The table renders every row, and explains why in development, for grouped, tree or expandable rows; duplicate or missing row ids; `rowIndexStart` or `rowCount`; columns with `renderCell`; and rows that turn out to have uneven heights or overflowing content once mounted.
- A row that holds keyboard focus stays mounted after it scrolls out of view, so focus is never lost. Screen readers get the real row count and each row's position.
- For wide tables, add `useTableColumnsVirtualization` and put both plugins in `plugins`.
