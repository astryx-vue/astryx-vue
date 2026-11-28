/**
 * @file batch.ts
 * @position Internal to motion/layout; split from upstream motion/animatedLayout.ts
 */

import type { Glide, OffsetCurve } from './glides'
import type { ChangeStart } from './play'
import type { WalkCache } from './walk'
import { sharedMap } from '../../utils/sharedRealm'
import { intersects, originOf, ownScaleOf, scaleOf, visibleRect } from './geometry'
import { AT_REST, drawnCurve, glides, movedByApp } from './glides'
import { safeAnimate, startFor } from './play'
import { layoutMotion, MIN_SHIFT_PX, sampleOver } from './timing'
import { onGlideClock } from './walk'

interface Batch {
  readonly area: Element
  readonly changed: Set<Element>
  readonly before: Map<Element, DOMRect>
  /** What each changed element's walk found, so a dropped change moves none. */
  readonly candidates: Map<Element, Element[]>
  /** The changed elements' sizes before the change, added up. */
  changedSize: number
  /** How far past the visible part the walks reach (0 before the first). */
  reach: number
  /** The area's visible part, read once per frame. */
  visible: DOMRect | null
  /** Whether the area opts out of scroll anchoring, read once per frame. */
  walksToBand: boolean | null
  /** The change's ancestors among the candidates. */
  readonly ancestors: Set<Element>
  /** The siblings before the change among the candidates. */
  readonly befores: Set<Element>
  /**
   * Where the area's content sat before the change, read once per frame: the
   * area's place in view less its scroll offset, so a scroll of the area, an
   * outer scroller or the page shows up as a change of it.
   */
  originBefore: { readonly x: number, readonly y: number } | null
  readonly cache: WalkCache
  scheduled: boolean
  /** Called after every reading and before any glide starts. */
  readonly beforeMove: ((candidates: ReadonlyArray<Element>) => void)[]
  /**
   * The start the change's animations share, taken by its first one: its
   * entrance, or its glides at the flush. A change begun after a block,
   * before this one flushes, takes its own and leaves this one's.
   */
  start: ChangeStart | null
}

export const batches = sharedMap<Element, Batch>('motion/animated-layout/batches', 1)

export function batchFor(area: Element): Batch {
  let batch = batches.get(area)
  if (batch == null) {
    const created: Batch = {
      area,
      changed: new Set(),
      before: new Map(),
      candidates: new Map(),
      changedSize: 0,
      reach: 0,
      visible: null,
      walksToBand: null,
      ancestors: new Set(),
      befores: new Set(),
      originBefore: null,
      cache: { rects: new Map(), parts: new Map() },
      scheduled: false,
      beforeMove: [],
      start: null,
    }
    batches.set(area, created)
    // A measurement no commit claims by the next frame (a controlled owner
    // refused the change) is dropped, so it never moves rows later and holds
    // no elements.
    const view = area.ownerDocument.defaultView
    const drop = (): void => {
      if (batches.get(area) === created && !created.scheduled) {
        batches.delete(area)
      }
    }
    if (typeof view?.requestAnimationFrame === 'function') {
      view.requestAnimationFrame(drop)
    }
    else {
      setTimeout(drop, 16)
    }
    batch = created
  }
  return batch
}

/**
 * The start `batch`'s change shares: taken by its first animation, from the
 * document's (startFor), and kept with the batch through its flush.
 */
export function changeStartOf(batch: Batch): ChangeStart | undefined {
  const doc = batch.area.ownerDocument
  const now = doc.timeline?.currentTime
  if (now == null) {
    return undefined
  }
  if (batch.start == null || batch.start.frame !== Number(now)) {
    batch.start = startFor(doc, Number(now))
  }
  return batch.start
}

/**
 * The start of the change being made in `area`, captured now for animations
 * made later in the task, such as the parts riding a glide. It is its batch's
 * when one is open there, otherwise the document's.
 */
export function changeStartIn(
  area: Element | null | undefined,
  doc: Document,
): ChangeStart | undefined {
  const batch = area == null ? undefined : batches.get(area)
  if (batch != null) {
    return changeStartOf(batch)
  }
  const now = doc.timeline?.currentTime
  return now == null ? undefined : startFor(doc, Number(now))
}

