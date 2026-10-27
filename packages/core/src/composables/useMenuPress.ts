import type { MaybeRefOrGetter, Ref } from 'vue'
import type { MenuPressEffect, MenuPressEvent, MenuPressGesture, MenuPressPointerType } from './internal/menuPressGesture.js'
import { getCurrentScope, onScopeDispose, toValue } from 'vue'
import { currentGesture } from './internal/gestureCounter.js'
import { createMenuAutoscroll, overflowingMenu } from './internal/menuPressAutoscroll.js'
import {
  dispatchRowClick,
  focusHighlight,
  MENU_PRESS_ITEM_SELECTOR,
  MENU_PRESS_ROOT_SELECTOR,
  normalizePointerType,
  preventTouchScroll,
  resolvePoint,
} from './internal/menuPressDom.js'
import { IDLE_MENU_PRESS, menuPressStep } from './internal/menuPressGesture.js'
import { armStrayClick, runAsMenuPressActivation } from './internal/strayClick.js'
import { useLongPress } from './useLongPress.js'

export { MENU_PRESS_MARKER } from './internal/menuPressDom.js'
export { MENU_PRESS_SETTLE_MS, menuPressStep } from './internal/menuPressGesture.js'
export type {
  MenuPressEffect,
  MenuPressEvent,
  MenuPressGesture,
  MenuPressPointerType,
  MenuPressStep,
} from './internal/menuPressGesture.js'
export { isMenuPressActivation, resetMenuPress } from './internal/strayClick.js'

/** 手指在触发器上按多久菜单才打开。 */
const MENU_PRESS_LONG_PRESS_MS = 500

export interface MenuPressOptions {
  /** 菜单（或列表框）的根：按压要从它的行里挑。 */
  menuRef: Ref<HTMLElement | null>
  /** 能开菜单的控件，按压也可以从这里开始。 */
  triggerRef?: Ref<HTMLElement | null>
  /**
   * 只匹配**可用**行的选择器。指针压在分割线、标题、禁用行上时什么都不挑。
   * @default 三种菜单项角色里没有 `aria-disabled="true"` 的
   */
  itemSelector?: string
  /**
   * 鼠标按下触发器，或手指在上面按满长按时间：在按住的指针下面打开菜单，返回打开了没有。
   * 返回 false（这一按把开着的菜单关掉了）会结束这次手势。
   * 同一次手势里触发器收到的 click 用 `isTriggerClickFromPress()` 认出来。
   */
  onTriggerPress?: (pointerType: MenuPressPointerType) => boolean
  /** 移动高亮，`null` 表示清掉。默认把 DOM 焦点（`preventScroll`）移到那一行。 */
  onHighlight?: (row: HTMLElement | null) => void
  /** 执行松开位置的那一行。默认替它派发一次 click，带上松开时的按键和修饰键。 */
  onActivate?: (row: HTMLElement, release: PointerEvent) => void
  /** **鼠标**在菜单外松开、什么都没执行：关掉菜单。手指在外面松开不会调它。 */
  onDismiss?: () => void
  /** 按住时指针停在边缘要自动滚动的元素。默认是溢出的菜单根，返回 null 表示不滚。 */
  getScroller?: () => HTMLElement | null
  /** 按视口坐标找元素。默认 `document.elementFromPoint`。测试用的接缝。 */
  hitTest?: (x: number, y: number) => Element | null
  /** @default 500 */
  longPressDelayMs?: number
  /** 这套模型当前是否生效，每次按下时读。@default true */
  isEnabled?: MaybeRefOrGetter<boolean>
}

export interface MenuPress {
  /** 菜单根的 pointerdown 处理函数。不方便摊对象时单独绑：`@pointerdown="press.onPointerDown"`。 */
  onPointerDown: (event: PointerEvent) => void
  /** 用 `v-bind` 摊到菜单根上：接管从里面开始的按压，并打上标记。 */
  menuProps: {
    'onPointerdown': (event: PointerEvent) => void
    'data-astryx-menu-press': ''
  }
  /** 用 `v-bind` 摊到触发器上：鼠标按下就开，手指按住才开。 */
  triggerProps: {
    onPointerdown: (event: PointerEvent) => void
    onContextmenu: (event: MouseEvent) => void
  }
  /** 触发器收到的这次 click 是不是刚才那次按压的。那次按压已经开或关过菜单，click 不能再切换。 */
  isTriggerClickFromPress: () => boolean
  /** 什么都不执行，结束正在进行的手势（菜单关了）。 */
  cancel: () => void
}

