/**
 * @file themeTiming.ts
 * @input An element, and the CSS or the theme tokens that time one motion
 * @output readThemeTiming: the eased progress from 0 to 1 that times a motion,
 *   as one timed MotionCurve. It reads the element's own transition, or
 *   tokens where the element is. It plays an easing that is not a cubic
 *   Bézier as the browser plays it. readThemeTimingOrInstant: that curve, or
 *   one of no length when it does not resolve. readThemeTokens and
 *   resolveTiming: that duration and easing as values. readThemeTokenText: a
 *   token's text where the element is. easedProgress: the curve for a length
 *   and an easing already read.
 * @position Motion foundation, internal to core. Token names are the theme
 *   vocabulary's unprefixed names (`--duration-fast`); the element carries
 *   them with the `--astryx-` prefix. Motion that a tap, a key or
 *   the program starts reads its duration and easing from the theme with it.
 */

import type { DurationVarName, EaseVarName } from '../Theme/motionTokenDefaults'
import type { MotionCurvePoints } from './roleValue'
import type { MotionCurve } from './types'
import { durationDefaults, easeDefaults } from '../Theme/motionTokenDefaults'
import { normalizeTokenName } from '../Theme/tokenName'
import { resolveTokenReferences } from '../Theme/tokenReferences'
import { cubicBezier } from './bezier'
import { parseCssEasing, parseMotionRoleValue } from './roles'

/**
 * The value `@astryx-vue/themes` declares for each timing token, by its
 * unprefixed name. A page without the stylesheet reads these.
 */
export const declaredTimingTokens: Readonly<Record<DurationVarName | EaseVarName, string>> = {
  ...durationDefaults,
  ...easeDefaults,
}

/** The theme tokens that time one motion. */
export interface ThemeTimingTokens {
  readonly duration: DurationVarName
  readonly easing: EaseVarName
}

/** A duration and an easing that time a motion, each null when unresolved. */
export interface ResolvedTiming {
  /** The duration in ms, zero or more. */
  readonly ms: number | null
  readonly points: MotionCurvePoints | null
}

/**
 * The eased progress from 0 to 1 over `seconds`, as a MotionCurve whose
 * velocity is in progress per second. A curve of no length is at its end.
 * With `jumps`, a jump in the easing, as in `steps()`, carries no speed. The
 * gentler of the slopes just before and just after counts.
 */
export function easedProgress(
  seconds: number,
  ease: (x: number) => number,
  { jumps = false }: { readonly jumps?: boolean } = {},
): MotionCurve {
  const at = (t: number): number =>
    seconds <= 0 || t >= seconds ? 1 : ease(Math.max(0, t) / seconds)
  // A central difference, one step inside the curve at either end.
  const step = Math.min(1e-3, seconds / 100)
  return {
    duration: seconds,
    at,
    velocity: (t) => {
      if (seconds <= 0 || t >= seconds) {
        return 0
      }
      const before = Math.max(0, t - step)
      const after = Math.min(seconds, t + step)
      if (!jumps) {
        return (at(after) - at(before)) / (after - before)
      }
      const here = at(t)
      const slopes: number[] = []
      if (t > before) {
        slopes.push((here - at(before)) / (t - before))
      }
      if (after > t) {
        slopes.push((at(after) - here) / (after - t))
      }
      return slopes.reduce((a, b) => (Math.abs(b) < Math.abs(a) ? b : a))
    },
  }
}

function firstDurationMs(style: CSSStyleDeclaration): number | null {
  return parseMotionRoleValue(
    'duration',
    style.transitionDuration.split(',')[0] ?? '',
  )
}

/** The first transition's easing in a computed style, as the style writes it. */
function firstEasingText(style: CSSStyleDeclaration): string {
  return style.transitionTimingFunction.split(/,(?![^(]*\))/)[0] ?? ''
}

/** The first transition's easing in a computed style. */
function firstEasing(style: CSSStyleDeclaration): MotionCurvePoints | null {
  return parseCssEasing(firstEasingText(style))
}

/**
 * The easing `text` as the browser plays it. A paused animation with that
 * easing gives its eased progress at each time it is set to. This reads an
 * easing that is not a cubic Bézier, such as `linear()` or `steps()`. Null
 * when the browser plays no such easing, or has no Web Animations.
 */
function browserEasing(
  doc: Document,
  text: string,
): ((x: number) => number) | null {
  const view = doc.defaultView
  if (
    typeof view?.Animation !== 'function'
    || typeof view.KeyframeEffect !== 'function'
  ) {
    return null
  }
  let animation: Animation
  try {
    animation = new view.Animation(
      new view.KeyframeEffect(null, null, {
        duration: 1000,
        easing: text,
        fill: 'both',
      }),
      null,
    )
  }
  catch {
    // The browser throws on an easing it cannot play.
    return null
  }
  return (x) => {
    animation.currentTime = Math.min(1, Math.max(0, x)) * 1000
    return animation.effect?.getComputedTiming().progress ?? 1
  }
}

/**
 * The curve for a duration and an easing, or null if either cannot play. An
 * easing that is not a cubic Bézier plays as the browser plays `easing`, and
 * a jump in it carries no speed.
 */
