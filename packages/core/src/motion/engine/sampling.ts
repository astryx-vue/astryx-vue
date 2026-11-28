/**
 * @file sampling.ts
 * Bakes curves into keyframe times shared within a task, holds a
 * channel's base and heals stale channels.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { MotionProperty } from '../types'
import type { MotionEngine } from './context'
import type { Channel, Segment, StartGroup } from './engineTypes'
import { isDevBuild } from '../../composables/internal/devBuild'
import { devWarn } from '../../composables/useDevWarning'
import { quietFinished } from '../quietFinished'
import { CHANNELS, IDENTITY, SAMPLE_GRID_MS, SAMPLE_TOLERANCE } from './constants'
import { format, sameShown } from './cssValues'
import { bakesOfTask, isSameKey } from './taskClock'

export function installSampling(engine: MotionEngine): void {
  const { base, heldForFrame, now, pseudoElement, resting, running, segments, stale } = engine

  /**
   * What identifies a channel's keyframes across calls of one task: each
   * moving property's curve object, offset and length, and each other
   * property's rest value. Null when a moving property has no shared curve
   * (a spring, a rebase, a jump).
   */
  engine.taskBakeKey = (
    channel: Channel,
    moving: MotionProperty[],
    from: number,
    end: number,
    devicePixel: number,
  ): unknown[] | null => {
    const key: unknown[] = [channel, end - from, devicePixel]
    for (const property of CHANNELS[channel]) {
      const segment = segments.get(property)
      if (!moving.includes(property)) {
        key.push(property, resting[property])
      }
      else if (segment?.source != null && segment.jumps.length === 0) {
        key.push(property, segment.source, segment.start - from)
        key.push(segment.duration)
      }
      else {
        return null
      }
    }
    return key
  }

  /** `sampleTimes`, shared by the calls of a task that play one curve. */
  engine.sharedSampleTimes = (
    property: MotionProperty,
    from: number,
    end: number,
    tolerance: number,
  ): number[] => {
    const segment = segments.get(property)
    if (segment?.source == null || segment.jumps.length > 0) {
      return engine.sampleTimes(property, from, end, tolerance)
    }
    const key: unknown[] = [
      segment.source,
      segment.start - from,
      segment.duration,
      end - from,
      tolerance,
    ]
    const { times } = bakesOfTask()
    const known = times.find(entry => isSameKey(entry.key, key))
    if (known != null) {
      return known.times.map(t => t + from)
    }
    const sampled = engine.sampleTimes(property, from, end, tolerance)
    times.push({ key, times: sampled.map(t => t - from) })
    return sampled
  }

  engine.sampleTimes = (
    property: MotionProperty,
    from: number,
    to: number,
    tolerance: number,
  ): number[] => {
    const segment = segments.get(property)
    if (segment == null) {
      return []
    }
    const begin = Math.max(from, segment.start)
    const end = Math.min(to, segment.start + segment.duration)
    if (end <= begin) {
      return []
    }
    const times: number[] = [begin]
    const value = (t: number): number => engine.curveAt(property, t)
    const breaks = segment.jumps
      .map(j => segment.start + j)
      .filter(t => t > begin && t < end)
    const edges = [begin, ...breaks, end]
    for (let e = 0; e + 1 < edges.length; e++) {
      const a = edges[e]
      const b = edges[e + 1]
      // A 30 Hz grid, each interval split until the chord is within the
      // tolerance at its quarter points.
      const steps = Math.max(1, Math.ceil((b - a) / SAMPLE_GRID_MS))
      const split = (t0: number, t1: number, depth: number): void => {
        const v0 = value(t0)
        const v1
          = t1 === b && breaks.includes(b) ? engine.valueBefore(property, b) : value(t1)
        let worst = 0
        for (const f of [0.25, 0.5, 0.75]) {
          const t = t0 + (t1 - t0) * f
          worst = Math.max(worst, Math.abs(value(t) - (v0 + (v1 - v0) * f)))
        }
        if (worst > tolerance && depth < 10 && t1 - t0 > 0.25) {
          const mid = (t0 + t1) / 2
          split(t0, mid, depth + 1)
          split(mid, t1, depth + 1)
        }
        else {
          times.push(t1)
        }
      }
      for (let i = 0; i < steps; i++) {
        split(a + ((b - a) * i) / steps, a + ((b - a) * (i + 1)) / steps, 0)
      }
    }
    return times
  }

  /**
   * Whether the pseudo-element's stylesheet shows the channel's resting
   * value: its base, to within the sampling tolerance, which no frame shows.
   * A curve that settles to a threshold ends that close to its target.
   */
  engine.atBase = (channel: Channel) =>
    CHANNELS[channel].every((property) => {
      const value = base[property]
      return (
        value != null
        && Math.abs(engine.finalValue(property) - value) <= SAMPLE_TOLERANCE[property]
      )
    })

  /**
   * The first hold dropped at `base` checks, in development, that the
   * stylesheet shows it. It reads after the cancel and off the motion's task,
   * so it adds no style read to a frame that starts a motion.
   */
  engine.checkBase = (channel: Channel) => {
    if (!isDevBuild() || engine.baseChecked) {
      return
    }
    engine.baseChecked = true
    setTimeout(() => {
      if (engine.target == null) {
        return
      }
      const shown = getComputedStyle(engine.target, pseudoElement).getPropertyValue(
        channel,
      )
      const expected = format(channel, p => base[p] ?? IDENTITY[p])
      if (!sameShown(channel, shown, expected)) {
        devWarn(
          'Astryx motion',
          `the ${pseudoElement} stylesheet shows ${channel} `
          + `${shown || '(unset)'}, not its declared base ${expected}, so `
          + 'it shows the wrong value at rest. Make `base` match the '
          + 'stylesheet.',
        )
      }
    }, 0)
  }

  /**
   * A pseudo-element's resting value, held by a static filling animation,
   * unless its stylesheet shows it (`base`).
   */
  engine.hold = (channel: Channel, time: number) => {
    if (engine.target == null) {
      return
    }
    if (engine.atBase(channel)) {
      engine.checkBase(channel)
      return
    }
    const value = format(channel, engine.finalValue)
    const animation = quietFinished(engine.target.animate([{ [channel]: value }, { [channel]: value }], {
      duration: 1,
      fill: 'both',
      pseudoElement,
    }))
    animation.startTime = time
    running.set(channel, animation)
  }

  engine.replaceIn = (group: StartGroup, segment: Segment, next: Segment) => {
    const index = group.segments.indexOf(segment)
    if (index >= 0) {
      group.segments[index] = next
    }
    else {
      group.segments.push(next)
    }
  }

  engine.markStale = (channel: Channel) => {
    stale.add(channel)
    if (!engine.healQueued) {
      engine.healQueued = true
      queueMicrotask(engine.healStale)
    }
  }

  engine.healStale = () => {
    engine.healQueued = false
    if (stale.size === 0) {
      return
    }
    // A waiting channel rebuilds at the frame that commits its call.
    const properties = [...stale]
      .filter(channel => !heldForFrame.has(channel))
      .flatMap(channel => CHANNELS[channel])
    stale.clear()
    engine.commit(properties, now())
  }
}
