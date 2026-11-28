/**
 * @file curveReads.ts
 * Reads the curves: the segment at a time, values and velocities, what
 * is shown at rest, the drawn translate, the presented offset and the
 * inline write.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { MotionProperty } from '../types'
import type { MotionEngine } from './context'
import type { Channel, Segment } from './engineTypes'
import { clearPresentedResolve, registerPresentedOffset } from '../presentation'
import { CHANNEL_OF, CHANNELS, REST_DISTANCE_TOLERANCES, REST_FRAMES_PER_SECOND, SAMPLE_TOLERANCE } from './constants'
import { inlineText } from './cssValues'

export function installCurveReads(engine: MotionEngine): void {
  const { companion, now, presentedSource, pseudoElement, resting, segments, touched } = engine

  // -- reading the curves ---------------------------------------------------

  engine.segmentAt = (
    property: MotionProperty,
    time: number,
  ): Segment | null => {
    const segment = segments.get(property)
    if (segment == null) {
      return null
    }
    if (time >= engine.endOf(property, segment)) {
      return null
    }
    return segment
  }

  /**
   * A curve whose call the browser has not started yet: still at its start
   * on screen (valueAt), already moving in the model (velocityAt).
   */
  engine.isHeld = (segment: Segment) =>
    segment.group != null && !segment.group.resolved

  /** The curve itself at `time`: what the keyframes play. */
  engine.curveAt = (property: MotionProperty, time: number): number => {
    const segment = segments.get(property)
    if (segment == null) {
      return resting[property]
    }
    if (time >= segment.start + segment.duration) {
      return segment.target
    }
    return segment.at(Math.max(0, time - segment.start))
  }

  /**
   * A held curve's start once a frame dated its call, as the browser's start
   * moves it: by that frame's lead over the call's own time.
   */
  engine.datedFromLatest = (
    segment: Segment,
    latest: number | undefined,
  ): { latest: number, start: number } | null =>
    latest == null || segment.group == null
      ? null
      : { latest, start: segment.start + latest - segment.group.provisional }

  /**
   * When a waiting curve's call had its first frame, which put the curve on
   * screen. Undefined for a curve that does not wait, or whose call has had
   * no first frame.
   */
  engine.shownSince = (
    property: MotionProperty,
    segment: Segment,
  ): number | undefined =>
    segment.group?.resolved === false
      ? segment.group.latest?.get(CHANNEL_OF[property])
      : undefined

  /** A curve's end, dated from its call's first frame while it waits. */
  engine.endOf = (property: MotionProperty, segment: Segment): number =>
    (engine.datedFromLatest(segment, engine.shownSince(property, segment))?.start
      ?? segment.start) + segment.duration

  /**
   * Takes a curve on screen out of the call that still waits for the
   * browser's start. The curve keeps its course, dated from the call's first
   * frame. A call that has no channel left starts at that frame.
   */
  engine.leaveWaitingCall = (
    segment: Segment,
    channel: Channel,
    latest: number,
  ) => {
    const group = segment.group
    if (group == null) {
      return
    }
    const index = group.segments.indexOf(segment)
    if (index >= 0) {
      group.segments.splice(index, 1)
    }
    segment.start += latest - group.provisional
    segment.group = undefined
    if (!CHANNELS[channel].some(p => segments.get(p)?.group === group)) {
      group.latest?.delete(channel)
      group.channels.delete(channel)
    }
    if (group.channels.size === 0 && group.segments.length === 0) {
      engine.resolveGroup(group, latest)
    }
  }

  /**
   * The value on screen at `time`. Until the browser reports its start, a
   * held curve shows its first value. A frame that ran without that start
   * dates the curve. Without that frame, a later time reads from the
   * provisional start, so a companion that samples ahead follows the curve's
   * shape.
   */
  engine.valueAt = (property: MotionProperty, time: number): number => {
    const segment = segments.get(property)
    if (segment != null && engine.isHeld(segment)) {
      // The compositor starts the call near its first frame. The curve is
      // dated as the browser's start would date it. A curve that joined by an
      // older clock keeps its lead over the call's own time.
      const latest = segment.group?.latest?.get(CHANNEL_OF[property])
      const dated = engine.datedFromLatest(segment, latest)
      if (dated != null) {
        const elapsed = Math.max(time, dated.latest) - dated.start
        return elapsed >= segment.duration
          ? segment.target
          : segment.at(elapsed)
      }
      // Nothing has moved on screen until the browser starts the call.
      if (time <= now()) {
        return segment.at(0)
      }
    }
    return engine.curveAt(property, time)
  }

  /**
   * Whether a curve's tail already shows as at rest at `time`. Under a
   * starved main thread the browser commits a call late. A call that starts
   * at its own time then skips that far into its curve. One that starts at
   * the commit holds an element that hardly moves.
   */
  engine.showsAtRest = (
    property: MotionProperty,
    segment: Segment,
    time: number,
  ): boolean =>
    Math.abs(engine.valueAt(property, time) - segment.target)
    <= REST_DISTANCE_TOLERANCES * SAMPLE_TOLERANCE[property]
    && Math.abs(engine.velocityAt(property, time))
    <= SAMPLE_TOLERANCE[property] * REST_FRAMES_PER_SECOND

  engine.velocityAt = (property: MotionProperty, time: number): number => {
    const held = segments.get(property)
    if (held != null && engine.isHeld(held)) {
      // Still at its start on screen, but moving in the model. A retarget
      // carries the velocity the curve has reached by now. So a flick whose
      // moves all land before the browser starts any keeps its speed. Past
      // its first frame, it reads from that frame, as its value does.
      const dated = engine.datedFromLatest(
        held,
        held.group?.latest?.get(CHANNEL_OF[property]),
      )
      return held.speed(
        Math.max(
          0,
          dated != null && time > dated.latest
            ? time - dated.start
            : time - held.start,
        ),
      )
    }
    const segment = engine.segmentAt(property, time)
    if (segment == null || time < segment.start) {
      return 0
    }
    return segment.speed(time - segment.start)
  }

  // The curve just before a jump at absolute time `time`.
  engine.valueBefore = (property: MotionProperty, time: number): number =>
    engine.curveAt(property, time - 1e-6)

  // -- writing --------------------------------------------------------------

  engine.finalValue = (property: MotionProperty): number =>
    segments.get(property)?.target ?? resting[property]

  /**
   * Where translate is drawn relative to where the translate animation
   * started, read live when a touch lands. iOS WebKit keeps the transform it
   * resolved when the animation went to the compositor (iOS 26.2: the
   * element's rect and its hit tests stay at the start for the whole curve,
   * while the computed style is live), until the animation is retired. A
   * segment whose start still waits for the browser's commit has painted
   * nothing of its curve yet.
   */
  engine.drawnTranslate = (property: MotionProperty, time: number) => {
    const segment = segments.get(property)
    return segment?.group != null && !segment.group.resolved
      ? segment.at(0)
      : engine.valueAt(property, time)
  }

  /** Reports the element while its translate moves (not a pseudo-element's). */
  engine.present = (isMoving: boolean) => {
    const element = isMoving && pseudoElement == null ? engine.target : null
    if (element === engine.presented) {
      return
    }
    engine.unpresent?.()
    engine.unpresent = null
    if (engine.presented instanceof HTMLElement) {
      clearPresentedResolve(engine.presented)
    }
    engine.presented = element
    if (element != null) {
      engine.unpresent = registerPresentedOffset(element, presentedSource)
    }
  }

  engine.writeInline = (
    channel: Channel,
    value: (property: MotionProperty) => number,
    release = true,
  ) => {
    if (engine.target == null || pseudoElement != null) {
      return
    }
    touched.add(channel)
    const text = engine.isCustom(channel)
      ? engine.textOf(channel, value)
      : inlineText(channel, value)
    // An unchanged value is not written: a style write invalidates the
    // element, and WebKit can repaint sticky content stale when that lands in
    // the frame a scroll commits.
    if (engine.target.style.getPropertyValue(engine.cssName(channel)) !== text) {
      engine.target.style.setProperty(engine.cssName(channel), text)
    }
    if (engine.isCustom(channel) && companion != null) {
      const companionValue = engine.companionText(value('x'))
      if (engine.target.style.getPropertyValue(companion.name) !== companionValue) {
        engine.target.style.setProperty(companion.name, companionValue)
      }
    }
    if (release && text === engine.identityOf(channel)) {
      // Identity leaves the element when nothing else would move it.
      engine.releaseIdentity(channel)
    }
  }
}
