import type { EntryErrorBehavior } from '../FormLayout/context.js'
import type { DateInputMessages } from '../locale/messages/date-input.js'
import type { CalendarSystem } from '../utils/calendarSystem.js'
import type { DateInputFormat } from './types.js'
import { textCalendar } from '../utils/calendarDateIntl.js'
import { getCalendarDateLexicon, parseCalendarDate } from '../utils/calendarDateParser.js'
import { parseDateInput } from '../utils/dateParser.js'
import { plainDateToDate } from '../utils/plainDate.js'
import { formatCommittedDate, toIsoDate } from './dateText.js'

/**
 * 字段为什么不收打进来的文字。通过 `entryErrorChange` 报给调用方，方便它自己措辞。
 *
 * - `unreadable`：读不成日期的文字
 * - `incomplete`：Enter 或失焦也补不全的半截日期
 * - `nonexistent`：日历上没有的日子
 * - `outOfRange`：早于 `min` 或晚于 `max`
 * - `unavailable`：被 `isDateDisabled` / `dateConstraints` 排除
 */
export interface DateInputEntryError {
  kind: 'unreadable' | 'incomplete' | 'nonexistent' | 'outOfRange' | 'unavailable'
  /** 打进来的文字。 */
  text: string
  /** 文字指向的 ISO 日期，只有 `outOfRange` 和 `unavailable` 带。 */
  date?: string
}

/** 读一段文字的结果。`isComplete` 表示再打字也改变不了这个日子。 */
export type DateEntryResult
  = | { kind: 'value', date: Date, isComplete: boolean }
    | { kind: 'outOfRange', date: Date, isComplete: boolean }
    | { kind: 'nonexistent' }
    | { kind: 'incomplete' }
    | { kind: 'unreadable' }

/** 字段亮出来的拒绝原因，按它显示的那句话分。 */
export type DateEntryErrorKind = 'unreadable' | 'nonexistent' | 'outOfRange'

const ISO_DATE = /^(\d{4})-(\d{1,2})-(\d{1,2})$/
const ISO_PREFIX = /^\d{1,4}(?:-(?:\d{1,2}(?:-\d?)?)?)?$/

/** 按历法读：月份名、纪元和数字都按那种历法认，`system_date` 下 ISO 形状的文字仍是公历日期。 */
function parseCalendarEntry(
  text: string,
  locale: string,
  isBlocked: (date: Date) => boolean,
  calendar: CalendarSystem,
  format: DateInputFormat | undefined,
): DateEntryResult {
  const result = parseCalendarDate(text, getCalendarDateLexicon(locale, calendar), {
    isoIsGregorian: format === 'system_date',
    isDateDisabled: date => isBlocked(plainDateToDate(date)),
  })
  switch (result.kind) {
    case 'empty':
    case 'incomplete':
      return { kind: 'incomplete' }
    case 'unreadable':
      return { kind: 'unreadable' }
    case 'nonexistent':
      // 还能接着打的文字（例如打到一半的年份）暂时不算错。
      return result.isComplete ? { kind: 'nonexistent' } : { kind: 'incomplete' }
    default:
      return { kind: result.kind, date: plainDateToDate(result.date), isComplete: result.isComplete }
  }
}

/**
 * 读打进来的文字。公历下 `YYYY-M-D` 打完整（日子是两位，或者一位但不会再变）就算完整；
 * 还能接着打的 ISO 前缀算半截；其余文字交给 `parseDateInput`，读出来的日子只在 Enter 或失焦时提交。
 * 别的历法按那种历法的写法读。
 */
