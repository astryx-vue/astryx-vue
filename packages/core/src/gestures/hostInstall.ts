/**
 * @file hostInstall.ts
 * @output HostInstall: Armed presses, the page listeners' install and uninstall, and the release when idle
 * @position A layer of GestureHost.ts, below HostHitTest
 */

import { watchCoarsePointer } from '../utils/coarsePointer'
import { subscribeInput } from '../utils/inputStream'
import { isNode } from '../utils/nodeType'
import { isPrimaryClick } from '../utils/primaryClick'

import { isPointerKind, PASSIVE_CAPTURE, takesTouchContacts } from './hostHelpers'
import { HostStyle } from './hostStyle'

/** Armed presses, the page listeners' install and uninstall, and the release when idle; GestureHost is the class to use. */
export abstract class HostInstall extends HostStyle {
  protected abstract cancelEverything(time: number): void
  protected abstract clearClaimedLifts(): void
  protected abstract readonly onBlur: () => void
  protected abstract readonly onPointerCancel: (event: PointerEvent) => void
  protected abstract readonly onPointerDown: (event: PointerEvent) => void
  protected abstract readonly onPointerMove: (event: PointerEvent) => void
  protected abstract readonly onPointerUp: (event: PointerEvent) => void
  protected abstract readonly onScroll: (event: Event) => void
  protected abstract readonly onTouchCancel: (event: TouchEvent) => void
  protected abstract readonly onTouchMove: (event: TouchEvent) => void
  protected abstract readonly onTouchStart: (event: TouchEvent) => void
  protected abstract readonly onVisibilityChange: () => void

  /**
   * Where the primary pointer is fine, each element with an enabled
   * recognizer or press consumer listens for a press itself: one passive
   * `pointerdown` listener on the element. The host's page listeners come at
   * that press and go once its contacts end and the arena drops their last
   * record (onIdle: a decision that waited on a timer), so an idle page has none
   * (`spec:AST-094` FR24, FR43). A finger on a touchscreen whose primary
   * pointer is fine sends its `pointerdown` before its `touchstart`, so the
   * host hears both.
   */
  protected syncArmed(): void {
    const wanted = new Set<Element>()
    if (!this.isCoarse) {
      for (const [element, registration] of this.registry) {
        const consumer = registration.consumer
        if (
          registration.recognizers.some(
            recognizer =>
              recognizer.isEnabled
              // One that takes only scroll input has no press to arm.
              && (recognizer.allowedPointerTypes == null
                || recognizer.allowedPointerTypes.size > 0),
          )
          || (consumer != null && consumer.isEnabled?.() !== false)
        ) {
          wanted.add(element)
        }
      }
    }
    for (const [element, release] of this.armedElements) {
      if (!wanted.has(element)) {
        release()
        this.armedElements.delete(element)
      }
    }
    for (const element of wanted) {
      if (this.armedElements.has(element)) {
        continue
      }
      element.addEventListener(
        'pointerdown',
        this.onArmedPress,
        PASSIVE_CAPTURE,
      )
      this.armedElements.set(element, () => {
        element.removeEventListener(
          'pointerdown',
          this.onArmedPress,
          PASSIVE_CAPTURE,
        )
      })
    }
    if (wanted.size === 0 && this.isArmedPress) {
      this.isArmedPress = false
      this.syncKeptPresses()
    }
  }

  /** A press on an armed element, a mouse's primary button, a pen or a finger: listen for this press. */
  protected readonly onArmedPress = (event: Event): void => {
    const press = event as PointerEvent
    if (
      this.isInstalled
      || !isPointerKind(press.pointerType)
      || (press.pointerType !== 'touch' && !isPrimaryClick(press))
    ) {
      return
    }
    this.isArmedPress = true
    this.syncKeptPresses()
    this.install()
    // A finger's or a pen's press brings the cancelable touchend and the
    // contextmenu canceller, as wherever the host installs, so a claimed
    // lift clicks nothing and a claimed hold opens no browser menu (FR21). A
    // mouse's press needs neither.
    if (press.pointerType !== 'mouse') {
      this.syncClaimingListeners()
    }
    // The window's capture phase is over for this event: hand it on.
    this.onPointerDown(press)
  }

