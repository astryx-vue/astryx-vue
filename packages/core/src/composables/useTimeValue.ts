export type HourFormat = '12h' | '24h'
export type ISOTimeString = string

export interface ParsedTime {
  hours: number
  minutes: number
  seconds: number
}

const DISPLAY_TIME = /^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*([ap])\.?m\.?$/i
const COMPACT_TIME = /^(\d{2})(\d{2})(\d{2})?$/
const ISO_TIME = /^(\d{2}):(\d{2})(?::(\d{2}))?$/

function clampPart(value: number, max: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= max
}

export function parseISOTime(value: string): ParsedTime | null {
  const match = ISO_TIME.exec(value.trim())
  if (!match)
    return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  const seconds = match[3] == null ? 0 : Number(match[3])
  if (!clampPart(hours, 23) || !clampPart(minutes, 59) || !clampPart(seconds, 59))
    return null
  return { hours, minutes, seconds }
}

export function formatISOTime(time: ParsedTime, hasSeconds: boolean): ISOTimeString {
  const hours = String(time.hours).padStart(2, '0')
  const minutes = String(time.minutes).padStart(2, '0')
  const seconds = String(time.seconds).padStart(2, '0')
  return hasSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`
}

export function formatDisplayTime(value: string, hourFormat: HourFormat, hasSeconds: boolean): string {
  const parsed = parseISOTime(value)
  if (!parsed)
    return value
  if (hourFormat === '24h')
    return formatISOTime(parsed, hasSeconds)
  const suffix = parsed.hours < 12 ? 'AM' : 'PM'
  const hour12 = parsed.hours % 12 || 12
  const minutes = String(parsed.minutes).padStart(2, '0')
  const seconds = hasSeconds ? `:${String(parsed.seconds).padStart(2, '0')}` : ''
  return `${hour12}:${minutes}${seconds} ${suffix}`
}

export function parseDisplayTime(text: string, hasSeconds: boolean): ISOTimeString | null {
  const trimmed = text.trim()
  if (!trimmed)
    return null

  const meridiem = DISPLAY_TIME.exec(trimmed)
  if (meridiem) {
    let hours = Number(meridiem[1])
    const minutes = meridiem[2] == null ? 0 : Number(meridiem[2])
    const seconds = meridiem[3] == null ? 0 : Number(meridiem[3])
    if (!clampPart(hours, 12) || hours === 0 || !clampPart(minutes, 59) || !clampPart(seconds, 59))
      return null
    const isPm = meridiem[4].toLowerCase() === 'p'
    if (hours === 12)
      hours = isPm ? 12 : 0
    else if (isPm)
      hours += 12
    return formatISOTime({ hours, minutes, seconds }, hasSeconds)
  }

  const compact = COMPACT_TIME.exec(trimmed)
  if (compact) {
    return parseDisplayTime(`${compact[1]}:${compact[2]}${compact[3] ? `:${compact[3]}` : ''}`, hasSeconds)
  }

  const iso = parseISOTime(trimmed)
  if (!iso)
    return null
  return formatISOTime(iso, hasSeconds)
}

export function shiftTime(value: string, minuteDelta: number, hasSeconds: boolean): ISOTimeString {
  const parsed = parseISOTime(value) ?? { hours: 0, minutes: 0, seconds: 0 }
  const total = parsed.hours * 60 + parsed.minutes + minuteDelta
  const day = 24 * 60
  const normalized = ((total % day) + day) % day
  return formatISOTime({
    hours: Math.floor(normalized / 60),
    minutes: normalized % 60,
    seconds: parsed.seconds,
  }, hasSeconds)
}

function comparable(value: string): string {
  const parsed = parseISOTime(value)
  if (!parsed)
    return value
  return formatISOTime(parsed, true)
}

export function isTimeInRange(value: string, min?: string, max?: string): boolean {
  const current = comparable(value)
  if (min && current < comparable(min))
    return false
  if (max && current > comparable(max))
    return false
  return true
}

export type TimePresentation = 'text-input' | 'popover' | 'bottom-sheet' | 'native' | 'adaptive-bottom-sheet' | 'adaptive-native'
export type NativePicker = 'touch' | 'always' | 'never'

export function resolveTimeSurface(options: {
  presentation?: TimePresentation
  nativePicker?: NativePicker
  coarse: boolean
  hasSeconds: boolean
  increment: number
  /** 额外的“系统控件表达不了”的信号，例如预设时间列表。 */
  needsTypedField?: boolean
}): 'text' | 'native' {
  const presentation = options.presentation ?? (
    options.nativePicker === 'always'
      ? 'native'
      : options.nativePicker === 'never'
        ? 'text-input'
        : 'adaptive-native'
  )
  const needsTypedField = options.hasSeconds || options.increment !== 1 || options.needsTypedField === true
  if (presentation === 'text-input' || presentation === 'popover' || presentation === 'bottom-sheet')
    return 'text'
  if (needsTypedField)
    return 'text'
  if (presentation === 'native')
    return 'native'
  return options.coarse ? 'native' : 'text'
}
