/**
 * @file exit.ts
 * @position Internal to motion/layout; split from upstream motion/animatedLayout.ts
 */

import type { LayoutEdge } from './edge'
import type { AnimatedLayout } from './handle'
import { sharedWeakMap } from '../../utils/sharedRealm'
import { batches, changeStartOf } from './batch'
import { extentOf, fractionClip, holdSlideClip, isRtl, previousInFlow, slideFrame, slidingParts } from './edge'
import { edgeMotions, heldSlides, rideEdge, shownAtStart, shownNow, stoppedShown, stopSlides, timelineNow, trackEdgeMotion } from './edgeRide'
import { intersects, scaleOf, visibleRect } from './geometry'
import { areaOf } from './handle'
import { safeAnimate } from './play'
import { slideParts } from './playChange'
import { layoutMotion, sampleKeyframes } from './timing'
import { takesPart } from './walk'

/** The inline properties an exit sets, so a release removes exactly them. */
const EXIT_PROPERTIES = [
  'margin-block-end',
  'margin-inline-end',
  'margin-block-start',
  'margin-inline-start',
  'pointer-events',
] as const

/**
 * The first element after `element` in the area that takes part in layout:
 * its next sibling, or its nearest ancestor's below the area. A wrapper's
 * edge is not used: a negative end margin can collapse through it.
 */
export function nextInFlow(element: Element, area: Element): Element | null {
  const view = element.ownerDocument.defaultView
  // The first box at or inside `from` (a `display: contents` element has
  // none of its own: its children stand in its place).
  const firstBox = (from: Element): Element | null => {
    const style = view?.getComputedStyle(from)
    if (style == null) {
      return from
    }
    if (style.display === 'contents') {
      for (
        let child = from.firstElementChild;
        child != null;
        child = child.nextElementSibling
      ) {
        const box = firstBox(child)
        if (box != null) {
          return box
        }
      }
      return null
    }
    return takesPart(from, style) ? from : null
  }
  let node: Element | null = element
  while (node != null && node !== area) {
    for (
      let sibling = node.nextElementSibling;
      sibling != null;
      sibling = sibling.nextElementSibling
    ) {
      const box = firstBox(sibling)
      if (box != null) {
        return box
      }
    }
    node = node.parentElement
  }
  return null
}

/**
 * An element's place: its block start, and its inline start (RTL read right
 * to left).
 */
export function placeOf(
  element: Element,
  rtl: boolean,
): { block: number, inline: number } {
  const rect = element.getBoundingClientRect()
  return { block: rect.top, inline: rtl ? -rect.right : rect.left }
}

/**
 * Keeps `element` where it is, in flow (so it scrolls and clips with its
 * container), while the content after it takes the place it takes once the
 * element is hidden: a negative end margin measured against that content,
 * so a gap or collapsing margins come out exact. Returns false, setting
 * nothing, when no margin reaches that place.
 */
