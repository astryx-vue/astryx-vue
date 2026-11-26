/**
 * @file animate.ts
 * The animator's `animate`: a spring call with velocity kept.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { MotionProperty } from '../types'
import type { MotionEngine } from './context'
import type { ReducedPlan, Segment } from './engineTypes'
import { REST_FRAMES_PER_SECOND, SAMPLE_TOLERANCE } from './constants'
import { expand } from './cssValues'
import { callTime } from './taskClock'

export function installAnimate(engine: MotionEngine): void {
  const { animator, isCoarsePointer, lastSpring, now, resting, segments } = engine

  animator.animate = (to, transition, animateOptions = {}) => {
    engine.syncPending()
    if (animateOptions.start !== 'presented') {
      engine.flushDeferred()
    }
    const time = animateOptions.at ?? callTime(now)
    const targets = expand(to)
    const velocities = expand(transition.velocity ?? {})
    const { owner, finished } = engine.newOwner()
    lastSpring.set(owner, transition.spring)
    const properties = Object.keys(targets) as MotionProperty[]
    const next: Partial<Record<MotionProperty, Segment | null>> = {}
    let plan: ReducedPlan | null = null

    if (engine.prefersReducedMotion()) {
      plan = engine.reducedMotion(
        owner,
        time,
        targets,
        properties,
        isCoarsePointer() || animateOptions.touchRelease === true,
        animateOptions.crossfadeAs,
      )
      Object.assign(next, plan.next)
    }
    else {
      for (const property of properties) {
        const running
          = animateOptions.additive === true && velocities[property] == null
            ? engine.segmentAt(property, time)
            : null
        if (running != null && !engine.isHeld(running)) {
          next[property] = engine.additiveSegment(
            owner,
            property,
            time,
            targets[property] as number,
            transition.spring,
            running,
          )
          continue
        }
        const handed = velocities[property]
        const current = engine.velocityAt(property, time)
        const segment = engine.springSegment(
          owner,
          property,
          time,
          targets[property] as number,
          transition.spring,
          handed ?? current,
        )
        // A velocity that is the curve's own at the call keeps the current
        // velocity, as no velocity does. Any other is handed on, such as a
        // release's.
        const isHanded
          = handed != null
            && Math.abs(handed - current)
            > SAMPLE_TOLERANCE[property] * REST_FRAMES_PER_SECOND
        next[property]
          = segment != null && isHanded
            ? { ...segment, handedVelocity: handed }
            : segment
      }
    }

    const group = engine.beginGroup(
      time,
      Object.keys(next) as MotionProperty[],
      animateOptions.at,
      animateOptions.start,
    )
    // Ignored with `at`, which may join an earlier call's start.
    if (
      group != null
      && animateOptions.at == null
      && animateOptions.start === 'next-frame'
    ) {
      group.nextFrame = true
    }
    const waitsForFrame = engine.noteShown(
      Object.keys(next) as MotionProperty[],
      time,
      group,
      animateOptions.at,
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
      animateOptions.start === 'presented' && animateOptions.at == null,
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
