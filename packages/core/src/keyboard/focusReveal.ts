/**
 * @file focusReveal.ts
 * @input A document's capture-phase `blur`, through the input stream
 * @output refuseFocusReveal, which delivers the focus moves a surface claims
 *   with `preventScroll`, and its test-only caller count
 * @position Keyboard module, internal to core. Every caller in a document
 *   shares one listener.
 */

import { subscribeInput } from '../utils/inputStream'
import { isNode } from '../utils/nodeType'
import { sharedWeakMap } from '../utils/sharedRealm'

/** The caller's rules for refuseFocusReveal. */
export interface RefuseFocusRevealOptions {
  /** Whether to claim at all just now, checked on every blur. */
  isActive?: () => boolean
  /** The control a focus move is heading to, when this caller claims it. */
  claim: (destination: EventTarget | null) => HTMLElement | null
  /** Focus left `origin` for nothing (the keyboard's Done): park it, if at all. */
  park?: (origin: EventTarget | null) => void
}

// One shared `blur` subscription per document serves every caller of
// refuseFocusReveal in it, so listeners do not grow with the number of
// instances. The first caller adds it, and the last removes it.
const focusTakeovers = sharedWeakMap<
  Document,
  {
    stop: () => void
    callers: Set<(event: FocusEvent) => void>
  }
>('keyboard/keyboard-height/focus-takeovers', 1)

/**
 * Delivers the focus moves `claim` accepts with `preventScroll`, so the
 * browser never reveals their destination itself. It stops when the caller
 * runs the returned function.
 *
 * The browser dispatches `blur` in the capture phase ahead of its own focus
 * step, and `blur` names the destination in `relatedTarget`. Focusing it there
 * with preventScroll settles the change. The browser's step then finds the
 * element already active, so it dispatches nothing further and reveals
 * nothing.
 *
 * @example
 * ```
 * const stop = refuseFocusReveal(document, {
 *   claim: target => findTextEntryControl(target, body),
 *   park: () => sheet.focus({preventScroll: true}),
 * });
 * ```
 */
export function refuseFocusReveal(
  doc: Document,
  { isActive, claim, park }: RefuseFocusRevealOptions,
): () => void {
  const onBlur = (event: FocusEvent): void => {
    if (isActive != null && !isActive()) {
      return
    }
    const destination = claim(event.relatedTarget)
    if (destination != null) {
      if (destination !== doc.activeElement) {
        destination.focus({ preventScroll: true })
      }
      return
    }
    if (event.relatedTarget == null) {
      park?.(event.target)
    }
  }
  let shared = focusTakeovers.get(doc)
  if (shared == null) {
    const view = doc.defaultView
    if (view == null) {
      return () => {}
    }
    const callers = new Set<(event: FocusEvent) => void>()
    // Callers hear each blur in the order they came, as separate listeners
    // would; one that stopped during this blur no longer hears it.
    const listener = (event: FocusEvent): void => {
      for (const caller of [...callers]) {
        if (callers.has(caller)) {
          caller(event)
        }
      }
    }
    // `blur` does not bubble: only the capture phase hears every one, and it
    // runs before the browser's own focus step. The window's own blur moves
    // no focus inside the document.
    const stop = subscribeInput(view, 'blur', (event) => {
      if (isNode(event.target)) {
        listener(event)
      }
    })
    shared = { stop, callers }
    focusTakeovers.set(doc, shared)
  }
  shared.callers.add(onBlur)
  return () => {
    const current = focusTakeovers.get(doc)
    if (current == null || !current.callers.delete(onBlur)) {
      return
    }
    if (current.callers.size === 0) {
      current.stop()
      focusTakeovers.delete(doc)
    }
  }
}

/**
 * Test-only: how many callers refuse the focus reveal in `doc`, through its
 * one shared subscription. Not part of the runtime API.
 *
 * @internal
 */
export function __focusTakeoverCallersForTest(doc: Document): number {
  return focusTakeovers.get(doc)?.callers.size ?? 0
}
