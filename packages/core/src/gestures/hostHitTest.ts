/**
 * @file hostHitTest.ts
 * @output HostHitTest: Presented hit testing, click retargeting, and the participants a contact meets
 * @position A layer of GestureHost.ts, below HostSelection
 */

import type { GestureRecognizer } from './GestureRecognizer'
import type { PressBounds } from './PressTracker'
import type {
  PointerKind,
  TouchConsumer,
} from './types'
import {
  presentedElements,
  presentedOffsetOf,
  resolvePresented,
} from '../motion/presentation'
import {
  UIKIT_PRESS,
} from '../motion/uikit/gestures'
import {
  armClickGuard,
  withoutClickGuard,
} from '../utils/clickGuard'
import { containsAlongFlatTree } from '../utils/flatTree'
import { isElement, isHTMLElement, isNode } from '../utils/nodeType'

import { isIosWebKit } from '../utils/touchQueries'
import { HostInstall } from './hostInstall'
import {
  parentAcrossShadow,
} from './nativeScroll'

import { holdsTouch } from './touchHold'

/** Presented hit testing, click retargeting, and the participants a contact meets; GestureHost is the class to use. */
export abstract class HostHitTest extends HostInstall {
  /**
   * An element's box where it is drawn: the box the engine reports, moved
   * by the compositor animations of it and its ancestors on engines that
   * report and hit-test those where they started (iOS WebKit). Elsewhere
   * `getBoundingClientRect` already reports the drawn box. Press trackers
   * read their bounds through it.
   */
  presentedRect(element: Element): PressBounds {
    const box = element.getBoundingClientRect()
    if (!this.hitTestsLayout()) {
      return box
    }
    const { x, y } = presentedOffsetOf(element)
    if (x === 0 && y === 0) {
      return box
    }
    return {
      left: box.left + x,
      top: box.top + y,
      right: box.right + x,
      bottom: box.bottom + y,
    }
  }

  /** Whether this engine hit-tests a compositor-moved element at layout. */
  protected hitTestsLayout(): boolean {
    return (
      this.presentedHitTesting === 'always'
      || (this.presentedHitTesting === 'auto' && isIosWebKit(this.doc.defaultView))
    )
  }

  /**
   * Where a contact lands among what is drawn. iOS WebKit hit-tests an
   * element that a compositor animation moves where the animation started:
   * a finger on a settling sheet lands on whatever sat under the sheet's
   * start (the scrim, which closes it), and a finger where the sheet was
   * lands on the sheet. UIKit keeps an interruptible animation hit-testable
   * where it is drawn (UIViewPropertyAnimator). The touch goes to what was
   * drawn under the finger when it landed (`time`, its event's timestamp),
   * even when a busy main thread hands it over later, and content that slid
   * under the finger since takes nothing (`spec:AST-094` FR11).
   */
  protected presentedTarget(
    native: EventTarget | null,
    x: number,
    y: number,
    time: number,
  ): EventTarget | null {
    if (!this.hitTestsLayout()) {
      return native
    }
    const movers = presentedElements().filter((element) => {
      if (!element.isConnected || element.ownerDocument !== this.doc) {
        return false
      }
      const { x: dx, y: dy } = presentedOffsetOf(element)
      return Math.abs(dx) >= 0.5 || Math.abs(dy) >= 0.5
    })
    if (movers.length === 0) {
      return native
    }
    // One style write per mover makes the engine hit-test it where it is
    // drawn now; the hit test below flushes them. The engine then gets
    // z-order, pointer-events and clipping right, which no box math would.
    resolvePresented(movers)
    let hit = this.drawnAt(x, y)
    // A mover kept going while the touch waited for the main thread: what
    // was under the finger when it landed is now that far along. A timestamp
    // on another clock, or older than a second, is not corrected.
    const age = (this.doc.defaultView?.performance.now() ?? time) - time
    if (age > 0 && age < 1000) {
      const movedSince = (mover: Element): { x: number, y: number } | null => {
        const then = presentedOffsetOf(mover, time)
        return Math.abs(then.x) >= 0.5 || Math.abs(then.y) >= 0.5 ? then : null
      }
      const now = hit
      const under
        = now == null
          ? undefined
          : movers.find(mover => containsAlongFlatTree(mover, now))
      let landedOnMover = false
      for (const mover of movers) {
        const then = movedSince(mover)
        if (then == null) {
          continue
        }
        const landed = this.drawnAt(x - then.x, y - then.y)
        if (landed != null && containsAlongFlatTree(mover, landed)) {
          hit = landed
          landedOnMover = true
          break
        }
      }
      // Content that slid under the finger after it landed takes nothing:
      // the touch goes to what was there, beneath it.
      if (!landedOnMover && under != null && movedSince(under) != null) {
        hit = this.drawnBeneath(x, y, movers)
      }
    }
    if (hit == null || hit === native) {
      return native
    }
    const found = hit
    const node = isNode(native) ? native : null
    const isAboutMover = movers.some(
      mover =>
        containsAlongFlatTree(mover, found)
        || (node != null && containsAlongFlatTree(mover, node)),
    )
    return isAboutMover ? found : native
  }

