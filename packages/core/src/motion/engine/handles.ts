/**
 * @file handles.ts
 * Handles: settling, interrupting and the promise each call returns.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { MotionHandle, MotionProperty } from '../types'
import type { MotionEngine } from './context'
import type { HandleState, Segment, StartGroup } from './engineTypes'
import { CHANNELS, END_RECHECK_MS, PROPERTIES, RETIRE_RECHECK_MS } from './constants'

export function installHandles(engine: MotionEngine): void {
  const { animator, carriedOwners, heldForFrame, landings, lastSpring, now, running, segments } = engine

  engine.interrupt = (property: MotionProperty, time: number) => {
    engine.cancelLanding(property)
    const segment = segments.get(property)
    if (segment == null) {
      return
    }
    if (
      time < segment.start + segment.duration
      && !carriedOwners.has(segment.owner)
    ) {
      engine.settle(segment.owner, false)
    }
  }

  engine.settle = (owner: HandleState, finished: boolean) => {
    if (owner.settled) {
      return
    }
    owner.settled = true
    if (owner.timer != null) {
      clearTimeout(owner.timer)
      owner.timer = null
    }
    owner.resolve(finished)
  }

  /**
   * A handle whose curves have reached their end on the wall clock finishes,
   * unless a sampler holds one of its animations (paused, or sought back):
   * then it waits on that animation's own time, as retiring does
   * (scheduleRetire), so `finished` never resolves under motion still on
   * screen.
   */
  engine.settleAtEnd = (owner: HandleState) => {
    owner.timer = null
    let wait = 0
    for (const [channel, animation] of running) {
      if (
        !CHANNELS[channel].some(
          property => segments.get(property)?.owner === owner,
        )
      ) {
        continue
      }
      if (heldForFrame.has(channel)) {
        wait = Math.max(wait, END_RECHECK_MS)
        continue
      }
      const remaining = engine.remainingCurve(animation)
      if (remaining != null && remaining > 0) {
        wait = Math.max(
          wait,
          animation.playState === 'paused'
            ? RETIRE_RECHECK_MS
            : Math.max(remaining, END_RECHECK_MS),
        )
      }
    }
    if (wait > 0) {
      owner.timer = setTimeout(() => engine.settleAtEnd(owner), wait)
      return
    }
    engine.settle(owner, true)
  }

  engine.makeHandle = (
    owner: HandleState,
    properties: MotionProperty[],
    finished: Promise<boolean>,
    time: number,
    group: StartGroup | null = null,
    settlesWithLanding = false,
  ): MotionHandle => {
    const ends = properties.map((p) => {
      const segment = segments.get(p)
      return segment != null && segment.owner === owner
        ? segment.start + segment.duration
        : time
    })
    const end = Math.max(time, ...ends)
    if (settlesWithLanding) {
      // The landing it joined settles it.
    }
    else if (properties.length === 0 || end <= time) {
      engine.settle(owner, true)
    }
    else {
      // Interruptions settle false as they happen (interrupt); reaching the
      // end untouched is completion.
      owner.timer = setTimeout(
        () => engine.settleAtEnd(owner),
        Math.max(0, end - now()),
      )
    }
    // The call's own curves, as it started them.
    const curves = new Map<MotionProperty, Segment>()
    for (const property of properties) {
      const segment = segments.get(property)
      if (segment != null && segment.owner === owner) {
        curves.set(property, segment)
      }
    }
    const handle: MotionHandle = {
      properties,
      finished,
      started: group?.started ?? Promise.resolve(time),
      curve: (property) => {
        const segment = curves.get(property === 'scale' ? 'scaleX' : property)
        if (segment == null) {
          return null
        }
        return {
          duration: segment.duration / 1000,
          at: t =>
            t * 1000 >= segment.duration
              ? segment.target
              : segment.at(Math.max(0, t * 1000)),
          velocity: t =>
            t * 1000 >= segment.duration ? 0 : segment.speed(t * 1000),
        }
      },
      value: (property, at = now()) => {
        engine.syncPending()
        return engine.valueAt(property, at)
      },
      velocity: (property, at = now()) => {
        engine.syncPending()
        return engine.velocityAt(property, at)
      },
      retarget: (to, transition, retargetOptions) => {
        const spring = transition?.spring ?? lastSpring.get(owner)
        if (spring == null) {
          throw new Error('animator: retarget needs a spring')
        }
        return animator.animate(to, { ...transition, spring }, retargetOptions)
      },
      // The call's own curves, and its travel still waiting to land under
      // Reduce Motion: a catch freezes both where they are on screen
      // (AST-094 FR6), travel first so the fade's landing no longer carries
      // it, as `animator.stop()` does.
      stop: () =>
        animator.stop(
          PROPERTIES.filter(
            p =>
              properties.includes(p)
              && (segments.get(p)?.owner === owner
                || [...landings].some(
                  landing =>
                    landing.values.has(p)
                    && (landing.owners.get(p) ?? landing.owner) === owner,
                )),
          ),
        ),
    }
    return handle
  }

  engine.newOwner = (): { owner: HandleState, finished: Promise<boolean> } => {
    let resolve: (finished: boolean) => void = () => {}
    const finished = new Promise<boolean>((r) => {
      resolve = r
    })
    return { owner: { resolve, settled: false, timer: null }, finished }
  }
}
