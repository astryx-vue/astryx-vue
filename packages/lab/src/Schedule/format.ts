import type { CalendarSystem, PlainDate } from '@astryx-vue/core'
import type {
  CalendarEvent,
  CalendarInstantEvent,
  Instant,
  ScheduleCategory,
  ScheduleEventColor,
} from './types.js'
import {
  plainDateFromInstant,
  plainDateIsBefore,
  plainDateIsEqual,
  plainDateToDate,
  plainDateToInstant,
} from '@astryx-vue/core'
import { isDayEvent } from './dateMath.js'

const DEFAULT_EVENT_CATEGORY: ScheduleCategory = {
  label: 'Event',
  color: 'blue',
}

export function getEventCategory(
  event: CalendarEvent,
  categories: ReadonlyArray<ScheduleCategory>,
): ScheduleCategory {
  return categories.find(category => category.label === event.category)
    ?? (event.category != null
      ? { label: event.category, color: DEFAULT_EVENT_CATEGORY.color }
      : DEFAULT_EVENT_CATEGORY)
}

/** `Intl` 没有 `iso8601` 的月份名，按月日相同的公历写。 */
function intlCalendar(calendar: CalendarSystem): string {
  return calendar === 'iso8601' ? 'gregory' : calendar
}

function formatDate(date: PlainDate, options: Intl.DateTimeFormatOptions, locale: string, calendar: CalendarSystem): string {
  return new Intl.DateTimeFormat(locale, { ...options, calendar: intlCalendar(calendar) }).format(plainDateToDate(date))
}

export function monthTitleParts(date: PlainDate, locale: string, calendar: CalendarSystem = 'gregory'): Intl.DateTimeFormatPart[] {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    calendar: intlCalendar(calendar),
  }).formatToParts(plainDateToDate(date))
}

export function formatMonthTitle(date: PlainDate, locale: string, calendar: CalendarSystem = 'gregory'): string {
  return formatDate(date, { month: 'long', year: 'numeric' }, locale, calendar)
}

export function formatMonthName(date: PlainDate, locale: string, calendar: CalendarSystem = 'gregory'): string {
  return formatDate(date, { month: 'long' }, locale, calendar)
}

/** 日期在 `calendar` 里的年份和月份。一个公历月可能跨两个别的历法的月，范围标题按历法自己的月和年比。 */
function calendarYearMonth(date: PlainDate, calendar: CalendarSystem): { year: string, month: string } {
  const parts = new Intl.DateTimeFormat('en-u-nu-latn', {
    year: 'numeric',
    month: 'numeric',
    calendar: intlCalendar(calendar),
    timeZone: 'UTC',
  }).formatToParts(new Date(Date.UTC(date.year, date.month - 1, date.day)))
  const read = (type: string): string => parts.find(part => part.type === type)?.value ?? ''
  return { year: read('relatedYear') || read('year'), month: read('month') }
}

export function isSameCalendarMonth(a: PlainDate, b: PlainDate, calendar: CalendarSystem = 'gregory'): boolean {
  const first = calendarYearMonth(a, calendar)
  const second = calendarYearMonth(b, calendar)
  return first.year === second.year && first.month === second.month
}

export function isSameCalendarYear(a: PlainDate, b: PlainDate, calendar: CalendarSystem = 'gregory'): boolean {
  return calendarYearMonth(a, calendar).year === calendarYearMonth(b, calendar).year
}

export function formatWeekTitle(start: PlainDate, end: PlainDate, locale: string, calendar: CalendarSystem = 'gregory'): string {
  if (isSameCalendarMonth(start, end, calendar))
    return formatMonthTitle(start, locale, calendar)
  const startMonth = formatMonthName(start, locale, calendar)
  const endMonthTitle = formatMonthTitle(end, locale, calendar)
  return isSameCalendarYear(start, end, calendar)
    ? `${startMonth} - ${endMonthTitle}`
    : `${formatMonthTitle(start, locale, calendar)} - ${endMonthTitle}`
}

