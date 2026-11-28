/**
 * @file glides.ts
 * @position Internal to motion/layout; split from upstream motion/animatedLayout.ts
 */

import { sharedWeakMap, sharedWeakSet } from '../../utils/sharedRealm'
import { sampleCount } from '../linearEasing'

/** Every animation this module started, so it can tell the app's apart. */
export const ours = sharedWeakSet<Animation>('motion/animated-layout/ours', 1)

export const glides = sharedWeakMap<Element, Glide>(
  'motion/animated-layout/glides',
  1,
)

/**
 * Where `element` shows at the timeline's time `at`: its layout box, moved by
 * its glide's offset then. After a block, WebKit evaluates a running
 * translate on the live clock. The timeline still reads the frame before the
 * block, as every glide here does, so the evaluated box would sit ahead.
 * Glides write px; a translate in percent is not ours, so the box stays.
 */
export function shownBoxAt(element: Element, at: number): DOMRect {
  const box = element.getBoundingClientRect()
  const glide = glides.get(element)
  const startTime = glide?.animation.startTime
  if (glide == null || startTime == null) {
    return box
  }
  const translate
    = element.ownerDocument.defaultView?.getComputedStyle(element).translate
      ?? ''
  if (translate.includes('%')) {
    return box
  }
  const [appliedX = 0, appliedY = 0] = numbersIn(translate)
  const offset = glide.offsetAt(Math.max(0, at - Number(startTime)))
  return new DOMRect(
    box.x + (offset.x - appliedX) * glide.scale.x,
    box.y + (offset.y - appliedY) * glide.scale.y,
    box.width,
    box.height,
  )
}

const TRANSFORM_PROPERTIES = ['transform', 'translate', 'rotate', 'scale']

/** The numbers in a CSS value, units dropped. */
export function numbersIn(value: string): number[] {
  return (value.match(/-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi) ?? []).map(
    Number,
  )
}

/**
 * Whether a transform value leaves the element where it is: nothing at all
 * (a swipe's `translate3d(0, 0, 0)` at rest, a button's `scale(1)`, computed
 * as `matrix(1, 0, 0, 1, 0, 0)`), or a scale in place (a pressed button's
 * `scale(0.98)`). A glide's `translate` composes with either; a translation,
 * rotation or skew of its own is the app moving the element.
 */
export function staysInPlace(property: string, value: string): boolean {
  if (value === 'none') {
    // No transform at all (a keyframe a press's own transition starts from).
    return true
  }
  if (property === 'scale') {
    return true
  }
  if (value.includes('var(')) {
    // An unresolved custom property in an app's own keyframes: its value is
    // unknown here, so the app moves the element.
    return false
  }
  if (property === 'translate') {
    return numbersIn(value).every(n => n === 0)
  }
  if (property === 'rotate') {
    // An angle, after an optional axis: only the angle matters.
    const numbers = numbersIn(value)
    return numbers.length > 0 && numbers[numbers.length - 1] === 0
  }
  // A list of transform functions, as computed (`matrix()`, `matrix3d()`)
  // or as written.
  const functions = [...value.matchAll(/([a-z0-9]+)\(([^)]*)\)/gi)]
  return (
    functions.length > 0
    && functions.every(([, name, args]) => {
      const numbers = numbersIn(args)
      const fn = name.toLowerCase()
      if (fn === 'matrix') {
        // a b c d e f: no skew, rotation or translation.
        return (
          numbers.length === 6
          && [1, 2, 4, 5].every(index => numbers[index] === 0)
        )
      }
      if (fn === 'matrix3d') {
        // Only the diagonal: a scale, nothing else.
        return (
          numbers.length === 16
          && numbers.every((n, index) => index % 5 === 0 || n === 0)
        )
      }
      if (fn === 'rotate3d') {
        return numbers[3] === 0
      }
      if (fn.startsWith('scale')) {
        return true
      }
      if (
        fn.startsWith('translate')
        || fn.startsWith('rotate')
        || fn.startsWith('skew')
      ) {
        return numbers.every(n => n === 0)
      }
      return false
    })
  )
}

/**
 * Whether the app moves `element` itself: its own `transform`, `translate`
 * or `rotate`, or a running animation of one this module did not start. A
 * value that leaves it in place (nothing, or a scale) is not a move.
 */
export function movedByApp(element: Element): boolean {
  const style = element.ownerDocument.defaultView?.getComputedStyle(element)
  if (
    style != null
    && TRANSFORM_PROPERTIES.some((property) => {
      const value = style.getPropertyValue(property)
      return value !== '' && value !== 'none' && !staysInPlace(property, value)
    })
  ) {
    return true
  }
  if (typeof element.getAnimations !== 'function') {
    return false
  }
  return element.getAnimations().some((animation) => {
    if (ours.has(animation)) {
      return false
    }
    const effect = animation.effect
    if (!(effect instanceof KeyframeEffect)) {
      return false
    }
    return effect
      .getKeyframes()
      .some(frame =>
        TRANSFORM_PROPERTIES.some(
          property =>
            property in frame
            && !staysInPlace(property, String(frame[property])),
        ),
      )
  })
}

/** An offset in the element's own px, as a function of ms into a glide. */
export type OffsetCurve = (t: number) => { readonly x: number, readonly y: number }

export const AT_REST: OffsetCurve = () => ({ x: 0, y: 0 })

/**
 * `curve` as the browser draws it from `sampleOver`'s keyframes: a straight
 * line between each two. A new glide then starts where the old one shows.
 */
export function drawnCurve(durationMs: number, curve: OffsetCurve): OffsetCurve {
  const count = sampleCount(durationMs)
  const points = Array.from({ length: count }, (_, i) =>
    curve((i / (count - 1)) * durationMs))
  return (t) => {
    const at = Math.min(Math.max(t / durationMs, 0), 1) * (count - 1)
    const i = Math.min(Math.floor(at), count - 2)
    const f = at - i
    const a = points[i]
    const b = points[i + 1]
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f }
  }
}

/** A glide an element is playing, so a new change can retarget it. */
export interface Glide {
  readonly animation: Animation
  readonly offsetAt: OffsetCurve
  readonly durationMs: number
  /**
   * The offset where the element showed when its old place was read. After a
   * block the glide starts further on, where the compositor has it.
   */
  readonly shownBefore: { readonly x: number, readonly y: number }
  /** Its ancestors' scale: page px per px of its own offset. */
  readonly scale: { readonly x: number, readonly y: number }
}

/**
 * The glide `element` is playing now, if any. For an adopter that draws
 * something with each moving element (a table row's divider): it finds what
 * moves without reading the DOM.
 */
export function glideOf(element: Element): Animation | null {
  return glides.get(element)?.animation ?? null
}
