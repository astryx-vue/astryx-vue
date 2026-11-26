/**
 * @file inputHoldPress.ts
 * @output pressHoldFor：一个文档的按压暂挡，有浮层被挡时，拦下落进窗口的每一下
 *   手指或笔的按压，跟到它自己结束
 * @position `inputHold.ts` 的按压部分（对应上游 Layer/inputHold 的 createPressHold）
 */

import type { PressHold } from './inputHoldState'
import { containsAlongFlatTree } from '../utils/flatTree'
import { subscribeInput } from '../utils/inputStream'
import { isNode } from '../utils/nodeType'
import { openToMouse } from './inputHoldShield'
import { held, isInputShield, liveLayers, pressHolds } from './inputHoldState'

const HELD_POINTERS: ReadonlySet<string> = new Set(['touch', 'pen'])

/** 被挡的一下结束后多久内，它的 click 和鼠标兼容事件还算它的（WebKit 在 touchend 之后才发）。 */
export const CLICK_WINDOW_MS = 800

/** 被挡的一下在暂挡结束后最多再跟多久。 */
const STRAY_PRESS_MS = 10_000

const POINTER_EVENTS = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel'] as const
const TOUCH_EVENTS = ['touchstart', 'touchmove', 'touchend', 'touchcancel'] as const
const PRESS_EVENTS = ['mousedown', 'mouseup', 'click', 'auxclick', 'dblclick', 'contextmenu'] as const

/** 文档的按压暂挡，没开就开起来。 */
export function pressHoldFor(doc: Document): PressHold | null {
  let hold = pressHolds.get(doc) ?? null
  if (hold == null) {
    hold = createPressHold(doc)
    if (hold != null)
      pressHolds.set(doc, hold)
  }
  return hold
}

/**
 * 有浮层被挡期间，拦下落进 `doc` 窗口的每一下手指或笔的按压，每一下都跟到它
 * 自己结束，哪怕暂挡已经放开。移动的鼠标从挡板穿过去。它通过共享输入流最先
 * 听到事件，被挡的事件在那里就停下：文档、元素上的监听都听不到，按压反馈和
 * 手势宿主也听不到。每个文档一份；不再挡、被挡的按压和它们的 click 都结束后退订。
 */
