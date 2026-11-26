/**
 * @file springParameters.ts
 * @output The `Spring` model and the conversions between Apple's spring
 *   vocabularies (duration and bounce, response and damping ratio, mass,
 *   stiffness and damping), and UIKit's relative velocity
 * @position Pure math under spring.ts, which re-exports all of it. See
 *   spring.ts for the sources of each conversion.
 */

export const TAU = 2 * Math.PI

/**
 * A spring, in Core Animation's physical vocabulary. Every other way of
 * describing a spring converts to this one.
 */
export interface Spring {
  /** Mass m of the attached object (`CASpringAnimation.mass`). */
  readonly mass: number
  /** Stiffness k (`CASpringAnimation.stiffness`). */
  readonly stiffness: number
  /** Viscous damping coefficient c (`CASpringAnimation.damping`). */
  readonly damping: number
}

/** SwiftUI's two-parameter description: `Spring(duration:bounce:)`. */
export interface DurationBounce {
  /**
   * Perceptual duration in seconds: the period of the undamped spring, "the
   * pace of the spring".
   */
  readonly duration: number
  /**
   * 0 is critically damped (no overshoot), up to 1 (undamped oscillation);
   * negative values, down to −1, are overdamped ("flattened") springs.
   */
  readonly bounce: number
}

/** WWDC18's design-friendly description: response and damping ratio. */
export interface ResponseDamping {
  /** Period of the undamped spring in seconds. */
  readonly response: number
  /**
   * Damping as a fraction of critical damping (SwiftUI's `dampingFraction`):
   * 1 settles without overshoot, values toward 0 oscillate longer.
   */
  readonly dampingRatio: number
}

export function assertPositiveFinite(name: string, value: number): void {
  if (!(Number.isFinite(value) && value > 0)) {
    throw new RangeError(
      `spring: ${name} must be a positive number, got ${value}`,
    )
  }
}

/**
 * SwiftUI's `Spring(duration:bounce:)` and UIKit's
 * `UIView.animate(springDuration:bounce:…)`: the WWDC23 equations. Bounce is
 * clamped to SwiftUI's documented range (−1, 1].
 *
 * @example
 * ```
 * springFromDurationBounce({duration: 0.5, bounce: 0}); // SwiftUI .smooth
 * ```
 */
export function springFromDurationBounce({
  duration,
  bounce,
}: DurationBounce): Spring {
  assertPositiveFinite('duration', duration)
  if (!Number.isFinite(bounce)) {
    throw new RangeError(`spring: bounce must be finite, got ${bounce}`)
  }
  // −1 itself would be infinite damping.
  const b = Math.min(1, Math.max(-0.999999, bounce))
  const stiffness = (TAU / duration) ** 2
  const damping
    = b >= 0 ? ((1 - b) * 2 * TAU) / duration : (2 * TAU) / (duration * (1 + b))
  return { mass: 1, stiffness, damping }
}

/**
 * SwiftUI's `Spring(response:dampingRatio:)` and
 * `Animation.spring(response:dampingFraction:)`. Overdamping (ratio > 1) is
 * kept, as SwiftUI keeps it for this initializer.
 */
export function springFromResponse({
  response,
  dampingRatio,
}: ResponseDamping): Spring {
  assertPositiveFinite('response', response)
  if (!(Number.isFinite(dampingRatio) && dampingRatio >= 0)) {
    throw new RangeError(
      `spring: dampingRatio must be ≥ 0, got ${dampingRatio}`,
    )
  }
  const omega = TAU / response
  return { mass: 1, stiffness: omega * omega, damping: 2 * dampingRatio * omega }
}

/**
 * `CASpringAnimation` / `UISpringTimingParameters(mass:stiffness:damping:)`
 * / SwiftUI `Spring(mass:stiffness:damping:allowOverDamping:)`. Like SwiftUI,
 * an overdamped spring is treated as critically damped unless
 * `allowOverdamping` is set: "a value of false specifies that such cases
 * should instead be treated as critically damped".
 */
export function springFromPhysics({
  mass = 1,
  stiffness,
  damping,
  allowOverdamping = false,
}: {
  mass?: number
  stiffness: number
  damping: number
  allowOverdamping?: boolean
}): Spring {
  assertPositiveFinite('mass', mass)
  assertPositiveFinite('stiffness', stiffness)
  if (!(Number.isFinite(damping) && damping >= 0)) {
    throw new RangeError(`spring: damping must be ≥ 0, got ${damping}`)
  }
  const critical = 2 * Math.sqrt(stiffness * mass)
  return {
    mass,
    stiffness,
    damping: allowOverdamping ? damping : Math.min(damping, critical),
  }
}

/** Undamped angular frequency ω₀ = √(k/m), rad/s. */
export function naturalFrequency(spring: Spring): number {
  return Math.sqrt(spring.stiffness / spring.mass)
}

/** Damping ratio ζ = c / (2·√(k·m)). */
export function dampingRatioOf(spring: Spring): number {
  return spring.damping / (2 * Math.sqrt(spring.stiffness * spring.mass))
}

/** Response (period of the undamped spring), seconds. */
export function responseOf(spring: Spring): number {
  return TAU / naturalFrequency(spring)
}

/** The spring as SwiftUI's (duration, bounce), inverting the WWDC23 equations. */
export function durationBounceOf(spring: Spring): DurationBounce {
  const zeta = dampingRatioOf(spring)
  return {
    duration: responseOf(spring),
    bounce: zeta <= 1 ? 1 - zeta : 1 / zeta - 1,
  }
}

/** The spring as (response, dampingRatio). */
export function responseDampingOf(spring: Spring): ResponseDamping {
  return { response: responseOf(spring), dampingRatio: dampingRatioOf(spring) }
}

/**
 * A spring in any of the vocabularies the constants table uses: physical
 * (mass, stiffness, damping), SwiftUI (duration, bounce) or WWDC18
 * (response, dampingRatio). Tables keep the vocabulary of their source so a
 * value reads exactly as it was published.
 */
export type SpringDescription
  = | {
    readonly mass?: number
    readonly stiffness: number
    readonly damping: number
  }
  | DurationBounce
  | ResponseDamping

/**
 * Normalizes a description to the physical `Spring`. A physical description
 * gets `springFromPhysics`' treatment: overdamping is clamped to critical, as
 * SwiftUI and Core Animation do by default.
 */
export function toSpring(description: SpringDescription): Spring {
  if ('stiffness' in description) {
    return springFromPhysics(description)
  }
  if ('bounce' in description) {
    return springFromDurationBounce(description)
  }
  return springFromResponse(description)
}

/**
 * UIKit's relative initial spring velocity for a move from `from` to `to`
 * at `velocity` units/s: 1 means the whole distance in one second. Undefined
 * (±Infinity) when `from === to`; animate in absolute units instead
 * (`solveSpring` takes an absolute velocity).
 */
export function relativeVelocity(
  velocity: number,
  from: number,
  to: number,
): number {
  return velocity / (to - from)
}

/** Inverse of `relativeVelocity`: absolute units/s. */
export function absoluteVelocity(
  relative: number,
  from: number,
  to: number,
): number {
  return relative * (to - from)
}
