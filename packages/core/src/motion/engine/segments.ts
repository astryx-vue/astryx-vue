/**
 * @file segments.ts
 * Builds segments: springs, additive retargets, curves and fades.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { SpringDescription } from '../spring'
import type { MotionCurve, MotionProperty } from '../types'
import type { MotionEngine } from './context'
import type { HandleState, Segment } from './engineTypes'
import { cubicBezier } from '../bezier'
import { resolveMotion } from '../resolveMotion'
import { solveSpring, toSpring } from '../spring'
import { SETTLE_THRESHOLD } from '../types'
import { reducedMotionCrossFade, registerReducedMotionCrossFade } from '../uikit/timing'
import { MAX_DURATION_MS } from './constants'

export function installSegments(engine: MotionEngine): void {
  // -- segment factories ------------------------------------------------------

  engine.springSegment = (
    owner: HandleState,
    property: MotionProperty,
    start: number,
    to: number,
    spring: SpringDescription,
    velocity: number,
  ): Segment | null =>
  // The motion role it plays, at the tempo of the theme it is in.
    engine.springFrom(
      owner,
      property,
      start,
      engine.valueAt(property, start),
      velocity,
      to,
      resolveMotion(engine.target, spring),
    )

  /**
   * `resolved` is already at the theme's tempo. A restart passes a segment's
   * spring as it is.
   */
  engine.springFrom = (
    owner: HandleState,
    property: MotionProperty,
    start: number,
    from: number,
    velocity: number,
    to: number,
    resolved: SpringDescription,
  ): Segment | null => {
    if (from === to && velocity === 0) {
      return null
    }
    const curve = solveSpring(toSpring(resolved), { from, to, velocity })
    const duration = Math.min(
      MAX_DURATION_MS,
      curve.settleTime(SETTLE_THRESHOLD[property]) * 1000,
    )
    return {
      start,
      duration,
      target: to,
      at: t => curve.value(t / 1000),
      speed: t => curve.velocity(t / 1000),
      jumps: [],
      owner,
      spring: resolved,
    }
  }

  /** The retarget of `additive`: the old curve plus a spring of the difference. */
  engine.additiveSegment = (
    owner: HandleState,
    property: MotionProperty,
    start: number,
    to: number,
    spring: SpringDescription,
    old: Segment,
  ): Segment => {
    const oldEnd = old.start + old.duration
    const resolved = resolveMotion(engine.target, spring)
    const delta = solveSpring(toSpring(resolved), {
      from: 0,
      to: to - old.target,
      velocity: 0,
    })
    const deltaMs = Math.min(
      MAX_DURATION_MS,
      delta.settleTime(SETTLE_THRESHOLD[property]) * 1000,
    )
    const ownAt = (t: number): number =>
      t >= deltaMs ? to - old.target : delta.value(t / 1000)
    const oldAt = (time: number): number =>
      time >= oldEnd ? old.target : old.at(Math.max(0, time - old.start))
    return {
      start,
      duration: Math.min(MAX_DURATION_MS, Math.max(oldEnd - start, deltaMs)),
      target: to,
      at: t => oldAt(start + t) + ownAt(t),
      speed: t =>
        (start + t >= oldEnd ? 0 : old.speed(start + t - old.start))
        + (t >= deltaMs ? 0 : delta.velocity(t / 1000)),
      jumps: old.jumps
        .map(jump => old.start + jump - start)
        .filter(jump => jump > 0),
      owner,
      spring: resolved,
      isAdditive: true,
    }
  }

  /**
   * `additive` for a played curve: the old curve plus the new curve's shape,
   * scaled to the difference between the two targets.
   */
  engine.additiveCurveSegment = (
    owner: HandleState,
    start: number,
    curve: MotionCurve,
    old: Segment,
  ): Segment => {
    const from = curve.at(0)
    const to = curve.at(curve.duration)
    const scale = (to - old.target) / (to - from)
    const ms = Math.min(MAX_DURATION_MS, curve.duration * 1000)
    const oldEnd = old.start + old.duration
    const oldAt = (time: number): number =>
      time >= oldEnd ? old.target : old.at(Math.max(0, time - old.start))
    return {
      start,
      duration: Math.min(MAX_DURATION_MS, Math.max(oldEnd - start, ms)),
      target: to,
      at: t =>
        oldAt(start + t)
        + (t >= ms ? to - old.target : (curve.at(t / 1000) - from) * scale),
      speed: t =>
        (start + t >= oldEnd ? 0 : old.speed(start + t - old.start))
        + (t >= ms ? 0 : curve.velocity(t / 1000) * scale),
      jumps: old.jumps
        .map(jump => old.start + jump - start)
        .filter(jump => jump > 0),
      owner,
    }
  }

  engine.fadeSegment = (
    owner: HandleState,
    start: number,
    stops: ReadonlyArray<{ at: number, value: number }>,
    jumps: ReadonlyArray<number> = [],
  ): Segment => {
    registerReducedMotionCrossFade()
    const ease = cubicBezier(
      resolveMotion(engine.target, reducedMotionCrossFade.curve),
    )
    const duration = stops[stops.length - 1].at
    const at = (t: number): number => {
      for (let i = 0; i + 1 < stops.length; i++) {
        const a = stops[i]
        const b = stops[i + 1]
        if (t < b.at || i + 2 === stops.length) {
          if (b.at === a.at) {
            return b.value
          }
          const p = Math.min(1, Math.max(0, (t - a.at) / (b.at - a.at)))
          return a.value + (b.value - a.value) * ease(p)
        }
      }
      return stops[stops.length - 1].value
    }
    return {
      start,
      duration,
      target: stops[stops.length - 1].value,
      at,
      speed: t =>
        ((at(t + 0.5) - at(Math.max(0, t - 0.5))) / (t >= 0.5 ? 1 : 0.5 + t))
        * 1000,
      jumps,
      owner,
      isFade: true,
    }
  }
}
