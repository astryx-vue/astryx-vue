/**
 * @file keyboardHeight.ts
 * @input The visual viewport, the window's input stream (focus, blur,
 *   resize, scroll and touch), and the layout viewport's height
 * @output The on-screen keyboard module's height: measureKeyboardHeight,
 *   isKeyboardMeasurable, hasVirtualKeyboard, subscribeKeyboardHeight,
 *   getKeyboardHeight, isFingerOnScreen, isTextEntryControl,
 *   findTextEntryControl and NON_TEXT_INPUT_TYPES
 * @position Core's one source for the on-screen keyboard. It is internal to
 *   core and never exported from the package. The focus routes sit beside
 *   it: focusReveal.ts, revealPan.ts and tapFocus.ts.
 */

import { matchesMediaQuery } from '../utils/coarsePointer'
import { getTouches, subscribeInput } from '../utils/inputStream'
import { layoutViewportHeight } from '../utils/layoutViewport'
import { isElement, isHTMLElement, isNode } from '../utils/nodeType'
import { sharedWeakMap } from '../utils/sharedRealm'

// A shortfall smaller than this is rounding, not a keyboard.
export const KEYBOARD_EPSILON = 1
// Android's Remove animations setting, which makes Chrome report a hide in
// steps.
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
// How long a step of a hide waits for the next report. It is longer than
// Gboard's whole hide (hideMs).
const HIDE_STEP_WAIT_MS = 300
// How long a hide's steps wait in all, from the first. A toolbar's moves
// while a lower keyboard stays up cannot hold the layout longer.
const HIDE_STEP_LIMIT_MS = 1000
export const NON_TEXT_INPUT_TYPES: ReadonlySet<string> = new Set([
  'button',
  'checkbox',
  'color',
  'file',
  'hidden',
  'image',
  'radio',
  'range',
  'reset',
  'submit',
])

/**
 * Whether this window measures the keyboard: a top-level document with a
 * visual viewport. Capabilities decide it, never the user agent or the
 * pointer. The module measures a browser with its own keyboard geometry API,
 * such as Chrome on Android with the VirtualKeyboard API, the same way.
 * Its visual viewport shrinks for the keyboard while the layout viewport keeps
 * its height, as everywhere else. A desktop browser's visual viewport never
 * shrinks for a keyboard, so it reads 0. Where the app sets
 * `interactive-widget=resizes-content`, Chrome shrinks the layout viewport
 * with the keyboard. The height is then 0 too, and nothing rides, because the
 * browser has made the room itself.
 */
export function isKeyboardMeasurable(win: Window): boolean {
  return win.visualViewport != null && win.self === win.top
}

/**
 * The on-screen keyboard's height over the layout viewport, CSS px. It is 0
 * when none is shown, also while pinch-zoomed, and wherever
 * `isKeyboardMeasurable` is false.
 */
export function measureKeyboardHeight(win: Window): number {
  const viewport = win.visualViewport
  if (viewport == null || !isKeyboardMeasurable(win)) {
    return 0
  }
  const height
    = layoutViewportHeight(win) - viewport.height * (viewport.scale ?? 1)
  return height > KEYBOARD_EPSILON ? Math.round(height * 100) / 100 : 0
}

/** A report from the keyboard module, in the order the window raised them. */
export type KeyboardHeightEvent
  = | {
    /** The visual viewport or the window changed size or position. */
    type: 'viewport'
    /** The keyboard height after this report. */
    height: number
    /** The report's event time (the document timeline). */
    timeStamp: number
  }
  | {
    /** Focus moved into (`focusin`) or out of (`focusout`) `target`. */
    type: 'focusin' | 'focusout'
    height: number
    timeStamp: number
    target: EventTarget | null
    relatedTarget: EventTarget | null
  }

interface KeyboardStore {
  height: number
  /** The input stream's touch starts at the last hide, or null before one. */
  startsAtHide: number | null
  listeners: Set<(event: KeyboardHeightEvent) => void>
  /** The subscribers that asked for focus moves too (the layout guide). */
  focusListeners: Set<(event: KeyboardHeightEvent) => void>
  detach: (() => void) | null
  detachFocus: (() => void) | null
}

