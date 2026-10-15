export type InstantFormat
  = | 'date'
    | 'date_long'
    | 'date_weekday'
    | 'date_time'
    | 'time'
    | 'system_date'
    | 'system_date_time'
    | 'system_time'
    | 'unix_seconds'
    | 'full'

export interface FormatInstantOptions {
  timeZone?: string
  isTimezoneShown?: boolean
  timeZoneNameStyle?: 'short' | 'long'
}

const DATE_SHORT: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
const DATE_LONG: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
const DATE_WEEKDAY: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
const TIME: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' }
const DATE_TIME: Intl.DateTimeFormatOptions = { ...DATE_SHORT, ...TIME }
const FULL: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'short',
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

interface WallClock {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

function wallClock(date: Date, timeZone: string | undefined): WallClock {
  if (timeZone == null) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
    }
  }
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date)
  const read = (type: Intl.DateTimeFormatPartTypes): number => Number(parts.find(part => part.type === type)?.value ?? 0)
  return {
    year: read('year'),
    month: read('month'),
    day: read('day'),
    hour: read('hour'),
    minute: read('minute'),
    second: read('second'),
  }
}

export function formatInstant(
  date: Date,
  format: InstantFormat,
  locale: string,
  { timeZone, isTimezoneShown = false, timeZoneNameStyle = 'short' }: FormatInstantOptions = {},
): string {
  const zone = timeZone == null ? {} : { timeZone }
  const zoneName = isTimezoneShown ? { timeZoneName: 'short' as const } : {}

  switch (format) {
    case 'full':
      return new Intl.DateTimeFormat(locale, {
        ...FULL,
        timeZoneName: timeZoneNameStyle,
        ...zone,
        calendar: 'gregory',
      }).format(date)
    case 'date':
      return new Intl.DateTimeFormat(locale, { ...DATE_SHORT, ...zone, calendar: 'gregory' }).format(date)
    case 'date_long':
      return new Intl.DateTimeFormat(locale, { ...DATE_LONG, ...zone, calendar: 'gregory' }).format(date)
    case 'date_weekday':
      return new Intl.DateTimeFormat(locale, { ...DATE_WEEKDAY, ...zone, calendar: 'gregory' }).format(date)
    case 'date_time':
      return new Intl.DateTimeFormat(locale, { ...DATE_TIME, ...zoneName, ...zone, calendar: 'gregory' }).format(date)
    case 'time':
      return new Intl.DateTimeFormat(locale, { ...TIME, ...zoneName, ...zone }).format(date)
    case 'system_date': {
      const clock = wallClock(date, timeZone)
      return `${clock.year}-${pad(clock.month)}-${pad(clock.day)}`
    }
    case 'system_date_time': {
      const clock = wallClock(date, timeZone)
      return `${clock.year}-${pad(clock.month)}-${pad(clock.day)} ${pad(clock.hour)}:${pad(clock.minute)}:${pad(clock.second)}`
    }
    case 'system_time': {
      const clock = wallClock(date, timeZone)
      return `${pad(clock.hour)}:${pad(clock.minute)}:${pad(clock.second)}`
    }
    case 'unix_seconds':
      return String(Math.floor(date.getTime() / 1000))
  }
}
