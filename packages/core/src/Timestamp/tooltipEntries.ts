import type { AstryxLocale } from '../locale/types.js'
import type { InstantFormat } from './formatInstant.js'
import { formatInstant } from './formatInstant.js'

export type TimestampTooltipFormat = InstantFormat

export interface TimestampTooltipEntry {
  timezoneID?: string
  format?: TimestampTooltipFormat
  label?: string
  isCopyable?: boolean
}

export interface TimestampTooltipLine {
  label?: string
  value: string
  isCopyable: boolean
}

const LOCAL_ZONE = 'local'
const warned = new Set<string>()

function resolveTimezone(timezoneID: string | undefined): string | undefined {
  if (timezoneID == null || timezoneID.toLowerCase() === LOCAL_ZONE)
    return undefined
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezoneID }).format()
  }
  catch {
    if (!warned.has(timezoneID)) {
      warned.add(timezoneID)
      console.warn(`[Timestamp] unknown time zone ${JSON.stringify(timezoneID)}. Falling back to the viewer's time zone.`)
    }
    return undefined
  }
  return timezoneID
}

function zoneKey(resolved: string | undefined): string {
  return resolved == null ? LOCAL_ZONE : resolved.toLowerCase()
}

function shouldShowZoneName(format: TimestampTooltipFormat, hasMultipleZones: boolean, isNamedZone: boolean): boolean {
  if (format === 'full')
    return true
  if (format === 'date_time' || format === 'time')
    return hasMultipleZones || isNamedZone
  return false
}

export function formatTooltipLines(
  date: Date,
  entries: readonly TimestampTooltipEntry[],
  locale: AstryxLocale,
): TimestampTooltipLine[] {
  const resolved = entries.map(entry => resolveTimezone(entry.timezoneID))
  const hasMultipleZones = new Set(resolved.map(zoneKey)).size > 1
  return entries.map((entry, index) => {
    const format = entry.format ?? 'full'
    const timeZone = resolved[index]
    return {
      ...(entry.label == null ? {} : { label: entry.label }),
      isCopyable: entry.isCopyable ?? false,
      value: formatInstant(date, format, locale, {
        timeZone,
        isTimezoneShown: shouldShowZoneName(format, hasMultipleZones, timeZone != null),
      }),
    }
  })
}
