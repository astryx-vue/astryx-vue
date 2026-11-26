import type { CalendarMonth, CalendarSystem } from './calendarSystem.js'
import type { PlainDate } from './plainDate.js'
import { formatStandaloneMonthYear } from '../locale/format.js'
import { calendarMonthLabelDay, isGregorianCalendar } from './calendarSystem.js'
import { DATE_FORMAT_MONTH_ONLY, plainDateAddDays, plainDateFormat } from './plainDate.js'

/** `Intl` 没有 `iso8601` 的月份名，标签用月日相同的 `gregory`。 */
export function labelCalendar(calendar: CalendarSystem): CalendarSystem {
  return calendar === 'iso8601' ? 'gregory' : calendar
}

function utcDate(pd: PlainDate): Date {
  const date = new Date(0)
  date.setUTCFullYear(pd.year, pd.month - 1, pd.day)
  return date
}

/** 按历法写一个公历日期，例如 "Friday, Aban 8, 1405 AP"。 */
export function formatCalendarDate(
  calendar: CalendarSystem,
  pd: PlainDate,
  options: Intl.DateTimeFormatOptions,
  locale: string,
): string {
  return plainDateFormat(pd, { ...options, calendar: labelCalendar(calendar) }, locale)
}

/** 按历法写一个时刻，时区不传时用宿主时区。`options` 里的时间字段照常由 `Intl` 写。 */
export function formatCalendarInstant(
  calendar: CalendarSystem,
  instant: Date,
  options: Intl.DateTimeFormatOptions,
  locale: string,
  timeZone?: string,
): string {
  return new Intl.DateTimeFormat(locale, {
    ...options,
    ...(timeZone === undefined ? {} : { timeZone }),
    calendar: labelCalendar(calendar),
  }).format(instant)
}

/** 按历法写两个时刻之间的范围，两端相同的字段只写一次。 */
export function formatCalendarInstantRange(
  calendar: CalendarSystem,
  start: Date,
  end: Date,
  options: Intl.DateTimeFormatOptions,
  locale: string,
  timeZone?: string,
): string {
  return new Intl.DateTimeFormat(locale, {
    ...options,
    ...(timeZone === undefined ? {} : { timeZone }),
    calendar: labelCalendar(calendar),
  }).formatRange(start, end)
}

function eraAt(calendar: CalendarSystem, pd: PlainDate, locale: string): string | undefined {
  return new Intl.DateTimeFormat(locale, { era: 'short', year: 'numeric', calendar: labelCalendar(calendar), timeZone: 'UTC' })
    .formatToParts(utcDate(pd))
    .find(part => part.type === 'era')
    ?.value
}

/** 一个历法月的第一天和最后一天是不是在不同的年号里（例如 1989 年 1 月从昭和换到平成）。 */
export function calendarMonthSpansEras(calendar: CalendarSystem, month: CalendarMonth, locale: string): boolean {
  return !isGregorianCalendar(calendar) && eraAt(calendar, month.start, locale) !== eraAt(calendar, month.end, locale)
}

/**
 * 历法月单独成行的「月份加年份」，例如 "Aban 1405 AP"，按月中那天起名。
 * 传了 `day` 并且这个月跨了年号时，改写那一天（夹在这个月里），
 * 所以 1989 年 1 月在 3 日读作昭和64年1月，在 22 日读作平成元年1月。
 */
export function formatCalendarMonthLabel(
  calendar: CalendarSystem,
  month: CalendarMonth,
  locale: string,
  day?: number,
): string {
  const labelDay = day != null && calendarMonthSpansEras(calendar, month, locale)
    ? plainDateAddDays(month.start, Math.min(Math.max(day, 1), month.length) - 1)
    : calendarMonthLabelDay(month)
  return formatStandaloneMonthYear(utcDate(labelDay), locale, labelCalendar(calendar))
}

/** 历法月自己的名字，例如 "Adar I"。按月中那天写。 */
export function formatCalendarMonthName(calendar: CalendarSystem, month: CalendarMonth, locale: string): string {
  return formatCalendarDate(calendar, calendarMonthLabelDay(month), DATE_FORMAT_MONTH_ONLY, locale)
}

/** 历法在这个语言里的名字，例如 "Persian Calendar"。宿主不支持时退回历法标识。 */
export function calendarDisplayName(calendar: CalendarSystem, locale: string): string {
  try {
    return new Intl.DisplayNames(locale, { type: 'calendar' }).of(labelCalendar(calendar)) ?? calendar
  }
  catch {
    return calendar
  }
}
