---
layout: component-docs
title: useTableSortable
outline: false
footer: false
---

<script setup lang="ts">
import { useTableSortableColumns } from '../../../../components/demos/use-table-sortable'
</script>

## 使用方法

`useTableSortable` 只在可排序列的表头加上排序控件和指示器，不会重新排列行：`data` 要传已经排好的行，你自己按排序状态排，或者用会返回 `sortedData` 的 `useTableSortableState`。列要写 `sortable: true`（排序键就是列 key）或 `sortable: { sortKey }` 才有排序控件。

自己按排序状态排：

```ts
const sort = ref<TableSortState>([{ sortKey: 'name', direction: 'ascending' }])
const sortPlugin = useTableSortable<User>(() => ({
  sort: sort.value,
  onSortChange: next => (sort.value = next),
}))

// 插件不动行的顺序：按 sort 给数据排一份副本。
const sortedUsers = computed(() => sortRows(users, sort.value, columns))
```

或者让 `useTableSortableState` 管排序状态并排好行：

```ts
const { sortedData, sortConfig } = useTableSortableState<User>({
  data: users,
  columns,
  defaultSort: [{ sortKey: 'name', direction: 'ascending' }],
})
const sortPlugin = useTableSortable<User>(sortConfig)
```

`T` 是行的类型。TypeScript 没法从配置里推出来，表格的行有类型时要自己传，比如 `useTableSortable<User>(…)`。`useTablePagination`、`useTableFiltering`、`useTableColumnSettings`、`useTableColumnResize`、`useTableStickyColumns`、`useTableInfiniteScroll` 也一样。

把排序状态和它的回调放进配置对象，交给 `useTableSortable`。它返回的插件通过 `plugins` 属性传给 `Table`。

```ts
import { useTableSortable } from '@astryx-vue/core/Table'
```

## 示例

<DemoExample
  :demo="useTableSortableColumns"
  description="列可以排序的表格。点表头就在升序和降序之间切换。"
  locale="zh"
  title="useTableSortable —— 可排序的列"
/>
