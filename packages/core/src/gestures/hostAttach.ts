/**
 * @file hostAttach.ts
 * @output HostAttach: Attaching recognizers and consumers, layout watches, and the registrations' reads
 * @position A layer of GestureHost.ts, below HostStyle
 */

import type { GestureRecognizer } from './GestureRecognizer'
import type { AttachOptions, Registration } from './hostTypes'
import type { WheelGesture } from './hostWheel'
import type {
  TouchConsumer,
} from './types'

import { containsAlongFlatTree } from '../utils/flatTree'
import { isHTMLElement } from '../utils/nodeType'

import { asScreenEdgePan } from './hostHelpers'
import { HostState } from './hostState'

/** Attaching recognizers and consumers, layout watches, and the registrations' reads; GestureHost is the class to use. */
export abstract class HostAttach extends HostState {
  protected abstract applyStyle(element: HTMLElement, registration: Registration): void
  protected abstract endWheel(endTime?: number): void
  protected abstract readonly onBlockingTouchMove: (event: Event) => void
  protected abstract readonly onClaimedTouchEnd: (event: Event) => void
  protected abstract readonly onWheel: (event: Event) => void
  protected abstract syncTouchMoveListener(
    element: Element,
    registration: Registration,
  ): void
  protected abstract uninstallIfIdle(): void
  protected abstract watchPointer(): void
  protected abstract wheelHasTaker(gesture: WheelGesture): boolean

  // --- Attachment ------------------------------------------------------------

  /** Attach a recognizer to an element. Returns the detach function. */
  attach(
    element: Element,
    recognizer: GestureRecognizer,
    options: AttachOptions = {},
  ): () => void {
    const registration = this.registrationFor(element)
    // Each attachment says whether the host styles the element for its
    // recognizer. The element is styled while an attached recognizer asks.
    if (options.manageStyle === false) {
      registration.unstyled.add(recognizer)
      if (registration.recognizers.length === 0) {
        registration.manageStyle = false
      }
    }
    else {
      registration.manageStyle = true
    }
    // An action group while any attachment asks, whatever their order.
    const asksForGroup = options.actionGroup === true
    if (asksForGroup) {
      registration.actionGroupAsks += 1
      registration.actionGroup = true
    }
    recognizer.view = element
    registration.recognizers.push(recognizer)
    recognizer.onEnabledChange = () => {
      this.refresh(element, registration)
      this.syncListeners()
    }
    const edgePan = asScreenEdgePan(recognizer)
    if (edgePan != null) {
      // A new answer may also move the band the pan watches onto or off the
      // right side, whose band moves with the viewport (an in-place switch
      // of direction): the layout watch follows (FR18, FR24, DEC-22).
      edgePan.onTouchBehaviorChange = () => {
        this.refresh(element, registration)
        this.syncLayoutWatch()
      }
    }
    this.refresh(element, registration)
    this.syncListeners()
    return () => {
      recognizer.onEnabledChange = null
      if (asksForGroup) {
        registration.actionGroupAsks -= 1
        registration.actionGroup = registration.actionGroupAsks > 0
      }
      if (edgePan != null) {
        edgePan.onTouchBehaviorChange = null
      }
      const index = registration.recognizers.indexOf(recognizer)
      if (index >= 0) {
        registration.recognizers.splice(index, 1)
      }
      registration.unstyled.delete(recognizer)
      // A recognizer whose view goes away mid-gesture is cancelled, as in
      // UIKit when a view leaves the window.
      if (recognizer.state !== 'possible' || recognizer.isInvolved()) {
        recognizer.cancel()
      }
      const wheel = this.wheel
      if (
        wheel != null
        && wheel.takers.includes(recognizer)
        && !this.wheelHasTaker(wheel)
      ) {
        // At its last wheel: a later stamp would move the arena's clock past
        // the next input's own time.
        this.endWheel(wheel.last)
      }
      this.refresh(element, registration)
      // Even when the element keeps other attachments: one left disabled
      // keeps no listener or observer (FR24).
      this.syncListeners()
      this.cleanup(element, registration)
    }
  }

  /**
   * Watch the box of each element with an enabled screen-edge pan, and the
   * root's for a pan that watches the right side, whose band moves with the
   * viewport: a resize may move an element into or out of its edge band, and
   * the pan then measures again and re-derives the element's touch-action
   * (FR19). The host sets touch-action for every pointer (FR43), so it
   * watches under any primary pointer. One ResizeObserver serves every
   * element and goes with the last one, and no listener is added (FR24); an
   * engine without ResizeObserver keeps each pan's first measurement.
   */
  protected syncLayoutWatch(): void {
    const wanted = new Set<Element>()
    let watchesViewport = false
    for (const [element, registration] of this.registry) {
      for (const recognizer of registration.recognizers) {
        const edgePan = asScreenEdgePan(recognizer)
        if (edgePan != null && edgePan.isEnabled) {
          wanted.add(element)
          watchesViewport ||= edgePan.watchesViewport
        }
      }
    }
    if (watchesViewport) {
      wanted.add(this.doc.documentElement)
    }
    for (const element of [...this.layoutWatched]) {
      if (!wanted.has(element)) {
        this.layoutObserver?.unobserve(element)
        this.layoutWatched.delete(element)
      }
    }
    if (wanted.size === 0) {
      this.layoutObserver?.disconnect()
      this.layoutObserver = null
      return
    }
    const view = this.doc.defaultView
    if (
      this.layoutObserver == null
      && view != null
      && typeof view.ResizeObserver === 'function'
    ) {
      this.layoutObserver = new view.ResizeObserver(this.onLayoutChange)
      for (const element of this.layoutWatched) {
        this.layoutObserver.observe(element)
      }
    }
    for (const element of wanted) {
      if (!this.layoutWatched.has(element)) {
        this.layoutObserver?.observe(element)
        this.layoutWatched.add(element)
      }
    }
  }

