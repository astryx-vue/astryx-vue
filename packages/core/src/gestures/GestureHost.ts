/**
 * @file GestureHost.ts
 * @input DOM touch, pointer, click, contextmenu, scroll and focus events of
 *   one document; elements with recognizers and consumers attached; the
 *   input hold's held layers (Layer/inputHold `holdsTouch`)
 * @output Exports GestureHost (the DOM side of the gesture system) and
 *   getGestureHost (one host per document)
 * @position Browser adapter of packages/core/src/gestures: turns real events
 *   into GestureArena input, and carries out what the arena decides
 *
 * FOR EVERY POINTER
 *
 * - Recognizers and press consumers attach for a mouse, a pen and a finger
 *   alike (`spec:AST-094` FR43, FR19). Where the primary pointer is coarse
 *   the host listens while something enabled could take a touch. Where it
 *   is fine, each element with an enabled recognizer or consumer keeps one
 *   passive `pointerdown` listener and the page has none; a press on it (a
 *   mouse's primary button, a pen, or a finger, whose `pointerdown` comes
 *   before its `touchstart`) installs the host's page listeners, which go
 *   once that press's contacts end and the arena has decided them, a tap
 *   that waits on a double tap included (FR24). After the last detach the
 *   host holds nothing: no listener, note, frame or timer (releaseWhenIdle).
 *   Under every pointer, an element whose recognizer claims a moving finger
 *   also keeps its blocking `touchmove`, a listener FR24 counts apart from
 *   the press's one.
 * - A press consumer takes a mouse press as a press (DEC-21): PressTracker's
 *   fine-pointer profile paints at once and brakes no scroll (FR11).
 * - The host follows the query (a tablet docking or undocking a mouse):
 *   turning fine cancels every touch in flight.
 * - `perEventPointer` (AttachOptions), from before FR43, changes nothing.
 *
 * INPUT CHANNELS
 *
 * - Fingers begin and end with Touch Events: they are the only cancelable
 *   channel (a pointer event's preventDefault cannot stop a scroll or a
 *   click), they keep arriving after the browser takes a pan (which a
 *   watcher following the scroll to the lift needs, `spec:AST-094` FR20,
 *   DEC-7), and every event lists all the fingers at once. A
 *   finger's movement is sampled from ONE channel: its `pointermove`s, once
 *   its pointerdown has paired with its touchstart (by target and
 *   position), since Chromium sends no `touchmove` until a finger has
 *   travelled about 16 px while a tap fails and a pan begins at 10; touch
 *   events sample only a finger no pointer event reported. The other
 *   channel keeps its control duties but feeds no sample.
 * - A finger's events go to the element it landed on even after that
 *   element leaves the document, and then never reach the document. Each
 *   tracked finger's target therefore gets its own listeners, and a finger
 *   the events say is no longer down is cancelled, so a re-rendered or
 *   removed target never strands a gesture.
 * - Mice and pens come from Pointer Events, with coalesced samples for
 *   velocity. A pen on an iPad also produces `stylus` touches; those are left
 *   to the pointer path, except that a claimed pen's stylus moves are
 *   cancelled as a finger's.
 * - `pointercancel` on a finger is the browser saying it took that finger
 *   for its own pan or zoom; so is a `touchmove` that can no longer be
 *   cancelled where `touch-action` let the browser pan, and a scroll above
 *   the touch.
 *
 * FINGERS
 *
 * - The host keeps one record of where each finger on the screen landed
 *   (`fingersDown()`). Finger scrolls (fingerScroll.ts) read it, and a
 *   scroll lock's page hold (pageHold.ts) asks which touches a recognizer
 *   owns; both live in their own modules, so a page that needs neither
 *   never ships them.
 *
 * TOUCHES ON MOVING ELEMENTS
 *
 * - iOS WebKit hit-tests an element a compositor animation moves where the
 *   animation started. There, at touch-down, the host resolves the moving
 *   elements (motion/presentation.ts: one style write each) and asks the
 *   engine again, so a contact goes to what is drawn under it; press
 *   trackers read `presentedRect`, and a retargeted tap clicks what it
 *   touched once, with the engine's own click cancelled or swallowed.
 *
 * WHAT THE BROWSER IS TOLD
 *
 * - Each element gets the `touch-action` its recognizers leave the browser
 *   (touchAction.ts), never wider than the element's own value (a caller's
 *   explicit `touch-action` stays in force), set inline when they attach and
 *   restored when they detach.
 * - While a finger or a pen is down, text selection and the touch callout
 *   are off only where the hold does something (`spec:AST-094` FR41): on the
 *   elements of recognizers that bring a `selectionLock`, and on a non-text
 *   input under the finger inside them (WebKit's own style makes every
 *   input selectable); restored when the contact ends. A finger or a pen
 *   takes it under any primary pointer; a mouse never does (`spec:AST-017`
 *   FR59).
 * - Each element with a recognizer that can claim a touch while it moves (a
 *   pan, a swipe, a long press that then drags, a pinch) gets a
 *   NON-passive `touchmove` listener that cancels the event only while a
 *   recognizer owns one of its touches (a pan claims when it begins, at
 *   UIKit's 10 pt, `spec:AST-094` FR17). Nothing else is ever cancelled, so a
 *   touch nobody claims scrolls exactly as it would without the system. The
 *   known cost: a scroll that BEGINS on such an element waits for a busy main
 *   thread (measured in iOS Safari; a passive listener would hand every
 *   diagonal to the scroll instead). Elements whose recognizers only claim
 *   at the lift (taps), recognizers that never claim (`claimsTouches` false)
 *   and press consumers get no blocking listener, and the listener a
 *   finger's target gets at touch-down is passive for them too, so a scroll
 *   starting on them never waits.
 * - The browser took a finger on `pointercancel`, on its first uncancelable
 *   `touchmove` where it could pan, or on a scroll above it once the finger
 *   has travelled the slop; a scroll under a finger that has not moved is
 *   the page's own and leaves the touch alone.
 * - A lift whose click must not happen cancels its `touchend` (no click, no
 *   compatibility mouse events) and arms the shared click guard
 *   (utils/clickGuard.ts, the menu press model's too) for the browser's next
 *   click; a click held for a recognizer that may still recognize is
 *   replayed if they all fail. Keyboard and assistive-technology clicks
 *   (`detail === 0`) always pass.
 * - A `contextmenu` while a recognizer owns a touch, or while a press
 *   consumer holds the menu closed (`holdsContextMenu`), is cancelled. So a
 *   long press never also opens the browser's menu.
 * - When the app loses focus (a window blur, a hidden page), every touch in
 *   flight is cancelled, as in UIKit; a finger the browser keeps alive lifts
 *   on nothing: its `touchend` is cancelled (`spec:AST-094` FR28).
 *
 * SSR-safe: nothing touches `window` or `document` until something attaches.
 *
 * SYNC: When modified, update GestureHost.test.ts and README.md.
 */

