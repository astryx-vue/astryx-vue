import type { CalendarDate } from '@internationalized/date'
import { calendarDiffDays, fromCalendarDate, toCalendarDate } from './calendarDate.js'

export interface CalendarConstraintInput {
  min?: Date
  max?: Date
  /** Return true to disable the day. Kept alongside the constraint list. */
  isDateDisabled?: (date: Date) => boolean
  /** A day is disabled when any function returns false. */
  dateConstraints?: ReadonlyArray<(date: Date) => boolean>
  minRangeSpan?: number
  maxRangeSpan?: number
  rangeAnchor?: CalendarDate | null
}

/**
 * Bounds, custom constraints, and an in-progress range span.
 * Span counts both endpoints, so a max of 7 reaches six days either side of the anchor.
 * The anchor itself stays enabled so the start can be moved or cancelled.
 */
export function isCalendarDateDisabled(date: CalendarDate, input: CalendarConstraintInput): boolean {
  const min = input.min ? toCalendarDate(input.min) : null
  const max = input.max ? toCalendarDate(input.max) : null
  if (min && date.compare(min) < 0)
    return true
  if (max && date.compare(max) > 0)
    return true

  const anchor = input.rangeAnchor
  if (anchor) {
    const distance = Math.abs(calendarDiffDays(anchor, date))
    if (input.maxRangeSpan != null && distance > input.maxRangeSpan - 1)
      return true
    if (input.minRangeSpan != null && distance > 0 && distance < input.minRangeSpan - 1)
      return true
  }

  const jsDate = fromCalendarDate(date)
  if (input.isDateDisabled?.(jsDate))
    return true
  if (input.dateConstraints?.some(constraint => !constraint(jsDate)))
    return true
  return false
}

export function isOutsideCalendarBounds(date: CalendarDate, min?: Date, max?: Date): boolean {
  const earliest = min ? toCalendarDate(min) : null
  const latest = max ? toCalendarDate(max) : null
  if (earliest && date.compare(earliest) < 0)
    return true
  if (latest && date.compare(latest) > 0)
    return true
  return false
}
