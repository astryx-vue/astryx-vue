---
layout: component-docs
title: usePowerSearchConfig
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { usePowerSearchConfigFilteredDirectory } from '../../../../components/demos/use-power-search-config'
</script>

## Usage

Builds a [Power Search](/en/components/power-search) configuration from typed field definitions, and returns it with an `applyFilters` function for client-side filtering. Each field type (string, number, boolean, date, enum, enum list, string list) gets its canonical operators, and `applyFilters` keeps the rows that match the active filters. It is the setup-time form of `createPowerSearchConfig`.

```ts
import { usePowerSearchConfig } from '@astryx-vue/core/PowerSearch'
```

```vue
<script setup lang="ts">
import type { PowerSearchFilter } from '@astryx-vue/core/PowerSearch'
import { PowerSearch, usePowerSearchConfig } from '@astryx-vue/core/PowerSearch'
import { computed, ref } from 'vue'

const fields = [
  { key: 'name', type: 'string', label: 'Name' },
  { key: 'active', type: 'boolean', label: 'Active' },
] as const

const { config, applyFilters } = usePowerSearchConfig(fields)
const filters = ref<PowerSearchFilter[]>([])
const rows = computed(() => applyFilters(filters.value, people))
</script>

<template>
  <PowerSearch v-model:filters="filters" :config="config" :result-count="rows.length" />
</template>
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Declare the field definitions `as const` outside the component, so `applyFilters` knows the row shape. |
| <Badge variant="success">Do</Badge> | Pass the returned `config` to `PowerSearch`, and compute the rows of a `Table` or `List` with `applyFilters`. |
| <Badge variant="error">Don't</Badge> | Build the definitions from reactive state and expect the config to follow. The config is built once, when the component sets up. |

## Examples

<DemoExample
  :demo="usePowerSearchConfigFilteredDirectory"
  description="A people directory with a PowerSearch bar over a Table: typed field definitions feed usePowerSearchConfig, which returns the search config and an applyFilters helper that updates the table rows."
  locale="en"
  title="usePowerSearchConfig — Filtered Directory Table"
/>
