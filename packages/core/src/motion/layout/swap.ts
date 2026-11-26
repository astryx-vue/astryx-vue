/**
 * @file swap.ts
 * @position Internal to motion/layout; split from upstream motion/animatedLayout.ts
 */

import type { AnimatedLayout } from './handle'
import { paintedBackground } from '../inertClone'
import { inertCopy, isCopyable, placeOver, visiblePartCopy, wrapText } from '../transientCopy'
import { changeStartIn } from './batch'
import { glides } from './glides'
import { areaOf, readArea } from './handle'
import { beginChange, safeAnimate } from './play'
import { layoutMotion, sampleKeyframes, sampleOver } from './timing'

/**
 * Old content held as one transient copy while new content enters in its
 * place (`spec:AST-105` FR8): inert, hidden from assistive technology, and
 * removed when the swap ends (`architecture:component-style-authoring` INV7).
 */
export interface LayoutSwap {
  readonly area: Element
  readonly copy: HTMLElement
  /** Where the old content showed, in viewport coordinates. */
  readonly rect: DOMRect
}

/** How far a ridden element has moved since the swap began. */
export interface LayoutRide {
  readonly x: number
  readonly y: number
}

/**
 * How a swap plays, as frames over its progress (0 → 1) and, with
 * `rideWith`, the ridden element's travel so far.
 */
export interface LayoutSwapMotion {
  /** The box the copy is laid out in, over the old content's place. */
  readonly host: Element
  /** The copy's frames while it travels. */
  readonly copy: (p: number, ride: LayoutRide) => Keyframe
  /** Its text's opacity, on its own curve, when that differs from the copy's. */
  readonly copyText?: (p: number) => number
  /**
   * The copy paints in the background it shows, above its neighbours: at
   * `z-index: 1` as the host's last child, or at `copyBefore`'s level.
   */
  readonly isOpaque?: boolean
  /**
   * Place the copy just before this child of the host, at that child's
   * level in the paint order, with no `z-index` of its own. Without it the
   * opaque copy is the host's last child at `z-index: 1`.
   */
  readonly copyBefore?: Element
  /**
   * An element the glide moves, such as the column the old content sat in.
   * Every part plays over its glide, frame by frame, and is told how far it
   * has moved; the copy rides it unless `isCopyMoved` is false. Without a
   * glide (it lands silently) the ride is the whole `travel` at once (its
   * old place less its new).
   */
  readonly rideWith?: {
    readonly element: Element
    readonly travel: LayoutRide
    readonly isCopyMoved?: boolean
  }
  /** Called once when the swap ends, however it ends. */
  readonly onEnd?: () => void
  /** Elements the page already renders, entering with the swap. */
  readonly incoming: ReadonlyArray<{
    readonly element: Element
    readonly frames: (p: number, ride: LayoutRide) => Keyframe
  }>
}

const NO_RIDE: LayoutRide = { x: 0, y: 0 }

/**
 * Before a change commits: hold `element`'s old content as one transient copy
 * (`spec:AST-105` FR8). With `isVisiblePart`, the copy is the element's
 * visible part, its content scrolled as it was (a scroll container). Returns
 * null without a handle, outside its area, under an immediate change, or for
 * content too large to copy.
 */
export function holdLayoutSwap(
  handle: AnimatedLayout | null | undefined,
  element: HTMLElement,
  { isVisiblePart = false }: { isVisiblePart?: boolean } = {},
): LayoutSwap | null {
  if (handle == null || typeof element.animate !== 'function') {
    return null
  }
  const area = areaOf(handle, element)
  if (
    area == null
    || layoutMotion(area).kind === 'instant'
    || !isCopyable(element)
  ) {
    return null
  }
  beginChange(element.ownerDocument)
  const box = element.getBoundingClientRect()
  if (!isVisiblePart) {
    const copy = inertCopy(element)
    return copy == null ? null : { area, copy, rect: box }
  }
  const part = visiblePartCopy(element)
  return part == null ? null : { area, ...part }
}

/**
 * After the change commits, before paint: the copy leaves while the incoming
 * elements enter, on FR4's one motion, every part started on the same
 * timeline time. Under Reduce Motion with a coarse pointer, only opacity
 * changes (`design:reduced-motion` DR2). Returns what ends the swap at once;
 * it also ends when its motion does, and the copy is removed.
 */