// The store holds the hide's touch count. A copy of Core with another store
// shape keeps its own store under another version.
const stores = sharedWeakMap<Window, KeyboardStore>(
  'keyboard/keyboard-height/stores',
  2,
)

function storeOf(win: Window): KeyboardStore {
  let store = stores.get(win)
  if (store == null) {
    store = {
      height: 0,
      startsAtHide: null,
      listeners: new Set(),
      focusListeners: new Set(),
      detach: null,
      detachFocus: null,
    }
    stores.set(win, store)
  }
  return store
}

/**
 * Whether `win` has the VirtualKeyboard API, as Chrome on Android does. The
 * keyboard layout guide reads Chrome's profile there (keyboardProfileOf).
 */
export function hasVirtualKeyboard(win: Window): boolean {
  return 'virtualKeyboard' in win.navigator
}

// Whether a report of `height` is one step of a hide. Under Remove
// animations, Chrome on Android reports a hide as several lower keyboards
// that are still up, before the report of none.
function isHideStep(win: Window, shown: number, height: number): boolean {
  return (
    height > KEYBOARD_EPSILON
    && height < shown - KEYBOARD_EPSILON
    && hasVirtualKeyboard(win)
    && matchesMediaQuery(win, REDUCED_MOTION_QUERY)
  )
}

function attach(win: Window, store: KeyboardStore): () => void {
  const viewport = win.visualViewport
  store.height = measureKeyboardHeight(win)
  // Set while a step of a hide waits. The store keeps the height it reported,
  // so every reader lays out once, when the keyboard comes to rest.
  let stepTimer: ReturnType<typeof setTimeout> | null = null
  let stepHeight = 0
  let stepLimit = 0
  const deliver = (height: number, timeStamp: number): void => {
    if (height <= KEYBOARD_EPSILON && store.height > KEYBOARD_EPSILON) {
      store.startsAtHide = getTouches(win).starts
    }
    store.height = height
    const report: KeyboardHeightEvent = { type: 'viewport', height, timeStamp }
    for (const listener of [...store.listeners]) {
      listener(report)
    }
  }
  const onViewport = (event: Event): void => {
    const height = measureKeyboardHeight(win)
    if (isHideStep(win, store.height, height)) {
      // A pan reports the same step again, and leaves the wait as it is.
      if (
        stepTimer != null
        && Math.abs(height - stepHeight) < KEYBOARD_EPSILON
      ) {
        return
      }
      const now = win.performance.now()
      if (stepTimer == null) {
        stepLimit = now + HIDE_STEP_LIMIT_MS
      }
      else {
        clearTimeout(stepTimer)
      }
      stepHeight = height
      // The report of none, a report back up, or a quiet spell ends the wait.
      stepTimer = setTimeout(
        () => {
          stepTimer = null
          deliver(measureKeyboardHeight(win), win.performance.now())
        },
        Math.min(HIDE_STEP_WAIT_MS, stepLimit - now),
      )
      return
    }
    if (stepTimer != null) {
      clearTimeout(stepTimer)
      stepTimer = null
    }
    deliver(height, event.timeStamp)
  }
  viewport?.addEventListener('resize', onViewport)
  viewport?.addEventListener('scroll', onViewport)
  // Only the window's own resize reports: a window's own event has no node as
  // its target.
  const stopResize = subscribeInput(win, 'resize', (event) => {
    if (!isNode(event.target)) {
      onViewport(event)
    }
  })
  return () => {
    if (stepTimer != null) {
      clearTimeout(stepTimer)
      stepTimer = null
    }
    viewport?.removeEventListener('resize', onViewport)
    viewport?.removeEventListener('scroll', onViewport)
    stopResize()
  }
}

// Focus moves are heard only while a subscriber asks for them. A viewport
// reader, such as a Tall BottomSheet's hook under any pointer, adds no focus
// listener.
function attachFocus(win: Window, store: KeyboardStore): () => void {
  const onFocus = (event: FocusEvent): void => {
    const report: KeyboardHeightEvent = {
      type: event.type === 'focusin' ? 'focusin' : 'focusout',
      height: store.height,
      timeStamp: event.timeStamp,
      target: event.target,
      relatedTarget: event.relatedTarget,
    }
    for (const listener of [...store.focusListeners]) {
      listener(report)
    }
  }
  const stopFocusIn = subscribeInput(win, 'focusin', onFocus)
  const stopFocusOut = subscribeInput(win, 'focusout', onFocus)
  return () => {
    stopFocusIn()
    stopFocusOut()
  }
}

