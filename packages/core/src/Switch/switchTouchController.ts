/**
 * @file switchTouchController.ts
 * @input Switch's parts, its value, whether it takes a press, and the
 *   pointer the page has (coarse or fine)
 * @output SwitchTouchController: Switch's gestures for a mouse, a pen and a
 *   finger, with the touch presentation under a coarse primary pointer
 * @position DOM half of Switch's touch presentation, on the gesture host's
 *   press tracking (../gestures); its visuals are switchTouchVisuals.ts and
 *   its rules switchTouch.ts. Driven by useSwitchTouch.ts
 *
 * UISwitch on iOS 26.2 is the reference; every number is in
 * motion/uikit/switch.ts.
 *
 * - Touches go to a press tracker, which never blocks a scroll.
 *   `touch-action: pan-y pinch-zoom` (switch.css) keeps horizontal moves for
 *   the switch: a drag follows and flips it, and the release commits. A
 *   vertical drag is the page's scroll, and the switch yields.
 * - A tap, a hold or a short drag activates through the browser's own click.
 *   The browser sends no click for a finger's hold, so the switch clicks its
 *   input once the click window passes. A drag that flipped gets no click, so
 *   the switch clicks its input and the shared click guard swallows the
 *   browser's late click. A finger's press slid off and lifted outside
 *   toggles too, as UISwitch's does. Forms, `change` and the keyboard stay
 *   the native checkbox's.
 * - Under a fine primary pointer the switch keeps its own look. The same
 *   tracking, flip rule and release decide the value, with no animator, and
 *   the thumb moves when the value does. A mouse or a pen released outside
 *   leaves the switch alone, so the press can be taken back (WCAG 2.5.2).
 */

import type { ControlEvent } from '../gestures/PressTracker'
import type { GestureTouch } from '../gestures/types'
import type { SwitchFlip, SwitchTouchGeometry } from './switchTouch'
import type { SwitchTouchElements } from './switchTouchVisuals'
import { getGestureHost } from '../gestures/GestureHost'
import { createPressTracker } from '../gestures/PressTracker'
import { UIKIT_GESTURES } from '../motion/uikit/gestures'
import { registerSwitchTable } from '../motion/uikit/switch'
import { awaitBrowserClick, clickForLift } from '../utils/browserClickWait'
import { armClickGuard } from '../utils/clickGuard'
import { isRtlElement } from '../utils/isRtlElement'
import { lockPressedRow } from '../utils/pressedRowLock'
import { commitOnRelease, dragTarget, startFlip, stepFlip } from './switchTouch'
import { SwitchTouchVisuals } from './switchTouchVisuals'

/** The touch presentation under a coarse primary pointer, or the switch's own. */
export type SwitchPresentation = 'touch' | 'pointer'

/** The thumb's diameter in each state, px. */
export interface SwitchThumbSizes {
  readonly off: number
  readonly on: number
}

/** Horizontal travel at which the press begins if it has not (a pan would), px. */
const PAN_HYSTERESIS = UIKIT_GESTURES.pan.hysteresis.value

function now(): number {
  return typeof performance === 'undefined' ? Date.now() : performance.now()
}

interface Drag {
  /** The thumb's offset when the finger landed. */
  readonly start: number
  flip: SwitchFlip
}

export class SwitchTouchController {
  private readonly visuals: SwitchTouchVisuals
  private elements: SwitchTouchElements | null = null
  private isInteractive = true
  /** The thumb's diameter in each state, for a change before any press. */
  private thumbSizes: SwitchThumbSizes | null = null
  /** The thumb's diameter the stylesheet sets for the state it attached in. */
  private attachedThumb: number | null = null
  private detachers: (() => void)[] = []
  /** When the press began (ms); null with no press. */
  private pressTime: number | null = null
  /** The thumb's offset when the current finger landed. */
  private downOffset = 0
  private drag: Drag | null = null
  /** The press and the pan both report one event; the second is skipped. */
  private isStepping = false
  /** The current touch already ended in a release. */
  private released = false
  /** Reduced motion: a release changed the value and the travel waits for it. */
  private pendingTravel = false
  /** A finger is down on the switch. */
  private isTracking = false
  /** A lift is waiting for the browser's own click; this ends the wait. */
  private endBrowserClickWait: (() => void) | null = null
  private reconcileTimer: ReturnType<typeof setTimeout> | null = null

  constructor(isOn: boolean, geometry: SwitchTouchGeometry) {
    this.visuals = new SwitchTouchVisuals(isOn, geometry)
  }

  get isAttached(): boolean {
    return this.elements != null
  }

  attach(elements: SwitchTouchElements, presentation: SwitchPresentation): void {
    this.detach()
    this.elements = elements
    const direction = isRtlElement(elements.surface) ? -1 : 1
    this.attachedThumb = null
    this.visuals.bind(elements, direction)
    if (presentation === 'touch') {
      registerSwitchTable()
      // A style read, never a layout: the boxes wait for the first press. A
      // value change before any press grows the thumb from this size.
      const themed = /^\s*(\d+(?:\.\d+)?|\.\d+)px\s*$/.exec(getComputedStyle(elements.thumb).getPropertyValue('--_switch-thumb-size'))
      this.attachedThumb = themed ? Number(themed[1]) : null
      this.visuals.attach(elements, direction)
    }
    this.detachers = this.attachTracker(elements.surface)
  }

