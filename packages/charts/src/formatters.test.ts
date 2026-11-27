import type { ChartValueFormat } from './types.js'
import { describe, expect, it } from 'vitest'
import { compactNumber, currency, monthYear, percent, shortDate } from './formatters.js'

describe('chart formatters', () => {
  it('formats numbers with the requested locale and keeps caches locale-keyed', () => {
    const en = compactNumber(1_500_000, 'en-US')
    const de = compactNumber(1_500_000, 'de-DE')

    expect(en).toBe(
      new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(1_500_000),
    )
    expect(de).toBe(
      new Intl.NumberFormat('de-DE', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(1_500_000),
    )
    expect(de).not.toBe(en)
    expect(compactNumber(1_500_000, 'en-US')).toBe(en)
  })

  it('formats currency and percentages with the requested locale', () => {
    expect(currency('€', 'de-DE')(1234.5)).toBe(
      `€${new Intl.NumberFormat('de-DE', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(1234.5)}`,
    )
    expect(percent(0.125, 'de-DE')).toBe(
      new Intl.NumberFormat('de-DE', {
        style: 'percent',
        maximumFractionDigits: 1,
      }).format(0.125),
    )
  })

  it('preserves the legacy symbol-only currency call', () => {
    expect(() => currency('€')(1234.5)).not.toThrow()
    expect(currency('€')(1234.5)).toMatch(/^€/)
  })

  it('formats dates with the requested locale', () => {
    const value = '2024-01-05'
    expect(shortDate(value, 'de-DE')).toBe(
      new Intl.DateTimeFormat('de-DE', {
        month: 'short',
        day: 'numeric',
      }).format(new Date(2024, 0, 5)),
    )
    expect(monthYear(value, 'de-DE')).toBe(
      new Intl.DateTimeFormat('de-DE', {
        month: 'short',
        year: 'numeric',
      }).format(new Date(2024, 0, 5)),
    )
    expect(shortDate(value, 'de-DE')).not.toBe(shortDate(value, 'en-US'))
  })

  it('writes dates in a calendar the caller passes', () => {
    const value = '2026-08-22'
    const date = new Date(2026, 7, 22)
    expect(shortDate(value, 'en-US', 'persian')).toBe(
      new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', calendar: 'persian' }).format(date),
    )
    expect(monthYear(value, 'en-US', 'persian')).toBe(
      new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', calendar: 'persian' }).format(date),
    )
    expect(shortDate(value, 'en-US', 'persian')).not.toBe(shortDate(value, 'en-US'))
  })

  it('keeps Gregorian dates for locales that default to another calendar', () => {
    const value = '2026-08-22'
    const date = new Date(2026, 7, 22)
    expect(shortDate(value, 'fa-IR')).toBe(
      new Intl.DateTimeFormat('fa-IR', {
        month: 'short',
        day: 'numeric',
        calendar: 'gregory',
      }).format(date),
    )
    expect(monthYear(value, 'th-TH')).toBe(
      new Intl.DateTimeFormat('th-TH', {
        month: 'short',
        year: 'numeric',
        calendar: 'gregory',
      }).format(date),
    )
  })

  it('passes through non-finite and unparseable values', () => {
    expect(compactNumber(Number.POSITIVE_INFINITY, 'en-US')).toBe('Infinity')
    expect(percent('not-a-number', 'en-US')).toBe('not-a-number')
    expect(shortDate('not-a-date', 'en-US')).toBe('not-a-date')
  })

  it('returns undefined for null and undefined so the chart can fall back to its default text', () => {
    expect(compactNumber(null, 'en-US')).toBeUndefined()
    expect(compactNumber(undefined, 'en-US')).toBeUndefined()
    expect(currency('$')(null)).toBeUndefined()
    expect(percent(undefined, 'en-US')).toBeUndefined()
    expect(shortDate(null, 'en-US')).toBeUndefined()
    expect(monthYear(undefined, 'en-US')).toBeUndefined()
    // 0 是有值的，照常格式化。
    expect(compactNumber(0, 'en-US')).toBe('0')
    expect(percent(0, 'en-US')).toBe('0%')
    expect(currency('$')(0)).toBe('$0')
  })

  it('currency takes a call-time locale, and a factory locale wins over it', () => {
    const callTime = currency('€')(1234.5, 'de-DE')
    expect(callTime).toBe(currency('€', 'de-DE')(1234.5))
    expect(currency('€', 'en-US')(1234.5, 'de-DE')).toBe(currency('€', 'en-US')(1234.5))
  })

  it('built-in formatters are assignable to ChartValueFormat', () => {
    const formats: ChartValueFormat[] = [compactNumber, percent, shortDate, monthYear, currency('$')]
    expect(formats.map(format => format(null, 'en-US', 'gregory'))).toEqual([undefined, undefined, undefined, undefined, undefined])
  })
})
