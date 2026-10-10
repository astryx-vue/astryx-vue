---
layout: component-docs
title: Number Input
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

`NumberInput` is a specialized numeric input component that provides stepper buttons, min/max value constraints, and precision control. Users can manually type numbers or click buttons to increment/decrement.

Basic usage requires only a bound number value:

```vue
<script setup lang="ts">
import { NumberInput } from '@astryx-vue/core/NumberInput'
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <NumberInput v-model="count" />
</template>
```

Use `min` and `max` properties to set the value range, and `step` to set the increment/decrement amount:

```vue
<template>
  <NumberInput v-model="count" :min="0" :max="100" :step="5" />
</template>
```

Control decimal places with `precision`, useful for prices, ratings, etc.:

```vue
<template>
  <NumberInput v-model="price" :precision="2" :step="0.01" />
</template>
```

The component automatically validates input, constraining out-of-range values to valid intervals. Supports mouse wheel adjustment, keyboard arrow keys, and other interaction methods.

## Best Practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Set `min` and `max` for scenarios with clear value ranges. |
| <Badge variant="success">Do</Badge> | Set reasonable step values based on needs: 1 for quantities, 0.01 for prices. |
| <Badge variant="success">Do</Badge> | Include units in labels (e.g., "Quantity (pieces)") rather than inside the input. |
| <Badge variant="error">Don't</Badge> | Use overly small steps for large ranges; users will need many clicks. |
| <Badge variant="error">Don't</Badge> | Disable manual input in scenarios requiring precise entry. |

## Examples

Number input component examples will display normally in the application.

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number` | `0` | Current value |
| `min` | `number` | `-Infinity` | Minimum value |
| `max` | `number` | `Infinity` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `precision` | `number` | - | Decimal places |
| `disabled` | `boolean` | `false` | Whether disabled |
| `readonly` | `boolean` | `false` | Whether readonly |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size |
| `status` | `'default' \| 'error' \| 'warning' \| 'success'` | `'default'` | Status |
| `placeholder` | `string` | - | Placeholder |

## Emits

| Name | Parameters | Description |
| --- | --- | --- |
| `update:modelValue` | `value: number` | Emitted when value changes |
| `change` | `value: number` | Emitted when value changes |
| `blur` | `event: FocusEvent` | Emitted on blur |
| `focus` | `event: FocusEvent` | Emitted on focus |

## Slots

| Name | Description |
| --- | --- |
| `prepend` | Content before input |
| `append` | Content after input |

## Keyboard Interaction

| Key | Function |
| --- | --- |
| `ArrowUp` | Increase by one step |
| `ArrowDown` | Decrease by one step |
| `PageUp` | Increase by ten steps |
| `PageDown` | Decrease by ten steps |
| `Home` | Jump to minimum value |
| `End` | Jump to maximum value |

## Accessibility

- Uses native `<input type="number">` semantics
- Supports `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- Screen readers announce current value and range
- Buttons include appropriate `aria-label`
