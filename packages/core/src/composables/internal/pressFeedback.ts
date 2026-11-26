import type { PressGesture, PressPaint, PressStep, PressTimer } from './pressGesture.js'
import { UIKIT_PRESS } from '../../motion/uikit/gestures'
import { msSinceInput } from '../../utils/inputAge'
import { subscribeInput } from '../../utils/inputStream'
import { isInsideScrollView } from '../../utils/scrollView'
import {
  idlePressGesture,
  PRESS_FADE_MS,
  PRESS_FLASH_MS,
  PRESS_ONSET_MS,
  PRESS_SCROLL_BRAKE_MS,
  pressGestureStep,
} from './pressGesture.js'
import { isTrackedByGroup, pressSurfaceAt } from './pressSurface.js'

export { PRESS_ACTION_ATTRIBUTE, PRESS_CONTAINER_ATTRIBUTE, PRESSABLE_ATTRIBUTE } from './pressSurface.js'

/**
 * 触屏按压模型的 DOM 那一半：整个文档只有一个委托控制器，
 * 在手指下最里层的可按元素上写 `data-astryx-press`。
 *
 * 为什么挂在文档上、而不是每个元素一套监听：虚拟列表可能有上千行，每行四个监听加一份状态
 * 承受不起。这里整个文档就几个监听，一次按压只改一个元素的一个属性，不触发任何组件更新。
 *
 * 鼠标完全不管，CSS 的 `:active` 照旧。手指下，`@media (pointer: coarse)` 里的 `:active`
 * 被样式丢掉，改由这里在按压成立时写 `on`，抬手淡出时写 `fading`。
 * 样式见 `styles/pressable.css`。
 *
 * 手指只在滚动视图里才等：滚动视图外，落下那一帧就亮，和原生控件一样；
 * 滚动视图里等 150ms，因为这次触摸可能变成滚动。这 150ms 从触摸自己的时间戳算起，
 * 页面忙、监听函数跑晚了，不会让高亮跟着晚。
 */

/** 按压成立且手指还在时为 `on`，抬手淡出时为 `fading`，其余时候不存在。 */
export const PRESSED_ATTRIBUTE = 'data-astryx-press'

/** 手指离开后多久内的滚动还可能是那根手指甩出去的惯性。iOS 的惯性滚动会持续一两秒。 */
export const PRESS_GESTURE_MEMORY_MS = UIKIT_PRESS.momentumMemory.value

interface LiveGesture {
  element: HTMLElement
  gesture: PressGesture
  /** 这次手势属于哪根手指。第二根手指不算。 */
  pointerId: number | null
  timer: ReturnType<typeof setTimeout> | null
}

let live: LiveGesture | null = null
/** 有几个调用方装着控制器。大于 0 时监听才在。 */
let holders = 0
/** 上一次「被手指带动」的滚动发生在什么时候、在哪个滚动容器里。只记手指带动的，程序滚动不算。 */
let lastScrollAt = 0
let lastScroller: Node | null = null
/** 上一次手指在屏幕上是什么时候、落在哪里。 */
let lastTouchAt = 0
let lastTouchTarget: Node | null = null

const TIMER_MS: Record<PressTimer, number> = {
  fade: PRESS_FADE_MS,
  flash: PRESS_FLASH_MS,
  onset: PRESS_ONSET_MS,
}

const TIMER_EVENT = {
  fade: 'fadeEnd',
  flash: 'flashEnd',
  onset: 'onset',
} as const

/** 读出一个 CSS 时间值，单位毫秒。不是时间就返回 null。 */
function parseTimeMs(value: string): number | null {
  const match = /^\s*(-?(?:\d+(?:\.\d+)?|\.\d+))(ms|s)\s*$/.exec(value)
  if (match == null)
    return null
  const amount = Number.parseFloat(match[1]!)
  return match[2] === 's' ? amount * 1000 : amount
}

/** 减少动态效果时，抬手淡出最多这么长，和样式里的上限一致。 */
export const PRESS_FADE_REDUCED_MAX_MS = 200

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * 自定义属性读出来是原文，`calc(100ms + 75ms)` 这类写法不是纯时间。
 * 让一个不显示的探针元素把这段原文当作 transition-duration，由浏览器算出实际长度，
 * 和释放动画（用同一个 token 当时长）算出的结果一致。
 */
function resolveTimeMs(element: HTMLElement, raw: string): number | null {
  const plain = parseTimeMs(raw)
  if (plain != null || raw.trim() === '')
    return plain
  const probe = element.ownerDocument.createElement('span')
  probe.style.setProperty('display', 'none', 'important')
  probe.style.setProperty('transition-duration', raw, 'important')
  if (probe.style.getPropertyValue('transition-duration') === '')
    return null
  element.appendChild(probe)
  try {
    return parseTimeMs(getComputedStyle(probe).transitionDuration.split(',')[0] ?? '')
  }
  finally {
    probe.remove()
  }
}