import type { StylusTouch } from './hostHelpers'
import type {
  GestureTouch,
} from './types'

import {
  UIKIT_LONG_PRESS,
} from '../motion/uikit/gestures'
import {
  armClickGuard,
  disarmClickGuard,
  withoutClickGuard,
} from '../utils/clickGuard'
import { isElement, isNode } from '../utils/nodeType'

import { eventTime, isPanRecognizer, landedOn, touchesOf } from './hostHelpers'
import { HostPointer } from './hostPointer'
import { gestureHosts } from './hostRegistry'

export type { AttachOptions, GestureHostOptions } from './hostTypes'
export { scrollTypeOf } from './hostWheel'

export class GestureHost extends HostPointer {
  protected readonly onPointerCancel = (event: PointerEvent): void => {
    this.releaseArmedPress()
    if (event.pointerType === 'touch' && this.usesTouchEvents) {
      const id
        = this.fingerPointers.get(event.pointerId)
          ?? this.touchForCancelledPointer(event)
      this.fingerPointers.delete(event.pointerId)
      this.pendingPointers.delete(event.pointerId)
      if (id != null) {
        // The pointer channel ends here while the finger keeps moving (the
        // browser scrolls with it): its touch events, now the only channel,
        // sample it, as a watcher following the scroll to the lift needs.
        this.pointerFed.delete(id)
        this.browserTook([id], eventTime(event, this.timing))
      }
      return
    }
    // A contact that ends in a cancel owes no refused lift.
    this.cancelledPointers.delete(event.pointerId)
    const id = this.pointerIds.get(event.pointerId)
    if (id != null) {
      this.pointerIds.delete(event.pointerId)
      this.pointerKinds.delete(event.pointerId)
      this.unlockSelection(id, true)
      this.retargeted.delete(id)
      const target = this.arena.getTouch(id)?.target
      const isPenHold
        = event.pointerType === 'pen'
          && this.isPenHold(id, eventTime(event, this.timing))
      this.driftedPens.delete(id)
      this.arena.cancelled([id], eventTime(event, this.timing))
      if (isPenHold) {
        this.lastPenLift = { target, time: this.arena.now() }
      }
    }
  }

