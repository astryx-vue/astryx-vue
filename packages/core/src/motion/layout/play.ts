/**
 * @file play.ts
 * @position Internal to motion/layout; split from upstream motion/animatedLayout.ts
 */

import { sharedWeakMap } from '../../utils/sharedRealm'
import { LATE_START_MS } from '../frameBlock'
import { ours } from './glides'
import { presentGlide } from './presented'
import { settleAnimation } from './settle'

/**
 * Play `keyframes` on `element`. Every option here (linear easing over sampled
 * keyframes, replace composition) is one any Web Animations engine takes, so
 * a failure means no Web Animations at all: the change then lands at once.
 * `scale` is the element's ancestors' scale, for a `translate` glide.
 */
export function safeAnimate(
  element: Element,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
  change?: ChangeStart,
  scale: { readonly x: number, readonly y: number } = { x: 1, y: 1 },
): Animation | null {
  if (typeof (element as HTMLElement).animate !== 'function') {
    return null
  }
  let animation: Animation
  try {
    animation = (element as HTMLElement).animate(keyframes, options)
  }
  catch {
    return null
  }
  ours.add(animation)
  // The animation starts on the document timeline's current time, not on the
  // next frame. So a retargeted glide keeps moving through the frame it is
  // replaced in. After a block since that frame, Chromium's timeline still
  // reads the frame before the block. A motion started there would skip into
  // its curve, or past all of it. So it starts at the moment of the change
  // instead, and the block delays the motion (startFor). Every animation of
  // one change, in one document, shares that start.
  const doc = element.ownerDocument
  const now = doc.timeline?.currentTime
  if (now != null) {
    // The start of the change it is part of, captured when that change made
    // its first animation (changeStartOf); otherwise the document's.
    const start
      = change != null && change.frame === Number(now)
        ? change
        : startFor(doc, Number(now))
    start.last = clockOf(doc)
    animation.startTime = start.at
    if (start.at !== Number(now)) {
      // Started after the frame time the timeline still reads: until the
      // timeline gets there it shows its first keyframe, not the element at
      // rest.
      const fill = animation.effect?.getTiming().fill
      animation.effect?.updateTiming({
        fill: fill === 'forwards' || fill === 'both' ? 'both' : 'backwards',
      })
    }
  }
  const onResolve
    = options.pseudoElement == null
      ? presentGlide(element, animation, keyframes, options, scale)
      : undefined
  settleAnimation(element, animation, keyframes, options, onResolve)
  return animation
}

/**
 * The start a change's animations share. It is the timeline's frame time,
 * unless a block ran more than LATE_START_MS past that frame before the first
 * of them was made. Then they start at the moment the first of them is made.
 * The frame time is from before the block, so a motion started on it would
 * skip into its curve, or past all of it. Chromium holds the timeline at the
 * frame before a long task once anything in the task reads it.
 */
export interface ChangeStart {
  /** The frame time the timeline read. */
  readonly frame: number
  /** When the change's animations start. */
  readonly at: number
  /** When the last of them was made, on the document's clock. */
  last: number
}

/**
 * Each document's change start: an iframe or a Picture-in-Picture window
 * keeps its own clock, with its own origin and frames.
 */
const changeStarts = sharedWeakMap<Document, ChangeStart>(
  'motion/animated-layout/change-starts',
  1,
)

/** The clock of the document whose timeline a start is read on. */
function clockOf(doc: Document): number {
  return (doc.defaultView?.performance ?? performance).now()
}

/**
 * The start the current change's animations share. A change keeps one start
 * from its first animation through the flush of its glides and the parts that
 * ride them. That holds however long the work between them runs, such as the
 * rest of a commit or a slow swap. The start holds while the timeline reads
 * the same frame: through the task that made it and the microtasks after it.
 * A change that begins after a block takes a start of its own (beginChange).
 */
export function startFor(doc: Document, frame: number): ChangeStart {
  const now = clockOf(doc)
  const held = changeStarts.get(doc)
  if (held != null && held.frame === frame) {
    held.last = now
    return held
  }
  const start: ChangeStart = {
    frame,
    at: now - frame <= LATE_START_MS ? frame : now,
    last: now,
  }
  changeStarts.set(doc, start)
  // Let go in a later task: every microtask of this one, where the glides
  // flush and the parts riding them play, has run by then.
  const view = doc.defaultView;
  (view?.setTimeout ?? setTimeout)(() => {
    if (changeStarts.get(doc) === start) {
      changeStarts.delete(doc)
    }
  }, 0)
  return start
}

/**
 * A change begins as its "before" is read. After a block since the last
 * animation of the change before it, it takes a start of its own. So a change
 * made after a block that follows an earlier layout motion still plays.
 * Changes made together, with no block between them, share one start.
 */
export function beginChange(doc: Document): void {
  const held = changeStarts.get(doc)
  if (held != null && clockOf(doc) - held.last > LATE_START_MS) {
    changeStarts.delete(doc)
  }
}

/**
 * When the animations of the layout change being made start. Code that
 * follows the change on its own clock reads it, such as a rail's width or a
 * swap's fade. It is the document timeline's current time. After a block
 * since that frame, it is the moment the change made its first animation.
 * Until the timeline reaches it, the change has not started.
 */
export function layoutStartFor(document: Document): number {
  const now = document.timeline?.currentTime
  return now == null ? 0 : startFor(document, Number(now)).at
}
