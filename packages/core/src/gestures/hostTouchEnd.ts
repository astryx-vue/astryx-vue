/**
 * @file hostTouchEnd.ts
 * @output HostTouchEnd: Touch events: a finger's end and cancel, the target's own listeners, and pairing touches with pointers
 * @position A layer of GestureHost.ts, below HostPointer
 */

import type { ClickDisposition } from './GestureArena'
import type { PlacedContact } from './hostHelpers'
import type {
  TouchInput,
} from './types'

import {
  UIKIT_TAP,
} from '../motion/uikit/gestures'
import {
  armClickGuard,
} from '../utils/clickGuard'
import { isNode } from '../utils/nodeType'

import { eventTime, isSamePlace, landedOn, needsSuppression, touchesOf } from './hostHelpers'
import { HostTouchStart } from './hostTouchStart'

/** Touch events: a finger's end and cancel, the target's own listeners, and pairing touches with pointers; GestureHost is the class to use. */
export abstract class HostTouchEnd extends HostTouchStart {
  protected readonly onTouchEnd = (event: TouchEvent): void => {
    this.releaseArmedPress()
    this.noteFingersDown(event)
    // Where the host reads a finger from its pointer events (no ontouchstart,
    // as after touch emulation turns on), its Touch Events would track it twice.
    if (!this.usesTouchEvents || !this.takeEvent(event)) {
      return
    }
    this.dropFingersNotDown(event)
    const time = eventTime(event, this.timing)
    const inputs: TouchInput[] = []
    const retargetedEnds: {
      id: number
      landed: { x: number, y: number, target: EventTarget }
      x: number
      y: number
    }[] = []
    let isRefused = false
    for (const touch of touchesOf(event.changedTouches)) {
      if (this.cancelledFingers.delete(touch.identifier)) {
        isRefused = true
        continue
      }
      const tracked = this.touchIds.get(touch.identifier)
      const landed = tracked == null ? undefined : this.retargeted.get(tracked)
      const lift = tracked == null ? undefined : this.liftStamps.get(tracked)
      const id = this.forgetFinger(touch.identifier)
      if (id == null) {
        continue
      }
      inputs.push({
        id,
        x: lift?.x ?? touch.clientX,
        y: lift?.y ?? touch.clientY,
        time: lift?.time ?? time,
      })
      if (landed != null) {
        retargetedEnds.push({ id, landed, x: touch.clientX, y: touch.clientY })
      }
    }
    // The arena takes the lifts in time order, so it never raises an earlier
    // lift to a later one.
    inputs.sort((a, b) => a.time - b.time)
    // The lift is when momentum starts: the clock the brake wants most.
    const landed = landedOn(event)
    if (isNode(landed)) {
      this.lastTouch = {
        target: landed,
        time: inputs.length > 0 ? Math.max(...inputs.map(i => i.time)) : time,
      }
    }
    const dispositions
      = inputs.length > 0
        ? this.arena.ended(inputs)
        : new Map<number, ClickDisposition>()
    let cancelsClick = isRefused || needsSuppression(dispositions)
    // A tap sent to what is drawn: the engine's click would hit the layout
    // position, so it is cancelled and the tap clicks what it touched.
    for (const end of retargetedEnds) {
      if (
        this.clickRetargetedTap(
          end.landed,
          end,
          dispositions.get(end.id),
          'touch',
        )
      ) {
        cancelsClick = true
      }
    }
    if (cancelsClick) {
      if (event.cancelable) {
        event.preventDefault()
      }
      armClickGuard(this.doc, { takesLateMouse: true })
    }
  }

  /**
   * Clicks what a retargeted contact touched if it ended as a tap the
   * engine would click: nothing claimed it, the browser did not take it
   * (a taken contact is no longer retargeted), and the finger stayed within
   * a tap's movement. Returns whether it clicked.
   */
  protected clickRetargetedTap(
    landed: { x: number, y: number, target: EventTarget } | undefined,
    end: { x: number, y: number },
    disposition: ClickDisposition | undefined,
    pointerType: string,
  ): boolean {
    if (landed == null || disposition !== 'allow') {
      return false
    }
    const moved = Math.hypot(end.x - landed.x, end.y - landed.y)
    if (moved > UIKIT_TAP.allowableMovement.value) {
      return false
    }
    this.clickRetargeted(landed.target, end.x, end.y, pointerType)
    return true
  }

