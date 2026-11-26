---
layout: component-docs
title: useTableSortableState
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useTableSortableStateMultiSortOrders } from '../../../../components/demos/use-table-sortable-state'
</script>

## Usage

The state helper for [useTableSortable](/en/components/use-table-sortable). It owns the sort, returns the rows sorted by it, and hands back a `sortConfig` that the plugin can use as it is, so a table sorts without any sort code of its own. Strings compare with the locale's collator and numeric awareness, so `item 2` comes before `item 10`; numbers compare as numbers. A missing value sorts last in ascending order and first in descending order. A column whose `sortable` has a `compare` function uses that function instead.

```ts
import { useTableSortable, useTableSortableState } from '@astryx-vue/core/Table'
```

```vue
<script setup lang="ts">
import { Table, useTableSortable, useTableSortableState } from '@astryx-vue/core/Table'

const { sortedData, sortConfig } = useTableSortableState({ data: orders, columns })
const sortable = useTableSortable(sortConfig)
</script>

<template>
  <Table :data="sortedData" :columns="columns" id-key="id" :plugins="{ sortable }" />
</template>
```

To let Shift-click add columns, pass a getter that adds `isMultiSortEnabled` to the state: `useTableSortable(() => ({ sort: sort.value, onSortChange: sortConfig.onSortChange, isMultiSortEnabled: true }))`.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Pass `columns`, so a column with its own `sortKey` or `compare` sorts the way the header says. |
| <Badge variant="success">Do</Badge> | Render `sortedData`, and read `sort` when other parts of the page describe the current order. |
| <Badge variant="error">Don't</Badge> | Use it for data that the server sorts. Hold the sort yourself, hand it to `useTableSortable`, and request rows in that order. |

## Examples

<DemoExample
  :demo="useTableSortableStateMultiSortOrders"
  description="Orders with no sort code of their own: useTableSortableState owns the sort state, returns the sorted orders, and hands useTableSortable a ready config. Click Customer, then Shift-click Total, to sort by customer and then by total within each customer. A line above the orders reads the current sort state from the hook."
  locale="en"
  title="useTableSortableState — Multi-Sort Orders"
/>
