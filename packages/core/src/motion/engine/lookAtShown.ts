/**
 * @file lookAtShown.ts
 * Rechecks what a channel shows in a frame callback, and commits a frame.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { MotionProperty } from '../types'
import type { MotionEngine } from './context'
import type { Channel, HandleState } from './engineTypes'
import { LATE_START_MS } from '../frameBlock'
import { CHANNEL_OF, CHANNELS } from './constants'
import { firstCommitted, frameTime } from './taskClock'

export function installLookAtShown(engine: MotionEngine): void {
  const { heldForFrame, now, resting, segments, shown } = engine

  /**
   * The frame that commits calls that continue motion. When it comes more
   * than LATE_START_MS after the first call it commits on any animator, the
   * screen has shown the old curve. Each spring that they leave
   * then starts here, from the value on screen, as UIKit's added spring
   * begins at its commit. It keeps a velocity that its call handed it, such
   * as a release's, and otherwise takes the one on screen. A played curve or
   * a coast keeps its call's clock, and an earlier frame keeps every call on
   * its own clock.
   */
  engine.lookAtShown = (frame?: number) => {
    engine.isShownLookQueued = false
    const entries = [...shown]
    const channels = [...heldForFrame]
    heldForFrame.clear()
    engine.forgetShown()
    if (engine.target == null) {
      return
    }
    const at = frameTime(frame, now)
    const late
      = at
        - firstCommitted(
          frame,
          Math.min(...entries.map(([, entry]) => entry.since)),
        )
        > LATE_START_MS
    const changed: MotionProperty[] = []
    const owners = new Set<HandleState>()
    for (const [property, entry] of entries) {
      const current = segments.get(property)
      if (
        !late
        || current == null
        || current.spring == null
        || current.isFade === true
        || engine.isHeld(current)
      ) {
        continue
      }
      const screen = engine.shownAt(entry, at)
      const next
        = current.isAdditive === true && entry.segment != null
          ? engine.additiveSegment(
              current.owner,
              property,
              at,
              current.target,
              current.spring,
              engine.shifted(entry.segment, entry.offset),
            )
          : engine.springFrom(
              current.owner,
              property,
              at,
              screen.value,
              current.handedVelocity
              // From rest, the call's own start velocity.
              ?? (entry.segment == null ? current.speed(0) : screen.velocity),
              current.target,
              current.spring,
            )
      if (next == null) {
        segments.delete(property)
        resting[property] = current.target
      }
      else {
        segments.set(
          property,
          current.handedVelocity == null
            ? next
            : { ...next, handedVelocity: current.handedVelocity },
        )
      }
      owners.add(current.owner)
      changed.push(property)
    }
    const restarted = new Set(changed.map(property => CHANNEL_OF[property]))
    if (restarted.size > 0) {
      engine.commit(
        [...restarted].flatMap(channel => CHANNELS[channel]),
        at,
      )
    }
    engine.rebuildOnCallClocks(
      channels.filter(([channel]) => !restarted.has(channel)),
    )
    for (const owner of owners) {
      if (owner.settled || owner.timer == null) {
        continue
      }
      clearTimeout(owner.timer)
      let end = at
      for (const segment of segments.values()) {
        if (segment.owner === owner) {
          end = Math.max(end, segment.start + segment.duration)
        }
      }
      owner.timer = setTimeout(
        () => engine.settleAtEnd(owner),
        Math.max(0, end - now()),
      )
    }
  }

  // -- the animator -----------------------------------------------------------

  engine.commit = (changed: Iterable<MotionProperty>, time: number) => {
    const channels = new Set<Channel>()
    for (const property of changed) {
      channels.add(CHANNEL_OF[property])
    }
    if (channels.has('opacity')) {
      engine.borrowedOpacity = null
    }
    for (const channel of channels) {
      engine.rebuild(channel, time)
    }
    engine.flushReleases()
  }
}
