/**
 * @file types.ts
 * @output 动画器的值、曲线、选项和句柄类型，以及 `SETTLE_THRESHOLD`：
 *   animator.ts 实现的契约，动效数学（coast.ts、progress.ts、paging.ts）按它造曲线
 * @position 动效内核，只有类型和一个常量，不碰 DOM
 */

import type { SpringDescription } from './spring'

/**
 * A value the animator can drive.
 */
export type MotionProperty
  = 'x' | 'y' | 'rotate' | 'scaleX' | 'scaleY' | 'opacity'

/**
 * Values by property; `scale` sets `scaleX` and `scaleY` together.
 */
export type MotionValues = Partial<Record<MotionProperty | 'scale', number>>

/**
 * A spring and the velocity it starts with.
 */
export interface SpringTransition {
  /** The spring, in any vocabulary of the constants table. */
  spring: SpringDescription
  /**
   * Initial velocities in units per second (px/s, deg/s, 1/s), for example a
   * gesture's release velocity. A property without one keeps the velocity it
   * has on screen.
   */
  velocity?: MotionValues
}

/** What `Animator.rebase` takes besides the amounts. */
export interface RebaseOptions {
  /** Time of the shift on the document timeline (ms). Defaults to now. */
  at?: number
  /**
   * Per property, the value its spring heads for after the shift. A spring
   * whose target plus its amount lands there moves whole, before its first
   * frame and once its start is known. Its curve and target move by the
   * amount. It keeps its start time and velocity, as when the element's
   * resting place moves under a curve that keeps going. If its first frame
   * has run while its start is unread, only the model moves. The next call
   * on the channel in the same task rebuilds its animation, or else the end
   * of the task does.
   */
  towards?: MotionValues
}

/**
 * Options of `animate` and `play`: the spring, a release velocity, the Reduced
 * Motion handling.
 */
export interface AnimateOptions {
  /**
   * Start time on the document timeline (ms, `performance.now()` clock).
   * Defaults to now. Pass one value to several animators to put their
   * animations on one clock.
   */
  at?: number
  /**
   * The call starts from the release of a touch drag (a sheet let go, a swipe
   * back released). Under Reduced Motion it then cross-fades whatever the
   * primary pointer (design:reduced-motion DR2), where another call on a
   * fine primary pointer completes at once (DR3). The gesture host knows;
   * nothing is inferred from the last pointer.
   */
  touchRelease?: boolean
  /**
   * Which way the substituted cross-fade goes when the call's own opacity
   * does not say (a sheet slides in or out without fading): `'entrance'`
   * lands the travel at once and fades the opacity in from 0; `'exit'` fades
   * it out in place, then lands the travel and returns the opacity to its
   * value. The call's targets stay the end state; without Reduced Motion this
   * changes nothing.
   */
  crossfadeAs?: 'entrance' | 'exit'
  /**
   * When the call's animations start. By default a call from rest starts
   * when the browser commits it. A call that continues motion on screen (a
   * retarget) starts now, from the value on screen. A curve whose tail
   * already shows as at rest counts as rest. Ignored with `at`.
   * - `'commit'`: a call that continues motion also starts when the browser
   *   commits it. The browser dates it, as it dates a call from rest.
   * - `'presented'`: a call from rest leaves its element at rest. Its
   *   animations are created two frames later, once the frame with the
   *   element at rest has been presented. They then start at their commit,
   *   so a busy UI process delays the motion instead of skipping into it.
   *   Any other change to the animator before then creates the animations
   *   first, in call order. A call that continues motion on screen starts
   *   now, as by default.
   * - `'next-frame'`: the caller makes the call in an input event's own
   *   task, never in a frame callback. The first frame whose callbacks run
   *   after the call commits it. A call from rest starts at that frame,
   *   however long the task ran, so a later listener's block delays the
   *   motion. Without it, the browser dates the start inside that block, and
   *   the motion skips ahead. A call that continues motion starts now, as by
   *   default.
   */
  start?: 'commit' | 'presented' | 'next-frame'
  /**
   * A call that retargets a curve on screen adds to it instead of replacing
   * it, as UIKit's animations do: the old curve keeps going (past its end, at
   * its target) and a spring of the difference between the two targets runs
   * from 0 on top, in the same animation. Its value and velocity at the call
   * are the old curve's, so whichever frame first shows it (WebKit can apply
   * a new curve tens of ms late), nothing steps back. Ignored for a property
   * at rest or still waiting for the browser's start, for a property given a
   * velocity, and under Reduced Motion. Use it for a played curve that starts
   * at rest (an eased reversal) while the property moves; a spring retarget
   * on the same spring moves the same either way, and a curve that already
   * continues the velocity on screen must not add to it.
   */
  additive?: boolean
}

