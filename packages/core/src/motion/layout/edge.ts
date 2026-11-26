/**
 * @file edge.ts
 * @position Internal to motion/layout; split from upstream motion/animatedLayout.ts
 */

import type { Glide } from './glides'
import { ownScaleOf, scaleOf, visibleRect } from './geometry'
import { glides } from './glides'
import { round } from './timing'
import { bandFor, takesPart } from './walk'

/**
 * The edge an element reveals from or conceals to (`spec:AST-105` FR9): its
 * block-end edge by default, or its block-start, inline-start or inline-end
 * edge, such as a panel collapsing beside content. An inline edge follows
 * the element's direction.
 */
export type LayoutEdge
  = 'block-end' | 'block-start' | 'inline-start' | 'inline-end'

/** Whether `element` lays its inline axis out right to left. */
export function isRtl(element: Element): boolean {
  return (
    element.ownerDocument.defaultView?.getComputedStyle(element).direction
    === 'rtl'
  )
}

/**
 * The `clip-path` that hides `side` of an element from `edge`: `inset()`'s
 * sides are physical (top, right, bottom, left), so an inline edge is
 * mirrored right to left. `zero` is how the other three are written.
 */
function edgeClip(
  edge: LayoutEdge,
  side: string,
  zero: string,
  rtl: boolean,
): string {
  const sides = [zero, zero, zero, zero]
  const index
    = edge === 'block-start'
      ? 0
      : edge === 'block-end'
        ? 2
        : (edge === 'inline-end') !== rtl
            ? 1
            : 3
  sides[index] = side
  return `inset(${sides.join(' ')})`
}

/** A hidden fraction of the element, as a percentage clip on `edge`. */
export function fractionClip(edge: LayoutEdge, hidden: number, rtl: boolean): string {
  return edgeClip(edge, `${round(hidden * 100)}%`, '0', rtl)
}

/** A hidden length of the element, in its own px, as a clip on `edge`. */
export function pxClip(edge: LayoutEdge, hidden: number, rtl: boolean): string {
  return edgeClip(edge, `${hidden}px`, '0px', rtl)
}

/**
 * The element's size along `edge`'s axis, in its own px (a scaled ancestor
 * divided out), read from the layout the caller already laid out.
 */
export function extentOf(element: Element, edge: LayoutEdge): number {
  const rect = element.getBoundingClientRect()
  const scale = scaleOf(element, rect)
  return edge.startsWith('inline')
    ? rect.width / scale.x
    : rect.height / scale.y
}

/** The parts that slide, and the still clip that holds them while they do. */
export interface Sliding {
  readonly parts: ReadonlyArray<Element>
  /** Each part's ancestors' scale: page px per px of its own offset. */
  readonly scales: ReadonlyArray<{ readonly x: number, readonly y: number }>
  readonly clip: string
}

/**
 * The parts that slide inside an element revealed or concealed from a block
 * edge by `extent` px. They are its child elements that the band can show:
 * the area's visible part plus one viewport, or `extent` if larger, above and
 * below. A part past the band cannot come into view while it moves, so it
 * stays. The walk stops at the first child below the band, so its cost grows
 * with the changed size, never with the length of a list. A translation
 * cannot move text on its own, so an element with text of its own keeps the
 * clip (null).
 */
export function slidingParts(
  element: Element,
  edge: LayoutEdge,
  area: Element,
  extent: number,
): Sliding | null {
  if (!edge.startsWith('block') || !(extent > 0)) {
    return null
  }
  const view = element.ownerDocument.defaultView
  const style = view?.getComputedStyle(element)
  // A box the element paints itself would show whole from the first frame
  // under a still clip, so such an element keeps the moving clip. So does one
  // with a generated box, which stays still while its parts slide.
  if (
    view == null
    || style == null
    || paintsOwnBox(style)
    || ['::before', '::after'].some((pseudo) => {
      const { content } = view.getComputedStyle(element, pseudo)
      return content !== '' && content !== 'none' && content !== 'normal'
    })
  ) {
    return null
  }
  const visible = visibleRect(area)
  const band = bandFor(visible, Math.max(view.innerHeight, extent))
  const parts: Element[] = []
  const scales: { x: number, y: number }[] = []
  for (let node = element.firstChild; node != null; node = node.nextSibling) {
    if (node.nodeType === Node.TEXT_NODE) {
      if ((node.textContent ?? '').trim() !== '') {
        return null
      }
      continue
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      continue
    }
    // A translation moves neither an inline box nor a boxless one.
    const { display } = view.getComputedStyle(node as Element)
    if (display === 'inline' || display === 'contents') {
      return null
    }
    // Each part's place, read once per reveal, before anything moves.
    const box = (node as Element).getBoundingClientRect()
    if (box.top > band.end) {
      break
    }
    if (box.bottom >= band.start) {
      // A part an earlier change still glides keeps that glide, which a slide
      // would hide and then show again. The element keeps the moving clip.
      if (glides.has(node as Element)) {
        return null
      }
      parts.push(node as Element)
      scales.push(scaleOf(node as Element, box, ownScaleOf(node as Element)))
    }
  }
  if (parts.length === 0) {
    return null
  }
  // The parts come in from one side. The clip holds them inside the content
  // box there, off what the content before the element draws into its padding.
  const inner = (side: 'top' | 'bottom'): number =>
    (Number.parseFloat(style.getPropertyValue(`border-${side}-width`)) || 0)
    + (Number.parseFloat(style.getPropertyValue(`padding-${side}`)) || 0)
  return {
    parts,
    scales,
    clip:
      edge === 'block-end'
        ? `inset(${inner('top')}px 0px 0px 0px)`
        : `inset(0px 0px ${inner('bottom')}px 0px)`,
  }
}

