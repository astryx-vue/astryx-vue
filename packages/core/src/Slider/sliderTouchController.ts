/**
 * @file sliderTouchController.ts
 * @input The slider's parts and value model, the gesture recognizers and
 *   the UIKit slider table
 * @output SliderTouchController: UISlider's tracking for one Slider (both
 *   thumbs of a range), for every pointer
 * @position Internal to Slider: useSliderTouch.ts attaches it while the
 *   slider is enabled. Its drawn half is sliderTouchMotion.ts.
 *
 * - A press on a thumb changes no value. Once the pointer has moved past the
 *   pan's hysteresis the value follows its travel, so the thumb never jumps
 *   to the pointer.
 * - A finger or a pen claims the drag only along the track, so a swipe across
 *   it scrolls the page; a mouse claims it in any direction.
 * - A finger's release coasts on UISlider's measured spring; a mouse's or a
 *   pen's drag ends where it lets go. `changeEnd` fires once a coast settles.
 * - A finger's or a pen's tap on the track sets the value on its lift. A
 *   mouse press on the track stays with useSlider's pointer handlers.
 */

import type { GestureRecognizer } from '../gestures/GestureRecognizer'
import type { ControlEvent } from '../gestures/PressTracker'
import type { SwipeGestureRecognizer } from '../gestures/SwipeGestureRecognizer'
import type { PointerKind } from '../gestures/types'
import type { SliderInteraction } from './sliderTouchMotion'
import { getGestureHost } from '../gestures/GestureHost'
import { playHaptic } from '../gestures/haptics'
import { PanGestureRecognizer } from '../gestures/PanGestureRecognizer'
import { createPressTracker, PRESS_PROFILES } from '../gestures/PressTracker'
import { TapGestureRecognizer } from '../gestures/TapGestureRecognizer'
import { projectDistance } from '../motion/projection'
import { UIKIT_CONTROL, UIKIT_PAN } from '../motion/uikit/gestures'
import { slider as UIKIT_SLIDER } from '../motion/uikit/slider'
import { registerSpringsTable } from '../motion/uikit/springs'
import { lockSelection } from '../utils/selectionLock'
import { observeResize } from '../utils/sharedResizeObserver'
import { SliderTouchMotion } from './sliderTouchMotion'

export class SliderTouchController extends SliderTouchMotion {
  /** The slider unmounted: a cancel reports nothing then. */
  private disposed = false
  /** Thumbs whose current touch is a mouse: its highlight never lifts them. */
  private readonly mouseOwners = new Set<number>()
  /** The track's tap (see handleTrackTap). Null while detached. */
  private trackTap: TapGestureRecognizer | null = null

  /**
   * Attaches the recognizers to the thumbs for every pointer. Under a
   * coarse primary pointer each thumb's `::before` is its touch target.
   */
  attach(): () => void {
    this.disposed = false
    const parts = this.getParts()
    const targets = parts?.thumbs ?? []
    if (parts == null || targets.length === 0)
      return () => {}
    // The coast plays a motion role: register the springs table, once.
    registerSpringsTable()
    const host = getGestureHost(parts.control.ownerDocument)
    const detachers: (() => void)[] = []
    targets.forEach((hit, owner) => {
      const tracker = createPressTracker({
        getBounds: () => this.getParts()?.control.getBoundingClientRect() ?? null,
        view: hit,
        highlightDelay: PRESS_PROFILES.control.highlightDelay,
        quickTapFlash: PRESS_PROFILES.control.quickTapFlash,
        onControlEvent: (event, touch) => this.handleControlEvent(owner, event, touch.pointerType),
        onHighlightChange: isHighlighted => this.handleHighlight(owner, isHighlighted),
        vetoesAncestorRecognizer: recognizer => this.vetoes(recognizer),
        isEnabled: () => !this.model.isDisabled,
      })
      const pan = new PanGestureRecognizer({
        name: `slider-thumb-${owner}`,
        direction: this.model.isHorizontal ? 'horizontal' : 'vertical',
        maximumNumberOfTouches: 1,
        cancelsTouchesInView: false,
        allowedPointerTypes: ['touch', 'pen'],
        // A held thumb does something, so a held finger never starts a text
        // selection or the callout on it.
        selectionLock: lockSelection,
      })
      // A mouse drag on a thumb is a pan too, claimed after the same
      // hysteresis but in any direction: a mouse has no page scroll to yield
      // to, so a drag that starts off the travel still moves the thumb.
      const mousePan = new PanGestureRecognizer({
        name: `slider-thumb-${owner}-mouse`,
        maximumNumberOfTouches: 1,
        cancelsTouchesInView: false,
        allowedPointerTypes: ['mouse'],
      })
      detachers.push(
        host.attachConsumer(hit, tracker),
        host.attach(hit, pan),
        host.attach(hit, mousePan),
        pan.addListener(current => this.handlePan(owner, current)),
        mousePan.addListener(current => this.handlePan(owner, current)),
        () => tracker.dispose(),
      )
    })
    // A tap on the track (or a mark) sets the value when it lifts, so a drag
    // is not the only pointer way to operate the slider (WCAG 2.2 SC 2.5.7).
    // UISlider ignores track taps; this departs from it. A touch that moves
    // as far as a thumb's pan needs to begin is a swipe, not a tap.
    const tap = new TapGestureRecognizer({
      name: 'slider-track-tap',
      allowedPointerTypes: ['touch', 'pen'],
      cancelsTouchesInView: false,
      allowableMovement: UIKIT_PAN.hysteresis.value,
    })
    this.trackTap = tap
    detachers.push(
      host.attach(parts.control, tap),
      tap.addListener((current) => {
        if (current.state === 'ended')
          this.handleTrackTap(current)
      }),
      () => {
        this.trackTap = null
      },
      // A layout can change the track's length mid-gesture, as when a value
      // label beside it takes a digit. The drawn parts follow before the
      // next paint, so nothing jumps at the hand-back.
      observeResize(parts.control, () => this.followTrackLength()),
    )
    return () => {
      // Interactions end first, so the cancel the recognizers send as they
      // detach finds nothing left to report.
      const ended = this.endSilently()
      for (const detach of detachers)
        detach()
      this.cancelLater(ended)
    }
  }