/**
 * 对应原版 Astryx 的 `hooks/useMenuPress`。纯状态机见 `internal/menuPressGesture.ts`。
 *
 * 菜单里的一次按压，不管从触发器还是从菜单里开始，从头管到尾：
 * - 按 `pointerId` 在文档层跟踪。手指的事件一直发给它落下的元素，所以只有文档看得见它滑到了哪。
 * - 高亮跟着指针走。
 * - **松开**位置那一行执行，就像它自己被点了一样，带上松开时的修饰键；浏览器为这次手势补的 click 被吞掉。
 * - 鼠标按下触发器就打开；手指按住满 `longPressDelayMs` 才打开，然后可以一路滑进菜单挑行。
 * - pointercancel、第二根手指、窗口失焦都以什么都不执行结束。滚动交给浏览器（菜单根上的 `touch-action`）。
 * - 菜单会滚动时，按住的指针停在上下边缘附近，菜单自动朝那边滚。
 */
export function useMenuPress(options: MenuPressOptions): MenuPress {
  let gesture: MenuPressGesture<HTMLElement> = IDLE_MENU_PRESS
  let pointerId: number | null = null
  let detach: (() => void) | null = null
  let stopTouchPrevent: (() => void) | null = null
  let lastPointerEvent: PointerEvent | null = null
  let triggerGesture: number | null = null
  /** 结束了上一次手势的那根「第二根手指」不能开始下一次。 */
  let ignoredPointerId: number | null = null

  const isEnabled = (): boolean => toValue(options.isEnabled) ?? true
  const getDocument = (): Document =>
    options.menuRef.value?.ownerDocument ?? options.triggerRef?.value?.ownerDocument ?? document

  function pointAt(event: PointerEvent): ReturnType<typeof resolvePoint> {
    return resolvePoint(event, getDocument(), {
      hitTest: options.hitTest,
      itemSelector: options.itemSelector ?? MENU_PRESS_ITEM_SELECTOR,
      menu: options.menuRef.value,
      trigger: options.triggerRef?.value ?? null,
    })
  }

  const autoscroll = createMenuAutoscroll(() => {
    if (lastPointerEvent != null)
      stepMove(lastPointerEvent)
  })

  const longPress = useLongPress({
    delayMs: options.longPressDelayMs ?? MENU_PRESS_LONG_PRESS_MS,
    onLongPress: fireLongPress,
  })

  function endGesture(): void {
    longPress.cancel()
    stopTouchPrevent?.()
    stopTouchPrevent = null
    autoscroll.stop()
    detach?.()
    detach = null
    pointerId = null
    lastPointerEvent = null
    gesture = IDLE_MENU_PRESS
  }

  function highlight(row: HTMLElement | null): void {
    if (options.onHighlight != null)
      options.onHighlight(row)
    else
      focusHighlight(row, options.menuRef.value, getDocument())
  }

  function activate(row: HTMLElement, release: PointerEvent): void {
    if (options.onActivate != null)
      runAsMenuPressActivation(() => options.onActivate!(row, release))
    else
      dispatchRowClick(row, release)
  }

  function applyEffect(effect: MenuPressEffect<HTMLElement>, native: PointerEvent | undefined): void {
    const doc = getDocument()
    switch (effect.type) {
      case 'none':
        return
      case 'open': {
        const pointerType = gesture.phase === 'open' ? gesture.pointerType : 'mouse'
        triggerGesture = currentGesture()
        if (!(options.onTriggerPress?.(pointerType) ?? false))
          endGesture()
        return
      }
      case 'highlight':
        highlight(effect.row)
        return
      case 'clear':
        highlight(null)
        return
      case 'act':
        // 先拆再执行：执行通常会把菜单关掉。
        endGesture()
        armStrayClick(doc)
        if (native != null)
          activate(effect.row, native)
        return
      case 'settle':
        endGesture()
        if (effect.stray)
          armStrayClick(doc)
        if (effect.dismiss)
          options.onDismiss?.()
    }
  }

  function step(event: MenuPressEvent<HTMLElement>, native?: PointerEvent): void {
    const result = menuPressStep(gesture, event)
    gesture = result.gesture
    applyEffect(result.effect, native)
  }

  function stepMove(event: PointerEvent): void {
    const point = pointAt(event)
    step({ type: 'move', row: point.row, isInMenu: point.isInMenu, time: Date.now() }, event)
  }

  function onDocumentMove(event: PointerEvent): void {
    if (event.pointerId !== pointerId)
      return
    lastPointerEvent = event
    if (gesture.phase === 'triggerPress') {
      // 挪远了的手指是在滚动，不是按住。容差和 ContextMenu 的长按是同一个。
      if (!longPress.moveTo({ x: event.clientX, y: event.clientY }))
        step({ type: 'cancel' })
      return
    }
    stepMove(event)
    if (gesture.phase === 'tracking')
      autoscroll.update(event, options.getScroller != null ? options.getScroller() : overflowingMenu(options.menuRef.value))
    else
      autoscroll.stop()
  }

  function onDocumentUp(event: PointerEvent): void {
    if (event.pointerId !== pointerId)
      return
    const point = pointAt(event)
    step({ type: 'up', row: point.row, isInMenu: point.isInMenu, isOnTrigger: point.isOnTrigger, time: Date.now() }, event)
  }

  function onDocumentCancel(event: PointerEvent): void {
    if (event.pointerId === pointerId)
      step({ type: 'cancel' })
  }

  function onOtherPointerDown(event: PointerEvent): void {
    // 第二根手指结束这次手势：两根手指是捏合或滚动，不是挑选。
    if (event.pointerId !== pointerId) {
      ignoredPointerId = event.pointerId
      step({ type: 'cancel' })
    }
  }

  function onWindowBlur(): void {
    step({ type: 'cancel' })
  }

  function attach(id: number): void {
    detach?.()
    const doc = getDocument()
    const view = doc.defaultView
    pointerId = id
    doc.addEventListener('pointermove', onDocumentMove, true)
    doc.addEventListener('pointerup', onDocumentUp, true)
    doc.addEventListener('pointercancel', onDocumentCancel, true)
    doc.addEventListener('pointerdown', onOtherPointerDown, true)
    view?.addEventListener('blur', onWindowBlur)
    detach = () => {
      doc.removeEventListener('pointermove', onDocumentMove, true)
      doc.removeEventListener('pointerup', onDocumentUp, true)
      doc.removeEventListener('pointercancel', onDocumentCancel, true)
      doc.removeEventListener('pointerdown', onOtherPointerDown, true)
      view?.removeEventListener('blur', onWindowBlur)
    }
  }

  function fireLongPress(): void {
    if (gesture.phase !== 'triggerPress')
      return
    triggerGesture = currentGesture()
    if (!(options.onTriggerPress?.(gesture.pointerType) ?? false)) {
      step({ type: 'cancel' })
      return
    }
    // 触发器的 touch-action 在手指落下时就定了；现在这根手指在操控菜单，页面不能在它下面滚。
    stopTouchPrevent = preventTouchScroll(getDocument())
    step({ type: 'opened', time: Date.now() })
  }

  function consumeIgnored(event: PointerEvent): boolean {
    if (event.pointerId !== ignoredPointerId)
      return false
    ignoredPointerId = null
    return true
  }

  function onPointerDown(event: PointerEvent): void {
    const menu = options.menuRef.value
    if (!isEnabled() || menu == null || consumeIgnored(event))
      return
    if (gesture.phase !== 'idle') {
      step({ type: 'cancel' })
      return
    }
    const pointerType = normalizePointerType(event.pointerType)
    if (pointerType == null || (pointerType === 'mouse' && (event.button ?? 0) !== 0))
      return
    // 最里层的模型接这次按压：飞出层是父菜单的 DOM 后代，两层都会看到同一个指针。
    const target = event.target instanceof Element ? event.target : null
    if (target?.closest(MENU_PRESS_ROOT_SELECTOR) !== menu)
      return
    // 手指抬起时浏览器会向落下的那一行补发兼容鼠标事件，再点亮它一次。取消 pointerdown 就没有这些事件，滚动不受影响。
    if (pointerType !== 'mouse')
      event.preventDefault()
    attach(event.pointerId)
    lastPointerEvent = event
    const point = pointAt(event)
    step({ type: 'down', target: 'menu', pointerType, row: point.row, time: Date.now() }, event)
  }

  function onTriggerPointerDown(event: PointerEvent): void {
    if (consumeIgnored(event) || !isEnabled() || gesture.phase !== 'idle' || options.onTriggerPress == null)
      return
    const pointerType = normalizePointerType(event.pointerType)
    if (pointerType == null || (event.button ?? 0) !== 0)
      return
    // macOS 上 Control+点击是右键菜单。
    if (pointerType === 'mouse' && event.ctrlKey)
      return
    attach(event.pointerId)
    lastPointerEvent = event
    if (pointerType !== 'mouse')
      longPress.start({ x: event.clientX, y: event.clientY })
    step({ type: 'down', target: 'trigger', pointerType, row: null, time: Date.now() }, event)
  }

  /** 手指按住触发器是在开菜单，不是要浏览器自己的长按菜单。鼠标右键不碰。 */
  function onTriggerContextMenu(event: MouseEvent): void {
    if (gesture.phase !== 'idle' && gesture.pointerType !== 'mouse')
      event.preventDefault()
  }

  function isTriggerClickFromPress(): boolean {
    return triggerGesture != null && triggerGesture === currentGesture()
  }

  function cancel(): void {
    if (gesture.phase !== 'idle')
      step({ type: 'cancel' })
    endGesture()
  }

  // 在第一次按压之前先把手势计数器的监听装上。
  currentGesture()
  if (getCurrentScope() != null)
    onScopeDispose(endGesture)

  return {
    cancel,
    isTriggerClickFromPress,
    menuProps: { 'data-astryx-menu-press': '', 'onPointerdown': onPointerDown },
    onPointerDown,
    triggerProps: { onContextmenu: onTriggerContextMenu, onPointerdown: onTriggerPointerDown },
  }
}
