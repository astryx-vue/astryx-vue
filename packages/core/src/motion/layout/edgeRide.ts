/**
 * @file edgeRide.ts
 * @position Internal to motion/layout; split from upstream motion/animatedLayout.ts
 */

import type { LayoutEdge } from './edge'
import { sharedWeakMap } from '../../utils/sharedRealm'
import { extentOf, glideMoving, previousInFlow, pxClip, slideFrame } from './edge'
import { nextInFlow } from './exit'
import { startedBefore, stopGlideOf } from './playChange'
import { retimeSettle } from './settle'
import { sampleOver } from './timing'

/** Each exit's motion, whose parts hold their slides until its release. */
export const heldSlides = sharedWeakMap<Element, EdgeMotion>(
  'motion/animated-layout/held-slides',
  1,
)

/** A one-state reveal or conceal running on an element. */
interface EdgeMotion {
  readonly animation: Animation
  /** The fraction of the element it shows `t` ms in (1: all of it). */
  shownAt: (t: number) => number
  /** The parts that slide under the element's clip, and their motions. */
  readonly slides: ReadonlyArray<Animation>
  /** Puts back what the motion set on the element, once. */
  readonly release: () => void
}

/** Each element's running one-state reveal or conceal. */
export const edgeMotions = sharedWeakMap<Element, EdgeMotion>(
  'motion/animated-layout/edge-motions',
  1,
)

/**
 * What a one-state motion an adopter stopped (`releaseLayoutExit`) showed,
 * and the timeline time it stopped at: a reveal started in the same frame,
 * the reversal that stopped it, starts there.
 */
export const stoppedShown = sharedWeakMap<
  Element,
  { readonly fraction: number, readonly at: number }
>('motion/animated-layout/stopped-shown', 1)

export function timelineNow(element: Element): number {
  return Number(element.ownerDocument.timeline?.currentTime ?? Number.NaN)
}

/** What `motion` shows now, by its animation's own clock. */
export function shownNow(motion: EdgeMotion): number {
  const time = Number(motion.animation.currentTime)
  return motion.shownAt(Number.isFinite(time) ? Math.max(0, time) : 0)
}

/**
 * What `element` shows as a reveal or conceal starts: where the one-state
 * motion this one reverses had got to (it stops there), or `atRest`, all of
 * it for a conceal and nothing for a reveal.
 */
export function shownAtStart(element: Element, atRest: number): number {
  const running = edgeMotions.get(element)
  if (running != null) {
    edgeMotions.delete(element)
    const fraction = shownNow(running)
    running.animation.cancel()
    stopSlides(running)
    return fraction
  }
  const stopped = stoppedShown.get(element)
  stoppedShown.delete(element)
  if (stopped != null && stopped.at === timelineNow(element)) {
    return stopped.fraction
  }
  return atRest
}

/** Stops `motion`'s sliding parts and puts back the element's clip, once. */
export function stopSlides(motion: EdgeMotion): void {
  motion.release()
}

/** Records `animation` as `element`'s running one-state motion. */
export function trackEdgeMotion(
  element: Element,
  animation: Animation,
  shownAt: (t: number) => number,
  slides: ReadonlyArray<Animation> = [],
  release: () => void = () => {},
  isHeldToRelease = false,
): EdgeMotion {
  let isReleased = false
  const motion: EdgeMotion = {
    animation,
    shownAt,
    slides,
    release: () => {
      if (!isReleased) {
        isReleased = true
        for (const slide of slides) {
          stopGlideOf(slide)
        }
        release()
      }
    },
  }
  edgeMotions.set(element, motion)
  if (isHeldToRelease) {
    heldSlides.set(element, motion)
  }
  // A reveal's parts have landed at its end. An exit's parts hold where they
  // end until `releaseLayoutExit`.
  animation.addEventListener?.('finish', () => {
    if (edgeMotions.get(element) === motion) {
      edgeMotions.delete(element)
      if (!isHeldToRelease) {
        motion.release()
      }
    }
  })
  return motion
}

