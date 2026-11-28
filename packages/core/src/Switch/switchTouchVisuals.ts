/**
 * @file switchTouchVisuals.ts
 * @input Switch's thumb, track and input, the thumb geometry
 *   (switchTouch.ts) and the UIKit switch constants
 * @output SwitchTouchVisuals: the compositor half of Switch's touch
 *   presentation. The thumb's travel, tracking, lift and settle, the lifted
 *   shadow and the track's colour fade, all on the animator
 * @position Owned by switchTouchController.ts, which decides when each plays
 *
 * - The thumb's resting place is CSS (its inline insets, switch.css). The
 *   animator only moves it by a delta from there (`translate`). When the
 *   value moves the CSS place, the delta is rebased in the same frame, so
 *   nothing moves on screen and the velocity is kept.
 * - The thumb lifts while a finger presses, into half the gap around it, and
 *   its shadow fades in. At the release it settles back, no sooner than the
 *   minimum lift time. The lift and the settle are one curve, built at the
 *   release, so the settle starts on time on the compositor.
 * - The track keeps its own fill in both states. A fade layer over it
 *   (`::after`), painted with the track's other fill, fades the colour on the
 *   compositor. When the value changes the layer swaps to the other fill and
 *   to the complement of its opacity, so nothing changes on screen. A change
 *   the fade already heads to swaps nothing: the track holds its previous
 *   fill inline until the fade lands.
 * - Under reduced motion nothing travels or springs: the animator plays its
 *   Reduce Motion cross-fade. A dragging finger still places the thumb.
 */

import type { Animator, MotionCurve } from '../motion/animator'
import type { SpringDescription } from '../motion/spring'
import type { SwitchTouchGeometry } from './switchTouch'
import { createMotionEngine } from '../motion/animator'
import { resolveMotion } from '../motion/resolveMotion'
import { solveSpring, toSpring } from '../motion/spring'
import { switchControl } from '../motion/uikit/switch'
import { readFillInState } from './switchFill'
import { settleTime, switchTouchGeometry } from './switchTouch'

export interface SwitchTouchElements {
  /** Receives the touches: the control around the input and the track. */
  surface: HTMLElement
  input: HTMLInputElement
  /** Moves and lifts; its `::after` is the lifted shadow. */
  thumb: HTMLElement
  /** Its `::after` is the colour fade layer. */
  track: HTMLElement
}

/** The fade layer's colour, set on the track for its `::after`. */
const FADE_FILL = '--_switch-fade-fill'
/** The track's own fill while a change is held (inline, over its CSS). */
const BASE_FILL = 'background-color'

function now(): number {
  return typeof performance === 'undefined' ? Date.now() : performance.now()
}

/**
 * The lift spring until `holdSeconds`, then the settle spring from where the
 * lift got to: one curve, so the settle starts on the compositor's clock.
 */
function liftThenSettle(options: {
  from: number
  velocity: number
  lifted: number
  rest: number
  holdSeconds: number
  threshold: number
  lift: SpringDescription
  settle: SpringDescription
}): MotionCurve {
  const hold = Math.max(0, options.holdSeconds)
  const first = solveSpring(toSpring(options.lift), { from: options.from, to: options.lifted, velocity: options.velocity })
  const second = solveSpring(toSpring(options.settle), { from: first.value(hold), to: options.rest, velocity: first.velocity(hold) })
  return {
    duration: hold + second.settleTime(options.threshold),
    at: t => (t < hold ? first.value(t) : second.value(t - hold)),
    velocity: t => (t < hold ? first.velocity(t) : second.velocity(t - hold)),
  }
}

export class SwitchTouchVisuals {
  geometry: SwitchTouchGeometry
  /** Whether `geometry` holds the rendered boxes since the last attach. */
  isGeometryMeasured = false
  /** The value the CSS shows. */
  isOn: boolean
  /** The side the visuals show or head to. */
  isVisuallyOn: boolean
  /** +1 left-to-right, −1 right-to-left. */
  direction = 1
  thumb: Animator | null = null
  /** The fade layer: its opacity is how far the visuals are from the value. */
  private fade: Animator | null = null
  /** The lifted shadow: the thumb's `::after`, faded in with the lift. */
  private shadow: Animator | null = null
  private elements: SwitchTouchElements | null = null
  /** When the thumb lifted (ms); null while at rest. */
  liftTime: number | null = null
  /** When the running settle leaves the lift, ms. */
  private settleAt: number | null = null
  /** A change landed mid-fade that the fade already heads to (see the file). */
  private baseHeld = false
  private baseHold = 0

