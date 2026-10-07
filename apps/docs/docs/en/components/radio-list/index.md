---
layout: component-docs
title: Radio List
outline: false
footer: false
---

<script setup lang="ts">
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

## Examples

<DemoExample :demo="radioList" title="Basic" description="Pass an options array to render a list with descriptions." locale="en" />

## Keyboard and accessibility

- Same keyboard interactions and ARIA structure as RadioGroup.
- IDs are generated automatically for each option.
- A group `label` is required.

## Usage notes

- Prefer RadioList when the options are simple and do not need custom layout.
- Use [RadioGroup](/en/components/radio-group) with Radio children for custom rendering or complex layouts.
