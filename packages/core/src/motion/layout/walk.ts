/**
 * @file walk.ts
 * @position Internal to motion/layout; split from upstream motion/animatedLayout.ts
 */

import type { Glide } from './glides'
import { ownScaleOf, scaleOf } from './geometry'
import { glides, numbersIn } from './glides'

/**
 * Whether `element` takes part: in flow, rendered, not in the top layer.
 * `display: contents` is handled by the caller.
 */
export function takesPart(element: Element, style: CSSStyleDeclaration): boolean {
  if (
    style.display === 'none'
    || style.visibility === 'hidden'
    || style.position === 'absolute'
    || style.position === 'fixed'
  ) {
    return false
  }
  try {
    if (element.matches(':popover-open, :modal')) {
      return false
    }
  }
  catch {
    // An engine without these pseudo-classes has no top layer to skip.
  }
  return true
}

/**
 * The band of the page a change can move content into or out of view: the
 * area's visible part, extended above and below by one viewport or by the
 * size of every element changing in the frame, whichever is larger (a
 * collapse pulls content up by at most its size, and changes in one frame
 * add up). Content outside it before the change stays outside it, so the
 * walk stops there.
 */
interface Band {
  /** Its top edge, in client px. */
  readonly start: number
  /** Its bottom edge, in client px. */
  readonly end: number
}

export function bandFor(visible: DOMRect, reach: number): Band {
  return { start: visible.top - reach, end: visible.bottom + reach }
}

/**
 * What one frame's walks read, kept so a level two changes share, or a walk
 * repeated when the band grows, reads each element once.
 */
export interface WalkCache {
  readonly rects: Map<Element, DOMRect>
  /** Whether the element takes part, or `contents` for a boxless element. */
  readonly parts: Map<Element, boolean | 'contents'>
}

function partOf(element: Element, cache: WalkCache): boolean | 'contents' {
  let part = cache.parts.get(element)
  if (part === undefined) {
    const style = element.ownerDocument.defaultView?.getComputedStyle(element)
    part
      = style == null
        ? false
        : style.display === 'contents'
          ? 'contents'
          : takesPart(element, style)
    cache.parts.set(element, part)
  }
  return part
}

/**
 * Whether a container lays its children out across the block direction, so
 * DOM order does not run down the page: multi-column, a wrapping column flex
 * box, or a grid that flows by column. The band says nothing about where its
 * later children sit, so a walk there runs through the level.
 */
function flowsAcross(container: Element | null): boolean {
  if (container == null) {
    return false
  }
  const style
    = container.ownerDocument.defaultView?.getComputedStyle(container)
  if (style == null) {
    return false
  }
  const count = style.getPropertyValue('column-count')
  const width = style.getPropertyValue('column-width')
  return (
    (count !== '' && count !== 'auto')
    || (width !== '' && width !== 'auto')
    || (style.display.includes('flex')
      && style.flexDirection.startsWith('column')
      && style.flexWrap.startsWith('wrap'))
    || (style.display.includes('grid')
      && style.getPropertyValue('grid-auto-flow').startsWith('column'))
  )
}

/**
 * The box a sticky element sticks to: its nearest scrolling ancestor's, or
 * the viewport.
 */
function scrollportOf(element: Element): { start: number, end: number } {
  const view = element.ownerDocument.defaultView
  for (
    let node = element.parentElement;
    node != null && node !== element.ownerDocument.documentElement;
    node = node.parentElement
  ) {
    const overflow = view?.getComputedStyle(node).overflowY ?? 'visible'
    if (
      node === element.ownerDocument.body
      && view?.getComputedStyle(element.ownerDocument.documentElement)
        .overflowY === 'visible'
    ) {
      // The body's overflow applies to the viewport while the root's is
      // visible: the body is no scroller of its own.
      continue
    }
    if (overflow !== 'visible' && overflow !== 'clip') {
      const box = node.getBoundingClientRect()
      return {
        start: box.top + node.clientTop,
        end: box.top + node.clientTop + node.clientHeight,
      }
    }
  }
  return { start: 0, end: view?.innerHeight ?? 0 }
}