  constructor(isOn: boolean, geometry: SwitchTouchGeometry) {
    this.isOn = isOn
    this.isVisuallyOn = isOn
    this.geometry = geometry
  }

  /** The parts a press measures, with no animator (the switch's own look). */
  bind(elements: SwitchTouchElements, direction: number): void {
    this.elements = elements
    this.direction = direction
    this.isGeometryMeasured = false
    this.isVisuallyOn = this.isOn
  }

  /** The animators of the touch presentation, from rest. */
  attach(elements: SwitchTouchElements, direction: number): void {
    this.bind(elements, direction)
    this.thumb = createMotionEngine(elements.thumb)
    // The layers rest clear (their CSS opacity 0), and the stylesheet shows
    // that rest (`base`), so no animation holds them there and these writes
    // promote nothing: a page of switches holds no compositing layer.
    this.fade = createMotionEngine(elements.track, { pseudoElement: '::after', initial: { opacity: 0 }, base: { opacity: 0 } })
    this.fade.set({ opacity: 0 }, { promote: false })
    this.shadow = createMotionEngine(elements.thumb, { pseudoElement: '::after', initial: { opacity: 0 }, base: { opacity: 0 } })
    this.shadow.set({ opacity: 0 }, { promote: false })
    this.paintFade()
  }

  /** Undo the animators and every inline style they wrote. */
  detach(): void {
    for (const animator of [this.thumb, this.fade, this.shadow]) {
      const element = animator?.element
      animator?.dispose()
      if (element != null) {
        for (const property of ['translate', 'scale', 'opacity'])
          element.style.removeProperty(property)
      }
    }
    this.elements?.track.style.removeProperty(FADE_FILL)
    this.elements?.track.style.removeProperty(BASE_FILL)
    this.baseHeld = false
    this.baseHold++
    this.thumb = this.fade = this.shadow = null
    this.liftTime = null
    this.settleAt = null
    this.elements = null
  }

  setGeometry(geometry: SwitchTouchGeometry): void {
    this.geometry = geometry
    this.isGeometryMeasured = false
    this.thumb?.set({ x: 0, scaleX: 1, scaleY: 1 }, { promote: false })
  }

  /**
   * The thumb geometry from the rendered boxes: the track's box less its
   * border, and the thumb's used size from its computed style, which its
   * scale does not change.
   */
  measureGeometry(): void {
    const track = this.elements?.track
    const thumb = this.elements?.thumb
    if (track == null)
      return
    const box = track.getBoundingClientRect()
    const trackWidth = box.width - 2 * track.clientLeft
    const trackHeight = box.height - 2 * track.clientTop
    if (trackWidth <= 0 || trackHeight <= 0)
      return
    this.isGeometryMeasured = true
    const style = thumb == null ? null : getComputedStyle(thumb)
    const thumbWidth = style == null ? Number.NaN : Number.parseFloat(style.width)
    const thumbHeight = style == null ? Number.NaN : Number.parseFloat(style.height)
    this.geometry = switchTouchGeometry(
      trackWidth,
      trackHeight,
      thumbWidth > 0 && thumbHeight > 0 ? { width: thumbWidth, height: thumbHeight } : undefined,
    )
  }

