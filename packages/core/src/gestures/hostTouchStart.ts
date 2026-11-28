/**
 * @file hostTouchStart.ts
 * @output HostTouchStart: Touch events: a finger's start and move, and a claimed finger's end
 * @position A layer of GestureHost.ts, below HostTouchEnd
 */

import type { ArenaBeganInput } from './GestureArena'
import type { PlacedContact, StylusTouch } from './hostHelpers'
import type {
  GestureTouch,
  TouchBeganInput,
  TouchInput,
} from './types'

import { containsAlongFlatTree } from '../utils/flatTree'
import { isNode } from '../utils/nodeType'
import { locksSelectionFor } from '../utils/selectionLock'

import { CLAIMED_LIFT_MS, claimsWhileMoving, eventTime, hasStylusTouch, isSamePlace, landedOn, touchesOf } from './hostHelpers'
import { HostWheelGesture } from './hostWheelGesture'
import {
  createNativeScrollProbe,
} from './nativeScroll'

import { internals } from './recognizerInternals'

/** Touch events: a finger's start and move, and a claimed finger's end; GestureHost is the class to use. */
export abstract class HostTouchStart extends HostWheelGesture {
  protected abstract dropFingersNotDown(event: TouchEvent): void
  protected abstract failUnclaimedLoneFingerPans(): void
  protected abstract feedMoves(inputs: ReadonlyArray<TouchInput>): void
  protected abstract forgetFinger(identifier: number): number | undefined
  protected abstract isFingerClaimed(): boolean
  protected abstract noteFingersDown(event: TouchEvent): void
  protected abstract pairTouch(id: number, place: PlacedContact): void
  protected abstract watchTarget(
    identifier: number,
    target: EventTarget | null,
    isBlocking: boolean,
    isClaiming: boolean,
  ): void

  protected readonly onTouchStart = (event: TouchEvent): void => {
    this.endWheel(eventTime(event, this.timing))
    this.noteFingersDown(event)
    // Where the host reads a finger from its pointer events (no ontouchstart,
    // as after touch emulation turns on), its Touch Events would track it twice.
    if (!this.usesTouchEvents || !this.takeEvent(event)) {
      return
    }
    if (this.fingerTargets.length > 1) {
      this.failUnclaimedLoneFingerPans()
    }
    const time = eventTime(event, this.timing)
    const inputs: ArenaBeganInput[] = []
    const untracked: TouchBeganInput[] = []
    const stale: number[] = []
    // Locked once the arena knows which recognizers took each finger.
    const toLock: {
      id: number
      target: EventTarget | null
      consumerElement: Element | null
    }[] = []
    for (const touch of touchesOf(event.changedTouches)) {
      if ((touch as StylusTouch).touchType === 'stylus') {
        continue
      }
      // A finger number still tracked here began again: the touch it named
      // ended where no listener of ours could hear it.
      this.cancelledFingers.delete(touch.identifier)
      const previous = this.forgetFinger(touch.identifier)
      if (previous != null) {
        stale.push(previous)
      }
      const native = isNode(touch.target)
        ? landedOn(event, touch.target)
        : landedOn(event)
      const target = this.presentedTarget(
        native,
        touch.clientX,
        touch.clientY,
        event.timeStamp,
      )
      const { recognizers, consumer, consumerElement } = this.participantsAt(
        target,
        'touch',
      )
      if (recognizers.length === 0 && consumer == null) {
        // Nothing here takes part: the touch stays the page's, but a
        // recognizer tracking another finger hears it began (a second
        // finger beside an open menu ends its press, spec:AST-094 FR28).
        untracked.push({
          id: this.nextId++,
          x: touch.clientX,
          y: touch.clientY,
          time,
          pointerType: 'touch',
          target,
        })
        continue
      }
      const id = this.nextId++
      this.touchIds.set(touch.identifier, id)
      if (locksSelectionFor('touch')) {
        toLock.push({ id, target, consumerElement })
      }
      // The finger's events keep going to what the engine hit. A disabled
      // participant can never claim, so a scroll never waits on it.
      this.watchTarget(
        touch.identifier,
        native,
        recognizers.some(
          recognizer => recognizer.isEnabled && claimsWhileMoving(recognizer),
        )
        || (consumer?.keepsTouch != null && consumer.isEnabled?.() !== false),
        (consumer != null && consumer.isEnabled?.() !== false)
        || recognizers.some(
          recognizer => recognizer.isEnabled && recognizer.claimsTouches,
        ),
      )
      this.lastFed.set(id, { x: touch.clientX, y: touch.clientY, time })
      this.pairTouch(id, { x: touch.clientX, y: touch.clientY, target: native })
      if (target !== native && target != null) {
        this.retargeted.set(id, { x: touch.clientX, y: touch.clientY, target })
      }
      inputs.push({
        id,
        x: touch.clientX,
        y: touch.clientY,
        time,
        pointerType: 'touch',
        target,
        scroll: createNativeScrollProbe(target),
        recognizers,
        consumer,
      })
    }
    if (stale.length > 0) {
      this.arena.cancelled(stale, time)
    }
    this.arena.began(inputs)
    for (const { id, target, consumerElement } of toLock) {
      this.lockSelection(
        id,
        this.arena.participantsOf(id),
        target,
        this.arena.consumerOf(id) ?? null,
        consumerElement,
      )
    }
    for (const input of untracked) {
      this.arena.untrackedBegan(input)
    }
    // Again once the new fingers are delivered: a pinch's second finger may
    // have landed on another one-finger pan, the next row.
    if (this.fingerTargets.length > 1 && !this.isFingerClaimed()) {
      this.failUnclaimedLoneFingerPans()
    }
    // Stamped after the consumers judged the touch: the brake asks whether
    // an EARLIER finger is still driving a scroll.
    const landed = landedOn(event)
    if (isNode(landed)) {
      this.lastTouch = { target: landed, time }
    }
  }