  /**
   * Whether a pen contact is a hold: it stays within the long press's
   * tolerance for its duration. Only such a hold fires the platform's own
   * menu event, so the host notes no other pen's lift.
   */
  protected isPenHold(id: number, time: number): boolean {
    const touch = this.arena.getTouch(id)
    return (
      touch != null
      && !this.driftedPens.has(id)
      && time - touch.startTime >= UIKIT_LONG_PRESS.minimumPressDuration.value
    )
  }

  /**
   * A pen contact that leaves the long press's tolerance before its duration
   * is no hold, so its lift arms no menu refusal.
   */
  protected notePenDrift(id: number, x: number, y: number, time: number): void {
    const touch = this.arena.getTouch(id)
    if (
      touch != null
      && time - touch.startTime < UIKIT_LONG_PRESS.minimumPressDuration.value
      && Math.hypot(x - touch.startX, y - touch.startY)
      > UIKIT_LONG_PRESS.allowableMovement.value
    ) {
      this.driftedPens.add(id)
    }
  }

  /**
   * Which live finger a touch `pointercancel` is about. The pointer keeps
   * the target the finger landed on (implicit capture), as the Touch does;
   * among fingers on that target, the nearest. WebKit also numbers the
   * pointer like the Touch, which settles what position cannot.
   */
  protected touchForCancelledPointer(event: PointerEvent): number | null {
    let best: GestureTouch | null = null
    let bestDistance = Number.POSITIVE_INFINITY
    for (const touch of this.arena.touches) {
      if (
        touch.pointerType !== 'touch'
        || touch.phase === 'ended'
        || touch.phase === 'cancelled'
        || touch.target !== landedOn(event)
      ) {
        continue
      }
      const d = Math.hypot(touch.x - event.clientX, touch.y - event.clientY)
      if (d < bestDistance) {
        best = touch
        bestDistance = d
      }
    }
    if (best != null) {
      return best.id
    }
    return this.touchIds.get(event.pointerId) ?? null
  }

  // --- Clicks, menus, scrolls, focus -----------------------------------------

