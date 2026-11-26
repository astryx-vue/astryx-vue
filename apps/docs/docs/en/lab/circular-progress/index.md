---
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
| `isIndeterminate` | `boolean` | `false` | Shows an arc that turns as Spinner's does; reduced motion slows it without stopping it. |
| `isDisabled` | `boolean` | `false` | Takes the neutral fill and draws the whole ring, center content included, at half opacity. |

Use the default slot to replace the center content. `value` and `hasValueLabel` are ignored when `isIndeterminate` is enabled.

Every variant draws its fill over the same muted track, so each enabled fill reaches 3:1 against it. A value change keeps moving even while a script holds the page busy: the arc turns on the compositor over the theme's duration and easing.
