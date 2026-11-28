/**
 * @file GestureRecognizer.ts
 * @input Touches delivered by a GestureArena
 * @output Exports GestureRecognizer, the base every recognizer extends
 *   (UIGestureRecognizer), and its options and listener types
 * @position Core of packages/core/src/gestures: subclasses interpret touches
 *   and request state changes; the arena decides whether a change is allowed
 *   (require-to-fail, exclusivity, should-begin) and applies it
 *
 * The state machine is UIKit's:
 *
 *   possible ─► began ─► changed* ─► ended | cancelled     (continuous)
 *   possible ─► ended                                       (discrete: "recognized")
 *   possible ─► failed
 *
 * A recognizer in a terminal state ignores the touches it still has and
 * returns to `possible` (its `reset()` runs) once all of them have ended,
 * exactly as UIKit resets a recognizer before the next touch sequence.
 *
 * Listeners (UIKit's target-action) fire for `began`, `changed`, `ended` and
 * `cancelled`, never for `failed`. They run synchronously inside the input
 * event, so a listener that writes a transform writes it in the same frame
 * as the input, with no component render in between.
 *
 * SYNC: When modified, update GestureArena.ts, recognizerInternals.ts and
 * README.md.
 */

import type {
  GestureEventContext,
  GestureState,
  GestureTouch,
} from './types'
import { RecognizerCore } from './recognizerCore'
import { ACTION_STATES, isActive, isTerminal, isTransitionAllowed } from './recognizerOptions'

export {
  ALL_NATIVE_TOUCH,
  isActive,
  isTerminal,
  isTransitionAllowed,
  MANIPULATION,
} from './recognizerOptions'
export type {
  GestureListener,
  GestureRecognizerOptions,
  GestureTransitionListener,
  NativeTouchBehavior,
  RecognizerKind,
  SelectionLock,
} from './recognizerOptions'

export abstract class GestureRecognizer extends RecognizerCore {
  // --- Subclass API --------------------------------------------------------

  /** New touches for this recognizer. */
  protected touchesBegan(
    _touches: ReadonlyArray<GestureTouch>,
    _event: GestureEventContext,
  ): void {}

  protected touchesMoved(
    _touches: ReadonlyArray<GestureTouch>,
    _event: GestureEventContext,
  ): void {}

  /** Touches lifted; they are removed from `touches` after this returns. */
  protected touchesEnded(
    _touches: ReadonlyArray<GestureTouch>,
    _event: GestureEventContext,
  ): void {}

  /**
   * The system or the browser took these touches. By default an active
   * gesture is cancelled and a possible one fails.
   */
  protected touchesCancelled(
    _touches: ReadonlyArray<GestureTouch>,
    _event: GestureEventContext,
  ): void {
    if (isActive(this.state)) {
      this.setState('cancelled')
    }
    else if (this.state === 'possible') {
      this.setState('failed')
    }
  }

  /**
   * The browser took these touches for its own pan or zoom (their pointer
   * stream is gone). Return true to keep observing them; by default they are
   * treated as cancelled. An observer never claims them: a drag the browser
   * took stays the browser's (FR14).
   */
  protected touchesTakenByBrowser(
    touches: ReadonlyArray<GestureTouch>,
    event: GestureEventContext,
  ): boolean {
    if (!this.claimsTouches) {
      // A watcher follows the browser's scroll to the lift.
      return true
    }
    this.touchesCancelled(touches, event)
    return false
  }

  /**
   * A touch began elsewhere (off this recognizer's hit path) while this
   * recognizer tracks touches of its own. It is not this recognizer's touch
   * and is never delivered as one; a recognizer that a foreign finger should
   * end (a menu's press slide) cancels itself here. By default nothing
   * happens.
   */
  protected touchBeganElsewhere(
    _touches: ReadonlyArray<GestureTouch>,
    _event: GestureEventContext,
  ): void {}

  /** Clear per-gesture state before the next attempt. */
  protected reset(): void {}

  /**
   * Whether a touch may join. The base checks enabled, pointer kind and
   * exclusivity of kind; subclasses narrow it (a one-finger pan ignores a
   * second finger once it is moving).
   */
  protected acceptsTouch(touch: GestureTouch): boolean {
    if (!this.isEnabled) {
      return false
    }
    if (touch.scrollType != null) {
      // Scroll input is no pointer: only the scroll types allowed count.
      return (
        this.allowedScrollTypes.has(touch.scrollType)
        && (this.options.shouldReceiveTouch?.(this, touch) ?? true)
      )
    }
    if (
      this.allowedPointerTypes != null
      && !this.allowedPointerTypes.has(touch.pointerType)
    ) {
      return false
    }
    if (this.requiresExclusiveTouchType) {
      for (const existing of this.touches.values()) {
        if (existing.pointerType !== touch.pointerType) {
          return false
        }
      }
    }
    return this.options.shouldReceiveTouch?.(this, touch) ?? true
  }

  /**
   * Ask for a state change. The arena may refuse (the recognizer fails
   * instead) or defer it until a failure requirement resolves.
   */
  protected setState(next: GestureState): void {
    if (this.arena != null) {
      this.arena.requestTransition(this, next)
    }
    else {
      this.applyState(next)
    }
  }

