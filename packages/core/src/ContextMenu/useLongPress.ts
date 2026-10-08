import { onBeforeUnmount, toValue } from 'vue'

interface Point {
  x: number
  y: number
}

export interface LongPressOptions {
  /** Fired with the press point once the finger is held for `delayMs`. */
  onLongPress: (point: Point) => void
  /** When true, the detector is inert. */
  isDisabled: () => boolean
  /** Hold duration before the press fires, in ms. */
  delayMs?: number
  /** Movement past this distance on either axis cancels the press. */
  moveCancelPx?: number
}

export interface LongPressHandlers {
  /** Begin detection at a point. */
  start: (point: Point) => void
  /** Report the pointer's new position; past the tolerance the press is off. */
  moveTo: (point: Point) => boolean
  /** Drop any pending press. */
  cancel: () => void
}

const DEFAULT_DELAY_MS = 500
const DEFAULT_MOVE_CANCEL_PX = 10

/**
 * Detect a single-finger long press.
 *
 * iOS Safari never synthesizes a `contextmenu` event for a held finger, so a
 * long press is the only touch affordance that can open a cursor-positioned
 * surface. The press is cancelled when the finger travels past the tolerance,
 * lifts, or the touch is cancelled.
 */
export function useLongPress(options: LongPressOptions): LongPressHandlers {
  const delayMs = options.delayMs ?? DEFAULT_DELAY_MS
  const moveCancelPx = options.moveCancelPx ?? DEFAULT_MOVE_CANCEL_PX

  let timer: ReturnType<typeof setTimeout> | null = null
  let origin: Point | null = null

  function cancel(): void {
    if (timer != null) {
      clearTimeout(timer)
      timer = null
    }
    origin = null
  }

  function start(point: Point): void {
    if (toValue(options.isDisabled))
      return
    // Clearing also nulls the origin, so the order matters.
    cancel()
    origin = { x: point.x, y: point.y }
    timer = setTimeout(() => {
      const from = origin
      timer = null
      if (from == null)
        return
      options.onLongPress({ x: from.x, y: from.y })
    }, delayMs)
  }

  function moveTo(point: Point): boolean {
    if (origin == null)
      return false
    if (Math.abs(point.x - origin.x) > moveCancelPx || Math.abs(point.y - origin.y) > moveCancelPx) {
      cancel()
      return false
    }
    return true
  }

  onBeforeUnmount(cancel)

  return { cancel, moveTo, start }
}
