import type { DateTimeRange, OperatorValue } from './types.js'
import { dateTimeLocalToUnix, unixToIsoDate } from './dates.js'
import { resolveDateTimeRangePart } from './range.js'

/**
 * 日期值读写用的时区。
 *
 * 只有一个日历日（`isDateOnly` 没写或为 true）的值，按 `timeZone` 里的那一天读和写，
 * 以那一天的零点存；没给 `timeZone` 就是 UTC 的那一天，早先没带时区写入的值日子不变。
 * 带时刻的值（`isDateOnly: false`）在 `timeZone` 里读写，没给就用查看者所在的时区，
 * 这时返回 `undefined`（`Intl` 和 `Date` 默认就是查看者的时区）。
 */
export function resolveDateZone(timeZone: string | undefined, isDateOnly: boolean): string | undefined {
  if (timeZone)
    return timeZone
  return isDateOnly ? 'UTC' : undefined
}

/** 这个运算符的绝对日期值是不是一个日历日（没写 `isDateOnly` 也算）。 */
export function isDateOnlyOperator(operatorValue: OperatorValue): boolean {
  return operatorValue.type === 'date_absolute' && operatorValue.isDateOnly !== false
}

/** 一个时刻在 `zone` 里是哪一天，写成选择框用的本地零点 `Date`。 */
export function unixToPickerDate(unixSeconds: number, zone: string | undefined): Date {
  const [year, month, day] = unixToIsoDate(unixSeconds, zone).split('-').map(Number)
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1)
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function localIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** 区间两端在 `zone` 里各是哪一天，读成日历上的本地日期。 */
export function rangeToPickerRange(range: DateTimeRange, zone: string | undefined, nowSeconds = Date.now() / 1000): { start: Date, end: Date } {
  return {
    start: unixToPickerDate(resolveDateTimeRangePart(range.start, nowSeconds), zone),
    end: unixToPickerDate(resolveDateTimeRangePart(range.end, nowSeconds), zone),
  }
}

/** 日历上选的一段日子：`zone` 里起始日零点到结束日最后一刻。 */
export function pickerRangeToRange(start: Date, end: Date, zone: string | undefined): DateTimeRange {
  return absoluteRange(localIsoDate(start), localIsoDate(end), zone)
}

/** 选择框选中的那一天，在 `zone` 里零点的时刻。 */
export function pickerDateToUnix(date: Date, zone: string | undefined): number {
  return dateTimeLocalToUnix(`${localIsoDate(date)}T00:00`, zone)
}

/** `YYYY-MM-DD` 这一天在 `zone` 里零点的时刻。 */
export function isoDateToZonedUnix(iso: string, zone: string | undefined): number {
  return dateTimeLocalToUnix(`${iso}T00:00`, zone)
}

/** `YYYY-MM-DD` 这一天在 `zone` 里的最后一秒（夏令时的 23 或 25 小时也对）。 */
export function isoDateEndToZonedUnix(iso: string, zone: string | undefined): number {
  const [year, month, day] = iso.split('-').map(Number)
  const next = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, (day ?? 1) + 1))
  const nextIso = `${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}-${pad(next.getUTCDate())}`
  return isoDateToZonedUnix(nextIso, zone) - 1
}

/** 两个 `YYYY-MM-DD` 之间的绝对区间：开始那天 `zone` 里的零点，到结束那天的最后一秒。 */
export function absoluteRange(start: string, end: string, zone: string | undefined): DateTimeRange {
  return {
    start: { type: 'ABSOLUTE', unixSeconds: isoDateToZonedUnix(start, zone) },
    end: { type: 'ABSOLUTE', unixSeconds: isoDateEndToZonedUnix(end, zone) },
  }
}
