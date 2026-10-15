---
layout: component-docs
title: Calendar
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { calendarConstraints, calendarRange, calendarSingle, calendarSpan, calendarTwoMonths, calendarWeeks } from '../../../../components/demos/calendar'
</script>

## Usage

`Calendar` shows one or two months and selects a day or a start and end. It opens on the requested month, or on the selected day, or on today when that day still falls inside the earliest and latest dates.

A day is unavailable when it is outside those bounds, when a predicate returns true, or when any constraint returns false. A range can also require a minimum and maximum length, counting both ends. Week numbers can sit beside each row. Days from the neighboring months can fill the grid, and they cannot be picked. The grid can shrink to the weeks the month needs, or stay six rows tall. The week can start on Sunday or on any other day, given as a number or a short name. A handle can move the visible month to a date and focus that day.

Arrow keys move by a day or a week, cross into the next month, and skip days that cannot be picked. Home and End move to the first and last available day of the week. Page Up and Page Down move by a month. Enter or Space picks the focused day. Escape cancels a range that has a start but no end yet. Each month is a grid named with that month. Selection, today, and unavailable days are exposed to assistive technology.

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


<ComponentAnatomy />

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

<DemoExample
  :demo="calendarWeeks"
  description="Turn week numbers, outside days, and a shorter month on or off, and start the week on Monday."
  locale="en"
  title="Weeks"
/>

<DemoExample
  :demo="calendarSpan"
  description="The range is at most three days, and Sundays cannot be picked. June moves the month from outside the calendar."
  locale="en"
  title="Span and navigation"
/>
