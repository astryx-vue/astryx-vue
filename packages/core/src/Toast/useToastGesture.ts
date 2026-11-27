import { onScopeDispose, shallowRef, watch } from 'vue'
import { hasInteractiveAncestor } from '../composables/useClickableContainer.js'
import { PanGestureRecognizer } from '../gestures/PanGestureRecognizer'
import { useGestureRecognizer } from '../gestures/useGestureRecognizer'

const DRAG_PROMOTION_SLOP = 8
const SWIPE_DISMISS_RATIO = 0.4
/** 卡片太矮、40% 高度不到这个距离时，拖过这么远才算关闭。 */
const SWIPE_DISMISS_MIN_DISTANCE = 48
/** 松手时的平均速度（px/ms）到这个值就关闭，不看拖了多远。 */
const FLICK_VELOCITY = 1.2
const VERTICAL_INTENT_RATIO = 1.2
const SWIPE_EXIT_DISTANCE = '120%'
const SWIPE_ACTIVE_FADE_MAX = 0.4
const SWIPE_ACTIVE_SCALE_MAX = 0.02
const SWIPE_EXTRA_TARGET = '[tabindex],[contenteditable]:not([contenteditable="false"])'

/** 1 朝下甩出，-1 朝上甩出。 */
export type ToastGestureDirection = 1 | -1

interface GesturePoint {
  source: 'touch' | 'pen'
  pointerId: number
  clientX: number
  clientY: number
  /** 输入事件自带的 timeStamp，也就是手指真正在那儿的时刻；处理函数可能晚一两帧才跑。 */
  time: number
}

interface GestureState {
  source: GesturePoint['source']
  pointerId: number
  startX: number
  startY: number
  startTime: number
  direction: ToastGestureDirection
  intent: 'pending' | 'vertical' | 'opposite'
  pausedTimer: boolean
  surfaceSize: number
  dismissThreshold: number
}

export interface UseToastGestureOptions {
  direction: () => ToastGestureDirection
  enabled: () => boolean
  canPauseTimer: () => boolean
  isTimerPaused: () => boolean
  pauseTimer: () => void
  resumeTimer: () => void
  dismiss: () => void
}

function swipeProgress(travel: number, surfaceSize: number): number {
  return Math.min(Math.max(travel / surfaceSize, 0), 1)
}

function clearTransientStyles(root: HTMLElement): void {
  root.style.removeProperty('transition-duration')
  root.style.removeProperty('--_toast-swipe-y')
  root.style.removeProperty('--_toast-swipe-exit-y')
  root.style.removeProperty('--_toast-swipe-opacity')
  root.style.removeProperty('--_toast-swipe-scale')
}

/** 点在卡片里的按钮、链接或可聚焦控件上时，滑动让给那个控件。 */
function shouldIgnoreTarget(target: EventTarget | null, root: HTMLElement): boolean {
  if (!(target instanceof Element) || target === root)
    return false
  if (hasInteractiveAncestor(target, root))
    return true
  let current: Element | null = target
  while (current != null && current !== root && current !== document.body) {
    if (current.matches(SWIPE_EXTRA_TARGET))
      return true
    current = current.parentElement
  }
  return false
}

/**
 * 朝提示所在的那条边滑动把它关掉。
 * 手指和笔才算；鼠标拖动不关。横向滑动和反向滑动都留给页面自己滚。
 * 第二根手指一上来就取消，免得把双指缩放吃掉。
 */
