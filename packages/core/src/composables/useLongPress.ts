import type { MaybeRefOrGetter } from 'vue'
import { getCurrentScope, onScopeDispose, toValue } from 'vue'
import { LONG_PRESS_ALLOWABLE_MOVEMENT_PX, LONG_PRESS_DURATION_MS } from '../motion/uikit/longPress'
import { msSinceInput } from '../utils/inputAge'
import { claimPress } from '../utils/pressClaim'

interface Point {
  x: number
  y: number
}

export interface LongPressOptions {
  /** Fired with the press point once the finger is held for `delayMs`. */
  onLongPress: (point: Point) => void
  /** Read on each press. `true` keeps the detector inert. */
  isDisabled?: MaybeRefOrGetter<boolean>
  /** The same switch as `isDisabled`, under the original name. Either one being true keeps the detector inert. */
  disabled?: MaybeRefOrGetter<boolean>
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
  /** Touch listeners for the target element, ready to spread: `<div v-on="longPress.handlers">`. */
  handlers: {
    onTouchStart: (event: TouchEvent) => void
    onTouchMove: (event: TouchEvent) => void
    onTouchEnd: (event: TouchEvent) => void
    onTouchCancel: (event: TouchEvent) => void
  }
}

// 长按的两个数只有一个出处，和手势识别器共用（motion/uikit/longPress.ts）。
const DEFAULT_DELAY_MS = LONG_PRESS_DURATION_MS
const DEFAULT_MOVE_CANCEL_PX = LONG_PRESS_ALLOWABLE_MOVEMENT_PX

function touchPoint(event: TouchEvent): Point | null {
  const touch = event.touches?.[0] ?? event.changedTouches?.[0]
  return touch == null ? null : { x: touch.clientX, y: touch.clientY }
}

/**
 * 对应原版 Astryx 的 `hooks/useLongPress`。
 *
 * Detect a single-finger long press.
 *
 * iOS Safari never synthesizes a `contextmenu` event for a held finger, so a
 * long press is the only touch affordance that can open a cursor-positioned
 * surface. The press is cancelled when the finger travels past the tolerance,
 * lifts, a second finger lands, or the touch is cancelled.
 *
 * 两种绑法，同一个检测器：直接要触摸监听时把 `handlers` 摊到元素上；
 * 自己已经在跑指针事件状态机时（`useMenuPress` 就是）调 `start` / `moveTo` / `cancel`。
 * 按住时长、移动容差、计时器都在这里，所以长按在右键菜单和菜单触发器上是同一个意思。
 */
export function useLongPress(options: LongPressOptions): LongPressHandlers {
  const delayMs = options.delayMs ?? DEFAULT_DELAY_MS
  const moveCancelPx = options.moveCancelPx ?? DEFAULT_MOVE_CANCEL_PX

  let timer: ReturnType<typeof setTimeout> | null = null
  let origin: Point | null = null
  /** 触摸事件自己的时钟上，这次按住到期的时刻。页面忙的时候事件晚到，时刻不会晚。 */
  let deadline: number | null = null

  function isDisabled(): boolean {
    return toValue(options.isDisabled) === true || toValue(options.disabled) === true
  }

  function cancel(): void {
    if (timer != null) {
      clearTimeout(timer)
      timer = null
    }
    origin = null
    deadline = null
  }

  function fire(): void {
    const from = origin
    timer = null
    deadline = null
    if (from == null)
      return
    // 这次按压已经起了作用，抬手不算轻点：手指下的控件框不再自己补一次点击。
    claimPress()
    options.onLongPress({ x: from.x, y: from.y })
  }

  /** 事件的时间戳到了按住的时刻：先把这次长按报出去，再处理这个事件（移动、抬起、第二根手指）。 */
  function reportIfDue(event: TouchEvent): void {
    if (timer == null || deadline == null || !(event.timeStamp >= deadline))
      return
    clearTimeout(timer)
    fire()
  }

  /** `age` 是起手事件已经晚到了多久：计时器只等剩下的那一段，晚到的触摸不会把按住的时间拉长。 */
  function start(point: Point, age = 0): void {
    if (isDisabled())
      return
    // Clearing also nulls the origin, so the order matters.
    cancel()
    origin = { x: point.x, y: point.y }
    timer = setTimeout(fire, Math.max(0, delayMs - age))
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

  /**
   * A press needs exactly one finger. A second one cancels it, the way a
   * lift does.
   */
  function onTouchStart(event: TouchEvent): void {
    if ((event.touches?.length ?? 0) !== 1) {
      reportIfDue(event)
      cancel()
      return
    }
    const point = touchPoint(event)
    if (point == null)
      return
    // 按触摸自己那个窗口的时钟算它晚到了多久（utils/inputAge.ts）。
    start(point, msSinceInput(event.timeStamp, event))
    if (timer != null && Number.isFinite(event.timeStamp))
      deadline = event.timeStamp + delayMs
  }

  function onTouchMove(event: TouchEvent): void {
    if (origin == null)
      return
    reportIfDue(event)
    if ((event.touches?.length ?? 0) > 1) {
      cancel()
      return
    }
    const point = touchPoint(event)
    if (point != null)
      moveTo(point)
  }

  function onTouchEnd(event: TouchEvent): void {
    reportIfDue(event)
    cancel()
  }

  function onTouchCancel(): void {
    cancel()
  }

  if (getCurrentScope() != null)
    onScopeDispose(cancel)

  return {
    cancel,
    handlers: { onTouchCancel, onTouchEnd, onTouchMove, onTouchStart },
    moveTo,
    start,
  }
}
