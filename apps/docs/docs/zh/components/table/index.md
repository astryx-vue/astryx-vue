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

`Table`（数据表格）用来以行和列的方式整整齐齐地展示结构化数据。只要传入行数据 `data` 和列配置 `columns` 就能快速渲染出表格。每一列都要有唯一标识 `key`、表头文字 `header`，也可以用 `proportional()` 或 `pixel()` 来分配宽度。单元格默认直接显示数据字段的值，需要自定义内容时可以通过 `renderCell` 渲染徽标、链接或按钮。`idKey` 用来区分每一行的唯一身份，默认取数据里的 `id`。

**什么时候用：**
- 需要对比多条结构相似的数据（例如订单列表、用户清单、财务账目），或者需要对数据进行排序、筛选、分页和多选时。

**什么时候不要用：**
- 数据结构不规则，或者更适合用卡片呈现视觉封面时，请改用网格或卡片列表。
- 在屏幕极窄的手机端，普通大表格容易被挤压，可以考虑使用精简列表或折叠详情面板。

常用的高级功能可以通过配套的函数插件（`plugins`）按需开启：

- `useTableSortable`：让用户点击表头在升序、降序和恢复默认之间切换。开启 `isMultiSortEnabled` 后，按住 Shift 键再点表头可以同时按多个列排序。搭配 `useTableSortableState` 保存排序规则并返回排好序的数据。
- `useTableSelection`：在每行最左侧添加复选框，点击可以选中或高亮当前行。搭配 `useTableSelectionState` 保存选中的行 ID。选中之后把返回的 `selectionState` 交给 `TableSelectionToolbar`，就可以对选中项做批量操作；一个都没选中时这条不出现。周围已经用行底色表示别的含义时，把 `hasRowHighlight` 设为 `false`，选中行不再铺底色，读屏仍能读到已选中。
- `useTablePagination`：在表格底部添加分页器。在传给表格前，用 `paginateData` 把总数据切出当前页的内容。
- `useTableColumnSettings`：让用户自己勾选显示或隐藏哪些列，带有 `isAlwaysVisible` 的列会固定保留。
- `useTableColumnResize`：允许用户拖动表头边缘自由调整列宽，最小宽度为 60px。
- `useTableFiltering`：为指定列开启文字模糊搜索或选项精确匹配。搭配 `applyTableFilters` 过滤出符合条件的行。
- `useTableGroupedRows`：把已经排好序的数据按某个分类整理成分组折叠行。
- `useTableTreeState` 与 `useTableTreeData`：支持像文件夹树一样展开或折叠带有层级关系的子行。
- `useTableRowExpansion`：允许点击行首箭头在某一行下方展开一整块详情面板。打开 `hasRowClickExpansion` 后点整行也能展开；点到按钮、链接、可编辑文字或已经选中的文字时不会切换。详情和第一列对齐，不把面板算进斑马纹。
- `useTableStickyColumns`：当表格很宽需要横向滚动时，把左侧或右侧的指定列钉住固定不动。
- `useTableRowStatus`：在行首显示成功、警告或错误等状态标记圆点，鼠标悬停时还可以看到文字解释。
- `useTableRowIndex`：自动为真正的数据行生成连续的序号。

没写宽度的列至少留 60px。写在表格上的 `style.minWidth` 如果比各列下限的总和还小，表格会抬到这个下限，避免列被压到读不清；写得更大时保留你给的值。表格放得下时，滚轮继续交给外面的页面；横向溢出之后才拦住回弹。

表格的显示风格也很灵活：`density` 可以调节行高间距（紧凑 `compact`、适中 `balanced` 或宽松 `spacious`）；`dividers` 控制网格线的样式（仅行线 `rows`、仅列线 `columns`、全网格 `grid` 或无边框 `none`）；`isStriped` 开启隔行换色的斑马纹，`hasHover` 开启鼠标悬停高亮。当 `data` 为空时，表格会自动显示贴心的缺省提示，也可以通过 `empty` 插槽换成自己的图文。

如果不需要配置式的驱动，也可以直接使用 `TableHeader`、`TableBody`、`TableFooter`、`TableRow`、`TableHeaderCell` 和 `TableCell` 这些原子组件像写普通 HTML 表格一样自由拼接。

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

如果开启了列过滤，状态要用函数（getter）的形式传进去，表格才能敏锐察觉到过滤词的变化：

```ts
const { filters, onFilterChange } = useTableFilterState()
const filterPlugin = useTableFiltering(() => ({
  filters: filters.value,
  onFilterChange,
  fields,
}))
```

`rowCount` 和 `rowIndexStart` 用来告诉读屏软件当前这一页数据在全表里的位置。两者只要填了一个，读屏就能准确播报当前行号。分组的表头和展开的详情面板不会占用行号。

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
