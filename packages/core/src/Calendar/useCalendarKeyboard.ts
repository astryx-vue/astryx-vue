import type { CalendarDate } from '@internationalized/date'
import type { CalendarSystem } from '../utils/calendarSystem.js'
import { calendarShiftMonths, calendarShiftYears, isInCalendarMonth } from '../utils/calendarSystem.js'
import { calendarDiffDays, weekdayIndex } from './calendarDate.js'
import { addMonthStarts, isWithinMonths, monthOf, monthStartOf, toCalendarDay } from './calendarMonths.js'
import { firstEnabledDay } from './useCalendarGrid.js'

export interface CalendarKeyTarget {
  date: CalendarDate
  /** First visible month after the move. Omitted when the target is already on screen. */
  view?: CalendarDate
}

export interface CalendarKeyInput {
  key: string
  /** Shift+Page Up / Page Down 按一年走，不带 Shift 按一个月走。月和年都按 `calendar` 数。 */
  shiftKey?: boolean
  rtl?: boolean
  focused: CalendarDate
  weekStartsOn: number
  numberOfMonths: 1 | 2
  /** 第一个可见历法月的第一天。 */
  viewStart: CalendarDate
  /** 按哪种历法分月，默认公历。 */
  calendar?: CalendarSystem
  isOutOfBounds: (date: CalendarDate) => boolean
  isDisabled: (date: CalendarDate) => boolean
}

function startOfWeek(date: CalendarDate, weekStartsOn: number): CalendarDate {
  const delta = (weekdayIndex(date) - weekStartsOn + 7) % 7
  return date.subtract({ days: delta })
}

function calendarOf(input: CalendarKeyInput): CalendarSystem {
  return input.calendar ?? 'gregory'
}

function viewFor(target: CalendarDate, input: CalendarKeyInput): CalendarDate | undefined {
  const calendar = calendarOf(input)
  if (isWithinMonths(calendar, target, input.viewStart, input.numberOfMonths))
    return undefined
  if (target.compare(input.viewStart) < 0)
    return monthStartOf(calendar, target)
  return addMonthStarts(calendar, target, -(input.numberOfMonths - 1))
}

function walk(focused: CalendarDate, step: number, input: CalendarKeyInput): CalendarDate | null {
  let candidate = focused.add({ days: step })
  while (Math.abs(calendarDiffDays(focused, candidate)) <= 366) {
    if (input.isOutOfBounds(candidate))
      return null
    if (!input.isDisabled(candidate))
      return candidate
    candidate = candidate.add({ days: step })
  }
  return null
}

function page(focused: CalendarDate, delta: number, input: CalendarKeyInput): CalendarDate | null {
  // 2 月 29 日加一年落在 2 月 28 日，和加一个月遇到没有的日子时取当月最后一天一致。
  const calendar = calendarOf(input)
  const candidate = toCalendarDay(input.shiftKey
    ? calendarShiftYears(calendar, focused, delta)
    : calendarShiftMonths(calendar, focused, delta))
  if (input.isOutOfBounds(candidate))
    return null
  if (!input.isDisabled(candidate))
    return candidate
  return firstEnabledDay(monthOf(calendar, candidate), date => input.isDisabled(date) || input.isOutOfBounds(date))
}

function weekEdge(focused: CalendarDate, edge: 'home' | 'end', input: CalendarKeyInput): CalendarDate | null {
  const start = startOfWeek(focused, input.weekStartsOn)
  const month = monthOf(calendarOf(input), focused)
  const days = Array.from({ length: 7 }, (_, index) => start.add({ days: index }))
    .filter(date => isInCalendarMonth(date, month))
    .filter(date => !input.isDisabled(date) && !input.isOutOfBounds(date))
  if (days.length === 0)
    return null
  return edge === 'home' ? days[0]! : days[days.length - 1]!
}

/** Where an arrow, Home, End, or Page key should land. Null means the focus stays put. */
export function resolveCalendarKey(input: CalendarKeyInput): CalendarKeyTarget | null {
  const { key, focused } = input
  let target: CalendarDate | null = null

  if (key === 'Home' || key === 'End') {
    target = weekEdge(focused, key === 'Home' ? 'home' : 'end', input)
  }
  else if (key === 'PageUp' || key === 'PageDown') {
    target = page(focused, key === 'PageDown' ? 1 : -1, input)
  }
  else if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
    const horizontal = key === 'ArrowLeft' || key === 'ArrowRight'
    let direction = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1
    if (input.rtl && horizontal)
      direction = -direction
    const step = horizontal ? direction : direction * 7
    target = walk(focused, step, input)
  }
  else {
    return null
  }

  if (!target || target.compare(focused) === 0)
    return null
  return { date: target, view: viewFor(target, input) }
}
