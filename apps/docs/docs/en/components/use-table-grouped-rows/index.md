---
layout: component-docs
title: useTableGroupedRows
outline: false
footer: false
---

<script setup lang="ts">
import { useTableGroupedRowsCollapsible } from '../../../../components/demos/use-table-grouped-rows'
</script>

## Usage

Hook that groups a flat data array into collapsible section rows. Each distinct groupBy value becomes a full-width section-header row with a chevron toggle, the group label, and a member count; collapsing hides that group's data rows while keeping the header visible. The disclosure state lives on the chevron button, not the native table row. Mirrors useTableTreeState: the consumer owns the collapsedGroups set and the hook returns {data, plugin, idKey}: pass them to Table as data, plugins, and idKey respectively. Grouping runs on the rows you hand it, so with pagination the order is filter, sort, slice, then group: sort by the group key first and the user's keys second, so a section's rows stay contiguous and each page appends to the bottom of the table instead of splicing rows in above the reader. A page that ends on a row count still cuts mid-section, and the heading then counts what has loaded rather than what exists: "6" quietly becoming "10". Where the full result set is in hand, carry the cut forward to the end of the section it lands in: every rendered section is then whole and its count is a total.

```ts
import { useTableGroupedRows } from '@astryx-vue/core/Table'
```

`data` is a computed, so the table re-renders only when the config changes. Give the config as a getter, and replace the collapsed set with a new one instead of mutating it in place; a mutated set is the same object and the computed never re-runs.

```ts
const { data, plugin, idKey } = useTableGroupedRows(() => ({
  data: employees,
  groupBy: employee => employee.team,
  collapsedGroups: collapsed.value,
  onToggleGroup: toggleGroup,
  getRowKey: employee => employee.id,
}))
```

A section header is an ordinary object in the array. Use the exported `isTableGroupHeader(row)` to tell one from a data row, for example before numbering rows.

## Examples

<DemoExample
  :demo="useTableGroupedRowsCollapsible"
  description="A table grouped into collapsible sections with useTableGroupedRows. Each group gets a full-width header with a chevron, label, and member count; click to collapse or expand."
  locale="en"
  title="useTableGroupedRows — Collapsible Groups"
/>
