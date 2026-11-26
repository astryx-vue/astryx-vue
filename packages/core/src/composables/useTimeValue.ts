import type { ISOTimeString as BrandedISOTime } from '../utils/timeParser.js'
import {
  adjustTime,
  formatDisplayTime12h,
  formatDisplayTime24h,
  formatISOTime as formatParsedTime,
  isTimeInRange as isTimeInRangeParsed,
  parseTimeInput,
  parseISOTime as parseTimeParts,
} from '../utils/timeParser.js'

export type HourFormat = '12h' | '24h'
export type ISOTimeString = string

export interface ParsedTime {
  hours: number
  minutes: number
  seconds: number
}

/** 字段接受的 ISO 时间写法：两位时、两位分，可带两位秒。 */
const STRICT_ISO_TIME = /^\d{2}:\d{2}(?::\d{2})?$/
/** 手打文本的写法：带上下午的 12 小时制、四位或六位紧凑写法，或严格的 ISO 时间。 */
const TYPED_TIME = /^(?:\d{1,2}(?::\d{2}){0,2}\s*[ap]\.?m\.?|\d{4}(?:\d{2})?|\d{2}:\d{2}(?::\d{2})?)$/i

/** 时间的解析、格式化、比较和步进都在 `utils/timeParser`；这里只做字段用的严格写法和 `hours` 形状。 */
export function parseISOTime(value: string): ParsedTime | null {
  const text = value.trim()
  if (!STRICT_ISO_TIME.test(text))
    return null
  const parts = parseTimeParts(text)
  return parts && { hours: parts.hour, minutes: parts.minute, seconds: parts.second }
}

export function formatISOTime(time: ParsedTime, hasSeconds: boolean): ISOTimeString {
  return formatParsedTime({ hour: time.hours, minute: time.minutes, second: time.seconds }, hasSeconds)
}

export function formatDisplayTime(value: string, hourFormat: HourFormat, hasSeconds: boolean): string {
  const time = parseISOTime(value) ? value.trim() : null
  if (time == null)
    return value
  return hourFormat === '24h'
    ? formatDisplayTime24h(time as BrandedISOTime, hasSeconds)
    : formatDisplayTime12h(time as BrandedISOTime, hasSeconds)
}

export function parseDisplayTime(text: string, hasSeconds: boolean): ISOTimeString | null {
  const trimmed = text.trim()
  return TYPED_TIME.test(trimmed) ? parseTimeInput(trimmed, hasSeconds) : null
}

export function shiftTime(value: string, minuteDelta: number, hasSeconds: boolean): ISOTimeString {
  const base = parseISOTime(value) ? value.trim() : '00:00'
  return adjustTime(base as BrandedISOTime, minuteDelta, hasSeconds)
}

export function isTimeInRange(value: string, min?: string, max?: string): boolean {
  return isTimeInRangeParsed(value as BrandedISOTime, min as BrandedISOTime | undefined, max as BrandedISOTime | undefined)
}

export type TimePresentation = 'text-input' | 'popover' | 'bottom-sheet' | 'native' | 'adaptive-bottom-sheet' | 'adaptive-native'
export type NativePicker = 'touch' | 'always' | 'never'
export type TimeSurface = 'text' | 'native' | 'sheet'

export function resolveTimeSurface(options: {
  presentation?: TimePresentation
  nativePicker?: NativePicker
  coarse: boolean
  hasSeconds: boolean
  increment: number
  /** 额外的“系统控件表达不了”的信号，例如预设时间列表。 */
  needsTypedField?: boolean
}): TimeSurface {
  const presentation = options.presentation ?? (
    options.nativePicker === 'always'
      ? 'native'
      : options.nativePicker === 'never'
        ? 'text-input'
        : 'adaptive-native'
  )
  const needsTypedField = options.hasSeconds || options.increment !== 1 || options.needsTypedField === true
  if (presentation === 'text-input' || presentation === 'popover')
    return 'text'
  if (presentation === 'bottom-sheet')
    return 'sheet'
  if (presentation === 'adaptive-bottom-sheet')
    return options.coarse ? 'sheet' : 'text'
  if (needsTypedField)
    return 'text'
  if (presentation === 'native')
    return 'native'
  return options.coarse ? 'native' : 'text'
}
