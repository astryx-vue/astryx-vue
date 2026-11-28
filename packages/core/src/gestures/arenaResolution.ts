/**
 * @file arenaResolution.ts
 * @input Recognizers' requested transitions
 * @output ArenaResolution: UIKit's exclusivity and failure requirements,
 *   claims, and the settle pass that resolves pending recognitions
 * @position The upper layer of GestureArena.ts
 */

import type { GestureRecognizer } from './GestureRecognizer'
import type { GestureState } from './types'
import { ArenaDelivery } from './arenaDelivery'
import { isActive, isTerminal } from './GestureRecognizer'
import { internals } from './recognizerInternals'

/** Conflict resolution and claims; GestureArena is the class to use. */
export abstract class ArenaResolution extends ArenaDelivery {
  // --- Recognizer requests (internal) ----------------------------------------

  /** Internal. A recognizer asked for a state change. */
  requestTransition(recognizer: GestureRecognizer, next: GestureState): void {
    const from = recognizer.state
    if (next === 'failed') {
      this.fail(recognizer)
      return
    }
    if (
      internals(recognizer).pending != null
      && (next === 'began' || next === 'ended')
    ) {
      // Already waiting on a requirement; the recognition stands as asked.
      return
    }
    if (from === 'possible' && (next === 'began' || next === 'ended')) {
      this.attemptRecognition(recognizer, next)
      return
    }
    if (isActive(from) && (next === 'changed' || next === 'ended')) {
      this.apply(recognizer, next)
      return
    }
    if (isActive(from) && next === 'cancelled') {
      this.apply(recognizer, 'cancelled')
    }
  }

  /** Cancel an active recognizer, or fail a possible one. */
  stop(recognizer: GestureRecognizer): void {
    // A cancel from code between events happens at the last event's time:
    // wall time would run deadlines ahead of input still queued (FR16).
    const time
      = this.currentTime
        ?? (Number.isFinite(this.latestTime) ? this.latestTime : this.clock.now())
    this.run(time, () => {
      if (isActive(recognizer.state)) {
        this.apply(recognizer, 'cancelled')
      }
      else if (recognizer.state === 'possible' && recognizer.isInvolved()) {
        // An idle recognizer stays `possible`: nothing would ever reset it.
        this.fail(recognizer)
      }
    })
  }

  // --- Resolution ------------------------------------------------------------

  protected attemptRecognition(
    recognizer: GestureRecognizer,
    next: 'began' | 'ended',
  ): void {
    if (
      !internals(recognizer).shouldBegin()
      || this.isVetoedByConsumer(recognizer)
      || this.isRefusedByBrowser(recognizer)
    ) {
      this.fail(recognizer)
      return
    }
    let isWaiting = false
    for (const other of this.active) {
      if (
        other === recognizer
        || !internals(recognizer).requiresFailureOf(other)
      ) {
        continue
      }
      if (other.state === 'failed') {
        continue
      }
      if (other.state !== 'possible') {
        // The requirement recognized (or is mid-gesture): this one cannot.
        this.fail(recognizer)
        return
      }
      if (other.isInvolved()) {
        isWaiting = true
      }
    }
    if (isWaiting) {
      internals(recognizer).pending = next
      this.claim(recognizer)
      return
    }
    for (const other of this.active) {
      if (
        other !== recognizer
        // A discrete winner (`ended`) still holding its touches blocks too.
        && (isActive(other.state)
          || (other.state === 'ended' && other.trackedTouches.length > 0))
        && this.conflicts(other, recognizer)
      ) {
        this.fail(recognizer)
        return
      }
    }
    this.apply(recognizer, next)
    // Recognizing beats every possible recognizer it conflicts with, and
    // everything that required it to fail.
    for (const other of [...this.active]) {
      if (other === recognizer || other.state !== 'possible') {
        continue
      }
      if (
        internals(other).requiresFailureOf(recognizer)
        || this.conflicts(recognizer, other)
      ) {
        this.fail(other)
      }
    }
    this.claim(recognizer)
    // A watcher takes nothing from the view either: the press and the click
    // under it stay (spec:AST-094 FR11, FR19; FR15 exempts watchers). Only
    // `cancelTouchesInView` takes them, as a pager's catch on a release's settle
    // does.
    if (recognizer.claimsTouches && recognizer.cancelsTouchesInView) {
      this.cancelViewTouchesOf(recognizer)
    }
  }

  /** Whether `winner` being recognized prevents `other`. */
  protected conflicts(
    winner: GestureRecognizer,
    other: GestureRecognizer,
  ): boolean {
    if (
      !sharesTouches(winner, other)
      || internals(winner).allowsSimultaneous(other)
      // A watcher (claimsTouches false) prevents nothing and nothing
      // prevents it.
      || !winner.claimsTouches
      || !other.claimsTouches
    ) {
      return false
    }
    return winner.canPrevent(other) && other.canBePrevented(winner)
  }

  /**
   * Whether a recognizer that claims touches would take a contact the
   * browser keeps while it is down (`refusesClaim`).
   */
  protected isRefusedByBrowser(recognizer: GestureRecognizer): boolean {
    const refuses = this.options.refusesClaim
    if (refuses == null || !recognizer.claimsTouches) {
      return false
    }
    return recognizer.trackedTouches.some(
      touch =>
        touch.phase !== 'ended'
        && touch.phase !== 'cancelled'
        && refuses(touch),
    )
  }

  /** UIControl's rule: a control may veto an overlapping ancestor recognizer. */
  protected isVetoedByConsumer(recognizer: GestureRecognizer): boolean {
    for (const id of internals(recognizer).seenTouchIds) {
      const consumer = this.records.get(id)?.consumer
      if (consumer?.allowsAncestorRecognizer?.(recognizer) === false) {
        return true
      }
    }
    return false
  }

