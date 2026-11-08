---
title: Schedule
---

# Schedule

Schedule draws events as a month, a week or day time grid, or a list grouped by day. Paging, Today, and the view switch live in header plugins, and the caller owns the instant for the current page. It displays events; it is not a date picker. It is a Lab component and ships only under the `canary` tag.

<script setup lang="ts">
import { labSchedule } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labSchedule" description="Switch month, week, day, and list from the end of the header. Previous, Today, and Next update date. Timed events sit on the time grid, and categories color them." locale="en" title="Four views" /></ClientOnly>

## Import

```ts
import {
  createEventFromISO,
  createScheduleDayView,
  createScheduleListView,
  createScheduleMonthlyView,
  createScheduleWeeklyView,
  Schedule,
  useSchedulePaginationPlugin,
  useScheduleViewSelectorPlugin,
} from '@astryx-vue/lab'
```

## Date and events

`date` is the required instant, in epoch milliseconds, for the page on screen. Paging calls `onChangeDate`; a template can listen with `@change-date`. One action notifies once. The next instant keeps the original time of day and shifts onto the previous or next page.

`events` is either an array or `(start, end) => Promise<events>`. The loader receives the current page bounds. Until it resolves, the grid is empty and a spinner sits beside the title.

`createEventFromISO` treats `YYYY-MM-DD` as an all-day event and a date-time string as an instant event. An instant event of 24 hours or more is drawn on the all-day row.

`categories` match `label` to `event.category` for the color and the accessible category name. An unmatched name keeps that name and uses blue. An event with no category is `Event` in blue.

## Views

Keep the object from each factory. Do not call the factory again on every render:

| Factory | Range |
| --- | --- |
| `createScheduleMonthlyView` | The month grid, including leading and trailing days. `weekStartsOn` is optional. |
| `createScheduleWeeklyView` | Seven day columns. Also accepts `weekStartsOn`, `minHour`, `maxHour`, and `hourHeight`. |
| `createScheduleDayView` | One day column, with the same hour window. |
| `createScheduleListView` | Consecutive days from `date`, 7 by default. A day is shown when it has events, is today, or is the first day of the range. |

Month, week, and day accept `renderPopover`. Content makes that event a button for the view's single popover. `null` leaves that event read-only. Omitting the option leaves the whole page read-only. The list view has no popover.

## Plugins

The default plugins are the pager: previous, Today, next. Passing `plugins` replaces them. `useScheduleViewSelectorPlugin` belongs at the end and treats the view object identity as the selection.

The range title in the header is always level 2. `headingLevel` applies to the smaller headings inside the view and defaults to 3.

Fixed control and popover strings match upstream and stay in English: Today, All day, Loading events. Date labels follow the active locale and stay Gregorian. Non-Gregorian calendar systems from upstream are not available here.
