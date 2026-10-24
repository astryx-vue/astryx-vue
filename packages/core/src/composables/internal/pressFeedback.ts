import type { PressGesture, PressPaint, PressStep, PressTimer } from './pressGesture.js'
import {
  idlePressGesture,
  PRESS_FADE_MS,
  PRESS_FLASH_MS,
  PRESS_ONSET_MS,
  PRESS_SCROLL_BRAKE_MS,
  pressGestureStep,
} from './pressGesture.js'

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
 */

/** 可按元素的标记。控制器用 `closest()` 找它。 */
export const PRESSABLE_ATTRIBUTE = 'data-astryx-pressable'

/** 按压成立且手指还在时为 `on`，抬手淡出时为 `fading`，其余时候不存在。 */
export const PRESSED_ATTRIBUTE = 'data-astryx-press'

/** 手指离开后多久内的滚动还可能是那根手指甩出去的惯性。iOS 的惯性滚动会持续一两秒。 */
export const PRESS_GESTURE_MEMORY_MS = 3000

/** 不可用的元素怎么按都不画。 */
const DISABLED = ':disabled, [aria-disabled="true"]'

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

function paintElement(element: HTMLElement, paint: PressPaint): void {
  if (paint === 'none')
    element.removeAttribute(PRESSED_ATTRIBUTE)
  else
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
function apply(step: PressStep): void {
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
    // 那时去亮一个已经没人按的控件。
    live.timer = setTimeout(() => {
      if (live != null)
        live.timer = null
      apply(pressGestureStep(live?.gesture ?? idlePressGesture(), { kind: TIMER_EVENT[kind] }))
    }, TIMER_MS[kind])
  }
}

/**
 * 手指下最里层的可按元素。里层优先：可按的行里有个按钮，按钮接走这次按压。
 * 不可用的元素也会接走，但什么都不画，所以按在禁用控件上不会把外面那一行点亮。
 */
function surfaceAt(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element))
    return null
  const found = target.closest(`[${PRESSABLE_ATTRIBUTE}]`)
  if (!(found instanceof HTMLElement) || found.matches(DISABLED))
    return null
  return found
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
  const element = surfaceAt(event.target)
  // 先判断刹车再记这次触摸的时间：问的是「上一根手指」还在不在带动滚动。
  const braking = element != null && scrollerIsBraking(element)
  lastTouchAt = Date.now()
  lastTouchTarget = event.target instanceof Node ? event.target : null
  if (element == null || braking)
    return
  live = { element, gesture: idlePressGesture(), pointerId: event.pointerId, timer: null }
  apply(pressGestureStep(live.gesture, { kind: 'down', x: event.clientX, y: event.clientY }))
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

const PASSIVE_CAPTURE = { capture: true, passive: true } as const

const WINDOW_LISTENERS: ReadonlyArray<[string, (event: never) => void]> = [
  ['pointerdown', onPointerDown],
  ['pointermove', onPointerMove],
  ['pointerup', onPointerUp],
  ['pointercancel', onCancel],
  ['touchcancel', onCancel],
  // 长按变成拖拽也算拿走手势。不听 contextmenu：右键是鼠标的事，这里从不跟踪鼠标。
  ['dragstart', onCancel],
]

function addListeners(): void {
  for (const [type, listener] of WINDOW_LISTENERS)
    window.addEventListener(type, listener as EventListener, PASSIVE_CAPTURE)
  document.addEventListener('scroll', onScroll, PASSIVE_CAPTURE)
  document.addEventListener('visibilitychange', onVisibilityChange)
}

function removeListeners(): void {
  for (const [type, listener] of WINDOW_LISTENERS)
    window.removeEventListener(type, listener as EventListener, PASSIVE_CAPTURE)
  document.removeEventListener('scroll', onScroll, PASSIVE_CAPTURE)
  document.removeEventListener('visibilitychange', onVisibilityChange)
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
