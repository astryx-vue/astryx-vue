---
layout: component-docs
title: Input Group
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { inputGroupBasic, inputGroupWithIcon } from '../../../../components/demos/input-group'
</script>

## Usage

`InputGroup` joins a field with a prefix, a suffix, or a button so they read as one control. Use it for a unit, a protocol, or a short action.

Put fixed text in the `before` and `after` slots:

```vue
<script setup lang="ts">
import { InputGroup } from '@astryx-vue/core/InputGroup'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const domain = ref('')
</script>

<template>
  <InputGroup>
    <template #before>
      <span>https://</span>
    </template>
    <TextInput v-model="domain" label="Domain" is-label-hidden placeholder="example" />
    <template #after>
      <span>.com</span>
    </template>
  </InputGroup>
</template>
```

`before` sits in front of the field and `after` sits behind it. The content can be text, an icon, or a button.

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
  description="Combine input with prefix/suffix slots for URL, email scenarios."
  locale="en"
  title="Basic Usage"
/>

<DemoExample
  :demo="inputGroupWithIcon"
  description="The before slot can hold a short prefix that explains the field."
  locale="en"
  title="Prefix"
/>
