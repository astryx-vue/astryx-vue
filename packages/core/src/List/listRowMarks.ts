/**
 * @file listRowMarks.ts
 * @input List 的行元素
 * @output 行身上的三个内部标记：行的 `itemKey`（`itemKeyAttrs`、`itemKeyOf`）、
 *   放回页面播退场的行（`markLeaving`、`isLeaving`）、从反向移动的行上方滑过的行（`markTravelling`）
 * @position List 内部：只有这个文件写这些属性名。ListItem 写行的键，listLayoutUpdates 读写其余两个，
 *   list.css 按 `data-astryx-travelling` 把行抬高。不从包入口导出。
 */

const ITEM_KEY = 'data-astryx-item-key'
const LEAVING = 'data-astryx-leaving'
const TRAVELLING = 'data-astryx-travelling'

/** 绑在 List 的行上：有 `itemKey` 时把它写成行的标记。 */
export function itemKeyAttrs(itemKey: string | number | undefined): Readonly<Record<string, string>> {
  return itemKey == null ? {} : { [ITEM_KEY]: String(itemKey) }
}

/** 行带着的键；没有键时为 null。 */
export function itemKeyOf(row: Element): string | null {
  return row.getAttribute(ITEM_KEY)
}

/** 标记一行已经离开、只是放回页面播退场：之后的更新不再把它算作行。 */
export function markLeaving(row: Element): void {
  row.setAttribute(LEAVING, '')
}

export function isLeaving(row: Element): boolean {
  return row.hasAttribute(LEAVING)
}

/** 每行最近一次的滑过标记：早先那次滑动结束时不会摘掉后来的标记。 */
const travels = new WeakMap<Element, object>()

/**
 * 把 `row` 标成正在从反向移动的行上方滑过，返回滑动结束时摘掉标记的调用。
 * 之后又标了一次时，这个调用不再摘。
 */
export function markTravelling(row: Element): () => void {
  const mark = {}
  travels.set(row, mark)
  row.setAttribute(TRAVELLING, '')
  return () => {
    if (travels.get(row) === mark) {
      travels.delete(row)
      row.removeAttribute(TRAVELLING)
    }
  }
}
