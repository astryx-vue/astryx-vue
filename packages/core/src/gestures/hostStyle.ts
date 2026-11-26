/**
 * @file hostStyle.ts
 * @output HostStyle: The derived touch-action and its writes, and which listeners an element keeps
 * @position A layer of GestureHost.ts, below HostInstall
 */

import type { Registration } from './hostTypes'
import type { GestureHostStyle } from './touchAction'

import {
  presentedElements,
  watchPresentedElements,
} from '../motion/presentation'

import { containsAlongFlatTree } from '../utils/flatTree'
import { subscribeInput } from '../utils/inputStream'

import { HostAttach } from './hostAttach'
import { claimsWhileMoving, inNextFrame, isCssWideKeyword, STYLE_PROPERTIES } from './hostHelpers'

import { internals } from './recognizerInternals'
import {
  gestureHostStyle,

  intersectTouchAction,
} from './touchAction'
import {
  markTouchAction,
  TOUCH_ACTION_ATTRIBUTE,
  unmarkTouchAction,
} from './touchActionRule'

/** The derived touch-action and its writes, and which listeners an element keeps; GestureHost is the class to use. */
export abstract class HostStyle extends HostAttach {
  protected abstract hasClaimer(): boolean
  protected abstract hitTestsLayout(): boolean
  protected abstract install(): void
  protected abstract readonly onContextMenu: (event: MouseEvent) => void
  protected abstract readonly onTouchEnd: (event: TouchEvent) => void
  protected abstract readsFingersFromPointerEvents(): boolean
  protected abstract sendsTouchEvents(): boolean
  protected abstract syncArmed(): void
  protected abstract uninstall(): void

  /**
   * The element's blocking `touchmove`. For every pointer a claiming
   * recognizer keeps it: a finger's claim cancels its moves here (FR19), a
   * listener FR24 counts outside the one-listener budget a fine pointer's
   * element keeps for its press (syncArmed). A kept press needs it only
   * while a press is held: a phone's before every touch (Safari honours a
   * blocking listener only when registered before the touch began), a fine
   * pointer's only during an armed press, whose `pointerdown` comes before
   * the touch it brings (FR24).
   */
  protected syncTouchMoveListener(
    element: Element,
    registration: Registration,
  ): void {
    // Where fingers come from their pointer events (Pointer Events input, or
    // a window with no ontouchstart), a claimed finger's touchend is not the
    // host's own document listener's to cancel, so the element cancels it
    // (FR21). Under a coarse pointer always: touch emulation turned on after
    // load hides ontouchstart yet sends touches. Under a fine one wherever
    // the browser sends Touch Events, as a touchscreen laptop does (FR43);
    // elsewhere no touchend ever comes, and the element keeps no listener
    // (FR24).
    const needsEndListener
      = this.readsFingersFromPointerEvents()
        && (this.isCoarse || this.sendsTouchEvents())
        && registration.recognizers.some(
          recognizer =>
            recognizer.isEnabled && internals(recognizer).acceptsTouchInput,
        )
    if (needsEndListener && !registration.hasTouchEndListener) {
      element.addEventListener('touchend', this.onClaimedTouchEnd, {
        passive: false,
      })
      registration.hasTouchEndListener = true
    }
    else if (!needsEndListener && registration.hasTouchEndListener) {
      element.removeEventListener('touchend', this.onClaimedTouchEnd)
      registration.hasTouchEndListener = false
    }
    const needsListener
      = registration.recognizers.some(
        recognizer => recognizer.isEnabled && claimsWhileMoving(recognizer),
      )
      || (registration.consumer?.keepsTouch != null
        && registration.consumer.isEnabled?.() !== false
        && (this.isCoarse || this.isArmedPress))
    // The blocking listener sits on the element itself (FR19: a scroll that
    // starts elsewhere never waits on it), but every element shares the
    // host's one handler, which routes through the arena.
    if (needsListener && !registration.hasTouchMoveListener) {
      element.addEventListener('touchmove', this.onBlockingTouchMove, {
        passive: false,
      })
      registration.hasTouchMoveListener = true
    }
    else if (!needsListener && registration.hasTouchMoveListener) {
      element.removeEventListener('touchmove', this.onBlockingTouchMove)
      registration.hasTouchMoveListener = false
    }
    // Wheel and trackpad input, only where an enabled recognizer takes it. A
    // non-passive wheel listener makes the browser's scrolling over the
    // element wait for the main thread.
    const needsWheel = registration.recognizers.some(
      recognizer =>
        recognizer.isEnabled
        // A watcher never takes the wheel: the page keeps it.
        && recognizer.claimsTouches
        && recognizer.allowedScrollTypes.size > 0
        // A wheel drives a pan or a pinch only.
        && (internals(recognizer).family === 'pan'
          || internals(recognizer).family === 'pinch'),
    )
    if (needsWheel && !registration.hasWheelListener) {
      element.addEventListener('wheel', this.onWheel, { passive: false })
      registration.hasWheelListener = true
    }
    else if (!needsWheel && registration.hasWheelListener) {
      element.removeEventListener('wheel', this.onWheel)
      registration.hasWheelListener = false
    }
  }