/**
 * Any closed-form curve to play on the compositor (`Animator.play`, and a
 * release's coast through `Animator.decay`): a spring chasing a moving
 * target, a piecewise curve, a fitted UIKit curve. Times are seconds from
 * the curve's start; the value at `duration` is the end state. Start it at
 * the property's presentation value (`get`) to continue without a jump.
 */
export interface MotionCurve {
  /** Length, s. */
  readonly duration: number
  /** Value `t` seconds after the start (0 ≤ t ≤ duration). */
  at: (t: number) => number
  /** Velocity `t` seconds after the start, units/s. */
  velocity: (t: number) => number
  /**
   * A transition started on release rather than a throw's momentum (a
   * spring back from past an edge): under Reduce Motion it is no coast and
   * cross-fades like `animate` (`design:reduced-motion` DR2).
   */
  readonly isTransition?: boolean
}

/** How `set` puts values in place. */
export interface SetOptions {
  /**
   * Whether the write promotes its channels to a compositing layer, as a
   * drag's per-frame writes need so each is a composite only (default
   * true). `false` writes the values and nothing else: a one-off switch that
   * must not give its element a layer, such as a veil under a sticky header
   * switched during a programmatic scroll (on iOS 26.2, a layer there blanks
   * the header's painted items for about two frames). A channel another
   * motion keeps promoted stays promoted, and a channel with other motion
   * still running gets its animation's layer as usual.
   */
  promote?: boolean
}

/**
 * Options of `createMotionEngine`.
 */
export interface AnimatorOptions {
  /**
   * Animates a pseudo-element of the element instead (`'::backdrop'` of a
   * native dialog). A pseudo-element has no inline style. So a static filling
   * animation holds its value after a curve ends and after `set`, unless the
   * value is its `base`.
   */
  pseudoElement?: string
  /** Starting values; identity by default. Never read from the DOM. */
  initial?: MotionValues
  /**
   * For a pseudo-element: the values its own stylesheet shows at rest. A
   * value equal to its base needs no holding animation, so the
   * pseudo-element keeps no compositing layer there. Declare only what the
   * stylesheet shows: in development, the first hold dropped warns when the
   * computed style differs.
   */
  base?: MotionValues
  /** Clock in ms on the document timeline's time base. */
  now?: () => number
  /**
   * Runs a callback in the next animation frame, with the frame's timestamp;
   * `requestAnimationFrame` by default. A call from rest reads the start the
   * browser gave it there.
   */
  requestFrame?: (callback: (frame?: number) => void) => void
  /**
   * Renders `x` into this custom property instead of `translate`, for an
   * element whose parts all read one value, such as a row's swipe travel.
   * `y` is not rendered. The value is a `<length>` in px or a plain
   * `<number>`. Registration lets it interpolate. It is inherited, so every
   * part of the element reads it. It animates on the main thread, not the
   * compositor, and every other channel renders as usual.
   * A `companion` is a second custom property that its `map` draws from x in
   * the same keyframes and writes. It shares x's animation and start, so it
   * follows x through every retarget and Reduce Motion plan.
   */
  customProperty?: {
    name: string
    syntax: '<length>' | '<number>'
    companion?: {
      name: string
      syntax: '<length>' | '<number>'
      map: (x: number) => number
    }
  }
}

/**
 * One `animate` / `decay` call's animations.
 */
export interface MotionHandle {
  /** The properties this call drives. */
  readonly properties: ReadonlyArray<MotionProperty>
  /**
   * True when every property reached the end of this call's curve, false
   * as soon as any of them is retargeted, stopped or set before that.
   */
  readonly finished: Promise<boolean>
  /**
   * When the motion started on the document timeline (ms): for a call from
   * rest, the time the browser committed it (a block before the first frame
   * moves it later); otherwise the call time, or `at`. A retarget whose
   * frame comes late starts its springs at that frame, and this stays the
   * call time.
   */
  readonly started: Promise<number>
  /** Presentation value of a property at `time` (default now). */
  value: (property: MotionProperty, time?: number) => number
  /** Presentation velocity of a property at `time`, units/s. */
  velocity: (property: MotionProperty, time?: number) => number
  /**
   * The curve this call started on `property` (`scale` reads `scaleX`),
   * in seconds from the call's start: what the keyframes play. Null for a
   * property the call does not move, or moves without travel (Reduced
   * Motion). Map it onto a companion property with `mapProgress`, and play
   * that on the same clock. A retarget whose frame comes late starts its
   * spring again at that frame, and this stays the curve the call started.
   */
  curve: (property: MotionProperty | 'scale') => MotionCurve | null
  /** New targets for this call's properties, keeping their velocity. */
  retarget: (
    to: MotionValues,
    transition?: SpringTransition,
    options?: AnimateOptions,
  ) => MotionHandle
  /** Freezes this call's properties at their presentation values. */
  stop: () => void
}

