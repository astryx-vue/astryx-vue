/**
 * @file geometry.ts
 * @position Internal to motion/layout; split from upstream motion/animatedLayout.ts
 */

import { numbersIn } from './glides'

export function intersects(a: DOMRect, b: DOMRect): boolean {
  return (
    a.width > 0
    && a.height > 0
    && a.right > b.left
    && a.left < b.right
    && a.bottom > b.top
    && a.top < b.bottom
  )
}

/** The part of the area the person can see: its box within the viewport. */
/** Where the area's scrolled content starts, in client px. */
export function originOf(area: Element): { x: number, y: number } {
  const box = area.getBoundingClientRect()
  return { x: box.left - area.scrollLeft, y: box.top - area.scrollTop }
}

export function visibleRect(area: Element): DOMRect {
  const box = area.getBoundingClientRect()
  const view = area.ownerDocument.defaultView
  const width = view?.innerWidth ?? box.right
  const height = view?.innerHeight ?? box.bottom
  const left = Math.max(box.left, 0)
  const top = Math.max(box.top, 0)
  return new DOMRect(
    left,
    top,
    Math.max(0, Math.min(box.right, width) - left),
    Math.max(0, Math.min(box.bottom, height) - top),
  )
}

/** The element's rendered scale against its layout size (a scaled ancestor). */
export function scaleOf(
  element: Element,
  rect: DOMRect,
  own: { readonly x: number, readonly y: number } = { x: 1, y: 1 },
): { x: number, y: number } {
  const html = element as HTMLElement
  const x
    = html.offsetWidth > 0 && rect.width > 0
      ? rect.width / html.offsetWidth / own.x
      : 1
  const y
    = html.offsetHeight > 0 && rect.height > 0
      ? rect.height / html.offsetHeight / own.y
      : 1
  // Subpixel rounding makes an unscaled element read a hair off 1; only a
  // real scale is corrected.
  return {
    x: Math.abs(x - 1) < 0.01 ? 1 : x || 1,
    y: Math.abs(y - 1) < 0.01 ? 1 : y || 1,
  }
}

/**
 * The scale an element's own `scale` and `transform` give it, on each axis
 * (a follower that keeps one in place, `staysInPlace`). A glide's `translate`
 * does not go through them: the individual transform properties apply
 * `translate` first, in the parent's space.
 */
export function ownScaleOf(element: Element): { x: number, y: number } {
  const style = element.ownerDocument.defaultView?.getComputedStyle(element)
  if (style == null) {
    return { x: 1, y: 1 }
  }
  let x = 1
  let y = 1
  const scale = style.getPropertyValue('scale')
  if (scale !== '' && scale !== 'none') {
    const [sx = 1, sy = sx] = numbersIn(scale)
    // Its size, not its direction: a negative scale flips the element in
    // place, and its measured box stays positive.
    x *= Math.abs(sx)
    y *= Math.abs(sy)
  }
  // The computed transform is a matrix: its first column's length is the
  // scale on x, its second's on y.
  const matrix = /^matrix(3d)?\(([^)]*)\)/.exec(
    style.getPropertyValue('transform'),
  )
  if (matrix != null) {
    const m = numbersIn(matrix[2])
    const [a = 1, b = 0, c = 0, d = 1]
      = matrix[1] == null ? m : [m[0], m[1], m[4], m[5]]
    x *= Math.hypot(a, b)
    y *= Math.hypot(c, d)
  }
  return { x: x || 1, y: y || 1 }
}
