import type { PlainDate } from '@astryx-vue/core'
import type { Instant, ScheduleDate, ScheduleRange } from './types.js'
import {
  plainDateAddDays,
  plainDateFromInstant,
  plainDateToInstant,
} from '@astryx-vue/core'

export interface ZonedDateTime {
  instant: Instant
  timezoneID: string
  toPlainDate: () => PlainDate
  addDays: (days: number) => ZonedDateTime
  startOfDay: () => ZonedDateTime
}

export type ZonedDateTimeRange = [ZonedDateTime, ZonedDateTime]

export function createZonedDateTime(date: ScheduleDate, timezoneID: string): ZonedDateTime {
  return zonedDateTimeFromInstant(date, timezoneID)
}

export function zonedDateTimeFromInstant(instant: Instant, timezoneID: string): ZonedDateTime {
  return {
    instant,
    timezoneID,
    toPlainDate: () => plainDateFromInstant(instant, timezoneID),
    addDays: days => zonedDateTimeFromInstant(
      plainDateToInstant(plainDateAddDays(plainDateFromInstant(instant, timezoneID), days), timezoneID),
      timezoneID,
    ),
    startOfDay: () => {
      const date = plainDateFromInstant(instant, timezoneID)
      return zonedDateTimeFromInstant(plainDateToInstant(date, timezoneID), timezoneID)
    },
  }
}

export function scheduleRangeToZonedDateTimeRange(
  range: ScheduleRange,
  timezoneID: string,
): ZonedDateTimeRange {
  return [
    zonedDateTimeFromInstant(range.start, timezoneID),
    zonedDateTimeFromInstant(range.end, timezoneID),
  ]
}