function giveUpSpace(
  element: HTMLElement,
  area: Element,
  edge: LayoutEdge = 'block-end',
): boolean {
  const view = element.ownerDocument.defaultView
  const parent
    = element.parentElement == null
      ? undefined
      : view?.getComputedStyle(element.parentElement)
  const isRow
    = parent != null
      && parent.display.includes('flex')
      && parent.flexDirection.startsWith('row')
  const rtl = view?.getComputedStyle(element).direction === 'rtl'
  // The default block-end exit frees its space at its end, on the axis its
  // container lays it out on; an exit by another edge frees it on that
  // edge's side, so the element stays where it shows and the content beyond
  // that edge moves (FR9).
  const isStart = edge.endsWith('start')
  const property
    = edge === 'block-end'
      ? isRow
        ? 'margin-inline-end'
        : 'margin-block-end'
      : `margin-${edge}`
  const isInline = property.includes('inline')
  const size = isInline ? element.offsetWidth : element.offsetHeight
  const next = nextInFlow(element, area)
  if (next == null && !isStart) {
    // Nothing after it in the area to land anywhere.
    element.style.setProperty(property, `${-size}px`)
    return true
  }
  const own = element.style.getPropertyValue(property)
  const ownPriority = element.style.getPropertyPriority(property)
  const axis = isInline ? 'inline' : 'block'
  // The content after its container must land too: a flex-row item that
  // sets its row's height moves what follows the row.
  const afterParent
    = element.parentElement == null || element.parentElement === area
      ? null
      : nextInFlow(element.parentElement, area)
  // By a start edge, what lies before it lands too, and the element itself
  // stays where it shows.
  const before = isStart ? previousInFlow(element, area) : null
  const checked = [next, afterParent, before, isStart ? element : null].filter(
    (box): box is Element => box != null,
  )
  if (checked.length === 0) {
    return false
  }
  // The element's scale, read in the layout the caller's visibility check
  // already laid out.
  const scale = scaleOf(element, element.getBoundingClientRect())
  // Where the content after it goes once it is hidden, read with it taken
  // out of flow (not `display: none`, which would restart the CSS animations
  // inside it).
  const position = element.style.getPropertyValue('position')
  const positionPriority = element.style.getPropertyPriority('position')
  const shown = isStart ? placeOf(element, rtl) : null
  element.style.setProperty('position', 'absolute', 'important')
  const targets = checked.map(box =>
    box === element && shown != null ? shown : placeOf(box, rtl),
  )
  const target = targets[0]
  if (position === '') {
    element.style.removeProperty('position')
  }
  else {
    element.style.setProperty('position', position, positionPriority)
  }
  // The reading is in screen px, the margin in the element's own: under a
  // scaled ancestor a distance is divided by the scale on this axis.
  const perPx = isRow ? scale.x : scale.y
  // A first guess (its box), then one correction from the measured result:
  // a gap, a collapsed margin or the element's own margins.
  element.style.setProperty(property, `${-size}px`)
  const guess = placeOf(checked[0], rtl)[axis]
  const correction = (target[axis] - guess) / perPx
  element.style.setProperty(property, `${-size + correction}px`)
  // Everything checked must land on both axes: a flex-row item that sets
  // its row's height frees no block space with an inline margin.
  const missed = checked.some((box, index) => {
    const landed = placeOf(box, rtl)
    return (
      Math.abs(landed.block - targets[index].block) > 1
      || Math.abs(landed.inline - targets[index].inline) > 1
    )
  })
  if (missed) {
    if (own === '') {
      element.style.removeProperty(property)
    }
    else {
      element.style.setProperty(property, own, ownPriority)
    }
    return false
  }
  return true
}

/** Exits holding an element back, so a release can stop one. */
const exits = sharedWeakMap<Element, Animation | null>(
  'motion/animated-layout/exits',
  1,
)

/** What an exit replaced on its element, so a release puts back exactly it. */
interface Replaced {
  readonly inert: boolean
  readonly styles: ReadonlyArray<readonly [string, string, string]>
}
export const replaced = sharedWeakMap<Element, Replaced>(
  'motion/animated-layout/replaced',
  1,
)

/**
 * The changed element's exit (`spec:AST-105` FR4): content that disappears
 * keeps its place on screen but gives up its space (a negative end margin
 * measured against the layout without it, so the content after it glides up
 * at once to exactly where it ends, and it still scrolls and clips with its
 * container), is inert (no focus, no pointer, nothing read), conceals upward
 * from its bottom edge on the same motion, and then `done` runs, when the
 * component hides or unmounts it. Under Reduce Motion with a coarse primary pointer it
 * fades instead. Call it in the layout effect of the commit that closes the
 * element, after the change's `animate()` reported it measured, in the same
 * task: the glide reads the layout once the element has given up its space.
 *
 * It conceals to its block-end edge by default, or to the `edge` it is given
 * (`spec:AST-105` FR9), and its edge rides the glide of the content on that
 * side once it starts; a conceal that reverses a running reveal (a close
 * while it opens) starts from what the element shows.
 *
 * Returns false, holding nothing, when the exit lands at once: no handle, a
 * close no change in the area measured, outside the area or its visible part,
 * Reduce Motion with a fine pointer, or a layout no end margin can free (a
 * grid track and its gap, a flex-row item that sets its row's height); in
 * that last case the content after it takes its final place at once too.
 * The component then hides the element itself.
 */
