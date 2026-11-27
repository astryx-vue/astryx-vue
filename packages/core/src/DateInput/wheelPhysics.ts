/**
 * @file wheelPhysics.ts
 * @input A wheel's offset and release velocity, its rows, and the UIKit
 *   picker constants (motion/uikit/picker.ts)
 * @output The curves a touch picker wheel moves on: the release plan, the
 *   turn's spring, the rubber band, and the row crossings that tick
 * @position Pure math of the touch picker wheel (TouchPickerWheel.vue)
 *
 * Positions are px, times seconds and velocities px/s. Row k is under the
 * band at an offset of k rows. UIKit's pt values scale by `scale`.
 */

import type { SpringDescription } from '../motion/spring'
import { solveDecay } from '../motion/decay'
import { projectDistance } from '../motion/projection'
import { rubberBand, rubberBandInverse } from '../motion/rubberBand'
import { solveSpring, toSpring } from '../motion/spring'
import { picker } from '../motion/uikit/picker'
import { scroll } from '../motion/uikit/scroll'

/** A motion of the wheel's offset, from t = 0 to `duration` (seconds). */
export interface WheelCurve {
  /** Seconds until the wheel is at rest on `to`. */
  readonly duration: number
  /** Where the motion ends. */
  readonly to: number
  /** Offset at `t` seconds; `to` from `duration` on. */
  value: (t: number) => number
  /** Velocity at `t` seconds, px/s; 0 from `duration` on. */
  velocity: (t: number) => number
}

/** How a release moves the wheel. */
export type WheelPlanKind = 'coast' | 'snap' | 'edge' | 'return'

/** What a release does: the curve, and the row it ends on. */
export interface WheelPlan {
  readonly kind: WheelPlanKind
  /** The row the wheel comes to rest on. */
  readonly index: number
  readonly curve: WheelCurve
}

/** The rows a wheel moves over. */
export interface WheelLayout {
  /** Row height, px. */
  readonly rowHeight: number
  readonly rowCount: number
  /**
   * The rows repeat without end: the last row is followed by the first. The
   * offset is then unbounded.
   */
  readonly looping?: boolean
}

/** The row pitch of the touch wheel, px: 28 px, as a platform picker packs its rows. */
export const WHEEL_ROW_HEIGHT = 28

/** UIKit's row height in pt: the unit the picker constants are measured in. */
const UIKIT_ROW_HEIGHT = picker.geometry.rowHeight

/** Below half a device pixel at 3×, a motion is on its row. */
const AT_REST_PT = 1 / 6

/**
 * The longest a plan runs, s: the animator's limit. A spring that has not
 * settled by then snaps onto its end.
 */
export const MAX_PLAN_SECONDS = 30

/** The constants' scale for a wheel whose rows are `rowHeight` px tall. */
export function scaleFor(rowHeight: number): number {
  return rowHeight / UIKIT_ROW_HEIGHT
}

/** The offsets of the first and last rows: unbounded when looping. */
export function offsetBounds({ rowHeight, rowCount, looping }: WheelLayout): { min: number, max: number } {
  if (looping)
    return { min: -Infinity, max: Infinity }
  return { min: 0, max: Math.max(0, rowCount - 1) * rowHeight }
}

/** UIKit's rubber band dimension for the picker's table, at the wheel's pitch. */
function bandDimension(layout: WheelLayout): number {
  return picker.geometry.rubberBandDimension * scaleFor(layout.rowHeight)
}

/**
 * The offset a drag shows for the finger's `offset`: past the first or last
 * row it is rubber-banded, as a UIPickerView's table is.
 */
export function dragOffset(offset: number, layout: WheelLayout): number {
  const { min, max } = offsetBounds(layout)
  if (offset < min)
    return min + rubberBand(offset - min, bandDimension(layout))
  if (offset > max)
    return max + rubberBand(offset - max, bandDimension(layout))
  return offset
}

/**
 * The finger's offset for a shown one. Past an end, it is the travel that the
 * rubber band shows as `shown`, so a drag that starts in a bounce continues
 * without a jump.
 */
export function fingerOffset(shown: number, layout: WheelLayout): number {
  const { min, max } = offsetBounds(layout)
  if (shown < min)
    return min + rubberBandInverse(shown - min, bandDimension(layout))
  if (shown > max)
    return max + rubberBandInverse(shown - max, bandDimension(layout))
  return shown
}

