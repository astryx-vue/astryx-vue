import { visibleHeightForOffset } from './snapOffsets.js'

/** Border-box portion of the panel reserved below the viewport for the drag lift. */
export const OVERSCROLL_PADDING = 48

/** A throw this fast, over at least `FLICK_MIN_DISTANCE`, dismisses or expands outright. */
export const FLICK_VELOCITY = 1.2
export const FLICK_MIN_DISTANCE = 48
/** Below the shortest stop, dragging past it by this share of its height dismisses. */
export const DISMISS_OVERSHOOT_RATIO = 0.4
/** How far a finger on the body must pull before it becomes a sheet drag. */
export const DRAG_PROMOTION_SLOP = 8

/** Within this many px of a stop the live drag eases toward it. */
const MAGNET_RANGE = 40
/** Rubber-band factor and ceiling for dragging above the fully open position. */
const OVERSCROLL_RESISTANCE = 0.35
const OVERSCROLL_MAX = 48
const VELOCITY_WINDOW_MS = 100

export interface VelocitySample {
  y: number
  t: number
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

/** Finger speed over the last `VELOCITY_WINDOW_MS`, in px/ms. */
export function velocityFor(
  samples: readonly VelocitySample[],
  lastY: number,
  lastT: number,
  startY: number,
  startT: number,
): number {
  const withinWindow = samples.filter(sample => lastT - sample.t <= VELOCITY_WINDOW_MS)
  const first = withinWindow[0] ?? { y: startY, t: startT }
  const elapsed = lastT - first.t
  return elapsed > 0 ? (lastY - first.y) / elapsed : 0
}

/** Live offset for a drag, rubber-banding above fully open and easing near a stop. */
export function dragOffsetFrom(baseOffset: number, delta: number, stops: readonly number[]): { raw: number, shown: number } {
  let offset = baseOffset + delta
  if (offset < 0)
    offset = -Math.min(-offset * OVERSCROLL_RESISTANCE, OVERSCROLL_MAX)
  return { raw: offset, shown: magnetize(offset, stops) }
}

/** Offset past which a slow downward drag dismisses instead of snapping back. */
export function dismissTravelFor(height: number, offsets: readonly number[]): number {
  const maxOffset = offsets[offsets.length - 1] ?? 0
  const shortestHeight = visibleHeightForOffset(height, maxOffset, OVERSCROLL_PADDING)
  return maxOffset + shortestHeight * DISMISS_OVERSHOOT_RATIO
}

function hasBlockScroll(element: HTMLElement): boolean {
  return element.scrollHeight > element.clientHeight + 1
}

/**
 * Whether every scroller from `target` up to `root` is at its block edge.
 * A nested box that can still scroll keeps the gesture; the sheet does not
 * take it until that box has nowhere left to go.
 */
export function blockScrollEdges(root: HTMLElement, target: EventTarget | null): { atTop: boolean, atBottom: boolean } {
  let atTop = true
  let atBottom = true
  let node: Element | null = target instanceof Element ? target : root
  while (node != null) {
    if (node instanceof HTMLElement && hasBlockScroll(node)) {
      if (node.scrollTop > 1)
        atTop = false
      if (node.scrollTop + node.clientHeight < node.scrollHeight - 1)
        atBottom = false
    }
    if (node === root)
      break
    node = node.parentElement
  }
  return { atTop, atBottom }
}