  /** Stops every interaction and animation without reporting (unmount). */
  dispose(): void {
    this.disposed = true
    this.endSilently()
    this.disposeAnimators()
  }

  /**
   * Ends every live interaction without a word to the owner, and returns
   * them. A coast stops where it is drawn, and the parts return to the
   * stylesheet at the value the slider last showed.
   */
  private endSilently(): ReadonlyArray<SliderInteraction> {
    if (this.interactions.size === 0)
      return []
    const ended = [...this.interactions.values()]
    const view = this.getParts()?.control.ownerDocument.defaultView
    for (const interaction of ended) {
      const coast = interaction.coast
      if (coast != null) {
        interaction.coast = null
        view?.cancelAnimationFrame(coast.raf)
        for (const handle of coast.handles)
          handle.stop()
      }
      interaction.released = true
    }
    this.interactions.clear()
    this.mouseOwners.clear()
    this.handBack()
    return ended
  }

  /**
   * Ends the interactions a detach cancelled while the slider stays mounted,
   * as when it is disabled mid-drag. Each releases its pressed paint; if any
   * changed the value, `changeEnd` reports once. An unmount in the same tick
   * drops it.
   */
  private cancelLater(ended: ReadonlyArray<SliderInteraction>): void {
    if (ended.length === 0)
      return
    queueMicrotask(() => {
      if (this.disposed)
        return
      for (const interaction of ended)
        this.model.commit(interaction.index, null)
      if (ended.some(interaction => interaction.changed))
        this.model.reportEnd()
    })
  }

  // -- events ----------------------------------------------------------------

  private handleControlEvent(owner: number, event: ControlEvent, pointerType: PointerKind): void {
    if (event === 'touchDown') {
      // A mouse press holds the thumb too; its highlight never lifts it.
      const isMouse = pointerType === 'mouse'
      if (isMouse)
        this.mouseOwners.add(owner)
      else
        this.mouseOwners.delete(owner)
      this.begin(owner, isMouse, pointerType === 'touch')
      return
    }
    const interaction = this.interactions.get(owner)
    if (interaction == null)
      return
    switch (event) {
      case 'touchDragInside':
      case 'touchDragEnter':
        interaction.isInside = true
        return
      case 'touchDragOutside':
      case 'touchDragExit':
        interaction.isInside = false
        return
      case 'touchUpInside':
      case 'touchUpOutside':
        interaction.isInside = event === 'touchUpInside'
        // A press that never became a pan ends here (a tap or a hold).
        if (interaction.startValue == null)
          this.finish(interaction, true)
        return
      case 'touchCancel':
        // The browser took the touch to scroll, or the press was cancelled
        // before the pan began. A begun pan reports its own cancel.
        if (interaction.startValue == null)
          this.finish(interaction, false)
    }
  }

  private handleHighlight(owner: number, isHighlighted: boolean): void {
    if (this.mouseOwners.has(owner))
      return
    const interaction = this.interactions.get(owner)
    const index = interaction?.index ?? owner
    if (isHighlighted && interaction != null && !interaction.released)
      this.lift(index)
    else if (!isHighlighted && interaction == null)
      this.drop(index)
  }

