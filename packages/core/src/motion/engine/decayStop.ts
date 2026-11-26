/**
 * @file decayStop.ts
 * The animator's `decay` and `stop`.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { MotionCurve, MotionProperty, MotionValues } from '../types'
import type { MotionEngine } from './context'
import { LATE_START_MS } from '../frameBlock'
import { DECAY_PROPERTIES, IDENTITY, MAX_DURATION_MS, PROPERTIES, REDUCED_TRANSITION } from './constants'
import { expandList } from './cssValues'
import { callTime } from './taskClock'

export function installDecayStop(engine: MotionEngine): void {
  const { animator, landings, now, resting, segments, shown } = engine

  animator.decay = (curves, decayOptions = {}) => {
    engine.syncPending()
    engine.flushDeferred()
    const time = decayOptions.at ?? callTime(now)
    // Under Reduce Motion only momentum keeps moving (DR2, DEC-2): a curve
    // that is a transition plays as `animate` does, a cross-fade or at once.
    const reduce = engine.prefersReducedMotion()
    const transitions: MotionValues = {}
    for (const property of DECAY_PROPERTIES) {
      const curve = curves[property]
      if (reduce && curve?.isTransition === true) {
        transitions[property] = curve.at(curve.duration)
      }
    }
    const transitioned
      = Object.keys(transitions).length > 0
        ? animator.animate(transitions, REDUCED_TRANSITION, {
            at: time,
            touchRelease: decayOptions.touchRelease,
          })
        : null
    const { owner, finished } = engine.newOwner()
    // Momentum moves the translate axes only (DR2's throw exception).
    const properties = DECAY_PROPERTIES.filter(
      property =>
        curves[property] != null && transitions[property] === undefined,
    )
    if (transitioned != null && properties.length === 0) {
      return transitioned
    }
    const group = engine.beginGroup(time, properties, decayOptions.at)
    const waitsForFrame = engine.noteShown(properties, time, group, decayOptions.at)
    for (const property of properties) {
      const curve = curves[property] as MotionCurve
      engine.interrupt(property, time)
      if (!(curve.duration > 0)) {
        segments.delete(property)
        resting[property] = curve.at(0)
        continue
      }
      segments.set(property, {
        start: time,
        duration: Math.min(MAX_DURATION_MS, curve.duration * 1000),
        target: curve.at(curve.duration),
        at: t => curve.at(t / 1000),
        speed: t => curve.velocity(t / 1000),
        jumps: [],
        owner,
      })
    }
    engine.commitCall(group, owner, properties, time, false, waitsForFrame)
    const handle = engine.makeHandle(owner, properties, finished, time, group)
    if (transitioned == null) {
      return handle
    }
    // One handle for the whole release: the cross-faded axes too.
    const faded = transitioned
    const owns = (property: MotionProperty): boolean =>
      faded.properties.includes(property)
    return {
      ...handle,
      properties: [...handle.properties, ...faded.properties],
      started: Promise.all([handle.started, faded.started]).then(
        ([coasting]) => coasting,
      ),
      finished: Promise.all([handle.finished, faded.finished]).then(
        ([coasted, done]) => coasted && done,
      ),
      value: (property, at) =>
        owns(property)
          ? faded.value(property, at)
          : handle.value(property, at),
      velocity: (property, at) =>
        owns(property)
          ? faded.velocity(property, at)
          : handle.velocity(property, at),
      stop: () => {
        handle.stop()
        faded.stop()
      },
    }
  }

  animator.stop = (properties) => {
    engine.syncPending()
    engine.flushDeferred()
    const time = now()
    const list = properties == null ? PROPERTIES : expandList(properties)
    const changed: MotionProperty[] = []
    // A borrowed dip, or an exit by role that returns to the stylesheet.
    const wasBorrowed
      = engine.borrowedOpacity != null
        || [...landings].some(landing => landing.restoreIsBorrowed === true)
    // Read before the landings go: a dip's fade back in, an exit's restore.
    const heading = engine.opacityHeading()
    for (const property of list) {
      engine.cancelLanding(property)
      const segment = segments.get(property)
      if (segment == null) {
        continue
      }
      // A Reduce Motion fade is never left half done: it finishes, and a
      // dip on the stylesheet's opacity hands that opacity back. A call
      // that continued the motion and is still not on screen past its
      // frame shows the old curve: the element stops where that is.
      const noted = shown.get(property)
      shown.delete(property)
      const value = !segment.isFade
        ? noted != null && time - noted.since > LATE_START_MS
          ? engine.shownAt(noted, time).value
          : engine.valueAt(property, time)
        : wasBorrowed
          ? IDENTITY.opacity
          : heading
      engine.interrupt(property, time)
      segments.delete(property)
      resting[property] = value
      changed.push(property)
    }
    engine.commit(changed, time)
    if (wasBorrowed && changed.includes('opacity')) {
      engine.releaseOwnOpacity()
    }
  }
}
