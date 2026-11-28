import type { CalendarSystem } from './calendarSystem.js'
import type { PlainDate, SharedDateFormat } from './plainDate.js'
import { calendarEraYear, calendarYearOf, displayOptions, hasEraChange, LUNISOLAR, NUMERIC, partsOf, partType, textCalendar } from './calendarDateIntl.js'
import { dateTimeFormatFor } from './dateTimeFormatCache.js'
import { formatSharedDate, plainDateFormat, SHARED_DATE_FORMAT_OPTIONS } from './plainDate.js'

/**
 * 农历和朝鲜历的日期。有的语言只用六十年一轮的年份名写年（德语的 "24. M09 bing-wu"），
 * 读不回唯一的日期，这时把年份名换成相关的公历年份数。
 */
function formatLunisolar(pd: PlainDate, options: Intl.DateTimeFormatOptions, locale: string, calendar: CalendarSystem): string {
  const parts = partsOf(locale, calendar, options, pd)
  if (parts.some(part => partType(part) === 'relatedYear'))
    return parts.map(part => part.value).join('')
  const { numberingSystem } = dateTimeFormatFor(locale, { ...options, calendar, timeZone: 'UTC' }).resolvedOptions()
  const year = new Intl.NumberFormat(locale, { numberingSystem, useGrouping: false }).format(calendarYearOf(calendar, pd))
  return parts.map(part => /^year(?:Name)?$/.test(partType(part)) ? year : part.value).join('')
}

function formatInCalendar(pd: PlainDate, options: Intl.DateTimeFormatOptions, locale: string, calendar: CalendarSystem): string {
  if (LUNISOLAR.has(calendar))
    return formatLunisolar(pd, options, locale, calendar)
  const display = displayOptions(locale, calendar, options)
  const text = plainDateFormat(pd, { ...display, calendar }, locale)
  // 每种纪元宽度都会打乱字段顺序时（例如阿姆哈拉语的短月份日期），文字里没有纪元，
  // 不写纪元的文字按最新的纪元读。所以更早纪元的日期要补上纪元，像纪元格式那样放在开头或末尾。
  const eraOf = (date: PlainDate): string => calendarEraYear('en', calendar, date).era
  if (
    !hasEraChange(calendar)
    || eraOf(pd) === eraOf({ year: 9999, month: 12, day: 31 })
    || partsOf(locale, calendar, display, pd).some(part => part.type === 'era')
  ) {
    return text
  }
  const withEra = partsOf(locale, calendar, { ...options, era: 'short' }, pd)
  const at = withEra.findIndex(part => part.type === 'era')
  const era = withEra.slice(at === 0 ? 0 : at - 1, at === 0 ? 2 : at + 1).map(part => part.value).join('')
  return at === 0 ? era + text : text + era
}

/**
 * 日期字段在某种历法里提交后的文字。公历的文字和 Timestamp 的日期文字一样；`system_date` 永远是 ISO 日期。
 * 别的历法补上纪元，免得年份被当成公历年份。
 */
export function formatCalendarDateText(pd: PlainDate, format: SharedDateFormat, locale: string, calendar: CalendarSystem): string {
  const resolved = textCalendar(calendar)
  if (format === 'system_date' || resolved === 'gregory')
    return formatSharedDate(pd, format, locale)
  return formatInCalendar(pd, SHARED_DATE_FORMAT_OPTIONS[format], locale, resolved)
}

/** 历法数字写法的示例日期，带纪元，例如 "۱۴۰۵/۸/۸"。 */
export function formatCalendarDateHint(pd: PlainDate, locale: string, calendar: CalendarSystem): string {
  return formatInCalendar(pd, NUMERIC, locale, textCalendar(calendar))
}