/**
 * A compositor animator bound to one element (see the file header).
 */
export interface Animator {
  /**
   * What Reduced Motion makes of a call on this element right now:
   * `'off'` (motion plays), `'crossfade'` (an opacity-only fade: a coarse
   * pointer, or `touchRelease`) or `'instant'` (any other pointer). For
   * feedback that has no fade of its own (a press lift, a lens chasing the
   * finger): skip it unless `'off'`.
   */
  reducedMotion: (options?: {
    touchRelease?: boolean
  }) => 'off' | 'crossfade' | 'instant'
  /** The element the animator writes to, if attached. */
  readonly element: HTMLElement | null
  /**
   * Attaches (or detaches, with null) the element. Attaching writes the
   * current state and resumes running curves from now.
   */
  attach: (element: HTMLElement | null) => void
  /** Presentation value at `time` (default now), from the curve. */
  get: (property: MotionProperty | 'scale', time?: number) => number
  /** Presentation velocity at `time` (default now), units/s. */
  getVelocity: (property: MotionProperty | 'scale', time?: number) => number
  /**
   * Puts values in place now, ending their animations: the per-frame write
   * of a drag (one style write per channel, no animation when nothing else
   * on the channel is moving).
   */
  set: (values: MotionValues, options?: SetOptions) => void
  /** Springs to `to` from the presentation values. */
  animate: (
    to: MotionValues,
    transition: SpringTransition,
    options?: AnimateOptions,
  ) => MotionHandle
  /**
   * Plays given curves (`scale` drives both axes), baked like a spring:
   * presentation values, velocities, `stop`, `finished` and the shared
   * clock work the same, and a later `animate` starts from the curve's
   * value and velocity. Reduced Motion treats a curve that moves x, y, rotate
   * or scale as travel, which the policy replaces (design:reduced-motion: a
   * cross-fade after a touch, an immediate change otherwise). Its handle has
   * no spring of its own: `retarget` needs one.
   */
  play: (
    curves: Partial<Record<MotionProperty | 'scale', MotionCurve>>,
    options?: AnimateOptions,
  ) => MotionHandle
  /**
   * Plays momentum curves as given, on the translate axes only: a released
   * scroll view's coast and edge bounce, which `coast()` (coast.ts) builds
   * from a finger's release velocity. Under Reduce Motion momentum keeps
   * its motion: it continues a throw, direct movement (design:reduced-motion
   * DR2, DEC-2). A curve marked `isTransition` (coast()'s spring back from
   * past an edge) is a transition and plays through the Reduce Motion
   * policy, as `animate` does. Anything else (a fade, a slide a tap starts)
   * is a transition too: play it with `play` or `animate`. Pass
   * `touchRelease` when a touch drag's release starts it, so a spring back
   * cross-fades on any pointer (DR2). Only a surface that coasts imports the
   * coast math and the scroll table.
   */
  decay: (
    curves: Partial<Record<'x' | 'y', MotionCurve>>,
    options?: Pick<AnimateOptions, 'at' | 'touchRelease'>,
  ) => MotionHandle
  /**
   * Moves properties by the given amounts at once, as when a layout shift
   * moves the element under them: a property moving on a spring keeps its
   * spring, velocity and target (the curve restarts from the shifted value);
   * any other moving curve shifts whole, its end included; a resting
   * property takes the offset and stays. `towards` moves some springs whole
   * instead (RebaseOptions).
   */
  rebase: (deltas: MotionValues, options?: RebaseOptions) => void
  /** Freezes properties (all by default) at their presentation values. */
  stop: (properties?: ReadonlyArray<MotionProperty | 'scale'>) => void
  /**
   * Resolves once none of `properties` (every property by default) is moving:
   * after the last curve ends, whoever started it, retargets included.
   */
  atRest: (properties?: ReadonlyArray<MotionProperty | 'scale'>) => Promise<void>
  /** Cancels everything and detaches. */
  dispose: () => void
}

/**
 * Within this of its target a curve is over (in the property's own unit). A
 * curve built outside the animator (a progress curve) settles where a call
 * would with this as its epsilon.
 */
export const SETTLE_THRESHOLD: Record<MotionProperty, number> = {
  x: 0.05,
  y: 0.05,
  rotate: 0.01,
  scaleX: 0.0001,
  scaleY: 0.0001,
  opacity: 0.001,
}
