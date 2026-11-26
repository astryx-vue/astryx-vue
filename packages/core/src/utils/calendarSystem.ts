import type { PlainDate } from './plainDate.js'
import { dateTimeFormatFor } from './dateTimeFormatCache.js'
import { getDaysInMonth, plainDateAddDays, plainDateAddMonths, plainDateIsInRange } from './plainDate.js'

/**
 * 日期组件能显示的历法，对应 ECMA-402 的历法标识。
 * 不管显示哪种历法，值始终是公历 ISO 日期。
 */
export type CalendarSystem
  = | 'gregory'
    | 'iso8601'
    | 'buddhist'
    | 'roc'
    | 'japanese'
    | 'persian'
    | 'indian'
    | 'hebrew'
    | 'chinese'
    | 'dangi'
    | 'coptic'
    | 'ethiopic'
    | 'ethioaa'
    | 'islamic-civil'
    | 'islamic-tbla'
    | 'islamic-umalqura'

// 写成 Record，编译器会检查每种历法正好列一次。
const KNOWN_CALENDARS: Readonly<Record<CalendarSystem, true>> = {
  'gregory': true,
  'iso8601': true,
  'buddhist': true,
  'roc': true,
  'japanese': true,
  'persian': true,
  'indian': true,
  'hebrew': true,
  'chinese': true,
  'dangi': true,
  'coptic': true,
  'ethiopic': true,
  'ethioaa': true,
  'islamic-civil': true,
  'islamic-tbla': true,
  'islamic-umalqura': true,
}

export const CALENDAR_SYSTEMS = Object.keys(KNOWN_CALENDARS) as ReadonlyArray<CalendarSystem>

const GREGORIAN_ALIGNED: ReadonlySet<CalendarSystem> = new Set(['gregory', 'iso8601', 'buddhist', 'roc', 'japanese'])

export function isCalendarSystem(value: unknown): value is CalendarSystem {
  return typeof value === 'string' && Object.hasOwn(KNOWN_CALENDARS, value)
}

/** 原生 `<input type="date">` 能不能显示这种历法。原生控件按规范只有公历。 */
export function isGregorianCalendar(calendar: CalendarSystem): boolean {
  return calendar === 'gregory' || calendar === 'iso8601'
}

/** 这种历法的月和日是不是就是公历的月和日（只是年份或纪元写法不同）。 */
export function isGregorianAligned(calendar: CalendarSystem): boolean {
  return GREGORIAN_ALIGNED.has(calendar)
}

const availability = new Map<CalendarSystem, boolean>()

/**
 * 当前运行环境能不能显示这种历法。月日跟公历一致的历法总能显示；
 * 其余历法要 `Intl` 认识它，月份长度、闰月和年份都从 `Intl` 读。
 */
export function isCalendarSystemAvailable(calendar: CalendarSystem): boolean {
  if (isGregorianAligned(calendar))
    return true
  let known = availability.get(calendar)
  if (known == null) {
    try {
      known = new Intl.DateTimeFormat('en', { calendar }).resolvedOptions().calendar === calendar
    }
    catch {
      known = false
    }
    availability.set(calendar, known)
  }
  return known
}

/** 某种历法里的一个月，用它的第一天和最后一天（公历）定位。 */
export interface CalendarMonth {
  readonly start: PlainDate
  readonly end: PlainDate
  readonly length: number
}

/** 历法里一个月的年份和它在那一年里的序号。希伯来历闰年有第 13 个月。 */
export interface CalendarYearMonth {
  readonly year: number
  readonly month: number
}

function makeMonth(start: PlainDate, length: number): CalendarMonth {
  return { start, end: plainDateAddDays(start, length - 1), length }
}

function gregorianMonth(year: number, month: number): CalendarMonth {
  return makeMonth({ year, month, day: 1 }, getDaysInMonth(year, month))
}

// ─── 从 Intl 读历法字段 ────────────────────────────────────────────

interface DayFields {
  readonly year: number
  /** 月份在这种历法里的名字（英文、拉丁数字），同一个月在每一年都一样，用来跨年找同一个月。 */
  readonly monthKey: string
  readonly day: number
}

const FIELD_OPTIONS: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' }
const CACHE_LIMIT = 4000

function cached<T>(cache: Map<string, T>, key: string, compute: () => T): T {
  const hit = cache.get(key)
  if (hit !== undefined)
    return hit
  const value = compute()
  if (cache.size >= CACHE_LIMIT)
    cache.clear()
  cache.set(key, value)
  return value
}

function isoKey(calendar: CalendarSystem, pd: PlainDate): string {
  return `${calendar}|${pd.year}-${pd.month}-${pd.day}`
}

function utcDate(pd: PlainDate): Date {
  const date = new Date(0)
  date.setUTCFullYear(pd.year, pd.month - 1, pd.day)
  return date
}

const fieldCache = new Map<string, DayFields>()

