/**
 * @file landing.ts
 * @position Internal to motion/layout; split from upstream motion/animatedLayout.ts
 */

import type { Glide } from './glides'
import type { AnimatedLayout } from './handle'
import type { LayoutMotion } from './timing'
import { glides } from './glides'
import { areaOf } from './handle'
import { settleTransition, transitionSettles } from './settle'
import { layoutMotion } from './timing'

/**
 * A disclosure's indicator (its chevron) turns on the same motion as the
 * glide. Its CSS transition takes the theme's move curve and duration as the
 * glide reads them where the area is, and is immediate under Reduce Motion.
 * Without a handle the inline values are cleared, so the component's own
 * transition applies.
 */
export function applyLayoutChangeTransition(
  handle: AnimatedLayout | null | undefined,
  element: HTMLElement | SVGElement | null,
): void {
  if (element == null) {
    return
  }
  const area = handle == null ? null : areaOf(handle, element)
  if (area == null) {
    transitionSettles.get(element)?.()
    element.style.removeProperty('transition-duration')
    element.style.removeProperty('transition-timing-function')
    return
  }
  const motion = layoutMotion(area)
  if (motion.kind !== 'glide') {
    transitionSettles.get(element)?.()
    element.style.setProperty('transition-duration', '0s')
    element.style.removeProperty('transition-timing-function')
    return
  }
  // Values, not the tokens: a theme scope between the area and the indicator
  // would retime a token that the indicator reads where it is.
  const ms = Math.round(motion.progress.durationMs * 1000) / 1000
  element.style.setProperty('transition-duration', `${ms}ms`)
  element.style.setProperty(
    'transition-timing-function',
    motion.progress.easing,
  )
  settleTransition(element, motion.progress)
}

/**
 * Lands `element`'s running glide at once: it takes its layout place, and a
 * later change starts from there (a change its caller lands rather than
 * animates, such as a rail that snaps).
 */
export function landLayoutGlide(element: Element): void {
  const glide = glides.get(element)
  if (glide != null) {
    glides.delete(element)
    glide.animation.cancel()
  }
}

/**
 * Lands the sideways part of `element`'s running glide at once and keeps its
 * vertical move. It changes the glide's frames, and what a later change
 * carries from it, together. It is for an adopter that moves the element's
 * own sideways translation onto its children between the two reads. A list
 * row that a swipe left open is one.
 */
export function landLayoutGlideSideways(element: Element): void {
  const glide = glides.get(element)
  const effect = glide?.animation.effect as KeyframeEffect | null | undefined
  if (
    glide == null
    || effect == null
    || typeof effect.setKeyframes !== 'function'
  ) {
    return
  }
  effect.setKeyframes(
    effect.getKeyframes().map(({ computedOffset: _, translate, ...frame }) => {
      const [, y = '0px'] = String(translate ?? '').split(/\s+/)
      return { ...frame, translate: `0px ${y}` }
    }),
  )
  const vertical: Glide = {
    animation: glide.animation,
    offsetAt: t => ({ x: 0, y: glide.offsetAt(t).y }),
    get durationMs() {
      return glide.durationMs
    },
    shownBefore: { x: 0, y: glide.shownBefore.y },
    scale: glide.scale,
  }
  glides.set(element, vertical)
  glide.animation.addEventListener?.('finish', () => {
    if (glides.get(element) === vertical) {
      glides.delete(element)
    }
  })
}

/**
 * The motion a change in `area` plays, for tests and for SideNav's rail
 * motion, which plays on the same clock (`component:SideNav` FR6).
 */
export function layoutMotionFor(area: Element): LayoutMotion {
  return layoutMotion(area)
}
