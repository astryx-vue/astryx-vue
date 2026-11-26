import { describe, expect, it } from 'vitest'
import { calendarDisplayName, formatCalendarDate, formatCalendarMonthLabel, formatCalendarMonthName } from './calendarFormat.js'
import {
  calendarAddMonths,
  calendarDateFromFields,
  calendarDayOfMonth,
  calendarMonthFromYearMonth,
  calendarMonthOf,
  calendarMonthsInCalendarYear,
  calendarShiftMonths,
  calendarShiftYears,
  calendarYearMonthOf,
  isCalendarSystem,
  isCalendarSystemAvailable,
  isGregorianAligned,
} from './calendarSystem.js'
import { plainDateAddDays, plainDateToISO } from './plainDate.js'

function pd(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  return { year: year!, month: month!, day: day! }
}

describe('calendarSystem', () => {
  it('knows the calendar identifiers and which ones follow Gregorian months', () => {
    expect(isCalendarSystem('persian')).toBe(true)
    expect(isCalendarSystem('islamic')).toBe(false)
    expect(isGregorianAligned('japanese')).toBe(true)
    expect(isGregorianAligned('hebrew')).toBe(false)
    expect(isCalendarSystemAvailable('persian')).toBe(true)
  })

  it('locates the Persian month that holds a Gregorian day', () => {
    const month = calendarMonthOf('persian', pd('2026-10-30'))
    expect(plainDateToISO(month.start)).toBe('2026-10-23')
    expect(month.length).toBe(30)
    expect(calendarYearMonthOf('persian', month)).toEqual({ year: 1405, month: 8 })
    expect(calendarDayOfMonth('persian', pd('2026-10-30'))).toBe(8)
    expect(plainDateToISO(calendarMonthFromYearMonth('persian', { year: 1405, month: 8 }).start)).toBe('2026-10-23')
  })

  it('steps months across a year boundary', () => {
    const esfand = calendarMonthFromYearMonth('persian', { year: 1404, month: 12 })
    expect(calendarYearMonthOf('persian', calendarAddMonths('persian', esfand, 1))).toEqual({ year: 1405, month: 1 })
    expect(calendarYearMonthOf('persian', calendarAddMonths('persian', esfand, -12))).toEqual({ year: 1403, month: 12 })
  })

  it('constrains a month past the end of its year to the last month', () => {
    expect(calendarYearMonthOf('persian', calendarMonthFromYearMonth('persian', { year: 1405, month: 13 }))).toEqual({ year: 1405, month: 12 })
    expect(plainDateToISO(calendarMonthFromYearMonth('gregory', { year: 2026, month: 13 }).start)).toBe('2026-12-01')
  })

  it('counts leap months in lunisolar calendars', () => {
    expect(calendarMonthsInCalendarYear('hebrew', 5784)).toBe(13)
    expect(calendarMonthsInCalendarYear('hebrew', 5785)).toBe(12)
    expect(calendarMonthsInCalendarYear('chinese', 2025)).toBe(13)
    expect(calendarMonthsInCalendarYear('chinese', 2026)).toBe(12)
  })

  it('keeps the month when shifting years, and maps a leap month to its common month', () => {
    const adarI = calendarMonthFromYearMonth('hebrew', { year: 5784, month: 6 })
    const shifted = calendarShiftYears('hebrew', adarI.start, 1)
    expect(formatCalendarMonthName('hebrew', calendarMonthOf('hebrew', shifted), 'en')).toBe('Adar')
    const nisan = calendarMonthFromYearMonth('hebrew', { year: 5784, month: 8 })
    expect(formatCalendarMonthName('hebrew', calendarMonthOf('hebrew', calendarShiftYears('hebrew', nisan.start, 1)), 'en')).toBe('Nisan')
  })

  it('clamps the day when shifting months', () => {
    const last = calendarMonthFromYearMonth('persian', { year: 1405, month: 6 }).end
    expect(calendarDayOfMonth('persian', last)).toBe(31)
    expect(calendarDayOfMonth('persian', calendarShiftMonths('persian', last, 1))).toBe(30)
  })

  it('turns calendar fields into a Gregorian date, or null when the calendar lacks the day', () => {
    expect(plainDateToISO(calendarDateFromFields('persian', { year: 1403, month: 12, day: 30 })!)).toBe('2025-03-20')
    expect(calendarDateFromFields('persian', { year: 1404, month: 12, day: 30 })).toBeNull()
    expect(calendarDateFromFields('persian', { year: 1404, month: 13, day: 1 })).toBeNull()
  })

  it('reads Hijri months', () => {
    const month = calendarMonthOf('islamic-umalqura', pd('2026-03-01'))
    expect(formatCalendarMonthLabel('islamic-umalqura', month, 'en')).toMatch(/Ramadan 1447/)
  })

  it('writes labels in the calendar and keeps Gregorian labels for a Persian locale by default', () => {
    const month = calendarMonthOf('persian', pd('2026-10-30'))
    expect(formatCalendarMonthLabel('persian', month, 'en')).toBe('Aban 1405 AP')
    expect(formatCalendarMonthLabel('gregory', calendarMonthOf('gregory', pd('2026-10-30')), 'fa-IR')).not.toMatch(/۱۴۰۵/)
    expect(formatCalendarDate('persian', pd('2026-10-30'), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }, 'en')).toBe('Friday, Aban 8, 1405 AP')
    expect(calendarDisplayName('persian', 'en')).toBe('Persian Calendar')
  })

  it('round-trips every calendar through its year, month and day numbers', () => {
    const calendars = ['persian', 'indian', 'hebrew', 'chinese', 'dangi', 'coptic', 'ethiopic', 'ethioaa', 'islamic-civil', 'islamic-tbla', 'islamic-umalqura'] as const
    for (const calendar of calendars) {
      for (let offset = 0; offset < 3650; offset += 37) {
        const day = plainDateAddDays({ year: 2020, month: 1, day: 1 }, offset)
        const month = calendarMonthOf(calendar, day)
        const numbers = calendarYearMonthOf(calendar, month)
        const back = calendarDateFromFields(calendar, { ...numbers, day: calendarDayOfMonth(calendar, day) })
        expect(back && plainDateToISO(back), `${calendar} ${plainDateToISO(day)}`).toBe(plainDateToISO(day))
      }
    }
  })

  it('names the era of the day passed in a month that changes era', () => {
    const january1989 = calendarMonthOf('japanese', pd('1989-01-15'))
    expect(formatCalendarMonthLabel('japanese', january1989, 'ja-JP', 3)).toContain('昭和64')
    expect(formatCalendarMonthLabel('japanese', january1989, 'ja-JP', 22)).toContain('平成')
  })
})
