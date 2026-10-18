---
layout: component-docs
title: useTableFiltering
outline: false
footer: false
---

<script setup lang="ts">
import { useTableFilteringInline, useTableFilteringPopover } from '../../../../components/demos/use-table-filtering'
</script>

## Usage

Table plugin that adds column filters with popover or inline controls. A column gets a filter when its `filter` names a field in `fields`. In the `inline` variant the control sits in the header cell under the column label; `inline-compact` puts the same control in a tighter frame when the table is short on space; in the `popover` variant it hides behind a funnel button and applies on confirm. Pairs with `useTableFilterState` for managed state.

```ts
import { useTableFiltering, useTableFilterState } from '@astryx-vue/core/Table'
```

Five field types are supported, and each one gets a matching control:

| `type` | Control | Matches |
| --- | --- | --- |
| `string` | text input | a substring of the cell text |
| `enum` | select | one option, exactly |
| `multi-select` | multi-select list | any one of the picked options |
| `number` | number input | the same number |
| `date` | date picker | a cell date later than the picked day |

```ts
const fields: TableFilterField[] = [
  { key: 'name', label: 'Name', type: 'string' },
  { key: 'role', label: 'Role', type: 'enum', options: roleOptions },
  { key: 'teams', label: 'Teams', type: 'multi-select', options: teamOptions },
  { key: 'age', label: 'Age', type: 'number', min: 18, max: 70, isIntegerOnly: true },
  { key: 'hired', label: 'Hired', type: 'date' },
]
```

`applyTableFilters()` returns the rows that match every active filter, so the plugin never touches `data` itself.

```ts
const { filters, onFilterChange } = useTableFilterState()
const filterPlugin = useTableFiltering(() => ({
  filters: filters.value,
  onFilterChange,
  fields,
  variant: 'inline',
}))
const rows = computed(() => applyTableFilters(employees, filters.value, fields))
```

The config is read again on every access, so pass a getter when the filters live in a `ref`. A plain object works too, but the table keeps the filters it saw first.

In the inline variants a filtered column that declares no `width` gets `proportional(1)`, so the control has room to sit under the label.

This filtering is separate from Power Search. A column without `filter` is never filtered, and the plugin renders nothing for it.

## Examples

<DemoExample
  :demo="useTableFilteringInline"
  description="Table with inline filter controls rendered directly below each column header."
  locale="en"
  title="Table — Inline Filters"
/>

<DemoExample
  :demo="useTableFilteringPopover"
  description="Table with popover filter controls triggered by icons in column headers."
  locale="en"
  title="Table — Popover Filters"
/>
