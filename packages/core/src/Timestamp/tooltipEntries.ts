import type { InstantFormat } from './formatInstant.js'
import { devWarn } from '../composables/useDevWarning.js'
import { formatInstant } from './formatInstant.js'

export type TimestampTooltipFormat = InstantFormat

export interface TimestampTooltipEntry {
  /**
   * IANA 时区，如 `'UTC'`、`'America/Los_Angeles'`。不写就跟随 Timestamp 的 `timezoneID`，
   * 它也没写就是观看者自己的时区；写 `'local'` 永远是观看者的时区。
   */
  timezoneID?: string
  format?: TimestampTooltipFormat
  label?: string
  isCopyable?: boolean
}

export interface TimestampTooltipLine {
  label?: string
  value: string
  isCopyable: boolean
  /** 这一行时区的完整名字。没有标签的行靠它在描述列表里有名字。 */
  zoneName?: string
}

const LOCAL_ZONE = 'local'
const warned = new Set<string>()

/**
 * 把时区交给 `Intl` 之前先确认它存在。`undefined` 和 `'local'` 是观看者自己的时区，
 * 不认识的标识在开发期警告一次，回到观看者的时区。`context` 说明是哪个属性写错了。
 */
export function resolveTimezoneID(timezoneID: string | undefined, context = 'tooltipEntries'): string | undefined {
  if (timezoneID == null || timezoneID.toLowerCase() === LOCAL_ZONE)
    return undefined
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezoneID }).format()
  }
  catch {
    const report = `${context}:${timezoneID}`
    if (!warned.has(report)) {
      warned.add(report)
      devWarn('Timestamp', `unknown time zone ${JSON.stringify(timezoneID)} in ${context}. Falling back to the viewer's time zone.`)
    }
    return undefined
  }
  return timezoneID
}

/** 一个时区在这一刻的完整名字（`Pacific Standard Time`）。`timeZone` 缺省是观看者的时区。 */
export function longZoneName(date: Date, locale: string, timeZone?: string): string {
  const parts = new Intl.DateTimeFormat(locale, { timeZoneName: 'long', ...(timeZone == null ? {} : { timeZone }) }).formatToParts(date)
  return parts.find(part => part.type === 'timeZoneName')?.value ?? ''
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

/**
 * 没写 `timezoneID` 的行跟随 `defaultTimezoneID`（已经解析过的，Timestamp 自己的 `timezoneID`），
 * 写了 `'local'` 的行仍然是观看者的时区。固定下来的时区算一个时区，
 * 所以挨着它的观看者时区那一行会带上缩写。
 */
export function formatTooltipLines(
  date: Date,
  entries: readonly TimestampTooltipEntry[],
  locale: string,
  defaultTimezoneID?: string,
): TimestampTooltipLine[] {
  const resolved = entries.map(entry => entry.timezoneID === undefined
    ? defaultTimezoneID
    : resolveTimezoneID(entry.timezoneID))
  const zoneKeys = new Set(resolved.map(zoneKey))
  if (defaultTimezoneID !== undefined)
    zoneKeys.add(zoneKey(defaultTimezoneID))
  const hasMultipleZones = zoneKeys.size > 1
  return entries.map((entry, index) => {
    const format = entry.format ?? 'full'
    const timeZone = resolved[index]
    return {
      ...(entry.label == null ? {} : { label: entry.label }),
      isCopyable: entry.isCopyable ?? false,
      zoneName: longZoneName(date, locale, timeZone),
      value: formatInstant(date, format, locale, {
        timeZone,
        isTimezoneShown: shouldShowZoneName(format, hasMultipleZones, timeZone != null),
      }),
    }
  })
}