  protected applyStyle(element: HTMLElement, registration: Registration): void {
    // A disabled recognizer leaves the browser everything (FR24).
    // Every pointer gets it: a touchscreen laptop's finger as a phone's (FR43).
    const active = registration.recognizers.filter(
      recognizer =>
        recognizer.isEnabled && !registration.unstyled.has(recognizer),
    )
    let style: GestureHostStyle
      = active.length > 0 ? gestureHostStyle(active) : {}
    // A control that keeps its touch (a stepper's hold-repeat) takes taps in
    // quick succession: the browser's double-tap zoom goes, as for a tap
    // recognizer (`spec:AST-094` FR18), for every pointer (FR43).
    if (
      style.touchAction == null
      && registration.consumer?.keepsTouch != null
    ) {
      style = { ...style, touchAction: 'manipulation' }
    }
    for (const key of Object.keys(
      STYLE_PROPERTIES,
    ) as (keyof GestureHostStyle)[]) {
      const property = STYLE_PROPERTIES[key]
      let value = style[key]
      if (key === 'touchAction') {
        value = this.touchActionToWrite(element, registration, value)
      }
      if (value != null) {
        if (!registration.savedStyle.has(property)) {
          registration.savedStyle.set(
            property,
            element.style.getPropertyValue(property),
          )
        }
        element.style.setProperty(property, value)
      }
      else if (registration.savedStyle.has(property)) {
        const saved = registration.savedStyle.get(property) ?? ''
        registration.savedStyle.delete(property)
        if (saved === '') {
          element.style.removeProperty(property)
        }
        else {
          element.style.setProperty(property, saved)
        }
      }
    }
  }

  /**
   * The touch-action to write inline, if any. The author's value (a
   * trigger's own `touch-action: none`) stays in force and the host never
   * allows more (spec:AST-094 FR18, DEC-8):
   * - an inline value is the style's own, read with no recalc, and the host
   *   writes what both allow, inline; a CSS-wide keyword (`initial`,
   *   `inherit`, `unset`, `revert`, `revert-layer`) names no touch-action of
   *   its own, so it is read as an author rule is, as what it resolves to;
   * - otherwise the element is marked with the derived value, under a rule
   *   any author rule outranks, as the recognizer attaches: a subtree that
   *   mounts with it is styled once, never restyled for it in a later frame.
   *   The next frame reads what is in force, styles clean, and the host
   *   writes inline only what both allow where that is narrower than an
   *   author rule's value.
   */
  protected touchActionToWrite(
    element: HTMLElement,
    registration: Registration,
    derived: string | undefined,
  ): string | undefined {
    if (derived == null) {
      unmarkTouchAction(element)
      registration.authorTouchAction = null
      return undefined
    }
    const property = STYLE_PROPERTIES.touchAction
    const inline = registration.savedStyle.has(property)
      ? (registration.savedStyle.get(property) ?? '')
      : element.style.getPropertyValue(property)
    if (inline !== '' && !isCssWideKeyword(inline)) {
      unmarkTouchAction(element)
      return intersectTouchAction(derived, inline)
    }
    if (!markTouchAction(element, derived)) {
      // No document or shadow root to hold the rule (a detached element):
      // nothing is styled there, and the next frame looks again.
      this.readCallerTouchActionInNextFrame(element)
      return undefined
    }
    const read = registration.authorTouchAction
    if (read == null || read.derived !== derived) {
      // The rule is in force until the read: the derived value, or the
      // author's where the author sets one.
      this.readCallerTouchActionInNextFrame(element)
      return undefined
    }
    if (read.author == null) {
      return undefined
    }
    const both = intersectTouchAction(derived, read.author)
    return both === read.author ? undefined : both
  }

  /**
   * Read the touch-action in force on each marked element in the next frame,
   * then apply its style again. Batched: one style read serves every pending
   * element, and the writes follow the reads. The host has written no
   * touch-action inline on them, so a value other than the mark is an author
   * rule's.
   */
  protected readCallerTouchActionInNextFrame(element: HTMLElement): void {
    this.pendingCallerReads.add(element)
    if (this.isCallerReadScheduled) {
      return
    }
    this.isCallerReadScheduled = true
    this.cancelCallerRead = inNextFrame(this.doc.defaultView, () => {
      this.isCallerReadScheduled = false
      this.cancelCallerRead = null
      const pending: [HTMLElement, Registration][] = []
      for (const candidate of this.pendingCallerReads) {
        const registration = this.registry.get(candidate)
        if (registration != null) {
          pending.push([candidate, registration])
        }
      }
      this.pendingCallerReads.clear()
      const view = this.doc.defaultView
      for (const [candidate, registration] of pending) {
        const derived = candidate.getAttribute(TOUCH_ACTION_ATTRIBUTE)
        if (derived == null || view == null) {
          continue
        }
        const inForce = view.getComputedStyle(candidate).touchAction || 'auto'
        registration.authorTouchAction = {
          derived,
          author: inForce === derived ? null : inForce,
        }
      }
      for (const [candidate, registration] of pending) {
        this.applyStyle(candidate, registration)
      }
    })
  }

