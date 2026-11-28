/**
 * 触屏时间面板的滚轮规则（上游 TimeInput/timeWheelRules.ts 的 hourAfterTurn）：
 * 纯函数，不依赖布局。
 */

/** 24 小时制的小时对应 12 小时制滚轮上的行：0 → 12，13 → 1。 */
export function hour12From24(hour: number): number {
  return hour % 12 || 12
}

/** 12 小时制的行落在上午（0）或下午（1）时的 24 小时制小时：12 AM → 0，12 PM → 12。 */
export function hour24From12(hour: number, pm: boolean): number {
  return (hour % 12) + (pm ? 12 : 0)
}

/**
 * 12 小时制的小时滚轮从 `from`（24 小时制的小时）转到 `row`（1 … 12）停下后，时间落在几点。
 * 上下午只在这次移动经过 11 和 12 之间时翻面：滚轮不首尾相接，12 当作紧挨着 1，
 * 所以 12 和 1 到 6 之间的移动保持上下午，12 和 7 到 11 之间的移动翻面。
 *
 * 例：11 AM 转到 12 是 12 PM（12），12 PM 转到 1 是 1 PM（13），1 PM 转到 9 是 9 PM（21）。
 */
export function hourAfterTurn(from: number, row: number): number {
  const shown = hour12From24(from)
  if (row === shown)
    return from
  const isPm = from >= 12
  const passesNoon = (shown === 12 && row >= 7) || (row === 12 && shown >= 7)
  return hour24From12(row, passesNoon ? !isPm : isPm)
}
