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

`RadioGroup` turns a set of mutually exclusive options into a single radio group, so assistive technology reads it as one control rather than a handful of unrelated buttons. The semantics and attributes below are handled by the component for you.

- The whole group renders as one container with `role="radiogroup"`, which screen readers announce with radio group semantics.
- `aria-labelledby` links the container to its label, so a group `label` is required — it is the accessible name of the whole group.
- The group sets `aria-invalid` automatically when it is in an error state.
- Setting `isRequired` shows the required hint and enables native required validation.

For the keyboard, every option in the group shares one `name`, so the browser treats them as a native radio group: pressing `Tab` moves into the group and lands on the selected option, and the arrow keys then move between options.

## Usage notes

These two notes help you choose between `RadioGroup` and [RadioList](/en/components/radio-list). Both solve the same problem — picking one value from a group of mutually exclusive options — and they differ only in how much control you get over the option layout.

- Use `RadioGroup` with `Radio` children when you need a custom option layout or rendering.
- Use [RadioList](/en/components/radio-list) when the options are simple and array-based and you do not need to customize the layout.
