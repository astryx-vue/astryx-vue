import type { CalendarDate } from '@internationalized/date'
import { CalendarDate as CalendarDay } from '@internationalized/date'
import { calendarDiffDays, monthIndex, shiftMonth, weekdayIndex } from './calendarDate.js'
import { firstEnabledDay } from './useCalendarGrid.js'

export interface CalendarKeyTarget {
  date: CalendarDate
  /** First visible month after the move. Omitted when the target is already on screen. */
  view?: CalendarDate
}

export interface CalendarKeyInput {
  key: string
  rtl?: boolean
  focused: CalendarDate
  weekStartsOn: number
  numberOfMonths: 1 | 2
  viewYear: number
  viewMonth: number
  isOutOfBounds: (date: CalendarDate) => boolean
  isDisabled: (date: CalendarDate) => boolean
}

function startOfWeek(date: CalendarDate, weekStartsOn: number): CalendarDate {
  const delta = (weekdayIndex(date) - weekStartsOn + 7) % 7
  return date.subtract({ days: delta })
}

function viewFor(target: CalendarDate, input: CalendarKeyInput): CalendarDate | undefined {
  const targetMonth = monthIndex(target)
  const first = input.viewYear * 12 + input.viewMonth
  const last = first + input.numberOfMonths - 1
  if (targetMonth >= first && targetMonth <= last)
    return undefined
  if (targetMonth < first)
    return new CalendarDay(target.year, target.month, 1)
  return shiftMonth({ year: target.year, month: target.month }, -(input.numberOfMonths - 1))
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
  const candidate = focused.add({ months: delta })
  if (input.isOutOfBounds(candidate))
    return null
  if (!input.isDisabled(candidate))
    return candidate
  return firstEnabledDay(candidate.year, candidate.month, date => input.isDisabled(date) || input.isOutOfBounds(date))
}

function weekEdge(focused: CalendarDate, edge: 'home' | 'end', input: CalendarKeyInput): CalendarDate | null {
  const start = startOfWeek(focused, input.weekStartsOn)
  const days = Array.from({ length: 7 }, (_, index) => start.add({ days: index }))
    .filter(date => date.year === focused.year && date.month === focused.month)
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
