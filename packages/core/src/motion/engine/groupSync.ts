/**
 * @file groupSync.ts
 * Keeps a start group in step with the browser's commit, a late first
 * frame and a main-thread block.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { MotionEngine } from './context'
import type { StartGroup } from './engineTypes'
import { LATE_START_MS } from '../frameBlock'
import { CHANNELS } from './constants'

export function installGroupSync(engine: MotionEngine): void {
  const { now, pendingGroups, requestFrame, resting, running, segments } = engine

  /**
   * A call whose first animation was cancelled before its first frame: if a
   * later call in the same task took over its curves, it starts with that
   * call; otherwise it never started.
   */
  engine.settleCancelled = (group: StartGroup) => {
    if (group.resolved) {
      return
    }
    let adopter = group.adoptedBy
    while (adopter?.adoptedBy != null) {
      adopter = adopter.adoptedBy
    }
    if (adopter != null && adopter !== group) {
      void adopter.started.then(start => engine.resolveGroup(group, start))
      return
    }
    // A same-task write replaced the animation the call waited on: the call
    // still starts with the browser's start of the ones that remain.
    if (engine.awaitStart(group)) {
      return
    }
    engine.resolveGroup(group, group.provisional)
  }

  /**
   * Waits for the browser's start of a call through one of its animations
   * still playing; false when none is left to wait on.
   */
  engine.awaitStart = (group: StartGroup): boolean => {
    const live = group.animations.find(
      animation => animation.playState !== 'idle',
    )
    const ready = (live as Partial<Animation> | undefined)?.ready
    if (ready == null || typeof ready.then !== 'function') {
      return false
    }
    ready.then(
      () => engine.syncGroup(group),
      () => engine.settleCancelled(group),
    )
    return true
  }

  engine.syncGroup = (group: StartGroup) => {
    if (group.resolved) {
      return
    }
    for (const animation of group.animations) {
      if (animation.startTime != null) {
        engine.resolveGroup(
          group,
          engine.startAfterBlock(group, Number(animation.startTime)),
        )
        return
      }
    }
    // Finished from outside before the browser started it (a sampler's
    // finish() on a held animation): nothing is left to wait on, so the call
    // keeps its own clock, and a later call on an explicit clock does not
    // join it and wait for a start that never comes.
    if (
      group.animations.length > 0
      && group.animations.every(
        animation =>
          animation.playState === 'finished' || animation.playState === 'idle',
      )
      && group.animations.some(animation => animation.playState === 'finished')
    ) {
      engine.resolveGroup(group, group.provisional)
      return
    }
    // No start yet (paused before its first frame by a harness or a page,
    // or resumed with play() and still pending): neither `ready` nor the
    // first frame will look again, so keep looking each frame until the call
    // has a start, or its animations finish (its own clock) or are cancelled.
    if (
      group.animations.some(
        animation =>
          animation.startTime == null && animation.playState !== 'idle',
      )
    ) {
      requestFrame?.(() => engine.syncGroup(group))
    }
  }

  /**
   * Reads the start of every call whose first frame may have been committed:
   * not those created in the running task, whose start the browser cannot
   * have set (reading it there can cost a style update per call).
   */
  engine.syncPending = () => {
    for (const group of pendingGroups) {
      if (!group.fresh) {
        engine.syncGroup(group)
      }
    }
    engine.syncFinished()
  }

  /**
   * An animation finished from outside (a test utility's or devtools'
   * `finish()`) shows its end state while the model still reads its curve:
   * the curve ends now in the model too, so the next call starts from what
   * is on screen.
   */
  engine.syncFinished = () => {
    for (const [channel, animation] of running) {
      if (animation.playState !== 'finished') {
        continue
      }
      const time = now()
      for (const property of CHANNELS[channel]) {
        const segment = segments.get(property)
        if (segment == null || time >= segment.start + segment.duration) {
          continue
        }
        segments.delete(property)
        resting[property] = segment.target
      }
    }
  }

  /**
   * The start of a call from rest, on the frame that commits it. Chromium,
   * like Core Animation, starts a pending animation when it commits it, so a
   * main-thread block later in the call's task delays the motion; WebKit
   * dates it at its last frame time before that task, so the first frame
   * after the block would show it skipped into its curve. When the task ran
   * on more than LATE_START_MS past its first call, a start the browser put
   * by the task's first animations (a presented call's second frame, not the
   * call) and more than LATE_START_MS before the call's first read (its
   * `ready`, once the task has ended, or the first frame after it) moves to
   * that read, with every animation of the call, and every call of the task
   * moves to the same read. A shorter task, or a read other tasks delay,
   * keeps the browser's start.
   */
  engine.startAfterBlock = (group: StartGroup, start: number): number => {
    const timeline
      = typeof document === 'undefined'
        ? null
        : (document.timeline?.currentTime as number | null | undefined)
    // A start well after the animations were created is the browser's
    // commit of them.
    if (
      timeline == null
      || group.framed === true
      || start > (group.task?.first ?? group.provisional) + LATE_START_MS
    ) {
      return start
    }
    const { task } = group
    // A read in the task's first microtasks comes after its end too.
    // A later listener of an input event may hold the event's task past its
    // first microtask. So for a call made with `start: 'next-frame'`, the
    // task ends at this read: the first frame after the task, or its `ready`.
    const ended = task?.nextFrame === true ? now() : (task?.ended ?? now())
    if (task == null || ended - task.first <= LATE_START_MS) {
      return start
    }
    // Read once the task has ended (its `ready`) or in the first frame after
    // it, both after the block; the task's other calls take the same read.
    const at = task.at ?? Math.max(now(), timeline)
    if (at - start <= LATE_START_MS) {
      return start
    }
    task.at = at
    for (const animation of group.animations) {
      if (animation.playState !== 'idle') {
        animation.startTime = at
      }
    }
    return at
  }

  /** Moves a call from rest onto the time the browser started it. */
  engine.resolveGroup = (group: StartGroup, start: number) => {
    if (group.resolved) {
      return
    }
    group.resolved = true
    pendingGroups.delete(group)
    for (const animation of group.animations) {
      // One clock for the whole call; a cancelled one stays cancelled (a
      // start time would play it again).
      if (animation.startTime == null && animation.playState !== 'idle') {
        animation.startTime = start
      }
    }
    const delta = start - group.provisional
    if (delta !== 0) {
      for (const segment of group.segments) {
        segment.start += delta
      }
      for (const channel of group.channels) {
        const animation = running.get(channel)
        if (animation == null || !group.animations.includes(animation)) {
          continue
        }
        const ends = CHANNELS[channel].flatMap((p) => {
          const segment = segments.get(p)
          return segment == null ? [] : [segment.start + segment.duration]
        })
        if (ends.length > 0) {
          engine.scheduleRetire(channel, animation, Math.max(...ends))
        }
      }
      for (const owner of new Set(group.segments.map(s => s.owner))) {
        if (owner.settled || owner.timer == null) {
          continue
        }
        clearTimeout(owner.timer)
        const ends = group.segments
          .filter(segment => segment.owner === owner)
          .map(segment => segment.start + segment.duration)
        owner.timer = setTimeout(
          () => engine.settleAtEnd(owner),
          Math.max(0, Math.max(start, ...ends) - now()),
        )
      }
    }
    group.resolve(start)
  }
}
