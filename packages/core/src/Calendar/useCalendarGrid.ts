import type { CalendarDate } from '@internationalized/date'
import type { CalendarMonth, CalendarSystem } from '../utils/calendarSystem.js'
import { calendarDayOfMonth, calendarMonthOf, isGregorianAligned } from '../utils/calendarSystem.js'
import { calendarISO, isoWeekNumber, weekdayIndex } from './calendarDate.js'
import { toCalendarDay } from './calendarMonths.js'

export interface CalendarGridDay {
  date: CalendarDate
  iso: string
  outside: boolean
  /** 这一天在它所在的历法月里是第几天。 */
  day: number
}

export interface CalendarGridWeek {
  number: number
  days: CalendarGridDay[]
}

/** 一个历法月的格子：前后用相邻月份的日子补齐整周，`variableRows` 关掉时固定六行。 */
export function buildMonthWeeks(
  calendar: CalendarSystem,
  month: CalendarMonth,
  weekStartsOn = 0,
  variableRows = false,
): CalendarGridWeek[] {
  const first = toCalendarDay(month.start)
  const offset = (weekdayIndex(first) - weekStartsOn + 7) % 7
  const rows = variableRows ? Math.ceil((month.length + offset) / 7) : 6
  const aligned = isGregorianAligned(calendar)
  let cursor = first.subtract({ days: offset })
  let index = -offset
  const weeks: CalendarGridWeek[] = []

  for (let row = 0; row < rows; row += 1) {
    const days: CalendarGridDay[] = []
    for (let column = 0; column < 7; column += 1) {
      const outside = index < 0 || index >= month.length
      days.push({
        date: cursor,
        iso: calendarISO(cursor),
        outside,
        day: aligned ? cursor.day : outside ? calendarDayOfMonth(calendar, cursor) : index + 1,
      })
      cursor = cursor.add({ days: 1 })
      index += 1
    }
    // ISO 8601 按周四定周：一行里的周四所在的 ISO 周，就是这一行大多数日子所在的周，
    // 周起始日是周日或周六时也一样。
    const thursday = days[(4 - weekStartsOn + 7) % 7]!.date
    weeks.push({ number: isoWeekNumber(thursday), days })
  }

  return weeks
}

/** 公历 `year` 年 `month` 月的格子。 */
export function buildCalendarWeeks(year: number, month: number, weekStartsOn = 0, variableRows = false): CalendarGridWeek[] {
  return buildMonthWeeks('gregory', calendarMonthOf('gregory', { year, month, day: 1 }), weekStartsOn, variableRows)
}

/** 历法月里第一个可选的日子，整个月都不可选时返回 null。 */
export function firstEnabledDay(month: CalendarMonth, isDisabled: (date: CalendarDate) => boolean): CalendarDate | null {
  let date = toCalendarDay(month.start)
  for (let day = 0; day < month.length; day += 1) {
    if (!isDisabled(date))
      return date
    date = date.add({ days: 1 })
  }
  return null
}
