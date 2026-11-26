/**
 * @file playChange.ts
 * @position Internal to motion/layout; split from upstream motion/animatedLayout.ts
 */

import type { LayoutEdge, Sliding } from './edge'
import type { Glide } from './glides'
import type { AnimatedLayout } from './handle'
import type { ChangeStart } from './play'
import type { GlideProgress } from './timing'
import { sharedWeakMap } from '../../utils/sharedRealm'
import { batches, changeStartOf } from './batch'
import { extentOf, fractionClip, holdSlideClip, isRtl, slideFrame, slidingParts } from './edge'
import { rideEdge, shownAtStart, trackEdgeMotion } from './edgeRide'
import { intersects, visibleRect } from './geometry'
import { glides, numbersIn } from './glides'
import { areaOf } from './handle'
import { safeAnimate } from './play'
import { layoutMotion, sampleKeyframes } from './timing'

/** Each part's slide, by its motion: a stopped slide is no glide. */
const slideTargets = sharedWeakMap<Animation, Element>(
  'motion/animated-layout/slide-targets',
  1,
)

/**
 * The changed element's own animation, on the same motion as the content
 * after it (`spec:AST-105` FR4): content that appears reveals from its
 * block-end edge downward, or from the `edge` it is given (FR9), and its edge
 * rides the glide of the content on that side once it starts. A reveal that
 * reverses a running conceal (an adopter opens it again mid-exit, after
 * `releaseLayoutExit`) starts from what the element shows. Plays only with a
 * handle, inside its area and in the area's visible part. Returns the
 * entrance it started, or null when it played none.
 */
export function playLayoutChange(
  handle: AnimatedLayout | null | undefined,
  element: Element,
  { edge = 'block-end' }: { edge?: LayoutEdge } = {},
): Animation | null {
  if (handle == null) {
    return null
  }
  const area = areaOf(handle, element)
  if (area == null) {
    return null
  }
  if (!intersects(element.getBoundingClientRect(), visibleRect(area))) {
    return null
  }
  const motion = layoutMotion(area)
  if (motion.kind === 'instant') {
    return null
  }
  const from = shownAtStart(element, 0)
  // The start of the change it enters with, which its glides then share.
  const batch = batches.get(area)
  const change
    = batch != null
      && [...batch.changed].some(
        changed => changed === element || changed.contains(element),
      )
      ? changeStartOf(batch)
      : undefined
  if (motion.kind === 'fade') {
    return safeAnimate(
      element,
      [{ opacity: from }, { opacity: 1 }],
      { duration: motion.durationMs, easing: motion.easing },
      change,
    )
  }
  const { progress } = motion
  const rtl = edge.startsWith('inline') && isRtl(element)
  // A block edge's parts slide in under the element's clip, on the frames the
  // content after them glides on. A clip that moved would be painted on its
  // own clock in WebKit, and the edge would part from that content.
  const extent = edge.startsWith('block') ? extentOf(element, edge) : 0
  const sliding = slidingParts(element, edge, area, extent)
  const partMotions = slideParts(sliding, progress, change, remaining =>
    slideFrame(edge, (1 - from) * remaining * extent))
  const animation = safeAnimate(
    element,
    sampleKeyframes(progress, (remaining) => {
      const hidden = (1 - from) * remaining
      return partMotions.length > 0
        ? { opacity: 1 - hidden }
        : { opacity: 1 - hidden, clipPath: fractionClip(edge, hidden, rtl) }
    }),
    { duration: progress.durationMs, easing: 'linear' },
    change,
  )
  if (animation == null) {
    for (const part of partMotions) {
      part.cancel()
    }
  }
  else {
    const tracked = trackEdgeMotion(
      element,
      animation,
      t => 1 - (1 - from) * progress.remaining(t),
      partMotions,
      partMotions.length > 0 && sliding != null
        ? holdSlideClip(element, sliding.clip)
        : undefined,
    )
    rideEdge(element, area, edge, rtl, tracked, false)
  }
  return animation
}

/**
 * Plays each part's slide on the change's start, sampled like the glide.
 * `frame` turns the share of the motion still to come into a keyframe.
 */
export function slideParts(
  sliding: Sliding | null,
  progress: GlideProgress,
  change: ChangeStart | undefined,
  frame: (remaining: number) => Keyframe,
  fill?: FillMode,
): Animation[] {
  const motions: Animation[] = []
  for (const [index, part] of (sliding?.parts ?? []).entries()) {
    const motion = safeAnimate(
      part,
      sampleKeyframes(progress, frame),
      { duration: progress.durationMs, easing: 'linear', fill },
      change,
    )
    if (motion != null) {
      motions.push(motion)
      // A slide is the part's glide. A later change in the area then carries
      // its rest into the part's next glide, as it carries any glide.
      const glide: Glide = {
        animation: motion,
        offsetAt: t => drawnOffset(motion, t),
        // A ride retimes the slide, so its length is read off the slide.
        get durationMs() {
          return liveDuration(motion, progress.durationMs)
        },
        // The part showed at its place when the parts were read.
        shownBefore: { x: 0, y: 0 },
        scale: sliding?.scales[index] ?? { x: 1, y: 1 },
      }
      glides.set(part, glide)
      slideTargets.set(motion, part)
      // An exit's slide then holds its end until the release. The element is
      // inert and has given up its space by then.
      motion.addEventListener?.('finish', () => {
        if (glides.get(part) === glide) {
          glides.delete(part)
        }
      })
    }
  }
  return motions
}

/**
 * The offset `animation` draws `t` ms in, read off its keyframes, a straight
 * line between each two. A slide that rides another glide reads that glide's
 * frames, so this follows it.
 */
function drawnOffset(
  animation: Animation,
  t: number,
): { readonly x: number, readonly y: number } {
  const effect = animation.effect as KeyframeEffect | null
  if (effect == null || typeof effect.getKeyframes !== 'function') {
    return { x: 0, y: 0 }
  }
  const frames = effect.getKeyframes()
  const duration = Number(effect.getTiming().duration)
  const at = duration > 0 ? Math.min(1, Math.max(0, t / duration)) : 1
  const offsetOf = (frame: ComputedKeyframe | undefined): { x: number, y: number, offset: number } => {
    const [x = 0, y = 0] = numbersIn(String(frame?.translate ?? ''))
    return { x, y, offset: frame?.computedOffset ?? 0 }
  }
  let from = offsetOf(frames[0])
  let to = offsetOf(frames[frames.length - 1])
  for (const frame of frames) {
    const point = offsetOf(frame)
    if (point.offset <= at) {
      from = point
    }
    if (point.offset >= at) {
      to = point
      break
    }
  }
  const span = to.offset - from.offset
  const k = span > 0 ? (at - from.offset) / span : 0
  return { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k }
}

/** How many ms before `animation` started `glide` started: 0 in one change. */
export function startedBefore(glide: Glide, animation: Animation): number {
  const shift = Number(animation.startTime) - Number(glide.animation.startTime)
  return Number.isFinite(shift) ? Math.max(0, shift) : 0
}

/** `animation`'s length now, in ms, or `fallback` if it has none. */
function liveDuration(animation: Animation, fallback: number): number {
  const effect = animation.effect as KeyframeEffect | null
  const duration = Number(effect?.getTiming?.().duration)
  return duration > 0 ? duration : fallback
}

/** Cancels a part's slide, and forgets it as the part's glide. */
export function stopGlideOf(animation: Animation): void {
  const part = slideTargets.get(animation)
  if (part != null && glides.get(part)?.animation === animation) {
    glides.delete(part)
  }
  animation.cancel()
}