  private handlePan(owner: number, pan: PanGestureRecognizer): void {
    const interaction = this.interactions.get(owner)
    if (interaction == null || interaction.released)
      return
    switch (pan.state) {
      case 'began': {
        interaction.startValue = interaction.value
        const total = pan.totalTranslation()
        const along = total[interaction.geometry.axis]
        const distance = Math.hypot(total.x, total.y)
        interaction.beganOffset = interaction.isMouse
          ? (distance > 0 ? (pan.hysteresis * along) / distance : 0)
          : (along < 0 ? -1 : 1) * pan.hysteresis
        if (!interaction.isMouse)
          this.lift(interaction.index)
        this.track(interaction, pan)
        return
      }
      case 'changed':
        this.track(interaction, pan)
        return
      case 'ended':
        interaction.released = true
        this.release(interaction, pan)
        return
      case 'cancelled':
        interaction.released = true
        this.finish(interaction, true)
    }
  }

  /** UISlider's veto: an ancestor's pan or swipe along the travel. */
  private vetoes(recognizer: GestureRecognizer): boolean {
    // A touch on a thumb is the thumb's: a tap there changes nothing.
    if (recognizer === this.trackTap)
      return true
    const horizontal = this.model.isHorizontal
    // Told apart by kind, never by class: a screen-edge pan is a pan.
    if (recognizer.kind === 'swipe') {
      return (recognizer as SwipeGestureRecognizer).directions.some(direction =>
        horizontal ? direction === 'left' || direction === 'right' : direction === 'up' || direction === 'down')
    }
    if (recognizer.kind === 'pan' || recognizer.kind === 'screenEdgePan') {
      const { x, y } = (recognizer as PanGestureRecognizer).translation()
      return horizontal ? Math.abs(x) >= Math.abs(y) : Math.abs(y) >= Math.abs(x)
    }
    return false
  }

  // -- the interaction -------------------------------------------------------

  private begin(owner: number, isMouse: boolean, coasts: boolean): void {
    const parts = this.getParts()
    if (parts == null || this.model.isDisabled)
      return
    // A finger on a coasting thumb stops it where it is: the coast ends on
    // that value, which the slider shows and `changeEnd` reports.
    for (const other of [...this.interactions.values()]) {
      if (other.coast != null)
        this.finish(other, true, this.stopCoast(other))
    }
    const values = this.model.values()
    const value = values[owner] ?? this.model.min
    this.interactions.set(owner, this.interaction(owner, value, {
      geometry: this.measure(parts),
      isMouse,
      coasts,
      beganCoincident: this.model.isRange && values[0] === values[1],
    }))
    this.model.press(owner)
  }

  private interaction(index: number, value: number, rest: Pick<SliderInteraction, 'geometry' | 'isMouse' | 'coasts' | 'beganCoincident'> & { released?: boolean }): SliderInteraction {
    return { owner: index, index, startValue: null, beganOffset: 0, value, isInside: true, atEnd: this.endOf(value), changed: false, coast: null, released: false, ...rest }
  }

  private track(interaction: SliderInteraction, pan: PanGestureRecognizer): void {
    const { geometry } = interaction
    const { min, max, isRange } = this.model
    // A collapsed track has no length to map the travel onto.
    if (geometry.length <= 0)
      return
    // UISlider counts the translation from the threshold itself (the
    // touch-down point plus the hysteresis, along the axis).
    const translation = (pan.totalTranslation()[geometry.axis] - interaction.beganOffset) * geometry.sign
    const startValue = interaction.startValue ?? interaction.value
    const raw = startValue + (translation / geometry.length) * (max - min) * UIKIT_SLIDER.trackingGain
    // A drag that began on two range thumbs sharing a value: its first
    // movement picks the thumb that can follow it. Coming back past the
    // other thumb's value hands the drag to that thumb, which moves on.
    let from: ReadonlyArray<number> | undefined
    if (isRange && interaction.beganCoincident && raw !== startValue) {
      const values = this.model.values()
      const current = interaction.index
      const index = values[0] === values[1] && !interaction.changed
        ? (raw < startValue ? 0 : 1)
        : current === 1 && raw < (values[0] ?? raw)
          ? 0
          : current === 0 && raw > (values[1] ?? raw) ? 1 : current
      if (index !== current) {
        // Passing back over the other thumb leaves this one against it, and
        // the other moves on: one change reports both.
        if (interaction.changed) {
          const against = this.model.constrain(current, values[index] ?? raw)
          interaction.value = against
          this.place(interaction)
          const next = [...values]
          next[current] = against
          from = next
        }
        this.drop(current)
        interaction.index = index
        interaction.value = values[index] ?? interaction.value
        if (!interaction.isMouse)
          this.lift(index)
        this.model.press(index)
      }
    }
    this.record(interaction, this.model.constrain(interaction.index, raw), { from })
    this.place(interaction)
  }