  /** What is drawn at a point beneath every mover. */
  protected drawnBeneath(
    x: number,
    y: number,
    movers: ReadonlyArray<Element>,
  ): Element | null {
    if (typeof this.doc.elementsFromPoint !== 'function') {
      return null
    }
    return (
      this.doc
        .elementsFromPoint(x, y)
        .find(
          element =>
            !movers.some(mover => containsAlongFlatTree(mover, element)),
        ) ?? null
    )
  }

  /** What is drawn at a point, inside open shadow roots too. */
  protected drawnAt(x: number, y: number): Element | null {
    let hit = this.doc.elementFromPoint(x, y)
    // The document answers a shadow host for anything inside its open root:
    // descend to what is drawn there.
    while (hit?.shadowRoot != null) {
      const inner = hit.shadowRoot.elementFromPoint(x, y)
      if (inner == null || inner === hit) {
        break
      }
      hit = inner
    }
    return hit
  }

  /** The browser took these touches (a scroll): no click of ours for them. */
  protected browserTook(ids: ReadonlyArray<number>, time: number): void {
    for (const id of ids) {
      this.retargeted.delete(id)
    }
    this.arena.browserTookOver(ids, time)
  }

  /**
   * The click a retargeted tap earned, on what was drawn under the finger.
   * The engine's own click would hit the start position, so the caller
   * cancels it (or the click guard drops it, a late one included) and this one
   * is the tap's single activation.
   */
  protected clickRetargeted(
    target: EventTarget,
    x: number,
    y: number,
    pointerType: string,
  ): void {
    const view = this.doc.defaultView
    if (!isElement(target) || !target.isConnected || view == null) {
      return
    }
    armClickGuard(this.doc, { takesLateMouse: pointerType === 'touch' })
    if (
      isHTMLElement(target)
      && target.matches('input, textarea, select, [contenteditable]')
    ) {
      target.focus()
    }
    withoutClickGuard(() =>
      target.dispatchEvent(
        new view.MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: 1,
          clientX: x,
          clientY: y,
        }),
      ),
    )
  }

  /**
   * Whether a finger set a scroller containing `node` moving within the last
   * `window` ms. A touch there now brakes the scroll rather than pressing
   * whatever is under it: a native list highlights nothing for one.
   */
  isScrollBraking(
    node: Node,
    window: number = UIKIT_PRESS.scrollBrake.value,
  ): boolean {
    const last = this.lastScroll
    return (
      last != null
      && this.arena.now() - last.time < window
      && containsAlongFlatTree(last.scroller, node)
    )
  }

  // --- Hit path --------------------------------------------------------------

  /**
   * The recognizers on the path from `target` to the document, innermost
   * first, and (for a contact) its consumer: the innermost element with an
   * attached consumer.
   */
  protected participantsAt(
    target: unknown,
    pointerType: PointerKind | null,
  ): {
    recognizers: GestureRecognizer[]
    consumer: TouchConsumer | null
    consumerElement: Element | null
  } {
    const recognizers: GestureRecognizer[] = []
    let consumer: TouchConsumer | null = null
    let consumerElement: Element | null = null
    // A layer that the input hold holds takes no touch while it presents.
    // The host asks the hold, so the hold needs nothing from gestures/. A
    // root-entry component can then use the hold with no gesture code.
    if (
      isNode(target)
      && (holdsTouch(target) || [...this.touchGates].some(gate => gate(target)))
    ) {
      return { recognizers, consumer, consumerElement }
    }
    let hasConsumerOwner = pointerType == null
    for (
      let node: Node | null = isNode(target) ? target : null;
      node != null;
      node = parentAcrossShadow(node)
    ) {
      if (!isElement(node)) {
        continue
      }
      const registration = this.registry.get(node)
      if (registration != null) {
        // Every pointer (`spec:AST-094` FR43), hover included.
        recognizers.push(...registration.recognizers)
      }
      if (hasConsumerOwner || pointerType == null) {
        continue
      }
      // A press consumer takes every pointer's press, a mouse's too
      // (`spec:AST-094` FR43, DEC-21).
      if (registration?.consumer != null) {
        consumer = registration.consumer
        consumerElement = node
        hasConsumerOwner = true
        continue
      }
    }
    return { recognizers, consumer, consumerElement }
  }
}