  /**
   * UIControl's tracking, which never blocks a scroll. The press begins with
   * the touch, or with the first horizontal move a pan would begin on.
   * Inside a scroller the touch waits for the content delay.
   */
  private attachTracker(surface: HTMLElement): (() => void)[] {
    const host = getGestureHost(surface.ownerDocument)
    const tracker = createPressTracker({
      view: surface,
      getBounds: () => surface.getBoundingClientRect(),
      isEnabled: () => this.isInteractive,
      isBraking: () => host.isScrollBraking(surface),
      // A held finger selects no text beside the switch.
      selectionLock: lockPressedRow,
      // A held switch opens no menu (UISwitch shows none).
      holdsContextMenu: () => this.pressTime != null,
      onControlEvent: (event, touch) => this.onControlEvent(event, touch),
      onHighlightChange: (isHighlighted) => {
        if (isHighlighted && this.isTracking && this.pressTime == null)
          this.pressBegan(now())
      },
    })
    return [host.attachConsumer(surface, tracker), () => tracker.dispose()]
  }

  /** Undo everything: listeners, timers, animations and inline styles. */
  detach(): void {
    for (const detach of this.detachers)
      detach()
    this.detachers = []
    this.clearTimers()
    this.visuals.detach()
    this.elements = null
    this.pressTime = null
    this.drag = null
    this.isTracking = false
  }

  setInteractive(isInteractive: boolean): void {
    this.isInteractive = isInteractive
    if (!isInteractive && this.pressTime != null)
      this.abandon(now())
  }

  setThumbSizes(sizes: SwitchThumbSizes | null): void {
    this.thumbSizes = sizes
  }

  setGeometry(geometry: SwitchTouchGeometry): void {
    this.visuals.setGeometry(geometry)
  }

  /**
   * The rendered value changed and the CSS already moved the thumb's rest.
   * The visuals rebase so nothing moves on screen, then head for the value.
   */
  setValue(isOn: boolean): void {
    const visuals = this.visuals
    if (isOn === visuals.isOn)
      return
    const previous = visuals.isOn
    const time = now()
    const previousSize = this.thumbSizes == null ? null : (this.attachedThumb ?? this.thumbSizes[previous ? 'on' : 'off'])
    const springs = visuals.rebaseToValue(isOn, previousSize, time)
    const thumb = visuals.thumb
    if (thumb == null) {
      visuals.isVisuallyOn = isOn
      return
    }
    const wasDragging = this.endDragForValue()
    // A release already sent the visuals here. Any other change, the app's or
    // one mid-gesture, sends them now, and a spring heads for the new rest.
    if (springs || wasDragging || this.pendingTravel || visuals.isVisuallyOn !== isOn) {
      const touchRelease = this.pendingTravel
      this.pendingTravel = false
      visuals.showSide(isOn, time, thumb.getVelocity('x', time), touchRelease)
    }
  }

  /** The app changed the value mid-gesture: the value wins, nothing commits. */
  private endDragForValue(): boolean {
    if (this.drag == null || this.released)
      return false
    this.drag = null
    this.released = true
    this.pressEnded()
    return true
  }

  // --- Touches ---------------------------------------------------------------

  private touchDown(time: number): void {
    // Each press reads the rendered boxes once, before the drag needs them.
    this.visuals.measureGeometry()
    this.visuals.landBase(time)
    this.released = false
    this.pendingTravel = false
    this.drag = null
    this.downOffset = this.visuals.offsetAt(time)
  }

  private onControlEvent(event: ControlEvent, touch: GestureTouch): void {
    const travel = touch.x - touch.startX
    // The motion starts when the switch handles the event: a busy main thread
    // delays it, never steps it back or skips into it.
    const time = now()
    switch (event) {
      case 'touchDown':
        this.isTracking = true
        this.touchDown(time)
        return
      case 'touchDragInside':
      case 'touchDragOutside':
        if (this.released || !this.isInteractive)
          return
        if (this.pressTime == null) {
          if (Math.abs(travel) < PAN_HYSTERESIS)
            return
          // A pan would begin here: the switch takes the horizontal drag.
          this.pressBegan(time)
        }
        this.move(time, travel)
        return
      case 'touchUpInside':
      case 'touchUpOutside':
        this.isTracking = false
        if (this.released || !this.isInteractive)
          return
        // The lift is a step of its own: a flip armed by the last move
        // happens here (a fast swipe flips on the lift).
        this.move(time, travel)
        if (this.drag?.flip.didFlip !== true && event === 'touchUpInside') {
          // A tap, a hold or a short drag: the browser's click activates it.
          // Only a finger's lift can come with no click (a hold).
          this.release(time, { byBrowserClick: true, clicksIfNoBrowserClick: touch.pointerType === 'touch' })
          return
        }
        if (touch.pointerType !== 'touch' && (event === 'touchUpOutside' || this.drag?.flip.didFlip !== true)) {
          // A mouse or a pen released outside leaves the switch alone, as the
          // native checkbox does. Only a finger's press slid off toggles.
          this.released = true
          this.abandon(time)
          return
        }
        // A drag that flipped, or a finger's press slid off and lifted
        // outside. The switch decides this lift, so the shared click guard
        // swallows the browser's click if one comes.
        if (this.elements != null)
          armClickGuard(this.elements.input.ownerDocument)
        this.release(time)
        return
      case 'touchCancel':
        // The browser took the touch for its scroll, or a recognizer above
        // took it: the switch yields.
        this.isTracking = false
        if (!this.released) {
          this.released = true
          this.abandon(time)
        }
        break
      default:
        // touchDragEnter and touchDragExit: the drag above already follows.
        break
    }
  }

