/**
 * @file glidingDivider.ts
 * @position Table 内部，给行展开的滑动用。表格用合并边框时，每条边框都画在格子原本的位置，
 *   行一移动，它的分隔线会留在原地。所以只在滑动期间给移动的行做标记：格子的边框变透明
 *   （宽度不变，不会重新排版），由其中一个格子的 ::after 横跨整行画同一条线，跟着行一起走。
 *   样式写在 styles/table.css。
 */
import type { BottomEdge } from './rowDivider.js'
import { collapsedBottom } from './rowDivider.js'

export type { BottomEdge } from './rowDivider.js'

/** 行在滑动期间带的标记。 */
export const GLIDING_ATTRIBUTE = 'data-astryx-row-gliding'
/** 移动行的每个格子带的标记；画分隔线的那个格子值是 `line`。 */
const CELL_ATTRIBUTE = 'data-astryx-cell-gliding'
/** 固定列的格子不画整行的线：它有自己的背景，会盖住线。 */
const PINNED_CLASS = 'astryx-table__sticky'

/** 行滑动期间带上的分隔线参数，替身线读它们。 */
const GLIDE_DIVIDER_WIDTH = '--_table-row-glide-width'
const GLIDE_DIVIDER_STYLE = '--_table-row-glide-style'
const GLIDE_DIVIDER_COLOR = '--_table-row-glide-color'
const GLIDE_DIVIDER_OFFSET = '--_table-row-glide-offset'

/** 最后标记一行的那一批：只有它能撤掉标记。 */
const markedBy = new WeakMap<Element, symbol>()
/** 被标记元素自己的行内上边框颜色（下一行和它的格子），撤标记时还回去。 */
const inlineTopOf = new WeakMap<HTMLElement, string>()
/** 一行被标记时藏起来的边框来源，撤标记时还回去。 */
const sourcesOf = new WeakMap<Element, { bottoms: HTMLElement[], tops: HTMLElement[] }>()
/** 被标记元素自己的行内下边框颜色，撤标记时还回去。 */
const inlineColorOf = new WeakMap<HTMLElement, string>()

/**
 * 合并边框里可能画出这一行下边那条线的元素：行自己；下一行和它的格子（上边）；
 * 行是分组里最后一行时，还有分组和下一个分组。
 */
function edgeSourcesOf(row: HTMLElement): { bottoms: HTMLElement[], tops: HTMLElement[] } {
  const bottoms: HTMLElement[] = [row]
  const tops: HTMLElement[] = []
  const group = row.parentElement
  const next = row.nextElementSibling ?? group?.nextElementSibling?.firstElementChild ?? null
  if (next instanceof HTMLElement) {
    tops.push(next)
    for (const cell of next.children) {
      if (cell instanceof HTMLElement)
        tops.push(cell)
    }
  }
  if (row.nextElementSibling == null && group instanceof HTMLElement) {
    bottoms.push(group)
    const nextGroup = group.nextElementSibling
    if (nextGroup instanceof HTMLElement)
      tops.push(nextGroup)
  }
  return { bottoms, tops }
}

/**
 * 一行自己的下边框，给它移动时的替身线用；已经带着替身线的行返回 null。
 * 在滑动读取布局的地方（`animate` 的 `beforeMove`）读，赶在任何东西开始移动之前。
 */
export function rowEdge(row: Element): BottomEdge | null {
  if (row.hasAttribute(GLIDING_ATTRIBUTE) || !(row.lastElementChild instanceof HTMLTableCellElement))
    return null
  return collapsedBottom(row.lastElementChild)
}

/** 合并后的下边框在行的内边距盒下面多远（边框比行自己的宽时不是 0）。 */
export function dividerOffset(row: Element, edge: BottomEdge): number | null {
  const cell = row.lastElementChild
  if (!(cell instanceof HTMLElement))
    return null
  const cellEdge = cell.getBoundingClientRect().top + cell.clientTop + cell.clientHeight
  const rowPaddingEdge = row.getBoundingClientRect().top + row.clientTop + row.clientHeight
  return Math.floor(cellEdge) + edge.width - rowPaddingEdge
}