export function playLayoutSwap(
  swap: LayoutSwap,
  how: LayoutSwapMotion,
): () => void {
  const motion = layoutMotion(swap.area)
  if (motion.kind === 'instant') {
    return () => {}
  }
  const { copy } = swap
  // Captured now: the parts riding a glide play a microtask later, on the
  // start of the change they are part of.
  const change = changeStartIn(swap.area, copy.ownerDocument)
  placeOver(copy, how.host, swap.rect, how.copyBefore ?? null)
  if (how.isOpaque === true) {
    if (how.copyBefore == null) {
      copy.style.zIndex = '1'
    }
    copy.style.backgroundColor = paintedBackground(copy)
  }
  const animations: Animation[] = []
  let isDone = false
  const end = (): void => {
    if (isDone) {
      return
    }
    isDone = true
    animations.forEach(animation => animation.cancel())
    copy.remove()
    how.onEnd?.()
  }
  const { copyText, rideWith } = how
  const fadedText
    = copyText != null && motion.kind === 'glide' ? wrapText(copy) : []
  // Each part as a function of time: its frame, or the copy's with its ride.
  const parts: [Element, (p: number, ride: LayoutRide) => Keyframe][] = []
  if (motion.kind === 'glide') {
    const moves = rideWith != null && rideWith.isCopyMoved !== false
    parts.push([
      copy,
      (p, ride) => ({
        ...how.copy(p, ride),
        ...(moves ? { translate: `${ride.x}px ${ride.y}px` } : null),
      }),
    ])
    for (const span of fadedText) {
      parts.push([span, p => ({ opacity: copyText?.(p) ?? 1 })])
    }
    for (const { element, frames } of how.incoming) {
      parts.push([element, frames])
    }
  }
  else {
    // Reduce Motion with a coarse pointer: only opacity changes.
    parts.push([copy, p => ({ opacity: 1 - p })])
    for (const { element } of how.incoming) {
      parts.push([element, p => ({ opacity: p })])
    }
  }
  const playAll = (
    durationMs: number,
    progressAt: (t: number) => number,
    rideAt: (t: number) => LayoutRide,
    options: KeyframeAnimationOptions,
    sample: (shape: (t: number) => Keyframe) => Keyframe[],
  ): void => {
    for (const [element, shape] of parts) {
      const animation = safeAnimate(
        element,
        sample(t => shape(progressAt(t), rideAt(t))),
        { duration: durationMs, fill: 'both', ...options },
        change,
      )
      if (animation != null) {
        animations.push(animation)
      }
    }
    if (animations.length === 0) {
      end()
    }
    else {
      // Every part runs on one clock, so the first to finish ends them all.
      animations[0].addEventListener?.('finish', end)
    }
  }
  if (motion.kind === 'fade') {
    playAll(
      motion.durationMs,
      t => (t <= 0 ? 0 : 1),
      () => NO_RIDE,
      { easing: motion.easing },
      shape => [shape(0), shape(motion.durationMs)],
    )
    return end
  }
  const { progress } = motion
  const progressAt = (t: number): number => 1 - progress.remaining(t)
  if (rideWith == null) {
    playAll(
      progress.durationMs,
      progressAt,
      () => NO_RIDE,
      { easing: 'linear' },
      shape => sampleOver(progress.durationMs, shape),
    )
    return end
  }
  // After this commit's glides start (the batch flushes in a microtask queued
  // before this one), before the frame paints: every part plays over the
  // ridden element's glide, told how far it has moved from where it showed.
  queueMicrotask(() => {
    if (isDone) {
      return
    }
    const glide = glides.get(rideWith.element)
    const durationMs = glide?.durationMs ?? progress.durationMs
    const rideAt = (t: number): LayoutRide => {
      if (glide == null) {
        return { x: -rideWith.travel.x, y: -rideWith.travel.y }
      }
      // The parts were read where the ridden element showed then. After a
      // block it has moved on by the glide's start, so they move with it.
      const now = glide.offsetAt(t)
      const start = glide.shownBefore
      return { x: now.x - start.x, y: now.y - start.y }
    }
    playAll(durationMs, progressAt, rideAt, { easing: 'linear' }, shape =>
      sampleOver(durationMs, shape))
  })
  return end
}

/**
 * After a change commits, before paint: elements the page already renders
 * play frames over the change's progress on FR4's one motion, with no copy,
 * such as a surface reaching over a gap a glide opens. Under Reduce Motion
 * with a coarse pointer, only opacity changes; under an immediate change,
 * nothing plays. Returns what ends them at once.
 */
export function playLayoutFrames(
  handle: AnimatedLayout | null | undefined,
  parts: LayoutSwapMotion['incoming'],
): () => void {
  const area = handle == null ? null : readArea(handle)
  const motion = area == null ? null : layoutMotion(area)
  if (area == null || motion == null || motion.kind === 'instant') {
    return () => {}
  }
  const change = changeStartIn(area, area.ownerDocument)
  const animations: Animation[] = []
  for (const { element, frames: shape } of parts) {
    const animation
      = motion.kind === 'glide'
        ? safeAnimate(
            element,
            sampleKeyframes(motion.progress, remaining =>
              shape(1 - remaining, NO_RIDE)),
            {
              duration: motion.progress.durationMs,
              easing: 'linear',
              fill: 'both',
            },
            change,
          )
        : safeAnimate(
            element,
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: motion.durationMs, easing: motion.easing },
            change,
          )
    if (animation != null) {
      animations.push(animation)
    }
  }
  // Held through the motion, then released: every part shares one clock, so
  // the first to finish ends them all and each element shows its own styles.
  const end = (): void => animations.forEach(animation => animation.cancel())
  animations[0]?.addEventListener?.('finish', end)
  return end
}
