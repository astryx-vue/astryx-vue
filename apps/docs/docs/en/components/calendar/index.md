---
layout: component-docs
title: Calendar
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { calendarConstraints, calendarRange, calendarSingle, calendarTwoMonths } from '../../../../components/demos/calendar'
</script>

## Usage

`Calendar` shows a month grid. `mode="single"` selects one day. `mode="range"` with `v-model:range` selects a start and an end. `numberOfMonths` can show two months. `focusDate` chooses which month opens first. `min`, `max`, and `isDateDisabled` limit which days can be chosen.

Bind a date:

```vue
<script setup lang="ts">
import { Calendar } from '@astryx-vue/core/Calendar'
import { ref } from 'vue'

const date = ref<Date | null>(new Date(2026, 9, 11))
</script>

<template>
  <Calendar v-model="date" label="Select a date" />
</template>
```

The value is a local `Date`. The month title and weekday names follow the active locale. Built-in labels are English unless the app calls `provideAstryxLocale('zh-CN')`.

## Best practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Limit the range with `min` and `max` when the product only accepts some dates. |
| <Badge variant="success">Do</Badge> | Use `isDateDisabled` for dates that fall inside the range but still cannot be chosen. |
| <Badge variant="success">Do</Badge> | Construct dates as local calendar days, not as timestamps that shift across time zones. |
| <Badge variant="error">Don't</Badge> | Cover the day grid with extra decoration. The month should stay easy to scan. |

## Examples

<DemoExample
  :demo="calendarConstraints"
  description="Only weekdays from January 10 through March 20, 2026 can be selected."
  locale="en"
  title="Constraints"
/>

<DemoExample
  :demo="calendarRange"
  description="Pick a start and end date. The days between them stay highlighted."
  locale="en"
  title="Range"
/>

<DemoExample
  :demo="calendarSingle"
  description="Pick one date from the month."
  locale="en"
  title="Single date"
/>

<DemoExample
  :demo="calendarTwoMonths"
  description="Two months side by side, for a range that crosses a month boundary."
  locale="en"
  title="Two months"
/>