  /** A watched box or the root resized: each enabled edge pan measures again. */
  protected readonly onLayoutChange = (): void => {
    for (const registration of this.registry.values()) {
      for (const recognizer of registration.recognizers) {
        const edgePan = asScreenEdgePan(recognizer)
        if (edgePan != null && edgePan.isEnabled) {
          edgePan.layoutChanged()
        }
      }
    }
  }

  /** Attach the view-level touch consumer of an element (a pressable control). */
  attachConsumer(
    element: Element,
    consumer: TouchConsumer,
    _options: Pick<AttachOptions, 'perEventPointer'> = {},
  ): () => void {
    const registration = this.registrationFor(element)
    registration.consumer = consumer
    this.refresh(element, registration)
    this.syncListeners()
    return () => {
      if (registration.consumer === consumer) {
        registration.consumer = null
      }
      // A keepsTouch consumer's blocking touchmove goes with it, even while
      // the element keeps its recognizers.
      this.refresh(element, registration)
      // Even when the element keeps a recognizer: one left disabled keeps
      // no listener or observer (FR24).
      this.syncListeners()
      this.cleanup(element, registration)
    }
  }

  /**
   * Internal. Keep the host's listeners installed until the returned
   * function runs, with no recognizer attached (fingerScroll.ts reads the
   * finger record meanwhile).
   */
  retain(): () => void {
    this.retainers += 1
    // A watch is not an attach: no warning where the pointer is fine.
    this.watchPointer()
    this.syncListeners()
    let isRetained = true
    return () => {
      if (!isRetained) {
        return
      }
      isRetained = false
      this.retainers -= 1
      this.uninstallIfIdle()
    }
  }

  /**
   * Internal. Call `listener` after each touch event the host hears, once
   * the finger record is up to date. Returns the unsubscribe.
   */
  onFingersChange(listener: () => void): () => void {
    this.fingerListeners.add(listener)
    return () => {
      this.fingerListeners.delete(listener)
    }
  }

  /** Internal. Whether a finger that landed inside `node` is down now. */
  isFingerDownIn(node: Node): boolean {
    // Along the flat tree: a finger on content inside an open shadow root is
    // in the scroller around that root.
    return this.fingerTargets.some(target =>
      containsAlongFlatTree(node, target),
    )
  }

  /**
   * Internal. Whether a pen that went down inside `node` is down now,
   * whichever participant keeps it. A pen's own menu event is that hold's
   * (contextRequest.ts).
   */
  isPenDownIn(node: Node): boolean {
    return this.arena.touches.some(
      touch =>
        touch.pointerType === 'pen'
        // A lifted pen that a recognizer still decides on is no longer down.
        && touch.phase !== 'ended'
        && touch.phase !== 'cancelled'
        && touch.target instanceof Node
        && containsAlongFlatTree(node, touch.target),
    )
  }

  /**
   * Internal. When a pen hold that went down inside `node` last ended, at
   * its lift or a cancel. The time is on the host's clock: negative infinity
   * when none did.
   */
  lastPenLiftIn(node: Node): number {
    const lift = this.lastPenLift
    return lift != null
      && lift.target instanceof Node
      && containsAlongFlatTree(node, lift.target)
      ? lift.time
      : Number.NEGATIVE_INFINITY
  }

  protected registrationFor(element: Element): Registration {
    this.watchPointer()
    let registration = this.registry.get(element)
    if (registration == null) {
      registration = {
        recognizers: [],
        consumer: null,
        hasTouchEndListener: false,
        hasTouchMoveListener: false,
        hasWheelListener: false,
        savedStyle: new Map(),
        authorTouchAction: null,
        manageStyle: true,
        unstyled: new Set(),
        actionGroup: false,
        actionGroupAsks: 0,
      }
      this.registry.set(element, registration)
    }
    return registration
  }

  /** Whether anything attached could take input. */
  protected needsInput(): boolean {
    return this.registry.size > 0 || this.retainers > 0
  }

  protected refresh(element: Element, registration: Registration): void {
    if (registration.manageStyle && isHTMLElement(element)) {
      this.applyStyle(element, registration)
    }
    this.syncTouchMoveListener(element, registration)
  }

  protected cleanup(element: Element, registration: Registration): void {
    if (registration.recognizers.length > 0 || registration.consumer != null) {
      // What stays may take nothing (only disabled recognizers): FR24.
      this.syncListeners()
      return
    }
    if (registration.hasTouchEndListener) {
      element.removeEventListener('touchend', this.onClaimedTouchEnd)
      registration.hasTouchEndListener = false
    }
    if (registration.hasTouchMoveListener) {
      element.removeEventListener('touchmove', this.onBlockingTouchMove)
    }
    if (registration.hasWheelListener) {
      element.removeEventListener('wheel', this.onWheel)
    }
    this.registry.delete(element)
    this.uninstallIfIdle()
  }
}
