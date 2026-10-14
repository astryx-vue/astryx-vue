import { CalendarDate } from '@internationalized/date'
import { describe, expect, it } from 'vitest'
import { calendarISO, isoWeekNumber, weekStartIndex } from './calendarDate.js'
import { isCalendarDateDisabled } from './useCalendarConstraints.js'
import { buildCalendarWeeks } from './useCalendarGrid.js'
import { resolveCalendarKey } from './useCalendarKeyboard.js'

describe('calendar grid', () => {
  it('keeps six rows unless the month is allowed to shrink', () => {
    expect(buildCalendarWeeks(2026, 2, 0, false)).toHaveLength(6)
    expect(buildCalendarWeeks(2026, 2, 0, true)).toHaveLength(4)
    expect(buildCalendarWeeks(2026, 2, 0, true)[0]?.days).toHaveLength(7)
  })

  it('rotates the first column to Monday and numbers the ISO week', () => {
    const weeks = buildCalendarWeeks(2026, 1, weekStartIndex('mon'), false)
    expect(weeks[0]?.days[0]?.iso).toBe('2025-12-29')
    expect(isoWeekNumber(new CalendarDate(2026, 1, 1))).toBe(1)
    expect(calendarISO(new CalendarDate(2026, 3, 4))).toBe('2026-03-04')
  })
})

describe('calendar constraints', () => {
  it('treats a false constraint as disabled and keeps the range anchor', () => {
    const anchor = new CalendarDate(2026, 1, 10)
    const options = {
      maxRangeSpan: 3,
      minRangeSpan: 2,
      rangeAnchor: anchor,
      dateConstraints: [(date: Date) => date.getDay() !== 0],
    }
    expect(isCalendarDateDisabled(new CalendarDate(2026, 1, 4), options)).toBe(true)
    expect(isCalendarDateDisabled(anchor, options)).toBe(false)
    expect(isCalendarDateDisabled(new CalendarDate(2026, 1, 11), options)).toBe(true)
    expect(isCalendarDateDisabled(new CalendarDate(2026, 1, 12), options)).toBe(false)
    expect(isCalendarDateDisabled(new CalendarDate(2026, 1, 13), options)).toBe(true)
  })
})

describe('calendar keyboard', () => {
  it('skips a weekend and crosses into the next month', () => {
    const next = resolveCalendarKey({
      key: 'ArrowRight',
      rtl: false,
      focused: new CalendarDate(2026, 1, 30),
      weekStartsOn: 0,
      numberOfMonths: 1,
      viewYear: 2026,
      viewMonth: 1,
      isOutOfBounds: () => false,
      isDisabled: date => date.toDate('UTC').getUTCDay() === 0 || date.toDate('UTC').getUTCDay() === 6,
    })
    expect(calendarISO(next!.date)).toBe('2026-02-02')
    expect(next?.view?.month).toBe(2)
  })

  it('stays put when the next week is past the maximum', () => {
    const blocked = resolveCalendarKey({
      key: 'ArrowDown',
      rtl: false,
      focused: new CalendarDate(2026, 1, 21),
      weekStartsOn: 0,
      numberOfMonths: 1,
      viewYear: 2026,
      viewMonth: 1,
      isOutOfBounds: date => date.compare(new CalendarDate(2026, 1, 25)) > 0,
      isDisabled: () => false,
    })
    expect(blocked).toBeNull()
  })

  it('pages onto the first enabled day when the same day is disabled', () => {
    const paged = resolveCalendarKey({
      key: 'PageDown',
      rtl: false,
      focused: new CalendarDate(2026, 1, 3),
      weekStartsOn: 0,
      numberOfMonths: 1,
      viewYear: 2026,
      viewMonth: 1,
      isOutOfBounds: () => false,
      isDisabled: date => calendarISO(date) === '2026-02-03',
    })
    expect(calendarISO(paged!.date)).toBe('2026-02-01')
  })
})
