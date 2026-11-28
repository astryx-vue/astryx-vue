import type { CalendarMonth, CalendarSystem } from '../utils/calendarSystem.js'
import { calendarAddMonths, calendarMonthOf, isGregorianAligned } from '../utils/calendarSystem.js'
import { plainDateAddDays, plainDateFromDate, plainDateIsAfter, plainDateIsBefore } from '../utils/plainDate.js'

/** 没有最小最大日期时，从今天起前后各能翻这么多个月。 */
export const MONTH_REACH = 600
/** 月日跟公历不同的历法一个月一个月地数太慢，按平均月长折成天数。 */
const REACH_DAYS = Math.round(MONTH_REACH * 30.436875)

/** 底部面板能翻到的第一个和最后一个历法月。 */
export interface MonthWindow {
  readonly min: CalendarMonth
  readonly max: CalendarMonth
}

export function isMonthBefore(a: CalendarMonth, b: CalendarMonth): boolean {
  return plainDateIsBefore(a.start, b.start)
}

export function isMonthAfter(a: CalendarMonth, b: CalendarMonth): boolean {
  return plainDateIsAfter(a.start, b.start)
}

export function isMonthOutside(month: CalendarMonth, window: MonthWindow): boolean {
  return isMonthBefore(month, window.min) || isMonthAfter(month, window.max)
}

export function clampMonth(month: CalendarMonth, window: MonthWindow): CalendarMonth {
  if (isMonthBefore(month, window.min))
    return window.min
  if (isMonthAfter(month, window.max))
    return window.max
  return month
}

/** 底部面板能翻到的月份。最小和最大日期会把窗口收进去。 */
export function reachableMonths(calendar: CalendarSystem, min: Date | undefined, max: Date | undefined, today: Date): MonthWindow {
  const now = calendarMonthOf(calendar, plainDateFromDate(today))
  const reach = (direction: 1 | -1): CalendarMonth => isGregorianAligned(calendar)
    ? calendarAddMonths(calendar, now, direction * MONTH_REACH)
    : calendarMonthOf(calendar, plainDateAddDays(now.start, direction * REACH_DAYS))
  let low = reach(-1)
  let high = reach(1)
  if (min) {
    const first = calendarMonthOf(calendar, plainDateFromDate(min))
    if (isMonthAfter(first, low))
      low = first
  }
  if (max) {
    const last = calendarMonthOf(calendar, plainDateFromDate(max))
    if (isMonthBefore(last, high))
      high = last
  }
  if (isMonthAfter(low, high))
    low = high
  return { min: low, max: high }
}