function createPressHold(doc: Document): PressHold | null {
  const view = doc.defaultView
  if (view == null)
    return null
  /** 新的按压要不要挡：直到 release。 */
  let isHolding = true
  let isListening = true
  /** 还按着的被挡按压，按 pointerId 和 touch identifier 记。 */
  const pointers = new Set<number>()
  const touches = new Set<number>()
  /** 下一个 click 属于谁：被挡的那一下，还是别的。 */
  let lastPress: 'held' | 'free' | null = null
  /** 没写指针类型的 click 在这个时刻之前都算被挡那一下的。 */
  let clickUntil = -Infinity
  let timer: ReturnType<typeof setTimeout> | undefined
  const unsubscribers: (() => void)[] = []

  const now = (): number => view.performance.now()
  const isPressDown = (): boolean => pointers.size > 0 || touches.size > 0

  const swallow = (event: Event): void => {
    if (event.cancelable)
      event.preventDefault()
    event.stopImmediatePropagation()
  }

  /** release 之后：最后一下被挡的按压和它的 click 结束就退订。 */
  const settle = (): void => {
    if (isHolding || !isListening)
      return
    if (timer !== undefined)
      clearTimeout(timer)
    if (isPressDown()) {
      timer = setTimeout(stop, STRAY_PRESS_MS)
      return
    }
    const wait = clickUntil - now()
    if (wait > 0)
      timer = setTimeout(stop, wait)
    else
      stop()
  }

  /** 还有浮层被挡吗（离开文档的不算）。 */
  const holdsNewPress = (): boolean => {
    if (isHolding)
      liveLayers(doc)
    return isHolding
  }

  /**
   * 落在 `target` 上的新按压要不要挡。有浮层盖满视口时，按在哪都挡；
   * 只挡自己那块（`'surface'`）时，只挡按在浮层上的，周围页面照常。
   */
  const holdsPressAt = (target: EventTarget | null): boolean => {
    if (!holdsNewPress())
      return false
    for (const layer of liveLayers(doc)) {
      const state = held.get(layer)
      if (state == null)
        continue
      if (state.viewport > 0)
        return true
      if (state.surface > 0 && isNode(target) && containsAlongFlatTree(layer, target))
        return true
    }
    return false
  }

  const pressEnded = (): void => {
    clickUntil = now() + CLICK_WINDOW_MS
    settle()
  }

  /** 手指或笔来了，挡板接点击；移动的鼠标来了，挡板让开。 */
  const followPointer = (pointerType: string): void => {
    for (const layer of liveLayers(doc)) {
      const state = held.get(layer)
      if (state?.shield == null)
        continue
      const value = pointerType === 'mouse' ? 'none' : 'auto'
      if (state.shield.style.pointerEvents !== value)
        state.shield.style.pointerEvents = value
      openToMouse(state, doc)
    }
  }

  /**
   * 挡板给鼠标让开时，被挡的一下落到了挡板后面：把它抓到挡板上，抬起也算暂挡的，
   * 会被轻触关闭的浮层不会关掉。合成的按压没有活动指针可抓，照样吞掉。
   */
  const captureToShield = (event: PointerEvent): void => {
    if (!event.isTrusted)
      return
    const top = liveLayers(doc).at(-1)
    const shield = top == null ? null : held.get(top)?.shield
    if (shield == null || isInputShield(event.target as Node | null))
      return
    try {
      shield.setPointerCapture(event.pointerId)
    }
    catch {
      // 指针已经不在了。
    }
  }

  /** 更早按下那一下的口子跟着它走，抬起时合上。输入流已经先记下了这次的位置。 */
  const followEarlierPress = (event: PointerEvent): void => {
    const { pointerId, type } = event
    for (const layer of liveLayers(doc)) {
      const state = held.get(layer)
      if (state == null || !state.pressOpenings.has(pointerId))
        continue
      if (type === 'pointerup' || type === 'pointercancel')
        state.pressOpenings.delete(pointerId)
      openToMouse(state, doc)
    }
  }

  const onPointer = (event: PointerEvent): boolean => {
    const { pointerId, pointerType, type } = event
    if (HELD_POINTERS.has(pointerType) && type !== 'pointerdown' && !pointers.has(pointerId))
      followEarlierPress(event)
    // 手指或笔让挡板接点击；只有不按键移动的鼠标让它让开。这样从挡板上开始的
    // 鼠标按压一直归挡板，否则它的 click 会落到两个目标的共同祖先上——对话框会当成点遮罩。
    const isFollowed = HELD_POINTERS.has(pointerType)
      ? type === 'pointerdown' || type === 'pointermove'
      : pointerType === 'mouse' && type === 'pointermove' && event.buttons === 0
    if (isFollowed && holdsNewPress())
      followPointer(pointerType)
    if (type === 'pointerdown') {
      if (!HELD_POINTERS.has(pointerType) || !holdsPressAt(event.target)) {
        // 鼠标的按压，或暂挡之后的按压：它的 click 归它自己。
        pointers.delete(pointerId)
        lastPress = 'free'
        clickUntil = -Infinity
        settle()
        return false
      }
      pointers.add(pointerId)
      lastPress = 'held'
      captureToShield(event)
    }
    else if (!pointers.has(pointerId)) {
      return false
    }
    // 取消这一下，浏览器就不发鼠标兼容事件，也就不会因此挪焦点。
    swallow(event)
    if (type === 'pointerup' || type === 'pointercancel') {
      pointers.delete(pointerId)
      pressEnded()
    }
    return true
  }

  const onTouch = (event: TouchEvent): boolean => {
    const { changedTouches, touches: down, type } = event
    const changed = Array.from(changedTouches)
    if (type === 'touchstart') {
      // 屏幕上已经没有的被挡触点，是没被听到就结束了的（它的目标挡板放开时已经离开文档）。
      const live = new Set(Array.from(down, touch => touch.identifier))
      for (const identifier of touches) {
        if (!live.has(identifier))
          touches.delete(identifier)
      }
      const heldTouches = changed.filter(touch => holdsPressAt(touch.target))
      if (heldTouches.length === 0) {
        for (const touch of changed)
          touches.delete(touch.identifier)
        lastPress = 'free'
        clickUntil = -Infinity
        settle()
        return false
      }
      for (const touch of heldTouches)
        touches.add(touch.identifier)
      lastPress = 'held'
      // 不取消：取消 touchstart 会连页面的双指缩放一起取消。
      event.stopImmediatePropagation()
      return true
    }
    if (!changed.some(touch => touches.has(touch.identifier)))
      return false
    if (type === 'touchmove') {
      event.stopImmediatePropagation()
      // 单指拖不动页面；双指照样能缩放。
      if (down.length === 1 && event.cancelable)
        event.preventDefault()
      return true
    }
    // 取消掉的 touchend 不再发 click 和鼠标兼容事件。
    swallow(event)
    for (const touch of changed)
      touches.delete(touch.identifier)
    pressEnded()
    return true
  }

  const onPress = (event: MouseEvent): boolean => {
    // 键盘或辅助技术发的 click 不算按压。
    if (event.detail === 0)
      return false
    // 写了指针类型的 click 按那个指针判断；鼠标兼容事件、当普通鼠标事件发的 click 归最后一下。
    const { pointerType } = event as Partial<PointerEvent>
    const isHeldPress = lastPress === 'held'
      && (pointerType == null || pointerType === '' || HELD_POINTERS.has(pointerType))
    if (isHeldPress && (isPressDown() || now() <= clickUntil)) {
      swallow(event)
      return true
    }
    return false
  }

  const pressHold: PressHold = {
    hold() {
      isHolding = true
      if (timer !== undefined) {
        clearTimeout(timer)
        timer = undefined
      }
    },
    release() {
      if (!isHolding)
        return
      isHolding = false
      settle()
    },
    holds: pointerId => pointers.has(pointerId),
  }
  function stop(): void {
    if (!isListening)
      return
    isListening = false
    if (pressHolds.get(doc) === pressHold)
      pressHolds.delete(doc)
    if (timer !== undefined)
      clearTimeout(timer)
    for (const unsubscribe of unsubscribers.splice(0))
      unsubscribe()
  }

  // touchstart 和 touchcancel 从不取消，订阅时保持被动。暂挡最先听到每个事件，
  // 被挡的事件到不了别的订阅者。
  unsubscribers.push(
    ...POINTER_EVENTS.map(type => subscribeInput(view, type, onPointer, { cancels: true, first: true })),
    ...TOUCH_EVENTS.map(type => subscribeInput(view, type, onTouch, {
      cancels: type === 'touchmove' || type === 'touchend',
      first: true,
    })),
    ...PRESS_EVENTS.map(type => subscribeInput(view, type, onPress as (event: Event) => boolean, { cancels: true, first: true })),
  )

  return pressHold
}
