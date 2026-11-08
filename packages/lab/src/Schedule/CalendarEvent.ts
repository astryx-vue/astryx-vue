import type { ISODateString, PlainDate, TokenColor } from '@astryx-vue/core'
import type { Instant } from './types.js'
import { plainDateFromISO } from '@astryx-vue/core'

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/

export type ScheduleEventColor = Exclude<TokenColor, 'default'>

export interface ScheduleCategory {
  label: string
  color: ScheduleEventColor
}

export interface CalendarEventBase {
  id: string
  title: string
  category?: string
}

export interface CalendarDayEvent extends CalendarEventBase {
  start: PlainDate
  end: PlainDate
}

export interface CalendarInstantEvent extends CalendarEventBase {
  start: Instant
  end: Instant
}

export type CalendarEvent = CalendarDayEvent | CalendarInstantEvent

export function createEventFromISO({
  id,
  title,
  category,
  start,
  end,
}: {
  id: string
  title: string
  category?: CalendarEvent['category']
  start: string
  end: string
}): CalendarEvent {
  if (DATE_ONLY_RE.test(start) && DATE_ONLY_RE.test(end)) {
    return {
      id,
      title,
      category,
      start: plainDateFromISO(start as ISODateString),
      end: plainDateFromISO(end as ISODateString),
    }
  }
  return {
    id,
    title,
    category,
    start: Date.parse(start),
    end: Date.parse(end),
  }
}