export function parseDateEntry(
  text: string,
  locale: string,
  isBlocked: (date: Date) => boolean,
  calendar: CalendarSystem = 'gregory',
  format?: DateInputFormat,
): DateEntryResult {
  if (textCalendar(calendar) !== 'gregory')
    return parseCalendarEntry(text, locale, isBlocked, calendar, format)
  const trimmed = text.trim()
  const iso = ISO_DATE.exec(trimmed)
  if (iso) {
    const year = Number(iso[1])
    const month = Number(iso[2])
    const day = Number(iso[3])
    if (month < 1 || month > 12 || day < 1 || day > 31)
      return { kind: 'unreadable' }
    const date = new Date(year, month - 1, day)
    date.setFullYear(year)
    const isComplete = iso[3]!.length === 2 || day > 3
    if (date.getMonth() !== month - 1 || date.getDate() !== day)
      return isComplete ? { kind: 'nonexistent' } : { kind: 'incomplete' }
    return { kind: isBlocked(date) ? 'outOfRange' : 'value', date, isComplete }
  }
  if (ISO_PREFIX.test(trimmed))
    return { kind: 'incomplete' }
  const loose = parseDateInput(trimmed, locale)
  if (loose == null)
    return { kind: 'unreadable' }
  const date = plainDateToDate(loose)
  return { kind: isBlocked(date) ? 'outOfRange' : 'value', date, isComplete: false }
}

/**
 * 一个结果此刻亮出来的拒绝：Enter 或失焦提交过的文字的错，
 * 或者在 `complete` 下一个已经打完整的日子的错。读不成日期的文字永远不完整，所以等提交。
 */
export function dateEntryErrorKind(result: DateEntryResult | null, isCommitted: boolean, behavior: EntryErrorBehavior): DateEntryErrorKind | null {
  if (result == null)
    return null
  if ((result.kind === 'unreadable' || result.kind === 'incomplete') && isCommitted)
    return 'unreadable'
  if (result.kind === 'nonexistent' && (isCommitted || behavior === 'complete'))
    return 'nonexistent'
  if (result.kind === 'outOfRange' && (isCommitted || (result.isComplete && behavior === 'complete')))
    return 'outOfRange'
  return null
}

/** 这个结果是不是打字就会提交的日子，它会结束一个亮着的拒绝。 */
export function isAcceptedEntry(result: DateEntryResult): boolean {
  return result.kind === 'value' && result.isComplete
}

export interface DateBounds {
  min?: Date
  max?: Date
}

function dayOf(date: Date): number {
  return date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate()
}

export function isOutsideBounds(date: Date, bounds: DateBounds): boolean {
  return (bounds.min != null && dayOf(date) < dayOf(bounds.min)) || (bounds.max != null && dayOf(date) > dayOf(bounds.max))
}

/** 报给调用方的拒绝。 */
export function toEntryError(result: DateEntryResult, text: string, bounds: DateBounds): DateInputEntryError {
  if (result.kind === 'incomplete' || result.kind === 'unreadable' || result.kind === 'nonexistent')
    return { kind: result.kind, text }
  return {
    kind: result.kind === 'outOfRange' && isOutsideBounds(result.date, bounds) ? 'outOfRange' : 'unavailable',
    text,
    date: toIsoDate(result.date),
  }
}

/** 拒绝时字段下方显示的那句话。边界日期按字段的显示格式和历法写，自定义格式函数时用长日期。 */
export function dateEntryMessage(
  result: DateEntryResult,
  bounds: DateBounds,
  format: DateInputFormat | undefined,
  locale: string,
  messages: DateInputMessages,
  calendar: CalendarSystem = 'gregory',
): string {
  if (result.kind === 'nonexistent')
    return messages.nonexistentDate
  if (result.kind === 'outOfRange' || result.kind === 'value') {
    const boundFormat = typeof format === 'function' ? 'date_long' : format
    const write = (date: Date | undefined): string => date ? formatCommittedDate(date, boundFormat, locale, calendar) : ''
    const which = !isOutsideBounds(result.date, bounds)
      ? 'other'
      : bounds.min != null && bounds.max != null
        ? 'both'
        : bounds.min != null ? 'min' : 'max'
    return messages.outOfRangeDate(which, write(bounds.min), write(bounds.max))
  }
  return messages.invalidDate
}

export function sameEntryError(a: DateInputEntryError | null, b: DateInputEntryError | null): boolean {
  return a === b || (a != null && b != null && a.kind === b.kind && a.text === b.text && a.date === b.date)
}
