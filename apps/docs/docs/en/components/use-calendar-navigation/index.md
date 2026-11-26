---
layout: component-docs
title: useCalendarNavigation
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useCalendarNavigationMonthPager } from '../../../../components/demos/use-calendar-navigation'
</script>

## Usage

Manages which month a calendar shows: previous and next month, a month header written in the locale and calendar, and the day to focus next when keyboard navigation crosses a month edge, so arrow keys walk from the last day of one month into the next. Use it with `useCalendarDays` when composing custom calendar headers, pagers or two-month pickers.

It works uncontrolled (`initialValue`) or controlled (`focusDate` with `onFocusDateChange`). With `calendar`, it steps that calendar's months, and `visibleCalendarMonths` gives that calendar's year and month, ready for `useCalendarDays` with the same `calendar`; dates stay Gregorian ISO. The provider calendar is never read.

```ts
import { useCalendarNavigation } from '@astryx-vue/core/Calendar'
```

```ts
const nav = useCalendarNavigation({ initialValue: '2026-01-15' })
const { weeks } = useCalendarDays(() => ({ ...nav.visibleCalendarMonths.value[0]! }))

nav.navigateMonth(1) // next month
nav.navigateMonth(1, focusedIso, 1) // arrow key across the month edge; focus nav.pendingFocus afterwards
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Wire `navigateMonth(-1)` and `navigateMonth(1)` to the previous and next month buttons. |
| <Badge variant="success">Do</Badge> | When an arrow key crosses a month edge, pass `focusedDate` and `offset` (1 for left and right, 7 for up and down) to `navigateMonth`, focus the `pendingFocus` day after the month changes, then call `clearPendingFocus`. |
| <Badge variant="error">Don't</Badge> | Hardcode month header strings; use `monthYearLabel`, which follows the locale and the calendar. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useCalendarNavigationMonthPager"
  description="A month view built from useCalendarNavigation and useCalendarDays: the buttons page through months, and pressing the right arrow on the last day moves to the next month and focuses its first day."
  locale="en"
  title="useCalendarNavigation — Month Pager"
/>
