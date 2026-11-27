/**
 * @file sliderTouchMotion.ts
 * @input The slider's parts and value model, the animator and the UIKit
 *   slider table
 * @output SliderTouchMotion (the drawn half of UISlider's tracking: the
 *   parts' translates, the coast, the lift and the drop) and the
 *   SliderTouchModel and SliderInteraction types
 * @position Base of sliderTouchController.ts, which decides when each plays
 *   and how an interaction records and ends
 */

import type { Animator, MotionCurve, MotionHandle } from '../motion/animator'
import type { SliderTouchParts, TravelGeometry, TravelPart } from './sliderTravel'
import { createMotionEngine } from '../motion/animator'
import { resolveMotion } from '../motion/resolveMotion'
import { slider as UIKIT_SLIDER } from '../motion/uikit/slider'
import { SLIDER_DROP_SPRING, SLIDER_LIFT_SPRING, SLIDER_RELEASE_SPRING } from '../motion/uikit/springs'
import { drawnTranslate, measureTravel, sliderCoastCurve, travelParts } from './sliderTravel'

/** Frames of a coast before it reports values (the touch hand-off limit). */
const HAND_OFF_FRAMES = 3

/** A coast shorter than this (px) and slower than 1 px/s is not played. */
const MIN_COAST_PX = 0.5

/** What the controller needs from Slider. Read fresh on every use. */
export interface SliderTouchModel {
  readonly min: number
  readonly max: number
  readonly isRange: boolean
  readonly isHorizontal: boolean
  readonly isDisabled: boolean
  /** The thumb's size along the travel, px: the travel is inset by half of it. */
  readonly thumbSize: number
  /** The values the slider shows. */
  values: () => ReadonlyArray<number>
  /** What thumb `index` becomes for `raw`: snapped, clamped, kept apart. */
  constrain: (index: number, raw: number) => number
  /** The range thumb `index` may cover, unsnapped (its ends and the gap). */
  bounds: (index: number) => readonly [number, number]
  /**
   * The value change for thumb `index`. `from` holds the start values when
   * one move changes both range thumbs, as a drag passed between coincident
   * thumbs does.
   */
  change: (index: number, value: number, from?: ReadonlyArray<number>) => void
  /** Thumb `index` is under a finger (pressed paint, focus, tooltip), or none. */
  press: (index: number | null) => void
  /**
   * The interaction ended: thumb `index`'s last `value` (null when it ends on
   * no value of its own) is the slider's now, and the pressed paint lets go.
   */
  commit: (index: number, value: number | null) => void
  /** `changeEnd`, with the slider's values. */
  reportEnd: () => void
  /** The value a press at client point (`x`, `y`) on the track means. */
  valueAt: (x: number, y: number) => number
  /** The thumb a track press at `value` moves. */
  thumbFor: (value: number) => number
}

export interface SliderCoast {
  handles: ReadonlyArray<MotionHandle>
  readonly target: number
  frames: number
  raf: number
  /** The coast in the thumb's px along `travel`, from `at`. */
  curve: MotionCurve
  travel: number
  readonly at: number
  readonly touchRelease: boolean
}

export interface SliderInteraction {
  /** The thumb whose touch target holds the finger. */
  readonly owner: number
  /** The thumb whose value moves (a coincident pair may hand it over). */
  index: number
  /** The track as last measured: its length can change mid-gesture. */
  geometry: TravelGeometry
  /** The value when the pan began. Null until it does. */
  startValue: number | null
  /**
   * Where the pan's threshold lies along the axis, px from the touch-down
   * point: for a finger the hysteresis on the side the pan began, for a
   * mouse (whose pan begins in any direction) its projection on the axis.
   */
  beganOffset: number
  /** The last value reported (or shown when the finger landed). */
  value: number
  /** Whether the finger is inside the control's tracking bounds. */
  isInside: boolean
  /** The end the value sits at, for the once-per-entry haptic. */
  atEnd: 'min' | 'max' | null
  /** The value changed during this interaction. */
  changed: boolean
  coast: SliderCoast | null
  /** The pan ended or was cancelled (the release is under way or done). */
  released: boolean
  /** A mouse holds the thumb: it pans as a finger does, with no lift and no coast. */
  readonly isMouse: boolean
  /** A finger's release coasts; a mouse's or a pen's drag ends at its release. */
  readonly coasts: boolean
  /** The drag began on two range thumbs that share a value. */
  readonly beganCoincident: boolean
}

export abstract class SliderTouchMotion {
  protected readonly model: SliderTouchModel
  protected readonly getParts: () => SliderTouchParts | null
  protected readonly interactions = new Map<number, SliderInteraction>()
  private readonly animators = new Map<HTMLElement, Animator>()

  constructor(model: SliderTouchModel, getParts: () => SliderTouchParts | null) {
    this.model = model
    this.getParts = getParts
  }

  /** Records a new value (see the controller). Returns whether it changed. */
  protected abstract record(interaction: SliderInteraction, value: number, options?: { commits?: boolean, from?: ReadonlyArray<number> }): boolean

