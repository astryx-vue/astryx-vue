---
layout: component-docs
title: useCalendarConstraints
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useCalendarConstraintsHotelBooking } from '../../../../components/demos/use-calendar-constraints'
</script>

## Usage

Decides whether a date can be picked: it combines `min` / `max` bounds, span limits measured from an in-progress range start, and custom rules (such as weekly closures or blackout dates) into one `isDateDisabled`. `Calendar` uses the same rules internally; use it directly when building scheduling interfaces or range pickers of your own.

`isDateDisabled` reads the latest options on every call, so calling it in a template keeps up with option changes. Dates are Gregorian `PlainDate` values, the same as `day.date` from `useCalendarDays`, so it works with any calendar system.

```ts
import { useCalendarConstraints } from '@astryx-vue/core/Calendar'
```

```ts
const anchor = ref<PlainDate | null>(null)
const { isDateDisabled } = useCalendarConstraints(() => ({
  min: '2026-06-05',
  max: '2026-06-25',
  maxRangeSpan: 8,
  rangeAnchor: anchor.value,
  dateConstraints: [date => date.getDay() !== 1],
}))

isDateDisabled({ year: 2026, month: 6, day: 15 })
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Pass `rangeAnchor` only after the user picks the first date, so every eligible start date stays selectable before the first click. |
| <Badge variant="success">Do</Badge> | Use `dateConstraints` for recurring or changing rules, such as closed weekdays, past holidays or sold-out dates. |
| <Badge variant="error">Don't</Badge> | Make network calls or heavy calculations inside `dateConstraints`; `isDateDisabled` runs synchronously for every day rendered in the grid. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useCalendarConstraintsHotelBooking"
  description="A hotel booking month built from useCalendarConstraints and useCalendarDays: days outside the season and Mondays are disabled, and after a check-in is picked, days beyond a 7-night stay are disabled too."
  locale="en"
  title="useCalendarConstraints — Hotel Booking"
/>