  protected readonly onTouchCancel = (event: TouchEvent): void => {
    this.releaseArmedPress()
    this.noteFingersDown(event)
    // Where the host reads a finger from its pointer events (no ontouchstart,
    // as after touch emulation turns on), its Touch Events would track it twice.
    if (!this.usesTouchEvents || !this.takeEvent(event)) {
      return
    }
    const listed = touchesOf(event.changedTouches)
    // A cancel that names no finger is the system taking them all.
    const identifiers
      = listed.length > 0
        ? listed.map(touch => touch.identifier)
        : [...this.touchIds.keys()]
    if (listed.length === 0) {
      this.cancelledFingers.clear()
    }
    for (const identifier of identifiers) {
      this.cancelledFingers.delete(identifier)
    }
    const ids: number[] = []
    for (const identifier of identifiers) {
      const id = this.forgetFinger(identifier)
      if (id != null) {
        ids.push(id)
      }
    }
    if (ids.length > 0) {
      this.arena.cancelled(ids, eventTime(event, this.timing))
    }
  }

  /** The target's own listeners, for a target that left the document. */
  protected readonly onTargetTouchMove = (event: Event): void => {
    this.onTouchMove(event as TouchEvent)
    this.cancelIfClaimed(event as TouchEvent)
  }

  /** The same for a finger nothing could claim while it moves: never blocks. */
  protected readonly onTargetTouchMovePassive = (event: Event): void => {
    this.onTouchMove(event as TouchEvent)
  }

  protected readonly onTargetTouchEnd = (event: Event): void => {
    this.onTouchEnd(event as TouchEvent)
  }

  /** The same, registered passively for a touch only watchers follow. */
  protected readonly onTargetTouchEndPassive = (event: Event): void => {
    this.onTouchEnd(event as TouchEvent)
  }

  protected readonly onTargetTouchCancel = (event: Event): void => {
    this.onTouchCancel(event as TouchEvent)
  }

  /**
   * Cancel tracked fingers the event says are no longer down. `touches`
   * lists every finger on the screen; one missing from it (and not lifting
   * in this very event) ended where we could not see it.
   */
  protected dropFingersNotDown(event: TouchEvent): void {
    if (
      event.touches == null
      || (this.touchIds.size === 0 && this.cancelledFingers.size === 0)
    ) {
      return
    }
    const down = new Set<number>()
    for (const touch of touchesOf(event.touches)) {
      down.add(touch.identifier)
    }
    for (const touch of touchesOf(event.changedTouches)) {
      down.add(touch.identifier)
    }
    for (const identifier of [...this.cancelledFingers]) {
      if (!down.has(identifier)) {
        this.cancelledFingers.delete(identifier)
      }
    }
    const gone = [...this.touchIds.keys()].filter(
      identifier => !down.has(identifier),
    )
    const ids: number[] = []
    for (const identifier of gone) {
      const id = this.forgetFinger(identifier)
      if (id != null) {
        ids.push(id)
      }
    }
    if (ids.length > 0) {
      this.arena.cancelled(ids, eventTime(event, this.timing))
    }
  }

  protected watchTarget(
    identifier: number,
    target: EventTarget | null,
    isBlocking: boolean,
    isClaiming: boolean,
  ): void {
    if (target == null || typeof target.addEventListener !== 'function') {
      return
    }
    this.touchTargets.set(identifier, target)
    const state = this.watched.get(target)
    if (state == null) {
      this.watched.set(target, {
        count: 1,
        blocking: isBlocking ? 1 : 0,
        claiming: isClaiming ? 1 : 0,
      })
      if (isBlocking) {
        this.blockingFingers.add(identifier)
      }
      if (isClaiming) {
        this.claimingFingers.add(identifier)
      }
      target.addEventListener(
        'touchmove',
        isBlocking ? this.onTargetTouchMove : this.onTargetTouchMovePassive,
        { passive: !isBlocking },
      )
      target.addEventListener(
        'touchend',
        isClaiming ? this.onTargetTouchEnd : this.onTargetTouchEndPassive,
        { passive: !isClaiming },
      )
      target.addEventListener('touchcancel', this.onTargetTouchCancel, {
        passive: true,
      })
      return
    }
    const wasBlocking = state.blocking > 0
    const wasClaiming = state.claiming > 0
    state.count += 1
    if (isBlocking) {
      state.blocking += 1
      this.blockingFingers.add(identifier)
    }
    if (isClaiming) {
      state.claiming += 1
      this.claimingFingers.add(identifier)
    }
    this.swapTargetTouchMove(target, wasBlocking, state.blocking > 0)
    this.swapTargetTouchEnd(target, wasClaiming, state.claiming > 0)
  }