  /** Ends an interaction, showing `finalValue` and reporting when `report`. */
  protected abstract finish(interaction: SliderInteraction, report: boolean, finalValue?: number | null): void

  protected disposeAnimators(): void {
    for (const animator of this.animators.values())
      animator.dispose()
    this.animators.clear()
  }

  protected animatorFor(element: HTMLElement): Animator {
    let animator = this.animators.get(element)
    if (animator == null) {
      animator = createMotionEngine(element)
      this.animators.set(element, animator)
    }
    return animator
  }

  protected measure(parts: SliderTouchParts): TravelGeometry {
    return measureTravel(parts.control, this.model.isHorizontal, this.model.thumbSize)
  }

  protected endOf(value: number): 'min' | 'max' | null {
    if (value <= this.model.min)
      return 'min'
    if (value >= this.model.max)
      return 'max'
    return null
  }

  protected pxPerValue(geometry: TravelGeometry): number {
    const range = this.model.max - this.model.min
    return range > 0 ? geometry.travel / range : 0
  }

  /** The parts that move with the interaction's thumb (see travelParts). */
  protected partMaps(interaction: SliderInteraction): TravelPart[] {
    const parts = this.getParts()
    if (parts == null)
      return []
    const { geometry, index } = interaction
    const { min, isRange, thumbSize } = this.model
    const other = this.model.values()[index === 0 ? 1 : 0] ?? min
    return travelParts(parts, { index, isRange, length: geometry.length, thumbSize, otherPx: (other - min) * this.pxPerValue(geometry) })
  }

  /**
   * Writes the moving thumb's and the fill's positions for the
   * interaction's value straight to their translates: one visual update per
   * move. The parts go back to the stylesheet when the interaction ends
   * (`handBack`).
   */
  protected place(interaction: SliderInteraction): void {
    const { geometry } = interaction
    const px = (interaction.value - this.model.min) * this.pxPerValue(geometry)
    for (const { element, at } of this.partMaps(interaction))
      this.animatorFor(element).set({ [geometry.axis]: geometry.sign * at(px) })
  }

  /**
   * After the slider shows an ended interaction's final value, the thumb and
   * the fill go back to the positions slider.css gives them. Parts that a
   * coast of another thumb still drives stay with it.
   */
  protected handBack(): void {
    for (const [element, animator] of this.animators) {
      const isDriven = [...this.interactions.values()].some(
        interaction => (interaction.coast != null || !interaction.released) && this.partsOf(interaction).has(element),
      )
      if (isDriven)
        continue
      // Ends the animator's translate at identity, then removes the inline
      // property, so the class's progress-driven translate shows again.
      animator.set({ x: 0, y: 0 })
      element.style.removeProperty('translate')
      // A Reduced Motion cross-fade wrote the opacity: end it at 1 and hand
      // it back too (a caught fade stops part-way).
      if (element.style.getPropertyValue('opacity') !== '') {
        animator.set({ opacity: 1 })
        element.style.removeProperty('opacity')
      }
    }
  }

  private partsOf(interaction: SliderInteraction): Set<HTMLElement> {
    const parts = this.getParts()
    const set = new Set<HTMLElement>()
    if (parts == null)
      return set
    for (const element of [parts.thumbs[interaction.index], parts.fillMover, parts.fill]) {
      if (element != null)
        set.add(element)
    }
    return set
  }

  /**
   * Plays the coast on the thumb and the fill parts, on one clock that
   * started at `at`. A re-mapped coast plays on from where its curve is.
   */
  protected playCoast(interaction: SliderInteraction, curve: MotionCurve, touchRelease: boolean, at: number): MotionHandle[] {
    const { axis, sign } = interaction.geometry
    const handles: MotionHandle[] = []
    for (const { element, at: position, slope } of this.partMaps(interaction)) {
      const partCurve: MotionCurve = {
        duration: curve.duration,
        at: t => sign * position(curve.at(t)),
        velocity: t => sign * slope * curve.velocity(t),
      }
      const animator = this.animatorFor(element)
      animator.set({ [axis]: partCurve.at(0) })
      // A release's coast continues the throw: momentum, which keeps moving
      // under Reduce Motion. A tap's spring is a transition.
      handles.push(touchRelease ? animator.decay({ [axis]: partCurve }, { at, touchRelease }) : animator.play({ [axis]: partCurve }, { at }))
    }
    return handles
  }

  /**
   * Stops a coast where the browser draws the thumb in this frame. Returns
   * the value there, or null when the travel has no length. The animator's
   * own reading can run a frame ahead of or behind what is drawn, and a
   * finger stops what it sees.
   */
  protected stopCoast(interaction: SliderInteraction): number | null {
    const coast = interaction.coast
    if (coast == null)
      return null
    interaction.coast = null
    this.getParts()?.control.ownerDocument.defaultView?.cancelAnimationFrame(coast.raf)
    const { geometry, index } = interaction
    const { min, max } = this.model
    const thumb = this.getParts()?.thumbs[index]
    const drawn = thumb == null ? null : drawnTranslate(thumb, geometry.axis)
    const px = Math.abs(drawn ?? coast.handles[0]?.value(geometry.axis) ?? 0)
    for (const handle of coast.handles)
      handle.stop()
    const range = max - min
    return range > 0 && geometry.travel > 0 ? this.model.constrain(index, min + (px / geometry.travel) * range) : null
  }

