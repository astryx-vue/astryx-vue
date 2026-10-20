---
layout: component-docs
title: useTableFilterState
outline: false
footer: false
---

<script setup lang="ts">
import { useTableFilterStateInline, useTableFilterStatePopover } from '../../../../components/demos/use-table-filter-state'
</script>

## Usage

Managed state hook for table filtering. Returns the current filter map, an onChange handler, and a way to clear everything. Pass the map and the handler to `useTableFiltering`, and the map to `applyTableFilters()` to get the matching rows.

```ts
import { useTableFilterState } from '@astryx-vue/core/Table'
```

A filter is "off" when its key is missing. Setting `null`, an empty string, or an empty array removes the key instead of storing an empty value, so a truthy key in the map always means a live filter.

Give it an initial map when the table should open with a filter already applied. Pass the map directly, or wrap it as `initialState`. The initial object is shallow copied, so later writes never touch it.

```ts
const direct = useTableFilterState({ role: 'Engineer' })
const wrapped = useTableFilterState({ initialState: { role: 'Engineer' } })
```

## Examples

<DemoExample
  :demo="useTableFilterStateInline"
  description="Inline filter controls with the filter map held by useTableFilterState."
  locale="en"
  title="Table — Inline Filters"
/>

<DemoExample
  :demo="useTableFilterStatePopover"
  description="Popover filter controls with the same managed state."
  locale="en"
  title="Table — Popover Filters"
/>