function readFields(calendar: CalendarSystem, pd: PlainDate): DayFields {
  return cached(fieldCache, isoKey(calendar, pd), () => {
    const parts = dateTimeFormatFor('en-u-nu-latn', { ...FIELD_OPTIONS, calendar }).formatToParts(utcDate(pd))
    let year = Number.NaN
    let monthKey = ''
    let day = 1
    for (const part of parts) {
      const type = part.type as string
      if (type === 'relatedYear' || (type === 'year' && Number.isNaN(year)))
        year = Number(part.value)
      else if (type === 'month')
        monthKey = part.value
      else if (type === 'day')
        day = Number(part.value)
    }
    return { year, monthKey, day }
  })
}

const lengthCache = new Map<string, number>()

/** 从某月第一天往后找下一个「1 日」，得出这个月有几天。每种历法的月份都在 5 到 31 天之间。 */
function monthLengthFrom(calendar: CalendarSystem, start: PlainDate): number {
  return cached(lengthCache, isoKey(calendar, start), () => {
    for (let length = 29; length <= 31; length += 1) {
      if (readFields(calendar, plainDateAddDays(start, length)).day === 1)
        return length
    }
    // 埃塞俄比亚历和科普特历的第 13 个月只有 5 或 6 天。
    return readFields(calendar, plainDateAddDays(start, 5)).day === 1 ? 5 : 6
  })
}

function intlMonthOf(calendar: CalendarSystem, pd: PlainDate): CalendarMonth {
  const start = plainDateAddDays(pd, 1 - readFields(calendar, pd).day)
  return makeMonth(start, monthLengthFrom(calendar, start))
}

function nextMonth(calendar: CalendarSystem, month: CalendarMonth): CalendarMonth {
  return intlMonthOf(calendar, plainDateAddDays(month.end, 1))
}

function previousMonth(calendar: CalendarSystem, month: CalendarMonth): CalendarMonth {
  return intlMonthOf(calendar, plainDateAddDays(month.start, -1))
}

const ordinalCache = new Map<string, number>()

/** 这个月是它那一年的第几个月：往前数，直到年份变了。 */
function monthOrdinal(calendar: CalendarSystem, month: CalendarMonth): number {
  return cached(ordinalCache, isoKey(calendar, month.start), () => {
    const { year } = readFields(calendar, month.start)
    let ordinal = 1
    let cursor = previousMonth(calendar, month)
    while (ordinal < 14 && readFields(calendar, cursor.start).year === year) {
      ordinal += 1
      cursor = previousMonth(calendar, cursor)
    }
    return ordinal
  })
}

// 回历一年约 354.37 天，其余历法按太阳年算。估一个大概位置，再一个月一个月地走过去。
const MEAN_YEAR_DAYS: Partial<Record<CalendarSystem, number>> = {
  'islamic-civil': 354.367,
  'islamic-tbla': 354.367,
  'islamic-umalqura': 354.367,
}
const REFERENCE: PlainDate = { year: 2000, month: 1, day: 1 }
const yearStartCache = new Map<string, PlainDate>()

/** 某种历法某一年的第一个月。 */
function firstMonthOfYear(calendar: CalendarSystem, year: number): CalendarMonth {
  const start = cached(yearStartCache, `${calendar}|${year}`, () => {
    const meanYear = MEAN_YEAR_DAYS[calendar] ?? 365.2425
    const offset = Math.round((year - readFields(calendar, REFERENCE).year) * meanYear)
    let month = intlMonthOf(calendar, plainDateAddDays(REFERENCE, offset))
    // 估计值离真正的年初不超过几个月；最多走两年的月份数，防止异常数据下死循环。
    for (let step = 0; step < 30; step += 1) {
      const current = readFields(calendar, month.start).year
      if (current < year) {
        month = nextMonth(calendar, month)
        continue
      }
      const previous = previousMonth(calendar, month)
      if (current > year || readFields(calendar, previous.start).year === year) {
        month = previous
        continue
      }
      break
    }
    return month.start
  })
  return intlMonthOf(calendar, start)
}

// ─── 对外的月份运算 ────────────────────────────────────────────────

/** 一个公历日期在这种历法里落在那个月的第几天。 */
export function calendarDayOfMonth(calendar: CalendarSystem, pd: PlainDate): number {
  return isGregorianAligned(calendar) ? pd.day : readFields(calendar, pd).day
}

/** 包含这个公历日期的历法月。 */
export function calendarMonthOf(calendar: CalendarSystem, pd: PlainDate): CalendarMonth {
  return isGregorianAligned(calendar) ? gregorianMonth(pd.year, pd.month) : intlMonthOf(calendar, pd)
}

/** `month` 之后第 `n` 个历法月，`n` 为负时往前。 */
export function calendarAddMonths(calendar: CalendarSystem, month: CalendarMonth, n: number): CalendarMonth {
  if (n === 0)
    return month
  if (isGregorianAligned(calendar)) {
    const { year, month: monthOfYear } = plainDateAddMonths(month.start, n)
    return gregorianMonth(year, monthOfYear)
  }
  let cursor = month
  for (let step = 0; step < Math.abs(n); step += 1)
    cursor = n > 0 ? nextMonth(calendar, cursor) : previousMonth(calendar, cursor)
  return cursor
}

