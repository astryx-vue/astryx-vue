import type { ISOTimeString } from './timeParser.js'
import { describe, expect, it } from 'vitest'
import {
  adjustTime,
  clampTime,
  compareTime,
  createISOTimeString,
  formatDisplayTime12h,
  formatDisplayTime24h,
  formatISOTime,

  isTimeInRange,
  parseISOTime,
  parseTimeInput,
} from './timeParser.js'

describe('parseISOTime', () => {
  it('parses HH:MM format', () => {
    expect(parseISOTime('14:30')).toEqual({ hour: 14, minute: 30, second: 0 })
    expect(parseISOTime('00:00')).toEqual({ hour: 0, minute: 0, second: 0 })
    expect(parseISOTime('23:59')).toEqual({ hour: 23, minute: 59, second: 0 })
  })

  it('parses HH:MM:SS format', () => {
    expect(parseISOTime('14:30:45')).toEqual({
      hour: 14,
      minute: 30,
      second: 45,
    })
    expect(parseISOTime('00:00:00')).toEqual({ hour: 0, minute: 0, second: 0 })
    expect(parseISOTime('23:59:59')).toEqual({
      hour: 23,
      minute: 59,
      second: 59,
    })
  })

  it('returns null for invalid formats', () => {
    expect(parseISOTime('')).toBeNull()
    expect(parseISOTime('14')).toBeNull()
    expect(parseISOTime('14:30:45:00')).toBeNull()
    expect(parseISOTime('25:00')).toBeNull()
    expect(parseISOTime('14:60')).toBeNull()
    expect(parseISOTime('14:30:60')).toBeNull()
    expect(parseISOTime('abc')).toBeNull()
  })
})

describe('formatISOTime', () => {
  it('formats without seconds', () => {
    expect(formatISOTime({ hour: 14, minute: 30, second: 0 })).toBe('14:30')
    expect(formatISOTime({ hour: 0, minute: 0, second: 0 })).toBe('00:00')
    expect(formatISOTime({ hour: 9, minute: 5, second: 0 })).toBe('09:05')
  })

  it('formats with seconds', () => {
    expect(formatISOTime({ hour: 14, minute: 30, second: 45 }, true)).toBe(
      '14:30:45',
    )
    expect(formatISOTime({ hour: 0, minute: 0, second: 0 }, true)).toBe(
      '00:00:00',
    )
    expect(formatISOTime({ hour: 9, minute: 5, second: 3 }, true)).toBe(
      '09:05:03',
    )
  })
})

describe('formatDisplayTime12h', () => {
  it('formats AM times', () => {
    expect(formatDisplayTime12h('00:00' as ISOTimeString)).toBe('12:00 AM')
    expect(formatDisplayTime12h('01:30' as ISOTimeString)).toBe('1:30 AM')
    expect(formatDisplayTime12h('11:59' as ISOTimeString)).toBe('11:59 AM')
  })

  it('formats PM times', () => {
    expect(formatDisplayTime12h('12:00' as ISOTimeString)).toBe('12:00 PM')
    expect(formatDisplayTime12h('13:30' as ISOTimeString)).toBe('1:30 PM')
    expect(formatDisplayTime12h('23:59' as ISOTimeString)).toBe('11:59 PM')
  })

  it('formats with seconds', () => {
    expect(formatDisplayTime12h('14:30:45' as ISOTimeString, true)).toBe(
      '2:30:45 PM',
    )
  })

  it('handles undefined', () => {
    expect(formatDisplayTime12h(undefined)).toBe('')
  })
})

describe('formatDisplayTime24h', () => {
  it('formats times', () => {
    expect(formatDisplayTime24h('00:00' as ISOTimeString)).toBe('00:00')
    expect(formatDisplayTime24h('14:30' as ISOTimeString)).toBe('14:30')
    expect(formatDisplayTime24h('23:59' as ISOTimeString)).toBe('23:59')
  })

  it('formats with seconds', () => {
    expect(formatDisplayTime24h('14:30:45' as ISOTimeString, true)).toBe(
      '14:30:45',
    )
  })

  it('handles undefined', () => {
    expect(formatDisplayTime24h(undefined)).toBe('')
  })
})

