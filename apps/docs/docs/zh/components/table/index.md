---
layout: component-docs
title: 表格
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import {
  tableColumnSettings,
  tableGridDividers,
  tableInCard,
  tableInlineFilters,
  tablePaginated,
  tablePopoverFilters,
  tableResizable,
  tableRichCell,
  tableRowSelection,
  tableSortable,
  tableStriped,
} from '../../../../components/demos/table'
</script>

## 使用方法

`Table` 用 `data` 和 `columns` 渲染。每一列有 `key`、`header`，以及可选的 `proportional()` 或 `pixel()` 宽度。单元格默认显示 `row[key]`，`renderCell` 可以换成别的内容。`idKey` 用来认出一行，默认是 `id`。

行为通过 `plugins` 加进去：

- `useTableSortable` 让表头在升序、降序和未排序之间切换。打开 `isMultiSortEnabled` 后，按住 Shift 再点可以加一列。`useTableSortableState` 保存排序并返回排好的行。
- `useTableSelection` 加上复选框列，并高亮选中的行。`useTableSelectionState` 保存选中的 id。
- `useTablePagination` 在表格下方放分页。传给 `data` 之前用 `paginateData` 切好当前页。
- `useTableColumnSettings` 只显示当前选中的列，`isAlwaysVisible` 的列会留着。
- `useTableColumnResize` 允许拖表头边缘。最窄 60px。
- `useTableFiltering` 给 `filter` 指向某个字段的列加上字符串或枚举过滤。`applyTableFilters` 返回匹配的行。字符串是包含匹配，枚举是精确匹配。

`density` 是 `compact`、`balanced` 或 `spacious`。`dividers` 是 `rows`、`columns`、`grid` 或 `none`。`isStriped` 和 `hasHover` 互不影响。`data` 为空时显示本地化的空状态，也可以用 `empty` 插槽替换。

不传 `data` 时，用 `TableHeader`、`TableBody`、`TableFooter`、`TableRow`、`TableHeaderCell` 和 `TableCell` 自己拼。

```vue
<script setup lang="ts">
import { proportional, Table } from '@astryx-vue/core/Table'

const rows = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
]
const columns = [
  { key: 'name', header: 'Name', width: proportional(1) },
  { key: 'email', header: 'Email', width: proportional(2) },
]
</script>

<template>
  <Table :data="rows" :columns="columns" has-hover />
</template>
```

过滤是组件自己做的，不依赖这个库里还没有的 PowerSearch。过滤状态要用 getter 传进去，表格才会读到最新的值：

```ts
const { filters, onFilterChange } = useTableFilterState()
const filterPlugin = useTableFiltering(() => ({
  filters: filters.value,
  onFilterChange,
  fields,
}))
```

树形数据、固定列、分组行、行展开、行状态、行号，以及表格的右键菜单，这一版还没有。

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 每一行给一个稳定的 `idKey`。选择和行身份都靠它。 |
| <Badge variant="success">推荐</Badge> | 短的数字列用 `pixel()`，需要分剩余宽度的文字列用 `proportional()`。 |
| <Badge variant="success">推荐</Badge> | 排序、选择和过滤的状态放在表格外面，把算好的行放进 `data`。 |
| <Badge variant="error">避免</Badge> | 在 `renderCell` 里排序或分页。单元格只画交给它的那一行。 |
| <Badge variant="error">避免</Badge> | 一张表把每个插件都打开。又密又要过滤、拖宽度、还要多选，通常太挤。 |

## 示例

<DemoExample
  :demo="tableColumnSettings"
  description="工具栏里选择要显示的列。可以开关，也可以调整顺序由当前选中项决定。"
  locale="zh"
  title="Table — 列设置"
/>

<DemoExample
  :demo="tablePopoverFilters"
  description="点表头上的图标，在弹出层里过滤。"
  locale="zh"
  title="Table — 弹出过滤"
/>

<DemoExample
  :demo="tableGridDividers"
  description="紧凑密度，行和列都有分隔线，适合密集的数字。"
  locale="zh"
  title="Table — 网格分隔"
/>

<DemoExample
  :demo="tableInCard"
  description="表格放在卡片里，标题和表格对齐，用来看容器出血。"
  locale="zh"
  title="Table — 放在卡片里"
/>

<DemoExample
  :demo="tableInlineFilters"
  description="过滤控件直接放在每一列表头下面，输入后立刻生效。"
  locale="zh"
  title="Table — 行内过滤"
/>

<DemoExample
  :demo="tablePaginated"
  description="数据比较多时按页查看。"
  locale="zh"
  title="Table — 分页"
/>

<DemoExample
  :demo="tableResizable"
  description="拖表头右缘可以改列宽，松开后记住宽度。"
  locale="zh"
  title="Table — 可调整列宽"
/>

<DemoExample
  :demo="tableRichCell"
  description="邮箱是链接，角色是徽标。"
  locale="zh"
  title="Table — 丰富的单元格"
/>

<DemoExample
  :demo="tableRowSelection"
  description="每一行有复选框，表头可以全选。"
  locale="zh"
  title="Table — 行选择"
/>

<DemoExample
  :demo="tableSortable"
  description="点表头在升序和降序之间切换。"
  locale="zh"
  title="Table — 可排序列"
/>

<DemoExample
  :demo="tableStriped"
  description="隔行变色，悬停时再高亮，方便扫读。"
  locale="zh"
  title="Table — 斑马纹"
/>