/**
 * The position of the row nearest `offset`, clamped to the rows. When looping
 * it is any integer, and the row it shows is that integer folded into the
 * rows (`mod` in wheelLoop.ts).
 */
export function nearestIndex(offset: number, layout: WheelLayout): number {
  const index = Math.round(offset / layout.rowHeight)
  if (layout.looping)
    return index
  return Math.min(Math.max(index, 0), Math.max(0, layout.rowCount - 1))
}

/**
 * The position of the row under a point `dy` px below the band's centre. It is
 * null past either end of a list that does not loop.
 */
export function rowAtPoint(dy: number, offset: number, layout: WheelLayout): number | null {
  const position = Math.round((offset + dy) / layout.rowHeight)
  if (!layout.looping && (position < 0 || position >= layout.rowCount))
    return null
  return position
}

/** The wheel at rest on `offset`: a curve that does not move. */
export function restCurve(offset: number): WheelCurve {
  return { duration: 0, to: offset, value: () => offset, velocity: () => 0 }
}

/**
 * Ease from `from` onto `to` as UIKit does after a release without velocity.
 * The distance left falls as e^(−k t), and the ease ends within half a device
 * pixel.
 */
export function snapCurve(from: number, to: number, scale = 1): WheelCurve {
  const distance = from - to
  const rate = picker.snapRate * 1000
  const epsilon = AT_REST_PT * scale
  if (Math.abs(distance) <= epsilon)
    return restCurve(to)
  const duration = Math.log(Math.abs(distance) / epsilon) / rate
  return {
    duration,
    to,
    value: t => (t >= duration ? to : to + distance * Math.exp(-rate * t)),
    velocity: t => (t >= duration ? 0 : -rate * distance * Math.exp(-rate * t)),
  }
}

/**
 * A coast from `from` at `velocity` that keeps the velocity and ends on `to` at
 * the stop speed. The rate is re-solved, so the speed falls from |velocity| to
 * the stop speed over exactly `to − from`.
 */
export function coastCurve(from: number, velocity: number, to: number, scale = 1): WheelCurve {
  const stopSpeed = picker.release.stopSpeed * 1000 * scale
  const distance = to - from
  const speed = Math.abs(velocity)
  if (distance === 0 || Math.sign(distance) !== Math.sign(velocity) || speed <= stopSpeed)
    return snapCurve(from, to, scale)
  const direction = Math.sign(distance)
  // Per second: the speed falls by λ × the distance covered.
  const lambda = (speed - stopSpeed) / Math.abs(distance)
  const duration = Math.log(speed / stopSpeed) / lambda
  return {
    duration,
    to,
    value: t => (t >= duration ? to : from + (direction * speed * -Math.expm1(-lambda * t)) / lambda),
    velocity: t => (t >= duration ? 0 : direction * speed * Math.exp(-lambda * t)),
  }
}

/**
 * A spring, from `from` with `velocity`, onto `to`. A return past an end plays
 * `scroll.bounce`, and a turn from a tap, a key or the program plays
 * `springs.settle`.
 */
export function bounceCurve(
  from: number,
  velocity: number,
  to: number,
  scale = 1,
  bounce: SpringDescription = scroll.bounce,
): WheelCurve {
  const spring = solveSpring(toSpring(bounce), { from, to, velocity })
  const duration = Math.min(MAX_PLAN_SECONDS, spring.settleTime(AT_REST_PT * scale))
  return {
    duration,
    to,
    value: t => (t >= duration ? to : spring.value(t)),
    velocity: t => (t >= duration ? 0 : spring.velocity(t)),
  }
}

/**
 * A coast that runs into an end: the normal decay until the offset reaches
 * `edge`, then the bounce spring with the velocity it has there.
 */
export function edgeCurve(
  from: number,
  velocity: number,
  edge: number,
  scale = 1,
  bounceSpring: SpringDescription = scroll.bounce,
): WheelCurve {
  const decay = solveDecay({ from, velocity })
  const hit = decay.timeToReach(edge)
  if (hit == null)
    return bounceCurve(from, velocity, edge, scale, bounceSpring)
  const bounce = bounceCurve(edge, decay.velocity(hit), edge, scale, bounceSpring)
  const duration = Math.min(MAX_PLAN_SECONDS, hit + bounce.duration)
  return {
    duration,
    to: edge,
    value: t => (t >= duration ? edge : t < hit ? decay.value(t) : bounce.value(t - hit)),
    velocity: t => (t >= duration ? 0 : t < hit ? decay.velocity(t) : bounce.velocity(t - hit)),
  }
}