export function flush(batch: Batch): void {
  batches.delete(batch.area)
  const notify = (candidates: ReadonlyArray<Element>): void => {
    for (const callback of batch.beforeMove) {
      callback(candidates)
    }
  }
  // What each change's walk measured before it: an element added by the
  // change has no old place, and one it removed is gone.
  const followers = new Set<Element>()
  for (const changed of batch.changed) {
    for (const element of batch.candidates.get(changed) ?? []) {
      if (element.isConnected) {
        followers.add(element)
      }
    }
  }
  if (followers.size === 0) {
    notify([])
    return
  }
  const motion = layoutMotion(batch.area)
  if (motion.kind === 'instant') {
    notify([])
    return
  }
  // The change's own start, taken by its entrance when it played one, even
  // when another change has begun since.
  const change = changeStartOf(batch)
  const visible = visibleRect(batch.area)
  // Every running glide stops first and every new place is read before any
  // glide starts, so no reading includes another's new motion.
  const entries: {
    readonly element: Element
    readonly before: DOMRect
    readonly carried: OffsetCurve
    readonly carriedMs: number
    /** The running glide's offset inside `before`, read on the held frame. */
    readonly held: { readonly x: number, readonly y: number }
    after?: DOMRect
    rawX?: number
    rawY?: number
    isMovedByApp?: boolean
    scale?: { x: number, y: number }
  }[] = []
  for (const element of followers) {
    const before = batch.before.get(element)
    if (before == null || (before.width === 0 && before.height === 0)) {
      // Added by the change, or not rendered before it: it has no old place.
      // A changed element an earlier change displaced does have one, and
      // moves with its row while it plays its own entrance or exit.
      continue
    }
    // An element already gliding keeps that motion and adds the new move: the
    // running glide stops (so its rectangle is its new layout place) and the
    // rest of its curve carries into the one new glide, velocity included,
    // summed with the new move.
    const running = glides.get(element)
    let carried = AT_REST
    let carriedMs = 0
    let held = AT_REST(0)
    if (running != null) {
      const time = Number(running.animation.currentTime)
      const elapsed = Number.isFinite(time) ? Math.max(0, time) : 0
      if (elapsed < running.durationMs) {
        held = running.offsetAt(elapsed)
      }
      // The new glide starts at the change's start. After a block, the
      // compositor kept this glide moving past the held frame until then.
      const { startTime } = running.animation
      const shownAt
        = change != null && startTime != null
          ? Math.max(elapsed, change.at - Number(startTime))
          : elapsed
      if (shownAt < running.durationMs) {
        carried = t => running.offsetAt(shownAt + t)
        carriedMs = running.durationMs - shownAt
      }
      running.animation.cancel()
      glides.delete(element)
    }
    entries.push({ element, before, carried, carriedMs, held })
  }
  // Every reading (places, transforms, scales) before any glide starts: a
  // glide started between two readings would make the next one lay the page
  // out again, once per element (on a long page, the whole cost).
  const byElement = new Map<Element, (typeof entries)[number]>()
  // An ancestor of the change, and a sibling before it, move by their layout
  // change alone: when scroll anchoring re-scrolls the area, an outer
  // scroller or the page (a change above the visible part), or the area
  // itself moves as its content grows (a dialog re-centered), their place in
  // view shifts by that while their place in the area stays.
  const origin = originOf(batch.area)
  const scrolledX = origin.x - (batch.originBefore?.x ?? origin.x)
  const scrolledY = origin.y - (batch.originBefore?.y ?? origin.y)
  // Netted only where that makes the move smaller: an element the browser
  // kept in place (scroll anchoring for another change in the same frame)
  // stays where it is.
  const nearer = (raw: number, shift: number): number =>
    Math.abs(raw + shift) < Math.abs(raw) ? raw + shift : raw
  for (const entry of entries) {
    // On the same clocks as the place before the change: only the glides this
    // change does not retarget still run here (a card inside an absolutely
    // positioned panel keeps its glide while the row in it moves), so each
    // reads the same in both places and cancels out of the move.
    entry.after = onGlideClock(
      entry.element,
      entry.element.getBoundingClientRect(),
      batch.area,
    )
    // The move is the inline-start edge's, by the container's direction (it
    // decides where the element sits): in a right-to-left container an
    // element that narrows keeps its left edge and moves its right one.
    const container = entry.element.parentElement ?? entry.element
    const isRtl
      = container.ownerDocument.defaultView?.getComputedStyle(container)
        .direction === 'rtl'
    const rawX = isRtl
      ? entry.before.right - entry.after.right
      : entry.before.left - entry.after.left
    const rawY = entry.before.top - entry.after.top
    // The siblings before the change stay with the ancestors around them.
    const isAncestor
      = batch.ancestors.has(entry.element) || batch.befores.has(entry.element)
    entry.rawX = isAncestor ? nearer(rawX, scrolledX) : rawX
    entry.rawY = isAncestor ? nearer(rawY, scrolledY) : rawY
    byElement.set(entry.element, entry)
  }
  for (const entry of entries) {
    const after = entry.after as DOMRect
    if (intersects(entry.before, visible) || intersects(after, visible)) {
      entry.isMovedByApp = movedByApp(entry.element)
      // Only its ancestors' scale is corrected: its own scale or transform
      // (a press's scale) does not apply to the glide's `translate`.
      entry.scale = scaleOf(entry.element, after, ownScaleOf(entry.element))
    }
  }
  // An adopter's own readings join them here, before any glide starts.
  notify(entries.map(entry => entry.element))
  for (const entry of entries) {
    const { element, before, carried, carriedMs, held } = entry
    const after = entry.after as DOMRect
    // Nested changes compose: an element inside another moving element moves
    // only by its own change, whatever order the changes were reported in.
    let dx = entry.rawX ?? 0
    let dy = entry.rawY ?? 0
    for (
      let ancestor = element.parentElement;
      ancestor != null && ancestor !== batch.area;
      ancestor = ancestor.parentElement
    ) {
      const moving = byElement.get(ancestor)
      if (moving != null) {
        dx -= moving.rawX ?? 0
        dy -= moving.rawY ?? 0
        break
      }
    }
    if (Math.abs(dx) < MIN_SHIFT_PX && Math.abs(dy) < MIN_SHIFT_PX) {
      continue
    }
    if (!intersects(before, visible) && !intersects(after, visible)) {
      // Outside the visible part before and after: it lands silently.
      continue
    }
    if (motion.kind === 'fade') {
      safeAnimate(
        element,
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: motion.durationMs, easing: motion.easing },
        change,
      )
      continue
    }
    if (entry.isMovedByApp === true) {
      // The app moves it itself: it takes its final place at once
      // (`spec:AST-105` Coverage).
      continue
    }
    // Where it showed before the change, against its new place, in its own
    // px. The part the glide's offset then does not cover is the new move.
    const scale = entry.scale ?? { x: 1, y: 1 }
    const moveX = dx / scale.x - held.x
    const moveY = dy / scale.y - held.y
    const { progress } = motion
    const durationMs = Math.max(progress.durationMs, carriedMs)
    const offsetAt = drawnCurve(durationMs, (t) => {
      const remaining = progress.remaining(t)
      const carry = carried(t)
      return { x: carry.x + moveX * remaining, y: carry.y + moveY * remaining }
    })
    // One replace-composited `translate`: the compositor runs it (INV12).
    const animation = safeAnimate(
      element,
      sampleOver(durationMs, (t) => {
        const offset = offsetAt(t)
        return { translate: `${offset.x}px ${offset.y}px` }
      }),
      { duration: durationMs, easing: 'linear' },
      change,
      scale,
    )
    if (animation != null) {
      const glide: Glide = {
        animation,
        offsetAt,
        durationMs,
        shownBefore: { x: dx / scale.x, y: dy / scale.y },
        scale,
      }
      glides.set(element, glide)
      animation.addEventListener?.('finish', () => {
        if (glides.get(element) === glide) {
          glides.delete(element)
        }
      })
    }
  }
}