  /**
   * The rendered value changed and the CSS already moved the thumb's rest:
   * the delta is rebased so nothing moves, the thumb's scale carries its old
   * size, and the fade layer swaps under the new fill. `previousSize` is the
   * thumb diameter of the previous state when nothing was measured yet.
   * Returns whether the animator springs (reduced motion is off).
   */
  rebaseToValue(isOn: boolean, previousSize: number | null, time: number): boolean {
    const previous = this.isOn
    this.isOn = isOn
    const thumb = this.thumb
    if (thumb == null)
      return false
    let measured: SwitchTouchGeometry | null = null
    if (!this.isGeometryMeasured && previousSize != null) {
      this.measureGeometry()
      measured = this.geometry
      this.geometry = switchTouchGeometry(measured.trackWidth, measured.trackHeight, { width: previousSize, height: previousSize })
    }
    const springs = thumb.reducedMotion() === 'off'
    // A spring already heading for the new rest moves whole, keeping its
    // start time and velocity; any other keeps its target through the shift.
    thumb.rebase(
      { x: this.direction * (this.rest(previous) - this.rest(isOn)) },
      springs ? { towards: { x: this.toX(this.rest(isOn)) } } : {},
    )
    const before = this.geometry
    if (measured == null)
      this.measureGeometry()
    else
      this.geometry = measured
    if (springs)
      this.rescaleThumb(before, this.geometry, time)
    if (this.fade != null) {
      this.landBase(time)
      // Already heading here (a release, a drag that flipped): the running
      // fade carries the change over the previous fill, held until it lands.
      if (this.isVisuallyOn !== isOn || !this.holdBase())
        this.swapFade(time)
    }
    return springs
  }

  rest(isOn: boolean): number {
    return isOn ? this.geometry.travel : 0
  }

  /** The animator's x for a thumb offset, relative to its CSS place. */
  toX(offset: number): number {
    return this.direction * (offset - this.rest(this.isOn))
  }

  /** The thumb's offset on screen at `time`, from the curve. */
  offsetAt(time: number): number {
    const x = this.thumb?.get('x', time) ?? 0
    return this.rest(this.isOn) + this.direction * x
  }

  /** The colour heads for one side. */
  showWell(isOn: boolean, time: number, touchRelease = false): void {
    this.isVisuallyOn = isOn
    this.paintFade()
    this.animateFade(time, undefined, touchRelease)
  }

  /** The track colour and the thumb head for one side. */
  showSide(isOn: boolean, time: number, velocity?: number, touchRelease = false): void {
    if (isOn !== this.isVisuallyOn)
      this.showWell(isOn, time, touchRelease)
    // Under reduced motion the animator cross-fades this travel.
    this.thumb?.animate(
      { x: this.toX(this.rest(isOn)) },
      { spring: switchControl.travel, velocity: velocity == null ? undefined : { x: velocity } },
      { touchRelease },
    )
  }

  /** The thumb follows the finger: a tracking spring, or at once under reduced motion. */
  track(offset: number): void {
    const thumb = this.thumb
    if (thumb == null)
      return
    const target = this.toX(offset)
    if (thumb.reducedMotion() === 'off')
      thumb.animate({ x: target }, { spring: switchControl.tracking })
    else
      thumb.set({ x: target })
  }

  /**
   * The fade layer heads for the visuals on UIKit's well springs: clear when
   * they show the value, opaque (the other fill) when they show the other side.
   */
  private animateFade(_time: number, velocity?: number, touchRelease = false): void {
    this.fade?.animate(
      { opacity: this.isVisuallyOn === this.isOn ? 0 : 1 },
      {
        spring: this.isVisuallyOn ? switchControl.wellOn : switchControl.wellOff,
        velocity: velocity == null ? undefined : { opacity: velocity },
      },
      { touchRelease },
    )
  }

  /** The layer swaps to the other fill and the complement of its opacity. */
  private swapFade(time: number): void {
    const fade = this.fade
    if (fade == null)
      return
    const opacity = fade.get('opacity', time)
    const fadeVelocity = fade.getVelocity('opacity', time)
    this.paintFade()
    fade.rebase({ opacity: 1 - 2 * opacity })
    this.animateFade(time, -fadeVelocity)
  }

  /** Holds the track's fill at the previous value's until the fade lands. */
  private holdBase(): boolean {
    const elements = this.elements
    const fade = this.fade
    if (elements == null || fade == null)
      return false
    elements.track.style.setProperty(BASE_FILL, readFillInState(elements.input, elements.track, !this.isOn))
    this.baseHeld = true
    const hold = ++this.baseHold
    void fade.atRest(['opacity']).then(() => {
      if (hold === this.baseHold)
        this.landBase(now())
    })
    return true
  }

