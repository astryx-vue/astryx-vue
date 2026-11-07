import type { PlainDate } from '@astryx-vue/core'
import type { MonthChipPlacement } from './monthLayout.js'
import type { CalendarEvent, ScheduleCategory } from './types.js'
import { plainDateAddDays, plainDateIsAfter, plainDateIsBefore, plainDateIsEqual, plainDateToISO } from '@astryx-vue/core'
import { isDayEvent } from './dateMath.js'
import { formatEventTimeRange, formatFullDate, formatWeekRange, getEventCategory } from './format.js'
import { getEventDateSpan } from './monthLayout.js'

export type MonthPopoverKey
  = | { kind: 'day', dayISO: string }
    | { kind: 'chip', segment: string, eventID: string }
    | { kind: 'row', dayISO: string, eventID: string }

export function dayKey(dayISO: string): string {
  return `day/${dayISO}`
}

export function chipKey(chip: MonthChipPlacement): string {
  return `chip/${chip.week}:${chip.columnStart}/${chip.event.id}`
}

export function rowKey(dayISO: string, eventID: string): string {
  return `row/${dayISO}/${eventID}`
}

export function parseKey(key: string | null): MonthPopoverKey | null {
  if (key == null)
    return null
  const slash = key.indexOf('/')
  const kind = key.slice(0, slash)
  const rest = key.slice(slash + 1)
  if (kind === 'day')
    return { kind, dayISO: rest }
  const second = rest.indexOf('/')
  const head = rest.slice(0, second)
  const eventID = rest.slice(second + 1)
  if (kind === 'chip')
    return { kind, segment: head, eventID }
  return kind === 'row' ? { kind, dayISO: head, eventID } : null
}

export function getWeeks(days: ReadonlyArray<PlainDate>): PlainDate[][] {
  const weeks: PlainDate[][] = []
  for (let index = 0; index < days.length; index += 7)
    weeks.push(days.slice(index, index + 7))
  return weeks
}

export function getMonthEventsByDay(
  events: ReadonlyArray<CalendarEvent>,
  days: ReadonlyArray<PlainDate>,
  timezoneID: string,
): Map<string, CalendarEvent[]> {
  const eventsByDay = new Map<string, CalendarEvent[]>()
  days.forEach(day => eventsByDay.set(plainDateToISO(day), []))
  const firstDay = days[0]
  const lastDay = days[days.length - 1]
  if (firstDay == null || lastDay == null)
    return eventsByDay
  events.forEach((event) => {
    const [eventStart, eventEnd] = getEventDateSpan(event, timezoneID)
    if (plainDateIsBefore(eventEnd, firstDay) || plainDateIsAfter(eventStart, lastDay))
      return
    let current = plainDateIsBefore(eventStart, firstDay) ? firstDay : eventStart
    const visibleEnd = plainDateIsAfter(eventEnd, lastDay) ? lastDay : eventEnd
    while (!plainDateIsAfter(current, visibleEnd)) {
      eventsByDay.get(plainDateToISO(current))?.push(event)
      current = plainDateAddDays(current, 1)
    }
  })
  return eventsByDay
}

export function formatMonthEventName(
  event: CalendarEvent,
  dayLabel: string,
  timezoneID: string,
  categories: ReadonlyArray<ScheduleCategory>,
  locale: string,
): string {
  const time = isDayEvent(event) ? 'all day' : formatEventTimeRange(event, timezoneID, locale)
  return `${event.title}, ${time}, ${getEventCategory(event, categories).label}, ${dayLabel}`
}

export function formatEventDays(event: CalendarEvent, timezoneID: string, locale: string): string {
  const [first, last] = getEventDateSpan(event, timezoneID)
  return plainDateIsEqual(first, last)
    ? formatFullDate(first, locale)
    : formatWeekRange(first, last, timezoneID, locale)
}