  /** A kept press's blocking `touchmove` follows the armed press (syncTouchMoveListener). */
  protected syncKeptPresses(): void {
    for (const [element, registration] of this.registry) {
      if (registration.consumer?.keepsTouch != null) {
        this.syncTouchMoveListener(element, registration)
      }
    }
  }

  /**
   * A new press is a new gesture, as the click guard reads one, so the lifts
   * the blur cancelled owe nothing after it. A second finger keeps the other
   * fingers' refusals, since those fingers may still be down.
   */
  protected dropCancelledLifts(event: PointerEvent): void {
    const isSecond = event.pointerType === 'touch' && event.isPrimary === false
    for (const [pointerId, kind] of [...this.cancelledPointers]) {
      if (pointerId === event.pointerId || !(isSecond && kind === 'touch')) {
        this.cancelledPointers.delete(pointerId)
      }
    }
  }

  /**
   * After a contact ends: an armed press that is over stops listening. A
   * contact the lost focus cancelled still owes its lift, so the press is
   * not over until that lift comes. A lift the page never hears ends it at
   * the next press, or at a cancel.
   */
  protected releaseArmedPress(): void {
    if (!this.isArmedPress) {
      return
    }
    queueMicrotask(() => {
      if (
        this.isArmedPress
        && this.arena.touches.length === 0
        && this.cancelledPointers.size === 0
      ) {
        this.isArmedPress = false
        this.syncKeptPresses()
        this.syncListeners()
      }
    })
  }

  /** With nothing attached, stop listening and stop following the pointer. */
  protected uninstallIfIdle(): void {
    this.syncListeners()
    if (this.registry.size === 0 && this.retainers === 0) {
      this.uninstall()
      this.stopWatchingPointer?.()
      this.stopWatchingPointer = null
      this.releaseWhenIdle()
    }
  }

  /**
   * In the microtask after the last detach, unless something attached again
   * in the same task (a component that remounts mid-press keeps its notes):
   * nothing the host holds outlives it, no note and no pending frame or
   * timer (`spec:AST-094` FR24).
   */
  protected releaseWhenIdle(): void {
    queueMicrotask(() => {
      if (this.registry.size > 0 || this.retainers > 0) {
        return
      }
      this.cancelledFingers.clear()
      this.cancelledPointers.clear()
      this.clearClaimedLifts()
      this.cancelCallerRead?.()
      this.cancelCallerRead = null
      this.isCallerReadScheduled = false
      this.pendingCallerReads.clear()
      for (const cancel of this.ownScrollFrames.values()) {
        cancel()
      }
      this.ownScrollFrames.clear()
      this.ownedScrolls.clear()
      // A drag's hold whose press lifted in this task ends now, not a task
      // later: nothing is attached to meet its mouseup or click.
      for (const release of [...this.dragHolds]) {
        release({ isCancel: true })
      }
      this.pressSelections.clear()
      this.selectingContacts.clear()
    })
  }

  /** Read the primary pointer, and follow it while anything is attached. */
  protected watchPointer(): void {
    if (this.stopWatchingPointer != null) {
      return
    }
    const view = this.doc.defaultView
    this.isCoarse = this.isPrimaryPointerCoarse()
    this.stopWatchingPointer = this.followsPointer
      ? watchCoarsePointer(view, isCoarse => this.pointerChanged(isCoarse))
      : () => {}
  }

  /**
   * The primary pointer turned coarse or fine (a tablet docking a mouse):
   * install or remove everything, as if each attach happened now.
   */
  protected pointerChanged(isCoarse: boolean): void {
    if (isCoarse === this.isCoarse) {
      return
    }
    this.isCoarse = isCoarse
    if (!isCoarse) {
      this.cancelEverything(this.arena.now())
    }
    for (const [element, registration] of this.registry) {
      this.refresh(element, registration)
    }
    this.syncListeners()
  }