function markRow(row: HTMLElement, edge: BottomEdge, offset: number): void {
  row.style.setProperty(GLIDE_DIVIDER_WIDTH, `${edge.width}px`)
  row.style.setProperty(GLIDE_DIVIDER_STYLE, edge.style)
  row.style.setProperty(GLIDE_DIVIDER_COLOR, edge.color)
  row.setAttribute(GLIDING_ATTRIBUTE, '')
  const sources = edgeSourcesOf(row)
  sourcesOf.set(row, sources)
  for (const element of sources.bottoms) {
    if (!inlineColorOf.has(element)) {
      inlineColorOf.set(element, element.style.borderBottomColor)
      element.style.borderBottomColor = 'transparent'
    }
  }
  for (const element of sources.tops) {
    if (!inlineTopOf.has(element)) {
      inlineTopOf.set(element, element.style.borderTopColor)
      element.style.borderTopColor = 'transparent'
    }
  }
  row.style.setProperty(GLIDE_DIVIDER_OFFSET, `${offset}px`)
  // 往上滑的行盖住下一行留在原地的线；分组里最后一行不用。
  row.style.zIndex = row.nextElementSibling == null ? '0' : '1'
  let hasLine = false
  for (const cell of row.children) {
    const isLine: boolean = !hasLine && !cell.classList.contains(PINNED_CLASS)
    cell.setAttribute(CELL_ATTRIBUTE, isLine ? 'line' : '')
    hasLine ||= isLine
    if (cell instanceof HTMLElement) {
      inlineColorOf.set(cell, cell.style.borderBottomColor)
      cell.style.borderBottomColor = 'transparent'
    }
  }
}

function restore(element: HTMLElement, store: WeakMap<HTMLElement, string>, side: 'borderBottomColor' | 'borderTopColor'): void {
  if (store.has(element)) {
    element.style[side] = store.get(element) ?? ''
    store.delete(element)
  }
}

function unmarkRow(row: HTMLElement): void {
  row.removeAttribute(GLIDING_ATTRIBUTE)
  row.style.removeProperty('z-index')
  const { bottoms, tops } = sourcesOf.get(row) ?? { bottoms: [], tops: [] }
  sourcesOf.delete(row)
  bottoms.forEach(element => restore(element, inlineColorOf, 'borderBottomColor'))
  tops.forEach(element => restore(element, inlineTopOf, 'borderTopColor'))
  row.style.removeProperty(GLIDE_DIVIDER_OFFSET)
  for (const cell of row.children) {
    cell.removeAttribute(CELL_ATTRIBUTE)
    if (cell instanceof HTMLElement)
      restore(cell, inlineColorOf, 'borderBottomColor')
  }
  row.style.removeProperty(GLIDE_DIVIDER_WIDTH)
  row.style.removeProperty(GLIDE_DIVIDER_STYLE)
  row.style.removeProperty(GLIDE_DIVIDER_COLOR)
}

/**
 * 给变化的行和这次滑动移动的行做标记，滑动结束后撤掉。从变化的行往上、往下找，
 * 连着两行没在滑就停。`entering` 是播放入场的展开面板：它不移动，但边缘在动。
 */
export async function markGlidingRows(
  changed: HTMLElement,
  edges: ReadonlyMap<Element, BottomEdge>,
  entering: { row: HTMLElement, animation: Animation, offset?: number | null } | null,
  glideOf: (element: Element) => Animation | null,
): Promise<void> {
  const rows = new Map<HTMLElement, Animation | null>()
  const glide = glideOf(changed)
  if (glide != null)
    rows.set(changed, glide)
  for (const step of ['nextElementSibling', 'previousElementSibling'] as const) {
    let row = changed[step]
    let stillInARow = 0
    while (row instanceof HTMLElement && stillInARow < 2) {
      const animation = glideOf(row)
      if (animation != null) {
        rows.set(row, animation)
        stillInARow = 0
      }
      else {
        stillInARow += 1
      }
      row = row[step]
    }
  }
  if (entering != null)
    rows.set(entering.row, entering.animation)
  if (rows.size === 0)
    return
  const batch = Symbol('glide')
  // 先读完所有位置再写，免得每行都重新排版一次。
  const offsets = new Map<Element, number>()
  for (const row of rows.keys()) {
    const edge = edges.get(row)
    if (edge == null)
      continue
    const offset = row === entering?.row && entering.offset != null ? entering.offset : dividerOffset(row, edge)
    if (offset != null)
      offsets.set(row, offset)
  }
  for (const row of rows.keys()) {
    const edge = edges.get(row)
    if (edge != null && !row.hasAttribute(GLIDING_ATTRIBUTE))
      markRow(row, edge, offsets.get(row) ?? 0)
    markedBy.set(row, batch)
  }
  await Promise.all([...rows.values()].map(async (animation) => {
    await animation?.finished.catch(() => undefined)
  }))
  for (const row of rows.keys()) {
    if (markedBy.get(row) !== batch)
      continue
    markedBy.delete(row)
    unmarkRow(row)
  }
}
