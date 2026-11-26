/**
 * @file hostWheelGesture.ts
 * @output HostWheelGesture: A wheel gesture's begin, latch and end
 * @position A layer of GestureHost.ts, below HostTouchStart
 */

import type { GestureRecognizer } from './GestureRecognizer'
import type { WheelGesture } from './hostWheel'

import { subscribeInput } from '../utils/inputStream'
import { isElement, isNode } from '../utils/nodeType'

import { isScrollEdgePan, landedOn, panTakesMove } from './hostHelpers'
import { ahead, scrollTypeOf, WHEEL_PINCH_SPAN, wheelEndMs } from './hostWheel'
import { HostWheelInput } from './hostWheelInput'
import {
  createNativeScrollProbe,
  parentAcrossShadow,
} from './nativeScroll'

import { internals } from './recognizerInternals'

/** A wheel gesture's begin, latch and end; GestureHost is the class to use. */
export abstract class HostWheelGesture extends HostWheelInput {
  /** Start a wheel gesture: who takes it, decided once, or nobody. */
  protected beginWheel(
    wheel: WheelEvent,
    kind: 'pan' | 'pinch',
    dx: number,
    dy: number,
    time: number,
  ): WheelGesture {
    const type = scrollTypeOf(wheel)
    const isHorizontal = Math.abs(dx) > Math.abs(dy)
    const kept: WheelGesture = {
      kind,
      scrollType: type,
      ids: [],
      x: wheel.clientX,
      y: wheel.clientY,
      span: WHEEL_PINCH_SPAN,
      last: time,
      endMs: wheelEndMs(kind, type, isHorizontal),
      timer: null,
      takers: [],
    }
    // A contact already down keeps its gesture; the wheel stays the page's.
    // So does a first wheel another handler already prevented, or one that
    // cannot be cancelled: no recognizer could take it from the page.
    if (
      this.arena.touches.length > 0
      || (dx === 0 && dy === 0)
      || wheel.defaultPrevented
      || !wheel.cancelable
    ) {
      return kept
    }
    // Every scroller under the pointer, the page included, as a finger's
    // probe reads them, without touch-action, which a wheel ignores.
    // What the wheel landed on: at a shadow host's listener the event's
    // target is the host, and a scroller inside its tree must count.
    const target = landedOn(wheel)
    const scroll = createNativeScrollProbe(target, {
      readsTouchAction: false,
    })
    const takers: GestureRecognizer[] = []
    for (
      let node: Node | null = isNode(target) ? target : null;
      node != null;
      node = parentAcrossShadow(node)
    ) {
      if (!isElement(node)) {
        continue
      }
      for (const recognizer of this.registry.get(node)?.recognizers ?? []) {
        // A pan follows a trackpad, never a mouse wheel's notches, which
        // scroll what is under the pointer.
        if (
          !recognizer.isEnabled
          || !recognizer.claimsTouches
          || !recognizer.allowedScrollTypes.has(type)
          || internals(recognizer).family !== kind
          || (kind === 'pan' && type !== 'continuous')
        ) {
          continue
        }
        if (
          kind === 'pan'
          && (!panTakesMove(recognizer, -dx, -dy)
            || this.scrollerTakes(
              target,
              node,
              dx,
              dy,
              isHorizontal,
              this.keepsAxis(node, isHorizontal),
            )
            // A scroll-edge pan only past every scroller's edge.
            || (isScrollEdgePan(recognizer) && scroll.canScroll(-dx, -dy)))
        ) {
          continue
        }
        takers.push(recognizer)
      }
    }
    if (takers.length === 0) {
      return kept
    }
    const base = {
      pointerType: 'mouse' as const,
      target,
      scroll,
      scrollType: type,
      recognizers: takers,
      consumer: null,
    }
    const ids
      = kind === 'pan' ? [this.nextId++] : [this.nextId++, this.nextId++]
    const gesture: WheelGesture = { ...kept, ids, takers }
    if (kind === 'pan' && type === 'continuous') {
      gesture.follow = {
        lifted: false,
        heldX: 0,
        heldY: 0,
        lastMove: time,
        trueX: kept.x,
        trueY: kept.y,
        baseX: kept.x,
        baseY: kept.y,
        speedX: 0,
        speedY: 0,
        readFromX: kept.x,
        readFromY: kept.y,
        readSpan: 0,
        priorSpeedX: 0,
        priorSpeedY: 0,
      }
    }
    this.arena.began(
      kind === 'pan'
        ? [{ ...base, id: ids[0], x: wheel.clientX, y: wheel.clientY, time }]
        : this.pinchContacts(gesture, time).map(input => ({
            ...base,
            ...input,
          })),
    )
    // Every recognizer it was offered to may decline it (its own
    // shouldReceiveTouch). Then nobody took the wheel, and it scrolls the
    // page from its first step, as with no gesture system.
    if (ids.every(id => this.arena.participantsOf(id).length === 0)) {
      this.arena.cancelled(ids, time)
      return kept
    }
    return gesture
  }

