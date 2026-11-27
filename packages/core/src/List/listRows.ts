/**
 * @file listRows.ts
 * @input List 的元素和它的行
 * @output 读写行顺序的纯函数：带键的行（`keyedRows`）、行加上还在退场的行（`rowSequence`）、
 *   落在一段竖直范围里的行（`rowsMeeting`）、把行放回某一行前面（`placeBefore`）
 * @position List 内部，供 listLayoutUpdates 使用
 */
import { isLeaving, itemKeyOf } from './listRowMarks.js'

/**
 * 列表里带 `itemKey` 的行，按键排好顺序。没有键的行在两次渲染之间没有身份可比，
 * 它自己的插入、移除和移动都不报告，直接变。
 */
export function keyedRows(list: HTMLElement): Map<string, HTMLElement> {
  const rows = new Map<string, HTMLElement>()
  for (const child of list.children) {
    if (!(child instanceof HTMLElement) || isLeaving(child))
      continue
    const key = itemKeyOf(child)
    if (key != null)
      rows.set(key, child)
  }
  return rows
}

/** 列表的行按顺序：带键的行，加上还在退场的行。退场行的位置按它前后的带键行来数。 */
export function rowSequence(list: HTMLElement): HTMLElement[] {
  return [...list.children].filter((child): child is HTMLElement =>
    child instanceof HTMLElement && (isLeaving(child) || itemKeyOf(child) != null))
}

/**
 * `rows` 里盒子和视口竖直范围 `start` 到 `end` 相交的第一行和最后一行的下标，
 * 一行都不相交时为 null。行在列表里自上而下排好，二分查找只读几行的位置，不读每一行。
 */
export function rowsMeeting(
  rows: ReadonlyArray<HTMLElement>,
  start: number,
  end: number,
): readonly [number, number] | null {
  let low = 0
  let high = rows.length
  while (low < high) {
    const middle = (low + high) >> 1
    if (rows[middle]!.getBoundingClientRect().bottom > start)
      high = middle
    else
      low = middle + 1
  }
  const first = low
  high = rows.length
  while (low < high) {
    const middle = (low + high) >> 1
    if (rows[middle]!.getBoundingClientRect().top < end)
      low = middle + 1
    else
      high = middle
  }
  const last = low - 1
  return first <= last ? [first, last] : null
}

/** 把 `rows` 按顺序放到 `anchor` 前面，`anchor` 为 null 时放到列表末尾。已经在位的行不动。 */
export function placeBefore(list: HTMLElement, rows: ReadonlyArray<HTMLElement>, anchor: HTMLElement | null): void {
  let next = anchor
  for (let index = rows.length - 1; index >= 0; index--) {
    const row = rows[index]!
    const before = next == null ? list.lastElementChild : next.previousElementSibling
    if (before !== row)
      list.insertBefore(row, next)
    next = row
  }
}
