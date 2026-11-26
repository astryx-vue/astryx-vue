/**
 * @file play.ts
 * The animator's `play`: any closed-form curve.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { MotionCurve, MotionProperty } from '../types'
import type { MotionEngine } from './context'
import type { Segment } from './engineTypes'
import { MAX_DURATION_MS } from './constants'
import { expandList } from './cssValues'
import { callTime } from './taskClock'

export function installPlay(engine: MotionEngine): void {
  const { animator, isCoarsePointer, now, resting, segments } = engine

  animator.play = (curves, playOptions = {}) => {
    engine.syncPending()
    if (playOptions.start !== 'presented') {
      engine.flushDeferred()
    }
    const time = playOptions.at ?? callTime(now)
    const { owner, finished } = engine.newOwner()
    const byProperty: Partial<Record<MotionProperty, MotionCurve>> = {}
    // `scale` first, so an explicit `scaleX` or `scaleY` beside it wins.
    const entries = (
      Object.entries(curves) as [
          MotionProperty | 'scale',
          MotionCurve | undefined,
      ][]
    ).sort(([a], [b]) => Number(b === 'scale') - Number(a === 'scale'))
    for (const [key, curve] of entries) {
      if (curve == null) {
        continue
      }
      if (!Number.isFinite(curve.duration) || curve.duration < 0) {
        throw new RangeError(
          `animator: a curve needs a finite duration ≥ 0 (got ${curve.duration})`,
        )
      }
      for (const property of expandList([key])) {
        byProperty[property] = curve
      }
    }
    const properties = Object.keys(byProperty) as MotionProperty[]
    const targets: Partial<Record<MotionProperty, number>> = {}
    for (const property of properties) {
      const curve = byProperty[property] as MotionCurve
      targets[property] = curve.at(curve.duration)
    }
    const plan = engine.prefersReducedMotion()
      ? engine.reducedMotion(
          owner,
          time,
          targets,
          properties,
          isCoarsePointer() || playOptions.touchRelease === true,
          playOptions.crossfadeAs,
        )
      : null
    const next: Partial<Record<MotionProperty, Segment | null>> = {
      ...plan?.next,
    }
    for (const property of properties) {
      if (property in next) {
        continue
      }
      const curve = byProperty[property] as MotionCurve
      const running
        = playOptions.additive === true ? engine.segmentAt(property, time) : null
      if (
        running != null
        && !engine.isHeld(running)
        && curve.duration > 0
        && Math.abs(curve.at(curve.duration) - curve.at(0)) > 1e-9
      ) {
        next[property] = engine.additiveCurveSegment(owner, time, curve, running)
        continue
      }
      next[property]
        = curve.duration === 0
          ? null
          : {
              start: time,
              duration: Math.min(MAX_DURATION_MS, curve.duration * 1000),
              target: targets[property] as number,
              at: t => curve.at(t / 1000),
              speed: t => curve.velocity(t / 1000),
              jumps: [],
              owner,
              source: curve,
            }
    }
    const group = engine.beginGroup(
      time,
      Object.keys(next) as MotionProperty[],
      playOptions.at,
      playOptions.start,
    )
    // Ignored with `at`, which may join an earlier call's start.
    if (
      group != null
      && playOptions.at == null
      && playOptions.start === 'next-frame'
    ) {
      group.nextFrame = true
    }
    const waitsForFrame = engine.noteShown(
      Object.keys(next) as MotionProperty[],
      time,
      group,
      playOptions.at,
    )
    const adopted
      = plan?.landing != null
        ? engine.adoptLandings(plan.landing, Object.keys(next) as MotionProperty[])
        : null
    const changed: MotionProperty[] = []
    for (const [property, segment] of Object.entries(next) as [
      MotionProperty,
        Segment | null,
    ][]) {
      engine.interrupt(property, time)
      changed.push(property)
      if (segment == null) {
        // Read before the segment goes: valueAt falls back to resting.
        const value
          = plan?.holds[property]
            ?? targets[property]
            ?? engine.valueAt(property, time)
        segments.delete(property)
        resting[property] = value
      }
      else {
        segments.set(property, segment)
      }
    }
    engine.commitCall(
      group,
      owner,
      changed,
      time,
      playOptions.start === 'presented' && playOptions.at == null,
      waitsForFrame,
    )
    if (plan?.borrowed != null) {
      // The dip's own commit cleared it; the borrow lasts the dip.
      engine.borrowedOpacity = plan.borrowed
    }
    if (plan?.joins === true) {
      engine.joinWaitingDip(owner)
    }
    const handle
      = plan?.joins === true
        ? engine.makeHandle(owner, ['opacity'], finished, time, group, true)
        : engine.makeHandle(owner, changed, finished, time, group)
    if (plan?.landing != null) {
      engine.scheduleLanding(owner, handle.started, plan.landing, adopted)
    }
    return handle
  }
}
