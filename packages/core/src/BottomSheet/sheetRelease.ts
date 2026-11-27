import { resolveSnapPoint } from '../motion/resolveSnapPoint'
import { sheet } from '../motion/uikit/sheet'
import { dismissTravelFor, DRAG_PROMOTION_SLOP } from './sheetDragMath.js'
import { resolveSettleOffset, visibleHeightForOffset } from './snapOffsets.js'

/** A drag's close: the distance left to the closed position and the speed. */
export interface SheetDragExit {
  /** px from the release position to the closed position. */
  readonly distance: number
  /** The release velocity, px/s, positive toward closed. */
  readonly velocity: number
}

/** Where a drag's release takes the sheet. */
export type SheetRelease
  = | { readonly kind: 'settle', readonly target: number }
    | { readonly kind: 'close', readonly exit: SheetDragExit | null }

export interface SheetReleaseInput {
  /** The release position, px from fully open, never above it. */
  offset: number
  /** The release velocity, px/ms, positive toward closed. */
  velocity: number
  /** The sheet's measured height, reserve included. */
  height: number
  /** The drag's direction: 1 down, -1 up, 0 none. */
  dir: number
  /** px the pointer travelled from where the drag began. */
  travel: number
  /** The stop the drag began at. */
  baseOffset: number
  /** Stop offsets, ascending; the last one is the shortest stop. */
  offsets: readonly number[]
  /** How far the sheet's surface reaches below the screen. */
  reserve: number
  /** Whether a finger made the drag. */
  isTouch: boolean
}

/** The scroll view's deceleration, as a mouse or pen release coasts on it. */
const DECELERATION_RATE = 0.998
const PROJECTION_FACTOR = DECELERATION_RATE / (1 - DECELERATION_RATE) // ms
/** A mouse or pen release shorter than this is judged where it was let go. */
const PROJECTION_MIN_TRAVEL = 48

/**
 * A touch release takes UIKit's sheet values, with closed counted as one more
 * position. It is projected 0.1 s ahead, a release under 250 px/s is not
 * projected, and from 1008 px/s it is a flick that lands on the first position
 * at or past its projection. A release moving back toward where the drag
 * began cancels to that stop.
 */
function resolveTouchRelease(input: SheetReleaseInput): SheetRelease {
  const { offsets, height, offset, velocity } = input
  const maxOffset = offsets[offsets.length - 1] ?? 0
  const shortestHeight = visibleHeightForOffset(height, maxOffset, input.reserve)
  const { fastSpeed, minProjectionSpeed, projectionSeconds, detentTolerance } = sheet.release
  const points = [...offsets, maxOffset + shortestHeight]
  const { index } = resolveSnapPoint({
    points,
    position: offset,
    velocity: velocity * 1000,
    flickThreshold: input.travel > DRAG_PROMOTION_SLOP ? fastSpeed : Number.POSITIVE_INFINITY,
    tolerance: detentTolerance,
    flickPastProjection: true,
    projection: { seconds: projectionSeconds, minSpeed: minProjectionSpeed },
    start: input.baseOffset,
  })
  if (index === points.length - 1)
    return { kind: 'close', exit: { distance: Math.max(0, height - offset), velocity: velocity * 1000 } }
  return { kind: 'settle', target: points[index] ?? maxOffset }
}

/**
 * A mouse or pen release coasts on the scroll view's deceleration. One that
 * would coast past the dismiss line closes the sheet; any other settles on
 * the stop nearest where it would come to rest, in the drag's direction.
 */
function resolvePointerRelease(input: SheetReleaseInput): SheetRelease {
  const { offsets, offset } = input
  const maxOffset = offsets[offsets.length - 1] ?? 0
  const projected = input.travel > PROJECTION_MIN_TRAVEL ? offset + input.velocity * PROJECTION_FACTOR : offset
  if (input.dir > 0 && projected > dismissTravelFor(input.height, offsets, input.reserve))
    return { kind: 'close', exit: null }
  const clamped = Math.min(Math.max(projected, 0), maxOffset)
  return { kind: 'settle', target: resolveSettleOffset(clamped, offsets, input.dir, input.baseOffset) }
}

/** Where a drag's release takes the sheet: a stop to settle on, or the close. */
export function resolveSheetRelease(input: SheetReleaseInput): SheetRelease {
  return input.isTouch ? resolveTouchRelease(input) : resolvePointerRelease(input)
}
