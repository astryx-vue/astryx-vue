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

Once focus enters a radio group, the options follow the browser's native radio keyboard behavior, so no extra key conventions are needed:

- Tab: focus the radio group. Focus lands on the currently selected option, and the whole group takes up a single stop in the tab order.
- Arrow keys: move the selection within the group.
- Space: select the option that currently has focus.

## Usage notes

A radio group is meant for choosing one option out of a small, mutually exclusive set. Once that set grows larger, the pattern stops working well.

- When there are only a few mutually exclusive options, a radio group lets the user see every choice at a glance.
- When there are more than about 7 options, a select control takes up less space and is easier to scan.

Whatever the number of options, always provide a group `label`: it is the accessible name for the whole radio group, and screen readers rely on it when announcing the options.
