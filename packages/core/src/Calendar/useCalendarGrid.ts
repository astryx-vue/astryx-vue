import type { CalendarDate } from '@internationalized/date'
import { CalendarDate as CalendarDay } from '@internationalized/date'
import { calendarISO, isoWeekNumber, weekdayIndex } from './calendarDate.js'

export interface CalendarGridDay {
  date: CalendarDate
  iso: string
  outside: boolean
  day: number
}

export interface CalendarGridWeek {
  number: number
  days: CalendarGridDay[]
}

export function buildCalendarWeeks(year: number, month: number, weekStartsOn = 0, variableRows = false): CalendarGridWeek[] {
  const first = new CalendarDay(year, month, 1)
  const offset = (weekdayIndex(first) - weekStartsOn + 7) % 7
  const daysInMonth = first.add({ months: 1 }).subtract({ days: 1 }).day
  const rows = variableRows ? Math.ceil((daysInMonth + offset) / 7) : 6
  let cursor = first.subtract({ days: offset })
  const weeks: CalendarGridWeek[] = []

  for (let row = 0; row < rows; row += 1) {
    const days: CalendarGridDay[] = []
    for (let column = 0; column < 7; column += 1) {
      days.push({
        date: cursor,
        iso: calendarISO(cursor),
        outside: cursor.month !== month || cursor.year !== year,
        day: cursor.day,
      })
      cursor = cursor.add({ days: 1 })
    }
    // ISO 8601 按周四定周：一行里的周四所在的 ISO 周，就是这一行大多数日子所在的周，
    // 周起始日是周日或周六时也一样。
    const thursday = days[(4 - weekStartsOn + 7) % 7]!.date
    weeks.push({ number: isoWeekNumber(thursday), days })
  }

  return weeks
}

export function firstEnabledDay(year: number, month: number, isDisabled: (date: CalendarDate) => boolean): CalendarDate | null {
  const total = new CalendarDay(year, month, 1).add({ months: 1 }).subtract({ days: 1 }).day
  for (let day = 1; day <= total; day += 1) {
    const date = new CalendarDay(year, month, day)
    if (!isDisabled(date))
      return date
  }
  return null
}