  /** Arm the recognizer's one timer at an absolute time on the event clock. */
  protected setTimer(deadline: number, callback: () => void): void {
    this.arena?.setTimer(this, deadline, callback)
  }

  protected clearTimer(): void {
    this.arena?.clearTimer(this)
  }

  /** The event clock's current time. */
  protected now(): number {
    return this.arena?.now() ?? 0
  }

  /**
   * Takes this recognizer's touches from the view, as a claiming winner does
   * under `cancelsTouchesInView`: the view's press ends and no click follows.
   * The touches stay unclaimed, so the page still scrolls.
   */
  protected cancelTouchesInView(): void {
    this.arena?.cancelTouchesInViewOf(this)
  }

  // --- Arena hooks (internal) ----------------------------------------------

  /** Internal. Whether this recognizer takes `touch` right now. */
  protected wantsTouch(touch: GestureTouch): boolean {
    if (this.state !== 'possible' && !isActive(this.state)) {
      return false
    }
    if (this.pending != null) {
      return false
    }
    return this.acceptsTouch(touch)
  }

  /** Internal. */
  protected deliverBegan(
    touches: ReadonlyArray<GestureTouch>,
    event: GestureEventContext,
  ): void {
    for (const touch of touches) {
      this.touches.set(touch.id, touch)
      this.seenTouchIds.add(touch.id)
    }
    this.location()
    this.touchesBegan(touches, event)
  }

  /** Internal. */
  protected deliverBeganElsewhere(
    touches: ReadonlyArray<GestureTouch>,
    event: GestureEventContext,
  ): void {
    if (isTerminal(this.state)) {
      return
    }
    this.touchBeganElsewhere(touches, event)
  }

  /** Internal. */
  protected deliverMoved(
    touches: ReadonlyArray<GestureTouch>,
    event: GestureEventContext,
  ): void {
    const own = touches.filter(touch => this.touches.has(touch.id))
    if (own.length === 0 || isTerminal(this.state)) {
      return
    }
    this.location()
    this.touchesMoved(own, event)
  }

  /** Internal. */
  protected deliverEnded(
    touches: ReadonlyArray<GestureTouch>,
    event: GestureEventContext,
  ): void {
    const own = touches.filter(touch => this.touches.has(touch.id))
    if (own.length === 0) {
      return
    }
    this.location()
    if (!isTerminal(this.state)) {
      this.touchesEnded(own, event)
    }
    for (const touch of own) {
      this.touches.delete(touch.id)
    }
  }

  /** Internal. */
  protected deliverCancelled(
    touches: ReadonlyArray<GestureTouch>,
    event: GestureEventContext,
  ): void {
    const own = touches.filter(touch => this.touches.has(touch.id))
    if (own.length === 0) {
      return
    }
    if (!isTerminal(this.state)) {
      this.touchesCancelled(own, event)
    }
    for (const touch of own) {
      this.touches.delete(touch.id)
    }
  }

  /** Internal. */
  protected deliverTakenByBrowser(
    touches: ReadonlyArray<GestureTouch>,
    event: GestureEventContext,
  ): void {
    const own = touches.filter(touch => this.touches.has(touch.id))
    if (own.length === 0) {
      return
    }
    if (!isTerminal(this.state) && this.touchesTakenByBrowser(own, event)) {
      return
    }
    for (const touch of own) {
      this.touches.delete(touch.id)
    }
  }

  /** Internal. The host's hook: listeners follow whether anything is enabled. */
  onEnabledChange: (() => void) | null = null

  /**
   * UIKit's `isEnabled` setter: turning a recognizer off mid-gesture cancels
   * the gesture (an active one) or fails it (a possible one).
   */
  setEnabled(value: boolean): void {
    const changed = this.isEnabled !== value
    this.isEnabled = value
    if (changed) {
      this.onEnabledChange?.()
    }
    if (!value && (this.state !== 'possible' || this.isInvolved())) {
      this.cancel()
    }
  }

  /** Cancel this recognizer if it is active, or fail it if it is possible. */
  cancel(): void {
    if (this.arena != null) {
      this.arena.stop(this)
    }
    else if (isActive(this.state)) {
      this.applyState('cancelled')
    }
    else if (this.state === 'possible' && this.isInvolved()) {
      // An idle recognizer stays `possible`: nothing would ever reset it.
      this.applyState('failed')
    }
  }

  /** Internal. Apply a transition the arena has approved. */
  protected applyState(next: GestureState): void {
    const from = this.stateValue
    if (from === next && next !== 'changed') {
      return
    }
    if (!isTransitionAllowed(from, next)) {
      return
    }
    this.stateValue = next
    if (next !== 'possible') {
      this.pending = null
    }
    for (const listener of [...this.transitionListeners]) {
      listener(this, from, next)
    }
    if (ACTION_STATES.has(next)) {
      for (const listener of [...this.listeners]) {
        listener(this)
      }
    }
  }

  /** Internal. Return to `possible` for the next attempt. */
  protected resetToPossible(): void {
    this.clearTimer()
    this.pending = null
    this.touches.clear()
    this.seenTouchIds.clear()
    this.reset()
    this.applyState('possible')
  }
}
