/**
 * @file hostWheelInput.ts
 * @output HostWheelInput: The wheel's events: trackpad segments, provisional follows and who takes them
 * @position A layer of GestureHost.ts, below HostWheelGesture
 */

import type { WheelFollow, WheelGesture } from './hostWheel'

import type { WheelSegment } from './wheelSegmenter'

import { isElement, isNode } from '../utils/nodeType'

import { eventTime } from './hostHelpers'
import { HostSelection } from './hostSelection'
import { absorbedDebt, joinReading, scrollTypeOf, WHEEL_FOLLOW_END_MS, WHEEL_FOLLOW_END_V_MS, WHEEL_PINCH_SPAN, wheelEndMs, wheelPixels } from './hostWheel'
import {
  canElementScroll,
  parentAcrossShadow,
  parseTouchAction,
} from './nativeScroll'

import {
  gestureHostStyle,
} from './touchAction'

/** The wheel's events: trackpad segments, provisional follows and who takes them; GestureHost is the class to use. */
export abstract class HostWheelInput extends HostSelection {
  protected abstract beginWheel(
    wheel: WheelEvent,
    kind: 'pan' | 'pinch',
    dx: number,
    dy: number,
    time: number,
  ): WheelGesture
  protected abstract latchWheel(): void

  /**
   * Wheel and trackpad input. A wheel gesture drives the recognizers that
   * allow its scroll type, as a contact that moves with the content. A pan
   * takes it along its own axis, once no scroller between the pointer and
   * the pan's element can scroll that way. The gesture's first wheel decides
   * this. A pinch takes a ctrl-wheel, as a trackpad pinches, as two contacts
   * whose span follows exp(-deltaY / 100). A wheel the page keeps is never
   * prevented, and a wheel a recognizer takes always is. A gesture ends its
   * end window after its last wheel (wheelEndMs), at that wheel's time, so
   * its release keeps its velocity. A gesture a recognizer took is latched
   * to it, as a browser latches a scroller. While the gesture lasts, the
   * shared input stream hands this every wheel first, wherever it lands. So
   * a pan whose element moves from under a still pointer keeps the gesture.
   * The page listener exists only during a gesture.
   */
  protected readonly onWheel = (event: Event): void => {
    const wheel = event as WheelEvent
    if (this.wheelsSeen.has(wheel)) {
      return
    }
    this.wheelsSeen.add(wheel)
    const time = eventTime(wheel, this.timing)
    const kind = wheel.ctrlKey ? 'pinch' : 'pan'
    let gesture = this.wheel
    if (
      gesture != null
      && (gesture.kind !== kind || time - gesture.last >= gesture.endMs)
    ) {
      this.endWheel(time)
      gesture = null
    }
    if (
      gesture != null
      && gesture.ids.length > 0
      && gesture.follow?.lifted !== true
      && !this.wheelHasTaker(gesture)
    ) {
      // Every recognizer that took it has left (detached, disabled or
      // cancelled), so the rest of the gesture is the page's. A followed
      // pan's own lift does not count. Its momentum stays latched and
      // prevented until the splitter's next gesture or the end timer, and
      // moves nothing. The release is stamped at its last wheel.
      this.endWheel(gesture.last)
      const left = wheelPixels(wheel, this.doc.defaultView)
      gesture = {
        kind,
        scrollType: scrollTypeOf(wheel),
        ids: [],
        x: wheel.clientX,
        y: wheel.clientY,
        span: WHEEL_PINCH_SPAN,
        last: time,
        endMs: wheelEndMs(
          kind,
          scrollTypeOf(wheel),
          Math.abs(left.dx) > Math.abs(left.dy),
        ),
        timer: null,
        takers: [],
      }
      this.wheel = gesture
    }
    let { dx, dy } = wheelPixels(wheel, this.doc.defaultView)
    const horizontal = Math.abs(dx) > Math.abs(dy)
    // The splitter reads a pan's stream only. A ctrl-wheel pinch has no
    // fingers' phase or momentum to tell apart, and ends 100 ms after its
    // last wheel.
    let seg: WheelSegment | null = null
    if (kind === 'pan') {
      // Only a trackpad's wheel can join its glide late; a mouse wheel's
      // notches keep the splitter's other rules.
      seg = this.segmenter.push(
        time,
        horizontal ? dx : dy,
        horizontal ? WHEEL_FOLLOW_END_MS : WHEEL_FOLLOW_END_V_MS,
        scrollTypeOf(wheel) === 'continuous',
      )
    }
    else {
      this.segmenter.end()
    }
    this.wheelSegment = seg
    if (seg?.boundary != null) {
      if (gesture != null) {
        this.endWheel(time)
        gesture = null
      }
    }
    // A late wheel the glide took was the fingers' first when this one grows.
    if (seg != null && seg.carried !== 0) {
      if (horizontal) {
        dx += seg.carried
      }
      else {
        dy += seg.carried
      }
    }
    if (gesture == null) {
      gesture = this.beginWheel(wheel, kind, dx, dy, time)
      this.wheel = gesture
      if (gesture.ids.length > 0) {
        this.latchWheel()
      }
    }
    gesture.last = time
    if (gesture.timer != null) {
      this.clock.clearTimeout(gesture.timer)
    }
    // A trackpad scroll waits out a slow drag's pauses, whoever
    // keeps it; a pinch or a mouse wheel's notches 100 ms.
    gesture.timer = this.clock.setTimeout(() => {
      this.segmenter.end()
      this.endWheel()
    }, gesture.endMs)
    if (gesture.ids.length === 0) {
      return
    }
    wheel.preventDefault()
    if (gesture.kind === 'pan' && gesture.follow) {
      const f = gesture.follow
      if (f.lifted) {
        return
      }
      if (this.wheelSegment?.liftNow === true) {
        // Momentum began: the fingers lifted before the held deltas. The pan
        // keeps the travel it showed through the undecided stretch. It lets
        // go here, still moving at the fingers' speed, so its release carries
        // on from it. The rest of the momentum never moves the pan.
        this.followProvisionally(gesture, f, time)
        f.lifted = true
        this.arena.ended([
          { id: gesture.ids[0], x: gesture.x, y: gesture.y, time },
        ])
        return
      }
      if (this.wheelSegment?.decaying === true) {
        // Undecided: the real deltas wait for the splitter while the
        // fingers' last speed carries the pan on. A held wheel with its own
        // frame ends the reading a stall's bunch joins.
        f.heldX += dx
        f.heldY += dy
        if (this.wheelSegment.bunched) {
          // A raised speed moves on from where the pan is shown, so the
          // position never jumps inside the bunch.
          const since = time - f.lastMove
          const speedX = f.speedX
          const speedY = f.speedY
          joinReading(f, f.trueX - f.heldX, f.trueY - f.heldY)
          f.baseX += (speedX - f.speedX) * since
          f.baseY += (speedY - f.speedY) * since
        }
        else {
          f.readSpan = 0
        }
        this.followProvisionally(gesture, f, time)
        return
      }
      // The fingers' own delta; the held ones were theirs too. Their moves
      // absorb what the pan shows ahead of their travel, or behind it, half a
      // move at a time. So the pan never steps back, and ends on their travel.
      const beforeX = f.trueX - f.heldX
      const beforeY = f.trueY - f.heldY
      const debtX = absorbedDebt(gesture.x - beforeX, dx)
      const debtY = absorbedDebt(gesture.y - beforeY, dy)
      const trueX = beforeX - dx
      const trueY = beforeY - dy
      // A wheel the splitter reads as one stall's merge has no speed of its
      // own. It joins the reading of the move before its bunch, whose
      // interval holds its time.
      const elapsed = time - f.lastMove
      if (this.wheelSegment?.bunched === true) {
        joinReading(f, trueX, trueY)
      }
      else if (elapsed > 0) {
        f.priorSpeedX = f.speedX
        f.priorSpeedY = f.speedY
        f.readFromX = f.trueX
        f.readFromY = f.trueY
        f.readSpan = elapsed
        f.speedX = (trueX - f.trueX) / elapsed
        f.speedY = (trueY - f.trueY) / elapsed
      }
      f.trueX = trueX
      f.trueY = trueY
      f.heldX = 0
      f.heldY = 0
      f.lastMove = time
      gesture.x = trueX + debtX
      gesture.y = trueY + debtY
      f.baseX = gesture.x
      f.baseY = gesture.y
      this.arena.moved([
        { id: gesture.ids[0], x: gesture.x, y: gesture.y, time },
      ])
      return
    }
    if (gesture.kind === 'pan') {
      gesture.x -= dx
      gesture.y -= dy
      this.arena.moved([
        { id: gesture.ids[0], x: gesture.x, y: gesture.y, time },
      ])
    }
    else {
      gesture.span *= Math.exp(-dy / 100)
      this.arena.moved(this.pinchContacts(gesture, time))
    }
  }