/**
 * 抬手后淡出的时长：元素上主题的 `--astryx-duration-exit`，抬手时读一次，
 * `calc()` 之类的写法按浏览器算出的长度算。
 * 读不出时间（没主题、或不是时间值）就用默认的 PRESS_FADE_MS。
 * 减少动态效果时不超过 {@link PRESS_FADE_REDUCED_MAX_MS}。
 */
export function pressFadeMs(element: HTMLElement): number {
  if (typeof getComputedStyle !== 'function')
    return PRESS_FADE_MS
  const ms = resolveTimeMs(element, getComputedStyle(element).getPropertyValue('--astryx-duration-exit'))
  const exit = ms != null && ms >= 0 ? ms : PRESS_FADE_MS
  return prefersReducedMotion() ? Math.min(exit, PRESS_FADE_REDUCED_MAX_MS) : exit
}

function paintElement(element: HTMLElement, paint: PressPaint): void {
  if (paint === 'none')
    element.removeAttribute(PRESSED_ATTRIBUTE)
  // 画的东西没变就不写，元素每次换样子只看到一次变化。
  else if (element.getAttribute(PRESSED_ATTRIBUTE) !== paint)
    element.setAttribute(PRESSED_ATTRIBUTE, paint)
}

function clearTimer(): void {
  if (live?.timer != null) {
    clearTimeout(live.timer)
    live.timer = null
  }
}

/**
 * 把一个事件交给状态机，再让 DOM 照答案画。
 *
 * 计时器规则：阶段没变、又没要新计时器的一步是路过，原来那个计时器必须留着。
 * 如果每步都先清掉，会有三种手势最后停在「没人碰却亮着」：
 * 等待期内手指在容差内抖了一下（真手指都会抖），onset 被清掉，按压永远不亮；
 * 轻点的 100ms 闪亮期内来了 pointercancel 或滚动，flashEnd 被清掉，一直亮着；
 * 淡出期内同样，`fading` 留在元素上。
 */
function apply(step: PressStep, sinceEventMs = 0): void {
  if (live == null)
    return
  const phaseMoved = step.gesture.phase !== live.gesture.phase
  if (step.timer != null || phaseMoved)
    clearTimer()
  live.gesture = step.gesture
  paintElement(live.element, step.paint)
  if (step.gesture.phase === 'idle') {
    live = null
    return
  }
  if (step.timer != null) {
    const kind = step.timer
    // 用定时器，不用 requestAnimationFrame：iOS 滚动时会压低帧回调，按帧算的延时会在滚动结束后才到，
    // 那时去亮一个已经没人按的控件。onset 从触摸算起，监听函数等掉的时间要扣掉。
    const delay = kind === 'fade'
      ? pressFadeMs(live.element)
      : kind === 'onset' ? Math.max(0, TIMER_MS.onset - sinceEventMs) : TIMER_MS[kind]
    live.timer = setTimeout(() => {
      if (live != null)
        live.timer = null
      apply(pressGestureStep(live?.gesture ?? idlePressGesture(), { kind: TIMER_EVENT[kind] }))
    }, delay)
  }
}

/**
 * 这次触摸是不是在给手指刚甩动的列表「刹车」。原生列表刹车时什么都不亮。
 * 两个条件都要满足：滚动容器包着这个元素，而且那次滚动是手指在这个容器里带起来的。
 */
function scrollerIsBraking(element: HTMLElement): boolean {
  if (Date.now() - lastScrollAt >= PRESS_SCROLL_BRAKE_MS)
    return false
  return lastScroller instanceof Node && lastScroller.contains(element)
}

/** 手势一死就让出唯一的跟踪槽位。变成滚动的手势以 pointercancel 结束，没有 pointerup。 */
function releaseIfDead(): void {
  if (live?.gesture.phase === 'dead') {
    clearTimer()
    live = null
  }
}

/** 擦掉颜色、忘掉手势，不经过状态机。 */
function finish(): void {
  if (live == null)
    return
  clearTimer()
  live.element.removeAttribute(PRESSED_ATTRIBUTE)
  live = null
}

