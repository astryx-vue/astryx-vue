---
layout: component-docs
title: Input Group Text
outline: false
footer: false
---

## Usage

A prefix or suffix text element rendered inside InputGroup. Displays text or icons.

Put it in the `before` or `after` slot of `InputGroup` to show a unit, a currency symbol, a protocol, or a fixed domain around the input. The text is not editable and is skipped by Tab, so it never gets in the way of typing.

```vue
<script setup lang="ts">
import { InputGroup, InputGroupText } from '@astryx-vue/core/InputGroup'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const price = ref('')
</script>

<template>
  <InputGroup label="Price">
    <template #before>
      <InputGroupText>$</InputGroupText>
    </template>
    <TextInput v-model="price" label="Amount" is-label-hidden placeholder="0.00" />
    <template #after>
      <InputGroupText>USD</InputGroupText>
    </template>
  </InputGroup>
</template>
```

The default slot holds the text. An icon works too, since the slot accepts any markup; keep it decorative, because the group's `label` is what names the control for a screen reader.

```ts
import { InputGroupText } from '@astryx-vue/core/InputGroup'
```
