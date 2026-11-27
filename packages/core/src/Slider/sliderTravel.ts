/**
 * @file sliderTravel.ts
 * @input The slider's control, its thumb size and the UIKit slider spring
 * @output sliderCoastCurve (the release coast, clamped to the thumb's range),
 *   measureTravel (the travel's geometry), drawnTranslate (where the browser
 *   draws a part) and travelParts (each moving part's translate as a
 *   function of the thumb's px)
 * @position Pure half of sliderTouchController.ts. The part formulas are the
 *   same as slider.css's progress-driven translates.
 */

import type { MotionCurve } from '../motion/animator'
import type { SpringDescription } from '../motion/spring'
import { solveSpring, toSpring } from '../motion/spring'
import { SLIDER_RELEASE_SPRING } from '../motion/uikit/springs'
import { isRtlElement } from '../utils/isRtlElement'

/** The parts the controller moves. */
export interface SliderTouchParts {
  readonly control: HTMLElement
  readonly thumbs: ReadonlyArray<HTMLElement>
  /** The fill's mover (a range's start) and the fill itself. */
  readonly fillMover: HTMLElement | null
  readonly fill: HTMLElement | null
}

/** The travel's geometry, read once when a finger lands. */
export interface TravelGeometry {
  /** The track's length along the travel, CSS px. */
  readonly length: number
  /** The thumb's travel: the track minus one thumb. */
  readonly travel: number
  readonly axis: 'x' | 'y'
  /** Screen direction of increasing value along `axis`. */
  readonly sign: 1 | -1
  /** The control's client rect, for the release's inside test. */
  readonly rect: DOMRect
}

/** One moving part: its translate as a function of the thumb's px, and that function's slope. */
export interface TravelPart {
  readonly element: HTMLElement
  readonly at: (p: number) => number
  readonly slope: number
}

/**
 * The release coast as a curve in the thumb's own px, clamped to the
 * thumb's range. It is a spring from `from` to `to` with `velocity` (px/s).
 * Its value stops at an end instead of passing it, as UISlider clamps its
 * value and the thumb follows it.
 */
export function sliderCoastCurve({ from, to, velocity, lower, upper, spring: description = SLIDER_RELEASE_SPRING }: {
  from: number
  to: number
  velocity: number
  lower: number
  upper: number
  /** The release spring, as the thumb's theme resolves it. */
  spring?: SpringDescription
}): MotionCurve {
  const spring = solveSpring(toSpring(description), { from, to, velocity })
  const lo = Math.min(lower, upper)
  const hi = Math.max(lower, upper)
  const duration = Math.min(Math.max(spring.settleTime(0.05), 1 / 120), 3)
  return {
    duration,
    at: t => (t >= duration ? to : Math.min(Math.max(spring.value(t), lo), hi)),
    velocity: (t) => {
      if (t >= duration)
        return 0
      const value = spring.value(t)
      return value <= lo || value >= hi ? 0 : spring.velocity(t)
    },
  }
}

/**
 * Where the browser draws an element's translate on one axis in this frame,
 * px: its computed style, which follows the running animation. Null when it
 * draws none.
 */
export function drawnTranslate(element: HTMLElement, axis: 'x' | 'y'): number | null {
  const translate = element.ownerDocument.defaultView?.getComputedStyle(element).translate ?? ''
  if (translate === '' || translate === 'none')
    return null
  const [x = '0', y = '0'] = translate.split(' ')
  const px = Number.parseFloat(axis === 'x' ? x : y)
  return Number.isFinite(px) ? px : null
}

/** The travel's geometry: the control's layout size along the axis, less one thumb. */
export function measureTravel(control: HTMLElement, isHorizontal: boolean, thumbSize: number): TravelGeometry {
  // The layout size (unrounded, untransformed): the size the CSS's
  // container units resolve against.
  const style = control.ownerDocument.defaultView?.getComputedStyle(control)
  const rect = control.getBoundingClientRect()
  const used = (isHorizontal ? style?.width : style?.height) ?? ''
  const length = used.endsWith('px') ? Number.parseFloat(used) : isHorizontal ? rect.width : rect.height
  return {
    length,
    travel: Math.max(0, length - thumbSize),
    axis: isHorizontal ? 'x' : 'y',
    sign: isHorizontal ? (isRtlElement(control) ? -1 : 1) : -1,
    rect,
  }
}

/**
 * The parts that move with thumb `index`. Each has its translate as a
 * function of the thumb's px along the travel (`p`), and that function's
 * slope. `otherPx` is the other range thumb's px.
 */
export function travelParts(parts: SliderTouchParts, { index, isRange, length, thumbSize, otherPx }: {
  index: number
  isRange: boolean
  length: number
  thumbSize: number
  otherPx: number
}): TravelPart[] {
  const inset = thumbSize / 2
  const maps: TravelPart[] = []
  const add = (element: HTMLElement | null | undefined, at: (p: number) => number, slope: number): void => {
    if (element != null)
      maps.push({ element, at, slope })
  }
  add(parts.thumbs[index], p => p, 1)
  if (isRange) {
    if (index === 0) {
      add(parts.fillMover, p => inset + p, 1)
      add(parts.fill, p => otherPx - p - length, -1)
    }
    else {
      add(parts.fill, p => p - otherPx - length, 1)
    }
  }
  else {
    add(parts.fill, p => inset + p - length, 1)
  }
  return maps
}
