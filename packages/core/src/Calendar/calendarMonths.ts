import type { CalendarMonth, CalendarSystem } from '../utils/calendarSystem.js'
import type { PlainDate } from '../utils/plainDate.js'
import { CalendarDate } from '@internationalized/date'
import { calendarAddMonths, calendarMonthOf } from '../utils/calendarSystem.js'

/**
 * 日历格子按「历法月」排：公历时就是公历月，波斯历时是波斯历的月。
 * 一个历法月用它第一天的公历日期表示，日期本身始终是公历。
 */

export function toCalendarDay(pd: PlainDate): CalendarDate {
  return new CalendarDate(pd.year, pd.month, pd.day)
}

/** 包含 `date` 的历法月。 */
export function monthOf(calendar: CalendarSystem, date: PlainDate): CalendarMonth {
  return calendarMonthOf(calendar, date)
}

/** 包含 `date` 的历法月的第一天。 */
export function monthStartOf(calendar: CalendarSystem, date: PlainDate): CalendarDate {
  return toCalendarDay(calendarMonthOf(calendar, date).start)
}

/** 从 `date` 所在的历法月往后数 `amount` 个月，返回那个月的第一天；`amount` 为负时往前。 */
export function addMonthStarts(calendar: CalendarSystem, date: PlainDate, amount: number): CalendarDate {
  return toCalendarDay(calendarAddMonths(calendar, calendarMonthOf(calendar, date), amount).start)
}

/** 两个日期在同一个历法月里。 */
export function isSameMonth(calendar: CalendarSystem, a: PlainDate, b: PlainDate): boolean {
  return monthStartOf(calendar, a).compare(monthStartOf(calendar, b)) === 0
}

/** `date` 落在从 `viewStart` 那个月起连续 `count` 个历法月里。 */
export function isWithinMonths(calendar: CalendarSystem, date: CalendarDate, viewStart: CalendarDate, count: number): boolean {
  return date.compare(viewStart) >= 0 && date.compare(addMonthStarts(calendar, viewStart, count)) < 0
}
