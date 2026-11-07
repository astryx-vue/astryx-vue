import type { PlainDate, ScheduleRange, ScheduleTimeGridViewOptions, ScheduleView } from './types.js'
import { plainDateAddDays, plainDateSetStartOfWeek } from '@astryx-vue/core'
import { markRaw } from 'vue'
import { getScheduleRangeFromDates } from './dateMath.js'
import ScheduleWeeklyView from './ScheduleWeeklyView.vue'
import { scheduleRangeToZonedDateTimeRange } from './zonedDateTime.js'

export interface ScheduleWeeklyViewOptions extends ScheduleTimeGridViewOptions {
  /** 一周从哪天开始，0 是周日。默认 0。 */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

export function createScheduleWeeklyView({
  weekStartsOn = 0,
  minHour = 0,
  maxHour = 24,
  hourHeight = 100,
  renderPopover,
}: ScheduleWeeklyViewOptions = {}): ScheduleView<ScheduleWeeklyViewOptions> {
  return markRaw({
    component: ScheduleWeeklyView,
    options: { weekStartsOn, minHour, maxHour, hourHeight, renderPopover },
    getDateRange: date => scheduleRangeToZonedDateTimeRange(
      getWeekDateRange(date.toPlainDate(), date.timezoneID, weekStartsOn),
      date.timezoneID,
    ),
    getPreviousDateRange: date => ({
      label: 'Previous week',
      range: scheduleRangeToZonedDateTimeRange(
        getWeekDateRange(plainDateAddDays(date.toPlainDate(), -7), date.timezoneID, weekStartsOn),
        date.timezoneID,
      ),
    }),
    getNextDateRange: date => ({
      label: 'Next week',
      range: scheduleRangeToZonedDateTimeRange(
        getWeekDateRange(plainDateAddDays(date.toPlainDate(), 7), date.timezoneID, weekStartsOn),
        date.timezoneID,
      ),
    }),
  })
}

function getWeekDateRange(date: PlainDate, timezoneID: string, weekStartsOn: number): ScheduleRange {
  const startDate = plainDateSetStartOfWeek(date, weekStartsOn)
  return getScheduleRangeFromDates({
    startDate,
    endDate: plainDateAddDays(startDate, 7),
    timezoneID,
  })
}