  /**
   * Move a followed pan through the splitter's undecided stretch. It moves on
   * from where it was shown at the fingers' last move, at their last speed.
   * It never passes what that speed projects for the time since.
   */
  protected followProvisionally(
    gesture: WheelGesture,
    f: WheelFollow,
    time: number,
  ): void {
    const elapsed = Math.max(0, time - f.lastMove)
    const x = f.baseX + f.speedX * elapsed
    const y = f.baseY + f.speedY * elapsed
    if (x === gesture.x && y === gesture.y) {
      return
    }
    gesture.x = x
    gesture.y = y
    this.arena.moved([{ id: gesture.ids[0], x, y, time }])
  }

  /**
   * Whether a scroller between `target` and `boundary` (both included)
   * scrolls this wheel now, along the wheel's major axis. It uses the edge
   * test a finger's probe uses (canElementScroll). With `keepsBoundary`, the
   * boundary's own scroll is its recognizers', as it is for a finger.
   */
  protected scrollerTakes(
    target: unknown,
    boundary: Element,
    dx: number,
    dy: number,
    isHorizontal: boolean,
    keepsBoundary: boolean,
  ): boolean {
    for (
      let node: Node | null = isNode(target) ? target : null;
      node != null;
      node = parentAcrossShadow(node)
    ) {
      if (node === boundary && keepsBoundary) {
        break
      }
      if (
        isElement(node)
        && canElementScroll(node, isHorizontal ? -dx : 0, isHorizontal ? 0 : -dy)
      ) {
        return true
      }
      if (node === boundary) {
        break
      }
    }
    return false
  }

