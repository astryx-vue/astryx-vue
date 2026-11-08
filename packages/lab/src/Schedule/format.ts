import type { PlainDate } from '@astryx-vue/core'
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

function formatDate(date: PlainDate, options: Intl.DateTimeFormatOptions, locale: string): string {
  return new Intl.DateTimeFormat(locale, { ...options, calendar: 'gregory' }).format(plainDateToDate(date))
}

export function monthTitleParts(date: PlainDate, locale: string): Intl.DateTimeFormatPart[] {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    calendar: 'gregory',
  }).formatToParts(plainDateToDate(date))
}

export function formatMonthTitle(date: PlainDate, locale: string): string {
  return formatDate(date, { month: 'long', year: 'numeric' }, locale)
}

export function formatMonthName(date: PlainDate, locale: string): string {
  return formatDate(date, { month: 'long' }, locale)
}

function sameMonth(a: PlainDate, b: PlainDate): boolean {
  return a.year === b.year && a.month === b.month
}

export function formatWeekTitle(start: PlainDate, end: PlainDate, locale: string): string {
  if (sameMonth(start, end))
    return formatMonthTitle(start, locale)
  const startMonth = formatMonthName(start, locale)
  const endMonthTitle = formatMonthTitle(end, locale)
  return start.year === end.year
    ? `${startMonth} - ${endMonthTitle}`
    : `${formatMonthTitle(start, locale)} - ${endMonthTitle}`
}

export function formatFullDate(date: PlainDate, locale: string): string {
  return formatDate(date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }, locale)
}

export function formatWeekRange(start: PlainDate, end: PlainDate, timezoneID: string, locale: string): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: timezoneID,
    calendar: 'gregory',
  })
  const startDate = new Date(plainDateToInstant(start, timezoneID, 12))
  const endDate = new Date(plainDateToInstant(end, timezoneID, 12))
  return typeof formatter.formatRange === 'function'
    ? formatter.formatRange(startDate, endDate)
    : `${formatter.format(startDate)} – ${formatter.format(endDate)}`
}

export function formatWeekday(date: PlainDate, weekday: 'short' | 'long', locale: string): string {
  return formatDate(date, { weekday }, locale)
}

export function formatDayNumber(date: PlainDate, locale: string): string {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', calendar: 'gregory' })
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
): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezoneID,
    calendar: 'gregory',
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