function onPointerDown(event: PointerEvent): void {
  if (event.pointerType === 'mouse')
    return
  if (live != null) {
    const fingerIsUp = live.gesture.phase === 'fading' || live.gesture.phase === 'flash'
    // 手指还按着又来一根：双指捏合或双指滚动都不是按压，两根都不画。
    finish()
    if (!fingerIsUp)
      return
  }
  // 按钮组、提示对话框正在跟踪这种指针的滑动：它们自己画高亮，这里不画。
  const tracked = event.target instanceof Element && isTrackedByGroup(event.target, event.pointerType)
  const element = tracked ? null : pressSurfaceAt(event.target)
  // 先判断刹车再记这次触摸的时间：问的是「上一根手指」还在不在带动滚动。
  const braking = element != null && scrollerIsBraking(element)
  lastTouchAt = Date.now()
  lastTouchTarget = event.target instanceof Node ? event.target : null
  if (element == null || braking)
    return
  live = { element, gesture: idlePressGesture(), pointerId: event.pointerId, timer: null }
  apply(
    pressGestureStep(live.gesture, { kind: 'down', x: event.clientX, y: event.clientY, delayed: isInsideScrollView(element) }),
    msSinceInput(event.timeStamp, event),
  )
}

function isOtherPointer(event: PointerEvent): boolean {
  return live == null || (live.pointerId != null && event.pointerId !== live.pointerId)
}

function onPointerMove(event: PointerEvent): void {
  if (isOtherPointer(event))
    return
  apply(pressGestureStep(live!.gesture, { kind: 'move', x: event.clientX, y: event.clientY }))
}

function onPointerUp(event: PointerEvent): void {
  // 鼠标也不能更新刹车用的时钟：同一台设备可能既有触屏又有鼠标。
  if (event.pointerType === 'mouse')
    return
  lastTouchAt = Date.now()
  if (event.target instanceof Node)
    lastTouchTarget = event.target
  if (isOtherPointer(event))
    return
  apply(pressGestureStep(live!.gesture, { kind: 'up' }))
  releaseIfDead()
}

/** 滚动接管了手势，或者平台拿走了它。iOS 上 pointercancel 比第一个 scroll 事件还早到。 */
function onCancel(): void {
  if (live == null)
    return
  apply(pressGestureStep(live.gesture, { kind: 'cancel' }))
  releaseIfDead()
}

/** 文档里任何一处滚动。scroll 不冒泡，只能在捕获阶段听。 */
function onScroll(event: Event): void {
  const scroller = event.target instanceof Node ? event.target : document
  const driven = Date.now() - lastTouchAt < PRESS_GESTURE_MEMORY_MS
    && lastTouchTarget != null
    && scroller.contains(lastTouchTarget)
  if (driven) {
    lastScrollAt = Date.now()
    lastScroller = scroller
  }
  if (live == null)
    return
  // 取消比刹车宽：被按元素上方的任何滚动都会拿走手势，不管是不是手指带的。
  if (scroller === document || scroller.contains(live.element))
    onCancel()
}

/** 兜底：页面被切到后台时，不留下亮着的元素。 */
function onVisibilityChange(): void {
  if (document.visibilityState === 'hidden')
    finish()
}

/** 控制器在共用输入流（utils/inputStream.ts）上的订阅，全都被动，只在有人持有时存在。 */
let unsubscribers: (() => void)[] = []

function addListeners(): void {
  unsubscribers = [
    subscribeInput(window, 'pointerdown', onPointerDown),
    subscribeInput(window, 'pointermove', onPointerMove),
    subscribeInput(window, 'pointerup', onPointerUp),
    subscribeInput(window, 'pointercancel', onCancel),
    subscribeInput(window, 'touchcancel', onCancel),
    // 长按变成拖拽也算拿走手势。不听 contextmenu：右键是鼠标的事，这里从不跟踪鼠标。
    subscribeInput(window, 'dragstart', onCancel),
    subscribeInput(window, 'scroll', onScroll),
    subscribeInput(window, 'visibilitychange', onVisibilityChange),
  ]
}

function removeListeners(): void {
  for (const unsubscribe of unsubscribers)
    unsubscribe()
  unsubscribers = []
}

function resetClocks(): void {
  lastScrollAt = 0
  lastScroller = null
  lastTouchAt = 0
  lastTouchTarget = null
}

/**
 * 在这个文档上装好按压控制器。调多少次都只装一份，有人持有时监听就在。
 * 返回释放函数：每次安装各调一次；最后一个释放时拆掉监听，并清掉颜色和刹车时钟。
 * 服务端什么都不做。
 */
export function installPressFeedback(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined')
    return () => undefined
  if (holders === 0)
    addListeners()
  holders += 1
  let released = false
  return () => {
    if (released)
      return
    released = true
    holders -= 1
    if (holders > 0)
      return
    removeListeners()
    finish()
    resetClocks()
  }
}

/** 测试用：拆掉控制器，回到没人用过的状态。 */
export function resetPressFeedbackForTest(): void {
  if (holders > 0 && typeof window !== 'undefined')
    removeListeners()
  holders = 0
  finish()
  resetClocks()
}

/** 测试用：控制器现在装着没有。 */
export function isPressFeedbackInstalledForTest(): boolean {
  return holders > 0
}
