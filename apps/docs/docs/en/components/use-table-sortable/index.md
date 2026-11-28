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

`useTableSortable` adds the sort controls and indicators to the headers of sortable columns, but it does not reorder the rows: pass rows that are already sorted as `data`, sorted by you from the sort state or by `useTableSortableState`, which returns `sortedData`. A column gets a sort control only when it sets `sortable: true` (the sort key is the column key) or `sortable: { sortKey }`. Call it with a config object containing the sort state and callback, and pass the returned plugin to `Table` via the `plugins` prop.

Sort the rows yourself from the sort state:

```ts
const sort = ref<TableSortState>([{ sortKey: 'name', direction: 'ascending' }])
const sortPlugin = useTableSortable<User>(() => ({
  sort: sort.value,
  onSortChange: next => (sort.value = next),
}))

// The plugin does not reorder rows: sort a copy of the data from `sort`.
const sortedUsers = computed(() => sortRows(users, sort.value, columns))
```

Or let `useTableSortableState` hold the sort and sort the rows:

```ts
const { sortedData, sortConfig } = useTableSortableState<User>({
  data: users,
  columns,
  defaultSort: [{ sortKey: 'name', direction: 'ascending' }],
})
const sortPlugin = useTableSortable<User>(sortConfig)
```

`T` is the row type. TypeScript cannot infer it from the config, so pass it, as in `useTableSortable<User>(…)`, when the table's rows are typed. The same goes for `useTablePagination`, `useTableFiltering`, `useTableColumnSettings`, `useTableColumnResize`, `useTableStickyColumns` and `useTableInfiniteScroll`.

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