describe('parseTimeInput', () => {
  it('parses 12-hour format with AM/PM', () => {
    expect(parseTimeInput('2:30 PM')).toBe('14:30')
    expect(parseTimeInput('2:30pm')).toBe('14:30')
    expect(parseTimeInput('2:30 pm')).toBe('14:30')
    expect(parseTimeInput('12:00 AM')).toBe('00:00')
    expect(parseTimeInput('12:00 PM')).toBe('12:00')
    expect(parseTimeInput('11:59 PM')).toBe('23:59')
  })

  it('parses 24-hour format', () => {
    expect(parseTimeInput('14:30')).toBe('14:30')
    expect(parseTimeInput('00:00')).toBe('00:00')
    expect(parseTimeInput('23:59')).toBe('23:59')
  })

  it('parses compact formats', () => {
    expect(parseTimeInput('1430')).toBe('14:30')
    expect(parseTimeInput('0000')).toBe('00:00')
    expect(parseTimeInput('0230pm')).toBe('14:30')
    expect(parseTimeInput('1230am')).toBe('00:30')
    expect(parseTimeInput('023045pm', true)).toBe('14:30:45')
  })

  it('parses hour-only with meridiem', () => {
    expect(parseTimeInput('2pm')).toBe('14:00')
    expect(parseTimeInput('2 PM')).toBe('14:00')
    expect(parseTimeInput('12am')).toBe('00:00')
    expect(parseTimeInput('12pm')).toBe('12:00')
  })

  it('parses dotted meridiems (a.m./p.m.)', () => {
    expect(parseTimeInput('2:30 p.m.')).toBe('14:30')
    expect(parseTimeInput('2:30 P.M.')).toBe('14:30')
    expect(parseTimeInput('2:30 p.m')).toBe('14:30')
    expect(parseTimeInput('12 a.m.')).toBe('00:00')
    expect(parseTimeInput('12 p.m.')).toBe('12:00')
    expect(parseTimeInput('2 p.m.')).toBe('14:00')
  })

  it('returns null for invalid input', () => {
    expect(parseTimeInput('')).toBeNull()
    expect(parseTimeInput('abc')).toBeNull()
    expect(parseTimeInput('25:00')).toBeNull()
    expect(parseTimeInput('13:00 PM')).toBeNull() // 13 is invalid in 12h format
    expect(parseTimeInput('13:00 p.m.')).toBeNull() // dotted variant rejected too
  })
})

describe('compareTime', () => {
  it('compares times correctly', () => {
    expect(
      compareTime('14:30' as ISOTimeString, '14:30' as ISOTimeString),
    ).toBe(0)
    expect(
      compareTime('14:30' as ISOTimeString, '14:31' as ISOTimeString),
    ).toBeLessThan(0)
    expect(
      compareTime('14:31' as ISOTimeString, '14:30' as ISOTimeString),
    ).toBeGreaterThan(0)
    expect(
      compareTime('00:00' as ISOTimeString, '23:59' as ISOTimeString),
    ).toBeLessThan(0)
  })

  it('handles undefined', () => {
    expect(compareTime(undefined, undefined)).toBe(0)
    expect(compareTime('14:30' as ISOTimeString, undefined)).toBeGreaterThan(0)
    expect(compareTime(undefined, '14:30' as ISOTimeString)).toBeLessThan(0)
  })
})

describe('isTimeInRange', () => {
  it('returns true when in range', () => {
    expect(
      isTimeInRange(
        '14:30' as ISOTimeString,
        '09:00' as ISOTimeString,
        '18:00' as ISOTimeString,
      ),
    ).toBe(true)
    expect(
      isTimeInRange(
        '09:00' as ISOTimeString,
        '09:00' as ISOTimeString,
        '18:00' as ISOTimeString,
      ),
    ).toBe(true)
    expect(
      isTimeInRange(
        '18:00' as ISOTimeString,
        '09:00' as ISOTimeString,
        '18:00' as ISOTimeString,
      ),
    ).toBe(true)
  })

  it('returns false when out of range', () => {
    expect(
      isTimeInRange(
        '08:59' as ISOTimeString,
        '09:00' as ISOTimeString,
        '18:00' as ISOTimeString,
      ),
    ).toBe(false)
    expect(
      isTimeInRange(
        '18:01' as ISOTimeString,
        '09:00' as ISOTimeString,
        '18:00' as ISOTimeString,
      ),
    ).toBe(false)
  })

  it('handles undefined min/max', () => {
    expect(isTimeInRange('14:30' as ISOTimeString, undefined, undefined)).toBe(
      true,
    )
    expect(
      isTimeInRange(
        '14:30' as ISOTimeString,
        '09:00' as ISOTimeString,
        undefined,
      ),
    ).toBe(true)
    expect(
      isTimeInRange(
        '14:30' as ISOTimeString,
        undefined,
        '18:00' as ISOTimeString,
      ),
    ).toBe(true)
  })
})