  /** One event of a held or dragged switch: the thumb follows and the flip rule steps. */
  private move(time: number, travel: number): void {
    if (this.isStepping)
      return
    this.isStepping = true
    queueMicrotask(() => {
      this.isStepping = false
    })
    const visuals = this.visuals
    const x = visuals.direction * travel
    const drag = (this.drag ??= { start: this.downOffset, flip: startFlip(visuals.isOn) })
    // The thumb under the finger is direct manipulation, which reduced motion
    // leaves alone. Under a fine pointer nothing follows the pointer.
    visuals.track(dragTarget(drag.start, x, visuals.geometry))
    drag.flip = stepFlip(drag.flip, x, visuals.geometry)
    if (drag.flip.isVisuallyOn !== visuals.isVisuallyOn)
      visuals.showWell(drag.flip.isVisuallyOn, time)
  }

  /**
   * The finger lifted after a tap, a hold or a drag. `byBrowserClick`: the
   * browser's own click activates the input, and the switch clicks it only
   * if that click never comes.
   */
  private release(time: number, { byBrowserClick = false, clicksIfNoBrowserClick = true } = {}): void {
    if (this.released)
      return
    this.released = true
    this.clearTimers()
    const visuals = this.visuals
    const commit = commitOnRelease(this.drag?.flip ?? null, visuals.isOn)
    this.drag = null
    if (this.pressTime == null) {
      // A tap quicker than a scroller's content delay: the press begins now.
      this.pressBegan(time)
    }
    if (commit !== visuals.isOn && visuals.thumb != null && visuals.thumb.reducedMotion({ touchRelease: true }) !== 'off') {
      // Under reduced motion the travel is one cross-fade, played when the
      // value commits (setValue). The colour starts now.
      this.pendingTravel = true
      visuals.showWell(commit, time, true)
    }
    else {
      visuals.showSide(commit, time, undefined, true)
    }
    this.pressEnded(time, true)
    const surface = this.elements?.surface
    if (byBrowserClick && surface != null) {
      this.endBrowserClickWait = awaitBrowserClick(surface, {
        onClicked: () => {
          this.endBrowserClickWait = null
          this.scheduleReconcile()
        },
        onNoClick: () => {
          this.endBrowserClickWait = null
          if (clicksIfNoBrowserClick && commit !== visuals.isOn)
            this.clickInput()
          this.scheduleReconcile()
        },
      })
      return
    }
    if (commit !== visuals.isOn) {
      // No click comes from the browser for this lift; the input's own click
      // keeps every native path (form value, change, the label).
      this.clickInput()
    }
    this.scheduleReconcile()
  }

  private clickInput(): void {
    const input = this.elements?.input
    if (input != null)
      clickForLift(input)
  }

  /** If the owner kept the old value, the visuals go back to it. */
  private scheduleReconcile(): void {
    if (this.reconcileTimer != null)
      clearTimeout(this.reconcileTimer)
    this.reconcileTimer = setTimeout(() => {
      this.reconcileTimer = null
      const visuals = this.visuals
      if (this.drag == null && visuals.isVisuallyOn !== visuals.isOn) {
        this.pendingTravel = false
        visuals.showSide(visuals.isOn, now(), undefined, true)
      }
    }, 0)
  }

  /** The touch ended without a release (cancelled, or the switch turned off). */
  private abandon(time: number): void {
    this.drag = null
    this.visuals.showSide(this.visuals.isOn, time, undefined, true)
    this.pressEnded(time, true)
  }

  /** The press began: the switch holds the touch and the thumb lifts. */
  private pressBegan(time: number): void {
    this.pressTime = time
    this.visuals.lift(time)
  }

  private pressEnded(time: number = now(), touchRelease = false): void {
    this.pressTime = null
    this.visuals.settle(time, touchRelease)
  }

  private clearTimers(): void {
    this.endBrowserClickWait?.()
    this.endBrowserClickWait = null
    if (this.reconcileTimer != null) {
      clearTimeout(this.reconcileTimer)
      this.reconcileTimer = null
    }
  }
}
