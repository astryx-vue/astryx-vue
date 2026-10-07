---
layout: component-docs
title: Checkbox Indicator
outline: false
footer: false
---

<script setup lang="ts">
import { checkboxIndicatorStates } from '../../../../components/demos/checkbox-indicator'
</script>

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

<DemoExample :demo="checkboxIndicatorStates" title="States and sizes" description="sm is 20px. md is 24px. Disabled indicators use reduced opacity." locale="en" />

For an interactive checkbox, use [CheckboxInput](/en/components/checkbox-input).
