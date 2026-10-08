import type { BottomSheetSnapPoint } from './types.js'

/**
 * A detent is an offset in px from the fully open position: `0` is fully open
 * and larger values are further collapsed. These helpers turn the caller's
 * snap points into the shared offset list and are pure, so the geometry can be
 * unit-tested without a DOM.
 */

/** Detents whose resting offsets land within this many px of each other are one stop. */
export const DETENT_DEDUP_PX = 48

/** Largest share of the sheet a stop may fill and still count as a peek. */
export const PEEK_MAX_HEIGHT_RATIO = 0.25

/** Scrim opacity at the peek stop: dimmed, never clear, because the sheet stays modal. */
export const MIN_PEEK_SCRIM_OPACITY = 0.3

const SNAP_POINT_PATTERN = /^(\d+(?:\.\d+)?|\.\d+)(px|%)$/i

function parseSnapPoint(point: BottomSheetSnapPoint, viewportPx: number): number | null {
  if (typeof point === 'number') {
    return Number.isFinite(point) && point > 0 && point <= 1 ? point * viewportPx : null
  }
  const match = SNAP_POINT_PATTERN.exec(point.trim())
  if (match === null)
    return null
  const value = Number.parseFloat(match[1])
  if (!(value > 0))
    return null
  return match[2].toLowerCase() === '%' ? (value / 100) * viewportPx : value
}

/** Whether a snap point can be resolved at all; the viewport only scales the result. */
export function isValidSnapPoint(point: BottomSheetSnapPoint): boolean {
  return parseSnapPoint(point, 1) !== null
}

/** Resolves snap points to candidate visible heights in px, dropping unusable ones. */
export function resolveSnapPoints(points: readonly BottomSheetSnapPoint[], viewportPx: number): number[] {
  const heights: number[] = []
  for (const point of points) {
    const height = parseSnapPoint(point, viewportPx)
    if (height !== null)
      heights.push(height)
  }
  return heights
}

/**
 * Resting offsets from fully open, ascending and de-duplicated. `0` is always
 * the first stop; only heights shorter than the sheet become collapsed stops;
 * offsets closer than `dedupPx` collapse to the taller one.
 */
export function computeDetentOffsets(sheetHeight: number, detentHeights: readonly number[], dedupPx: number = DETENT_DEDUP_PX): number[] {
  const collapsed = detentHeights
    .filter(height => height > 0 && height < sheetHeight)
    .map(height => sheetHeight - height)
  const ascending = [0, ...collapsed].sort((a, b) => a - b)

  const deduped: number[] = []
  for (const offset of ascending) {
    const last = deduped[deduped.length - 1]
    if (last === undefined || offset - last >= dedupPx)
      deduped.push(offset)
  }
  return deduped
}

/** Nearest value in `offsets` to `value`; `offsets` must not be empty. */
export function nearestOffset(value: number, offsets: readonly number[]): number {
  return offsets.reduce(
    (best, offset) => (Math.abs(offset - value) < Math.abs(best - value) ? offset : best),
    offsets[0],
  )
}

/**
 * The peek stop's offset, or `null` when this sheet has no peek. A peek is the
 * shortest stop and a sliver: a sheet that keeps the full layout height and
 * slides below the viewport instead of reflowing its content into a sliver.
 */
export function peekOffsetFor(offsets: readonly number[], visibleSheetHeight: number): number | null {
  if (offsets.length < 2 || visibleSheetHeight <= 0)
    return null
  const shortest = offsets[offsets.length - 1]
  const heightAtShortest = visibleSheetHeight - shortest
  return heightAtShortest <= PEEK_MAX_HEIGHT_RATIO * visibleSheetHeight ? shortest : null
}

/**
 * Scrim opacity (1 = fully opaque) for a drag or settle `offset`. It stays
 * opaque down to the shortest working stop and only thins past it, onto a peek
 * or out through the dismissal overshoot.
 */
export function scrimOpacityForOffset(offset: number, offsets: readonly number[], dismissOffset: number, peekOffset: number | null): number {
  const hasPeek = peekOffset !== null
  const fadeStart = hasPeek ? offsets[offsets.length - 2] : offsets[offsets.length - 1]
  const fadeEnd = hasPeek ? peekOffset : dismissOffset
  const floor = hasPeek ? MIN_PEEK_SCRIM_OPACITY : 0
  if (offset <= fadeStart)
    return 1
  if (offset >= fadeEnd)
    return floor
  return 1 - (1 - floor) * ((offset - fadeStart) / (fadeEnd - fadeStart))
}

/**
 * Settle target for a released drag, restricted to the drag direction so a
 * committed drag never snaps back past where it started. `dir`: 1 = dragged
 * down, -1 = up, 0 = neither.
 */
export function resolveSettleOffset(value: number, offsets: readonly number[], dir: number, baseOffset: number): number {
  let candidates: readonly number[] = offsets
  if (dir > 0) {
    const downward = offsets.filter(offset => offset >= baseOffset)
    if (downward.length > 0)
      candidates = downward
  }
  else if (dir < 0) {
    const upward = offsets.filter(offset => offset <= baseOffset)
    if (upward.length > 0)
      candidates = upward
  }
  return nearestOffset(value, candidates)
}

/** The visible height of the sheet at a resting `offset`. */
export function visibleHeightForOffset(sheetHeight: number, offset: number, offscreenBlockEndInset: number): number {
  return Math.max(0, sheetHeight - offscreenBlockEndInset - offset)
}
