---
layout: component-docs
title: Input Group
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { inputGroupBasic } from '../../../../components/demos/input-group'
</script>

## Usage

`InputGroup` joins a field with a prefix, a suffix, or a button so they read as one control. Use it for a unit, a protocol, or a short action.

Put fixed text in the `before` and `after` slots:

```vue
<script setup lang="ts">
import { InputGroup, InputGroupText } from '@astryx-vue/core/InputGroup'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const domain = ref('')
</script>

<template>
  <InputGroup label="Website" description="Public address" is-required>
    <template #before>
      <InputGroupText>https://</InputGroupText>
    </template>
    <TextInput v-model="domain" label="Domain" is-label-hidden placeholder="example" />
    <template #after>
      <InputGroupText>.com</InputGroupText>
    </template>
  </InputGroup>
</template>
```

Once the group has a label, it is a field. The label, description, optional or required mark, and status come from the shared field shell, so do not wrap another field around it. A control inside the group keeps its own label for that cell, usually hidden. Fixed text in the addons uses the group text component, which shares the addon type size and color. Without a label, the group stays a joined control that can sit inside a field that already exists.

## Best practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use `before` for a fixed prefix such as a unit or `https://`. |
| <Badge variant="success">Do</Badge> | Use `after` for a short action, such as clear or submit. |
| <Badge variant="success">Do</Badge> | Keep the addons short so the field itself stays easy to read. |
| <Badge variant="error">Don't</Badge> | Stack several addons on both sides. The field becomes cramped. |

## Examples

<DemoExample
  :demo="inputGroupBasic"
  description="The price field brings its own label, description, optional mark, and error. The dollar sign and USD are group text."
  locale="en"
  title="Basic"
/>