export function useToastGesture(options: UseToastGestureOptions): {
  setRoot: (el: unknown) => void
  onPointerDown: (event: PointerEvent) => void
  onPointerMove: (event: PointerEvent) => void
  onPointerUp: (event: PointerEvent) => void
  onPointerCancel: (event: PointerEvent) => void
} {
  const rootRef = shallowRef<HTMLElement | null>(null)
  let gesture: GestureState | null = null
  let detachTouch: (() => void) | null = null

  function resetGesture(shouldResume: boolean): void {
    const root = rootRef.value
    const state = gesture
    gesture = null
    if (root)
      clearTransientStyles(root)
    if (shouldResume && state?.pausedTimer)
      options.resumeTimer()
  }

  function beginGesture(point: GesturePoint, target: EventTarget | null): boolean {
    const root = rootRef.value
    if (!root || !options.enabled() || gesture != null || shouldIgnoreTarget(target, root))
      return false
    const pausedTimer = options.canPauseTimer() && !options.isTimerPaused()
    if (pausedTimer)
      options.pauseTimer()
    const surfaceSize = Math.max(root.getBoundingClientRect().height, 1)
    gesture = {
      source: point.source,
      pointerId: point.pointerId,
      startX: point.clientX,
      startY: point.clientY,
      startTime: point.time,
      direction: options.direction(),
      intent: 'pending',
      pausedTimer,
      surfaceSize,
      dismissThreshold: Math.max(surfaceSize * SWIPE_DISMISS_RATIO, SWIPE_DISMISS_MIN_DISTANCE),
    }
    return true
  }

  function moveGesture(point: GesturePoint, preventDefault?: () => void, releaseCapture?: () => void): void {
    const state = gesture
    const root = rootRef.value
    if (!state || !root || point.source !== state.source || point.pointerId !== state.pointerId)
      return
    const deltaX = point.clientX - state.startX
    const deltaY = point.clientY - state.startY
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)
    if (state.intent === 'pending') {
      if (absX > DRAG_PROMOTION_SLOP && absX > absY) {
        releaseCapture?.()
        resetGesture(true)
        return
      }
      if (absY <= DRAG_PROMOTION_SLOP || absY <= absX * VERTICAL_INTENT_RATIO)
        return
      state.intent = deltaY * state.direction > 0 ? 'vertical' : 'opposite'
      if (state.intent === 'opposite') {
        releaseCapture?.()
        resetGesture(true)
        return
      }
      root.style.setProperty('transition-duration', '0s')
    }
    preventDefault?.()
    const travel = Math.max(0, deltaY * state.direction)
    const progress = swipeProgress(travel, state.surfaceSize)
    root.style.setProperty('--_toast-swipe-y', `${travel * state.direction}px`)
    root.style.setProperty('--_toast-swipe-opacity', (1 - progress * SWIPE_ACTIVE_FADE_MAX).toFixed(3))
    root.style.setProperty('--_toast-swipe-scale', (1 - progress * SWIPE_ACTIVE_SCALE_MAX).toFixed(3))
  }

  function endGesture(point: GesturePoint): void {
    const state = gesture
    const root = rootRef.value
    if (!state || !root || point.source !== state.source || point.pointerId !== state.pointerId)
      return
    const travel = Math.max(0, (point.clientY - state.startY) * state.direction)
    const elapsed = Math.max(1, point.time - state.startTime)
    // 甩动不设距离下限：方向只有越过 8px 判定、朝边缘走时才会变成 vertical。
    const isDismissed = state.intent === 'vertical'
      && (travel >= state.dismissThreshold || travel / elapsed > FLICK_VELOCITY)

    gesture = null
    root.style.removeProperty('transition-duration')
    if (isDismissed) {
      clearTransientStyles(root)
      root.style.setProperty(
        '--_toast-swipe-exit-y',
        state.direction === 1 ? SWIPE_EXIT_DISTANCE : `calc(-1 * ${SWIPE_EXIT_DISTANCE})`,
      )
      options.dismiss()
      return
    }
    clearTransientStyles(root)
    if (state.pausedTimer)
      options.resumeTimer()
  }

  function onPointerDown(event: PointerEvent): void {
    if (event.pointerType !== 'pen' || (event.button != null && event.button !== 0))
      return
    const started = beginGesture({
      source: 'pen',
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      time: event.timeStamp,
    }, event.target)
    if (started)
      rootRef.value?.setPointerCapture?.(event.pointerId)
  }

  function onPointerMove(event: PointerEvent): void {
    if (event.pointerType !== 'pen')
      return
    moveGesture({
      source: 'pen',
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      time: event.timeStamp,
    }, () => event.preventDefault(), () => rootRef.value?.releasePointerCapture?.(event.pointerId))
  }

  function onPointerUp(event: PointerEvent): void {
    if (event.pointerType !== 'pen')
      return
    rootRef.value?.releasePointerCapture?.(event.pointerId)
    endGesture({
      source: 'pen',
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      time: event.timeStamp,
    })
  }

  function onPointerCancel(event: PointerEvent): void {
    if (gesture?.source === 'pen' && gesture.pointerId === event.pointerId)
      resetGesture(true)
  }

  // 手势宿主里的单向拖动只负责认领这次触摸，自己从不开始；滑动的样子由这里画。
  // 第一下移动朝着边缘，这次触摸就归滑动；第一下往别处走，页面照常滚动。
  const claim = useGestureRecognizer(
    () => rootRef.value,
    () => new PanGestureRecognizer({
      name: 'toast-swipe',
      direction: options.direction() === 1 ? 'down' : 'up',
      firstMoveDecides: true,
      maximumNumberOfTouches: 1,
      hysteresis: Number.POSITIVE_INFINITY,
      cancelsTouchesInView: false,
      shouldReceiveTouch: (_recognizer, touch) => {
        const root = rootRef.value
        return touch.pointerType === 'touch' && root != null && !shouldIgnoreTarget(touch.target as EventTarget | null, root)
      },
    }),
    undefined,
    { isEnabled: options.enabled, manageStyle: false },
  )
  watch(options.direction, (direction) => {
    claim.setDirection(direction === 1 ? 'down' : 'up')
  })

  function bindTouch(root: HTMLElement): () => void {
    const point = (touch: Touch, event: TouchEvent): GesturePoint => ({
      source: 'touch',
      pointerId: touch.identifier,
      clientX: touch.clientX,
      clientY: touch.clientY,
      time: event.timeStamp,
    })
    const changedTouch = (event: TouchEvent): Touch | undefined => {
      const pointerId = gesture?.source === 'touch' ? gesture.pointerId : null
      if (pointerId == null)
        return undefined
      return [...event.changedTouches].find(touch => touch.identifier === pointerId)
    }
    const handleTouchStart = (event: TouchEvent): void => {
      if (event.touches.length !== 1) {
        resetGesture(true)
        return
      }
      const touch = event.changedTouches[0]
      if (touch != null)
        beginGesture(point(touch, event), event.target)
    }
    const handleTouchMove = (event: TouchEvent): void => {
      if (event.touches.length !== 1) {
        resetGesture(true)
        return
      }
      // 宿主的拖动在第一下移动时就判定了这次触摸；它一放手，触摸归页面，滑动也跟着结束。
      if (gesture != null && claim.state === 'failed') {
        resetGesture(true)
        return
      }
      const touch = changedTouch(event)
      if (touch)
        moveGesture(point(touch, event))
    }
    const handleTouchEnd = (event: TouchEvent): void => {
      if (event.touches.length > 0) {
        resetGesture(true)
        return
      }
      const touch = changedTouch(event)
      if (touch)
        endGesture(point(touch, event))
      else
        resetGesture(true)
    }
    const handleTouchCancel = (): void => resetGesture(true)

    root.addEventListener('touchstart', handleTouchStart, { passive: true })
    root.addEventListener('touchmove', handleTouchMove, { passive: true })
    root.addEventListener('touchend', handleTouchEnd, { passive: true })
    root.addEventListener('touchcancel', handleTouchCancel, { passive: true })
    return () => {
      root.removeEventListener('touchstart', handleTouchStart)
      root.removeEventListener('touchmove', handleTouchMove)
      root.removeEventListener('touchend', handleTouchEnd)
      root.removeEventListener('touchcancel', handleTouchCancel)
    }
  }

  watch(rootRef, (root) => {
    detachTouch?.()
    detachTouch = null
    if (root == null || typeof root.addEventListener !== 'function')
      return
    detachTouch = bindTouch(root)
  }, { flush: 'post' })

  onScopeDispose(() => {
    detachTouch?.()
    detachTouch = null
    resetGesture(false)
  })

  function setRoot(el: unknown): void {
    rootRef.value = el instanceof HTMLElement ? el : null
  }

  return { setRoot, onPointerDown, onPointerMove, onPointerUp, onPointerCancel }
}
