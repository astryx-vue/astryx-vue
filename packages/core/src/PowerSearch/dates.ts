import type { DateTimeRange, DateTimeRangePart } from './types.js'
import { resolveDateTimeRangePart } from './range.js'

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function unixToIsoDate(unixSeconds: number, timeZone?: string): string {
  const date = new Date(unixSeconds * 1000)
  if (!timeZone) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  }
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const year = parts.find(part => part.type === 'year')?.value ?? '1970'
  const month = parts.find(part => part.type === 'month')?.value ?? '01'
  const day = parts.find(part => part.type === 'day')?.value ?? '01'
  return `${year}-${month}-${day}`
}

export function unixToDateTimeLocal(unixSeconds: number, timeZone?: string): string {
  const date = new Date(unixSeconds * 1000)
  if (!timeZone) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const read = (type: string): string => parts.find(part => part.type === type)?.value ?? '00'
  return `${read('year')}-${read('month')}-${read('day')}T${read('hour')}:${read('minute')}`
}

export function isoDateToUnix(value: string): number {
  const [year, month, day] = value.split('-').map(Number)
  return Math.floor(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1) / 1000)
}

export function dateTimeLocalToUnix(value: string, timeZone?: string): number {
  if (!timeZone)
    return Math.floor(new Date(value).getTime() / 1000)
  const [datePart, timePart] = value.split('T')
  const [year, month, day] = (datePart ?? '').split('-').map(Number)
  const [hour, minute] = (timePart ?? '00:00').split(':').map(Number)
  const utcGuess = Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1, hour ?? 0, minute ?? 0)
  const offset = timeZoneOffset(new Date(utcGuess), timeZone)
  return Math.floor((utcGuess - offset) / 1000)
}

function timeZoneOffset(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const read = (type: string): number => Number(parts.find(part => part.type === type)?.value ?? 0)
  const asUtc = Date.UTC(read('year'), read('month') - 1, read('day'), read('hour'), read('minute'), read('second'))
  return asUtc - date.getTime()
}

export function rangePartToIso(part: DateTimeRangePart, timeZone?: string, nowSeconds = Date.now() / 1000): string {
  return unixToIsoDate(resolveDateTimeRangePart(part, nowSeconds), timeZone)
}

export function absoluteRange(start: string, end: string): DateTimeRange {
  return {
    start: { type: 'ABSOLUTE', unixSeconds: isoDateToUnix(start) },
    end: { type: 'ABSOLUTE', unixSeconds: isoDateToUnix(end) + 86399 },
  }
}
