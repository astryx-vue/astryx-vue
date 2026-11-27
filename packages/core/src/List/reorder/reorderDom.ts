import type { ReorderGeometry } from './reorderModel.js'
/**
 * @file reorderDom.ts
 * @input A reorderable list's element and rows
 * @output The DOM reads and writes a reorder session makes: the rows a List
 *   holds (`CHILD_ROWS`), the rows that bound the drop range, the preview
 *   copy, the insertion line, layout positions and the scroller autoscroll
 *   writes to
 * @position List reorder internals, read by the controller layers
 *   (reorderBase.ts through reorderController.ts)
 */
import type { LineSpan, Scroller } from './reorderState.js'
import type { ReorderRows } from './reorderTypes.js'
import { inertClone } from '../../motion/inertClone.js'
import { animatorFor, releaseMotion } from '../../utils/rowMotion.js'
import { nearestScroller } from '../../utils/scrollingAncestor.js'
import { isLeaving, markLeaving } from '../listRowMarks.js'
import { hideReorderLine, markReorderPreview, showReorderLine } from './reorderMarks.js'

/**
 * A mouse's travel, in px, before its press drags the row: below it the
 * press stays a click. A mouse shifts a pixel or two under the press of the
 * button itself.
 */
export const MOUSE_DRAG_SLOP = 4

/**
 * How long, ms, a handle `start` put in reorder mode takes focus back: a
 * menu item that started it hands focus to its trigger as it closes.
 */
export const START_FOCUS_CLAIM_MS = 150

/** Moves under half a pixel are layout noise. */
export const MIN_MOVE_PX = 0.5

/** The insertion line's thickness, px (the session centres it on a gap). */
export const INSERTION_LINE_THICKNESS = 2

/**
 * The temporary reduced emphasis the dragged row and its preview share: the
 * same item, moving, and not raised.
 */
export const MOVING_OPACITY = '0.6'

/**
 * Where a row's `y` is on screen at `at`: its shared animator's value, which
 * the drag writes directly (`set`) as well as through springs.
 */
export function shownY(element: HTMLElement, at: number): number {
  return animatorFor(element).get('y', at)
}

/**
 * Puts a row at rest at 0 at once. A row already at rest there takes no
 * write: the animator's `set` reads the row's style back after its write.
 */
export function settleAtRest(element: HTMLElement, value: number, moving: boolean): void {
  if (value !== 0 || moving)
    animatorFor(element).set({ y: 0 })
  releaseMotion(element, 'translate')
}

/**
 * Whether the row's label element names it: it shows text, or holds an icon
 * or image with an accessible name of its own.
 */
export function namesRow(element: HTMLElement | null): boolean {
  if (element == null)
    return false
  return (
    (element.textContent ?? '').trim() !== ''
    || element.querySelector('[aria-label]:not([aria-label=""]), [aria-labelledby], img[alt]:not([alt=""])') != null
  )
}

/** What a label element's change that can rename its row looks like. */
export const LABEL_WATCH: MutationObserverInit = {
  subtree: true,
  childList: true,
  characterData: true,
  attributes: true,
  attributeFilter: ['aria-label', 'aria-labelledby', 'alt'],
}

/** Watches `element` with `init`; returns the release. */
export function observeMutations(element: Element, init: MutationObserverInit, callback: () => void): () => void {
  if (typeof MutationObserver === 'undefined')
    return () => {}
  const observer = new MutationObserver(callback)
  observer.observe(element, init)
  return () => observer.disconnect()
}

/**
 * The list's rows: its element children. A removed row put back for its exit
 * holds no place in the order, so it is left out (`markLeaving`).
 */
function rowsOf(list: HTMLElement): HTMLElement[] {
  return Array.from(list.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement && !isLeaving(child),
  )
}

/** A List's rows: its element children. */
export const CHILD_ROWS: ReorderRows = {
  read: rowsOf,
  holds: (element, container) => element.parentElement === container,
}

/**
 * Which rows bound the drop range: the rows that cannot move at either end
 * of the list, each run of them. One in the middle is passed like any other
 * row; it only has no handle.
 */
export function boundsOf(movable: ReadonlyArray<boolean>): boolean[] {
  const bounds = movable.map(() => false)
  for (let index = 0; index < movable.length && !movable[index]; index += 1)
    bounds[index] = true
  for (let index = movable.length - 1; index >= 0 && !movable[index]; index -= 1)
    bounds[index] = true
  return bounds
}

export function sameOrder(a: ReadonlyArray<HTMLElement>, b: ReadonlyArray<HTMLElement>): boolean {
  return a.length === b.length && a.every((element, index) => element === b[index])
}

/**
 * An element the drag draws over the list: no row to the list's order or its
 * layout updates (`markLeaving`), inert and hidden from assistive technology.
 */
function overlay(element: HTMLElement): HTMLElement {
  markLeaving(element)
  element.setAttribute('aria-hidden', 'true')
  element.inert = true
  Object.assign(element.style, {
    position: 'absolute',
    margin: '0',
    pointerEvents: 'none',
    zIndex: '2',
    translate: '0px 0px',
  })
  return element
}