describe('adjustTime', () => {
  it('returns the input unchanged for non-finite deltas', () => {
    // -Infinity previously spun the wrap-around loop forever;
    // NaN previously produced the corrupt string "NaN:NaN".
    expect(adjustTime('10:00' as ISOTimeString, -Infinity)).toBe('10:00')
    expect(adjustTime('10:00' as ISOTimeString, Infinity)).toBe('10:00')
    expect(adjustTime('10:00' as ISOTimeString, NaN)).toBe('10:00')
  })

  it('wraps large negative deltas in constant time', () => {
    expect(adjustTime('10:00' as ISOTimeString, -1440 * 1e7)).toBe('10:00')
    expect(adjustTime('10:00' as ISOTimeString, -1440 * 1e7 - 30)).toBe(
      '09:30',
    )
  })

  it('adds minutes', () => {
    expect(adjustTime('14:30' as ISOTimeString, 15)).toBe('14:45')
    expect(adjustTime('14:30' as ISOTimeString, 30)).toBe('15:00')
  })

  it('subtracts minutes', () => {
    expect(adjustTime('14:30' as ISOTimeString, -15)).toBe('14:15')
    expect(adjustTime('14:30' as ISOTimeString, -30)).toBe('14:00')
  })

  it('wraps around midnight', () => {
    expect(adjustTime('23:30' as ISOTimeString, 60)).toBe('00:30')
    expect(adjustTime('00:30' as ISOTimeString, -60)).toBe('23:30')
  })
})

describe('adjustTime whole minutes', () => {
  it('returns the input unchanged for a fractional delta', () => {
    // `deltaMinutes` 是分钟数；小数写不回 `HH:MM`，原样返回而不是产出 "30.5"。
    expect(adjustTime('10:30' as ISOTimeString, 0.5)).toBe('10:30')
    expect(adjustTime('10:30:45' as ISOTimeString, -0.5, true)).toBe('10:30:45')
  })
})

describe('createISOTimeString', () => {
  it('normalizes a valid time', () => {
    expect(createISOTimeString('14:30')).toBe('14:30')
    expect(createISOTimeString('9:05')).toBe('09:05')
    expect(createISOTimeString('14:30:45')).toBe('14:30:45')
  })

  it('accepts surrounding whitespace and drops a seconds fraction', () => {
    expect(createISOTimeString(' 14:30 ')).toBe('14:30')
    expect(createISOTimeString('14:30:15.250')).toBe('14:30:15')
  })

  it('rejects a 12-hour time instead of reading it 12 hours off', () => {
    expect(createISOTimeString('2:30 PM')).toBeNull()
    expect(createISOTimeString('2:30pm')).toBeNull()
  })

  it('rejects a field with anything but one or two digits', () => {
    for (const text of ['14:30abc', '14.9:30', '1e1:30', '14:30:00Z', '14:30.5', '014:30']) {
      expect(createISOTimeString(text)).toBeNull()
    }
  })

  it('answers null for a value that is not a string, or out of range', () => {
    expect(createISOTimeString(undefined as unknown as string)).toBeNull()
    expect(createISOTimeString(null as unknown as string)).toBeNull()
    expect(createISOTimeString('24:00')).toBeNull()
    expect(createISOTimeString('14:60')).toBeNull()
  })
})

describe('clampTime', () => {
  const t = (value: string) => value as ISOTimeString

  it('brings a time outside the bounds onto the bound', () => {
    expect(clampTime(t('08:00'), t('09:00'))).toBe('09:00')
    expect(clampTime(t('18:00'), undefined, t('17:00'))).toBe('17:00')
    expect(clampTime(t('12:00'), t('09:00'), t('17:00'))).toBe('12:00')
  })

  it('keeps a bound with seconds when the time shows seconds', () => {
    expect(clampTime(t('08:00:00'), t('09:00:30'), undefined, true)).toBe('09:00:30')
  })

  it('without seconds, gives the nearest whole minute inside a bound between minutes', () => {
    expect(clampTime(t('08:00'), t('09:00:30'))).toBe('09:01')
    expect(clampTime(t('18:00'), undefined, t('17:00:30'))).toBe('17:00')
  })

  it('keeps the bound itself when no whole minute lies inside the range', () => {
    expect(clampTime(t('12:00'), t('23:59:30'))).toBe('23:59:30')
    expect(clampTime(t('09:00:00'), t('10:00:10'), t('10:00:40'))).toBe('10:00:10')
    expect(clampTime(t('23:59'), t('08:00:10'), t('08:00:30'))).toBe('08:00:30')
  })
})
