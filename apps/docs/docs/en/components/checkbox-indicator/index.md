---
layout: component-docs
title: Checkbox Indicator
outline: false
footer: false
---

## Usage

`CheckboxIndicator` displays unchecked, checked or indeterminate marks.
It is decorative. It has no input, focus or form behavior.

```vue
<script setup lang="ts">
import { CheckboxIndicator } from '@astryx-vue/core/CheckboxIndicator'
</script>

<template>
  <CheckboxIndicator state="indeterminate" size="sm" />
</template>
```

Import the theme in the application entry:

```ts
import '@astryx-vue/themes/neutral.css'
```


For an interactive checkbox, use [CheckboxInput](/en/components/checkbox-input).
