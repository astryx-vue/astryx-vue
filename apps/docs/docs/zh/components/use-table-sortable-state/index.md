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

## 使用方法

[useTableSortable](/components/use-table-sortable) 的配套状态工具。排序状态由它保存，它按这个状态返回排好的行，再交回一个插件可以直接用的 `sortConfig`，所以表格自己一行排序代码都不用写。字符串用当前语言的比较器比较，并且认得数字，所以 `item 2` 排在 `item 10` 前面；数字按大小比较。缺值在升序时排最后，在降序时排最前。列的 `sortable` 里给了 `compare` 函数时，改用那个函数。

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

要让 Shift 加点击多选几列，就传一个在状态上加了 `isMultiSortEnabled` 的 getter：`useTableSortable(() => ({ sort: sort.value, onSortChange: sortConfig.onSortChange, isMultiSortEnabled: true }))`。

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 把 `columns` 也传进去，这样自带 `sortKey` 或 `compare` 的列会按表头说的方式排。 |
| <Badge variant="success">推荐</Badge> | 渲染 `sortedData`；页面别处要说明当前顺序时，读 `sort`。 |
| <Badge variant="error">避免</Badge> | 用在由服务端排序的数据上。那种情况自己保存排序状态，交给 `useTableSortable`，再按这个顺序去请求数据。 |

## 示例

<DemoExample
  :demo="useTableSortableStateMultiSortOrders"
  description="订单表格自己不写排序代码：useTableSortableState 保存排序状态、返回排好的订单，再把现成的配置交给 useTableSortable。先点 Customer，再按住 Shift 点 Total，就会先按客户排，同一客户内再按金额排。表格上方那行文字从 hook 读出当前的排序状态。"
  locale="zh"
  title="useTableSortableState —— 多列排序的订单"
/>
