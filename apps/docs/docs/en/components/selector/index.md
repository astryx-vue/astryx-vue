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

`Selector` opens a list when the trigger is clicked. Choosing one option closes the list. It can filter the list, clear the current value, and disable individual options.

Pass the options and bind the value:

```vue
<script setup lang="ts">
import { Selector } from '@astryx-vue/core/Selector'
import { ref } from 'vue'

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
```

Each option has a `value` and a `label`. Set `disabled` to skip an option, or `description` to add a second line of text.

`searchable` shows a search field that filters the list. `clearable` adds a clear button next to the current value. The menu is at least as wide as the trigger, and grows when an option label is longer.

Arrow keys move the highlight, `Home` and `End` jump to the ends, `Enter` selects the highlighted option, and `Escape` closes the list.

Built-in strings such as the placeholder and the empty state are English. Call `provideAstryxLocale('zh-CN')` to use the Chinese strings.

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
