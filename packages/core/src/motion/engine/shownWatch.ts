/**
 * @file shownWatch.ts
 * Tracks what each channel shows: hidden pages, waiting calls and the
 * shown value a rebuild starts from.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { MotionProperty } from '../types'
import type { MotionEngine } from './context'
import type { Channel, Segment, Shown, StartGroup } from './engineTypes'
import { CHANNEL_OF, CHANNELS } from './constants'
import { frameNesting, waitingCalls } from './taskClock'

export function installShownWatch(engine: MotionEngine): void {
  const { framePage, heldForFrame, requestFrame, resting, retireLooks, retireTimers, segments, shown, stale, waitKey } = engine

  /**
   * Whether no frame comes. A hidden page draws none. The frame source of a
   * hidden page draws none either, while the element shows elsewhere (a
   * Picture-in-Picture window's opener).
   */
  engine.isPageHidden = () =>
    engine.target?.ownerDocument.visibilityState === 'hidden'
    || framePage?.visibilityState === 'hidden'

  engine.forgetShown = () => {
    shown.clear()
    engine.syncWaiting()
    engine.stopWatchingHidden?.()
  }

  engine.syncWaiting = () => {
    let first = Infinity
    for (const entry of shown.values()) {
      first = Math.min(first, entry.since)
    }
    if (first === Infinity) {
      waitingCalls.delete(waitKey)
    }
    else {
      waitingCalls.set(waitKey, first)
    }
  }

  /**
   * Rebuilds channels from their last calls' times, as those calls would
   * have rebuilt them: the same keyframes and start time.
   */
  engine.rebuildOnCallClocks = (channels: [Channel, number][]) => {
    for (const time of new Set(channels.map(([, at]) => at))) {
      engine.commit(
        channels
          .filter(([, at]) => at === time)
          .flatMap(([channel]) => CHANNELS[channel]),
        time,
      )
    }
  }

  engine.flushWaiting = () => {
    const channels = [...heldForFrame]
    heldForFrame.clear()
    engine.rebuildOnCallClocks(channels)
  }

  /**
   * A hidden page draws no frames and shows nothing, so its calls keep their
   * own clock, as the timers do (scheduleRetire). A page that goes hidden
   * before the frame forgets what it showed and rebuilds what waits.
   */
  engine.watchHidden = () => {
    const pages = [
      ...new Set(
        [engine.target?.ownerDocument, framePage].filter(page => page != null),
      ),
    ]
    if (engine.stopWatchingHidden != null || pages.length === 0) {
      return
    }
    const onChange = (): void => {
      if (engine.isPageHidden()) {
        engine.forgetShown()
        engine.flushWaiting()
      }
    }
    for (const page of pages) {
      page.addEventListener('visibilitychange', onChange)
    }
    engine.stopWatchingHidden = () => {
      for (const page of pages) {
        page.removeEventListener('visibilitychange', onChange)
      }
      engine.stopWatchingHidden = null
    }
  }

  /**
   * Holds a call's channels for the frame that commits it, which rebuilds
   * them (lookAtShown). Until then the old curve plays on, and no end look
   * retires it.
   */
  engine.deferRebuild = (changed: MotionProperty[], time: number) => {
    for (const property of changed) {
      const channel = CHANNEL_OF[property]
      const isNew = !heldForFrame.has(channel)
      heldForFrame.set(channel, time)
      if (!isNew) {
        continue
      }
      stale.delete(channel)
      clearTimeout(retireTimers.get(channel))
      retireTimers.delete(channel)
      clearTimeout(retireLooks.get(channel))
      retireLooks.delete(channel)
    }
  }

  /** A rebuild before that frame commits the channel's calls at once. */
  engine.commitWaitingNow = (channel: Channel) => {
    if (!heldForFrame.delete(channel)) {
      return
    }
    for (const property of CHANNELS[channel]) {
      shown.delete(property)
    }
    engine.syncWaiting()
  }

  /**
   * Rebuilds a waiting channel from what the screen shows, after a rebase
   * moved the element under it. The old curve plays on, shifted with the
   * element, until the frame that commits the call.
   */
  engine.rebuildShown = (channel: Channel, time: number) => {
    const model = new Map<MotionProperty, Segment | undefined>()
    const rests = new Map<MotionProperty, number>()
    for (const property of CHANNELS[channel]) {
      const entry = shown.get(property)
      if (entry == null) {
        continue
      }
      model.set(property, segments.get(property))
      rests.set(property, resting[property])
      if (entry.segment == null) {
        segments.delete(property)
        resting[property] = entry.resting + entry.offset
      }
      else {
        segments.set(property, engine.shifted(entry.segment, entry.offset))
      }
    }
    const callTime = heldForFrame.get(channel)
    heldForFrame.delete(channel)
    try {
      engine.rebuild(channel, time)
    }
    finally {
      for (const [property, segment] of model) {
        if (segment == null) {
          segments.delete(property)
        }
        else {
          segments.set(property, segment)
        }
      }
      for (const [property, rest] of rests) {
        resting[property] = rest
      }
      if (callTime != null) {
        heldForFrame.set(channel, callTime)
      }
    }
  }

  /**
   * Notes what the screen shows of each property that a call continuing
   * motion changes, before the call replaces its curve. The call's channels
   * then wait for the frame that commits it, which rebuilds them
   * (lookAtShown). That holds for a call in a frame callback of the page's.
   * A call from rest, a call on an explicit clock and a call in an
   * animator's frame callback start on their frame already.
   */
  engine.noteShown = (
    properties: Iterable<MotionProperty>,
    time: number,
    group: StartGroup | null,
    at: number | undefined,
  ): boolean => {
    if (
      group != null
      || at != null
      || frameNesting.depth > 0
      || requestFrame == null
      || engine.target == null
      || typeof engine.target.animate !== 'function'
      || engine.isPageHidden()
    ) {
      return false
    }
    // A curve on these channels may still wait for the browser's start.
    // Its call's own start then settles where the new curve begins.
    const list = [...properties]
    if (
      list.some(property =>
        CHANNELS[CHANNEL_OF[property]].some((other) => {
          const segment = segments.get(other)
          return segment != null && engine.isHeld(segment)
        }),
      )
    ) {
      return false
    }
    for (const property of list) {
      if (shown.has(property)) {
        continue
      }
      shown.set(property, {
        segment: segments.get(property) ?? null,
        resting: resting[property],
        offset: 0,
        since: time,
      })
    }
    engine.syncWaiting()
    engine.watchHidden()
    if (!engine.isShownLookQueued) {
      engine.isShownLookQueued = true
      requestFrame(engine.lookAtShown)
    }
    return true
  }

  /** The value and velocity that the screen shows of a property at `time`. */
  engine.shownAt = (entry: Shown, time: number) => {
    const { segment, offset } = entry
    if (segment == null) {
      return { value: entry.resting + offset, velocity: 0 }
    }
    const elapsed = time - segment.start
    if (elapsed >= segment.duration) {
      return { value: segment.target + offset, velocity: 0 }
    }
    const t = Math.max(0, elapsed)
    return { value: segment.at(t) + offset, velocity: segment.speed(t) }
  }

  engine.shifted = (segment: Segment, offset: number): Segment =>
    offset === 0
      ? segment
      : {
          ...segment,
          target: segment.target + offset,
          at: t => segment.at(t) + offset,
        }
}
