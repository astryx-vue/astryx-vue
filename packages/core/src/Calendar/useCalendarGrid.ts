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
    const anchor = days.find(day => !day.outside)?.date ?? days[0]!.date
    weeks.push({ number: isoWeekNumber(anchor), days })
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
