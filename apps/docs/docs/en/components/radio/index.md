---
layout: component-docs
title: Radio
outline: false
footer: false
---

<script setup lang="ts">
import { radioBasic, radioList, radioStates } from '../../../../components/demos/radio'
</script>

## Usage

`Radio` represents a single option. It must be used inside a `RadioGroup`, which manages selection through `provide/inject`.

```vue
<script setup lang="ts">
import { Radio, RadioGroup } from '@astryx-vue/core/Radio'
import { shallowRef } from 'vue'

const size = shallowRef('md')
</script>

<template>
  <RadioGroup v-model="size" label="Size">
    <Radio value="sm" label="Small" />
    <Radio value="md" label="Medium" />
    <Radio value="lg" label="Large" />
  </RadioGroup>
</template>
```

## Examples

<DemoExample :demo="radioBasic" title="Basic" description="Place Radio items inside RadioGroup. v-model binds the currently selected value." locale="en" />

<DemoExample :demo="radioList" title="Radio list" description="RadioList accepts an options array to render a group quickly." locale="en" />

<DemoExample :demo="radioStates" title="Disabled option" description="A single option can be disabled without affecting the rest of the group." locale="en" />

## Keyboard interactions

- Tab: focus the radio group.
- Arrow keys: move selection within the group.
- Space: select the currently focused option.

## Usage notes

- Use a radio group when options are few and mutually exclusive.
- Consider a select control when there are more than about 7 options.
- Always provide a group `label`.
