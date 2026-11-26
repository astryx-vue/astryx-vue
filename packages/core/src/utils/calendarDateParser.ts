import type { DateField } from './calendarDateIntl.js'
import type { CalendarDateLexicon } from './calendarDateLexicon.js'
import type { NumToken, Token } from './calendarDateTokens.js'
import type { PlainDate } from './plainDate.js'
import { calendarEraYear, calendarYearOf, normalizeDateText, WITHOUT_ERA } from './calendarDateIntl.js'
import { isLeapMonthKey } from './calendarDateLexicon.js'
import { lastNumber, sameSeparators, tokenize, weekdaysAsWords } from './calendarDateTokens.js'
import {
  calendarDateFromFields,
  calendarDateFromMonthKey,
  calendarMonthOf,
  calendarMonthsInCalendarYear,
  calendarYearMonthOf,
  isGregorianAligned,
} from './calendarSystem.js'
import { getDaysInMonth, plainDateToday } from './plainDate.js'

export { getCalendarDateLexicon } from './calendarDateLexicon.js'
export type { CalendarDateLexicon } from './calendarDateLexicon.js'

/** 一段文字在某种历法里读成什么。 */
export type CalendarDateParseResult
  = | { readonly kind: 'empty' }
  /** 日期的一部分，暂时没什么要报的。 */
    | { readonly kind: 'incomplete' }
  /** 成不了日期的文字。 */
    | { readonly kind: 'unreadable' }
  /** 读得出来，但这种历法里没有这一天。 */
    | { readonly kind: 'nonexistent', readonly isComplete: boolean }
  /** 被范围或规则排除的日期。 */
    | { readonly kind: 'outOfRange', readonly date: PlainDate, readonly isComplete: boolean }
  /** 一个日期。`isComplete` 表示再打字也改变不了它，字段可以边打边报。 */
    | { readonly kind: 'value', readonly date: PlainDate, readonly isComplete: boolean }

export interface CalendarDateParseOptions {
  /** 两位年份和省略的年份按这个公历日期补。 */
  readonly today?: PlainDate
  /** ISO 形状的文字按公历 ISO 日期读，和 `system_date` 的显示一致。 */
  readonly isoIsGregorian?: boolean
  /** 这一天不能选时返回 true。 */
  readonly isDateDisabled?: (date: PlainDate) => boolean
}

const INCOMPLETE: CalendarDateParseResult = { kind: 'incomplete' }
const UNREADABLE: CalendarDateParseResult = { kind: 'unreadable' }
const EMPTY: CalendarDateParseResult = { kind: 'empty' }

interface DateFields {
  year?: number
  era?: string
  eraYear?: number
  /** 月份键，见 `calendarMonthKey`。 */
  monthKey?: string
  /** 月份在那一年里的序号。 */
  month?: number
  day: number
}

interface FieldTokens {
  assigned: Map<Token, DateField>
  monthKey?: string
  monthOrdinal?: number
}

