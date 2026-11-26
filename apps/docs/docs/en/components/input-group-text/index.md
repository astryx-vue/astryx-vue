---
layout: component-docs
title: Input Group Text
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

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

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Keep the text short, such as `$`, `https://` or `kg`. It stays on one line and does not shrink. |
| <Badge variant="success">Do</Badge> | Put what a screen reader user needs in the input's own label, such as "Amount in USD" beside a `$` prefix. The addon is read as plain text in reading order. |
| <Badge variant="error">Don't</Badge> | Put buttons, links or other controls inside `InputGroupText`. Use a `Button` addon for an action. |
| <Badge variant="error">Don't</Badge> | Use `InputGroupText` outside `InputGroup`. Its borders and corners join an `InputGroup` row. |
