import type { Ref } from 'vue'
import { onBeforeUnmount } from 'vue'
import { activateMenuItem, MENU_BOUNDARY_SELECTOR, MENU_ITEM_SELECTOR } from './menuNav.js'

/** How long after a tracked release the browser's own click is still swallowed. */
const STRAY_CLICK_MS = 400

/** How long a finger must rest on the trigger before the menu opens under it. */
const DEFAULT_LONG_PRESS_MS = 500

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
  /** A mouse press was released outside the menu with nothing acting. */
  onDismiss: () => void
  /**
   * Selector matching the ENABLED rows. A pointer over anything else inside the
   * menu (a divider, a heading, a disabled row) picks nothing.
   */
  itemSelector?: string
  /** The control that opens the menu, when a press may start there. */
  triggerRef?: Ref<HTMLElement | null>
  /**
   * A mouse pressed the trigger, or a finger rested on it for the long-press
   * delay: open the menu under the held pointer and return whether it opened.
   * Return false when the press closed an open menu instead.
   */
  onTriggerPress?: (pointerType: 'mouse' | 'pen' | 'touch') => boolean
  /**
   * Move the highlight; `null` clears it. Defaults to moving DOM focus with
   * `preventScroll` onto the row.
   */
  onHighlight?: (row: HTMLElement | null) => void
  /**
   * Act on the row under the release. Defaults to dispatching a click on the
   * row that carries the release button and modifier keys.
   */
  onActivate?: (row: HTMLElement, release: PointerEvent) => void
  /** How long a finger must rest on the trigger before the menu opens under it. */
  longPressDelayMs?: number
}