  /**
   * Springs the interaction's thumb from its value to `target`, on the
   * compositor and clamped, starting at `velocityPx` (px/s along the
   * travel). Values report from the coast's fourth frame, and the
   * interaction ends on its last. `touchRelease`: a finger's release
   * started it, so the coast continues the throw under Reduce Motion too.
   */
  protected coastTo(interaction: SliderInteraction, target: number, velocityPx: number, touchRelease: boolean): void {
    const { geometry, index } = interaction
    const { min, max } = this.model
    const pxPerValue = this.pxPerValue(geometry)
    const fromPx = (interaction.value - min) * pxPerValue
    const toPx = (target - min) * pxPerValue
    const [lowerValue, upperValue] = this.model.bounds(index)
    const curve = sliderCoastCurve({
      from: fromPx,
      to: toPx,
      velocity: velocityPx,
      lower: (lowerValue - min) * pxPerValue,
      upper: (upperValue - min) * pxPerValue,
      spring: resolveMotion(this.getParts()?.control, SLIDER_RELEASE_SPRING),
    })
    const moves = Math.abs(toPx - fromPx) >= MIN_COAST_PX || Math.abs(curve.at(0.05) - fromPx) >= MIN_COAST_PX
    const at = performance.now()
    const handles = moves ? this.playCoast(interaction, curve, touchRelease, at) : []
    if (handles.length === 0) {
      this.finish(interaction, true, target)
      return
    }
    const coast: SliderCoast = { handles, target, frames: 0, raf: 0, curve, travel: geometry.travel, at, touchRelease }
    interaction.coast = coast
    const view = this.getParts()?.control.ownerDocument.defaultView
    const range = max - min
    const step = (): void => {
      if (interaction.coast !== coast)
        return
      coast.frames += 1
      if (coast.frames > HAND_OFF_FRAMES) {
        const { axis, travel } = interaction.geometry
        const px = Math.abs(coast.handles[0]?.value(axis) ?? 0)
        const value = range > 0 && travel > 0 ? min + (px / travel) * range : interaction.value
        this.record(interaction, this.model.constrain(index, value))
      }
      coast.raf = view?.requestAnimationFrame(step) ?? 0
    }
    coast.raf = view?.requestAnimationFrame(step) ?? 0
    this.endCoastWithThumb(interaction, coast)
  }

  /** Ends the coast when its thumb's motion finishes, not when it stops. */
  private endCoastWithThumb(interaction: SliderInteraction, coast: SliderCoast): void {
    const thumbHandle = coast.handles[0]
    void thumbHandle?.finished.then((finished) => {
      if (interaction.coast !== coast || coast.handles[0] !== thumbHandle || !finished)
        return
      this.getParts()?.control.ownerDocument.defaultView?.cancelAnimationFrame(coast.raf)
      interaction.coast = null
      this.finish(interaction, true, coast.target)
    })
  }

  /**
   * After the track's length changed, every live interaction measures it
   * again. A drag writes its parts for the new length, and a coast plays on
   * from where its curve is now, scaled to the new travel.
   */
  protected followTrackLength(): void {
    const parts = this.getParts()
    if (parts == null || this.interactions.size === 0)
      return
    for (const interaction of this.interactions.values()) {
      const geometry = this.measure(parts)
      if (geometry.length === interaction.geometry.length)
        continue
      interaction.geometry = geometry
      const { coast } = interaction
      if (coast != null) {
        const scale = coast.travel > 0 ? geometry.travel / coast.travel : 1
        const { curve } = coast
        coast.curve = { duration: curve.duration, at: t => curve.at(t) * scale, velocity: t => curve.velocity(t) * scale }
        coast.travel = geometry.travel
        coast.handles = this.playCoast(interaction, coast.curve, coast.touchRelease, coast.at)
        this.endCoastWithThumb(interaction, coast)
      }
      else if (!interaction.released) {
        this.place(interaction)
      }
    }
  }

  /** The held thumb grows to UISlider's lens. */
  protected lift(index: number): void {
    const thumb = this.getParts()?.thumbs[index]
    if (thumb == null)
      return
    const animator = this.animatorFor(thumb)
    // The lift is feedback with no fade of its own. Under Reduce Motion the
    // press shows in the pressed paint alone, and a change of state never
    // scales.
    if (animator.reducedMotion() !== 'off')
      return
    animator.animate({ scale: UIKIT_SLIDER.liftScale }, { spring: resolveMotion(this.getParts()?.control, SLIDER_LIFT_SPRING) })
  }

  protected drop(index: number): void {
    const thumb = this.getParts()?.thumbs[index]
    if (thumb == null)
      return
    const animator = this.animators.get(thumb)
    if (animator == null || animator.get('scale') === 1)
      return
    animator.animate({ scale: 1 }, { spring: resolveMotion(this.getParts()?.control, SLIDER_DROP_SPRING) })
  }
}
