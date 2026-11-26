import type { WeekStartsOn } from '../composables/useDateRange.js'
import { CalendarDate } from '@internationalized/date'
import { resolveWeekStart } from '../composables/useDateRange.js'

export interface CalendarMonthCursor {
  year: number
  month: number
}

export function toCalendarDate(date: Date): CalendarDate {
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

export function fromCalendarDate(date: CalendarDate): Date {
  return new Date(date.year, date.month - 1, date.day)
}

export function calendarISO(date: CalendarDate): string {
  const month = String(date.month).padStart(2, '0')
  const day = String(date.day).padStart(2, '0')
  return `${date.year}-${month}-${day}`
}

export function dateISO(date: Date): string {
  return calendarISO(toCalendarDate(date))
}

export function sameCalendarDay(a: CalendarDate, b: CalendarDate): boolean {
  return a.compare(b) === 0
}

export function calendarDiffDays(a: CalendarDate, b: CalendarDate): number {
  const start = Date.UTC(a.year, a.month - 1, a.day)
  const end = Date.UTC(b.year, b.month - 1, b.day)
  return Math.round((end - start) / 86_400_000)
}

export function monthIndex(date: CalendarMonthCursor): number {
  return date.year * 12 + date.month
}

export function shiftMonth(date: CalendarMonthCursor, amount: number): CalendarDate {
  return new CalendarDate(date.year, date.month, 1).add({ months: amount })
}

export function weekdayIndex(date: CalendarDate): number {
  return date.toDate('UTC').getUTCDay()
}

export function weekStartIndex(value: WeekStartsOn | number | undefined): number {
  return resolveWeekStart(value)
}

/** ISO week number. The Thursday of the week decides the year. */
export function isoWeekNumber(date: CalendarDate): number {
  const utc = new Date(Date.UTC(date.year, date.month - 1, date.day))
  const day = utc.getUTCDay() || 7
  utc.setUTCDate(utc.getUTCDate() + 4 - day)
  const yearStart = Date.UTC(utc.getUTCFullYear(), 0, 1)
  return Math.ceil(((utc.getTime() - yearStart) / 86_400_000 + 1) / 7)
}

export function weekFieldName(locale: string): string {
  try {
    const name = new Intl.DisplayNames(locale, { type: 'dateTimeField' }).of('weekOfYear')
    if (name)
      return name
  }
  catch {
    // Hosts without this Intl feature fall through to the English name.
  }
  return locale.startsWith('zh') ? '周' : 'week'
}

export function formatWeekdayDate(date: CalendarDate, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(fromCalendarDate(date))
}

export interface InitialCalendarFocus {
  focusDate?: Date
  selected?: Date | null
  rangeStart?: Date | null
  min?: Date
  max?: Date
  numberOfMonths: number
  today?: Date
}

/**
 * The month the calendar opens on. An explicit focus date wins and is never
 * second-guessed. Then the selection, whose month is shown even when it lies
 * outside min/max. Otherwise today is clamped into the min/max window so the
 * first paint is not an all-disabled month.
 *
 * With two months, a selection or today inside max's month still opens one
 * pane earlier, so max's month is the last pane and the panes before it keep
 * selectable days. That shift never crosses min's month.
 */
export function initialCalendarFocus(options: InitialCalendarFocus): CalendarDate {
  if (options.focusDate)
    return toCalendarDate(options.focusDate)
  const min = options.min ? toCalendarDate(options.min) : null
  const max = options.max ? toCalendarDate(options.max) : null
  const panes = options.numberOfMonths
  if (options.selected)
    return keepLastPaneWithinMax(toCalendarDate(options.selected), min, max, panes)
  if (options.rangeStart)
    return keepLastPaneWithinMax(toCalendarDate(options.rangeStart), min, max, panes)

  const today = options.today ? toCalendarDate(options.today) : toCalendarDate(new Date())
  if (min && today.compare(min) < 0)
    return min
  if (max && today.compare(max) > 0) {
    const shifted = shiftMonth(max, -(Math.max(0, panes - 1)))
    if (min && shifted.compare(new CalendarDate(min.year, min.month, 1)) < 0)
      return min
    return shifted
  }
  return keepLastPaneWithinMax(today, min, max, panes)
}

/**
 * `date` 所在的月份显示着，但后面的窗格会整个落在 max 之后时，把起始月往前挪：
 * 最后一个窗格落在 max 所在的月份，第一个窗格不早于 min 所在的月份。
 * 窗格本来就在 max 的月份结束，或者 `date` 自己的月份已经晚于 max 的月份，就原样返回。
 */
function keepLastPaneWithinMax(date: CalendarDate, min: CalendarDate | null, max: CalendarDate | null, numberOfMonths: number): CalendarDate {
  const lastPane = Math.max(0, numberOfMonths - 1)
  if (!max || lastPane === 0)
    return date
  const month = monthIndex(date)
  const maxMonth = monthIndex(max)
  const latestFirstPane = maxMonth - lastPane
  if (month <= latestFirstPane || month > maxMonth)
    return date
  const earliest = shiftMonth(max, -lastPane)
  if (!min)
    return earliest
  const minMonth = monthIndex(min)
  if (latestFirstPane >= minMonth)
    return earliest
  // min 比完整的挪动更近：只退到 min 所在的月份，date 已经在那里或更早就不动。
  return month > minMonth ? min : date
}

/** `date` 在 `start` 和 `end` 之间（含两端）。任何一端缺了就不在。 */
export function inSpan(date: CalendarDate, start: CalendarDate | null, end: CalendarDate | null): boolean {
  return !!start && !!end && date.compare(start) >= 0 && date.compare(end) <= 0
}
