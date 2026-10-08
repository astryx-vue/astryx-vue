import type { Ref } from 'vue'
import { onBeforeUnmount } from 'vue'
import { activateMenuItem, MENU_BOUNDARY_SELECTOR, MENU_ITEM_SELECTOR } from './menuNav.js'

/** How long after a tracked release the browser's own click is still swallowed. */
const STRAY_CLICK_MS = 400

interface StrayClickSwallower {
  doc: Document
  isArmed: boolean
  timer: ReturnType<typeof setTimeout> | null
}

let swallower: StrayClickSwallower | null = null

function disarmStrayClick(): void {
  if (swallower == null)
    return
  swallower.isArmed = false
  if (swallower.timer != null) {
    clearTimeout(swallower.timer)
    swallower.timer = null
  }
}

function onWindowClickCapture(event: MouseEvent): void {
  if (swallower == null || !swallower.isArmed)
    return
  // A keyboard's or a screen reader's activation reports `detail` 0, as does
  // this model's own dispatch. Neither is the browser's stray click.
  if (event.detail === 0)
    return
  event.preventDefault()
  event.stopImmediatePropagation()
  disarmStrayClick()
}

/**
 * Swallow the browser's compatibility click for a gesture the press model
 * already acted on. The listener sits on the window in the capture phase, so
 * it runs ahead of any listener the application or the row itself installed.
 */
function armStrayClick(doc: Document): void {
  const view = doc.defaultView
  if (view == null)
    return
  if (swallower == null || swallower.doc !== doc) {
    if (swallower != null) {
      swallower.doc.defaultView?.removeEventListener('click', onWindowClickCapture, true)
      swallower.doc.removeEventListener('pointerdown', disarmStrayClick, true)
    }
    view.addEventListener('click', onWindowClickCapture, true)
    doc.addEventListener('pointerdown', disarmStrayClick, true)
    swallower = { doc, isArmed: false, timer: null }
  }
  disarmStrayClick()
  swallower.isArmed = true
  swallower.timer = setTimeout(disarmStrayClick, STRAY_CLICK_MS)
}

/** Forget an armed swallower. Called when a surface unmounts and in tests. */
export function resetMenuPress(): void {
  disarmStrayClick()
}

export interface MenuPressOptions {
  /** The element carrying `role="menu"` for this level. */
  menuRef: Ref<HTMLElement | null>
  /** Whether the surface carries the press model right now. */
  isEnabled: () => boolean
  /** A mouse press that began inside the menu was released outside it. */
  onDismiss: () => void
}

export interface MenuPress {
  /** Attach to the menu root's `pointerdown`. */
  onPointerDown: (event: PointerEvent) => void
}

/**
 * The press model of a painted menu surface.
 *
 * A finger's pointer events stay with the element it landed on, so the gesture
 * is tracked at the document level by `pointerId`:
 *
 * - The highlight follows the finger.
 * - The row under the RELEASE acts, the way its own click would, carrying the
 *   release's modifiers; the browser's own click for that gesture is swallowed
 *   so the row never acts twice.
 * - A finger released outside leaves the menu open; a mouse released outside
 *   dismisses it.
 * - `pointercancel` and a second pointer end the gesture with nothing acting.
 */
export function useMenuPress(options: MenuPressOptions): MenuPress {
  const { menuRef, isEnabled, onDismiss } = options

  let trackedId: number | null = null
  let trackedIsMouse = false
  let highlighted: HTMLElement | null = null
  let doc: Document | null = null

  function isRowInsideMenu(row: Element): row is HTMLElement {
    const menu = menuRef.value
    return row instanceof HTMLElement
      && menu != null
      && menu.contains(row)
      && row.closest(MENU_BOUNDARY_SELECTOR) === menu
  }

  function rowFromEvent(event: PointerEvent | MouseEvent): HTMLElement | null {
    // A held finger keeps sending its events to the element it landed on, so
    // the point, not the target, is what says which row is under it. The
    // target is the fallback for an environment without hit testing.
    const hit = doc?.elementFromPoint?.(event.clientX, event.clientY) ?? null
    const fromPoint = hit instanceof Element ? hit.closest(MENU_ITEM_SELECTOR) : null
    if (fromPoint != null && isRowInsideMenu(fromPoint))
      return fromPoint

    const target = event.target
    const fromTarget = target instanceof Element ? target.closest(MENU_ITEM_SELECTOR) : null
    return fromTarget != null && isRowInsideMenu(fromTarget) ? fromTarget : null
  }

  function isEventInsideMenu(event: PointerEvent | MouseEvent): boolean {
    const menu = menuRef.value
    if (menu == null)
      return false
    const hit = doc?.elementFromPoint?.(event.clientX, event.clientY) ?? null
    if (hit instanceof Node && menu.contains(hit))
      return true
    const target = event.target
    return target instanceof Node && menu.contains(target)
  }

  function highlight(row: HTMLElement | null): void {
    if (row === highlighted)
      return
    highlighted = row
    row?.focus({ preventScroll: true })
  }

  function onDocumentPointerMove(event: PointerEvent): void {
    if (event.pointerId !== trackedId)
      return
    const row = rowFromEvent(event)
    if (row != null)
      highlight(row)
  }

  function onDocumentPointerUp(event: PointerEvent): void {
    if (event.pointerId !== trackedId)
      return
    const row = rowFromEvent(event)
    endGesture()
    // A finger released off a row — the menu's own padding, or the page —
    // leaves the menu open and nothing acts.
    if (row == null)
      return
    if (doc != null)
      armStrayClick(doc)
    activateMenuItem(row, event)
  }

  function onDocumentPointerCancel(event: PointerEvent): void {
    if (event.pointerId !== trackedId)
      return
    endGesture()
  }

  function onDocumentMouseUp(event: MouseEvent): void {
    const isInside = isEventInsideMenu(event)
    endGesture()
    // A mouse released outside the menu dismisses it; released inside, the
    // row's own click does the acting.
    if (!isInside)
      onDismiss()
  }

  function endGesture(): void {
    const current = doc
    if (current != null) {
      current.removeEventListener('pointermove', onDocumentPointerMove, true)
      current.removeEventListener('pointerup', onDocumentPointerUp, true)
      current.removeEventListener('pointercancel', onDocumentPointerCancel, true)
      current.removeEventListener('mouseup', onDocumentMouseUp, true)
    }
    trackedId = null
    trackedIsMouse = false
    highlighted = null
  }

  function onPointerDown(event: PointerEvent): void {
    if (!isEnabled())
      return
    // A second pointer ends the gesture with nothing acting.
    if (trackedId != null)
      endGesture()

    const target = event.target
    const row = target instanceof Element ? target.closest(MENU_ITEM_SELECTOR) : null
    if (row == null || !isRowInsideMenu(row))
      return

    highlighted = row
    trackedId = event.pointerId
    trackedIsMouse = event.pointerType === 'mouse'
    doc = menuRef.value?.ownerDocument ?? null

    if (trackedIsMouse) {
      doc?.addEventListener('mouseup', onDocumentMouseUp, true)
      return
    }
    doc?.addEventListener('pointermove', onDocumentPointerMove, true)
    doc?.addEventListener('pointerup', onDocumentPointerUp, true)
    doc?.addEventListener('pointercancel', onDocumentPointerCancel, true)
  }

  onBeforeUnmount(endGesture)

  return { onPointerDown }
}
