/** 一个月在时间轴上的序号，1 月是 1。 */
export function monthIndex(year: number, month: number): number {
  return year * 12 + (month - 1)
}

export function fromMonthIndex(index: number): { year: number, month: number } {
  const year = Math.floor(index / 12)
  return { year, month: index - year * 12 + 1 }
}

/** 没有最小最大日期时，从今天起前后各能翻这么多个月。 */
export const MONTH_REACH = 600

export function clampMonthIndex(index: number, min: number, max: number): number {
  return Math.min(Math.max(index, min), max)
}

/** 底部面板能翻到的月份。最小和最大日期会把窗口收进去。 */
export function reachableMonthRange(min?: Date, max?: Date, today = new Date()): { min: number, max: number } {
  const now = monthIndex(today.getFullYear(), today.getMonth() + 1)
  let low = now - MONTH_REACH
  let high = now + MONTH_REACH
  if (min)
    low = Math.max(low, monthIndex(min.getFullYear(), min.getMonth() + 1))
  if (max)
    high = Math.min(high, monthIndex(max.getFullYear(), max.getMonth() + 1))
  if (low > high)
    low = high
  return { min: low, max: high }
}