/**
 * A copy of `row` that takes no part in the page (`inertClone`). It has no
 * ids, names or form, so a copied checked radio leaves the row's checked. A
 * row holding a canvas that reads back empty is not copied: its bare box is.
 */
export function previewCopyOf(row: HTMLElement): HTMLElement {
  const copy = inertClone(row)
  if (copy != null)
    return copy
  const box = row.cloneNode(false) as HTMLElement
  for (const name of ['id', 'data-testid', 'name', 'for', 'autofocus'])
    box.removeAttribute(name)
  return box
}

/**
 * Makes `preview`, a copy of the dragged row, its preview at its place, with
 * the same reduced emphasis as the row and no elevation. It only writes.
 */
export function previewOf(preview: HTMLElement, top: number, span: LineSpan, background: string | null): HTMLElement {
  markReorderPreview(preview)
  overlay(preview)
  Object.assign(preview.style, {
    top: `${top}px`,
    insetInlineStart: `${span.start}px`,
    inlineSize: `${span.size}px`,
    boxSizing: 'border-box',
    boxShadow: 'none',
    opacity: MOVING_OPACITY,
    // It moves by translate from its first move. With its own will-change,
    // its animator reads no stylesheet to keep one.
    willChange: 'translate',
  })
  if (background != null)
    preview.style.backgroundColor = background
  return preview
}

/** The list's custom properties that place its insertion line. */
const LINE_Y = '--astryx-reorder-line-y'
const LINE_START = '--astryx-reorder-line-start'
const LINE_SIZE = '--astryx-reorder-line-size'

/** A row's layout top inside the list (transforms ignored). */
export function layoutTop(row: HTMLElement, list: HTMLElement): number {
  const base = row.offsetParent === list ? 0 : list.offsetTop
  return row.offsetTop - base
}

/** A row's layout left inside the list (transforms ignored). */
function layoutLeft(row: HTMLElement, list: HTMLElement): number {
  const base = row.offsetParent === list ? 0 : list.offsetLeft
  return row.offsetLeft - base
}

/**
 * An extent that starts `left` px from the list's left edge, as an inline
 * start and size. In right-to-left, the start counts from the right edge.
 */
function inlineSpanOf(left: number, size: number, list: HTMLElement): LineSpan {
  const isRtl = getComputedStyle(list).direction === 'rtl'
  return { start: isRtl ? list.clientWidth - left - size : left, size }
}

/**
 * The span of `row` in `list`'s coordinates, read before anything in the
 * frame writes a style. The list may not be the row's offset parent yet.
 */
export function lineSpanOf(row: HTMLElement, list: HTMLElement): LineSpan {
  return inlineSpanOf(layoutLeft(row, list), row.offsetWidth, list)
}

/**
 * The preview's span: `row`'s, from the list's padding edge, where the
 * preview sits once the list is positioned. Read before the drag writes.
 */
export function previewSpanOf(row: HTMLElement, list: HTMLElement): LineSpan {
  const border = row.offsetParent === list ? 0 : list.clientLeft
  return inlineSpanOf(layoutLeft(row, list) - border, row.offsetWidth, list)
}

/**
 * Shows the list's insertion line (its `::after`) across `span`, centred on
 * `center` in list coordinates. It only writes, so a crossing lays nothing
 * out.
 */
export function showLine(list: HTMLElement, span: LineSpan, center: number): void {
  list.style.setProperty(LINE_START, `${span.start}px`)
  list.style.setProperty(LINE_SIZE, `${span.size}px`)
  list.style.setProperty(LINE_Y, `${center - INSERTION_LINE_THICKNESS / 2}px`)
  showReorderLine(list)
}

/** Hides the list's insertion line and clears what placed it. */
export function hideLine(list: HTMLElement): void {
  hideReorderLine(list)
  for (const property of [LINE_Y, LINE_START, LINE_SIZE])
    list.style.removeProperty(property)
}

/**
 * Where the insertion line's centre sits for the dragged row at `position`.
 * It sits in the gap before the row it would land above, or after the one it
 * would land below. Null at its own place: nothing moves.
 */
export function lineCenter(geometry: ReorderGeometry, dragged: number, position: number): number | null {
  if (position === dragged)
    return null
  const target = geometry.rows[position]!
  return position < dragged
    ? target.top - geometry.gap / 2
    : target.top + target.height + geometry.gap / 2
}

export function isTransparent(color: string): boolean {
  return color === '' || color === 'transparent' || /^rgba\(.*,\s*0\)$/.test(color) || /\/\s*0\)$/.test(color)
}

/** The element autoscroll writes to and its visible band in the viewport. */
export function scrollerOf(list: HTMLElement): Scroller {
  const doc = list.ownerDocument
  const element = nearestScroller(list)
  if (element !== (doc.scrollingElement ?? doc.documentElement)) {
    const rect = element.getBoundingClientRect()
    const top = rect.top + element.clientTop
    return {
      element,
      top,
      bottom: top + element.clientHeight,
      max: element.scrollHeight - element.clientHeight,
      position: element.scrollTop,
    }
  }
  const view = doc.defaultView
  const height = view?.innerHeight ?? element.clientHeight
  return {
    element,
    top: 0,
    bottom: height,
    max: Math.max(0, element.scrollHeight - height),
    position: element.scrollTop,
  }
}
