import type { PlainDate, ScheduleRange, ScheduleTimeGridViewOptions, ScheduleView } from './types.js'
import { plainDateAddDays } from '@astryx-vue/core'
import { markRaw } from 'vue'
import { getScheduleRangeFromDates } from './dateMath.js'
import ScheduleDayView from './ScheduleDayView.vue'
import { scheduleRangeToZonedDateTimeRange } from './zonedDateTime.js'

export type ScheduleDayViewOptions = ScheduleTimeGridViewOptions

export function createScheduleDayView({
  minHour = 0,
  maxHour = 24,
  hourHeight = 100,
  renderPopover,
}: ScheduleDayViewOptions = {}): ScheduleView<ScheduleDayViewOptions> {
  return markRaw({
    component: ScheduleDayView,
    options: { minHour, maxHour, hourHeight, renderPopover },
    getDateRange: date => scheduleRangeToZonedDateTimeRange(getDayDateRange(date.toPlainDate(), date.timezoneID), date.timezoneID),
    getPreviousDateRange: date => ({
      label: 'Previous day',
      range: scheduleRangeToZonedDateTimeRange(
        getDayDateRange(plainDateAddDays(date.toPlainDate(), -1), date.timezoneID),
        date.timezoneID,
      ),
    }),
    getNextDateRange: date => ({
      label: 'Next day',
      range: scheduleRangeToZonedDateTimeRange(
        getDayDateRange(plainDateAddDays(date.toPlainDate(), 1), date.timezoneID),
        date.timezoneID,
      ),
    }),
  })
}

function getDayDateRange(date: PlainDate, timezoneID: string): ScheduleRange {
  return getScheduleRangeFromDates({
    startDate: date,
    endDate: plainDateAddDays(date, 1),
    timezoneID,
  })
}
