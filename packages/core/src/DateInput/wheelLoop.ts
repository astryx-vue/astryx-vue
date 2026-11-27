/**
 * @file wheelLoop.ts
 * @input Nothing; pure functions over a looping wheel's positions
 * @output mod, nearestLoopCopy, lapPosition, restingLoopStep, loopedStep,
 *   restingSpan and coveringSpan: how a wheel whose rows repeat without end
 *   names, reaches and draws its rows
 * @position Internal; read by useTouchWheel.ts for UIDatePicker's looping
 *   minute wheel
 *
 * A looping wheel's position is any integer. The row it shows is that integer
 * folded into the rows (`mod`), so positions one lap apart show the same row.
 */

/** `value` folded into 0 … count − 1. */
export function mod(value: number, count: number): number {
  return ((value % count) + count) % count
}

/**
 * The copy of row `index` nearest position `from`, in a loop of `count` rows.
 * Two copies can be equally near: with two rows, or half an even count away.
 * Then it is `index` itself when that is one of them, so a step to `from + 1`
 * always goes forward.
 */
export function nearestLoopCopy(index: number, from: number, count: number): number {
  if (Math.abs(index - from) * 2 <= count)
    return index
  return Math.round(from + (((mod(index, count) - mod(from, count) + count + count / 2) % count) - count / 2))
}

/** The position of row `row` in the lap that holds `position`: the copy between the same two seams. */
export function lapPosition(row: number, position: number, count: number): number {
  if (count === 0)
    return row
  return row + Math.floor(position / count) * count
}

/**
 * How many rows, signed, a looping wheel resting at `position` travels to the
 * nearest enabled row: 0 when that row is enabled. A tie goes toward `toward`,
 * the committed row's position. The search stops half a turn away, so a rest
 * never turns the long way round. With no enabled row that near, the wheel
 * travels to `toward`.
 *
 * @example
 * ```ts
 * // Months, looping, with only January and February enabled: a rest on
 * // December (position 11) turns one row on to January.
 * restingLoopStep(p => p % 12 < 2, 11, 1, 12) // 1
 * ```
 */
export function restingLoopStep(
  isEnabledAt: (position: number) => boolean,
  position: number,
  toward: number,
  count: number,
): number {
  if (isEnabledAt(position))
    return 0
  for (let distance = 1; distance <= count / 2; distance++) {
    const isBelowEnabled = isEnabledAt(position - distance)
    const isAboveEnabled = isEnabledAt(position + distance)
    if (isBelowEnabled && isAboveEnabled)
      return toward < position ? -distance : distance
    if (isBelowEnabled)
      return -distance
    if (isAboveEnabled)
      return distance
  }
  return toward - position
}

/**
 * How many rows, signed, a key moves a looping wheel of `count` rows from
 * position `from` by `delta` rows, in list order. Whole laps fall off `delta`,
 * so a key never turns a whole lap. The key takes the next enabled row from
 * its target in its own direction, across the seam, at most half a turn from
 * `from`. Failing that, it takes the enabled row nearest its target on the way
 * back. Null when it finds no other row, so it commits nothing.
 *
 * @example
 * ```ts
 * // Minutes 00-59, looping: ArrowDown on :59 moves one row on, to :00.
 * loopedStep(() => true, 59, 1, 60) // 1
 * ```
 */
export function loopedStep(
  isEnabledAt: (position: number) => boolean,
  from: number,
  delta: number,
  count: number,
): number | null {
  const step = Math.sign(delta)
  const rows = count < 2 ? 0 : Math.abs(delta) % count
  if (rows === 0)
    return null
  const target = from + step * rows
  const reach = Math.max(rows, Math.floor(count / 2))
  for (let position = target; Math.abs(position - from) <= reach; position += step) {
    if (isEnabledAt(position))
      return position - from
  }
  for (let position = target - step; position !== from; position -= step) {
    if (isEnabledAt(position))
      return position - from
  }
  return null
}

/** The positions a looping wheel draws rows at, first and last. */
export interface LoopSpan {
  readonly from: number
  readonly to: number
}

/**
 * How many rows a looping wheel draws past the band each way, beyond its own
 * rows and any motion's span: more than half the column.
 */
export const DRAWN_PAST_BAND = 10

/** A looping wheel's span at rest: its own rows, and copies past each end. */
export function restingSpan(count: number): LoopSpan {
  return { from: -DRAWN_PAST_BAND, to: count - 1 + DRAWN_PAST_BAND }
}

/** `span` grown to cover positions `a` to `b` and the band's surroundings; the same span when it already does. */
export function coveringSpan(span: LoopSpan, a: number, b: number): LoopSpan {
  const from = Math.min(span.from, Math.min(a, b) - DRAWN_PAST_BAND)
  const to = Math.max(span.to, Math.max(a, b) + DRAWN_PAST_BAND)
  return from === span.from && to === span.to ? span : { from, to }
}
