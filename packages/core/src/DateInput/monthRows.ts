import type { CalendarMonth, CalendarSystem } from '../utils/calendarSystem.js'
import type { MonthWindow } from './sheetMonths.js'
import { calendarAddMonths, isGregorianAligned } from '../utils/calendarSystem.js'
import { plainDateDiffDays, plainDateIsEqual } from '../utils/plainDate.js'
import { isMonthBefore } from './sheetMonths.js'

/** 月份滚动器里的一排排月份：第 0 排是能翻到的第一个月。 */
export interface MonthRows {
  /** 一共多少个月。 */
  readonly count: number
  /** 第 `row` 排的历法月。 */
  monthAt: (row: number) => CalendarMonth
  /** 这个历法月在第几排。 */
  rowOf: (month: CalendarMonth) => number
}

/** 一个历法月的平均天数，用来先估出排号，再逐月校正。 */
const MEAN_MONTH_DAYS = 29.53

/** 月日和公历不同的历法：一个月一个月地数很慢，算过的月份记下来，找排号时从最近的已知排出发。 */
function steppedRows(calendar: CalendarSystem, window: MonthWindow): MonthRows {
  const known = new Map<number, CalendarMonth>([[0, window.min]])
  const monthAt = (row: number): CalendarMonth => {
    const cached = known.get(row)
    if (cached != null)
      return cached
    let nearest = 0
    for (const key of known.keys()) {
      if (Math.abs(key - row) < Math.abs(nearest - row))
        nearest = key
    }
    const month = calendarAddMonths(calendar, known.get(nearest)!, row - nearest)
    known.set(row, month)
    return month
  }
  const rowOf = (month: CalendarMonth): number => {
    let row = Math.round(plainDateDiffDays(window.min.start, month.start) / MEAN_MONTH_DAYS)
    for (let guard = 0; guard < 24; guard += 1) {
      const candidate = monthAt(row)
      if (plainDateIsEqual(candidate.start, month.start))
        return row
      row += isMonthBefore(candidate, month) ? 1 : -1
    }
    return row
  }
  return { count: rowOf(window.max) + 1, monthAt, rowOf }
}

export function createMonthRows(calendar: CalendarSystem, window: MonthWindow): MonthRows {
  if (!isGregorianAligned(calendar))
    return steppedRows(calendar, window)
  const base = window.min.start.year * 12 + window.min.start.month
  const rowOf = (month: CalendarMonth): number => month.start.year * 12 + month.start.month - base
  return {
    count: rowOf(window.max) + 1,
    monthAt: row => calendarAddMonths(calendar, window.min, row),
    rowOf,
  }
}

/** 滚动偏移落在第几排。从右到左时 scrollLeft 从 0 往负数走。 */
export function rowAtScrollOffset(scrollOffset: number, paneSize: number, rowCount: number, rtl = false): number {
  if (paneSize <= 0)
    return 0
  const distance = rtl ? -scrollOffset : scrollOffset
  return Math.min(Math.max(Math.round(distance / paneSize), 0), rowCount - 1)
}

/** 让第 `row` 排停在滚动区起点的偏移。 */
export function scrollOffsetForRow(row: number, paneSize: number, rtl = false): number {
  const distance = row * paneSize
  return rtl ? -distance : distance
}

/** 中心排两边各挂 `overscan` 排，首尾都含。 */
export function paneRows(centerRow: number, rowCount: number, overscan: number): number[] {
  const rows: number[] = []
  for (let row = Math.max(0, centerRow - overscan); row <= Math.min(rowCount - 1, centerRow + overscan); row += 1)
    rows.push(row)
  return rows
}
