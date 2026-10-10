---
layout: component-docs
title: Calendar
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## Usage

`Calendar` is a date picker component that displays a month's dates in a grid format. Users can click to select dates. Supports keyboard navigation, date range constraints, and disabling specific dates.

Basic usage requires only a bound date value:

```vue
<script setup lang="ts">
import { Calendar } from '@astryx-vue/core/Calendar'
import { today } from '@internationalized/date'
import { ref } from 'vue'

const date = ref(today('Asia/Shanghai'))
</script>

<template>
  <Calendar v-model="date" />
</template>
```

Date values use the `CalendarDate` type from `@internationalized/date`, a timezone-free pure date representation that avoids timezone issues with native `Date` objects.

Use `minValue` and `maxValue` to constrain the selectable date range:

```vue
<script setup lang="ts">
import { today } from '@internationalized/date'

const minDate = today('Asia/Shanghai')
const maxDate = today('Asia/Shanghai').add({ months: 1 })
</script>

<template>
  <Calendar v-model="date" :min-value="minDate" :max-value="maxDate" />
</template>
```

Use `isDateUnavailable` to disable specific dates like weekends or holidays:

```vue
<script setup lang="ts">
function isWeekend(date) {
  const day = date.toDate('Asia/Shanghai').getDay()
  return day === 0 || day === 6
}
</script>

<template>
  <Calendar v-model="date" :is-date-unavailable="isWeekend" />
</template>
```

The calendar supports full keyboard navigation: arrow keys move the focused date, `PageUp`/`PageDown` change months, `Home`/`End` jump to month start/end, and `Enter` or `Space` select the current date.

## Best Practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Set reasonable date range constraints for your use case. |
| <Badge variant="success">Do</Badge> | Use `isDateUnavailable` to disable unselectable dates. |
| <Badge variant="success">Do</Badge> | Use `@internationalized/date` instead of native `Date` to avoid timezone issues. |
| <Badge variant="error">Don't</Badge> | Overlay too many decorations or custom content on the calendar grid. |

## Examples

Calendar component examples will display normally in the application.

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `CalendarDate \| null` | `null` | Selected date |
| `defaultValue` | `CalendarDate` | - | Default displayed month |
| `minValue` | `CalendarDate` | - | Minimum selectable date |
| `maxValue` | `CalendarDate` | - | Maximum selectable date |
| `isDateUnavailable` | `(date: CalendarDate) => boolean` | - | Function to determine if date is unavailable |
| `locale` | `string` | `'en-US'` | Locale code |
| `disabled` | `boolean` | `false` | Whether disabled |
| `readonly` | `boolean` | `false` | Whether readonly |

## Emits

| Name | Parameters | Description |
| --- | --- | --- |
| `update:modelValue` | `date: CalendarDate \| null` | Emitted when date changes |
| `change` | `date: CalendarDate \| null` | Emitted when date changes |

## Slots

| Name | Parameters | Description |
| --- | --- | --- |
| `header` | `{ month: string, year: number }` | Customize header |
| `day` | `{ date: CalendarDate, isSelected: boolean, isDisabled: boolean }` | Customize day cell |

## Keyboard Interaction

| Key | Function |
| --- | --- |
| `ArrowLeft` | Move focus to previous day |
| `ArrowRight` | Move focus to next day |
| `ArrowUp` | Move focus to same day in previous week |
| `ArrowDown` | Move focus to same day in next week |
| `PageUp` | Previous month |
| `PageDown` | Next month |
| `Home` | Move focus to first day of month |
| `End` | Move focus to last day of month |
| `Enter` / `Space` | Select focused date |

## Accessibility

- Uses `role="grid"` calendar grid semantics
- Week headers use `<th>` with `scope="col"`
- Date cells include `aria-selected` state
- Unavailable dates marked with `aria-disabled="true"`
- Full keyboard navigation support per ARIA Authoring Practices