export function holdLayoutExit(
  handle: AnimatedLayout | null | undefined,
  element: HTMLElement,
  done: () => void,
  { edge = 'block-end' }: { edge?: LayoutEdge } = {},
): boolean {
  if (handle == null) {
    return false
  }
  const area = areaOf(handle, element)
  if (
    area == null
    || !intersects(element.getBoundingClientRect(), visibleRect(area))
  ) {
    return false
  }
  // Only a measured close exits: the content after it glides into its place.
  const batch = batches.get(area)
  if (
    batch == null
    || ![...batch.changed].some(
      changed => changed === element || changed.contains(element),
    )
  ) {
    return false
  }
  const motion = layoutMotion(area)
  if (motion.kind === 'instant') {
    return false
  }
  releaseLayoutExit(element)
  const prior: Replaced = {
    inert: element.hasAttribute('inert'),
    styles: EXIT_PROPERTIES.map(
      property =>
        [
          property,
          element.style.getPropertyValue(property),
          element.style.getPropertyPriority(property),
        ] as const,
    ),
  }
  if (!giveUpSpace(element, area, edge)) {
    // A layout no end margin can free (a grid track and its gap, a flex-row
    // item that sets its row's height): it hides at once, and the content
    // after it takes its final place at once (`spec:AST-105` out of
    // coverage).
    for (const changed of [...batch.changed]) {
      if (changed === element || changed.contains(element)) {
        batch.changed.delete(changed)
      }
    }
    return false
  }
  replaced.set(element, prior)
  // Out of reach while it conceals: no focus, no pointer, nothing read.
  element.setAttribute('inert', '')
  element.style.setProperty('pointer-events', 'none')
  // A close while it opens: the reveal stops where it shows, and this starts
  // there.
  const from = shownAtStart(element, 1)
  const rtl = edge.startsWith('inline') && isRtl(element)
  // The start of the change it exits with, which its glides then share.
  const change = changeStartOf(batch)
  let animation: Animation | null
  if (motion.kind === 'fade') {
    animation = safeAnimate(
      element,
      [{ opacity: from }, { opacity: 0 }],
      { duration: motion.durationMs, easing: motion.easing, fill: 'forwards' },
      change,
    )
  }
  else {
    const { progress } = motion
    // As in a reveal, a block edge's parts slide out under its clip.
    const extent = edge.startsWith('block') ? extentOf(element, edge) : 0
    const sliding = slidingParts(element, edge, area, extent)
    const partMotions = slideParts(
      sliding,
      progress,
      change,
      remaining => slideFrame(edge, (1 - from * remaining) * extent),
      'forwards',
    )
    animation = safeAnimate(
      element,
      sampleKeyframes(progress, (remaining) => {
        const shown = from * remaining
        return partMotions.length > 0
          ? { opacity: shown }
          : { opacity: shown, clipPath: fractionClip(edge, 1 - shown, rtl) }
      }),
      { duration: progress.durationMs, easing: 'linear', fill: 'forwards' },
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
        t => from * progress.remaining(t),
        partMotions,
        partMotions.length > 0 && sliding != null
          ? holdSlideClip(element, sliding.clip)
          : undefined,
        true,
      )
      rideEdge(element, area, edge, rtl, tracked, true)
    }
  }
  exits.set(element, animation)
  if (animation == null) {
    // No Web Animations: nothing to wait for.
    done()
    return true
  }
  animation.addEventListener?.('finish', () => {
    if (exits.get(element) === animation) {
      done()
    }
  })
  return true
}

/**
 * Puts an element `holdLayoutExit` held back: stops its exit and puts back
 * what the exit replaced (its `inert` and inline values as they were). Called
 * once the component has hidden the element, or when the element opens again
 * mid-exit.
 */
export function releaseLayoutExit(element: HTMLElement): void {
  if (!exits.has(element)) {
    return
  }
  // What the exit showed as it stopped: a reveal in the same frame (opened
  // again mid-exit) starts there.
  const running = edgeMotions.get(element)
  if (running != null) {
    edgeMotions.delete(element)
    stoppedShown.set(element, {
      fraction: shownNow(running),
      at: timelineNow(element),
    })
    stopSlides(running)
  }
  const held = heldSlides.get(element)
  heldSlides.delete(element)
  if (held != null) {
    stopSlides(held)
  }
  exits.get(element)?.cancel()
  exits.delete(element)
  const prior = replaced.get(element)
  replaced.delete(element)
  if (prior?.inert !== true) {
    element.removeAttribute('inert')
  }
  for (const [property, value, priority] of prior?.styles ?? []) {
    if (value === '') {
      element.style.removeProperty(property)
    }
    else {
      element.style.setProperty(property, value, priority)
    }
  }
}