export function formatFullDate(date: PlainDate, locale: string, calendar: CalendarSystem = 'gregory'): string {
  return formatDate(date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }, locale, calendar)
}

export function formatWeekRange(start: PlainDate, end: PlainDate, timezoneID: string, locale: string, calendar: CalendarSystem = 'gregory'): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: timezoneID,
    calendar: intlCalendar(calendar),
  })
  const startDate = new Date(plainDateToInstant(start, timezoneID, 12))
  const endDate = new Date(plainDateToInstant(end, timezoneID, 12))
  return typeof formatter.formatRange === 'function'
    ? formatter.formatRange(startDate, endDate)
    : `${formatter.format(startDate)} – ${formatter.format(endDate)}`
}

export function formatWeekday(date: PlainDate, weekday: 'short' | 'long', locale: string): string {
  return formatDate(date, { weekday }, locale, 'gregory')
}

export function formatDayNumber(date: PlainDate, locale: string, calendar: CalendarSystem = 'gregory'): string {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', calendar: intlCalendar(calendar) })
    .formatToParts(plainDateToDate(date))
    .filter(part => part.type === 'day')
    .map(part => part.value)
    .join('')
}

export function formatHour(hour: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { hour: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 0, 1, hour)))
}

export function formatTimezoneAbbreviation(date: PlainDate, timezoneID: string, locale: string): string {
  const part = new Intl.DateTimeFormat(locale, { timeZone: timezoneID, timeZoneName: 'short' })
    .formatToParts(new Date(plainDateToInstant(date, timezoneID, 12)))
    .find(({ type }) => type === 'timeZoneName')
  return part?.value ?? timezoneID
}

function timeFormatter(timezoneID: string, locale: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezoneID,
  })
}

export function formatEventTime(
  event: CalendarInstantEvent,
  _day: PlainDate,
  timezoneID: string,
  locale: string,
): string {
  const formatter = timeFormatter(timezoneID, locale)
  return `${formatter.format(new Date(event.start))} - ${formatter.format(new Date(event.end))}`
}

export function formatEventTimeRange(event: CalendarInstantEvent, timezoneID: string, locale: string): string {
  const formatter = timeFormatter(timezoneID, locale)
  return `${formatter.format(new Date(event.start))} - ${formatter.format(new Date(event.end))}`
}

export function formatEventDateTimeRange(
  event: CalendarInstantEvent,
  timezoneID: string,
  locale: string,
  calendar: CalendarSystem = 'gregory',
): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezoneID,
    calendar: intlCalendar(calendar),
  })
  const start = new Date(event.start)
  const end = new Date(event.end)
  return typeof formatter.formatRange === 'function'
    ? formatter.formatRange(start, end)
    : `${formatter.format(start)} – ${formatter.format(end)}`
}

export function formatEventStartTime(event: CalendarInstantEvent, timezoneID: string, locale: string): string {
  return timeFormatter(timezoneID, locale).format(new Date(event.start))
}

export function formatEventAccessibilityLabel(
  event: CalendarEvent,
  day: PlainDate,
  timezoneID: string,
  categories: ReadonlyArray<ScheduleCategory>,
  locale: string,
): string {
  const category = getEventCategory(event, categories)
  const timeLabel = isDayEvent(event) ? 'all day' : formatEventTime(event, day, timezoneID, locale)
  return `${event.title}, ${category.label}, ${timeLabel}`
}

export function getMinutesSinceStartOfDay(instant: number, timezoneID: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezoneID,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(instant))
  const lookup = Object.fromEntries(
    parts.filter(part => part.type !== 'literal').map(part => [part.type, Number(part.value)]),
  )
  return lookup.hour * 60 + lookup.minute
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function isEventInPast(event: CalendarEvent, currentTime: Instant, timezoneID: string): boolean {
  if (isDayEvent(event))
    return plainDateIsBefore(event.end, plainDateFromInstant(currentTime, timezoneID))
  return event.end <= currentTime
}

export function isSamePlainDate(a: PlainDate, b: PlainDate): boolean {
  return plainDateIsEqual(a, b)
}

export type { ScheduleEventColor }
