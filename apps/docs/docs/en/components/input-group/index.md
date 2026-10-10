---
layout: component-docs
title: Input Group
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

`InputGroup` combines an input field with prefix, suffix, buttons, or other elements into a unified visual container. Commonly used for adding labels, units, or action buttons.

Basic usage adds prepend or append content via slots:

```vue
<script setup lang="ts">
import { InputGroup } from '@astryx-vue/core/InputGroup'
</script>

<template>
  <InputGroup>
    <template #prepend>
      <span>https://</span>
    </template>
    <input type="text" placeholder="Enter domain" aria-label="Domain input">
    <template #append>
      <span>.com</span>
    </template>
  </InputGroup>
</template>
```

The `prepend` slot adds content before the input, and `append` adds content after. Content can be text, icons, buttons, or any element.

The group can contain `<input>`, `<textarea>`, or other input components. `InputGroup` provides a unified visual container and border.

```vue
<template>
  <InputGroup>
    <template #prepend>
      <span class="i-lucide-user" />
    </template>
    <input type="text" placeholder="Username" aria-label="Username input">
  </InputGroup>
</template>
```

## Best Practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use prepend content for units, protocol prefixes, and fixed text. |
| <Badge variant="success">Do</Badge> | Use append content for clear buttons, submit buttons, and actions. |
| <Badge variant="success">Do</Badge> | Keep prefix/suffix content concise to avoid taking too much space. |
| <Badge variant="error">Don't</Badge> | Use too many prefix/suffix elements at once; the input will feel crowded. |
| <Badge variant="error">Don't</Badge> | Place overly long text or complex interactive elements in prefix/suffix. |

## Examples

Input group component examples will display normally in the application.

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size |
| `status` | `'default' \| 'error' \| 'warning' \| 'success'` | `'default'` | Status |
| `disabled` | `boolean` | `false` | Whether disabled |

## Slots

| Name | Description |
| --- | --- |
| `default` | Input field main content |
| `prepend` | Content before input |
| `append` | Content after input |

## Accessibility

- Preserves native semantics of internal input elements
- Decorative prefix/suffix elements use `aria-hidden="true"`
- Interactive prefix/suffix elements (buttons etc.) retain full accessibility attributes
