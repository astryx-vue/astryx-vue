/**
 * @file timing.ts
 * @position Internal to motion/layout; split from upstream motion/animatedLayout.ts
 */

import type { SpringDescription } from '../spring'
import { sharedWeakMap } from '../../utils/sharedRealm'
import { linearEasing, sampleCount } from '../linearEasing'
import { themeReducesMotion } from '../reducedMotionMark'
import { settlingDuration, solveSpring, toSpring } from '../spring'
import { readThemeTiming, readThemeTokenText } from '../themeTiming'
import { reducedMotionCrossFade } from '../uikit/timing'

/** Below this many pixels a shift is not worth a move. */
export const MIN_SHIFT_PX = 0.5
/** The touch cross-fade's cap (`design:reduced-motion` DR2). */
const CROSS_FADE_CAP_MS = 200

/** How a change plays under the reader's settings. */
export type LayoutMotion
  = | { readonly kind: 'glide', readonly progress: GlideProgress }
    | {
      readonly kind: 'fade'
      readonly durationMs: number
      readonly easing: string
    }
    | { readonly kind: 'instant' }

/** The move curve as remaining distance (1 → 0) over its duration. */
export interface GlideProgress {
  readonly durationMs: number
  /** The move curve's CSS text, as read where the area is. */
  readonly easing: string
  /** Remaining fraction of the move at `t` ms. */
  remaining: (t: number) => number
}

function matches(element: Element, query: string): boolean {
  const view = element.ownerDocument.defaultView
  return (
    typeof view?.matchMedia === 'function' && view.matchMedia(query).matches
  )
}

/**
 * The theme's move curve over its medium duration where `area` is:
 * one value for the glide, the changed element and the indicator. The tokens
 * carry the theme's `character` and `tempo`. Null when the duration is zero
 * or the browser plays no such easing, and then the change lands at once.
 */
function glideProgress(area: Element): GlideProgress | null {
  const curve = readThemeTiming(area, {
    duration: '--duration-medium',
    easing: '--ease-move',
  })
  const easing = readThemeTokenText(area, '--ease-move')
  if (curve == null || easing == null) {
    return null
  }
  const durationMs = curve.duration * 1000
  return {
    durationMs,
    easing,
    remaining: t => (t >= durationMs ? 0 : 1 - curve.at(t / 1000)),
  }
}

// A glide a gesture's release asks for, for the changes in one area.
const releaseGlides = sharedWeakMap<Element, GlideProgress>(
  'motion/animated-layout/release-glides',
  1,
)

/**
 * Times the changes `area` and what it holds play in the next frame by
 * `progress`, not the theme's move curve. A release settles on its spring.
 * Reduce Motion still wins.
 */
export function glideNextChange(area: Element, progress: GlideProgress): void {
  releaseGlides.set(area, progress)
  const view = area.ownerDocument.defaultView
  view?.requestAnimationFrame(() => {
    view.requestAnimationFrame(() => releaseGlides.delete(area))
  })
}

/**
 * `spring` from rest toward the end, released at `velocity` (fractions of
 * the move per second, toward the end), as a glide's progress.
 */
export function springGlide(
  spring: SpringDescription,
  velocity: number,
): GlideProgress {
  const physics = toSpring(spring)
  const curve = solveSpring(physics, { from: 0, to: 1, velocity })
  const durationMs
    = settlingDuration(physics, { initialVelocity: velocity }) * 1000
  const remaining = (t: number): number =>
    t >= durationMs ? 0 : 1 - curve.value(t / 1000)
  return {
    durationMs,
    easing: linearEasing(durationMs, t => 1 - remaining(t)),
    remaining,
  }
}

function releaseGlideFor(area: Element): GlideProgress | undefined {
  for (let at: Element | null = area; at != null; at = at.parentElement) {
    const progress = releaseGlides.get(at)
    if (progress != null) {
      return progress
    }
  }
  return undefined
}

/** The motion a change in `area` plays now. */
export function layoutMotion(area: Element): LayoutMotion {
  if (
    matches(area, '(prefers-reduced-motion: reduce)')
    || themeReducesMotion(area)
  ) {
    if (!matches(area, '(pointer: coarse)')) {
      return { kind: 'instant' }
    }
    const [x1, y1, x2, y2] = reducedMotionCrossFade.curve
    return {
      kind: 'fade',
      durationMs: Math.min(
        CROSS_FADE_CAP_MS,
        reducedMotionCrossFade.durationMs,
      ),
      easing: `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`,
    }
  }
  const progress = releaseGlideFor(area) ?? glideProgress(area)
  return progress == null ? { kind: 'instant' } : { kind: 'glide', progress }
}

/** Linear keyframes over `durationMs`, one per frame, from `frame(t ms)`. */
export function sampleOver(
  durationMs: number,
  frame: (t: number) => Keyframe,
): Keyframe[] {
  const count = sampleCount(durationMs)
  const keyframes: Keyframe[] = []
  for (let i = 0; i < count; i++) {
    const offset = i / (count - 1)
    keyframes.push({ ...frame(offset * durationMs), offset })
  }
  return keyframes
}

/** Linear keyframes sampled from the move curve, one per frame. */
export function sampleKeyframes(
  progress: GlideProgress,
  frame: (remaining: number) => Keyframe,
): Keyframe[] {
  return sampleOver(progress.durationMs, t => frame(progress.remaining(t)))
}

export function round(value: number): number {
  return Math.round(value * 1000) / 1000
}
