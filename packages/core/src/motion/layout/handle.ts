/**
 * @file handle.ts
 * @position Internal to motion/layout; split from upstream motion/animatedLayout.ts
 */

import { sharedKey } from '../../utils/sharedRealm'

// A registered key, so a swizzled copy of this module reads a package handle.
const AREA = sharedKey('animated-layout/area', 1)

/**
 * The opaque handle `useAnimatedLayout` returns. A component that receives it
 * reports its size changes to the handle's container, the area the glide
 * stays inside.
 */
export interface AnimatedLayout {
  /**
   * A brand that is never present, so the handle types of the package and a
   * swizzled copy match.
   */
  readonly '@astryxdesign/core/animated-layout/v1'?: never
}

/** The container a handle reads, or null for a value that is not a handle. */
export function readArea(handle: AnimatedLayout): Element | null {
  const read = (handle as { readonly [AREA]?: unknown })[AREA]
  return typeof read === 'function' ? (read as () => Element | null)() : null
}

/** A handle over `area` (the container element, read when a change runs). */
export function createAnimatedLayout(
  area: () => Element | null,
): AnimatedLayout {
  // Not enumerable and frozen: the handle shows no fields to a caller.
  return Object.freeze(Object.defineProperty({}, AREA, { value: area }))
}

export function areaOf(handle: AnimatedLayout, element: Element): Element | null {
  const area = readArea(handle)
  return area != null && area !== element && area.contains(element)
    ? area
    : null
}
