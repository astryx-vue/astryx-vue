/**
 * @file landingRun.ts
 * Lands a Reduced Motion change, takes over landings, and plans a call
 * under Reduced Motion.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { MotionProperty } from '../types'
import type { MotionEngine } from './context'
import type { HandleState, Landing, ReducedPlan, Segment } from './engineTypes'
import { planReducedMotion } from '../reducedMotionPlan'
import { IDENTITY } from './constants'

export function installLandingRun(engine: MotionEngine): void {
  const { carriedOwners, landings, namedOpacity, now, resting, segments } = engine

  /**
   * Writes the travel while the element is transparent: a plain style write,
   * never an animation (DR2: opacity only), so it is never shown in the wrong
   * place. In a dip the fade back in starts from here and takes what is left
   * of the cross-fade, so the dip ends when it was due even when a busy main
   * thread runs this timer late; past the whole fade back in (100 ms late or
   * more) the element appears at once where it landed, with no animation,
   * and the call settles then.
   */
  engine.land = (landing: Landing) => {
    landings.delete(landing)
    landing.timer = null
    const time = now()
    const changed: MotionProperty[] = []
    for (const [property, value] of landing.values) {
      segments.delete(property)
      resting[property] = value
      changed.push(property)
    }
    let end = time
    // The fade back in takes what is left of the cross-fade: a timer that a
    // busy main thread runs late shortens it, so the dip still ends when it
    // was due (design:reduced-motion DR2, 200 ms or less), and the element is
    // never shown before it lands. Past the whole fade back in nothing is
    // left: the element appears at once, a plain write with no fade for the
    // browser to start a frame later, so the call settles showing it.
    const late = landing.due == null ? 0 : Math.max(0, time - landing.due)
    const appears = landing.fadeIn != null && late >= landing.fadeIn.ms
    if (landing.fadeIn != null && !appears) {
      const ms = landing.fadeIn.ms - late
      segments.set(
        'opacity',
        engine.fadeSegment(landing.owner, time, [
          { at: 0, value: engine.valueAt('opacity', time) },
          { at: ms, value: landing.fadeIn.to },
        ]),
      )
      changed.push('opacity')
      end = time + ms
    }
    else if (landing.fadeIn != null) {
      segments.delete('opacity')
      resting.opacity
        = landing.fadeIn.isBorrowed === true
          ? IDENTITY.opacity
          : landing.fadeIn.to
      changed.push('opacity')
    }
    else if (landing.restore != null) {
      segments.delete('opacity')
      resting.opacity
        = landing.restoreIsBorrowed === true ? IDENTITY.opacity : landing.restore
      changed.push('opacity')
    }
    engine.commit(changed, time)
    if (
      landing.restoreIsBorrowed === true
      || (appears && landing.fadeIn?.isBorrowed === true)
    ) {
      // The stylesheet owns its opacity again.
      engine.releaseOwnOpacity()
    }
    else if (landing.fadeIn?.isBorrowed === true) {
      // The fade back in returns to the stylesheet's opacity: it owns it
      // again once the fade ends (releaseIdentity).
      engine.borrowedOpacity = landing.fadeIn.to
    }
    // The calls it carries are done: their travel has landed.
    for (const carried of landing.carried) {
      carriedOwners.delete(carried)
      if (!carried.settled) {
        engine.settle(carried, true)
      }
    }
    const { owner } = landing
    if (owner.settled) {
      return
    }
    if (end <= time) {
      engine.settle(owner, true)
    }
    else {
      owner.timer = setTimeout(
        () => engine.settleAtEnd(owner),
        Math.max(0, end - now()),
      )
    }
  }

  /**
   * A call that sets a value still waiting to land takes it over: the earlier
   * move never lands, and its call settles interrupted. Once nothing waiting
   * is left, a call that names its own opacity replaces an earlier fade back
   * in or restore too, so a caught dismissal fades straight back up instead
   * of dipping. Whatever still waits is carried by the new plan.
   */
  engine.takeOverLandings = (
    properties: ReadonlyArray<MotionProperty>,
    namesOpacity: boolean,
  ) => {
    for (const property of properties) {
      if (property !== 'opacity') {
        engine.cancelLanding(property)
      }
    }
    if (!namesOpacity) {
      // A dip left with nothing to land (a move taken back) fades straight
      // back in from where it is, rather than finishing its dip.
      for (const landing of [...landings]) {
        if (landing.values.size === 0 && landing.fadeIn != null) {
          engine.endLanding(landing)
          engine.land(landing)
        }
      }
      return
    }
    for (const landing of [...landings]) {
      // A waiting call that named its own opacity loses it to this call: it
      // never reaches that opacity, so it settles interrupted even though its
      // travel still lands.
      for (const owner of [landing.owner, ...landing.carried]) {
        if (namedOpacity.has(owner) && !owner.settled) {
          engine.settle(owner, false)
        }
      }
      if (landing.values.size > 0) {
        continue
      }
      engine.endLanding(landing)
      if (
        landing.fadeIn?.isBorrowed === true
        || landing.restoreIsBorrowed === true
      ) {
        // The call's own opacity owns it now, not the stylesheet's.
        engine.borrowedOpacity = null
      }
      for (const owner of [landing.owner, ...landing.carried]) {
        carriedOwners.delete(owner)
        if (!owner.settled) {
          engine.settle(owner, false)
        }
      }
    }
  }

  /**
   * Reduced Motion (see the file header): the planner's plan
   * (reducedMotionPlan.ts) as this call's segments.
   */
  engine.reducedMotion = (
    owner: HandleState,
    time: number,
    targets: Partial<Record<MotionProperty, number>>,
    properties: MotionProperty[],
    fade: boolean,
    role?: 'entrance' | 'exit',
  ): ReducedPlan => {
    const heading = engine.opacityHeading()
    // An entrance or an exit by role drives the opacity as a named one does.
    engine.takeOverLandings(properties, targets.opacity != null || role != null)
    if (targets.opacity != null) {
      namedOpacity.add(owner)
    }
    engine.headingBeforeTakeOver = heading
    let plan: ReturnType<typeof planReducedMotion>
    try {
      plan = planReducedMotion(engine.planView, time, targets, properties, fade, role)
    }
    finally {
      engine.headingBeforeTakeOver = null
    }
    const next: Partial<Record<MotionProperty, Segment | null>> = {}
    for (const property of plan.atOnce) {
      next[property] = null
    }
    if (plan.opacityFade != null) {
      next.opacity = engine.fadeSegment(owner, time, plan.opacityFade)
    }
    return {
      next,
      holds: plan.holds,
      landing: plan.landing,
      borrowed: plan.borrowed,
      joins: plan.joins,
    }
  }
}
