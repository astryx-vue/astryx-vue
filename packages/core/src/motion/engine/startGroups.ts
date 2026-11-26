/**
 * @file startGroups.ts
 * Start groups: calls from rest that one frame commits start at one time;
 * deferred calls and starting a call.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { AnimateOptions, MotionProperty } from '../types'
import type { MotionEngine } from './context'
import type { Channel, HandleState, StartGroup } from './engineTypes'
import { LATE_START_MS } from '../frameBlock'
import { CHANNEL_OF, CHANNELS } from './constants'
import { frameNesting, frameTime, markTask } from './taskClock'

export function installStartGroups(engine: MotionEngine): void {
  const { deferredCalls, now, pendingGroups, requestFrame, running, segments } = engine

  // -- starting from rest ---------------------------------------------------

  /**
   * A call starts from rest when nothing on the channels it drives moves on
   * screen and nothing pins its clock (`at`). A curve still waiting for its
   * first frame counts as rest, as does one whose tail already shows as at
   * rest. Returns its start group, or null for an explicit start.
   */
  engine.beginGroup = (
    time: number,
    properties: Iterable<MotionProperty>,
    at: number | undefined,
    start?: AnimateOptions['start'],
  ): StartGroup | null => {
    if (engine.target == null || typeof engine.target.animate !== 'function') {
      return null
    }
    const channels = new Set<Channel>()
    for (const property of properties) {
      channels.add(CHANNEL_OF[property])
    }
    if (at != null) {
      // An explicit clock is the caller's, except a clock no later than a
      // call from rest on these channels still waiting for the browser's
      // start (an event timestamp, such as a drop's, for the reorder that
      // rebases it): the new call joins that call, and the browser's start
      // moves both. A later clock is a later call, often a frame or more
      // later while the browser has not started the first: it keeps its own
      // clock, since joining would sample its curve from the earlier call's
      // time and hold its first value for the gap.
      for (const channel of channels) {
        for (const property of CHANNELS[channel]) {
          const group = segments.get(property)?.group
          if (group != null && !group.resolved && at <= group.provisional) {
            return group
          }
        }
      }
      return null
    }
    // A call that continues motion keeps its call's clock, unless it asks
    // for the browser's start (`commit`). `presented` asks only for a call
    // from rest. A curve that still moves is not at rest, so a call on it
    // continues from the value and velocity on screen. A tail that shows as
    // at rest counts as rest, so a call on it waits, under `presented` for
    // its two frames.
    for (const channel of start === 'commit' ? [] : channels) {
      for (const property of CHANNELS[channel]) {
        const segment = segments.get(property)
        // A call's first frame puts its channels on screen, even before the
        // browser reports the start. So such a channel is not at rest either.
        if (
          segment != null
          && time < engine.endOf(property, segment)
          && (segment.group == null
            || segment.group.resolved
            || engine.shownSince(property, segment) != null)
          && !engine.showsAtRest(property, segment, time)
        ) {
          return null
        }
      }
    }
    let resolve: (start: number) => void = () => {}
    const started = new Promise<number>((r) => {
      resolve = r
    })
    return {
      provisional: time,
      fresh: false,
      segments: [],
      animations: [],
      channels: new Set(),
      resolved: false,
      resolve,
      started,
    }
  }

  /** Commits a call's changes, from rest when it has a start group. */
  engine.commitCall = (
    group: StartGroup | null,
    owner: HandleState,
    changed: MotionProperty[],
    time: number,
    presented = false,
    waitsForFrame = false,
  ) => {
    if (group != null) {
      for (const property of changed) {
        const segment = segments.get(property)
        if (segment != null && segment.owner === owner) {
          segment.group = group
          group.segments.push(segment)
        }
      }
    }
    if (presented && group != null && requestFrame != null) {
      // At rest until then: the animations, and the layer they promote, come
      // two frames later. Promoting now, a layer at rest for two frames, left
      // a stale paint of the element's rest in WebKit on iOS 26.2 (a title in
      // a scroller inside a clipped card) after the motion ended.
      // Each call waits its own two frames: one queued after another change
      // flushed the queue, or after an earlier call's first frame, still
      // waits its two.
      const call = { group, changed }
      deferredCalls.push(call)
      requestFrame(() => requestFrame(() => engine.flushDeferredThrough(call)))
      return
    }
    if (group == null && waitsForFrame) {
      engine.deferRebuild(changed, time)
      return
    }
    engine.startCall(group, changed, time)
  }

  /** Creates the animations of the given waiting calls, in call order. */
  engine.startDeferred = (
    calls: { group: StartGroup, changed: MotionProperty[] }[],
  ) => {
    for (const { group, changed } of calls) {
      // Not a channel that holds the curve of a later call still waiting: a
      // later presented call that took a property over starts that channel
      // with its own two frames. Every other property starts here, whatever
      // its segment's group: a value Reduce Motion writes at once, or lands
      // under a dip, has no curve of this call's.
      const own: MotionProperty[] = []
      let handedTo: StartGroup | null = null
      for (const property of changed) {
        const holder = CHANNELS[CHANNEL_OF[property]]
          .map(other => segments.get(other)?.group)
          .find(
            waiting =>
              waiting != null
              && waiting !== group
              && deferredCalls.some(call => call.group === waiting),
          )
        if (holder == null) {
          own.push(property)
          continue
        }
        // A curve of this call's in that channel never ran: the element held
        // it at its start. It starts with the later call, which creates the
        // channel, dated from that call's start, so the model reads what the
        // screen shows.
        const segment = segments.get(property)
        if (segment != null && segment.group === group) {
          segment.start += holder.provisional - group.provisional
          segment.group = holder
          holder.segments.push(segment)
          group.segments.splice(group.segments.indexOf(segment), 1)
          handedTo = holder
        }
      }
      if (own.length === 0 && handedTo != null) {
        // Everything this call still plays starts with the later call.
        const adopter = handedTo
        group.adoptedBy = adopter
        void adopter.started.then(start => engine.resolveGroup(group, start))
        continue
      }
      // From the call's own time: the curve starts at the browser's commit.
      engine.startCall(group, own, group.provisional)
    }
  }

  /** Creates the animations of every waiting call, in call order. */
  engine.flushDeferred = () => {
    engine.startDeferred(deferredCalls.splice(0))
  }

  /**
   * A call's second frame: it starts, with every call queued before it (in
   * call order), unless another change created it already.
   */
  engine.flushDeferredThrough = (call: {
    group: StartGroup
    changed: MotionProperty[]
  }) => {
    const index = deferredCalls.indexOf(call)
    if (index >= 0) {
      engine.startDeferred(deferredCalls.splice(0, index + 1))
    }
  }

  engine.startCall = (
    group: StartGroup | null,
    changed: MotionProperty[],
    time: number,
  ) => {
    engine.callGroup = group
    try {
      engine.commit(changed, time)
    }
    finally {
      engine.callGroup = null
    }
    if (group == null) {
      return
    }
    if (group.animations.length === 0) {
      engine.resolveGroup(group, group.provisional) // nothing to start
      return
    }
    pendingGroups.add(group)
    group.fresh = true
    // The task that creates the animations, not the call's: a presented
    // call's is its second frame's callback, wherever in its frame the call
    // was made.
    group.task = markTask(now(), now)
    // The call's `start: 'next-frame'` marks its task, so the calls made
    // before the task's first microtask move together. A call after it opens
    // a new mark.
    if (group.nextFrame === true) {
      group.task.nextFrame = true
    }
    group.madeInFrame = frameNesting.depth > 0
    queueMicrotask(() => {
      group.fresh = false
    })
    for (const animation of group.animations) {
      // A cancel before the first frame rejects each one's ready promise.
      (animation as Partial<Animation>).ready?.catch(() => {})
    }
    const ready = (group.animations[0] as Partial<Animation>).ready
    if (ready == null || typeof ready.then !== 'function') {
      engine.resolveGroup(group, group.provisional) // no pending start to wait for
      return
    }
    // The browser sets the start: at the frame that commits the animations,
    // or when its compositor starts them (Chromium). Read it in that first
    // frame, ahead of anything that might pause or seek the animations, and
    // when `ready` settles.
    requestFrame?.((frame) => {
      engine.syncGroup(group)
      group.framed = true
      // Chromium's compositor starts a composited animation when the frame
      // that commits it reaches it, and tells the page that start a frame or
      // more later (longer under load). Until then the call would read as
      // not started while the screen moves it, and a retarget or a rebase
      // would replay its curve from the start. A call made in a task, still
      // waiting in the first frame after it, starts when this frame runs. The
      // compositor takes that time as its start. All calls the frame commits
      // take one read of it (frameTime). That read is not the frame timestamp,
      // which after a block is the frame time from before the block. Only
      // when this frame is the one that commits it: not for a call made in a
      // frame callback, whose frame committed it already, nor when a block
      // ran between the call and this frame (more than LATE_START_MS), after
      // which this frame cannot tell a call made in a task from one a page's
      // own frame callback made; those keep the browser's start.
      if (group.resolved) {
        return
      }
      const at = frameTime(frame, now)
      if (
        group.madeInFrame !== true
        // A call made in an input event's own task says so with
        // `start: 'next-frame'`. This frame commits such a call however
        // late it comes. A later listener's block then holds the motion
        // back instead of skipping into it.
        && (group.task?.nextFrame === true
          || at - (group.task?.first ?? group.provisional) <= LATE_START_MS)
        && group.animations.some(
          animation =>
            animation.startTime == null && animation.playState === 'running',
        )
      ) {
        engine.resolveGroup(group, at)
      }
      // The browser's start is still unread. The compositor starts the call
      // near this frame, so each moving channel's reads take the curve from
      // now until the browser tells its start.
      if (!group.resolved) {
        for (const channel of group.channels) {
          const animation = running.get(channel)
          if (
            animation != null
            && group.animations.includes(animation)
            && animation.startTime == null
            && animation.playState === 'running'
          ) {
            (group.latest ??= new Map()).set(channel, at)
          }
        }
      }
    })
    ready.then(
      () => engine.syncGroup(group),
      () => engine.settleCancelled(group),
    )
  }
}
