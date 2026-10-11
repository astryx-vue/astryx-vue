---
layout: component-docs
title: Selector
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { selectorBasic, selectorSearchable, selectorClearable, selectorSizes } from '../../../../components/demos/selector'
</script>

## Usage

`Selector` is a dropdown component that expands to show a list of options when clicked. Users can select one item and the list collapses. It supports search filtering, clearing selection, and disabling specific options.

Basic usage requires an options array and a bound value:

\`\`\`vue
<script setup lang="ts">
import { ref } from 'vue'
import { Selector } from '@astryx-vue/core/Selector'

const selected = ref(null)
const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <Selector v-model="selected" :options="options" placeholder="Select a fruit" />
</template>
\`\`\`

Each option object contains \`value\` (unique identifier) and \`label\` (display text). Optional \`disabled\` property can disable specific options, and \`description\` can add auxiliary text.

Enable \`searchable\` to show a search box that filters options as users type. Enable \`clearable\` to show a clear button next to the selected value.

Full keyboard navigation is supported: arrow keys move the highlight up and down, \`Home\` and \`End\` jump to the first and last options, \`Enter\` selects the current item, and \`Escape\` closes the list.

## Best Practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Enable search when options exceed 10 items to help users find items quickly. |
| <Badge variant="success">Do</Badge> | Provide a clear button for non-required fields so users can deselect. |
| <Badge variant="success">Do</Badge> | Use concise, clear option labels and avoid overly long text. |
| <Badge variant="error">Don't</Badge> | Put more than 100 options in a selector; consider pagination or async loading. |
| <Badge variant="error">Don't</Badge> | Use selector for multi-select; use a dedicated multi-select component instead. |

## Examples

<DemoExample
  :demo="selectorBasic"
  description="Pass options array and bind value, click to expand list and select an item."
  locale="en"
  title="Basic Usage"
/>

<DemoExample
  :demo="selectorSearchable"
  description="Enable searchable to show a search box for filtering options."
  locale="en"
  title="Searchable"
/>

<DemoExample
  :demo="selectorClearable"
  description="Enable clearable to show a clear button next to selected value."
  locale="en"
  title="Clearable"
/>

<DemoExample
  :demo="selectorSizes"
  description="Available in sm, md, lg sizes, md by default."
  locale="en"
  title="Sizes"
/>
