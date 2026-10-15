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
  tableExpansion,
  tableGridDividers,
  tableGrouped,
  tableInCard,
  tableInlineFilters,
  tablePaginated,
  tablePopoverFilters,
  tableResizable,
  tableRichCell,
  tableRowSelection,
  tableRowStatus,
  tableSortable,
  tableSticky,
  tableStriped,
  tableTree,
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
- `useTableFiltering` 给 `filter` 指向某个字段的列加上字符串或枚举过滤。`applyTableFilters` 返回匹配的行。字符串是包含匹配，枚举是精确匹配。这套过滤和结构化搜索是分开的。
- `useTableGroupedRows` 把已经排好、切好的行收成分组。返回的数据、插件和行身份要一起传给表格。折叠后表头还在，里面的行先藏起来。切换时换成一个新的集合，表格才会重画。
- `useTableTreeState` 负责展开哪些节点，`useTableTreeData` 负责缩进和按钮。子行继续用原来的列。点表头上的按钮可以一次展开或折叠。有环的节点会被跳过。
- `useTableRowExpansion` 在一行下面放一整块详情。右键也能展开或折叠。详情和树形子行不是一回事。
- `useTableStickyColumns` 把从第一列到指定列、或从指定列到最后一列的连续区间钉住。只有横向溢出时才出现阴影。空配置什么也不钉。
- `useTableRowStatus` 在行首放成功、警告或错误标记，也可以换成自定义颜色。悬停能看到说明。
- `useTableRowIndex` 给真实行编号。分组表头不占号。

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

列上的过滤状态要用 getter 传进去，表格才会读到最新的值：

```ts
const { filters, onFilterChange } = useTableFilterState()
const filterPlugin = useTableFiltering(() => ({
  filters: filters.value,
  onFilterChange,
  fields,
}))
```

`rowCount` 和 `rowIndexStart` 用来报告当前窗口在整表里的位置。两个只要设置一个，数据行就会带上行号；只给起点时，总行数按未知处理。分组表头和展开出来的详情不编号。

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 每一行给一个稳定的 `idKey`。选择和行身份都靠它。 |
| <Badge variant="success">推荐</Badge> | 短的数字列用 `pixel()`，需要分剩余宽度的文字列用 `proportional()`。 |
| <Badge variant="success">推荐</Badge> | 排序、选择和过滤的状态放在表格外面，把算好的行放进 `data`。 |
| <Badge variant="error">避免</Badge> | 在 `renderCell` 里排序或分页。单元格只画交给它的那一行。 |
| <Badge variant="error">避免</Badge> | 一张表把每个插件都打开。又密又要过滤、拖宽度、还要多选，通常太挤。 |


<ComponentAnatomy />

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

<DemoExample
  :demo="tableGrouped"
  description="按角色分成两段。折叠后表头还在，行号只数真正的数据行。"
  locale="zh"
  title="Table — 分组和行号"
/>

<DemoExample
  :demo="tableTree"
  description="子行沿用同样的列。表头可以一次展开，点行也能展开有子节点的那一行。"
  locale="zh"
  title="Table — 树形数据"
/>

<DemoExample
  :demo="tableExpansion"
  description="点行或行首的箭头，在下面展开备注。右键也有同样的操作。"
  locale="zh"
  title="Table — 展开行"
/>

<DemoExample
  :demo="tableSticky"
  description="姓名钉在左边，周五钉在右边。把表格滚到边上时，中间的日期会从固定列下面滑过去。"
  locale="zh"
  title="Table — 固定列"
/>

<DemoExample
  :demo="tableRowStatus"
  description="行首的标记说明这一行是成功、警告、错误，或者只是一个没有信号的圆点。"
  locale="zh"
  title="Table — 行状态"
/>