  protected readonly onTouchMove = (event: TouchEvent): void => {
    this.noteFingersDown(event)
    // Where the host reads a finger from its pointer events (no ontouchstart,
    // as after touch emulation turns on), its Touch Events would track it twice.
    if (!this.usesTouchEvents || !this.takeEvent(event)) {
      return
    }
    this.dropFingersNotDown(event)
    const time = eventTime(event, this.timing)
    const ids: number[] = []
    const inputs: TouchInput[] = []
    for (const touch of touchesOf(event.changedTouches)) {
      const id = this.touchIds.get(touch.identifier)
      if (id == null) {
        continue
      }
      ids.push(id)
      inputs.push({ id, x: touch.clientX, y: touch.clientY, time })
    }
    if (inputs.length === 0) {
      return
    }
    if (!event.cancelable) {
      // The browser no longer asks the page about these fingers. WebKit
      // stops asking when it takes the touch to pan (its pointercancel comes
      // with it); Chromium also stops after one unconsumed touchmove, even
      // when `touch-action` keeps it from panning the way the finger went (a
      // horizontal drag under pan-y). So a finger's FIRST uncancelable move
      // counts as the browser's claim only if the browser could pan along
      // the finger's main axis since touch-down; later ones add nothing, and
      // pointercancel or a scroll still report any real pan.
      const placed = new Map(inputs.map(input => [input.id, input]))
      const taken = ids.filter((id) => {
        const touch = this.arena.getTouch(id)
        if (
          touch == null
          || touch.takenByBrowser
          || this.arena.isClaimed(id)
          || touch.scroll?.allowsNativePan === false
          || this.judgedUncancelable.has(id)
        ) {
          return false
        }
        this.judgedUncancelable.add(id)
        const input = placed.get(id)
        if (input == null || touch.scroll == null) {
          return true
        }
        const dx = input.x - touch.startX
        const dy = input.y - touch.startY
        return Math.abs(dx) >= Math.abs(dy)
          ? touch.scroll.canScroll(dx, 0)
          : touch.scroll.canScroll(0, dy)
      })
      if (taken.length > 0) {
        this.browserTook(taken, time)
      }
    }
    // A finger its pointer events sample is fed from there, never from here.
    this.feedMoves(inputs.filter(input => !this.pointerFed.has(input.id)))
  }

  /** The one blocking `touchmove` handler every claiming element shares. */
  protected readonly onBlockingTouchMove = (event: Event): void => {
    this.cancelIfClaimed(event as TouchEvent)
  }

