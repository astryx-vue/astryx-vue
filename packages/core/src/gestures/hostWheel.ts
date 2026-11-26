/**
 * @file hostWheel.ts
 * @input Wheel events
 * @output The gesture host's wheel constants, its wheel gesture and follow
 *   records, and their pure helpers, scrollTypeOf among them
 * @position Shared by the wheel layers of GestureHost.ts; scrollTypeOf is
 *   re-exported there
 */

import type { GestureRecognizer } from './GestureRecognizer'
import type {
  ScrollType,
} from './types'

/**
 * How long after its last event a pinch or a mouse wheel's notches end, ms.
 * The web reports no wheel phases, so a quiet wheel is a lifted one.
 */
export const WHEEL_END_MS = 100
/**
 * How long after its last event a vertical trackpad scroll ends, ms (a
 * sheet's pull), whoever keeps it. A slow drag's stream pauses longer than
 * WHEEL_END_MS between events.
 */
export const WHEEL_FOLLOW_END_V_MS = 180
/**
 * The same horizontally, ms (a pager's or a row's swipe), whose slow
 * swipes pause longer still.
 */
export const WHEEL_FOLLOW_END_MS = 220
/** A line-mode wheel's line, px, as the platforms scroll it. */
export const WHEEL_LINE_PX = 40
/** The span a ctrl-wheel pinch's two contacts start at, px. */
export const WHEEL_PINCH_SPAN = 100

/** A wheel gesture: the contacts it drives in the arena, or none where the page keeps it. */
export interface WheelGesture {
  readonly kind: 'pan' | 'pinch'
  /** A mouse wheel's notches, or a trackpad's continuous scroll. */
  readonly scrollType: ScrollType
  readonly ids: ReadonlyArray<number>
  /** A pan's contact, or a pinch's center. */
  x: number
  y: number
  /** A pinch's span between its two contacts. */
  span: number
  /** The latest wheel's time. */
  last: number
  /**
   * How long after its last wheel it ends, ms. A trackpad pan stream waits
   * out its axis's pause bound, whoever keeps it. A pinch or a mouse wheel's
   * notches wait 100 ms.
   */
  readonly endMs: number
  timer: unknown
  /** The recognizers that took it; none where the page keeps it. */
  readonly takers: ReadonlyArray<GestureRecognizer>
  /** A trackpad scroll a pan follows, until its fingers lift. */
  follow?: WheelFollow
}

/** A trackpad scroll a pan follows: where its fingers lift, and what waits until then. */
export interface WheelFollow {
  /** The fingers lifted: the momentum after them never moves the pan. */
  lifted: boolean
  /**
   * Shrinking deltas held until the splitter decides. They are the fingers'
   * when larger ones follow, and the start of momentum when it reads the
   * lift.
   */
  heldX: number
  heldY: number
  /** The time of the fingers' last move the pan took. */
  lastMove: number
  /** The fingers' travel as of that move: the contact without any held delta. */
  trueX: number
  trueY: number
  /** Where the pan was shown at that move, which the undecided stretch moves on from. */
  baseX: number
  baseY: number
  /** The fingers' speed at that move, content px per ms. */
  speedX: number
  speedY: number
  /**
   * The reading behind that speed: the fingers' travel where it began, and
   * its interval in ms.
   */
  readFromX: number
  readFromY: number
  readSpan: number
  /** The fingers' speed before that reading, content px per ms. */
  priorSpeedX: number
  priorSpeedY: number
}

/**
 * How long after its last wheel a wheel gesture ends, ms. A trackpad's
 * two-finger scroll waits out a slow drag's pauses for its axis, whoever
 * keeps the stream. A pinch and a mouse wheel's notches end 100 ms after
 * their last wheel.
 */
export function wheelEndMs(
  kind: 'pan' | 'pinch',
  scrollType: ScrollType,
  isHorizontal: boolean,
): number {
  if (kind === 'pinch' || scrollType !== 'continuous') {
    return WHEEL_END_MS
  }
  return isHorizontal ? WHEEL_FOLLOW_END_MS : WHEEL_FOLLOW_END_V_MS
}

/**
 * A provisional lead `debt` after a move of `moved`. The debt is what a
 * followed pan shows past the fingers' travel, or short of it. Half the move
 * is absorbed, so the pan keeps moving the way the fingers do.
 */
export function absorbedDebt(debt: number, moved: number): number {
  return Math.sign(debt) * Math.max(0, Math.abs(debt) - Math.abs(moved) / 2)
}