  /**
   * Whether an enabled participant could claim a touch or cancel a lift: a
   * consumer, or a recognizer that claims touches and takes a finger or a
   * pen. With only watchers, or only scroll-only recognizers
   * (`allowedPointerTypes: []`), the host's listeners are all passive.
   */
  protected hasClaimer(): boolean {
    for (const registration of this.registry.values()) {
      const consumer = registration.consumer
      if (
        (consumer != null && consumer.isEnabled?.() !== false)
        || registration.recognizers.some(
          recognizer =>
            recognizer.isEnabled
            && recognizer.claimsTouches
            && takesTouchContacts(recognizer),
        )
      ) {
        return true
      }
    }
    return false
  }

  // --- Listeners -------------------------------------------------------------

  protected install(): void {
    this.watchPointer()
    if (!this.needsInput()) {
      return
    }
    if (this.isInstalled) {
      return
    }
    const view = this.doc.defaultView
    this.isInstalled = true
    this.usesTouchEvents
      = this.inputMode === 'auto' && view != null && 'ontouchstart' in view
    if (view == null) {
      // A document without a window receives no input.
      return
    }
    // The window's capture phase, through the shared input stream
    // (utils/inputStream.ts): ahead of any document listener, so an app's
    // window-capture stopPropagation, or a document-capture
    // stopImmediatePropagation registered first, no longer hides a touch
    // from the recognizers. A recognizer that must claim mid-gesture still
    // needs the touch to reach its element, where its blocking touchmove
    // sits. Only the listeners that cancel are non-passive, and only while a
    // claimer is attached (syncClaimingListeners); none of them is a
    // touchstart or touchmove, so none of them holds a scroll.
    this.unsubscribers = [
      // Pointer Events only: a finger comes from its pointer events alone. A
      // browser that has Touch Events still sends them for the same finger,
      // and reading both would track it twice (a long press needs one touch).
      ...(this.inputMode === 'auto'
        ? [
            subscribeInput(view, 'touchstart', this.onTouchStart),
            subscribeInput(view, 'touchmove', this.onTouchMove),
            subscribeInput(view, 'touchcancel', this.onTouchCancel),
          ]
        : []),
      subscribeInput(view, 'pointerdown', this.onPointerDown),
      subscribeInput(view, 'pointermove', this.onPointerMove),
      subscribeInput(view, 'pointerup', this.onPointerUp),
      subscribeInput(view, 'pointercancel', this.onPointerCancel),
      subscribeInput(view, 'scroll', this.onScroll),
      subscribeInput(view, 'visibilitychange', this.onVisibilityChange),
      // The window's own blur; an element's blur (a Node's) reaches the
      // window's capture phase too and means nothing here.
      subscribeInput(view, 'blur', (event) => {
        if (!isNode(event.target)) {
          this.onBlur()
        }
      }),
    ]
    // Passive until a claimer is attached (syncClaimingListeners).
    this.isClaimingInstalled = false
    this.claimingUnsubscribers
      = this.inputMode === 'auto'
        ? [subscribeInput(view, 'touchend', this.onTouchEnd)]
        : []
  }

  protected uninstall(): void {
    if (!this.isInstalled) {
      return
    }
    this.isInstalled = false
    // Unheard from here on: no fingers to keep.
    this.fingerTargets = []
    this.isClaimingInstalled = false
    for (const unsubscribe of [
      ...this.unsubscribers.splice(0),
      ...this.claimingUnsubscribers.splice(0),
    ]) {
      unsubscribe()
    }
    this.cancelEverything(this.arena.now())
    // A claimed lift's note stays: an armed press's listeners go in the
    // microtask after its pointerup, the touchend comes after that microtask
    // in the same task (iOS and WebKit), and the element's own listener still
    // takes it (noteClaimedLift).
    this.lastTouch = null
    this.lastScroll = null
  }
}
