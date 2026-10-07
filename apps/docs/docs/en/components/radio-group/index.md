---
layout: component-docs
title: Radio Group
outline: false
footer: false
---

<script setup lang="ts">
import { radioBasic, radioStates } from '../../../../components/demos/radio'
</script>

## Usage

`RadioGroup` is a container for mutually exclusive options. It provides name, selected value, and selection handling to child `Radio` items through `provide/inject`.

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

<DemoExample :demo="radioBasic" title="Basic" description="RadioGroup manages the selected state of child Radio items." locale="en" />

<DemoExample :demo="radioStates" title="Disabled option" description="Options in the array or Radio children can be disabled individually." locale="en" />

## Keyboard and accessibility

- The group has a shared `role="radiogroup"`.
- `aria-labelledby` links the group to its label.
- A group `label` is required.
- `isRequired` enables native required validation.
- Error states set `aria-invalid`.

## Usage notes

- Use RadioGroup with Radio children when you need custom option layout.
- Use [RadioList](/en/components/radio-list) when the options are simple and array-based.
