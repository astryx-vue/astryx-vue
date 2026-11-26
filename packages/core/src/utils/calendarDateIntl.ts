import type { CalendarSystem } from './calendarSystem.js'
import type { PlainDate } from './plainDate.js'
import { isCalendarSystemAvailable } from './calendarSystem.js'
import { dateTimeFormatFor } from './dateTimeFormatCache.js'
import { SHARED_DATE_FORMAT_OPTIONS } from './plainDate.js'
import { INVISIBLE_CHARS, toAsciiDigits } from './unicodeDigits.js'
import { unicodeRegExp } from './unicodeRegExp.js'

/**
 * 日期文本框读写历法日期时共用的 `Intl` 读取：格式片段、文字归一、年份和纪元、字段顺序，
 * 以及给不写纪元的格式补上纪元。都只读 `Intl`，不需要别的库。
 */

export type DateField = 'year' | 'month' | 'day'

export const NUMERIC: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' }
export const LONG = SHARED_DATE_FORMAT_OPTIONS.date_long
export const YEAR_ONLY: Intl.DateTimeFormatOptions = { year: 'numeric' }
export const ERA_AND_YEAR: Intl.DateTimeFormatOptions = { era: 'short', year: 'numeric' }

/** 农历和朝鲜历：年份按六十年一轮起名，闰月写成平月加记号。 */
export const LUNISOLAR: ReadonlySet<CalendarSystem> = new Set(['chinese', 'dangi'])
/** 不写纪元的历法。 */
export const WITHOUT_ERA: ReadonlySet<CalendarSystem> = new Set(['gregory', 'iso8601', 'chinese', 'dangi'])

const LATIN_MARKS = unicodeRegExp('(\\p{Script=Latin})\\p{Mn}+', 'gu')

/** 文本框读写的历法。`iso8601` 和当前环境显示不了的历法按公历读写。 */
export function textCalendar(calendar: CalendarSystem): CalendarSystem {
  if (calendar === 'iso8601' || !isCalendarSystemAvailable(calendar))
    return 'gregory'
  return calendar
}

/** `relatedYear`、`yearName` 这类片段类型在旧的 TS 声明里没有。 */
export function partType(part: Intl.DateTimeFormatPart): string {
  return part.type
}

function utcDate(pd: PlainDate): Date {
  const date = new Date(0)
  date.setUTCFullYear(pd.year, pd.month - 1, pd.day)
  return date
}

/** 按历法写一个公历日期的格式片段。 */
export function partsOf(
  locale: string,
  calendar: CalendarSystem,
  options: Intl.DateTimeFormatOptions,
  pd: PlainDate,
): Intl.DateTimeFormatPart[] {
  return dateTimeFormatFor(locale, { ...options, calendar, timeZone: 'UTC' }).formatToParts(utcDate(pd))
}

/** 把文字归成一种可比较的写法：ASCII 数字、小写、去掉拉丁字母的重音。 */
export function normalizeDateText(text: string, locale: string): string {
  // 大多数打进来的文字是可打印 ASCII，用不着下面的 Unicode 处理。
  if (/^[\x20-\x7E]*$/.test(text)) {
    const ascii = text.replaceAll('`', '\'')
    return /[A-Z]/.test(ascii) ? ascii.toLocaleLowerCase(locale) : ascii
  }
  const folded = text
    .normalize('NFKC')
    .replace(INVISIBLE_CHARS, '')
    // 粘贴来的文字可能带着双向文字的嵌入记号。
    .replace(/[\u202A-\u202E]/g, '')
    // 希伯来文的 geresh、gershayim，伊斯兰历月名里的 ʻ，人们常打成 ASCII 的撇号和引号。
    .replace(/[\u05F3\u2018\u2019\u02BB\u02BC\u02BF`]/g, '\'')
    .replace(/[\u05F4\u201C\u201D]/g, '"')
  let result = (toAsciiDigits(folded) ?? folded).toLocaleLowerCase(locale)
  if (/[\u00C0-\u024F\u1E00-\u1EFF]/.test(result)) {
    // 只去拉丁字母的重音：别的文字里，附加符号是字母的一部分。
    result = result.normalize('NFD').replace(LATIN_MARKS, '$1').normalize('NFC')
  }
  return result
}

/** 一个公历日期在这种历法里的年份数，从 `Intl` 读。 */
export function calendarYearOf(calendar: CalendarSystem, pd: PlainDate): number {
  const parts = partsOf('en', calendar, YEAR_ONLY, pd)
  const year = parts.find(part => partType(part) === 'relatedYear' || part.type === 'year')
  return Number(normalizeDateText(year?.value ?? '', 'en'))
}

/** `Intl` 给一个日期写的纪元名和纪元年。 */
export function calendarEraYear(locale: string, calendar: CalendarSystem, pd: PlainDate): { era: string, year: number } {
  const parts = partsOf(locale, calendar, ERA_AND_YEAR, pd)
  const year = parts.find(part => part.type === 'year' || partType(part) === 'relatedYear')
  return {
    era: parts.find(part => part.type === 'era')?.value ?? '',
    year: Number(normalizeDateText(year?.value ?? '', locale)),
  }
}

/** 格式片段里年、月、日出现的顺序。 */
export function fieldOrder(parts: Intl.DateTimeFormatPart[]): DateField[] {
  const order: DateField[] = []
  for (const part of parts) {
    const type = partType(part) === 'relatedYear' ? 'year' : part.type
    if ((type === 'year' || type === 'month' || type === 'day') && !order.includes(type))
      order.push(type)
  }
  return order
}

const eraChangeCache = new Map<CalendarSystem, boolean>()

/** 1900 到 2100 年之间纪元有没有换过。只有换过，不写纪元的年份才可能读成两个日期。 */
export function hasEraChange(calendar: CalendarSystem): boolean {
  let result = eraChangeCache.get(calendar)
  if (result == null) {
    const eraOf = (date: PlainDate): string => calendarEraYear('en', calendar, date).era
    result = eraOf({ year: 1900, month: 1, day: 1 }) !== eraOf({ year: 2100, month: 12, day: 31 })
    eraChangeCache.set(calendar, result)
  }
  return result
}

const displayOptionCache = new WeakMap<Intl.DateTimeFormatOptions, Map<string, Intl.DateTimeFormatOptions>>()

/**
 * 给不写纪元的格式补上纪元，免得年份被当成公历年份。补了纪元会打乱字段顺序时保留语言自己的写法；
 * 纪元换过的历法退而用不打乱顺序的窄纪元，例如阿姆哈拉语和历的 "1/1/8 R"。
 */
export function displayOptions(
  locale: string,
  calendar: CalendarSystem,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormatOptions {
  if (WITHOUT_ERA.has(calendar))
    return options
  let byLocale = displayOptionCache.get(options)
  if (byLocale == null) {
    byLocale = new Map()
    displayOptionCache.set(options, byLocale)
  }
  const key = `${locale}|${calendar}`
  let result = byLocale.get(key)
  if (result == null) {
    const sample = { year: 2026, month: 11, day: 2 }
    const parts = partsOf(locale, calendar, options, sample)
    result = options
    const order = fieldOrder(parts).join()
    if (!parts.some(part => part.type === 'era')) {
      const widths = hasEraChange(calendar) ? (['short', 'narrow'] as const) : (['short'] as const)
      for (const era of widths) {
        const withEra = { ...options, era }
        if (fieldOrder(partsOf(locale, calendar, withEra, sample)).join() === order) {
          result = withEra
          break
        }
      }
    }
    byLocale.set(key, result)
  }
  return result
}
