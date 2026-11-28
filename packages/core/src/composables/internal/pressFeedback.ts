import type { LiveGesture } from './pressSlot.js'
import { UIKIT_PRESS } from '../../motion/uikit/gestures'
import { msSinceInput } from '../../utils/inputAge'
import { subscribeInput } from '../../utils/inputStream'
import { isInsideScrollView } from '../../utils/scrollView'
import { attachButtonKeys, cancelButton, detachButtonKeys, pressButton, releaseButton, stylesheetDroppedActive } from './pressButton.js'
import { idlePressGesture, PRESS_SCROLL_BRAKE_MS, pressGestureStep } from './pressGesture.js'
import { apply, button, finger, finish, releaseIfDead, takeOver } from './pressSlot.js'
import { isTrackedByGroup, pressSurfaceAt } from './pressSurface.js'

export { PRESS_FADE_REDUCED_MAX_MS, pressFadeMs } from './pressFade.js'
export { PRESSED_ATTRIBUTE } from './pressSlot.js'
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

/** 手指离开后多久内的滚动还可能是那根手指甩出去的惯性。iOS 的惯性滚动会持续一两秒。 */
export const PRESS_GESTURE_MEMORY_MS = UIKIT_PRESS.momentumMemory.value

/**
 * 手指或笔落在控件框上的这次接触（utils/boxHold.ts）：记着它的指针、它开始的那次按压
 * （刹车时没有）和框按住的收尾。刹车的接触也算，被滚动取消的也算，各自在自己的抬起或取消时结束。
 * 只有抬起时按压还活着，才算「停着抬起」。
 */
let contact: { pointerId: number, live: LiveGesture | null, end: (isStillLift: boolean) => void } | null = null

/** 结束这次框上的接触，并且只告诉框按住一次。 */
function endContact(isStillLift: boolean): void {
  const ended = contact
  contact = null
  ended?.end(isStillLift)
}

/** 框组件装进来的框按住（utils/boxHold.ts）。 */
export interface BoxHold {
  /** 开始一次接触的按住。不在框上时返回 null，否则返回接触结束时要调的函数。 */
  readonly start: (surface: HTMLElement, target: EventTarget | null) => ((isStillLift: boolean) => void) | null
  /** 控制器拆掉时，结束所有还在等的点击。 */
  readonly endWaits: () => void
}

let boxHold: BoxHold | null = null

/**
 * 装上框按住。只有用到框组件（复选框、单选）的页面才加载它，
 * 只有按钮和链接的页面不带这段代码。
 */
export function installBoxHold(hold: BoxHold): void {
  boxHold = hold
}
/** 有几个调用方装着控制器。大于 0 时监听才在。 */
let holders = 0
/** 上一次「被手指带动」的滚动发生在什么时候、在哪个滚动容器里。只记手指带动的，程序滚动不算。 */
let lastScrollAt = 0
let lastScroller: Node | null = null
/** 上一次手指在屏幕上是什么时候、落在哪里。 */
let lastTouchAt = 0
let lastTouchTarget: Node | null = null

/**
 * 这次触摸是不是在给手指刚甩动的列表「刹车」。原生列表刹车时什么都不亮。
 * 两个条件都要满足：滚动容器包着这个元素，而且那次滚动是手指在这个容器里带起来的。
 */
function scrollerIsBraking(element: HTMLElement): boolean {
  if (Date.now() - lastScrollAt >= PRESS_SCROLL_BRAKE_MS)
    return false
  return lastScroller instanceof Node && lastScroller.contains(element)
}