/**
 * After this commit's glides start (the batch flushes in a microtask queued
 * before this one), before the frame paints: once the content on `edge`'s
 * side glides, the moving edge rides that glide, frame by frame, so the two
 * never part, a reversal included (the glide carries its running motion).
 * `hiddenAt` turns that content's offset towards the edge's side into the
 * length the element hides; `frame` turns that length into a keyframe.
 * Without that glide (nothing on that side in the area, or nothing that
 * moves) the motion keeps its own curve. The animation is kept, its frames
 * replaced; `onRide` hears the ridden hidden length over time.
 */
export function rideNeighbour(
  element: Element,
  area: Element,
  edge: LayoutEdge,
  rtl: boolean,
  animation: Animation,
  isCurrent: () => boolean,
  hiddenAt: (towards: number) => number,
  frame: (hidden: number) => Keyframe,
  onRide: (hidden: (t: number) => number, durationMs: number) => void,
): void {
  const effect = animation.effect as KeyframeEffect | null
  if (effect == null || typeof effect.setKeyframes !== 'function') {
    return
  }
  queueMicrotask(() => {
    if (!isCurrent()) {
      return
    }
    const isEnd = edge.endsWith('end')
    const neighbour = isEnd
      ? nextInFlow(element, area)
      : previousInFlow(element, area)
    const glide
      = neighbour == null ? null : glideMoving(neighbour, element, area)
    if (neighbour == null || glide == null) {
      return
    }
    // A glide that moves the element itself in the same batch, short of what
    // it shares with the neighbour (an item above them closing): the edge
    // rides the neighbour's offset from the element, not from the page.
    const own = glideMoving(element, neighbour, area)
    // Each glide is read on its own clock. A glide an earlier change started,
    // such as a part's slide, is already some way in.
    const glideAt = startedBefore(glide, animation)
    const ownAt = own == null ? 0 : startedBefore(own, animation)
    const durationMs = Math.max(
      glide.durationMs - glideAt,
      own == null ? 0 : own.durationMs - ownAt,
    )
    // The neighbour's offset from its place relative to the element's,
    // towards the edge's side.
    const sign = isEnd ? 1 : -1
    const hidden = (t: number): number => {
      const offset = glide.offsetAt(glideAt + t)
      const moved = own?.offsetAt(ownAt + t) ?? { x: 0, y: 0 }
      return hiddenAt(
        sign
        * (edge.startsWith('inline')
          ? (rtl ? -1 : 1) * (offset.x - moved.x)
          : offset.y - moved.y),
      )
    }
    const frames = sampleOver(durationMs, t => frame(hidden(t)))
    effect.setKeyframes(frames)
    effect.updateTiming?.({ duration: durationMs })
    retimeSettle(animation, frames, durationMs)
    onRide(hidden, durationMs)
  })
}

/**
 * The one-state reveal or conceal rides the content on its edge's side: the
 * element shows what lies between its fixed edge and that content, a reveal
 * less by however far the content still is from its place towards it, a
 * conceal all of it less however far the content has come, fading with what
 * it hides.
 */
export function rideEdge(
  element: Element,
  area: Element,
  edge: LayoutEdge,
  rtl: boolean,
  motion: EdgeMotion,
  isConceal: boolean,
): void {
  const extent = extentOf(element, edge)
  if (!(extent > 0)) {
    return
  }
  rideNeighbour(
    element,
    area,
    edge,
    rtl,
    motion.animation,
    () => edgeMotions.get(element) === motion,
    towards =>
      Math.min(extent, Math.max(0, isConceal ? extent - towards : -towards)),
    hidden =>
      motion.slides.length > 0
        ? { opacity: 1 - hidden / extent }
        : { opacity: 1 - hidden / extent, clipPath: pxClip(edge, hidden, rtl) },
    (hiddenAt, durationMs) => {
      motion.shownAt = t => 1 - hiddenAt(t) / extent
      // The parts ride the same frames, so their edge and the content's move
      // on one clock.
      for (const slide of motion.slides) {
        const effect = slide.effect as KeyframeEffect | null
        const frames = sampleOver(durationMs, t =>
          slideFrame(edge, hiddenAt(t)))
        effect?.setKeyframes?.(frames)
        effect?.updateTiming?.({ duration: durationMs })
        retimeSettle(slide, frames, durationMs)
      }
    },
  )
}