  /** Ends a held fill: the track shows its value's fill and the layer swaps under it. */
  landBase(time: number): void {
    if (!this.baseHeld)
      return
    this.baseHeld = false
    this.baseHold++
    this.elements?.track.style.removeProperty(BASE_FILL)
    this.swapFade(time)
  }

  /** The fade layer's colour: the track's fill in its other state. */
  private paintFade(): void {
    const elements = this.elements
    if (elements == null || this.fade == null)
      return
    elements.track.style.setProperty(FADE_FILL, readFillInState(elements.input, elements.track, !this.isOn))
  }

  /** The thumb grows into half the gap around it and its shadow fades in. */
  lift(time: number): void {
    if (this.thumb == null || this.thumb.reducedMotion() !== 'off')
      return
    this.liftTime = time
    const lift = this.thumb.animate(
      { scaleX: this.geometry.liftScaleX, scaleY: this.geometry.liftScaleY },
      { spring: switchControl.lift },
    )
    this.shadow?.animate({ opacity: 1 }, { spring: switchControl.lift })
    // A lift from rest starts at the frame that shows it.
    void lift.started.then((start) => {
      if (this.liftTime === time)
        this.liftTime = start
    })
  }

  /** The thumb settles back, no sooner than the minimum lift time after it lifted. */
  settle(time: number, touchRelease: boolean): void {
    const liftTime = this.liftTime
    if (liftTime == null)
      return
    this.liftTime = null
    const element = this.thumb?.element
    const lift = resolveMotion(element, switchControl.lift)
    const settle = resolveMotion(element, switchControl.settle)
    this.settleAt = settleTime(time, liftTime, resolveMotion(element, switchControl, 'minimumLiftMs'))
    const holdSeconds = (this.settleAt - time) / 1000
    const play = (animator: Animator | null, property: 'scaleX' | 'scaleY' | 'opacity', lifted: number, rest: number, threshold: number): void => {
      animator?.play({
        [property]: liftThenSettle({
          from: animator.get(property, time),
          velocity: animator.getVelocity(property, time),
          lifted,
          rest,
          holdSeconds,
          threshold,
          lift,
          settle,
        }),
      }, { touchRelease })
    }
    play(this.thumb, 'scaleX', this.geometry.liftScaleX, 1, 1e-4)
    play(this.thumb, 'scaleY', this.geometry.liftScaleY, 1, 1e-4)
    play(this.shadow, 'opacity', 1, 0, 1e-3)
  }

  /**
   * The thumb's box changed size with the value: its scale carries the size
   * it showed, then heads for the new box through the settle, or to the lift
   * a held press keeps.
   */
  private rescaleThumb(before: SwitchTouchGeometry, after: SwitchTouchGeometry, time: number): void {
    const thumb = this.thumb
    if (
      thumb == null
      || !(before.thumbWidth > 0 && before.thumbHeight > 0)
      || !(after.thumbWidth > 0 && after.thumbHeight > 0)
      || (before.thumbWidth === after.thumbWidth && before.thumbHeight === after.thumbHeight)
    ) {
      return
    }
    const held = this.liftTime != null
    const hold = this.settleAt == null ? 0 : Math.max(0, this.settleAt - time) / 1000
    for (const [property, factor, lifted] of [
      ['scaleX', before.thumbWidth / after.thumbWidth, before.liftScaleX],
      ['scaleY', before.thumbHeight / after.thumbHeight, before.liftScaleY],
    ] as const) {
      const keep = lifted * factor
      thumb.play({
        [property]: liftThenSettle({
          from: thumb.get(property, time) * factor,
          velocity: thumb.getVelocity(property, time) * factor,
          lifted: keep,
          rest: held ? keep : 1,
          holdSeconds: held ? 0 : hold,
          threshold: 1e-4,
          lift: resolveMotion(thumb.element, switchControl.lift),
          settle: resolveMotion(thumb.element, switchControl.settle),
        }),
      })
    }
  }
}
