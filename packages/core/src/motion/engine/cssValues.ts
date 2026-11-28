/**
 * @file cssValues.ts
 * CSS text for a channel's values, the inline-style reader, the person's
 * settings and custom-property registration.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { MotionProperty, MotionValues } from '../types'
import type { Channel } from './engineTypes'
import { IDENTITY_TEXT, PROPERTIES } from './constants'

export function round(value: number, digits: number): number {
  return Number(value.toFixed(digits))
}

export function format(
  channel: Channel,
  value: (property: MotionProperty) => number,
): string {
  switch (channel) {
    case 'translate':
      return `${round(value('x'), 3)}px ${round(value('y'), 3)}px`
    case 'rotate':
      return `${round(value('rotate'), 4)}deg`
    case 'scale':
      return `${round(value('scaleX'), 5)} ${round(value('scaleY'), 5)}`
    case 'opacity':
      return `${round(Math.min(1, Math.max(0, value('opacity'))), 4)}`
  }
}

/**
 * Whether a computed value shows `expected` (`format`'s text). An unset or
 * `none` value is the channel's identity. One value of a two-value channel
 * stands for both (scale), or for x with y at 0 (translate).
 */
export function sameShown(channel: Channel, shown: string, expected: string): boolean {
  const numbers = (text: string): number[] => {
    const values = (
      text === '' || text === 'none' ? IDENTITY_TEXT[channel] : text
    ).match(/-?\d*\.?\d+(?:e-?\d+)?/g)
    const list = (values ?? []).map(Number)
    if (channel === 'translate') {
      return [list[0] ?? 0, list[1] ?? 0]
    }
    if (channel === 'scale') {
      return [list[0] ?? 1, list[1] ?? list[0] ?? 1]
    }
    return list.length > 0 ? list : [channel === 'opacity' ? 1 : 0]
  }
  const a = numbers(shown)
  const b = numbers(expected)
  return (
    a.length === b.length
    && a.every((value, i) => Math.abs(value - b[i]) < 1e-3)
  )
}

/**
 * The inline text for a channel: `format`, except that an identity transform
 * is written `none`. Any other value, `translate: 0px 0px` included, makes
 * the element the containing block of its `position: fixed` descendants and
 * a stacking context, so a motion back to identity would leave a fixed child
 * moved with its parent; Mobile Safari also lets no finger scroll a list
 * inside an element left at `scale: 1`. At rest the identity leaves the
 * element entirely when its stylesheet agrees (`releaseIdentity`).
 */
export function inlineText(
  channel: Channel,
  value: (property: MotionProperty) => number,
): string {
  const at = (property: MotionProperty, identity: number, digits: number): boolean =>
    round(value(property), digits) === identity
  switch (channel) {
    case 'translate':
      return at('x', 0, 3) && at('y', 0, 3) ? 'none' : format(channel, value)
    case 'rotate':
      return at('rotate', 0, 4) ? 'none' : format(channel, value)
    case 'scale':
      return at('scaleX', 1, 5) && at('scaleY', 1, 5)
        ? 'none'
        : format(channel, value)
    case 'opacity':
      return format(channel, value)
  }
}

/** Whether a computed value (or an unset one) is the channel's identity. */
export function isIdentityText(channel: Channel, text: string): boolean {
  const value = text.trim()
  if (value === '' || value === 'none') {
    return true
  }
  const numbers = value.split(/\s+/).map(part => Number.parseFloat(part))
  if (numbers.some(number => !Number.isFinite(number))) {
    return false
  }
  const identity = channel === 'scale' || channel === 'opacity' ? 1 : 0
  return numbers.every(number => Math.abs(number - identity) < 1e-6)
}

export function expand(values: MotionValues): Partial<Record<MotionProperty, number>> {
  const out: Partial<Record<MotionProperty, number>> = {}
  for (const [key, value] of Object.entries(values)) {
    if (value == null || !Number.isFinite(value)) {
      continue
    }
    if (key === 'scale') {
      out.scaleX ??= value
      out.scaleY ??= value
    }
    else if ((PROPERTIES as ReadonlyArray<string>).includes(key)) {
      out[key as MotionProperty] = value
    }
  }
  return out
}

/** The time the motion clock reads (`performance.now()`'s time base). */
export function motionNow(): number {
  return typeof performance === 'undefined' ? Date.now() : performance.now()
}

/**
 * Whether the user asked for reduced motion (`prefers-reduced-motion:
 * reduce`), read at the moment of the call: the preference the animator uses
 * by default for its Reduce Motion substitution. A component never reads it
 * to pick a curve of its own: its motion settings do not override the
 * policy (design:reduced-motion DR4); `animator.reducedMotion()` or
 * `reducedMotionFade()` gives the policy's answer. False without a window
 * (server rendering).
 */
export function defaultPrefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** Whether the primary pointer is coarse: `(pointer: coarse)`. */
export function defaultIsCoarsePointer(): boolean {
  return (
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(pointer: coarse)').matches
  )
}

/**
 * Registers `name` as an inherited `<length>` (initially 0px) or `<number>`
 * (initially 0) so keyframes interpolate it; an unregistered custom property
 * animates in steps. A property the page already registered is left as it
 * is.
 */
export function registerCustomProperty(
  name: string,
  syntax: '<length>' | '<number>',
): void {
  if (
    typeof CSS === 'undefined'
    || typeof CSS.registerProperty !== 'function'
  ) {
    return
  }
  try {
    CSS.registerProperty({
      name,
      syntax,
      inherits: true,
      initialValue: syntax === '<length>' ? '0px' : '0',
    })
  }
  catch (error) {
    // A name registered before, by the page or an earlier call, throws this.
    if (
      !(error instanceof DOMException)
      || error.name !== 'InvalidModificationError'
    ) {
      throw error
    }
  }
}

export function expandList(
  properties: ReadonlyArray<MotionProperty | 'scale'>,
): MotionProperty[] {
  const out = new Set<MotionProperty>()
  for (const property of properties) {
    if (property === 'scale') {
      out.add('scaleX')
      out.add('scaleY')
    }
    else {
      out.add(property)
    }
  }
  return [...out]
}
