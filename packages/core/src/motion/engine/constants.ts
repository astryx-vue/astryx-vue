/**
 * @file constants.ts
 * The motion engine's constants: properties, sampling tolerances, hold
 * and recheck times, channels and their identity values.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { MotionProperty, SpringTransition } from '../types'
import type { Channel } from './engineTypes'

export const PROPERTIES: ReadonlyArray<MotionProperty> = [
  'x',
  'y',
  'rotate',
  'scaleX',
  'scaleY',
  'opacity',
]

/** The axes momentum moves: `decay` takes only these (DR2, DEC-2). */
export const DECAY_PROPERTIES: ReadonlyArray<'x' | 'y'> = ['x', 'y']

export const IDENTITY: Record<MotionProperty, number> = {
  x: 0,
  y: 0,
  rotate: 0,
  scaleX: 1,
  scaleY: 1,
  opacity: 1,
}

/**
 * Keyframes are added until linear interpolation is within this: a quarter of
 * a device pixel (this quarter of a CSS pixel, divided by the device pixel
 * ratio where it is above 1), a twentieth of a degree, a 2000th of the size,
 * about one step of an 8-bit alpha. Every one is below what a moving element
 * can show.
 */
export const SAMPLE_TOLERANCE: Record<MotionProperty, number> = {
  x: 0.25,
  y: 0.25,
  rotate: 0.05,
  scaleX: 0.0005,
  scaleY: 0.0005,
  opacity: 0.004,
}

/** Keyframes start on this grid (ms) and are split where the curve needs it. */
export const SAMPLE_GRID_MS = 1000 / 30

/**
 * A curve within this many sample tolerances of its target can show as at
 * rest. A call on it then starts as one from rest does, at the browser's start.
 */
export const REST_DISTANCE_TOLERANCES = 2

/**
 * A curve shows as at rest only while it moves at most one `SAMPLE_TOLERANCE`
 * a frame at this rate.
 */
export const REST_FRAMES_PER_SECOND = 60

/** A curve that has not settled by then (an undamped spring) snaps. */
export const MAX_DURATION_MS = 30_000

/**
 * How close a spring's target and a value must be to count as the same, in
 * the property's own units. Only float rounding separates two ways of
 * computing one value, far below anything the screen shows.
 */
export const SAME_VALUE = 1e-6

/** Above this many keyframes the tolerance is relaxed. */
export const MAX_KEYFRAMES = 1200

/**
 * The keyframes hold the end state this long after a curve ends. An engine
 * whose compositor ends an animation while the main thread is blocked falls
 * back to the value its main thread last committed, the curve's start
 * (WebKit on Linux); the hold keeps the end state on screen through any such
 * block. It only stretches the last keyframe. The main thread retires the
 * animation as soon as it runs after the curve's end.
 *
 * Why a tail inside the curve's own animation, with a bound (measured Oct 24
 * 2026; do not replace it without these proofs):
 * - WebKit on Linux (WebKitGTK and WPE) ignores `fill` on its compositor:
 *   a 400 ms move that ends during a 1 s main-thread block snaps back to the
 *   block-start position 13 ms after its end, with `fill: forwards` or with
 *   no fill, and holds with this tail. iOS 26.2 Mobile Safari holds the end
 *   in all three forms, so there the tail is unneeded but harmless (measured
 *   Oct 25 2026). The browser proof "a spring that ends inside the block
 *   keeps showing its end state" catches it.
 * - A separate static animation of the end state under the curve would hold
 *   it without a bound, but two animations on one property push Chromium to
 *   run the curve on the main thread: the 1 s block proof moved in 0 of 57
 *   frames, the start-before-a-block proof failed, and seeking the curve
 *   broke.
 */
export const END_HOLD_MS = 60_000

/** How often a paused animation is looked at again for retiring, ms. */
export const RETIRE_RECHECK_MS = 100

/**
 * The soonest a running animation's end is looked for again, ms: a frame at
 * 60 Hz. WebKit moves an animation's currentTime once per frame, so a look
 * within a frame reads the frame's time, a fraction of a ms short of the end,
 * and a timer for that fraction would fire again before anything moved.
 */
export const END_RECHECK_MS = 1000 / 60

/** How long an element stays promoted after its last motion, ms. */
export const PROMOTION_LINGER_MS = 500

export const CHANNELS: Record<Channel, ReadonlyArray<MotionProperty>> = {
  translate: ['x', 'y'],
  rotate: ['rotate'],
  scale: ['scaleX', 'scaleY'],
  opacity: ['opacity'],
}

export const CHANNEL_OF: Record<MotionProperty, Channel> = {
  x: 'translate',
  y: 'translate',
  rotate: 'rotate',
  scaleX: 'scale',
  scaleY: 'scale',
  opacity: 'opacity',
}

/** What `inlineText` writes for each channel at identity. */
export const IDENTITY_TEXT: Record<Channel, string> = {
  translate: 'none',
  rotate: 'none',
  scale: 'none',
  opacity: '1',
}

/**
 * The transition `decay` hands a Reduce Motion transition curve to: under
 * Reduce Motion `animate` plays no spring (a cross-fade, or at once), so the
 * spring itself is never solved.
 */
export const REDUCED_TRANSITION: SpringTransition = {
  spring: { duration: 0.5, bounce: 0 },
}