function progressOf(
  doc: Document,
  { ms, points }: ResolvedTiming,
  easing: string,
): MotionCurve | null {
  if (ms == null || ms <= 0) {
    return null
  }
  if (points != null) {
    return easedProgress(ms / 1000, cubicBezier(points))
  }
  const ease = browserEasing(doc, easing)
  return ease == null ? null : easedProgress(ms / 1000, ease, { jumps: true })
}

/**
 * A duration and an easing written in CSS, resolved as a transition resolves
 * them where `element` is. A plain time or easing parses as written. Other
 * text, such as `calc()`, resolves on a hidden probe's transition. The
 * duration is null when it is not a time of zero or more. The easing is null
 * when it is not a cubic Bézier. A value left out gives null.
 */
export function resolveTiming(
  element: Element,
  { duration, easing }: { readonly duration?: string, readonly easing?: string },
): ResolvedTiming {
  const plainMs
    = duration == null ? null : parseMotionRoleValue('duration', duration)
  const plainPoints = easing == null ? null : parseCssEasing(easing)
  const doc = element.ownerDocument
  const view = doc.defaultView
  const needsMs = duration != null && plainMs == null
  const needsPoints = easing != null && plainPoints == null
  if (view == null || (!needsMs && !needsPoints)) {
    return { ms: plainMs, points: plainPoints }
  }
  const probe = doc.createElement('span')
  // A computed value needs no layout, so the probe never renders.
  probe.style.setProperty('display', 'none', 'important')
  // The browser refuses a value it cannot read, and the property stays unset.
  const takes = (property: string, value: string): boolean => {
    probe.style.setProperty(property, value, 'important')
    return probe.style.getPropertyValue(property) !== ''
  }
  const hasMs = needsMs && takes('transition-duration', duration)
  const hasPoints = needsPoints && takes('transition-timing-function', easing);
  (doc.body ?? doc.documentElement).append(probe)
  try {
    const style = view.getComputedStyle(probe)
    return {
      ms: hasMs ? firstDurationMs(style) : plainMs,
      points: hasPoints ? firstEasing(style) : plainPoints,
    }
  }
  finally {
    probe.remove()
  }
}

/**
 * The value of `token` in `style`, which carries it with the `--astryx-`
 * prefix. With none, it is the declared default, and the references in that
 * default read their own tokens in `style` too.
 */
function tokenValue(
  style: CSSStyleDeclaration,
  token: DurationVarName | EaseVarName,
): string {
  const own = style.getPropertyValue(normalizeTokenName(token)).trim()
  if (own !== '') {
    return own
  }
  const declared: Record<string, string> = {}
  for (const [name, value] of Object.entries(declaredTimingTokens)) {
    declared[name] = style.getPropertyValue(normalizeTokenName(name)).trim() || value
  }
  return resolveTokenReferences(declared)[token] ?? ''
}

/**
 * The duration and easing of theme tokens where `element` is, resolved as a
 * transition resolves them. A token with no value there reads the default
 * the theme declares. A token left out gives null.
 */
export function readThemeTokens(
  element: Element,
  {
    duration,
    easing,
  }: { readonly duration?: DurationVarName, readonly easing?: EaseVarName },
): ResolvedTiming {
  const style = element.ownerDocument.defaultView?.getComputedStyle(element)
  if (style == null) {
    return { ms: null, points: null }
  }
  return resolveTiming(element, {
    duration: duration == null ? undefined : tokenValue(style, duration),
    easing: easing == null ? undefined : tokenValue(style, easing),
  })
}

/**
 * The text of a timing token where `element` is: its value there, or the
 * default the theme declares, with that default's references read there too. It
 * holds no reference, so another element that takes it plays the same timing.
 */
export function readThemeTokenText(
  element: Element,
  token: DurationVarName | EaseVarName,
): string | null {
  const style = element.ownerDocument.defaultView?.getComputedStyle(element)
  return style == null ? null : tokenValue(style, token)
}

/**
 * The eased progress from 0 to 1 that times a motion of `element`, as a
 * MotionCurve whose velocity is in progress per second. With no tokens, it
 * reads the element's own transition, where its stylesheet applies the
 * theme's tokens. With tokens, it reads them as readThemeTokens does. Null
 * when the duration is not a positive length or the browser plays no such
 * easing: the caller decides what that motion does.
 */
export function readThemeTiming(
  element: Element,
  tokens?: ThemeTimingTokens,
): MotionCurve | null {
  const doc = element.ownerDocument
  const style = doc.defaultView?.getComputedStyle(element)
  if (style == null) {
    return null
  }
  if (tokens != null) {
    const easing = tokenValue(style, tokens.easing)
    const duration = tokenValue(style, tokens.duration)
    return progressOf(doc, resolveTiming(element, { duration, easing }), easing)
  }
  const easing = firstEasingText(style)
  return progressOf(
    doc,
    { ms: firstDurationMs(style), points: parseCssEasing(easing) },
    easing,
  )
}

/**
 * The theme's timing for `tokens` where `element` is, as readThemeTiming
 * reads it. A timing that does not resolve, or no element, plays no motion:
 * the curve has no length, so the motion lands at once.
 */
export function readThemeTimingOrInstant(
  element: Element | null,
  tokens: ThemeTimingTokens,
): MotionCurve {
  return (
    (element == null ? null : readThemeTiming(element, tokens))
    ?? easedProgress(0, x => x)
  )
}
