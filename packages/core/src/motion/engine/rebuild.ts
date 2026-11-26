/**
 * @file rebuild.ts
 * Rebuilds a channel's Web Animation from its segments.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { MotionEngine } from './context'
import type { Channel, Segment, StartGroup } from './engineTypes'
import { quietFinished } from '../quietFinished'
import { CHANNELS, END_HOLD_MS, MAX_DURATION_MS, MAX_KEYFRAMES, SAMPLE_TOLERANCE } from './constants'
import { bakesOfTask, copyAnimation, frameTime, isCopyable, isSameKey } from './taskClock'

export function installRebuild(engine: MotionEngine): void {
  const { now, pseudoElement, requestFrame, resting, retireLooks, retireTimers, running, segments, stale } = engine

  engine.rebuild = (channel: Channel, time: number) => {
    engine.commitWaitingNow(channel)
    stale.delete(channel)
    const previous = running.get(channel)
    running.delete(channel)
    clearTimeout(retireTimers.get(channel))
    retireTimers.delete(channel)
    clearTimeout(retireLooks.get(channel))
    retireLooks.delete(channel)
    // An element's inline style takes the value on screen below, so its old
    // animation can go first. A pseudo-element has none: its old animation
    // keeps holding the value until the new one exists (same task, no frame in
    // between).
    if (pseudoElement == null) {
      previous?.cancel()
    }
    const properties = CHANNELS[channel]
    // Settled curves become resting values.
    for (const property of properties) {
      const segment = segments.get(property)
      if (segment != null && time >= engine.endOf(property, segment)) {
        resting[property] = segment.target
        segments.delete(property)
      }
    }
    const moving = properties.filter(p => segments.has(p))
    if (engine.callGroup == null) {
      // A call that starts now rebuilds a channel the compositor has moving
      // since a first frame without a known start. The channel carries on
      // from that frame, with a start of its own, instead of starting its
      // curve again.
      for (const property of moving) {
        const segment = segments.get(property) as Segment
        const latest = engine.shownSince(property, segment)
        if (latest != null) {
          engine.leaveWaitingCall(segment, channel, latest)
        }
      }
    }
    // An explicit call can rebuild a channel while one of its curves still
    // waits for the browser's start. The animation then joins the current
    // call, or else that waiting call, with no start of its own.
    const waiting
      = engine.callGroup
        ?? moving
          .map(p => (segments.get(p) as Segment).group)
          .find(group => group != null && !group.resolved)
          ?? null
    const rebuiltAfterFirstFrame = waiting?.framed === true
    // The new animation starts at the frame that commits it, from its first
    // keyframe. That holds for a waiting call it joins after that call's
    // first frame, and for every waiting call it takes a curve from. So this
    // channel's reads below, and until that frame, take that first value.
    const restarted = new Set<StartGroup>()
    if (rebuiltAfterFirstFrame) {
      restarted.add(waiting)
    }
    if (engine.callGroup != null) {
      for (const property of moving) {
        const group = (segments.get(property) as Segment).group
        if (group != null && group !== engine.callGroup && !group.resolved) {
          restarted.add(group)
        }
      }
    }
    for (const group of restarted) {
      group.latest?.delete(channel)
    }
    if (channel === 'translate' && !engine.isCustom(channel)) {
      // The animation built below starts from the value at `time` (its first
      // keyframe); a rebase or a retarget builds a new one, so a new start.
      engine.hitTested = { x: engine.valueAt('x', time), y: engine.valueAt('y', time) }
      engine.present(
        moving.length > 0
        && engine.target != null
        && typeof engine.target.animate === 'function',
      )
    }
    if (
      moving.length === 0
      || engine.target == null
      || typeof engine.target.animate !== 'function'
    ) {
      engine.writeInline(channel, engine.finalValue)
    }
    else {
      // The value on screen as the curve starts: what a frame painted before
      // the compositor has the curve shows. The end is written at retire.
      engine.writeInline(channel, p => engine.valueAt(p, time))
    }
    if (engine.target == null || typeof engine.target.animate !== 'function') {
      previous?.cancel()
      return
    }
    if (moving.length === 0) {
      if (pseudoElement != null) {
        engine.hold(channel, time)
      }
      previous?.cancel()
      return
    }
    // The keyframes start where the animation will: at the waiting call's
    // own time, which its start moves to the browser's (resolveGroup), so a
    // write later in the task keeps the screen on the model's clock.
    const from = waiting?.provisional ?? time
    const end = Math.min(
      from + MAX_DURATION_MS,
      Math.max(
        ...moving.map(
          p =>
            (segments.get(p) as Segment).start
            + (segments.get(p) as Segment).duration,
        ),
      ),
    )
    if (end <= from) {
      if (pseudoElement != null) {
        engine.hold(channel, time)
      }
      previous?.cancel()
      return
    }
    if (engine.callGroup != null) {
      // A curve of an earlier call still waiting for its first frame is
      // rebaked here: it starts with this call's commit.
      for (const property of moving) {
        const segment = segments.get(property) as Segment
        const group = segment.group
        if (group != null && group !== engine.callGroup && !group.resolved) {
          const index = group.segments.indexOf(segment)
          if (index >= 0) {
            group.segments.splice(index, 1)
          }
          group.adoptedBy = engine.callGroup
          segment.group = engine.callGroup
          // Re-dated to this call's time: it starts at the commit too, not
          // the work between the two calls into its curve.
          segment.start += engine.callGroup.provisional - group.provisional
          engine.callGroup.segments.push(segment)
        }
      }
    }
    // Read where the keyframes are baked: a page moved to another screen
    // bakes its next motion for that screen.
    const devicePixel = 1 / Math.max(1, globalThis.devicePixelRatio || 1)
    // An earlier call of this task that played the same curves from the same
    // offset, over the same rest values, baked these keyframes already.
    // A custom property's keyframes write its own properties, so they are
    // never shared with another call's.
    const bakeKey
      = pseudoElement == null && !engine.isCustom(channel)
        ? engine.taskBakeKey(channel, moving, from, end, devicePixel)
        : null
    const baked
      = bakeKey == null
        ? undefined
        : bakesOfTask().keyframes.find(bake => isSameKey(bake.key, bakeKey))
    const collect = (scale: number): Set<number> => {
      const times = new Set<number>([from, end])
      for (const property of moving) {
        const tolerance
          = SAMPLE_TOLERANCE[property]
            * scale
            * (property === 'x' || property === 'y' ? devicePixel : 1)
        for (const t of engine.sharedSampleTimes(property, from, end, tolerance)) {
          times.add(t)
        }
      }
      return times
    }
    const span = end - from + END_HOLD_MS
    const bakeKeyframes = (): Keyframe[] => {
      let scale = 1
      let all = collect(scale)
      while (all.size > MAX_KEYFRAMES && scale < 64) {
        scale *= 2
        all = collect(scale)
      }
      // Jumps become two keyframes at one offset: the value just before,
      // then the value after. A jump on the last frame (fade out, then move)
      // too.
      const jumpTimes = new Set<number>()
      for (const property of moving) {
        const segment = segments.get(property) as Segment
        for (const j of segment.jumps) {
          const t = segment.start + j
          if (t > from && t <= end) {
            jumpTimes.add(t)
            all.add(t)
          }
        }
      }
      const times = [...all].sort((a, b) => a - b)
      const frames: Keyframe[] = []
      for (const t of times) {
        const offset = (t - from) / span
        if (jumpTimes.has(t)) {
          frames.push({
            offset,
            ...engine.frameOf(channel, p => engine.valueBefore(p, t)),
          })
        }
        frames.push({
          offset,
          ...engine.frameOf(channel, p => (t >= end ? engine.finalValue(p) : engine.curveAt(p, t))),
        })
      }
      frames.push({ offset: 1, ...engine.frameOf(channel, engine.finalValue) })
      return frames
    }
    const keyframes = baked?.keyframes ?? bakeKeyframes()
    // A custom property animates on the main thread: nothing to promote.
    if (!engine.isCustom(channel)) {
      engine.promote(channel)
    }
    const animation
      = baked != null && isCopyable(baked.effect)
        ? copyAnimation(baked.effect, engine.target)
        : quietFinished(engine.target.animate(keyframes, {
            duration: span,
            // The last keyframes hold the end state (END_HOLD_MS); filling both
            // ways also keeps it where an engine honors the fill on its compositor.
            // The main thread retires the animation once it runs after the end,
            // writing the end inline in that task, so that changes no pixel.
            fill: 'both',
            easing: 'linear',
            ...(pseudoElement != null ? { pseudoElement } : {}),
          }))
    if (bakeKey != null && baked == null) {
      bakesOfTask().keyframes.push({
        key: bakeKey,
        keyframes,
        effect: animation.effect,
      })
    }
    if (waiting != null) {
      // From rest: no start time, so the browser starts the animation when
      // it commits it (StartGroup); the keyframes are sampled from `from`,
      // the call's own start.
      waiting.animations.push(animation)
      waiting.channels.add(channel);
      // A cancel before the first frame rejects its ready promise.
      (animation as Partial<Animation>).ready?.catch(() => {})
      if (rebuiltAfterFirstFrame) {
        // The frame that commits it dates this channel's start again. The
        // call's other channels keep their own.
        requestFrame?.((frame) => {
          if (
            !waiting.resolved
            && running.get(channel) === animation
            && animation.startTime == null
            && animation.playState === 'running'
          ) {
            (waiting.latest ??= new Map()).set(channel, frameTime(frame, now))
          }
        })
      }
    }
    else {
      // One clock: the keyframes were sampled from `time`.
      animation.startTime = time
    }
    running.set(channel, animation)
    previous?.cancel()
    engine.scheduleRetire(channel, animation, end)
  }
}