/**
 * 历法月的年份和序号。月日跟公历一致的历法按公历年份数（佛历、民国、和历的年份写法交给 `Intl`）。
 */
export function calendarYearMonthOf(calendar: CalendarSystem, month: CalendarMonth): CalendarYearMonth {
  if (isGregorianAligned(calendar))
    return { year: month.start.year, month: month.start.month }
  return { year: readFields(calendar, month.start).year, month: monthOrdinal(calendar, month) }
}

const monthsInYearCache = new Map<string, number>()

/** 这种历法某一年有几个月。 */
export function calendarMonthsInCalendarYear(calendar: CalendarSystem, year: number): number {
  if (isGregorianAligned(calendar))
    return 12
  return cached(monthsInYearCache, `${calendar}|${year}`, () => {
    let count = 1
    let cursor = nextMonth(calendar, firstMonthOfYear(calendar, year))
    while (count < 14 && readFields(calendar, cursor.start).year === year) {
      count += 1
      cursor = nextMonth(calendar, cursor)
    }
    return count
  })
}

/** 按年份和序号找历法月。序号超过那一年的月数时取那一年最后一个月，小于 1 时取第一个月。 */
export function calendarMonthFromYearMonth(calendar: CalendarSystem, { year, month }: CalendarYearMonth): CalendarMonth {
  const ordinal = Math.min(Math.max(month, 1), calendarMonthsInCalendarYear(calendar, year))
  if (isGregorianAligned(calendar))
    return gregorianMonth(year, ordinal)
  return calendarAddMonths(calendar, firstMonthOfYear(calendar, year), ordinal - 1)
}

function clampToMonth(month: CalendarMonth, day: number): PlainDate {
  return plainDateAddDays(month.start, Math.min(Math.max(day, 1), month.length) - 1)
}

/** 把日期挪 `n` 个历法月，保留当月的第几天，超过目标月长度时取最后一天。 */
export function calendarShiftMonths(calendar: CalendarSystem, pd: PlainDate, n: number): PlainDate {
  if (isGregorianAligned(calendar))
    return plainDateAddMonths(pd, n)
  const target = calendarAddMonths(calendar, intlMonthOf(calendar, pd), n)
  return clampToMonth(target, readFields(calendar, pd).day)
}

/** 希伯来历的亚达一月、农历的闰月在没有它的年份里落到对应的平月。 */
function commonMonthKey(key: string): string {
  if (key === 'Adar I' || key === 'Adar II')
    return 'Adar'
  return key.replace(/bis$/, '')
}

/** 在某一年里找名字相同的月份，找不到时找对应的平月。 */
function sameMonthInYear(calendar: CalendarSystem, year: number, key: string): CalendarMonth {
  const months: CalendarMonth[] = []
  let cursor = firstMonthOfYear(calendar, year)
  for (let index = 0; index < calendarMonthsInCalendarYear(calendar, year); index += 1) {
    months.push(cursor)
    cursor = nextMonth(calendar, cursor)
  }
  const keyOf = (month: CalendarMonth): string => readFields(calendar, month.start).monthKey
  return months.find(month => keyOf(month) === key)
    ?? months.find(month => commonMonthKey(keyOf(month)) === commonMonthKey(key))
    ?? months[months.length - 1]!
}

/** 把日期挪 `n` 个历法年，落到目标年的同一个月，日子超过月长时取最后一天。 */
export function calendarShiftYears(calendar: CalendarSystem, pd: PlainDate, n: number): PlainDate {
  if (isGregorianAligned(calendar))
    return plainDateAddMonths(pd, n * 12)
  const fields = readFields(calendar, pd)
  return clampToMonth(sameMonthInYear(calendar, fields.year + n, fields.monthKey), fields.day)
}

/** 历法里写成「年、第几个月、第几天」的日期对应的公历日期；这一天不存在时返回 null。 */
export function calendarDateFromFields(calendar: CalendarSystem, fields: CalendarYearMonth & { readonly day: number }): PlainDate | null {
  const { year, month, day } = fields
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day) || month < 1 || day < 1)
    return null
  if (month > calendarMonthsInCalendarYear(calendar, year))
    return null
  const target = calendarMonthFromYearMonth(calendar, { year, month })
  return day > target.length ? null : plainDateAddDays(target.start, day - 1)
}

/** 公历日期是否落在这个历法月里。 */
export function isInCalendarMonth(pd: PlainDate, month: CalendarMonth): boolean {
  return plainDateIsInRange(pd, [month.start, month.end])
}

/**
 * 给历法月起名用的那一天：月中那天。和历的年号可能在月中更替，这个月的大多数日子属于月中那天的年号。
 */
export function calendarMonthLabelDay(month: CalendarMonth): PlainDate {
  return plainDateAddDays(month.start, Math.floor(month.length / 2))
}