/**
 * Whether a sticky element is stuck: resting against its scrollport's edge
 * at its inset. A stuck element takes its final place; an unstuck one is in
 * flow.
 */
function isStuck(element: Element, cache: WalkCache): boolean {
  const style = element.ownerDocument.defaultView?.getComputedStyle(element)
  if (style?.position !== 'sticky') {
    return false
  }
  const rect = rectOf(element, cache)
  const edge = scrollportOf(element)
  const top = Number.parseFloat(style.top)
  const bottom = Number.parseFloat(style.bottom)
  return (
    (Number.isFinite(top) && Math.abs(rect.top - (edge.start + top)) < 1)
    || (Number.isFinite(bottom) && Math.abs(rect.bottom - (edge.end - bottom)) < 1)
  )
}

/**
 * `rect`, a box read before a change or after it (in the flush, once the
 * glides the change retargets have stopped), with every running glide that
 * carries the element put back on its glide's own clock: its own and those of
 * its ancestors inside `area`. A glide the change retargets is read on its
 * clock before the change and is gone after it; one the change leaves running
 * (a card inside an absolutely positioned panel, which the change takes no
 * ancestors from) is read on the same clock in both places, so it cancels out
 * of the move. A box read samples a running `translate`
 * wherever the engine evaluates it, and WebKit evaluates it at the moment of
 * the read, while a glide's offset, and the glide a change retargets it into,
 * run on the timeline's frame time: from the box alone, a change made `n` ms
 * into a frame started the new glide `n` ms of motion ahead of the one drawn
 * (up to about 3 px on a slow frame), and a row inside a gliding card took up
 * the card's difference. The box is read between two readings of every
 * carrier's applied `translate` that agree: WebKit samples a running
 * animation at the moment of each read, in steps of about a millisecond, so
 * a box read between two equal readings is of that same sample, while the
 * walk's earlier box read, or one read across a step, is of another. Taken
 * out of that
 * box (each scaled by its node's ancestors, as its glide is), the `translate`s
 * leave the element's place with no glide, and each glide's offset at its
 * current time goes back in. A glide replaces any `translate` of the app's
 * own while it runs, so each applied value is the glide's alone. Where the
 * engine reports no applied `translate` at all (an environment without
 * individual transform properties), the box is taken as it is.
 */
/**
 * How many times `onGlideClock` reads a box and the applied translates around
 * it to take all of them from one sample: it bounds the reads for one
 * consistent snapshot (WebKit's samples step about once a millisecond, and a
 * second reading lands inside one step), not a retry around a result.
 */
const SAMPLE_READS = 3

export function onGlideClock(element: Element, rect: DOMRect, area: Element): DOMRect {
  const carriers: { node: Element, glide: Glide, time: number }[] = []
  for (
    let node: Element | null = element;
    node != null && node !== area;
    node = node.parentElement
  ) {
    const glide = glides.get(node)
    const time = Number(glide?.animation.currentTime)
    if (glide != null && Number.isFinite(time)) {
      carriers.push({ node, glide, time })
    }
  }
  if (carriers.length === 0) {
    return rect
  }
  const view = element.ownerDocument.defaultView
  const appliedNow = (): (string | undefined)[] =>
    carriers.map(({ node }) => view?.getComputedStyle(node).translate)
  let applied = appliedNow()
  if (applied.some(translate => translate == null || translate === '')) {
    return rect
  }
  let box = element.getBoundingClientRect()
  for (let read = 0; read < SAMPLE_READS; read++) {
    const again = appliedNow()
    if (again.every((translate, index) => translate === applied[index])) {
      break
    }
    applied = again
    box = element.getBoundingClientRect()
  }
  let dx = 0
  let dy = 0
  carriers.forEach(({ node, glide, time }, index) => {
    const [appliedX = 0, appliedY = 0] = numbersIn(applied[index] as string)
    const offset = glide.offsetAt(
      Math.min(Math.max(0, time), glide.durationMs),
    )
    const scale = scaleOf(
      node,
      node === element ? box : node.getBoundingClientRect(),
      ownScaleOf(node),
    )
    dx += (offset.x - appliedX) * scale.x
    dy += (offset.y - appliedY) * scale.y
  })
  return new DOMRect(box.x + dx, box.y + dy, box.width, box.height)
}

