import type { WeekStartsOn } from '../composables/useDateRange.js'
import { CalendarDate } from '@internationalized/date'
import { resolveWeekStart } from '../composables/useDateRange.js'

export interface CalendarMonthCursor {
  year: number
  month: number
}

export function toCalendarDate(date: Date): CalendarDate {
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

export function fromCalendarDate(date: CalendarDate): Date {
  return new Date(date.year, date.month - 1, date.day)
}

export function calendarISO(date: CalendarDate): string {
  const month = String(date.month).padStart(2, '0')
  const day = String(date.day).padStart(2, '0')
  return `${date.year}-${month}-${day}`
}

export function dateISO(date: Date): string {
  return calendarISO(toCalendarDate(date))
}

export function sameCalendarDay(a: CalendarDate, b: CalendarDate): boolean {
  return a.compare(b) === 0
}

export function calendarDiffDays(a: CalendarDate, b: CalendarDate): number {
  const start = Date.UTC(a.year, a.month - 1, a.day)
  const end = Date.UTC(b.year, b.month - 1, b.day)
  return Math.round((end - start) / 86_400_000)
}

export function monthIndex(date: CalendarMonthCursor): number {
  return date.year * 12 + date.month
}

export function shiftMonth(date: CalendarMonthCursor, amount: number): CalendarDate {
  return new CalendarDate(date.year, date.month, 1).add({ months: amount })
}

export function weekdayIndex(date: CalendarDate): number {
  return date.toDate('UTC').getUTCDay()
}

export function weekStartIndex(value: WeekStartsOn | number | undefined): number {
  return resolveWeekStart(value)
}

/** ISO week number. The Thursday of the week decides the year. */
export function isoWeekNumber(date: CalendarDate): number {
  const utc = new Date(Date.UTC(date.year, date.month - 1, date.day))
  const day = utc.getUTCDay() || 7
  utc.setUTCDate(utc.getUTCDate() + 4 - day)
  const yearStart = Date.UTC(utc.getUTCFullYear(), 0, 1)
  return Math.ceil(((utc.getTime() - yearStart) / 86_400_000 + 1) / 7)
}

export function weekFieldName(locale: string): string {
  try {
    const name = new Intl.DisplayNames(locale, { type: 'dateTimeField' }).of('weekOfYear')
    if (name)
      return name
  }
  catch {
    // Hosts without this Intl feature fall through to the English name.
  }
  return locale.startsWith('zh') ? '周' : 'week'
}

export function formatWeekdayDate(date: CalendarDate, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(fromCalendarDate(date))
}

export interface InitialCalendarFocus {
  focusDate?: Date
  selected?: Date | null
  rangeStart?: Date | null
  min?: Date
  max?: Date
  numberOfMonths: number
  today?: Date
}

/**
 * The month the calendar opens on. An explicit focus date wins, then the
 * selection. Otherwise today is clamped into the min/max window so the first
 * paint is not an all-disabled month.
 */
export function initialCalendarFocus(options: InitialCalendarFocus): CalendarDate {
  if (options.focusDate)
    return toCalendarDate(options.focusDate)
  if (options.selected)
    return toCalendarDate(options.selected)
  if (options.rangeStart)
    return toCalendarDate(options.rangeStart)

  const today = options.today ? toCalendarDate(options.today) : toCalendarDate(new Date())
  const min = options.min ? toCalendarDate(options.min) : null
  const max = options.max ? toCalendarDate(options.max) : null
  if (min && today.compare(min) < 0)
    return min
  if (max && today.compare(max) > 0) {
    const shifted = shiftMonth(max, -(Math.max(0, options.numberOfMonths - 1)))
    if (min && shifted.compare(new CalendarDate(min.year, min.month, 1)) < 0)
      return min
    return shifted
  }
  return today
}