/** 给数字分配年月日。有月份名时数字是年和日，没有时按语言的数字顺序。 */
function assignFields(tokens: Token[], nums: NumToken[], lex: CalendarDateLexicon): FieldTokens | CalendarDateParseResult {
  const assigned = new Map<Token, DateField>()
  const monthTokens = tokens.filter(token => token.t === 'month' || token.t === 'monthNum')
  const monthToken = monthTokens[0]
  if (monthToken == null) {
    if (nums.length < 2)
      return INCOMPLETE
    if (nums.length > 3 || !sameSeparators(tokens, lex))
      return UNREADABLE
    let order: ReadonlyArray<DateField> = nums.length === 2 ? lex.order.filter(field => field !== 'year') : lex.order
    // ISO 形状的文字：打头的长数字是年份。
    if (nums.length === 3 && order[0] !== 'year' && nums[0]!.v.length >= 3)
      order = ['year', 'month', 'day']
    if (nums.length === 2 && nums.some(n => n.v.length >= 3))
      return INCOMPLETE
    nums.forEach((n, k) => assigned.set(n, order[k]!))
    return { assigned }
  }
  let monthKey: string | undefined
  let monthOrdinal: number | undefined
  if (monthToken.t === 'month') {
    if (monthToken.keys.size !== 1)
      return UNREADABLE
    monthKey = [...monthToken.keys][0]
  }
  else if (monthToken.t === 'monthNum') {
    if (lex.isNumericMonthOrdinal)
      monthOrdinal = Number(monthToken.v)
    else
      monthKey = String(Number(monthToken.v)) + (monthToken.isLeap ? 'bis' : '')
  }
  if (nums.length === 0 || nums.length > 2)
    return nums.length === 0 ? INCOMPLETE : UNREADABLE
  let rest = lex.nameOrder.filter(field => field !== 'month')
  const long = nums.filter(n => n.v.length >= 3 && !n.isAlias)
  if (nums.length === 1)
    rest = long.length === 1 ? ['year'] : ['day']
  else if (long.length === 1)
    rest = nums[0] === long[0] ? ['year', 'day'] : ['day', 'year'] // 有月份名时，三位以上的数字是年份。
  nums.forEach((n, k) => assigned.set(n, rest[k]!))
  return { assigned, monthKey, monthOrdinal }
}

/**
 * 按词表的历法读打进来的文字，值是公历日期。结果分得清空字段、半截日期、读不成的文字、
 * 历法里没有的日子、超出范围的日子和一个日期。
 */
export function parseCalendarDate(text: string, lex: CalendarDateLexicon, options: CalendarDateParseOptions = {}): CalendarDateParseResult {
  const s = normalizeDateText(text, lex.locale).trim()
  if (!s)
    return EMPTY
  const { isDateDisabled, isoIsGregorian = false } = options
  if (isoIsGregorian) {
    const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s)
    if (iso != null)
      return finish(gregorianDate(+iso[1]!, +iso[2]!, +iso[3]!), true, isDateDisabled)
  }
  const read = tokenize(s, lex)
  if (read === 'incomplete' || read === 'unreadable')
    return read === 'incomplete' ? INCOMPLETE : UNREADABLE
  const tokens = weekdaysAsWords(read)
  const nums = tokens.filter((token): token is NumToken => token.t === 'num')
  const monthCount = tokens.filter(token => token.t === 'month' || token.t === 'monthNum').length
  const eraCodes = new Set(tokens.flatMap(token => (token.t === 'era' ? [token.code] : [])))
  const isLeap = tokens.some(token => token.t === 'leap' || (token.t === 'monthNum' && token.isLeap))
  if (monthCount > 1 || eraCodes.size > 1)
    return UNREADABLE
  if (nums.length === 0 && monthCount === 0)
    return eraCodes.size > 0 ? INCOMPLETE : UNREADABLE
  const typedEra = eraCodes.size === 1 ? [...eraCodes][0] : undefined

  const fields = assignFields(tokens, nums, lex)
  if ('kind' in fields)
    return fields
  const { assigned } = fields
  let { monthKey, monthOrdinal } = fields
  const tokenOf = (field: DateField): NumToken | undefined => nums.find(n => assigned.get(n) === field)
  const dayToken = tokenOf('day')
  const yearToken = tokenOf('year')
  const monthNumToken = tokenOf('month')
  if (dayToken == null)
    return INCOMPLETE
  if (monthNumToken != null) {
    if (lex.isNumericMonthOrdinal)
      monthOrdinal = Number(monthNumToken.v)
    else
      monthKey = String(Number(monthNumToken.v))
  }
  if (monthKey != null && isLeap && !isLeapMonthKey(monthKey))
    monthKey += 'bis'
  const day = Number(dayToken.v)
  const monthNumber = monthOrdinal ?? (monthKey == null ? 0 : (Number.parseInt(monthKey, 10) || 1))
  if (day < 1 || day > 31 || monthNumber < 1 || monthNumber > 13) {
    // 单独一个 0 是两位日子或月份（例如 07）的开头。
    const startsField = [dayToken, monthNumToken].some(t => t?.v === '0')
    return startsField ? INCOMPLETE : UNREADABLE
  }

  const today = options.today ?? plainDateToday()
  const dateFields: DateFields = { day }
  if (monthKey != null)
    dateFields.monthKey = monthKey
  else
    dateFields.month = monthOrdinal
  const year = readYear(dateFields, yearToken, typedEra, tokens, lex, today)
  if (year === 'incomplete' || year === 'unreadable')
    return year === 'incomplete' ? INCOMPLETE : UNREADABLE
  const date = resolveDate(lex, dateFields, today)
  const isComplete = yearToken != null && year.isComplete && isLastFieldClosed(tokens, lex, assigned, date)
  return finish(date, isComplete, isDateDisabled)
}

