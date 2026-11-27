/**
 * @file reorderMarks.ts
 * @input A reorderable List's element, its rows and its handles
 * @output The private data attributes of the reorder: a handle
 *   (`data-astryx-list-reorder`), the list while it reorders
 *   (`data-astryx-reordering`), its insertion line
 *   (`data-astryx-reorder-line`), the dimmed source row
 *   (`data-astryx-reorder-source`) and the preview copy
 *   (`data-astryx-reorder-preview`)
 * @position List reorder internals: only this file writes these names.
 *   styles/list.css reads them. Not exported from the package root.
 */

const LIST_REORDER = 'data-astryx-list-reorder'
const REORDERING = 'data-astryx-reordering'
const REORDER_LINE = 'data-astryx-reorder-line'
const REORDER_SOURCE = 'data-astryx-reorder-source'
const REORDER_PREVIEW = 'data-astryx-reorder-preview'

/** Bound on a reorder handle. */
export const listReorderHandleAttrs: Readonly<Record<string, string>> = {
  [LIST_REORDER]: '',
}

export function closestReorderHandle(target: Element): HTMLElement | null {
  return target.closest<HTMLElement>(`[${LIST_REORDER}]`)
}

export function reorderHandlesIn(root: ParentNode): Element[] {
  return Array.from(root.querySelectorAll(`[${LIST_REORDER}]`))
}

/**
 * The list reorders: a drag or a reorder mode move owns its next commit, and
 * its handles show the grabbing cursor.
 */
export function markReordering(list: Element): void {
  list.setAttribute(REORDERING, '')
}

export function clearReordering(list: Element): void {
  list.removeAttribute(REORDERING)
}

export function isReordering(list: Element): boolean {
  return list.hasAttribute(REORDERING)
}

/** The list's insertion line (its `::after`) shows. */
export function showReorderLine(list: Element): void {
  list.setAttribute(REORDER_LINE, '')
}

export function hideReorderLine(list: Element): void {
  list.removeAttribute(REORDER_LINE)
}

/** The dragged row, dimmed in its place while its preview moves. */
export function markReorderSource(row: Element): void {
  row.setAttribute(REORDER_SOURCE, '')
}

export function clearReorderSource(row: Element): void {
  row.removeAttribute(REORDER_SOURCE)
}

/** The copy of the dragged row that follows the pointer. */
export function markReorderPreview(element: Element): void {
  element.setAttribute(REORDER_PREVIEW, '')
}