  /**
   * Records a new value and plays the end haptic on entering an end. Reports
   * it unless the interaction's end commits it. Returns whether it changed.
   */
  protected record(interaction: SliderInteraction, value: number, { commits = false, from }: { commits?: boolean, from?: ReadonlyArray<number> } = {}): boolean {
    if (value === interaction.value)
      return false
    interaction.value = value
    interaction.changed = true
    if (!commits)
      this.model.change(interaction.index, value, from)
    const end = this.endOf(value)
    // UISlider's end haptic belongs to a finger's or a pen's drag and its
    // coast. A mouse and a track tap play none.
    if (end != null && end !== interaction.atEnd && !interaction.isMouse && interaction.startValue != null)
      playHaptic(UIKIT_SLIDER.endHaptic)
    interaction.atEnd = end
    return true
  }

  private release(interaction: SliderInteraction, pan: PanGestureRecognizer): void {
    // A mouse's or a pen's drag ends where the pointer lets go: only a
    // finger's release coasts. A pen's thumb, lifted while held, drops first.
    if (!interaction.coasts) {
      if (!interaction.isMouse)
        this.drop(interaction.index)
      this.model.press(null)
      this.finish(interaction, true)
      return
    }
    const { geometry, index } = interaction
    const range = this.model.max - this.model.min
    this.drop(index)
    this.model.press(null)
    const location = pan.location()
    const expansion = UIKIT_CONTROL.trackingExpansion.value
    const { rect } = geometry
    const inside = location.x >= rect.left - expansion && location.x <= rect.right + expansion
      && location.y >= rect.top - expansion && location.y <= rect.bottom + expansion
    interaction.isInside = inside
    // Finger velocity along increasing value, px/s.
    const velocity = pan.velocity()[geometry.axis] * geometry.sign
    const projected = inside ? UIKIT_SLIDER.releaseProjectionShare * projectDistance(velocity, UIKIT_SLIDER.releaseProjectionRate) : 0
    // Value per px of finger travel. A collapsed track maps none.
    const valuePerPx = geometry.length > 0 ? (range * UIKIT_SLIDER.trackingGain) / geometry.length : 0
    const target = this.model.constrain(index, interaction.value + projected * valuePerPx)
    this.coastTo(interaction, target, velocity * valuePerPx * this.pxPerValue(geometry), true)
  }

  /**
   * A tap on the track: the thumb the tap's value picks springs there, on
   * the release spring from rest. It reports as a coast does, and
   * `changeEnd` follows. A tap on the thumb's own value changes nothing.
   */
  private handleTrackTap(tap: TapGestureRecognizer): void {
    const parts = this.getParts()
    if (parts == null || this.model.isDisabled || this.interactions.size > 0)
      return
    const { x, y } = tap.location()
    const raw = this.model.valueAt(x, y)
    const index = this.model.thumbFor(raw)
    const target = this.model.constrain(index, raw)
    const value = this.model.values()[index] ?? this.model.min
    if (target === value)
      return
    const interaction = this.interaction(index, value, { geometry: this.measure(parts), isMouse: false, coasts: false, beganCoincident: false, released: true })
    this.interactions.set(index, interaction)
    // A tap's value change happens in place: under Reduce Motion it applies
    // at once, with no spring and no cross-fade.
    const thumb = parts.thumbs[index]
    if (thumb != null && this.animatorFor(thumb).reducedMotion() !== 'off') {
      this.finish(interaction, true, target)
      return
    }
    this.coastTo(interaction, target, 0, false)
  }

  /**
   * Ends an interaction from the handler that ends it: the lift, the cancel
   * or the coast's last frame. The slider shows the last value, and the
   * parts return to the stylesheet. `changeEnd` then reports, unless the
   * browser took the touch before any drag (`report` false).
   */
  protected finish(interaction: SliderInteraction, report: boolean, finalValue: number | null = null): void {
    if (this.interactions.get(interaction.owner) !== interaction)
      return
    this.interactions.delete(interaction.owner)
    if (!interaction.released)
      this.drop(interaction.index)
    interaction.released = true
    if (finalValue != null)
      this.record(interaction, finalValue, { commits: true })
    this.model.commit(interaction.index, finalValue)
    this.handBack()
    if (report)
      this.model.reportEnd()
  }
}