function onPointerDown(event: PointerEvent): void {
  if (event.pointerType === 'mouse') {
    // 主指针精细时（桌面）鼠标留给 `:active`，这里不管，鼠标路径零开销。
    // 只认主键：`:active` 画的就是主键的按压。
    if (event.button === 0 && stylesheetDroppedActive())
      pressButton(event.target, event.pointerId)
    return
  }
  // 第二根手指或新的一次按压结束上一次框上的接触，它的抬起不算停着抬起。
  endContact(false)
  if (finger.live != null) {
    const fingerIsUp = finger.live.gesture.phase === 'fading' || finger.live.gesture.phase === 'flash'
    // 手指还按着又来一根：双指捏合或双指滚动都不是按压，两根都不画。
    finish(finger)
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
  if (element == null)
    return
  // 刹车的手指什么都不按，但框按住照样跟着它。
  const end = boxHold?.start(element, event.target) ?? null
  const pressed: LiveGesture | null = braking ? null : { element, gesture: idlePressGesture(), pointerId: event.pointerId, timer: null }
  if (end != null)
    contact = { pointerId: event.pointerId, live: pressed, end }
  if (pressed == null)
    return
  takeOver(button, element)
  finger.live = pressed
  apply(
    finger,
    pressGestureStep(pressed.gesture, { kind: 'down', x: event.clientX, y: event.clientY, delayed: isInsideScrollView(element) }),
    msSinceInput(event.timeStamp, event),
  )
}

function isOtherPointer(event: PointerEvent): boolean {
  const live = finger.live
  return live == null || (live.pointerId != null && event.pointerId !== live.pointerId)
}

function onPointerMove(event: PointerEvent): void {
  if (isOtherPointer(event))
    return
  apply(finger, pressGestureStep(finger.live!.gesture, { kind: 'move', x: event.clientX, y: event.clientY }))
}

function onPointerUp(event: PointerEvent): void {
  // 鼠标也不能更新刹车用的时钟：同一台设备可能既有触屏又有鼠标。
  if (event.pointerType === 'mouse') {
    if (button.live != null && button.live.pointerId === event.pointerId)
      releaseButton()
    return
  }
  lastTouchAt = Date.now()
  if (event.target instanceof Node)
    lastTouchTarget = event.target
  if (contact != null && contact.pointerId === event.pointerId) {
    // 在抬起这一步之前读：移动过头或被滚动拿走的按压，这时已经死了或没了。
    const pressed = contact.live
    endContact(pressed != null && finger.live === pressed && pressed.gesture.phase !== 'dead')
  }
  if (isOtherPointer(event))
    return
  apply(finger, pressGestureStep(finger.live!.gesture, { kind: 'up' }))
  releaseIfDead(finger)
}

/** 滚动接管了手势，或者平台拿走了它。iOS 上 pointercancel 比第一个 scroll 事件还早到。 */
function onCancel(event?: Event): void {
  const pointer = event as Partial<PointerEvent> | undefined
  // 被取消的鼠标指针只结束鼠标的按压，不碰手指的。
  if (pointer?.pointerType === 'mouse') {
    if (button.live != null && button.live.pointerId === pointer.pointerId)
      cancelButton()
    return
  }
  // 只有这根指针自己的取消才结束它的接触。滚动带来的取消不算：手指还按着。
  if (pointer?.pointerId != null && contact?.pointerId === pointer.pointerId)
    endContact(false)
  const live = finger.live
  if (live == null)
    return
  apply(finger, pressGestureStep(live.gesture, { kind: 'cancel' }))
  releaseIfDead(finger)
}

/**
 * 按压变成拖拽，不管是谁按的，都算被拿走。不听 contextmenu：右键是鼠标的事，
 * 这里从不跟踪，听它就像接管了浏览器自己的菜单。
 */
function onDragStart(): void {
  onCancel()
  cancelButton()
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
  const live = finger.live
  if (live == null)
    return
  // 取消比刹车宽：被按元素上方的任何滚动都会拿走手势，不管是不是手指带的。鼠标和按键的按压不受影响，和 `:active` 一样。
  if (scroller === document || scroller.contains(live.element))
    onCancel()
}

/** 兜底：页面被切到后台时，不留下亮着的元素。 */
function onVisibilityChange(): void {
  if (document.visibilityState === 'hidden') {
    endContact(false)
    finish(finger)
    finish(button)
  }
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
    subscribeInput(window, 'dragstart', onDragStart),
    subscribeInput(window, 'scroll', onScroll),
    subscribeInput(window, 'visibilitychange', onVisibilityChange),
  ]
  attachButtonKeys()
}

function removeListeners(): void {
  endContact(false)
  boxHold?.endWaits()
  for (const unsubscribe of unsubscribers)
    unsubscribe()
  unsubscribers = []
  detachButtonKeys()
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
    finish(finger)
    finish(button)
    resetClocks()
  }
}

/** 测试用：拆掉控制器，回到没人用过的状态。 */
export function resetPressFeedbackForTest(): void {
  if (holders > 0 && typeof window !== 'undefined')
    removeListeners()
  endContact(false)
  holders = 0
  finish(finger)
  finish(button)
  resetClocks()
}

/** 测试用：控制器现在装着没有。 */
export function isPressFeedbackInstalledForTest(): boolean {
  return holders > 0
}
