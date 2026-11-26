/**
 * @file hostPointer.ts
 * @output HostPointer: Pointer events: a press's down, move and up, claimed lifts, and the host's own scrolls
 * @position A layer of GestureHost.ts, below GestureHost
 */

import {
  UIKIT_PRESS,
} from '../motion/uikit/gestures'
import {
  armClickGuard,
  disarmClickGuard,
} from '../utils/clickGuard'
import { containsAlongFlatTree } from '../utils/flatTree'
import { isNode } from '../utils/nodeType'
import { isPrimaryClick } from '../utils/primaryClick'
import { locksSelectionFor } from '../utils/selectionLock'
import { selectionRangesOf } from '../utils/selectionRanges'

import { CLAIMED_LIFT_LIMIT, CLAIMED_LIFT_MS, coalescedHistory, eventTime, isPointerKind, landedOn, needsSuppression } from './hostHelpers'
import { HostTouchEnd } from './hostTouchEnd'
import {
  createNativeScrollProbe,
} from './nativeScroll'

/** Pointer events: a press's down, move and up, claimed lifts, and the host's own scrolls; GestureHost is the class to use. */
export abstract class HostPointer extends HostTouchEnd {
  protected abstract isPenHold(id: number, time: number): boolean
  protected abstract notePenDrift(id: number, x: number, y: number, time: number): void
  protected abstract refuseCancelledLift(event: PointerEvent): void

  // --- Pointer events --------------------------------------------------------

