---
layout: component-docs
title: Radio List
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { radioList } from '../../../../components/demos/radio'
</script>

## Usage

`RadioList` is a convenience wrapper around `RadioGroup`. It accepts an `options` array and renders a group of radio buttons automatically.

```vue
<script setup lang="ts">
import { RadioList } from '@astryx-vue/core/Radio'
import { shallowRef } from 'vue'

const plan = shallowRef('team')
const options = [
  { value: 'free', label: 'Free', description: 'For personal projects.' },
  { value: 'team', label: 'Team', description: 'For small teams.' },
  { value: 'enterprise', label: 'Enterprise', description: 'For organizations.' },
]
</script>

<template>
  <RadioList v-model="plan" label="Plan" :options="options" />
</template>
```




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Keep the number of options small: typically 2 to 7 choices. |
| <Badge variant="success">Do</Badge> | Use clear, concise labels that differentiate each option at a glance. |
| <Badge variant="error">Don't</Badge> | Use when multiple selections are needed; use CheckboxList instead. |
| <Badge variant="error">Don't</Badge> | Use for long lists; use Selector for better discoverability. |
| <Badge variant="error">Don't</Badge> | Use horizontal layout with more than 4 options; it wraps awkwardly. |
| <Badge variant="error">Don't</Badge> | Wrap a disabled RadioList in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead. |

## Examples

<DemoExample :demo="radioList" title="Basic" description="Pass an options array to render a list with descriptions." locale="en" />

## Keyboard and accessibility

`RadioList` hands rendering to [RadioGroup](/en/components/radio-group) internally, so keyboard interactions and the ARIA structure are identical to RadioGroup — there is nothing new to learn when you move between the two.

- The group renders as a single `role="radiogroup"` container, which screen readers announce as a set of radio options.
- An ID is generated automatically for each option, so you never need to specify one yourself.
- A group `label` is required: it is the accessible name of the whole group, and screen readers use it to say what the options are choosing between.

## Usage notes

Prefer `RadioList` when the options are simple and do not need a custom layout: it only needs an `options` array to render the whole group.

Use [RadioGroup](/en/components/radio-group) with Radio children when you need custom option rendering or a more complex layout.
