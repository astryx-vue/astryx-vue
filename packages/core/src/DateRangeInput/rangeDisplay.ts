import type { CalendarSystem } from '../utils/calendarSystem.js'
import type { PlainDate } from '../utils/plainDate.js'
import type { DateRange } from './types.js'
import { formatDateRange } from '../composables/useDateRange.js'
import { formatCalendarDate } from '../utils/calendarFormat.js'
import { calendarMonthOf, calendarYearMonthOf, isGregorianCalendar } from '../utils/calendarSystem.js'
import { DATE_FORMAT_SHORT, DATE_FORMAT_SHORT_WITH_YEAR, plainDateCreate, plainDateFromDate } from '../utils/plainDate.js'

/** 范围里的 `YYYY-MM-DD` 读成公历日期。 */
export function rangeDay(iso: string): PlainDate {
  const [year, month, day] = iso.split('-').map(Number)
  return plainDateCreate(year!, month!, day!)
}

/**
 * 按钮上的范围文字。两端和今天在同一个历法年时省掉年份；今天还不知道（服务端渲染、水合）时写出年份。
 * 公历沿用 `formatDateRange` 的写法。
 */
export function formatRangeDisplay(range: DateRange | null, locale: string, calendar: CalendarSystem, today: Date | null): string {
  if (isGregorianCalendar(calendar))
    return formatDateRange(range, locale, today?.getFullYear() ?? null)
  if (range == null)
    return ''
  const start = rangeDay(range.start)
  const end = rangeDay(range.end)
  const yearOf = (pd: PlainDate): number => calendarYearMonthOf(calendar, calendarMonthOf(calendar, pd)).year
  const sameYear = today != null && yearOf(start) === yearOf(end) && yearOf(start) === yearOf(plainDateFromDate(today))
  const options = sameYear ? DATE_FORMAT_SHORT : DATE_FORMAT_SHORT_WITH_YEAR
  return `${formatCalendarDate(calendar, start, options, locale)} – ${formatCalendarDate(calendar, end, options, locale)}`
}
