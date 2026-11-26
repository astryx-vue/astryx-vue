---
layout: component-docs
title: useCalendarDays
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useCalendarDaysMonthGrid } from '../../../../components/demos/use-calendar-days'
</script>

## Usage

Builds the day grid for one month: every date to show, including the previous and next months' days that fill the first and last weeks, grouped into weeks, plus localized weekday header names that start on `weekStartsOn`. It is the layout `Calendar` uses, for a custom month view such as a compact availability grid or a mini calendar. It returns data only: rendering, selection, keyboard navigation and the grid's accessibility semantics are the caller's.

With `calendar`, the month comes from that calendar system: `{ year: 1405, month: 8, calendar: 'persian' }` is Aban in the Persian calendar, while each day's `date` and `iso` stay Gregorian. The composable never reads the provider calendar; pass `useLocale().calendar` to follow it.

```ts
import { useCalendarDays } from '@astryx-vue/core/Calendar'
```

```ts
const { weeks, dayNames } = useCalendarDays({ year: 2026, month: 12, weekStartsOn: 1 })

// Pass a getter when the options change
const { weeks: persianWeeks } = useCalendarDays(() => ({ year: year.value, month: month.value, calendar: 'persian' }))
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Render `dayNames` as the header row so the header follows `weekStartsOn` and the locale together with the grid. |
| <Badge variant="success">Do</Badge> | Style days with `isOutside` differently, for example dimmed, so the filler days read as part of the next or previous month. |
| <Badge variant="error">Don't</Badge> | Use it to build a date picker that people choose from; use `Calendar`, which adds selection, keyboard navigation and grid semantics. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useCalendarDaysMonthGrid"
  description="December 2026 laid out with useCalendarDays: the header and the grid start on the chosen first day of the week, and the filler days from the neighboring months are dimmed."
  locale="en"
  title="useCalendarDays — Month Grid"
/>