export interface MenuPress {
  /** Attach to the menu root's `pointerdown`. */
  onPointerDown: (event: PointerEvent) => void
  /** Spread onto the menu root: claims presses that begin inside it. */
  menuProps: {
    'onPointerDown': (event: PointerEvent) => void
    'data-astryx-menu-press': string
  }
  /** Spread onto the trigger: a mouse press opens at once, a held finger opens after the delay. */
  triggerProps: {
    onPointerDown: (event: PointerEvent) => void
    onContextMenu: (event: MouseEvent) => void
  }
  /**
   * Whether the click reaching the trigger belongs to the gesture that just
   * pressed it. That press already opened or closed the menu, so the click must
   * neither toggle nor reopen.
   */
  isTriggerClickFromPress: () => boolean
  /** End the gesture in flight with nothing acting, for when the menu closes under it. */
  cancel: () => void
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
 *
 * 传了 `triggerRef` 和 `onTriggerPress` 之后，按压也可以从触发器开始：鼠标按下就开，
 * 手指按住到 `longPressDelayMs` 才开，开着的时候手指可以滑进菜单里挑行。
 */
export function useMenuPress(options: MenuPressOptions): MenuPress {
  const { menuRef, isEnabled, onDismiss } = options

  let trackedId: number | null = null
  let trackedIsMouse = false
  let trackedFromTrigger = false
  let triggerOpened = false
  let highlighted: HTMLElement | null = null
  let doc: Document | null = null
  let longPressTimer: ReturnType<typeof setTimeout> | null = null
  let triggerPressAt = 0

  function rowsSelector(): string {
    return options.itemSelector ?? MENU_ITEM_SELECTOR
  }

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
    const fromPoint = hit instanceof Element ? hit.closest(rowsSelector()) : null
    if (fromPoint != null && isRowInsideMenu(fromPoint))
      return fromPoint

    const target = event.target
    const fromTarget = target instanceof Element ? target.closest(rowsSelector()) : null
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

  function isOverTrigger(event: PointerEvent | MouseEvent): boolean {
    const trigger = options.triggerRef?.value
    if (trigger == null)
      return false
    const hit = doc?.elementFromPoint?.(event.clientX, event.clientY) ?? null
    if (hit instanceof Node && trigger.contains(hit))
      return true
    const target = event.target
    return target instanceof Node && trigger.contains(target)
  }

  function highlight(row: HTMLElement | null): void {
    if (row === highlighted)
      return
    highlighted = row
    if (options.onHighlight != null) {
      options.onHighlight(row)
      return
    }
    row?.focus({ preventScroll: true })
  }

  function activate(row: HTMLElement, release: PointerEvent): void {
    if (options.onActivate != null) {
      options.onActivate(row, release)
      return
    }
    activateMenuItem(row, release)
  }

  function trackPointer(event: PointerEvent, fromTrigger: boolean): void {
    const current = (options.menuRef.value ?? options.triggerRef?.value ?? null)?.ownerDocument ?? null
    if (current == null)
      return
    if (trackedId != null)
      endGesture()
    doc = current
    trackedId = event.pointerId
    trackedIsMouse = event.pointerType === 'mouse'
    trackedFromTrigger = fromTrigger
    triggerOpened = false
    current.addEventListener('pointermove', onDocumentPointerMove, true)
    current.addEventListener('pointerup', onDocumentPointerUp, true)
    current.addEventListener('pointercancel', onDocumentPointerCancel, true)
  }

  function onDocumentPointerMove(event: PointerEvent): void {
    if (event.pointerId !== trackedId)
      return
    // Before the hold elapses the finger is only resting on the trigger.
    if (trackedFromTrigger && !triggerOpened)
      return
    const row = rowFromEvent(event)
    if (row != null)
      highlight(row)
  }

  function onDocumentPointerUp(event: PointerEvent): void {
    if (event.pointerId !== trackedId)
      return
    const row = rowFromEvent(event)
    const wasTrigger = trackedFromTrigger
    const wasMouse = trackedIsMouse
    const hadOpened = triggerOpened
    const overTrigger = wasTrigger && isOverTrigger(event)
    const releasedOutside = !isEventInsideMenu(event)
    endGesture()
    // A finger released off a row — the menu's own padding, or the page —
    // leaves the menu open and nothing acts.
    if (row == null) {
      // Only a press that already opened or closed the menu owns its click; a
      // quick tap that never reached the hold must still reach the trigger.
      if (wasTrigger && hadOpened) {
        triggerPressAt = Date.now()
        if (wasMouse && !overTrigger && releasedOutside)
          onDismiss()
      }
      return
    }
    if (doc != null)
      armStrayClick(doc)
    activate(row, event)
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

  function clearLongPress(): void {
    if (longPressTimer != null) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }
  }

  function endGesture(): void {
    clearLongPress()
    const current = doc
    if (current != null) {
      current.removeEventListener('pointermove', onDocumentPointerMove, true)
      current.removeEventListener('pointerup', onDocumentPointerUp, true)
      current.removeEventListener('pointercancel', onDocumentPointerCancel, true)
      current.removeEventListener('mouseup', onDocumentMouseUp, true)
    }
    trackedId = null
    trackedIsMouse = false
    trackedFromTrigger = false
    triggerOpened = false
    highlighted = null
  }

  function onPointerDown(event: PointerEvent): void {
    if (!isEnabled())
      return
    // A second pointer ends the gesture with nothing acting.
    if (trackedId != null)
      endGesture()

    const target = event.target
    const row = target instanceof Element ? target.closest(rowsSelector()) : null
    if (row == null || !isRowInsideMenu(row))
      return

    trackPointer(event, false)
    highlighted = row

    // A mouse keeps the highlight on the row it landed on and lets that row's
    // own click act; only the release outside the menu is watched.
    if (trackedIsMouse) {
      doc?.removeEventListener('pointermove', onDocumentPointerMove, true)
      doc?.removeEventListener('pointerup', onDocumentPointerUp, true)
      doc?.removeEventListener('pointercancel', onDocumentPointerCancel, true)
      doc?.addEventListener('mouseup', onDocumentMouseUp, true)
    }
  }

  function onTriggerPointerDown(event: PointerEvent): void {
    const press = options.onTriggerPress
    if (press == null || !isEnabled())
      return
    // Only the primary button presses; a right-click keeps its `contextmenu` route.
    if ((event.button ?? 0) !== 0)
      return

    trackPointer(event, true)

    if (trackedIsMouse) {
      triggerOpened = press('mouse') === true
      triggerPressAt = Date.now()
      if (!triggerOpened)
        endGesture()
      return
    }

    const pointerType = event.pointerType === 'pen' ? 'pen' : 'touch'
    longPressTimer = setTimeout(() => {
      longPressTimer = null
      triggerOpened = press(pointerType) === true
      triggerPressAt = Date.now()
    }, options.longPressDelayMs ?? DEFAULT_LONG_PRESS_MS)
  }

  /**
   * Only the browser's own menu for a held finger is suppressed; a mouse's
   * right-click keeps its `contextmenu` route through the application.
   */
  function onTriggerContextMenu(event: MouseEvent): void {
    if (options.onTriggerPress == null)
      return
    const pointerType = event instanceof PointerEvent ? event.pointerType : null
    if (pointerType === 'mouse')
      return
    event.preventDefault()
  }

  function isTriggerClickFromPress(): boolean {
    return triggerPressAt !== 0 && Date.now() - triggerPressAt < STRAY_CLICK_MS
  }

  function cancel(): void {
    endGesture()
  }

  onBeforeUnmount(endGesture)

  return {
    cancel,
    isTriggerClickFromPress,
    menuProps: { 'data-astryx-menu-press': '', onPointerDown },
    onPointerDown,
    triggerProps: { onContextMenu: onTriggerContextMenu, onPointerDown: onTriggerPointerDown },
  }
}
