---
layout: component-docs
title: Table
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

## Usage

`Table` renders from `data` and `columns`. Each column has a `key`, a `header`, and an optional `width` from `proportional()` or `pixel()`. A cell shows `row[key]` unless `renderCell` returns something else. `idKey` identifies a row. The default is `id`.

Behavior is added with plugins, composed in the `plugins` object:

- `useTableSortable` cycles a header through ascending, descending, and unsorted. Shift-click adds a column when `isMultiSortEnabled` is set. `useTableSortableState` holds the sort and returns the sorted rows.
- `useTableSelection` adds a checkbox column and highlights selected rows. `useTableSelectionState` holds the selected ids.
- `useTablePagination` renders a pager under the table. Slice the rows with `paginateData` before passing `data`.
- `useTableColumnSettings` shows only the active column keys, and keeps `isAlwaysVisible` columns on.
- `useTableColumnResize` lets a header edge be dragged. The smallest width is 60px.
- `useTableFiltering` puts a string or enum filter on any column whose `filter` names a field. `applyTableFilters` returns the matching rows. String fields match a substring. Enum fields match exactly. This filtering stays separate from Power Search.
- `useTableGroupedRows` turns the rows you already filtered, sorted, and sliced into sections. Pass its data, plugin, and row identity back to the table together. A collapsed section keeps its header. Replace the collapsed set instead of mutating it.
- `useTableTreeState` decides which nodes are open. `useTableTreeData` draws the indent and the buttons. Child rows reuse the parent columns. The header button expands or collapses every branch, and a cycle is skipped.
- `useTableRowExpansion` places a detail panel under a row. The same action is on the row’s context menu. Use the tree plugins when the children should reuse the columns.
- `useTableStickyColumns` pins the contiguous run from the first column through a listed key, or from a listed key through the last column. The shadow appears only while the table overflows. An empty config pins nothing.
- `useTableRowStatus` puts a success, warning, or error mark at the start of a row. A custom color can be a named color or a plain dot.
- `useTableRowIndex` numbers real rows. Group headers do not take a number.

`density` is `compact`, `balanced`, or `spacious`. `dividers` is `rows`, `columns`, `grid`, or `none`. `isStriped` and `hasHover` are independent. An empty `data` array renders the localized empty message, or the `empty` slot.

Without `data`, the table is composed from `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHeaderCell`, and `TableCell`.

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

Pass the column filter state through a getter so the table reads the latest value:

```ts
const { filters, onFilterChange } = useTableFilterState()
const filterPlugin = useTableFiltering(() => ({
  filters: filters.value,
  onFilterChange,
  fields,
}))
```

`rowCount` and `rowIndexStart` report where the visible window sits in the full result. Setting either one numbers the data rows. When only the start is set, the total count is unknown. Group headers and detail panels are not numbered.


<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Give every row a stable `idKey`. Selection and row identity depend on it. |
| <Badge variant="success">Do</Badge> | Use `pixel()` for short numeric columns and `proportional()` for text that should share the remaining width. |
| <Badge variant="success">Do</Badge> | Keep sort, selection, and filter state outside the table and pass the derived rows in `data`. |
| <Badge variant="error">Don't</Badge> | Sort or paginate inside `renderCell`. The cell only paints the row it is given. |
| <Badge variant="error">Don't</Badge> | Turn on every plugin in one table. A dense grid rarely also needs filters, resize, and selection at once. |

## Examples

<DemoExample
  :demo="tableColumnSettings"
  description="Table with a column visibility picker in the toolbar. Toggle columns on and off."
  locale="en"
  title="Table — Column Settings"
/>

<DemoExample
  :demo="tablePopoverFilters"
  description="Table with popover filter controls triggered by icons in column headers."
  locale="en"
  title="Table — Popover Filters"
/>

<DemoExample
  :demo="tableGridDividers"
  description="Compact table with grid dividers showing both row and column borders, suited for dense numeric data."
  locale="en"
  title="Table — Grid Dividers"
/>

<DemoExample
  :demo="tableInCard"
  description="Table composed inside a card with a heading, demonstrating container bleed alignment."
  locale="en"
  title="Table — In Card"
/>

<DemoExample
  :demo="tableInlineFilters"
  description="Table with inline filter controls rendered directly below each column header."
  locale="en"
  title="Table — Inline Filters"
/>

<DemoExample
  :demo="tablePaginated"
  description="Paginated data table navigating through a larger dataset page by page."
  locale="en"
  title="Table — Paginated Data"
/>

<DemoExample
  :demo="tableResizable"
  description="Table with draggable column resize handles. Drag the right edge of any header to resize."
  locale="en"
  title="Table — Resizable Columns"
/>

<DemoExample
  :demo="tableRichCell"
  description="Table with rich cell content using Link for emails and Badge for role labels."
  locale="en"
  title="Table — Rich Cell Content"
/>

<DemoExample
  :demo="tableRowSelection"
  description="Table with row selection checkboxes and a select-all header checkbox."
  locale="en"
  title="Table — Row Selection"
/>

<DemoExample
  :demo="tableSortable"
  description="Table with sortable columns, click headers to sort ascending or descending."
  locale="en"
  title="Table — Sortable Columns"
/>

<DemoExample
  :demo="tableStriped"
  description="Table with alternating row colors and hover highlighting for easy scanning."
  locale="en"
  title="Table — Striped Rows"
/>

<DemoExample
  :demo="tableGrouped"
  description="Rows split by role. A collapsed section keeps its header, and the row numbers skip those headers."
  locale="en"
  title="Table — Grouped rows"
/>

<DemoExample
  :demo="tableTree"
  description="Child rows reuse the same columns. The header expands every branch, and a row click expands a node that has children."
  locale="en"
  title="Table — Tree data"
/>

<DemoExample
  :demo="tableExpansion"
  description="Open the note under a row from the chevron, the row, or the context menu."
  locale="en"
  title="Table — Row expansion"
/>

<DemoExample
  :demo="tableSticky"
  description="Name stays on the left and Friday stays on the right while the days in between scroll."
  locale="en"
  title="Table — Sticky columns"
/>

<DemoExample
  :demo="tableRowStatus"
  description="The mark at the start of a row is success, warning, error, or a dot with no signal."
  locale="en"
  title="Table — Row status"
/>
