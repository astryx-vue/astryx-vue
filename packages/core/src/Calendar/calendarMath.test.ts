import { CalendarDate } from '@internationalized/date'
import { describe, expect, it } from 'vitest'
import { calendarISO, initialCalendarFocus, isoWeekNumber, weekStartIndex } from './calendarDate.js'
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

describe('week numbers', () => {
  it('numbers each row by the ISO week of its Thursday, whatever the week start', () => {
    for (const start of [0, 1, 6]) {
      const numbers = buildCalendarWeeks(2026, 10, start, false).map(week => week.number)
      expect(numbers).toEqual([40, 41, 42, 43, 44, 45])
    }
  })
})

describe('initial calendar focus with two months', () => {
  const key = (date: CalendarDate) => `${date.year}-${date.month}`

  it('keeps max in the last pane when today is in the month of max', () => {
    const focus = initialCalendarFocus({ numberOfMonths: 2, max: new Date(2026, 7, 21), today: new Date(2026, 7, 21) })
    expect(key(focus)).toBe('2026-7')
  })

  it('keeps max in the last pane when the selection is in the month of max', () => {
    const focus = initialCalendarFocus({ numberOfMonths: 2, rangeStart: new Date(2026, 5, 2), max: new Date(2026, 5, 30) })
    expect(key(focus)).toBe('2026-5')
  })

  it('never goes before the month of min, and leaves a single month alone', () => {
    const tight = initialCalendarFocus({ numberOfMonths: 2, selected: new Date(2026, 5, 15), min: new Date(2026, 5, 10), max: new Date(2026, 5, 30) })
    expect(tight.compare(new CalendarDate(2026, 6, 15))).toBe(0)
    const single = initialCalendarFocus({ numberOfMonths: 1, selected: new Date(2026, 5, 15), max: new Date(2026, 5, 30) })
    expect(key(single)).toBe('2026-6')
  })

  it('shows a selection past max without shifting it', () => {
    const focus = initialCalendarFocus({ numberOfMonths: 2, selected: new Date(2026, 8, 3), max: new Date(2026, 5, 30) })
    expect(key(focus)).toBe('2026-9')
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
      viewStart: new CalendarDate(2026, 1, 1),
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
      viewStart: new CalendarDate(2026, 1, 1),
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
      viewStart: new CalendarDate(2026, 1, 1),
      isOutOfBounds: () => false,
      isDisabled: date => calendarISO(date) === '2026-02-03',
    })
    expect(calendarISO(paged!.date)).toBe('2026-02-01')
  })
})
