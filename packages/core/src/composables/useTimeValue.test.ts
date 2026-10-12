import { describe, expect, it } from 'vitest'
import { formatDisplayTime, isTimeInRange, parseDisplayTime, resolveTimeSurface, shiftTime } from './useTimeValue.js'

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
  })
})
