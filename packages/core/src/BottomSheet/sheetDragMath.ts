import { rubberBand } from '../motion/rubberBand'
import { scroll } from '../motion/uikit/scroll'
import { visibleHeightForOffset } from './snapOffsets.js'

/**
 * The smallest reserve: how far the sheet's surface reaches below the screen,
 * so a pull past the top never shows the page under it. A mouse's or a pen's
 * stretch never passes it.
 */
export const MIN_RESERVE = 48
/** On a touch device the reserve covers a pull of the whole viewport: 40% of it. */
const RESERVE_VIEWPORT_SHARE = 0.4

/** Below the shortest stop, a slow mouse drag past this share of its height dismisses. */
export const DISMISS_OVERSHOOT_RATIO = 0.4
/**
 * How far a finger resting on the body moves before the pull becomes a drag.
 * A tap on a control in the sheet must not start a drag, which would turn off
 * the panel's transition and cut the close the tap caused.
 */
export const DRAG_PROMOTION_SLOP = 8

/** Within this many px of a stop the live drag eases toward it. */
const MAGNET_RANGE = 40
/** A mouse's or a pen's stretch past fully open: a resisted fraction, capped at MIN_RESERVE. */
const OVERSCROLL_RESISTANCE = 0.35
const OVERSCROLL_MAX = MIN_RESERVE

/** The reserve a sheet keeps on a touch device whose layout viewport is `viewportHeight` tall. */
export function sheetReserve(viewportHeight: number): number {
  return Math.max(MIN_RESERVE, Math.ceil(viewportHeight * RESERVE_VIEWPORT_SHARE))
}

/**
 * Whether a gesture that lands on `target` began inside another layer rendered
 * in this sheet's content: a `<dialog>` between the target and the body.
 * A sheet or Dialog opened from inside a sheet renders its dialog as a
 * descendant of the host's body, so its pointer and touch events bubble
 * through the host's listeners. That gesture is the layer's own: the host
 * neither arms a drag on it nor takes the pointer for it.
 *
 * A control that pans vertically on its own (a picker wheel, marked
 * `data-astryx-owns-pan`) keeps its gesture the same way: a downward drag on
 * it turns its rows and never pulls the sheet.
 */
export function isInsideNestedLayer(target: EventTarget | null, body: HTMLElement): boolean {
  for (
    let element = target instanceof Element ? target : null;
    element != null && element !== body;
    element = element.parentElement
  ) {
    if (element.localName === 'dialog' || element.hasAttribute('data-astryx-owns-pan'))
      return true
  }
  return false
}

export function magnetize(value: number, targets: readonly number[]): number {
  if (targets.length === 0)
    return value
  let nearest = targets[0]
  for (const target of targets) {
    if (Math.abs(target - value) < Math.abs(nearest - value))
      nearest = target
  }
  const distance = Math.abs(value - nearest)
  if (distance >= MAGNET_RANGE)
    return value
  const t = distance / MAGNET_RANGE
  return value + (nearest - value) * (1 - t * t)
}

export interface StretchContext {
  /** The pointer's kind: a finger stretches on the iOS rubber band, a mouse or a pen on a capped fraction. */
  pointerType: string
  /** The sheet's measured height, reserve included. */
  height: number
  /** How far the sheet's surface reaches below the screen. */
  reserve: number
}

/**
 * The offset a drag shows for the raw offset `raw` under the finger. Past
 * fully open, a finger stretches on UIKit's rubber band over the visible
 * height and never past the reserve; a mouse or a pen moves a resisted
 * fraction capped at MIN_RESERVE. Past the shortest stop nothing pulls, so it
 * never fights a drag to close. Between stops, the drag eases into a stop
 * within MAGNET_RANGE.
 */
export function stretchedOffset(raw: number, offsets: readonly number[], context: StretchContext): number {
  if (raw < 0) {
    return context.pointerType === 'touch'
      ? Math.max(-context.reserve, rubberBand(raw, context.height - context.reserve, scroll.rubberBand.coefficient))
      : Math.max(-OVERSCROLL_MAX, raw * OVERSCROLL_RESISTANCE)
  }
  if (raw > (offsets[offsets.length - 1] ?? 0))
    return raw
  return magnetize(raw, offsets)
}

function renderedBlockEndPadding(element: HTMLElement): number {
  const value = Number.parseFloat(getComputedStyle(element).paddingBlockEnd)
  return Number.isFinite(value) ? value : 0
}

/** How much further the body could scroll on its own, ignoring the inset this hook adds. */
export function naturalEndGapFor(body: HTMLElement | null): number {
  if (!body)
    return 0
  const inset = renderedBlockEndPadding(body)
  const maxScrollTop = Math.max(0, body.scrollHeight - body.clientHeight - inset)
  return maxScrollTop - body.scrollTop
}

export function hapticTick(): void {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function')
    return
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
    return
  navigator.vibrate(8)
}

/** Offset past which a slow mouse or pen drag dismisses instead of snapping back. */
export function dismissTravelFor(height: number, offsets: readonly number[], reserve: number): number {
  const maxOffset = offsets[offsets.length - 1] ?? 0
  const shortestHeight = visibleHeightForOffset(height, maxOffset, reserve)
  return maxOffset + shortestHeight * DISMISS_OVERSHOOT_RATIO
}
