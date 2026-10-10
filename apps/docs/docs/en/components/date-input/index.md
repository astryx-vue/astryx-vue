---
layout: component-docs
title: Date Input
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

`DateInput` is a date input component that combines a text input field with a calendar popover. Users can manually type dates or click to open a calendar picker.

Basic usage requires only a bound date value:

```vue
<script setup lang="ts">
import { DateInput } from '@astryx-vue/core/DateInput'
import { ref } from 'vue'

const date = ref(null)
</script>

<template>
  <DateInput v-model="date" placeholder="Select date" />
</template>
```

Date values use the `CalendarDate` type from `@internationalized/date`. The component automatically formats dates as `YYYY-MM-DD` for display.

Customize the date display format with the `format` property:

```vue
<template>
  <DateInput v-model="date" format="MM/DD/YYYY" />
</template>
```

Use `minValue` and `maxValue` to constrain the selectable date range; out-of-range dates are disabled in the calendar:

```vue
<script setup lang="ts">
import { today } from '@internationalized/date'

const minDate = today('Asia/Shanghai')
const maxDate = today('Asia/Shanghai').add({ years: 1 })
</script>

<template>
  <DateInput v-model="date" :min-value="minDate" :max-value="maxDate" />
</template>
```

Enable `clearable` to show a clear button next to selected dates:

```vue
<template>
  <DateInput v-model="date" clearable />
</template>
```

## Best Practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Provide clear functionality for non-required date fields. |
| <Badge variant="success">Do</Badge> | Set reasonable date range constraints to prevent invalid selections. |
| <Badge variant="success">Do</Badge> | Use clear placeholder text to indicate date format. |
| <Badge variant="error">Don't</Badge> | Use date input for scenarios requiring time precision; use a datetime picker instead. |

## Examples

Date input component examples will display normally in the application.

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `CalendarDate \| null` | `null` | Selected date |
| `format` | `string` | `'YYYY-MM-DD'` | Date display format |
| `placeholder` | `string` | `'Please select date'` | Placeholder text |
| `clearable` | `boolean` | `false` | Whether clearable |
| `disabled` | `boolean` | `false` | Whether disabled |
| `readonly` | `boolean` | `false` | Whether readonly |
| `minValue` | `CalendarDate` | - | Minimum selectable date |
| `maxValue` | `CalendarDate` | - | Maximum selectable date |
| `isDateUnavailable` | `(date: CalendarDate) => boolean` | - | Function to determine if date is unavailable |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size |
| `status` | `'default' \| 'error' \| 'warning' \| 'success'` | `'default'` | Status |

## Emits

| Name | Parameters | Description |
| --- | --- | --- |
| `update:modelValue` | `date: CalendarDate \| null` | Emitted when date changes |
| `change` | `date: CalendarDate \| null` | Emitted when date changes |
| `clear` | - | Emitted when date is cleared |

## Slots

| Name | Parameters | Description |
| --- | --- | --- |
| `prepend` | - | Content before input field |
| `append` | - | Content after input field |

## Keyboard Interaction

| Key | Function |
| --- | --- |
| `Enter` / `Space` | Open calendar popover |
| `Escape` | Close calendar popover |
| `ArrowDown` | Open calendar and move focus to calendar |
| When calendar open | All calendar keyboard interactions apply |

## Accessibility

- Input includes `role="combobox"` and `aria-haspopup="dialog"`
- Calendar popover uses `role="dialog"` with appropriate `aria-label`
- Supports `aria-expanded` state
- Full keyboard navigation support