/**
 * Calls `listener` with every report of `win`'s keyboard until the caller
 * runs the returned function. It reports the viewport's changes, and focus
 * moves too when the caller sets `focus`. All subscribers of a window share
 * one set of listeners, and its focus listeners exist only while a subscriber
 * asks for focus moves.
 *
 * @example
 * ```
 * const stop = subscribeKeyboardHeight(window, event => {
 *   if (event.type === 'viewport') layout(event.height);
 * });
 * ```
 */
export function subscribeKeyboardHeight(
  win: Window,
  listener: (event: KeyboardHeightEvent) => void,
  { focus = false }: { focus?: boolean } = {},
): () => void {
  const store = storeOf(win)
  store.listeners.add(listener)
  store.detach ??= attach(win, store)
  if (focus) {
    store.focusListeners.add(listener)
    store.detachFocus ??= attachFocus(win, store)
  }
  return () => {
    store.listeners.delete(listener)
    if (focus) {
      store.focusListeners.delete(listener)
      if (store.focusListeners.size === 0 && store.detachFocus != null) {
        store.detachFocus()
        store.detachFocus = null
      }
    }
    if (store.listeners.size === 0 && store.detach != null) {
      store.detach()
      store.detach = null
    }
  }
}

/**
 * Whether a finger is on `win`'s screen, from the input stream's count. A
 * finger that was down at the keyboard's last hide counts no more until a
 * touch starts. A touch whose target leaves the page ends at a node the
 * window never hears.
 */
export function isFingerOnScreen(win: Window): boolean {
  const startsAtHide = stores.get(win)?.startsAtHide
  const touches = getTouches(win)
  return (
    touches.fingers > 0
    && (startsAtHide == null || touches.starts !== startsAtHide)
  )
}

/**
 * `win`'s keyboard height. While the module listens, it is the height
 * measured at the last report. Every reader of a keyboard change, such as
 * each component's hook, shares that one layout read. Every change of the
 * visual viewport or the window is a report, so a reader between two reports
 * sees the current height. With nothing listening yet, the call measures the
 * height now.
 */
export function getKeyboardHeight(win: Window): number {
  const store = stores.get(win)
  return store?.detach != null ? store.height : measureKeyboardHeight(win)
}

/**
 * Whether focusing `element` brings up a keyboard for typing text. A control
 * with `inputmode="none"` brings up none.
 */
export function isTextEntryControl(
  element: Element | null,
): element is HTMLElement {
  // Reads the kind by name, so an element of another window (a same-origin
  // iframe, a Picture-in-Picture window) passes too.
  if (!isHTMLElement(element) || element.getAttribute('inputmode') === 'none') {
    return false
  }
  if (element.localName === 'textarea') {
    const textArea = element as HTMLTextAreaElement
    return !textArea.disabled && !textArea.readOnly
  }
  if (element.localName === 'input') {
    const input = element as HTMLInputElement
    return (
      !input.disabled
      && !input.readOnly
      && !NON_TEXT_INPUT_TYPES.has(
        (input.getAttribute('type') ?? 'text').toLowerCase(),
      )
    )
  }
  return element.matches('[contenteditable]:not([contenteditable="false"])')
}

/** The text-entry control inside `container` that `target` is or labels. */
export function findTextEntryControl(
  target: EventTarget | null,
  container: HTMLElement,
): HTMLElement | null {
  if (!isElement(target)) {
    return null
  }

  const direct = target.closest(
    'input, textarea, [contenteditable]:not([contenteditable="false"])',
  )
  if (container.contains(direct) && isTextEntryControl(direct)) {
    return direct
  }

  const label = target.closest('label')
  const control = isHTMLElement(label) ? label.control : null
  return container.contains(control) && isTextEntryControl(control)
    ? control
    : null
}
