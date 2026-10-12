import type { AstryxLocale } from '../locale/types.js'

const MINUTE = 60
const HOUR = 3600
const DAY = 86400
const MONTH = 30 * DAY
const YEAR = 365 * DAY
const FUTURE_SKEW_TOLERANCE = 30

type RelativeTimeStyle = 'long' | 'narrow'
type RelativeTimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year'

const formatters = new Map<string, Intl.RelativeTimeFormat>()

function formatter(locale: AstryxLocale, style: RelativeTimeStyle, numeric: Intl.RelativeTimeFormatNumeric): Intl.RelativeTimeFormat {
  const key = JSON.stringify([locale, style, numeric])
  let value = formatters.get(key)
  if (value == null) {
    value = new Intl.RelativeTimeFormat(locale, { numeric, style })
    formatters.set(key, value)
  }
  return value
}

export function formatRelativeTime(date: Date, now: Date, locale: AstryxLocale, style: RelativeTimeStyle): string {
  const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000)
  const absDiff = Math.abs(diffSeconds)

  if (absDiff < 10 || (diffSeconds < 0 && absDiff <= FUTURE_SKEW_TOLERANCE))
    return formatter(locale, style, 'auto').format(0, 'second')

  let count: number
  let unit: RelativeTimeUnit
  if (absDiff < MINUTE) {
    count = absDiff
    unit = 'second'
  }
  else if (absDiff < HOUR) {
    count = Math.floor(absDiff / MINUTE)
    unit = 'minute'
  }
  else if (absDiff < DAY) {
    count = Math.floor(absDiff / HOUR)
    unit = 'hour'
  }
  else if (absDiff < MONTH) {
    count = Math.floor(absDiff / DAY)
    unit = 'day'
  }
  else if (absDiff < YEAR) {
    count = Math.floor(absDiff / MONTH)
    unit = 'month'
  }
  else {
    count = Math.floor(absDiff / YEAR)
    unit = 'year'
  }

  const value = diffSeconds < 0 ? count : -count
  const numeric = style === 'long' && unit === 'day' && value === -1 ? 'auto' : 'always'
  return formatter(locale, style, numeric).format(value, unit)
}
