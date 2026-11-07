import type { PlainDate } from '@astryx-vue/core'
import type { CSSProperties } from 'vue'
import type { TimedEventPlacement } from './timeGridLayout.js'
import type { CalendarEvent, CalendarInstantEvent, ScheduleCategory } from './types.js'
import {
  plainDateAddDays,
  plainDateFromInstant,
  plainDateIsAfter,
  plainDateIsBefore,
  plainDateIsEqual,
  plainDateToInstant,
} from '@astryx-vue/core'
import { eventOccursOnDate, isAllDaySpan, isDayEvent } from './dateMath.js'
import {
  clamp,
  formatEventDateTimeRange,
  formatEventTime,
  formatFullDate,
  getEventCategory,
  getMinutesSinceStartOfDay,
} from './format.js'
import { layoutTimedEvents } from './timeGridLayout.js'

export interface AllDayEventSegment {
  event: CalendarEvent
  columnStart: number
  columnEnd: number
  level: number
}

export function blockKeyOf(eventID: string, dayISO: string): string {
  return `${dayISO}/${eventID}`
}

export function eventIdFromBlockKey(key: string): string {
  return key.slice(dayISOLength(key))
}

function dayISOLength(key: string): number {
  const slash = key.indexOf('/')
  return slash < 0 ? key.length : slash + 1
}

export function formatEventButtonLabel(
  event: CalendarEvent,
  day: PlainDate,
  timezoneID: string,
  categories: ReadonlyArray<ScheduleCategory>,
  locale: string,
): string {
  const category = getEventCategory(event, categories)
  return `${event.title}, ${formatTimeGridEventTime(event, day, timezoneID, locale)}, ${category.label}, ${formatFullDate(day, locale)}`
}

export function formatTimeGridEventTime(
  event: CalendarEvent,
  day: PlainDate,
  timezoneID: string,
  locale: string,
): string {
  if (isDayEvent(event))
    return 'all day'
  return isAllDaySpan(event)
    ? formatEventDateTimeRange(event, timezoneID, locale)
    : formatEventTime(event, day, timezoneID, locale)
}

export function formatTimeGridCellLabel({
  categories,
  day,
  events,
  label,
  locale,
  timezoneID,
}: {
  categories: ReadonlyArray<ScheduleCategory>
  day: PlainDate
  events: ReadonlyArray<CalendarEvent>
  label: string
  locale: string
  timezoneID: string
}): string {
  if (events.length === 0)
    return label
  const eventLabels = events.map(event =>
    `${event.title}, ${getEventCategory(event, categories).label}, ${formatTimeGridEventTime(event, day, timezoneID, locale)}`)
  return `${label}. ${eventLabels.join('. ')}`
}

export function eventOverlapsHour(
  event: CalendarInstantEvent,
  day: PlainDate,
  hour: number,
  timezoneID: string,
): boolean {
  if (!eventOccursOnDate(event, day, timezoneID))
    return false
  const hourStart = plainDateToInstant(day, timezoneID, hour)
  const hourEnd = hour === 23
    ? plainDateToInstant(plainDateAddDays(day, 1), timezoneID)
    : plainDateToInstant(day, timezoneID, hour + 1)
  return event.start < hourEnd && event.end > hourStart
}

export function getAllDayEventSegments(
  events: ReadonlyArray<CalendarEvent>,
  days: ReadonlyArray<PlainDate>,
  timezoneID: string,
): AllDayEventSegment[] {
  const levels: number[] = []
  return events
    .map((event) => {
      const startIndex = days.findIndex(day => eventOccursOnDate(event, day, timezoneID))
      if (startIndex < 0)
        return null
      let endIndex = startIndex
      while (endIndex + 1 < days.length && eventOccursOnDate(event, days[endIndex + 1], timezoneID))
        endIndex += 1
      return { event, startIndex, endIndex }
    })
    .filter((segment): segment is { event: CalendarEvent, startIndex: number, endIndex: number } => segment != null)
    .sort((a, b) => {
      if (a.startIndex !== b.startIndex)
        return a.startIndex - b.startIndex
      return (b.endIndex - b.startIndex) - (a.endIndex - a.startIndex) || a.event.title.localeCompare(b.event.title)
    })
    .map(({ event, startIndex, endIndex }) => {
      const level = levels.findIndex(columnEnd => startIndex > columnEnd)
      const resolved = level >= 0 ? level : levels.length
      levels[resolved] = endIndex
      return { event, columnStart: startIndex, columnEnd: endIndex, level: resolved }
    })
}

export function getTimedEventLayouts({
  events,
  day,
  timezoneID,
  minHour,
  maxHour,
}: {
  events: ReadonlyArray<CalendarInstantEvent>
  day: PlainDate
  timezoneID: string
  minHour: number
  maxHour: number
}): TimedEventPlacement<CalendarInstantEvent>[] {
  const minMinute = minHour * 60
  const maxMinute = maxHour * 60
  const intervals = events.flatMap((event) => {
    const startDate = plainDateFromInstant(event.start, timezoneID)
    const rawStart = plainDateIsBefore(startDate, day) ? 0 : getMinutesSinceStartOfDay(event.start, timezoneID)
    const rawEnd = plainDateIsAfter(plainDateFromInstant(event.end, timezoneID), day)
      ? 24 * 60
      : getMinutesSinceStartOfDay(event.end, timezoneID)
    if (rawEnd <= minMinute || rawStart >= maxMinute)
      return []
    const visibleStart = Math.max(rawStart, minMinute)
    const visibleEnd = Math.min(maxMinute, Math.max(visibleStart + 15, rawEnd))
    return visibleEnd > visibleStart ? [{ event, visibleStart, visibleEnd }] : []
  })
  return layoutTimedEvents(intervals, minMinute, maxMinute)
}

export function timedBlockStyle(block: TimedEventPlacement<CalendarInstantEvent>): CSSProperties {
  const top = clamp(block.top, 0, 100)
  const height = clamp(block.height, 4, 100)
  const inlineStart = (block.columnStart / block.columnCount) * 100
  const inlineSize = (block.columnSpan / block.columnCount) * 100
  return {
    top: `calc(${top}% + 2px)`,
    height: `calc(${height}% - 5px)`,
    insetInlineStart: `calc(${inlineStart}% + var(--astryx-spacing-0-5, 2px))`,
    inlineSize: `calc(${inlineSize}% - var(--astryx-spacing-0-5, 2px) * 2)`,
  }
}

export function getCurrentTimeTop({
  currentTime,
  day,
  timezoneID,
  minHour,
  maxHour,
}: {
  currentTime: number
  day: PlainDate
  timezoneID: string
  minHour: number
  maxHour: number
}): number | null {
  if (!plainDateIsEqual(day, plainDateFromInstant(currentTime, timezoneID)))
    return null
  const currentMinute = getMinutesSinceStartOfDay(currentTime, timezoneID)
  const minMinute = minHour * 60
  const maxMinute = maxHour * 60
  if (currentMinute < minMinute || currentMinute > maxMinute)
    return null
  return ((currentMinute - minMinute) / (maxMinute - minMinute)) * 100
}