  /**
   * Whether the touch-action the host derives for `element` keeps the
   * wheel's axis from the browser. A finger's pan along that axis is then
   * the element's recognizers', and so is a trackpad's scroll of the element
   * itself.
   */
  protected keepsAxis(element: Element, isHorizontal: boolean): boolean {
    const registration = this.registry.get(element)
    if (registration == null || !registration.manageStyle) {
      return false
    }
    const active = registration.recognizers.filter(
      recognizer =>
        recognizer.isEnabled && !registration.unstyled.has(recognizer),
    )
    const touchAction
      = active.length > 0 ? gestureHostStyle(active).touchAction : undefined
    if (touchAction == null) {
      return false
    }
    const allowed = parseTouchAction(touchAction)
    return isHorizontal ? !allowed.x : !allowed.y
  }

  /** A ctrl-wheel pinch's two contacts, `span` apart around its center. */
  protected pinchContacts(
    gesture: WheelGesture,
    time: number,
  ): { id: number, x: number, y: number, time: number }[] {
    return [
      { id: gesture.ids[0], x: gesture.x - gesture.span / 2, y: gesture.y, time },
      { id: gesture.ids[1], x: gesture.x + gesture.span / 2, y: gesture.y, time },
    ]
  }

  /** Whether a recognizer that took this wheel gesture still takes part in it. */
  protected wheelHasTaker(gesture: WheelGesture): boolean {
    // A cancelled or failed recognizer keeps that state until its contacts
    // end, which a wheel gesture's do only here.
    return gesture.takers.some((recognizer) => {
      const { state } = recognizer
      return (
        recognizer.isEnabled
        && (state === 'began'
          || state === 'changed'
          || (state === 'possible' && recognizer.isInvolved()))
      )
    })
  }
}