  protected readonly onPointerDown = (event: PointerEvent): void => {
    this.endMissedMouseLift(event)
    this.endWheel(eventTime(event, this.timing))
    // A new press: whatever click is still owed to the last one is not this.
    disarmClickGuard(this.doc)
    if (!isPointerKind(event.pointerType)) {
      return
    }
    this.dropCancelledLifts(event)
    if (event.pointerType === 'touch' && this.usesTouchEvents) {
      this.pairPointer(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
        target: landedOn(event),
      })
      return
    }
    if (event.pointerType === 'touch' && event.isPrimary === false) {
      // Fingers from pointer events: a second one, wherever either lands,
      // leaves the two to the page's pinch, as onTouchStart does. A finger
      // that is not the primary pointer is a second finger, even where the
      // host never heard the first.
      this.failUnclaimedLoneFingerPans()
    }
    // A right click, a pen's barrel button, or a ctrl-click on macOS (its
    // context click) starts no press (FR43).
    if (event.pointerType !== 'touch' && !isPrimaryClick(event)) {
      return
    }
    const landed = landedOn(event)
    const target = this.presentedTarget(
      landed,
      event.clientX,
      event.clientY,
      event.timeStamp,
    )
    const { recognizers, consumer, consumerElement } = this.participantsAt(
      target,
      event.pointerType,
    )
    if (recognizers.length === 0 && consumer == null) {
      return
    }
    const id = this.nextId++
    this.pointerIds.set(event.pointerId, id)
    this.pointerKinds.set(event.pointerId, event.pointerType)
    if (target !== landed && target != null) {
      this.retargeted.set(id, { x: event.clientX, y: event.clientY, target })
    }
    // Before the arena admits it: a press a group claims at its own
    // pointerdown keeps the selection the page has now.
    if (event.pointerType !== 'touch') {
      this.pressSelections.set(id, selectionRangesOf(this.doc.defaultView))
    }
    this.arena.began([
      {
        id,
        x: event.clientX,
        y: event.clientY,
        time: eventTime(event, this.timing),
        pointerType: event.pointerType,
        target,
        scroll: createNativeScrollProbe(target),
        recognizers,
        consumer,
      },
    ])
    if (
      event.pointerType === 'touch'
      && event.isPrimary === false
      && !this.isFingerClaimed()
    ) {
      // Again once this finger is delivered: it may have landed on another
      // one-finger pan.
      this.failUnclaimedLoneFingerPans()
    }
    if (locksSelectionFor(event.pointerType)) {
      // The presented target: what the pen is on, where the engine's own
      // hit test may still see the motion's start.
      this.lockSelection(
        id,
        this.arena.participantsOf(id),
        target,
        this.arena.consumerOf(id) ?? null,
        consumerElement,
      )
    }
    if (event.pointerType !== 'touch') {
      // The engine's own hit: the text its caret query and a drag select.
      this.noteSelectingPress(id, event.clientX, event.clientY, landed)
    }
  }

  protected readonly onPointerMove = (event: PointerEvent): void => {
    if (this.endMissedMouseLift(event)) {
      return
    }
    if (event.pointerType === 'touch' && this.usesTouchEvents) {
      const id = this.fingerPointers.get(event.pointerId)
      if (id != null) {
        this.feedMoves([
          {
            id,
            x: event.clientX,
            y: event.clientY,
            time: eventTime(event, this.timing),
            history: coalescedHistory(event, this.timing),
          },
        ])
      }
      return
    }
    const id = this.pointerIds.get(event.pointerId)
    if (id != null) {
      if (event.pointerType === 'pen') {
        this.notePenDrift(
          id,
          event.clientX,
          event.clientY,
          eventTime(event, this.timing),
        )
      }
      this.arena.moved([
        {
          id,
          x: event.clientX,
          y: event.clientY,
          time: eventTime(event, this.timing),
          history: coalescedHistory(event, this.timing),
        },
      ])
    }
  }

  /**
   * In Chromium, a sandboxed frame can miss the `pointerup` of a button
   * released outside the window. The next mouse event shows the button up,
   * or a new press. The contact then ends at its last place. No click comes
   * to this document, so no click guard is armed.
   */
  protected endMissedMouseLift(event: PointerEvent): boolean {
    if (event.pointerType !== 'mouse') {
      return false
    }
    const isNewPress = event.type === 'pointerdown'
    if (!isNewPress && (event.buttons & 1) !== 0) {
      return false
    }
    const id = this.pointerIds.get(event.pointerId)
    const touch = id == null ? undefined : this.arena.getTouch(id)
    if (id == null || touch == null) {
      return false
    }
    this.releaseArmedPress()
    this.pointerIds.delete(event.pointerId)
    this.pointerKinds.delete(event.pointerId)
    this.unlockSelection(id)
    this.retargeted.delete(id)
    this.arena.ended([
      { id, x: touch.x, y: touch.y, time: eventTime(event, this.timing) },
    ])
    return true
  }

  protected readonly onPointerUp = (event: PointerEvent): void => {
    this.releaseArmedPress()
    if (event.pointerType === 'touch' && this.usesTouchEvents) {
      // The lift itself is the touchend's: it alone can cancel the click. Its
      // place and time are this event's, where the finger's moves were read.
      const id = this.fingerPointers.get(event.pointerId)
      if (id != null && this.pointerFed.has(id)) {
        this.liftStamps.set(id, {
          x: event.clientX,
          y: event.clientY,
          time: eventTime(event, this.timing),
        })
      }
      this.fingerPointers.delete(event.pointerId)
      this.pendingPointers.delete(event.pointerId)
      return
    }
    const id = this.pointerIds.get(event.pointerId)
    if (id == null) {
      // A contact the lost focus cancelled: its lift clicks nothing.
      if (this.cancelledPointers.delete(event.pointerId)) {
        this.refuseCancelledLift(event)
      }
      return
    }
    this.pointerIds.delete(event.pointerId)
    this.pointerKinds.delete(event.pointerId)
    const hold = this.claimHolds.get(id)
    this.unlockSelection(id)
    const target = this.arena.getTouch(id)?.target
    const isPenHold
      = event.pointerType === 'pen'
        && this.isPenHold(id, eventTime(event, this.timing))
    this.driftedPens.delete(id)
    const dispositions = this.arena.ended([
      {
        id,
        x: event.clientX,
        y: event.clientY,
        time: eventTime(event, this.timing),
      },
    ])
    // A selection the lift's own handlers made stays, as a click's does.
    hold?.keepLiftSelection()
    if (isPenHold) {
      this.lastPenLift = { target, time: this.arena.now() }
    }
    // A retargeted tap's own click arms the click guard for the engine's.
    const landed = this.retargeted.get(id)
    this.retargeted.delete(id)
    const clicked = this.clickRetargetedTap(
      landed,
      { x: event.clientX, y: event.clientY },
      dispositions.get(id),
      event.pointerType,
    )
    if (!clicked && needsSuppression(dispositions)) {
      armClickGuard(this.doc, { takesLateMouse: event.pointerType === 'touch' })
    }
    // A finger read from its pointer events: the touchend that follows the
    // lift is cancelled when a gesture took it, which the lift itself may
    // decide (a hold whose time came with it), or when its tap was retargeted
    // (FR21).
    if (
      event.pointerType === 'touch'
      && (clicked || needsSuppression(dispositions))
    ) {
      this.noteClaimedLift(event)
    }
  }

  /**
   * Note a claimed finger's lift, so the `touchend` that follows its
   * `pointerup` is cancelled (FR21). Only where an element's listener can take
   * that touchend: elsewhere none comes, and the note would hold its node for
   * nothing. At most CLAIMED_LIFT_LIMIT wait, the oldest going first, and one
   * timer drops each once CLAIMED_LIFT_MS has passed (FR24); the host's
   * uninstall keeps them, as it can run in the microtask after the pointerup,
   * before the touchend that comes later in the same task.
   */
  protected noteClaimedLift(event: PointerEvent): void {
    if (
      !this.readsFingersFromPointerEvents()
      || !(this.isCoarse || this.sendsTouchEvents())
    ) {
      return
    }
    this.claimedLifts.push({
      x: event.clientX,
      y: event.clientY,
      target: landedOn(event),
      time: eventTime(event, this.timing),
    })
    if (this.claimedLifts.length > CLAIMED_LIFT_LIMIT) {
      this.claimedLifts.shift()
    }
    this.armClaimedLiftTimer()
  }

  /** Arm the one timer for the oldest claimed lift still waiting. */
  protected armClaimedLiftTimer(): void {
    if (this.claimedLiftTimer != null || this.claimedLifts.length === 0) {
      return
    }
    const due = this.claimedLifts[0].time + CLAIMED_LIFT_MS
    this.claimedLiftTimer = this.clock.setTimeout(
      () => {
        this.claimedLiftTimer = null
        const now = this.clock.now()
        for (let i = this.claimedLifts.length - 1; i >= 0; i--) {
          if (now - this.claimedLifts[i].time >= CLAIMED_LIFT_MS) {
            this.claimedLifts.splice(i, 1)
          }
        }
        this.armClaimedLiftTimer()
      },
      Math.max(0, due - this.clock.now()),
    )
  }

  /** Drop every claimed lift and its timer, once the last one is taken. */
  protected clearClaimedLifts(): void {
    this.claimedLifts.length = 0
    if (this.claimedLiftTimer != null) {
      this.clock.clearTimeout(this.claimedLiftTimer)
      this.claimedLiftTimer = null
    }
  }

  /**
   * A recognizer is about to scroll `scroller` itself (a menu's edge
   * autoscroll, spec:AST-094 FR30): the scroll that write fires is not a
   * finger's and not the browser taking one. It passes until the end of the
   * next frame, when that event has fired; a real pan in that window still
   * reports itself through pointercancel or touchcancel.
   */
  ownScroll(scroller: Node): void {
    const call = ++this.ownScrollCalls
    this.ownedScrolls.set(scroller, call)
    const view = this.doc.defaultView
    if (view == null) {
      return
    }
    // A newer call keeps it until its own frame has passed: its frames
    // replace the older call's.
    this.ownScrollFrames.get(scroller)?.()
    let inner = 0
    const outer = view.requestAnimationFrame(() => {
      inner = view.requestAnimationFrame(() => {
        this.ownScrollFrames.delete(scroller)
        if (this.ownedScrolls.get(scroller) === call) {
          this.ownedScrolls.delete(scroller)
        }
      })
    })
    this.ownScrollFrames.set(scroller, () => {
      view.cancelAnimationFrame(outer)
      if (inner !== 0) {
        view.cancelAnimationFrame(inner)
      }
    })
  }

  /**
   * Internal. Whether a recognizer is scrolling `scroller` itself now
   * (ownScroll): that scroll is not a finger's (fingerScroll.ts reads it).
   */
  isOwnScroll(scroller: Node): boolean {
    return this.ownedScrolls.has(scroller)
  }

  protected readonly onScroll = (event: Event): void => {
    const time = eventTime(event, this.timing)
    const scroller = event.target === this.doc ? this.doc : event.target
    if (!isNode(scroller) || this.ownedScrolls.has(scroller)) {
      return
    }
    // A scroll is a finger's only if that finger was inside this scroller,
    // recently; anything else is the program moving something.
    const last = this.lastTouch
    if (
      last != null
      && time - last.time < UIKIT_PRESS.momentumMemory.value
      && containsAlongFlatTree(scroller, last.target)
    ) {
      this.lastScroll = { scroller, time }
    }
    const taken: number[] = []
    for (const touch of this.arena.touches) {
      if (
        touch.takenByBrowser
        || touch.phase === 'ended'
        || touch.phase === 'cancelled'
        || touch.pointerType !== 'touch'
        || this.arena.isClaimed(touch.id)
      ) {
        continue
      }
      if (
        isNode(touch.target)
        && containsAlongFlatTree(scroller, touch.target)
        // Only a pan this finger drove takes the touch: the browser starts
        // one only once the finger has travelled the take distance
        // (spec:AST-094 FR20). A scroll under a finger that has not
        // (scrollIntoView, a transcript pinned to its end, scroll
        // anchoring) is the page's own: the touch, and the click it earns,
        // stay where they are.
        && Math.hypot(touch.x - touch.startX, touch.y - touch.startY)
        >= UIKIT_PRESS.slop.value
      ) {
        taken.push(touch.id)
      }
    }
    if (taken.length > 0) {
      this.browserTook(taken, time)
    }
  }
}
