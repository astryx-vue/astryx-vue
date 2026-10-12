import { describe, expect, it } from 'vitest'
import { applyRangeClick, formatDateRange, isDayOutsideSpan, isRangeWithinSpan, spanDays } from './useDateRange.js'

describe('date range', () => {
  it('counts both endpoints and commits a same-day range when the minimum allows it', () => {
    expect(spanDays('2026-01-01', '2026-01-07')).toBe(7)
    expect(applyRangeClick(null, '2026-01-03')).toEqual({ pending: '2026-01-03', commit: null })
    expect(applyRangeClick('2026-01-03', '2026-01-03', 1)).toEqual({
      pending: null,
      commit: { start: '2026-01-03', end: '2026-01-03' },
    })
    expect(applyRangeClick('2026-01-03', '2026-01-03', 2)).toEqual({ pending: null, commit: null })
  })

  it('orders a reverse selection and rejects a span past the maximum', () => {
    expect(applyRangeClick('2026-01-10', '2026-01-04', 1, 7)).toEqual({
      pending: null,
      commit: { start: '2026-01-04', end: '2026-01-10' },
    })
    expect(applyRangeClick('2026-01-01', '2026-01-10', 1, 7)).toEqual({ pending: '2026-01-01', commit: null })
    expect(isDayOutsideSpan('2026-01-01', '2026-01-08', 1, 7)).toBe(true)
    expect(isRangeWithinSpan({ start: '2026-01-01', end: '2026-01-07' }, 2, 7)).toBe(true)
  })

  it('omits the year when both ends are in the current year', () => {
    const year = new Date().getFullYear()
    const text = formatDateRange({ start: `${year}-03-01`, end: `${year}-03-31` }, 'en')
    expect(text).toContain('Mar')
    expect(text).not.toContain(String(year))
    expect(formatDateRange({ start: '2020-01-01', end: '2020-01-02' }, 'en')).toContain('2020')
  })
})
