/**
 * @file taskClock.ts
 * The page-wide clocks every animator shares: the open task, frame and
 * call times, batched stylesheet reads, commit waits and per-task bakes.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { SheetRead, TaskBakes, TaskMark } from './engineTypes'
import { LATE_START_MS } from '../frameBlock'
import { quietFinished } from '../quietFinished'

/** The task the current calls from rest are made in, until it ends. */
let openTask: TaskMark | null = null

/** How many of the animators' animation-frame callbacks are running now. */
export const frameNesting = { depth: 0 }

/** The mark of the running task, opened by its first call from rest. */
export function markTask(time: number, clock: () => number): TaskMark {
  if (openTask == null) {
    const task: TaskMark = { first: time }
    openTask = task
    queueMicrotask(() => {
      task.ended = clock()
      openTask = null
    })
  }
  return openTask
}

/** The first read of the time an animation frame runs, by its timestamp. */
let frameRead: { readonly frame: number, readonly time: number } | null = null

/** The first motion call on a clock since the last microtask checkpoint. */
let openCall: { readonly time: number, readonly clock: () => number } | null
  = null

/**
 * The time of a motion call with no explicit clock. It is the time of the
 * first such call on the same clock since the last microtask checkpoint. One
 * event listener or frame callback thus shares one clock. So calls on
 * several animators in one callback, such as a pager's children, line up, as
 * calls from rest share one start. A call more than LATE_START_MS after the
 * first opens a new clock: the curves that a block passed restart at their
 * frame instead.
 */
export function callTime(clock: () => number): number {
  const time = clock()
  if (
    openCall != null
    && openCall.clock === clock
    && time - openCall.time <= LATE_START_MS
  ) {
    return openCall.time
  }
  const call = { time, clock }
  openCall = call
  queueMicrotask(() => {
    if (openCall === call) {
      openCall = null
    }
  })
  return time
}

/**
 * Promotions that wait for their stylesheet's will-change, from every
 * animator, until the running callback's microtasks run.
 */
export const sheetReads: SheetRead[] = []

/**
 * Queues an element's stylesheet read for a microtask after the callback.
 * That microtask lifts every queued promotion, reads every stylesheet, and
 * then writes every promotion back. So motions that one callback starts force
 * one style pass, not one per element.
 */
export function queueSheetRead(read: SheetRead): void {
  if (sheetReads.length === 0) {
    queueMicrotask(flushSheetReads)
  }
  sheetReads.push(read)
}

export function flushSheetReads(): void {
  const reads = sheetReads.splice(0)
  for (const read of reads) {
    read.lift()
  }
  for (const read of reads) {
    read.read()
  }
  for (const read of reads) {
    read.write()
  }
}

/**
 * Per animator, the first of its calls that still wait for the frame that
 * commits them. An animator removes its entry once nothing of its waits: a
 * rebuild or a hidden page committed its calls, or it was disposed or moved.
 * The frame's first read takes every entry.
 */
export const waitingCalls = new Map<object, number>()

/** The first waiting call, read once by the frame with this timestamp. */
let waitingRead: { readonly frame: number, readonly first: number } | null = null

/**
 * The first call that the animation frame with timestamp `frame` commits.
 * The frame reads it once, so every animator in it judges a late commit from
 * the same call. `own` is the first of the reading animator's calls.
 */
export function firstCommitted(frame: number | undefined, own: number): number {
  if (frame != null && waitingRead?.frame === frame) {
    return Math.min(waitingRead.first, own)
  }
  const first = Math.min(own, ...waitingCalls.values())
  // The frame commits every call that waits now. An animator whose look
  // never runs, such as one on another frame source, counts once at most.
  waitingCalls.clear()
  if (frame != null) {
    const read = { frame, first }
    waitingRead = read
    // A browser runs every callback of a frame before its next task.
    setTimeout(() => {
      if (waitingRead === read) {
        waitingRead = null
      }
    }, 0)
  }
  return first
}

/**
 * The time the animation frame with timestamp `frame` runs, read once in
 * that frame. Every animator's callback in the frame takes that read, so the
 * calls from rest that one frame commits start together. A long callback
 * before them does not move their start. A call on a moving element keeps
 * its own clock. The read ends with the frame's task, so a frame
 * source that repeats a timestamp still reads each frame anew. A frame
 * source with no timestamp reads the clock.
 */
export function frameTime(frame: number | undefined, clock: () => number): number {
  if (frame == null) {
    return clock()
  }
  if (frameRead?.frame === frame) {
    return frameRead.time
  }
  const read = { frame, time: clock() }
  frameRead = read
  // A browser runs every callback of a frame before its next task.
  setTimeout(() => {
    if (frameRead === read) {
      frameRead = null
    }
  }, 0)
  return read.time
}

let taskBakes: TaskBakes | null = null

export function bakesOfTask(): TaskBakes {
  if (taskBakes == null) {
    const bakes: TaskBakes = { times: [], keyframes: [] }
    taskBakes = bakes
    queueMicrotask(() => {
      if (taskBakes === bakes) {
        taskBakes = null
      }
    })
  }
  return taskBakes
}

export function isSameKey(a: unknown[], b: unknown[]): boolean {
  return a.length === b.length && a.every((value, i) => Object.is(value, b[i]))
}

/** Whether the engine can copy an effect with its parsed keyframes. */
export function isCopyable(effect: AnimationEffect | null): effect is KeyframeEffect {
  return (
    typeof KeyframeEffect === 'function'
    && typeof Animation === 'function'
    && effect instanceof KeyframeEffect
  )
}

/**
 * Plays a copy of `effect` on `element`, as `element.animate` would play the
 * same keyframes and timing, without parsing them again.
 */
export function copyAnimation(effect: KeyframeEffect, element: Element): Animation {
  const copy = new KeyframeEffect(effect)
  copy.target = element
  const animation = new Animation(copy, element.ownerDocument.timeline)
  animation.play()
  return quietFinished(animation)
}