/** 把年份写进 `fields`。没打年份时用今天所在的年份；两位年份就近补世纪；和历、民国的短年份是纪元年。 */
function readYear(
  fields: DateFields,
  yearToken: NumToken | undefined,
  typedEra: string | undefined,
  tokens: Token[],
  lex: CalendarDateLexicon,
  today: PlainDate,
): { isComplete: boolean } | 'incomplete' | 'unreadable' {
  if (yearToken == null) {
    applyDefaultYear(fields, lex, today)
    return { isComplete: false }
  }
  const digits = yearToken.isAlias ? 1 : yearToken.v.length
  const year = Number(yearToken.v)
  const isYearLast = lastNumber(tokens) === yearToken
  const { calendar } = lex
  if (typedEra != null) {
    fields.era = typedEra
    fields.eraYear = year
    return { isComplete: true }
  }
  if (calendar === 'japanese' && digits <= 2) {
    const era = currentEra(lex, today)
    if (era == null)
      return 'unreadable'
    fields.era = era
    fields.eraYear = year
    return { isComplete: !isYearLast }
  }
  if (calendar === 'japanese' && digits === 4) {
    fields.era = 'ce'
    fields.eraYear = year
    return { isComplete: true }
  }
  if (calendar === 'roc') {
    fields.era = 'roc'
    fields.eraYear = year
    return { isComplete: digits >= 4 || !isYearLast }
  }
  if (digits === 2) {
    fields.year = windowedYear(year, calendarYearOf(calendar, today))
    return { isComplete: false }
  }
  if (digits >= 4) {
    fields.year = year
    return { isComplete: true }
  }
  return 'incomplete'
}

function finish(date: PlainDate | null, isComplete: boolean, isDateDisabled: ((date: PlainDate) => boolean) | undefined): CalendarDateParseResult {
  if (date == null)
    return { kind: 'nonexistent', isComplete }
  if (isDateDisabled?.(date))
    return { kind: 'outOfRange', date, isComplete }
  return { kind: 'value', date, isComplete }
}

function monthsInYearOf(lex: CalendarDateLexicon, date: PlainDate | null): number {
  if (date == null)
    return 13
  return calendarMonthsInCalendarYear(lex.calendar, calendarYearMonthOf(lex.calendar, calendarMonthOf(lex.calendar, date)).year)
}

/** 文字是不是不会再长了：末尾没有分隔符，最后一个字段也接不了下一位数字。 */
function isLastFieldClosed(tokens: Token[], lex: CalendarDateLexicon, assigned: ReadonlyMap<Token, DateField>, date: PlainDate | null): boolean {
  const last = tokens.at(-1)
  if (last == null)
    return false
  if (last.t === 'sep')
    return lex.trailers.has(last.v)
  if (last.t !== 'num')
    return true
  const field = assigned.get(last)
  if (field === 'year' || last.v.length >= 2)
    return true
  const value = Number(last.v)
  // 不按这个月的长度：3 可能是这个月没有的 30 的开头，那时字段要报那一天，而不是 3 日。
  if (field === 'day')
    return value * 10 > 31
  return value * 10 > monthsInYearOf(lex, date)
}