  /**
   * Route every wheel on the page to the live wheel gesture, from its claim.
   * The route is the shared input stream's capture listener on the window,
   * which runs before any document listener. It is non-passive only while it
   * is subscribed.
   */
  protected latchWheel(): void {
    const view = this.doc.defaultView
    if (this.stopWheelLatch == null && view != null) {
      const cancelWheel = (): void => {
        const ids = this.dropDrivenWheel()
        if (ids.length > 0) {
          this.arena.cancelled(ids, this.arena.now())
        }
      }
      const stops = [
        subscribeInput(view, 'wheel', this.onWheel, { cancels: true }),
        // A page that loses focus or hides ends a trackpad pan, as it ends
        // every touch. An element's blur reaches the window's capture phase
        // too and means nothing here.
        subscribeInput(view, 'blur', (event) => {
          if (!isNode(event.target)) {
            cancelWheel()
          }
        }),
        subscribeInput(view, 'visibilitychange', () => {
          if (this.doc.visibilityState === 'hidden') {
            cancelWheel()
          }
        }),
      ]
      this.stopWheelLatch = () => {
        for (const stop of stops) {
          stop()
        }
      }
    }
  }

  /**
   * End the trackpad pan a recognizer still drives, when the page loses focus
   * or hides, and return its contacts to cancel. The rest of its stream is
   * the page's until the stream ends, as a touch the browser takes is. A
   * ctrl-wheel pinch keeps its stream, so the page never zooms for it. A
   * gesture the page keeps stays as it is. So does a pan its lift released:
   * its momentum stays latched and prevented until the stream ends.
   */
  protected dropDrivenWheel(): ReadonlyArray<number> {
    const gesture = this.wheel
    if (
      gesture == null
      || gesture.kind !== 'pan'
      || gesture.ids.length === 0
      || gesture.follow?.lifted === true
    ) {
      return []
    }
    const kept: WheelGesture = { ...gesture, ids: [], takers: [] }
    delete kept.follow
    this.wheel = kept
    this.stopWheelLatch?.()
    this.stopWheelLatch = null
    return gesture.ids
  }

  /**
   * End the wheel gesture in progress. On its own timer, it ends its end
   * window after its last wheel. A taker that leaves (a detach, a disable)
   * passes that last wheel's time. An input that ends it sooner (a press,
   * the next gesture's first wheel) passes its own time. Both times are on
   * the wheels' time base (eventTime), never the host's clock, which need
   * not share it.
   */
  protected endWheel(endTime?: number): void {
    const gesture = this.wheel
    this.stopWheelLatch?.()
    this.stopWheelLatch = null
    if (gesture == null) {
      return
    }
    this.wheel = null
    if (gesture.timer != null) {
      this.clock.clearTimeout(gesture.timer)
    }
    if (gesture.ids.length === 0 || gesture.follow?.lifted) {
      return
    }
    // Fingers that stop without a lift end on their travel, where it runs
    // ahead of what the pan shows. What the undecided stretch showed past it
    // stays, as a step back would show.
    if (gesture.follow != null) {
      const f = gesture.follow
      const x = ahead(gesture.x, f.trueX - f.heldX, f.speedX)
      const y = ahead(gesture.y, f.trueY - f.heldY, f.speedY)
      if (x !== gesture.x || y !== gesture.y) {
        gesture.x = x
        gesture.y = y
        this.arena.moved([{ id: gesture.ids[0], x, y, time: gesture.last }])
      }
    }
    // A trackpad scroll whose fingers stop releases still, past the
    // velocity's stillness interval. A pinch releases 100 ms after its last
    // wheel, and a lift released the pan already. The release is never later
    // than the input that ends it (a press, the next gesture's first wheel).
    // The arena's clock only moves forward, so a later stamp would move that
    // input's times too.
    const end = gesture.last + gesture.endMs
    const time
      = endTime == null ? end : Math.max(gesture.last, Math.min(end, endTime))
    this.arena.ended(
      gesture.kind === 'pan'
        ? [{ id: gesture.ids[0], x: gesture.x, y: gesture.y, time }]
        : this.pinchContacts(gesture, time),
    )
  }
}
