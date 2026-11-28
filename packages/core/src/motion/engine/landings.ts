/**
 * @file landings.ts
 * Reduced Motion landings: scheduling, adopting and fading under them.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { MotionProperty } from '../types'
import type { MotionEngine } from './context'
import type { HandleState, Landing, ReducedPlan } from './engineTypes'
import { END_HOLD_MS, END_RECHECK_MS, RETIRE_RECHECK_MS } from './constants'

export function installLandings(engine: MotionEngine): void {
  const { carriedOwners, landings, now, resting, running, segments } = engine

  /**
   * A later write to `property` takes it from any landing. A write to opacity
   * decides what shows, so a landing still waiting writes its travel at once
   * rather than never, and its calls settle as interrupted.
   */
  engine.cancelLanding = (property: MotionProperty) => {
    for (const landing of [...landings]) {
      if (property === 'opacity') {
        engine.endLanding(landing)
        engine.landNow(landing)
      }
      else if (landing.values.delete(property)) {
        // Set or stopped before it landed: the call whose move it was did
        // not finish (a carried value is an earlier call's).
        const moved = landing.owners.get(property) ?? landing.owner
        landing.owners.delete(property)
        if (!moved.settled) {
          engine.settle(moved, false)
        }
      }
    }
  }

  engine.landNow = (landing: Landing) => {
    const changed: MotionProperty[] = []
    for (const [property, value] of landing.values) {
      segments.delete(property)
      resting[property] = value
      changed.push(property)
    }
    if (changed.length > 0) {
      engine.commit(changed, now())
    }
    for (const owner of [landing.owner, ...landing.carried]) {
      carriedOwners.delete(owner)
      if (!owner.settled) {
        engine.settle(owner, false)
      }
    }
  }

  /**
   * A later Reduced Motion call that lands too carries the landings still
   * waiting: their travel lands with its own, which wins where both move a
   * property, and their calls settle when it lands. So two calls in one
   * frame (a drag cancel's position and scale) both land.
   */
  engine.adoptLandings = (
    plan: NonNullable<ReducedPlan['landing']>,
    properties: ReadonlyArray<MotionProperty>,
  ): { carried: HandleState[], owners: Map<MotionProperty, HandleState> } => {
    const carried: HandleState[] = []
    const owners = new Map<MotionProperty, HandleState>()
    for (const landing of [...landings]) {
      for (const [property, value] of landing.values) {
        const moved = landing.owners.get(property) ?? landing.owner
        if (!properties.includes(property) && !plan.values.has(property)) {
          plan.values.set(property, value)
          owners.set(property, moved)
        }
        else if (!moved.settled) {
          // This call takes the property over: the earlier move never lands.
          engine.settle(moved, false)
        }
      }
      carried.push(landing.owner, ...landing.carried)
      engine.endLanding(landing)
    }
    for (const owner of carried) {
      carriedOwners.add(owner)
    }
    return { carried, owners }
  }

  /**
   * A call joins the newest waiting dip: it takes the landing over and
   * settles when the dip ends, and the call it replaces lands with it. Each
   * value keeps the call whose move it is.
   */
  engine.joinWaitingDip = (owner: HandleState) => {
    const dip = [...landings].reverse().find(landing => landing.fadeIn != null)
    if (dip == null) {
      engine.settle(owner, true)
      return
    }
    for (const property of dip.values.keys()) {
      if (!dip.owners.has(property)) {
        dip.owners.set(property, dip.owner)
      }
    }
    dip.carried.push(dip.owner)
    carriedOwners.add(dip.owner)
    dip.owner = owner
  }

  /** Where opacity is heading: past a waiting landing's fade back in. */
  engine.opacityHeading = (): number => {
    let to = engine.finalValue('opacity')
    for (const landing of landings) {
      if (landing.fadeIn != null) {
        to = landing.fadeIn.to
      }
      else if (landing.restore != null) {
        to = landing.restore
      }
    }
    return to
  }

  engine.endLanding = (landing: Landing) => {
    if (landing.timer != null) {
      clearTimeout(landing.timer)
    }
    landings.delete(landing)
  }

  /**
   * How long `landing` still waits for its fade, in ms. A sampler that pauses
   * the fade holds it, so it checks again later. A resumed fade holds it until
   * the fade starts again. A fade that runs past the landing's due time, as
   * after a pause, holds it for the rest of the fade. Any other fade holds
   * nothing.
   */
  engine.fadeHeldFor = (landing: Landing): number => {
    const animation = running.get('opacity')
    const owner = segments.get('opacity')?.owner
    if (
      animation == null
      || owner == null
      || (owner !== landing.owner && !landing.carried.includes(owner))
    ) {
      return 0
    }
    if (animation.playState === 'paused') {
      return RETIRE_RECHECK_MS
    }
    // The timeline reads the frame before a long task, so the fade's current
    // time would date a fade that has ended as still running.
    const start = animation.startTime
    const duration = Number(animation.effect?.getTiming?.().duration)
    if (!Number.isFinite(duration)) {
      return 0
    }
    if (start == null) {
      // A fade resumed with play() has no start until its next frame.
      return animation.playState === 'running' ? END_RECHECK_MS : 0
    }
    // A fade that ends by the landing's due time holds nothing. A timer runs
    // in whole milliseconds, so it often fires a fraction early.
    const end = Number(start) + duration - END_HOLD_MS
    if (landing.due != null && end <= landing.due) {
      return 0
    }
    const left = end - now()
    return left > 0 ? left : 0
  }

  /**
   * The landing's timer: it lands once its fade lets it. A call that takes the
   * landing over lands it directly, at once.
   */
  engine.landWhenFaded = (landing: Landing) => {
    const held = engine.fadeHeldFor(landing)
    if (held > 0) {
      landing.due = now() + held
      landing.timer = setTimeout(() => engine.landWhenFaded(landing), held)
      return
    }
    engine.land(landing)
  }

  /** Arms a landing from the call's start (the browser's, for a call from rest). */
  engine.scheduleLanding = (
    owner: HandleState,
    started: Promise<number>,
    plan: NonNullable<ReducedPlan['landing']>,
    adopted: ReturnType<typeof engine.adoptLandings> | null,
  ) => {
    const owners = new Map<MotionProperty, HandleState>()
    for (const property of plan.values.keys()) {
      owners.set(property, adopted?.owners.get(property) ?? owner)
    }
    const landing: Landing = {
      ...plan,
      owner,
      carried: adopted?.carried ?? [],
      owners,
      timer: null,
      due: null,
    }
    landings.add(landing)
    // The handle settles when the landing (and its fade back in) is done.
    if (owner.timer != null) {
      clearTimeout(owner.timer)
      owner.timer = null
    }
    void started.then((start) => {
      if (!landings.has(landing)) {
        return
      }
      landing.due = start + landing.at
      landing.timer = setTimeout(
        () => engine.landWhenFaded(landing),
        Math.max(0, landing.due - now()),
      )
    })
  }
}