/** 两位年份补成离今年最近的世纪：最多往前 80 年、往后 19 年。 */
function windowedYear(twoDigits: number, current: number): number {
  let year = current - (current % 100) + twoDigits
  if (year > current + 19)
    year -= 100
  else if (year < current - 80)
    year += 100
  return year
}

function currentEra(lex: CalendarDateLexicon, today: PlainDate): string | undefined {
  const { era } = calendarEraYear('en', lex.calendar, today)
  return lex.eras.get(normalizeDateText(era, lex.locale).trim())
}

function applyDefaultYear(fields: DateFields, lex: CalendarDateLexicon, today: PlainDate): void {
  if (isGregorianAligned(lex.calendar) && lex.eraArithmetic.size > 0 && !WITHOUT_ERA.has(lex.calendar)) {
    const { era, year } = calendarEraYear('en', lex.calendar, today)
    const code = lex.eras.get(normalizeDateText(era, lex.locale).trim())
    if (code != null) {
      fields.era = code
      fields.eraYear = year
      return
    }
  }
  fields.year = calendarYearOf(lex.calendar, today)
}

function gregorianDate(year: number, month: number, day: number): PlainDate | null {
  if (year < 1 || year > 9999 || month < 1 || month > 12 || day < 1 || day > getDaysInMonth(year, month))
    return null
  return { year, month, day }
}

/** 月日跟公历不同的历法里，别的纪元的年份换成今天这个纪元的年份要加的数：埃塞俄比亚历的世界纪元比现行纪元多 5500 年。 */
const ERA_YEAR_OFFSETS: Readonly<Record<string, Readonly<Record<string, number>>>> = {
  ethiopic: { aa: -5500 },
}

function yearInCurrentEra(lex: CalendarDateLexicon, era: string, eraYear: number | undefined, today: PlainDate): number | undefined {
  if (eraYear == null)
    return undefined
  if (era === currentEra(lex, today))
    return eraYear
  const offset = ERA_YEAR_OFFSETS[lex.calendar]?.[era]
  return offset == null ? undefined : eraYear + offset
}

/** 历法字段对应的公历日期，这一天不存在时返回 null。 */
function resolveDate(lex: CalendarDateLexicon, fields: DateFields, today: PlainDate): PlainDate | null {
  const { calendar } = lex
  if (!isGregorianAligned(calendar)) {
    const year = fields.era == null ? fields.year : yearInCurrentEra(lex, fields.era, fields.eraYear, today)
    if (year == null)
      return null
    const date = fields.monthKey != null
      ? calendarDateFromMonthKey(calendar, { year, monthKey: fields.monthKey, day: fields.day })
      : calendarDateFromFields(calendar, { year, month: fields.month ?? 0, day: fields.day })
    return date != null && date.year >= 1 && date.year <= 9999 ? date : null
  }
  if (fields.monthKey != null && isLeapMonthKey(fields.monthKey))
    return null
  const month = fields.month ?? Number(fields.monthKey)
  let gregorianYear: number
  if (fields.era != null) {
    const arithmetic = lex.eraArithmetic.get(fields.era)
    if (arithmetic == null || fields.eraYear == null || fields.eraYear < 1)
      return null
    gregorianYear = arithmetic.isForward ? arithmetic.base + fields.eraYear : arithmetic.base - fields.eraYear
  }
  else {
    const arithmetic = lex.eraArithmetic.get(calendar === 'buddhist' ? 'be' : 'ce')
    gregorianYear = (arithmetic?.base ?? 0) + (fields.year ?? 0)
  }
  const date = gregorianDate(gregorianYear, month, fields.day)
  if (date == null || calendar !== 'japanese' || fields.era === 'ce')
    return date
  // 和历每个年号都在某一天结束，过了那天的年份不属于这个年号。
  const written = calendarEraYear('en', calendar, date)
  const era = lex.eras.get(normalizeDateText(written.era, lex.locale).trim())
  return era === fields.era && written.year === fields.eraYear ? date : null
}
