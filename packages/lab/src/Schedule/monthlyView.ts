import type { PlainDate, ScheduleRange, ScheduleView } from './types.js'
import {
  plainDateAddDays,
  plainDateAddMonths,
  plainDateSetEndOfWeekExclusive,
  plainDateSetFirstOfMonth,
  plainDateSetStartOfWeek,
} from '@astryx-vue/core'
import { markRaw } from 'vue'
import { getScheduleRangeFromDates } from './dateMath.js'
import ScheduleMonthlyView from './ScheduleMonthlyView.vue'
import { scheduleRangeToZonedDateTimeRange } from './zonedDateTime.js'

export interface ScheduleMonthlyViewOptions {
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  renderPopover?: import('./types.js').ScheduleTimeGridViewOptions['renderPopover']
}

export function createScheduleMonthlyView({
  weekStartsOn = 0,
  renderPopover,
}: ScheduleMonthlyViewOptions = {}): ScheduleView<ScheduleMonthlyViewOptions> {
  return markRaw({
    component: ScheduleMonthlyView,
    options: { weekStartsOn, renderPopover },
    getDateRange: date => scheduleRangeToZonedDateTimeRange(getMonthDateRange({
      date: date.toPlainDate(),
      timezoneID: date.timezoneID,
      weekStartsOn,
    }), date.timezoneID),
    getPreviousDateRange: date => ({
      label: 'Previous month',
      range: scheduleRangeToZonedDateTimeRange(getMonthDateRange({
        date: plainDateAddMonths(date.toPlainDate(), -1),
        timezoneID: date.timezoneID,
        weekStartsOn,
      }), date.timezoneID),
    }),
    getNextDateRange: date => ({
      label: 'Next month',
      range: scheduleRangeToZonedDateTimeRange(getMonthDateRange({
        date: plainDateAddMonths(date.toPlainDate(), 1),
        timezoneID: date.timezoneID,
        weekStartsOn,
      }), date.timezoneID),
    }),
  })
}

function getMonthDateRange({
  date,
  timezoneID,
  weekStartsOn,
}: {
  date: PlainDate
  timezoneID: string
  weekStartsOn: number
}): ScheduleRange {
  const firstOfMonth = plainDateSetFirstOfMonth(date)
  const nextMonth = plainDateAddMonths(firstOfMonth, 1)
  return getScheduleRangeFromDates({
    startDate: plainDateSetStartOfWeek(firstOfMonth, weekStartsOn),
    endDate: plainDateSetEndOfWeekExclusive(plainDateAddDays(nextMonth, -1), weekStartsOn),
    timezoneID,
  })
}