/**
 * A stall held a bunched wheel's frames back, and the move just before it took
 * their time. So the wheel joins that move's reading. It can restore what the
 * late move lowered, but never passes the speed before it.
 */
export function joinReading(f: WheelFollow, trueX: number, trueY: number): void {
  if (f.readSpan <= 0) {
    return
  }
  f.speedX = joinedSpeed(
    f.speedX,
    (trueX - f.readFromX) / f.readSpan,
    f.priorSpeedX,
  )
  f.speedY = joinedSpeed(
    f.speedY,
    (trueY - f.readFromY) / f.readSpan,
    f.priorSpeedY,
  )
}

/**
 * A joined reading, held to the speed before the late move. It only ever
 * raises the current speed, in the current direction.
 */
export function joinedSpeed(current: number, reading: number, prior: number): number {
  const held
    = Math.sign(reading) * Math.min(Math.abs(reading), Math.abs(prior))
  return held * current >= 0 && Math.abs(held) > Math.abs(current)
    ? held
    : current
}

/**
 * `target` where it is ahead of `shown` in the direction of `speed`, else
 * `shown`: a reconcile that never steps back.
 */
export function ahead(shown: number, target: number, speed: number): number {
  return speed === 0 || (target - shown) * Math.sign(speed) > 0
    ? target
    : shown
}

/**
 * A wheel's deltas in CSS px: a line is `WHEEL_LINE_PX`, a page the
 * viewport.
 */
export function wheelPixels(
  wheel: WheelEvent,
  view: Window | null,
): { dx: number, dy: number } {
  if (wheel.deltaMode === 1) {
    return { dx: wheel.deltaX * WHEEL_LINE_PX, dy: wheel.deltaY * WHEEL_LINE_PX }
  }
  if (wheel.deltaMode === 2) {
    return {
      dx: wheel.deltaX * (view?.innerWidth ?? 0),
      dy: wheel.deltaY * (view?.innerHeight ?? 0),
    }
  }
  return { dx: wheel.deltaX, dy: wheel.deltaY }
}

/**
 * The web's best reading of what scrolled: a mouse wheel's notches
 * (`discrete`) or a trackpad's scroll (`continuous`). Input it cannot tell
 * apart counts as a mouse wheel's, which a pan that takes only a trackpad's
 * scroll leaves to the page. These read as a mouse wheel's:
 * - a line- or page-mode delta;
 * - a scroll with Shift held (Shift+wheel);
 * - a pixel delta a hair off a whole pixel (a mouse wheel on Windows);
 * - a scroll with no legacy `wheelDelta` (an engine that sends none);
 * - a delta that is not a third of its legacy `wheelDelta`;
 * - a 120 tick over a 40 px delta.
 * A trackpad's precise deltas, a third of their legacy `wheelDelta` in
 * Chromium and WebKit, read as a trackpad's.
 */
export function scrollTypeOf(wheel: WheelEvent): ScrollType {
  if (wheel.deltaMode !== 0 || wheel.shiftKey) {
    return 'discrete'
  }
  const remainder = (value: number): boolean => {
    const fraction = Math.abs(value - Math.round(value))
    return fraction > 0 && fraction < 0.01
  }
  if (remainder(wheel.deltaX) || remainder(wheel.deltaY)) {
    return 'discrete'
  }
  const legacy = wheel as WheelEvent & {
    wheelDeltaX?: number
    wheelDeltaY?: number
  }
  if (
    typeof legacy.wheelDeltaY !== 'number'
    || typeof legacy.wheelDeltaX !== 'number'
  ) {
    return 'discrete'
  }
  const precise = (delta: number, legacyDelta: number): boolean =>
    delta === 0
      ? legacyDelta === 0
      : Math.abs(Math.abs(legacyDelta) - 3 * Math.abs(delta))
        <= Math.max(1.5, 0.05 * Math.abs(delta) * 3)
  if (
    !precise(wheel.deltaY, legacy.wheelDeltaY)
    || !precise(wheel.deltaX, legacy.wheelDeltaX)
  ) {
    return 'discrete'
  }
  const tick = (delta: number, legacyDelta: number): boolean =>
    legacyDelta !== 0 && legacyDelta % 120 === 0 && delta % 40 === 0
  return tick(wheel.deltaY, legacy.wheelDeltaY)
    || tick(wheel.deltaX, legacy.wheelDeltaX)
    ? 'discrete'
    : 'continuous'
}
