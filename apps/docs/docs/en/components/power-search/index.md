---
layout: component-docs
title: Power Search
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { powerSearchDisabled, powerSearchNested, powerSearchOverflow, powerSearchOverview } from '../../../../components/demos/power-search'
</script>

## Usage

Power Search splits a query into a field, an operator, and a value. Focusing the input lists the fields. Choosing one opens an editor when the operator still needs a value. A boolean field and a content search become a filter immediately. Each filter sits in the input as a token that can be opened again.

Backspace on an empty input removes the last token. The arrow keys move between tokens, Enter opens the focused one, and Backspace or Delete removes it. A read-only token cannot be edited or removed. Escape cancels the editor and returns focus.

The editor follows the width of the search field, from about 400 to 720. When the viewport cannot hold the minimum, the floor gives way. The editor hugs the side that opened it only after the maximum has squeezed it. The position is taken once, while it is open.

`createPowerSearchConfig` builds the operators from field definitions and returns `applyFilters`. That function filters rows on its own. It does not go through a table’s column filters. Time, relative dates, entities, and custom values keep every row unless the caller interprets them. A nested filter requires every child by default. An operator named or, or one whose name contains any, requires only one child.

Tokens can collapse to one line when the field loses focus. The inline mode expands in place. The layer mode floats over the field and leaves the content below where it is. A numeric result count is read with plural wording. A string is shown as given. Changes are announced politely, and the first paint is silent.

Pass a disabled reason together with the disabled state. The input stays focusable, and the reason appears on hover and keyboard focus. Do not wrap the field in another tooltip. A natively disabled control swallows the hover.

```vue
<script setup lang="ts">
import { createPowerSearchConfig, PowerSearch } from '@astryx-vue/core/PowerSearch'
import { computed, ref } from 'vue'

const people = [
  { name: 'Alice', active: true },
  { name: 'Bob', active: false },
]
const { config, applyFilters } = createPowerSearchConfig([
  { key: 'name', type: 'string', label: 'Name' },
  { key: 'active', type: 'boolean', label: 'Active' },
])
const filters = ref([])
const matched = computed(() => applyFilters(filters.value, people))
</script>

<template>
  <PowerSearch v-model:filters="filters" :config="config" :result-count="matched.length" />
</template>
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Group a long field list, and add aliases for the fields people actually type. |
| <Badge variant="success">Do</Badge> | Point content search at one string field instead of letting every field consume free text. |
| <Badge variant="error">Don’t</Badge> | Fold Power Search into a table column filter. Column filters stay substring and enum matches. |
| <Badge variant="error">Don’t</Badge> | Save a nested filter while a child is unfinished. An unfinished child is not a filter yet. |

## Examples

<DemoExample
  :demo="powerSearchOverview"
  description="Filter by name, role, active state, and age. The list below follows the current filters."
  locale="en"
  title="Fields and operators"
/>

<DemoExample
  :demo="powerSearchOverflow"
  description="On blur the tokens collapse to one line and the rest are counted. Focus expands them again."
  locale="en"
  title="Overflow"
/>

<DemoExample
  :demo="powerSearchNested"
  description="A match can require every child filter, or any one of them."
  locale="en"
  title="Nested filters"
/>

<DemoExample
  :demo="powerSearchDisabled"
  description="The filters stay put while the index rebuilds. The input can still take focus and explains why."
  locale="en"
  title="Paused search"
/>