/**
 * Where the scroll view projects a release: the coast's rest point at the
 * normal rate, short of the stop speed.
 */
export function projectRelease(offset: number, velocity: number, scale = 1): number {
  const stopSpeed = picker.release.stopSpeed * 1000 * scale
  const speed = Math.abs(velocity)
  if (speed <= stopSpeed)
    return offset
  return offset + Math.sign(velocity) * projectDistance(speed - stopSpeed)
}

/**
 * What the wheel does when the finger lifts at `offset` with `velocity`
 * (px/s, positive when the rows move up). `bounce` is `scroll.bounce` as the
 * wheel resolves it. The plan follows UIKit, as measured:
 *
 * - Inside the rows, a release slower than `release.minimumSpeed` carries no
 *   velocity. Past an end, the velocity is kept.
 * - The scroll view projects the coast, and the picker snaps that to the
 *   nearest row. The coast keeps the release velocity and stops exactly on
 *   that row.
 * - A projection past an end decays at the normal rate into the end, and the
 *   bounce takes its velocity there.
 * - A release without velocity eases onto the nearest row at `snapRate`.
 * - A release past an end returns on the bounce spring.
 *
 * @example
 * ```ts
 * planRelease(963.67, 933.4, { rowHeight: 32, rowCount: 60 }).index // 45
 * ```
 */
export function planRelease(
  offset: number,
  velocity: number,
  layout: WheelLayout,
  bounce: SpringDescription = scroll.bounce,
): WheelPlan {
  const scale = scaleFor(layout.rowHeight)
  const { min, max } = offsetBounds(layout)
  if (offset < min || offset > max) {
    const edge = offset < min ? min : max
    return { kind: 'return', index: nearestIndex(edge, layout), curve: bounceCurve(offset, velocity, edge, scale, bounce) }
  }
  const minimumSpeed = picker.release.minimumSpeed * 1000 * scale
  const speed = Math.abs(velocity) < minimumSpeed ? 0 : velocity
  const projected = projectRelease(offset, speed, scale)
  if (projected < min || projected > max) {
    const edge = projected < min ? min : max
    return { kind: 'edge', index: nearestIndex(edge, layout), curve: edgeCurve(offset, speed, edge, scale, bounce) }
  }
  const index = nearestIndex(projected, layout)
  const target = index * layout.rowHeight
  if (speed === 0)
    return { kind: 'snap', index, curve: snapCurve(offset, target, scale) }
  const curve = coastCurve(offset, speed, target, scale)
  return { kind: curve.duration > 0 ? 'coast' : 'snap', index, curve }
}

/**
 * Whether moving from offset `from` to `to` brings a row's centre onto the
 * band's: a multiple of `rowHeight` in (from, to] moving up, or in [to, from)
 * moving down.
 */
export function reachesRow(from: number, to: number, rowHeight: number): boolean {
  if (to > from)
    return Math.floor(to / rowHeight) > Math.floor(from / rowHeight)
  if (to < from)
    return Math.ceil(to / rowHeight) < Math.ceil(from / rowHeight)
  return false
}

/**
 * The times (seconds, ascending) at which a row's centre reaches the band's
 * centre during `curve`, thinned so that two are never closer than the
 * selection tick's minimum interval. Leaving the row the wheel starts on is
 * not a tick; reaching the next one is.
 */
export function tickTimes(curve: WheelCurve, rowHeight: number, step = 1 / 240): number[] {
  const interval = picker.selectionTick.minimumIntervalMs / 1000
  const until = curve.duration
  const times: number[] = []
  let previous = curve.value(0)
  let lastTick = -Infinity
  for (let t = step; t < until + step; t += step) {
    const time = Math.min(t, until)
    const value = curve.value(time)
    if (reachesRow(previous, value, rowHeight) && time - lastTick >= interval) {
      times.push(time)
      lastTick = time
    }
    previous = value
    if (time === until)
      break
  }
  return times
}
