---
layout: lab-docs
title: CircularProgress
---

# CircularProgress

Represents determinate or indeterminate progress in a ring.

<script setup lang="ts">
import { labCircularProgress } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labCircularProgress" description="Determinate progress with a value, a large success ring, and indeterminate progress." locale="en" title="Determinate and indeterminate" /></ClientOnly>

## Import

```ts
import { CircularProgress } from '@astryx-vue/lab'
```

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `undefined` | Current value; ignored in indeterminate mode. |
| `max` | `number` | `100` | Maximum value. |
| `label` | `string` | Required | Accessible name. |
| `isLabelHidden` | `boolean` | `true` | Hides the label visually while keeping it available to screen readers. |
| `hasValueLabel` | `boolean` | `false` | Shows the value in the center. |
| `formatValueLabel` | `(value, max) => string` | Percentage | Custom center-value formatter. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Ring size. |
| `variant` | `'accent' \| 'success' \| 'warning' \| 'error' \| 'neutral'` | `'accent'` | Semantic color. |
| `isIndeterminate` | `boolean` | `false` | Shows indeterminate animation. |
| `isDisabled` | `boolean` | `false` | Uses disabled colors. |

Use the default slot to replace the center content. `value` and `hasValueLabel` are ignored when `isIndeterminate` is enabled.