  protected unwatchTarget(identifier: number): void {
    const target = this.touchTargets.get(identifier)
    if (target == null) {
      return
    }
    this.touchTargets.delete(identifier)
    const state = this.watched.get(target)
    if (state == null) {
      return
    }
    const wasBlocking = state.blocking > 0
    const wasClaiming = state.claiming > 0
    state.count -= 1
    if (this.blockingFingers.delete(identifier)) {
      state.blocking -= 1
    }
    if (this.claimingFingers.delete(identifier)) {
      state.claiming -= 1
    }
    if (state.count > 0) {
      this.swapTargetTouchMove(target, wasBlocking, state.blocking > 0)
      this.swapTargetTouchEnd(target, wasClaiming, state.claiming > 0)
      return
    }
    this.watched.delete(target)
    target.removeEventListener(
      'touchmove',
      wasBlocking ? this.onTargetTouchMove : this.onTargetTouchMovePassive,
    )
    target.removeEventListener(
      'touchend',
      wasClaiming ? this.onTargetTouchEnd : this.onTargetTouchEndPassive,
    )
    target.removeEventListener('touchcancel', this.onTargetTouchCancel)
  }

  /**
   * Keeps one `touchmove` listener on a watched target: the blocking one
   * while a finger on it could be claimed as it moves, a passive one
   * otherwise, so a scroll starting there never waits on the main thread
   * (`spec:AST-094` FR19).
   */
  protected swapTargetTouchMove(
    target: EventTarget,
    wasBlocking: boolean,
    isBlocking: boolean,
  ): void {
    if (wasBlocking === isBlocking) {
      return
    }
    target.removeEventListener(
      'touchmove',
      wasBlocking ? this.onTargetTouchMove : this.onTargetTouchMovePassive,
    )
    target.addEventListener(
      'touchmove',
      isBlocking ? this.onTargetTouchMove : this.onTargetTouchMovePassive,
      { passive: !isBlocking },
    )
  }

  /**
   * Keeps one `touchend` listener on a watched target: the cancelable one
   * while a finger on it has a participant that could claim (a lift whose
   * click must not happen cancels its `touchend`), a passive one while only
   * watchers follow its fingers (`spec:AST-094` FR20).
   */
  protected swapTargetTouchEnd(
    target: EventTarget,
    wasClaiming: boolean,
    isClaiming: boolean,
  ): void {
    if (wasClaiming === isClaiming) {
      return
    }
    target.removeEventListener(
      'touchend',
      wasClaiming ? this.onTargetTouchEnd : this.onTargetTouchEndPassive,
    )
    target.addEventListener(
      'touchend',
      isClaiming ? this.onTargetTouchEnd : this.onTargetTouchEndPassive,
      { passive: !isClaiming },
    )
  }

  /** Stop tracking a finger by its Touch.identifier; returns its arena id. */
  protected forgetFinger(identifier: number): number | undefined {
    const id = this.touchIds.get(identifier)
    this.touchIds.delete(identifier)
    this.unwatchTarget(identifier)
    if (id != null) {
      this.forgetContact(id)
    }
    return id
  }

  protected pairTouch(id: number, place: PlacedContact): void {
    for (const [pointerId, pending] of this.pendingPointers) {
      if (isSamePlace(pending, place)) {
        this.pendingPointers.delete(pointerId)
        this.fingerPointers.set(pointerId, id)
        this.pointerFed.add(id)
        return
      }
    }
    this.unpairedTouches.set(id, place)
  }

  protected pairPointer(pointerId: number, place: PlacedContact): void {
    for (const [id, unpaired] of this.unpairedTouches) {
      if (isSamePlace(unpaired, place)) {
        this.unpairedTouches.delete(id)
        this.fingerPointers.set(pointerId, id)
        this.pointerFed.add(id)
        return
      }
    }
    this.pendingPointers.set(pointerId, place)
  }

  /** Feed moves from a contact's sampling channel, in time order. */
  protected feedMoves(inputs: ReadonlyArray<TouchInput>): void {
    const fresh = inputs.filter((input) => {
      const last = this.lastFed.get(input.id)
      if (last != null && input.time < last.time) {
        return false
      }
      this.lastFed.set(input.id, { x: input.x, y: input.y, time: input.time })
      return true
    })
    if (fresh.length > 0) {
      this.arena.moved(fresh)
    }
  }

  /** Forget a contact's pairing and echo state. */
  protected forgetContact(id: number): void {
    this.unlockSelection(id)
    this.retargeted.delete(id)
    this.lastFed.delete(id)
    this.pointerFed.delete(id)
    this.liftStamps.delete(id)
    this.judgedUncancelable.delete(id)
    this.unpairedTouches.delete(id)
    for (const [pointerId, paired] of this.fingerPointers) {
      if (paired === id) {
        this.fingerPointers.delete(pointerId)
      }
    }
  }
}