  /**
   * Cancel a `touchmove` while a recognizer owns one of its fingers. A touch
   * no recognizer owns keeps its moves (`spec:AST-094` FR19): nothing is
   * cancelled before a recognizer begins, or for a touch it does not track,
   * unless a recognizer holds that finger already (a scroll-edge pan pulling
   * away from an edge every scroller under it is at; FR19, DEC-18).
   */
  /**
   * Under `inputMode: 'pointer-events'` a finger comes from its pointer
   * events, so its touches carry no id of ours: the live finger it is, the
   * nearest pointer-fed finger on the same target. Its touchmoves can then
   * be cancelled once a recognizer claims it (`spec:AST-094` FR19, FR21).
   */
  protected pointerFingerAt(touch: Touch): number | undefined {
    let best: GestureTouch | null = null
    let bestDistance = Number.POSITIVE_INFINITY
    for (const finger of this.arena.touches) {
      if (
        finger.pointerType !== 'touch'
        || finger.phase === 'ended'
        || finger.phase === 'cancelled'
        || !isNode(finger.target)
        || !isNode(touch.target)
        // Along the flat tree, both ways: the finger's target can be inside
        // an open shadow root while its touches reach the host retargeted.
        || !(
          containsAlongFlatTree(finger.target, touch.target)
          || containsAlongFlatTree(touch.target, finger.target)
        )
      ) {
        continue
      }
      const d = Math.hypot(finger.x - touch.clientX, finger.y - touch.clientY)
      if (d < bestDistance) {
        best = finger
        bestDistance = d
      }
    }
    return best?.id
  }

  /**
   * Cancel the `touchend` of a finger a recognizer owned when it lifted
   * (`inputMode: 'pointer-events'`): its `pointerup` came first, at the same
   * place on the same target (`spec:AST-094` FR21). Records older than
   * CLAIMED_LIFT_MS are dropped first: their touchend never came.
   */
  protected readonly onClaimedTouchEnd = (event: Event): void => {
    const end = event as TouchEvent
    const time = eventTime(end, this.timing)
    for (let i = this.claimedLifts.length - 1; i >= 0; i--) {
      if (time - this.claimedLifts[i].time > CLAIMED_LIFT_MS) {
        this.claimedLifts.splice(i, 1)
      }
    }
    if (!end.cancelable || end.defaultPrevented) {
      return
    }
    for (const touch of touchesOf(end.changedTouches)) {
      // As its pointer landed: inside an open shadow root this listener
      // sees the touch retargeted to the host.
      const index = this.claimedLifts.findIndex(lift =>
        isSamePlace(lift, {
          x: touch.clientX,
          y: touch.clientY,
          target: landedOn(end, touch.target),
        }),
      )
      if (index >= 0) {
        this.claimedLifts.splice(index, 1)
        if (this.claimedLifts.length === 0) {
          this.clearClaimedLifts()
        }
        end.preventDefault()
        return
      }
    }
  }

  protected cancelIfClaimed(event: TouchEvent): void {
    if (!event.cancelable || event.defaultPrevented) {
      return
    }
    // Only the touches this move reports: another finger a recognizer owns
    // does not make this one its own.
    const moved = touchesOf(event.changedTouches)
    for (const touch of moved) {
      const id
        = this.touchIds.get(touch.identifier)
        // Where fingers come from pointer events (inputMode 'pointer-events',
        // or 'auto' with no ontouchstart), the touch is matched to its pointer.
          ?? (this.usesTouchEvents ? undefined : this.pointerFingerAt(touch))
      if (
        id != null
        && (this.arena.isClaimed(id)
          // A kept press keeps its finger under any pointer (FR11, DEC-21).
          || this.arena.consumerOf(id)?.keepsTouch?.(id) === true
          // A recognizer that holds the finger before it begins: a
          // scroll-edge pan pulling away from an edge (FR19, DEC-18), only
          // while this is the one finger on the screen: with a second one
          // down anywhere, even off the recognizer's element, the moves stay
          // the browser's, for its pinch (FR10).
          || (event.touches.length === 1
            && this.arena
              .participantsOf(id)
              .some(recognizer => internals(recognizer).keepsTouch(id))))
      ) {
        event.preventDefault()
        return
      }
    }
    if (hasStylusTouch(event)) {
      for (const id of this.pointerIds.values()) {
        if (this.arena.isClaimed(id)) {
          // A pen whose pointer a recognizer owns: its stylus touches too,
          // never a finger no recognizer owns.
          event.preventDefault()
          return
        }
      }
    }
  }
}