  protected replayClick(touch: GestureTouch, allowed: boolean): void {
    if (!allowed) {
      return
    }
    // The browser's own click was swallowed while recognizers decided; they
    // all failed, so the click the touch earned is delivered now.
    disarmClickGuard(this.doc)
    const target = touch.target
    const view = this.doc.defaultView
    if (!isElement(target) || !target.isConnected || view == null) {
      return
    }
    withoutClickGuard(() =>
      target.dispatchEvent(
        new view.MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: 1,
          clientX: touch.x,
          clientY: touch.y,
        }),
      ),
    )
  }

  protected readonly onContextMenu = (event: MouseEvent): void => {
    for (const touch of this.arena.touches) {
      if (
        this.arena.isClaimed(touch.id)
        || this.arena.consumerOf(touch.id)?.holdsContextMenu?.(touch.id) === true
      ) {
        event.preventDefault()
        return
      }
    }
  }

  protected noteFingersDown(event: TouchEvent): void {
    const fingers: Node[] = []
    for (const touch of touchesOf(event.touches)) {
      if ((touch as StylusTouch).touchType !== 'stylus') {
        if (isNode(touch.target)) {
          fingers.push(touch.target)
        }
      }
    }
    this.fingerTargets = fingers
    for (const listener of [...this.fingerListeners]) {
      listener()
    }
  }

  /**
   * A second finger landed somewhere (wherever: often on a plain row): a
   * pan that takes one finger only and has not claimed its touch fails, so
   * the two fingers stay the browser's pinch (WCAG 1.4.4) instead of the
   * pan claiming them midway. A drag a recognizer has claimed keeps its
   * finger: a second finger never cancels or redirects it (`spec:AST-094`
   * FR10), and no claim is released here.
   */
  protected failUnclaimedLoneFingerPans(): void {
    for (const recognizer of [...this.arena.involvedRecognizers]) {
      if (
        isPanRecognizer(recognizer)
        && recognizer.state === 'possible'
        && recognizer.maximumNumberOfTouches === 1
        && recognizer.trackedTouches.length > 0
        && recognizer.trackedTouches.every(
          touch =>
            touch.pointerType === 'touch' && !this.arena.isClaimed(touch.id),
        )
      ) {
        recognizer.cancel()
      }
    }
  }

  /** Whether a finger's drag is claimed: then two fingers make no pinch. */
  protected isFingerClaimed(): boolean {
    return this.arena.touches.some(
      touch => touch.pointerType === 'touch' && this.arena.isClaimed(touch.id),
    )
  }

  protected readonly onVisibilityChange = (): void => {
    if (this.doc.visibilityState === 'hidden') {
      this.cancelEverything(this.arena.now())
      // As at a blur: an armed press's page listeners go once nothing is left
      // to hear.
      this.releaseArmedPress()
    }
  }

  protected readonly onBlur = (): void => {
    this.cancelEverything(this.arena.now())
    // An armed press's page listeners go once nothing is left to hear. A pen
    // or a pointer-read finger the blur cancelled still owes its lift.
    this.releaseArmedPress()
  }

  /** Whether the browser sends Touch Events at all (`ontouchstart`). */
  protected sendsTouchEvents(): boolean {
    const view = this.doc.defaultView
    return view != null && 'ontouchstart' in view
  }

  /**
   * Whether the host reads fingers from their pointer events: Pointer Events
   * input, or a window with no `ontouchstart` (touch emulation turned on
   * after load), as the move path does.
   */
  protected readsFingersFromPointerEvents(): boolean {
    const view = this.doc.defaultView
    return (
      this.inputMode === 'pointer-events'
      || (view != null && !('ontouchstart' in view))
    )
  }

  /**
   * The lift of a contact the lost focus cancelled: its click is refused,
   * and a finger's touchend after it is cancelled.
   */
  protected refuseCancelledLift(event: PointerEvent): void {
    armClickGuard(this.doc, { takesLateMouse: event.pointerType === 'touch' })
    if (event.pointerType === 'touch') {
      // Noted as a claimed lift is: capped, and gone after its time.
      this.noteClaimedLift(event)
    }
  }

  /** The app lost focus: UIKit cancels every touch in flight. */
  protected cancelEverything(time: number): void {
    // The browser may keep a pen or a pointer-read finger down: its lift must
    // not click. A mouse button held through the blur keeps its click.
    for (const [pointerId, kind] of this.pointerKinds) {
      if (kind !== 'mouse') {
        this.cancelledPointers.set(pointerId, kind)
      }
    }
    const ids = [...this.pointerIds.values()]
    for (const id of ids) {
      this.unlockSelection(id, true)
    }
    for (const identifier of [...this.touchIds.keys()]) {
      // The browser may keep the touch alive: its lift must not click.
      this.cancelledFingers.add(identifier)
      const id = this.forgetFinger(identifier)
      if (id != null) {
        ids.push(id)
      }
    }
    this.pointerIds.clear()
    this.pointerKinds.clear()
    this.driftedPens.clear()
    this.retargeted.clear()
    this.fingerPointers.clear()
    this.pendingPointers.clear()
    this.unpairedTouches.clear()
    this.lastFed.clear()
    this.pointerFed.clear()
    this.liftStamps.clear()
    // A trackpad pan a recognizer still drives is cancelled with them.
    ids.push(...this.dropDrivenWheel())
    if (ids.length > 0) {
      this.arena.cancelled(ids, time)
    }
  }
}

/** The gesture host of a document, created on first use. */
export function getGestureHost(doc: Document): GestureHost {
  let host = gestureHosts.get(doc)
  if (host == null) {
    host = new GestureHost(doc)
    gestureHosts.set(doc, host)
  }
  return host
}