  protected fail(recognizer: GestureRecognizer): void {
    if (isTerminal(recognizer.state)) {
      return
    }
    if (isActive(recognizer.state)) {
      this.apply(recognizer, 'cancelled')
      return
    }
    internals(recognizer).pending = null
    // apply() gives back any claim it held (releaseClaim), waiting or not.
    this.apply(recognizer, 'failed')
    this.reviewPending()
  }

  /**
   * A recognition that claimed its touches and then fails or is cancelled (a
   * waiting recognition that fails, a gesture a second finger or the app
   * cancels) gives them back to the browser unless another recognition owns
   * them, so a finger still resting there can pinch-zoom the page. A gesture
   * that cancels itself on a finger's move (a long press past its tolerance)
   * keeps that finger until it lifts: the drag goes on, and the page never
   * takes it over midway (`spec:AST-094` FR14), as UIKit's scroll view never
   * takes a touch another recognizer had.
   */
  protected releaseClaim(
    recognizer: GestureRecognizer,
    keep: ReadonlySet<number> = new Set(),
  ): void {
    const released: number[] = []
    for (const touch of recognizer.trackedTouches) {
      const record = this.records.get(touch.id)
      if (record == null || !record.isClaimed || keep.has(touch.id)) {
        continue
      }
      // A recognized discrete gesture (`ended`, a swipe) still owns its
      // touches until they lift.
      const isOwned = this.active.some(
        other =>
          other !== recognizer
          && other.claimsTouches
          && (isActive(other.state)
            || other.state === 'ended'
            || internals(other).pending != null)
          && other.trackedTouches.some(tracked => tracked.id === touch.id),
      )
      if (!isOwned) {
        record.isClaimed = false
        released.push(touch.id)
      }
    }
    if (released.length > 0) {
      this.options.onRelease?.(released)
    }
  }

  protected apply(recognizer: GestureRecognizer, next: GestureState): void {
    const from = recognizer.state
    internals(recognizer).applyState(next)
    if (recognizer.state === next && from !== next) {
      this.options.onTransition?.(recognizer, from, next)
    }
    else if (next === 'changed' && from === 'changed') {
      this.options.onTransition?.(recognizer, from, next)
    }
    if (isTerminal(next)) {
      this.clearTimer(recognizer)
    }
    if (next === 'cancelled') {
      this.releaseClaim(recognizer, this.movingIds)
    }
    else if (next === 'failed') {
      this.releaseClaim(recognizer)
    }
  }

  /**
   * Re-run every waiting recognition whose requirements may have resolved.
   * Repeats until nothing changes, so chains (A waits on B waits on C)
   * settle in one pass.
   */
  protected reviewPending(): void {
    if (this.deferDepth > 0) {
      this.owesResolution = true
      return
    }
    let changed = true
    while (changed) {
      changed = false
      for (const recognizer of [...this.active]) {
        const next = internals(recognizer).pending
        if (next == null || recognizer.state !== 'possible') {
          continue
        }
        const blocked = this.active.some(
          other =>
            other !== recognizer
            && internals(recognizer).requiresFailureOf(other)
            && other.state === 'possible'
            && other.isInvolved(),
        )
        if (blocked) {
          continue
        }
        internals(recognizer).pending = null
        this.attemptRecognition(recognizer, next)
        changed = true
      }
    }
  }

  protected claim(recognizer: GestureRecognizer): void {
    if (!recognizer.claimsTouches) {
      return
    }
    const claimed: number[] = []
    for (const touch of recognizer.trackedTouches) {
      const record = this.records.get(touch.id)
      if (
        record != null
        && !record.isLifted
        && !record.isClaimed
        && !record.touch.takenByBrowser
      ) {
        // A touch the browser took stays the browser's (FR14).
        record.isClaimed = true
        claimed.push(touch.id)
      }
    }
    if (claimed.length > 0) {
      this.options.onClaim?.(claimed, recognizer)
    }
  }

  /** A recognizer's place in resolution order: innermost first, idle last. */
  protected rank(recognizer: GestureRecognizer): number {
    const index = this.active.indexOf(recognizer)
    return index === -1 ? Number.POSITIVE_INFINITY : index
  }

  protected settle(): void {
    this.reviewPending()
    this.reviewHeld()
    let didReset = false
    for (const recognizer of [...this.active]) {
      const isFinished
        = (isTerminal(recognizer.state) && recognizer.numberOfTouches === 0)
          || (recognizer.state === 'possible' && !recognizer.isInvolved())
      if (!isFinished) {
        continue
      }
      this.active = this.active.filter(other => other !== recognizer)
      const from = recognizer.state
      internals(recognizer).resetToPossible()
      didReset = true
      if (from !== 'possible') {
        this.options.onTransition?.(recognizer, from, 'possible')
      }
    }
    if (didReset) {
      // A recognizer that finished above may have been the one holding a
      // touch from its view; release it now, not at the next input.
      this.reviewHeld()
    }
    let dropped = false
    for (const [id, record] of this.records) {
      if (
        record.isLifted
        && record.view !== 'held'
        && record.view !== 'endHeld'
        && !record.deferredClick
      ) {
        this.records.delete(id)
        dropped = true
      }
    }
    if (dropped && this.records.size === 0) {
      this.options.onIdle?.()
    }
  }
}

function sharesTouches(a: GestureRecognizer, b: GestureRecognizer): boolean {
  for (const id of internals(a).seenTouchIds) {
    if (internals(b).seenTouchIds.has(id)) {
      return true
    }
  }
  return false
}
