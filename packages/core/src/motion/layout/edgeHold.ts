/**
 * @file edgeHold.ts
 * @position Internal to motion/layout; split from upstream motion/animatedLayout.ts
 */

import type { LayoutEdge } from './edge'
import type { AnimatedLayout } from './handle'
import type { LayoutRide, LayoutSwap } from './swap'
import { changeStartIn } from './batch'
import { isRtl, pxClip } from './edge'
import { shownBoxAt } from './glides'
import { areaOf } from './handle'
import { beginChange, layoutStartFor } from './play'
import { holdLayoutSwap, playLayoutFrames, playLayoutSwap } from './swap'
import { layoutMotion } from './timing'

/**
 * An element's old state, held before a change commits for FR9's two-state
 * edge reveal.
 */
export interface LayoutEdgeHold {
  readonly element: HTMLElement
  /** Where it showed, in viewport coordinates. */
  readonly rect: DOMRect
  /**
   * Its size along the edge's axis as it shows: what a running reveal shows
   * mid-motion, or its box.
   */
  readonly extent: number
  /** Its old state as one transient copy, or null when it cannot be held. */
  readonly swap: LayoutSwap | null
}

/** A playing two-state edge reveal. */
export interface LayoutEdgeMotion {
  /** Ends it at once (a new change, an unmount). */
  end: () => void
  /**
   * What it shows now: its extent along the edge's axis and the motion's
   * progress (0 → 1), or null once it has settled.
   */
  shown: () => { readonly extent: number, readonly progress: number } | null
}

/** What the caller adds to a two-state edge reveal: only its own fades. */
export interface LayoutEdgeParts {
  /** The old state's copy's opacity over the progress (1 when absent). */
  readonly copyOpacity?: (p: number) => number
  /** Its text's opacity, on its own curve, when that differs from the copy's. */
  readonly copyText?: (p: number) => number
  /** Parts the page renders, playing with the reveal (the new state's text). */
  readonly incoming?: ReadonlyArray<{
    readonly element: Element
    readonly frames: (p: number) => Keyframe
  }>
}

const SETTLED: LayoutEdgeMotion = { end: () => {}, shown: () => null }

/**
 * Before a change commits: hold `element`'s old state for FR9's two-state edge
 * reveal, its box and the extent it shows along `edge`'s axis (`shown`, from a
 * running reveal, or its box), and its old state as one transient copy (null
 * when it cannot be copied, or under an immediate change). Returns null
 * without the element or without Web Animations.
 */
export function holdLayoutEdge(
  handle: AnimatedLayout | null | undefined,
  element: HTMLElement | null,
  {
    edge = 'block-end',
    shown = null,
  }: { edge?: LayoutEdge, shown?: number | null } = {},
): LayoutEdgeHold | null {
  if (element == null || typeof element.animate !== 'function') {
    return null
  }
  beginChange(element.ownerDocument)
  const rect = element.getBoundingClientRect()
  return {
    element,
    rect,
    extent: shown ?? (edge.startsWith('inline') ? rect.width : rect.height),
    swap: holdLayoutSwap(handle, element),
  }
}

/**
 * After the change commits, before paint: FR9's two-state edge reveal, on
 * FR4's one motion. The state that is larger along `edge`'s axis is clipped
 * on that edge, from the extent the element showed to the new one: a conceal
 * covers the old state, held as the swap's copy, with the element raised
 * above it; a reveal opens the element, under the old state. With
 * `rideWith`, an element the glide moves after that edge (a rail's content
 * column), the edge rides its glide, frame by frame, so the two never part,
 * also when this reverses a running reveal; without it the edge follows the
 * motion's curve. `parts` gives the caller's own fades, told whether the edge
 * conceals and the element as it is now. Under Reduce Motion it follows
 * `design:reduced-motion`: opacity only under a coarse primary pointer (DR2),
 * an immediate change otherwise (DR3). `current` is the element after the
 * commit, when it remounted.
 */