/**
 * Whether a style paints a box of its own: a fill, a border, a shadow, an
 * outline or a filter.
 */
function paintsOwnBox(style: CSSStyleDeclaration): boolean {
  const isClear = (color: string): boolean =>
    color === '' || color === 'transparent' || /^rgba\(.*,\s*0\)$/.test(color)
  return (
    !isClear(style.backgroundColor)
    || (style.backgroundImage !== '' && style.backgroundImage !== 'none')
    || ['Top', 'Right', 'Bottom', 'Left'].some(
      side =>
        style.getPropertyValue(`border-${side.toLowerCase()}-style`)
        !== 'none'
        && Number.parseFloat(
          style.getPropertyValue(`border-${side.toLowerCase()}-width`),
        ) > 0,
    )
    || (style.boxShadow !== '' && style.boxShadow !== 'none')
    || (style.borderImageSource !== '' && style.borderImageSource !== 'none')
    || (style.filter !== '' && style.filter !== 'none')
    || (style.outlineStyle !== ''
      && style.outlineStyle !== 'none'
      && Number.parseFloat(style.outlineWidth) > 0)
  )
}

/**
 * Where the parts sit when the element hides `hidden` px from `edge`. They
 * move that far towards it, so their far edge meets the content that rides
 * the same edge.
 */
export function slideFrame(edge: LayoutEdge, hidden: number): Keyframe {
  return { translate: `0px ${edge === 'block-end' ? -hidden : hidden}px` }
}

/**
 * Clips `element` with `clip` while its parts slide, and returns what puts
 * its own `clip-path` back. The clip does not move, so it stays in step with
 * the parts and the content beside them on every engine.
 */
export function holdSlideClip(element: Element, clip: string): () => void {
  const { style } = element as HTMLElement
  const value = style.getPropertyValue('clip-path')
  const priority = style.getPropertyPriority('clip-path')
  style.setProperty('clip-path', clip)
  return () => {
    if (value === '') {
      style.removeProperty('clip-path')
    }
    else {
      style.setProperty('clip-path', value, priority)
    }
  }
}

/**
 * The last element before `element` in the area that takes part in layout:
 * its previous sibling, or its nearest ancestor's below the area (the mirror
 * of `nextInFlow`, for a start edge).
 */
export function previousInFlow(element: Element, area: Element): Element | null {
  const view = element.ownerDocument.defaultView
  const lastBox = (from: Element): Element | null => {
    const style = view?.getComputedStyle(from)
    if (style == null) {
      return from
    }
    if (style.display === 'contents') {
      for (
        let child = from.lastElementChild;
        child != null;
        child = child.previousElementSibling
      ) {
        const box = lastBox(child)
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
      let sibling = node.previousElementSibling;
      sibling != null;
      sibling = sibling.previousElementSibling
    ) {
      const box = lastBox(sibling)
      if (box != null) {
        return box
      }
    }
    node = node.parentElement
  }
  return null
}

/**
 * The glide that moves `neighbour`: its own, or that of its nearest gliding
 * ancestor below the area that does not also hold `element` (one that holds
 * both moves the two together, so the edge does not ride it).
 */
export function glideMoving(
  neighbour: Element,
  element: Element,
  area: Element,
): Glide | null {
  for (
    let node: Element | null = neighbour;
    node != null && node !== area && !node.contains(element);
    node = node.parentElement
  ) {
    const glide = glides.get(node)
    if (glide != null) {
      return glide
    }
  }
  return null
}
