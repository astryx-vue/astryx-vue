import { describe, expect, it } from 'vitest'
import { parseTimeInput } from '../utils/timeParser.js'
import { formatDisplayTime, formatISOTime, isTimeInRange, parseDisplayTime, parseISOTime, resolveTimeSurface, shiftTime } from './useTimeValue.js'

describe('time value', () => {
  it('formats 12-hour and 24-hour text', () => {
    expect(formatDisplayTime('00:00', '12h', false)).toBe('12:00 AM')
    expect(formatDisplayTime('12:00', '12h', false)).toBe('12:00 PM')
    expect(formatDisplayTime('14:30', '12h', false)).toBe('2:30 PM')
    expect(formatDisplayTime('14:30:45', '24h', true)).toBe('14:30:45')
  })

  it('parses typed times back to ISO', () => {
    expect(parseDisplayTime('2:30 PM', false)).toBe('14:30')
    expect(parseDisplayTime('12:05 am', false)).toBe('00:05')
    expect(parseDisplayTime('09:15', true)).toBe('09:15:00')
    expect(parseDisplayTime('1430', false)).toBe('14:30')
    expect(parseDisplayTime('25:00', false)).toBeNull()
  })

  it('steps by the given minute increment and rejects times outside min and max', () => {
    expect(shiftTime('09:00', 15, false)).toBe('09:15')
    expect(shiftTime('00:05', -15, false)).toBe('23:50')
    expect(isTimeInRange('17:00', '17:00', '22:00')).toBe(true)
    expect(isTimeInRange('16:59', '17:00', '22:00')).toBe(false)
    expect(isTimeInRange('22:01', '17:00', '22:00')).toBe(false)
  })

  it('keeps a typed field when seconds or a custom increment cannot be expressed by the platform picker', () => {
    expect(resolveTimeSurface({ coarse: true, hasSeconds: true, increment: 1 })).toBe('text')
    expect(resolveTimeSurface({ coarse: true, hasSeconds: false, increment: 15 })).toBe('text')
    expect(resolveTimeSurface({ coarse: true, hasSeconds: false, increment: 1 })).toBe('native')
    expect(resolveTimeSurface({ coarse: false, hasSeconds: false, increment: 1, presentation: 'native' })).toBe('native')
    expect(resolveTimeSurface({ coarse: true, hasSeconds: false, increment: 1, presentation: 'text-input' })).toBe('text')
    expect(resolveTimeSurface({ coarse: false, hasSeconds: false, increment: 1, presentation: 'bottom-sheet' })).toBe('sheet')
    expect(resolveTimeSurface({ coarse: true, hasSeconds: true, increment: 1, presentation: 'bottom-sheet' })).toBe('sheet')
    expect(resolveTimeSurface({ coarse: false, hasSeconds: false, increment: 1, presentation: 'adaptive-bottom-sheet' })).toBe('text')
    expect(resolveTimeSurface({ coarse: true, hasSeconds: false, increment: 1, presentation: 'adaptive-bottom-sheet' })).toBe('sheet')
    expect(resolveTimeSurface({ coarse: true, hasSeconds: false, increment: 1, nativePicker: 'never' })).toBe('text')
  })

  it('keeps the field-strict spellings that the shared parser would also accept', () => {
    // 字段只收两位时分的 ISO 写法和带上下午的写法；共用解析器更宽松，字段在它前面把关。
    for (const text of ['9', '9:5', '9:30', '2530', '0am', '13:00 pm', '1:60 pm', '12:30:15:00', 'noon', '']) {
      expect(parseDisplayTime(text, false)).toBeNull()
    }
    expect(parseTimeInput('9', false)).toBe('09:00')
    expect(parseISOTime('9:30')).toBeNull()
    expect(parseISOTime(' 09:30:05 ')).toEqual({ hours: 9, minutes: 30, seconds: 5 })
    expect(formatISOTime({ hours: 9, minutes: 5, seconds: 7 }, true)).toBe('09:05:07')
    expect(formatISOTime({ hours: 9, minutes: 5, seconds: 7 }, false)).toBe('09:05')
  })

  it('reads dotted day periods and compact forms the same as the shared parser', () => {
    expect(parseDisplayTime('2:30 p.m.', false)).toBe('14:30')
    expect(parseDisplayTime('12 a.m', false)).toBe('00:00')
    expect(parseDisplayTime('143000', false)).toBe('14:30')
    expect(parseDisplayTime('143000', true)).toBe('14:30:00')
    expect(parseDisplayTime('2:30:15 pm', true)).toBe('14:30:15')
    for (const text of ['2:30 PM', '09:15', '1430', '12:05 am', '7pm']) {
      expect(parseDisplayTime(text, true)).toBe(parseTimeInput(text, true))
    }
  })

  it('shows invalid times untouched and starts a step from midnight', () => {
    expect(formatDisplayTime('soon', '12h', false)).toBe('soon')
    expect(formatDisplayTime('9:30', '24h', false)).toBe('9:30')
    expect(formatDisplayTime('09:30:15', '12h', true)).toBe('9:30:15 AM')
    expect(formatDisplayTime('23:05', '12h', false)).toBe('11:05 PM')
    expect(shiftTime('soon', 90, false)).toBe('01:30')
    expect(shiftTime('23:50:20', 20, true)).toBe('00:10:20')
    expect(shiftTime('00:00', -1, false)).toBe('23:59')
  })
})
