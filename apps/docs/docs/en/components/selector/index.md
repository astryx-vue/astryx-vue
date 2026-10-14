---
layout: component-docs
title: Selector
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { selectorClearable, selectorDescriptions, selectorGhost, selectorSections, selectorSheet, selectorStatus } from '../../../../components/demos/selector'
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
  :demo="selectorSheet"
  description="Presents a single-selection list in a bottom sheet for compact touch interfaces."
  locale="en"
  title="Bottom sheet"
/>

<DemoExample
  :demo="selectorClearable"
  description="A clear button resets the selected value."
  locale="en"
  title="Clearable"
/>

<DemoExample
  :demo="selectorGhost"
  description="A borderless selector sits with ghost buttons in a toolbar."
  locale="en"
  title="Ghost toolbar"
/>

<DemoExample
  :demo="selectorDescriptions"
  description="Options carry a description, so the menu draws a two-line row. A one-line value stays at the size token. A two-line value grows by one line. Inside an input group the value stays on one line."
  locale="en"
  title="Option descriptions"
/>

<DemoExample
  :demo="selectorSections"
  description="Options are grouped into labeled sections."
  locale="en"
  title="Grouped sections"
/>

<DemoExample
  :demo="selectorStatus"
  description="Error, warning, and success validation states."
  locale="en"
  title="Validation states"
/>