  /**
   * Listen only while something could take a touch now (`spec:AST-094`
   * FR24, FR43): where the primary pointer is coarse, an enabled recognizer
   * or consumer, or a finger-scroll watch; where it is fine, only during a
   * press an element armed (syncArmed). Otherwise no document listener is
   * registered, so an idle page and a disabled control pay nothing.
   */
  protected syncListeners(): void {
    this.syncLayoutWatch()
    this.syncArmed()
    if (this.shouldListen()) {
      this.install()
      this.syncClaimingListeners()
    }
    else {
      this.uninstall()
    }
    this.syncMoverBlocking()
  }

  /**
   * Safari honours a blocking `touchmove` only where it was registered before
   * the touch began, on the engine's own target, and on iOS WebKit a finger
   * on an element a compositor animation moves lands, for the engine, on
   * whatever sits under the motion's start (see presentedTarget). So while an
   * element a recognizer that claims moving touches lives in (or around) is
   * moving, the blocking listener subscribes to the window's capturing
   * `touchmove` through the shared input stream with `{cancels: true}`,
   * which sees every touch on the page whatever the engine targets and makes
   * that one listener non-passive (`spec:AST-094` FR19;
   * architecture:react-component-runtime INV13). It leaves when the motion
   * ends: only while it is subscribed does a scroll starting anywhere wait on
   * the main thread.
   */
  protected syncMoverBlocking(): void {
    const isWatching = this.isInstalled && this.hitTestsLayout()
    if (isWatching && this.stopWatchingMovers == null) {
      this.stopWatchingMovers = watchPresentedElements(() =>
        this.syncMoverBlocking(),
      )
    }
    else if (!isWatching && this.stopWatchingMovers != null) {
      this.stopWatchingMovers()
      this.stopWatchingMovers = null
    }
    const needed
      = isWatching
        && presentedElements().some(mover =>
          this.hasClaimingRecognizerAround(mover),
        )
    if (needed === (this.stopBlockingForMovers != null)) {
      return
    }
    const view = this.doc.defaultView
    if (needed && view != null) {
      this.stopBlockingForMovers = subscribeInput(
        view,
        'touchmove',
        this.onBlockingTouchMove,
        { cancels: true },
      )
    }
    else if (!needed) {
      this.stopBlockingForMovers?.()
      this.stopBlockingForMovers = null
    }
  }

  /** Whether a recognizer that claims moving touches lives in or around `mover`. */
  protected hasClaimingRecognizerAround(mover: Element): boolean {
    if (!mover.isConnected || mover.ownerDocument !== this.doc) {
      return false
    }
    for (const [element, registration] of this.registry) {
      if (
        (containsAlongFlatTree(mover, element)
          || containsAlongFlatTree(element, mover))
        && registration.recognizers.some(
          recognizer => recognizer.isEnabled && claimsWhileMoving(recognizer),
        )
      ) {
        return true
      }
    }
    return false
  }

  /**
   * Keeps the touchend cancelable, and the contextmenu subscription on,
   * only while a claimer is attached; with only watchers the touchend is
   * passive and the contextmenu is off. Clicks are the click guard's
   * (utils/clickGuard.ts), whose one listener a window gets only once a
   * gesture first arms it.
   */
  protected syncClaimingListeners(): void {
    if (!this.isInstalled) {
      return
    }
    const isClaiming = this.hasClaimer()
    if (isClaiming === this.isClaimingInstalled) {
      return
    }
    const view = this.doc.defaultView
    for (const unsubscribe of this.claimingUnsubscribers.splice(0)) {
      unsubscribe()
    }
    if (view != null) {
      if (this.inputMode === 'auto') {
        this.claimingUnsubscribers.push(
          subscribeInput(view, 'touchend', this.onTouchEnd, {
            cancels: isClaiming,
          }),
        )
      }
      if (isClaiming) {
        this.claimingUnsubscribers.push(
          subscribeInput(view, 'contextmenu', this.onContextMenu, {
            cancels: true,
          }),
        )
      }
    }
    this.isClaimingInstalled = isClaiming
  }

  protected shouldListen(): boolean {
    if (!this.needsInput()) {
      return false
    }
    // A retainer (a finger-scroll watch) listens only where the pointer is
    // coarse: it follows a finger's scroll, which a fine pointer's page
    // leaves to the browser (FR24).
    if (this.isCoarse && this.retainers > 0) {
      return true
    }
    let isUsed = false
    for (const registration of this.registry.values()) {
      const consumer = registration.consumer
      if (
        (consumer != null && consumer.isEnabled?.() !== false)
        || registration.recognizers.some(recognizer => recognizer.isEnabled)
      ) {
        isUsed = true
        break
      }
    }
    // Where the primary pointer is fine, only while a press an element armed
    // is held (syncArmed, FR24, FR43).
    return isUsed && (this.isCoarse || this.isArmedPress)
  }
}
