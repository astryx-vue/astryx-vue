---
layout: component-docs
title: useTableSortable
outline: false
footer: false
---

<script setup lang="ts">
import { useTableSortableColumns } from '../../../../components/demos/use-table-sortable'
</script>

## Usage

Call `useTableSortable` with a config object containing sort state and callback. Pass the returned plugin to `Table` via the `plugins` prop.

```ts
import { useTableSortable } from '@astryx-vue/core/Table'
```

## Examples

<DemoExample
  :demo="useTableSortableColumns"
  description="Table with sortable columns, click headers to sort ascending or descending."
  locale="en"
  title="useTableSortable — Sortable Columns"
/>
