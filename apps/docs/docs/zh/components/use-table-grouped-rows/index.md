---
layout: component-docs
title: useTableGroupedRows
outline: false
footer: false
---

<script setup lang="ts">
import { useTableGroupedRowsCollapsible } from '../../../../components/demos/use-table-grouped-rows'
</script>

## 使用方法

把一个扁平的数组收成可折叠的分组行。每个不同的 groupBy 值变成一整行的分组表头，带折叠按钮、分组名和成员数；折叠后这一组的数据行隐藏，表头还在。展开折叠的状态在按钮上，不在原生的表格行上。和 useTableTreeState 一样：被折叠的集合由你保存，hook 返回 {data, plugin, idKey}，分别传给 Table 的 data、plugins 和 idKey。分组发生在你交进来的行上，所以分页时顺序是过滤、排序、切片、再分组：先把分组字段排好，再排用户选的字段，这样同一组的行是连续的，新的一页接在表格下面，而不是插到读者上方。按行数切页仍会切在一组中间，这时表头数的是已经加载的行，而不是总数：「6」会悄悄变成「10」。整份结果都在手上时，把切点推到它落在的那一组末尾：这样每个渲染出来的分组都是完整的，数量也是总数。

```ts
import { useTableGroupedRows } from '@astryx-vue/core/Table'
```

`data` 是 computed，配置变了两者才重算。用 getter 传配置：折叠集合要换成一个新对象，不要原地改；原地改还是同一个对象，computed 不会重跑。

```ts
const { data, plugin, idKey } = useTableGroupedRows(() => ({
  data: employees,
  groupBy: employee => employee.team,
  collapsedGroups: collapsed.value,
  onToggleGroup: toggleGroup,
  getRowKey: employee => employee.id,
}))
```

分组表头就是数组里一个普通对象。导出的 `isTableGroupHeader(row)` 能把表头和数据行分开，比如给行编号前先判一下。

## 示例

<DemoExample
  :demo="useTableGroupedRowsCollapsible"
  description="用 useTableGroupedRows 分成可折叠分组的表格。每组一整行表头，带折叠按钮、组名和成员数；点一下就折叠或展开。"
  locale="zh"
  title="useTableGroupedRows — 可折叠分组"
/>
