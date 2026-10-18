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

Table plugin that adds column filters with popover or inline controls. A column gets a filter when its `filter` names a field in `fields`. In the `inline` variant the control sits in the header cell under the column label; in the `popover` variant it hides behind a funnel button and applies on confirm. Pairs with `useTableFilterState` for managed state.

```ts
import { useTableFiltering, useTableFilterState } from '@astryx-vue/core/Table'
```

Two field types are supported. A `string` field matches a substring of the cell text and gets a text input. An `enum` field matches one of its `options` exactly and gets a select. `applyTableFilters()` returns the rows that match every active filter, so the plugin never touches `data` itself.

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