export function playLayoutEdge(
  hold: LayoutEdgeHold,
  current: HTMLElement | null,
  handle: AnimatedLayout,
  {
    edge = 'block-end',
    rideWith = null,
    parts,
  }: {
    edge?: LayoutEdge
    rideWith?: Element | null
    parts?: (isConceal: boolean, element: HTMLElement) => LayoutEdgeParts
  } = {},
): LayoutEdgeMotion {
  const { rect: before, swap, extent: from } = hold
  const element = current?.isConnected === true ? current : hold.element
  if (!element.isConnected) {
    return SETTLED
  }
  const motion = layoutMotion(element)
  const next = element.getBoundingClientRect()
  const isInline = edge.startsWith('inline')
  const extentOfBox = (box: DOMRect): number => (isInline ? box.width : box.height)
  const to = extentOfBox(next)
  if (motion.kind === 'instant' || Math.abs(to - from) < 0.5) {
    return SETTLED
  }
  const isConceal = to < from
  const isEnd = edge.endsWith('end')
  const rtl = isInline && isRtl(element)
  // The row that holds the element and the ridden element, or its parent.
  const host
    = rideWith?.parentElement != null && rideWith.parentElement.contains(element)
      ? rideWith.parentElement
      : element.parentElement
  // Riding needs the swap: its frames carry the ridden element's travel.
  // Without one (old state that cannot be copied) the edge follows the
  // motion's curve.
  const rides
    = host != null
      && rideWith != null
      && rideWith.parentElement === host
      && swap != null
  // The ridden element's travel so far, towards the edge's side.
  const sign = isEnd ? 1 : -1
  const towards = (ride: LayoutRide): number =>
    sign * (isInline ? (rtl ? -ride.x : ride.x) : ride.y)
  const extentAt = (p: number, ride: LayoutRide): number =>
    rides ? from + towards(ride) : from + (to - from) * p
  const clip = (hidden: number): string => pxClip(edge, hidden, rtl)
  const now = (): number => Number(element.ownerDocument.timeline?.currentTime ?? 0)
  // The start this change's animations share, which after a block is later
  // than the frame time the timeline still reads (startFor).
  const startedAt
    = changeStartIn(areaOf(handle, element), element.ownerDocument)?.at ?? 0
  const durationMs
    = motion.kind === 'glide' ? motion.progress.durationMs : motion.durationMs
  const progressAt = (ms: number): number =>
    motion.kind === 'glide'
      ? 1 - motion.progress.remaining(Math.min(ms, durationMs))
      : 0
  const shown = (): { extent: number, progress: number } | null => {
    const elapsed = Math.max(0, now() - startedAt)
    if (elapsed >= durationMs) {
      return null
    }
    // The fades are read at the change's start, where the glide it retargets
    // carries on. The extent stays on the timeline's frame, the frame a ride
    // is measured from.
    const progress = progressAt(
      Math.max(elapsed, layoutStartFor(element.ownerDocument) - startedAt),
    )
    let extent = from + (to - from) * progressAt(elapsed)
    if (rides && rideWith != null) {
      // The edge is the ridden element's: read it where it shows, on the
      // timeline's clock.
      const ridden = shownBoxAt(rideWith, now())
      const own = element.getBoundingClientRect()
      extent = !isInline
        ? isEnd
          ? ridden.top - own.top
          : own.bottom - ridden.bottom
        : isEnd !== rtl
          ? ridden.left - own.left
          : own.right - ridden.right
    }
    return { extent, progress }
  }
  // The ride, when the ridden element does not glide: its whole travel at
  // once, physical (its old place less its new).
  const travel = sign * (from - to)
  const rideSpec
    = rides && rideWith != null
      ? {
          element: rideWith,
          travel: isInline
            ? { x: rtl ? -travel : travel, y: 0 }
            : { x: 0, y: travel },
          isCopyMoved: false,
        }
      : undefined
  // The copy keeps the element's fixed edge (the one opposite `edge`) where
  // the element is now, so it meets the element wherever it sits.
  const fixedAtStart = isEnd !== (isInline && rtl)
  const at = new DOMRect(
    isInline && !fixedAtStart ? next.right - before.width : next.left,
    !isInline && !isEnd ? next.bottom - before.height : next.top,
    before.width,
    before.height,
  )
  const own = parts?.(isConceal, element) ?? {}
  const copyOpacity = own.copyOpacity ?? (() => 1)

  if (isConceal) {
    // A conceal covers the old state, held by the swap, from the extent it
    // shows down to the new one; the element, raised above it, shows through.
    if (swap == null || host == null) {
      return SETTLED
    }
    let raised: HTMLElement | null = element
    while (raised != null && raised.parentElement !== host) {
      raised = raised.parentElement
    }
    const restore = raised == null ? null : { position: raised.style.position }
    // The copy paints at the element's own level: just before it in the
    // host, with no z-index, so page content stacks against the pair as it
    // does against the element alone. The element, positioned, paints above
    // the copy by tree order.
    if (raised != null && getComputedStyle(raised).position === 'static') {
      raised.style.position = 'relative'
    }
    const end = playLayoutSwap(
      { ...swap, rect: at },
      {
        host,
        isOpaque: true,
        copyBefore: raised ?? undefined,
        copy: (p, ride) => ({
          clipPath: clip(extentOfBox(before) - extentAt(p, ride)),
          opacity: copyOpacity(p),
        }),
        copyText: own.copyText,
        rideWith: rideSpec,
        onEnd: () => {
          if (raised != null && restore != null) {
            raised.style.position = restore.position
          }
        },
        incoming: own.incoming ?? [],
      },
    )
    return { end, shown }
  }

  // A reveal opens the element from the extent it showed, under the old
  // state held by the same swap.
  const incoming = [
    {
      element,
      frames: (p: number, ride: LayoutRide) => ({
        clipPath: clip(to - extentAt(p, ride)),
      }),
    },
    ...(own.incoming ?? []),
  ]
  const end
    = swap != null && host != null
      ? playLayoutSwap(
          { ...swap, rect: at },
          {
            host,
            isOpaque: true,
            copy: p => ({ opacity: copyOpacity(p) }),
            copyText: own.copyText,
            rideWith: rideSpec,
            incoming,
          },
        )
      : playLayoutFrames(handle, incoming)
  return { end, shown }
}
