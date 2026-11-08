import type { PlainDate, ScheduleRange, ScheduleView, ScheduleViewOptions } from './types.js'
import { plainDateAddDays } from '@astryx-vue/core'
import { markRaw } from 'vue'
import { getScheduleRangeFromDates } from './dateMath.js'
import ScheduleListView from './ScheduleListView.vue'
import { scheduleRangeToZonedDateTimeRange } from './zonedDateTime.js'

export interface ScheduleListViewOptions extends ScheduleViewOptions {
  days?: number
}

export function createScheduleListView({
  days: listDays = 7,
}: ScheduleListViewOptions = {}): ScheduleView<ScheduleListViewOptions> {
  return markRaw({
    component: ScheduleListView,
    options: { days: listDays },
    getDateRange: date => scheduleRangeToZonedDateTimeRange(
      getListDateRange(date.toPlainDate(), date.timezoneID, listDays),
      date.timezoneID,
    ),
    getPreviousDateRange: date => ({
      label: 'Previous list range',
      range: scheduleRangeToZonedDateTimeRange(
        getListDateRange(plainDateAddDays(date.toPlainDate(), -listDays), date.timezoneID, listDays),
        date.timezoneID,
      ),
    }),
    getNextDateRange: date => ({
      label: 'Next list range',
      range: scheduleRangeToZonedDateTimeRange(
        getListDateRange(plainDateAddDays(date.toPlainDate(), listDays), date.timezoneID, listDays),
        date.timezoneID,
      ),
    }),
  })
}

function getListDateRange(date: PlainDate, timezoneID: string, days: number): ScheduleRange {
  return getScheduleRangeFromDates({
    startDate: date,
    endDate: plainDateAddDays(date, days),
    timezoneID,
  })
}