export function rectOf(element: Element, cache: WalkCache): DOMRect {
  let rect = cache.rects.get(element)
  if (rect === undefined) {
    rect = element.getBoundingClientRect()
    cache.rects.set(element, rect)
  }
  return rect
}

/**
 * The elements a change can move, each with its rectangle before the change:
 * the changed element's ancestors up to the area (a centered column moves
 * the card around the change), and at each of their levels the siblings
 * after and before (a centered, end-aligned or space-between row, or
 * `order`, moves those too). A `display: contents` element has no box: its
 * children stand in its place, walked in the same direction. At each level
 * the walk stops at the first sibling outside `band`, so its cost grows with
 * depth plus the siblings near the visible part, never with the length of a
 * list; where the area opts out of scroll anchoring (`walksToBand`), the walk
 * after a change above the band goes on to the band, a cost that grows with
 * that distance. Inside a positioned, stuck sticky or top-layer ancestor only the
 * content after the change is taken.
 */
export function collectCandidates(
  changed: Element,
  area: Element,
  band: Band,
  cache: WalkCache,
  walksToBand: boolean,
  ancestors: Set<Element>,
  befores: Set<Element>,
): Map<Element, DOMRect> {
  const out = new Map<Element, DOMRect>()
  /** Takes `element`; returns false once it lies outside the band. */
  /** The current level runs through its siblings, ignoring the band. */
  let runsThrough = false
  const take = (element: Element, isAfter: boolean): boolean => {
    const part = partOf(element, cache)
    if (part === 'contents') {
      for (
        let child = isAfter
          ? element.firstElementChild
          : element.lastElementChild;
        child != null;
        child = isAfter
          ? child.nextElementSibling
          : child.previousElementSibling
      ) {
        if (!take(child, isAfter)) {
          return false
        }
      }
      return true
    }
    if (!part) {
      return true
    }
    const rect = rectOf(element, cache)
    if (runsThrough) {
      out.set(element, rect)
      return true
    }
    if (rect.top > band.end) {
      return false
    }
    if (rect.bottom < band.start) {
      // Above the band. Where the scroller opts out of scroll anchoring, the
      // content after a change above the band shifts the rows in view, so
      // the walk after it goes on to the band; with anchoring, it stops.
      return isAfter && walksToBand
    }
    out.set(element, rect)
    if (!isAfter) {
      befores.add(element)
    }
    return true
  }
  // The change's chain up to the area, and from where it is inside a
  // positioned, stuck sticky or top-layer ancestor: that ancestor takes its final
  // place, so inside it only the content after the change moves; the
  // ancestors and the siblings before the change stay with it.
  const chain: Element[] = []
  for (
    let node: Element | null = changed;
    node != null && node !== area;
    node = node.parentElement
  ) {
    chain.push(node)
  }
  // The levels below this index are inside a positioned ancestor.
  let positionedFrom = 0
  for (let index = chain.length - 1; index > 0; index -= 1) {
    if (partOf(chain[index], cache) === false || isStuck(chain[index], cache)) {
      positionedFrom = index
      break
    }
  }
  for (const [level, node] of chain.entries()) {
    runsThrough = flowsAcross(node.parentElement)
    if (
      node !== changed
      && level > positionedFrom
      && partOf(node, cache) === true
    ) {
      // An ancestor of the change in flow: where its layout moves it (a
      // centered column), it glides, and what is inside moves only by its own
      // change. A positioned, stuck sticky or top-layer ancestor, and every
      // ancestor inside it, takes its final place.
      out.set(node, rectOf(node, cache))
      ancestors.add(node)
    }
    for (
      let sibling = node.nextElementSibling;
      sibling != null && take(sibling, true);
      sibling = sibling.nextElementSibling
    ) {
      // The siblings after it, until one lies past the band.
    }
    if (level < positionedFrom) {
      continue
    }
    for (
      let sibling = node.previousElementSibling;
      sibling != null && take(sibling, false);
      sibling = sibling.previousElementSibling
    ) {
      // The siblings before it, until one lies before the band.
    }
  }
  return out
}
