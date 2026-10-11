---
layout: component-docs
title: Calendar
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { calendarBasic, calendarRange } from '../../../../components/demos/calendar'
</script>

## Usage

`Calendar` shows one month as a grid. The value is a `Date`. `min` and `max` limit the range, and `isDateDisabled` rejects individual dates. Arrow keys move through the grid, and Enter selects the focused day.

## Best practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Limit the range with `min` and `max` when the product only accepts some dates. |
| <Badge variant="success">Do</Badge> | Use `isDateDisabled` for dates that fall inside the range but still cannot be chosen. |
| <Badge variant="success">Do</Badge> | Construct dates as local calendar days, not as timestamps that shift across time zones. |
| <Badge variant="error">Don't</Badge> | Cover the day grid with extra decoration. The month should stay easy to scan. |

## Examples

<DemoExample
  :demo="calendarBasic"
  description="Click to select date, arrow keys to navigate, Enter to confirm."
  locale="en"
  title="Basic Usage"
/>

<DemoExample
  :demo="calendarRange"
  description="Limit the selectable range with min and max. Dates outside that range are disabled."
  locale="en"
  title="Date Range"
/>
