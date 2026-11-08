import type { PlainDate } from '@astryx-vue/core'
import type { CalendarDayEvent, CalendarEvent } from './CalendarEvent.js'
import type { Instant, ScheduleRange } from './types.js'
import {
  plainDateAddDays,
  plainDateFromInstant,
  plainDateIsAfter,
  plainDateIsBefore,
  plainDateToInstant,
} from '@astryx-vue/core'

export function getBrowserTimezoneID(): string {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
}

export function isDayEvent(event: CalendarEvent): event is CalendarDayEvent {
  return typeof event.start !== 'number'
}

const ALL_DAY_SPAN_MS = 24 * 60 * 60 * 1000

/** 全天事件，或持续满 24 小时的时刻事件，画在全天行里。 */
export function isAllDaySpan(event: CalendarEvent): boolean {
  return isDayEvent(event) || event.end - event.start >= ALL_DAY_SPAN_MS
}

export function getScheduleRangeFromDates({
  startDate,
  endDate,
  timezoneID,
}: {
  startDate: PlainDate
  endDate: PlainDate
  timezoneID: string
}): ScheduleRange {
  return {
    startDate,
    endDate,
    start: plainDateToInstant(startDate, timezoneID),
    end: plainDateToInstant(endDate, timezoneID),
  }
}

export function enumerateDates(start: PlainDate, endExclusive: PlainDate): PlainDate[] {
  const dates: PlainDate[] = []
  let current = start
  while (plainDateIsBefore(current, endExclusive)) {
    dates.push(current)
    current = plainDateAddDays(current, 1)
  }
  return dates
}

export function eventOverlapsRange(
  event: CalendarEvent,
  range: ScheduleRange,
  timezoneID: string,
): boolean {
  if (isDayEvent(event)) {
    const eventStart = plainDateToInstant(event.start, timezoneID)
    const eventEnd = plainDateToInstant(plainDateAddDays(event.end, 1), timezoneID)
    return eventStart < range.end && eventEnd > range.start
  }
  return event.start < range.end && event.end > range.start
}

export function eventOccursOnDate(
  event: CalendarEvent,
  date: PlainDate,
  timezoneID: string,
): boolean {
  if (isDayEvent(event)) {
    return !plainDateIsAfter(event.start, date) && !plainDateIsBefore(event.end, date)
  }
  const startDate = plainDateFromInstant(event.start, timezoneID)
  const endDate = plainDateFromInstant(Math.max(event.end - 1, event.start), timezoneID)
  return !plainDateIsAfter(startDate, date) && !plainDateIsBefore(endDate, date)
}

export function sortEvents(
  events: ReadonlyArray<CalendarEvent>,
  timezoneID: string,
): CalendarEvent[] {
  return [...events].sort((a, b) => {
    const aStart = eventSortStart(a, timezoneID)
    const bStart = eventSortStart(b, timezoneID)
    return aStart < bStart ? -1 : aStart > bStart ? 1 : a.title.localeCompare(b.title)
  })
}

function eventSortStart(event: CalendarEvent, timezoneID: string): Instant {
  return isDayEvent(event) ? plainDateToInstant(event.start, timezoneID) : event.start
}
