export interface ISODateRange {
  start: string
  end: string
}

export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'

const WEEKDAY_INDEX: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
}

export function resolveWeekStart(value: WeekStartsOn | number | undefined): number {
  if (value == null)
    return 0
  if (typeof value === 'number')
    return ((value % 7) + 7) % 7
  return WEEKDAY_INDEX[value.toLowerCase()] ?? 0
}

export function compareISODate(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

export function spanDays(start: string, end: string): number {
  const [startYear, startMonth, startDay] = start.split('-').map(Number)
  const [endYear, endMonth, endDay] = end.split('-').map(Number)
  const startUtc = Date.UTC(startYear, startMonth - 1, startDay)
  const endUtc = Date.UTC(endYear, endMonth - 1, endDay)
  return Math.round((endUtc - startUtc) / 86_400_000) + 1
}

export function orderRange(a: string, b: string): ISODateRange {
  return compareISODate(a, b) <= 0 ? { start: a, end: b } : { start: b, end: a }
}

export function isSameRange(a: ISODateRange | null, b: ISODateRange | null): boolean {
  if (a == null || b == null)
    return a === b
  return a.start === b.start && a.end === b.end
}

export function isRangeWithinSpan(range: ISODateRange, minRangeSpan = 1, maxRangeSpan?: number): boolean {
  const span = spanDays(range.start, range.end)
  if (span < minRangeSpan)
    return false
  if (maxRangeSpan != null && span > maxRangeSpan)
    return false
  return true
}

export interface RangeClickResult {
  pending: string | null
  commit: ISODateRange | null
}

/**
 * 第一次点击记下起点。第二次点击在跨度合法时提交区间。
 * 再次点击起点时，最短跨度允许单日就提交单日，否则取消这次选择。
 */
export function applyRangeClick(pending: string | null, day: string, minRangeSpan = 1, maxRangeSpan?: number): RangeClickResult {
  if (pending == null)
    return { pending: day, commit: null }
  if (pending === day) {
    if (minRangeSpan <= 1)
      return { pending: null, commit: { start: day, end: day } }
    return { pending: null, commit: null }
  }
  const range = orderRange(pending, day)
  if (!isRangeWithinSpan(range, minRangeSpan, maxRangeSpan))
    return { pending, commit: null }
  return { pending: null, commit: range }
}

export function isDayOutsideSpan(pending: string | null, day: string, minRangeSpan = 1, maxRangeSpan?: number): boolean {
  if (pending == null || pending === day)
    return false
  return !isRangeWithinSpan(orderRange(pending, day), minRangeSpan, maxRangeSpan)
}

export function formatDateRange(range: ISODateRange | null, locale: string): string {
  if (range == null)
    return ''
  const currentYear = new Date().getFullYear()
  const startYear = Number(range.start.slice(0, 4))
  const endYear = Number(range.end.slice(0, 4))
  const withYear = !(startYear === endYear && startYear === currentYear)
  const formatter = new Intl.DateTimeFormat(locale === 'zh-CN' ? 'zh-CN' : 'en', {
    month: 'short',
    day: 'numeric',
    year: withYear ? 'numeric' : undefined,
  })
  const format = (iso: string): string => {
    const [year, month, day] = iso.split('-').map(Number)
    return formatter.format(new Date(year, month - 1, day))
  }
  return `${format(range.start)} – ${format(range.end)}`
}
