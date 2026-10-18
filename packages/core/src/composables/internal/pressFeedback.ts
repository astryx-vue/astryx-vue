import { getCurrentScope, onScopeDispose } from 'vue'
import '../../../styles/pressable.css'

/** 标出要走上报按压模型的元素。样式在 `styles/pressable.css`。 */
export const PRESSABLE_ATTRIBUTE = 'data-astryx-pressable'
/** 按压成立时由控制器写在元素上，抬手时移除。 */
export const PRESSED_ATTRIBUTE = 'data-astryx-pressed'

/** 手指按下多久才算真按了。 */
const HOLD_MS = 150
/** 手指移动超过这个距离就当是滑动，不是按压。 */
const MOVE_TOLERANCE_PX = 10

const PRESSABLE_PROPS: Readonly<Record<string, string>> = Object.freeze({ [PRESSABLE_ATTRIBUTE]: '' })

export interface UsePressFeedbackReturn {
  /**
   * 铺到「背景画按压反馈」的那个元素上。
   * 同一个元素还要配一份 `styles/pressable.css` 里的样式（引入 hook 时自动带上）。
   */
  pressableProps: Record<string, string>
}

interface PressState {
  pointerId: number
  element: HTMLElement
  startX: number
  startY: number
  believed: boolean
  cancelled: boolean
  timer: ReturnType<typeof setTimeout> | null
}

/**
 * 一个文档级的控制器，给所有带标记的元素统一做按压反馈。
 * 第一个用到的组件装上它，最后一个卸载时拆掉，所以每个元素自己不加监听、不加状态。
 */
let press: PressState | null = null
let users = 0
let installed = false
let releaseTimer: ReturnType<typeof setTimeout> | null = null

function clearPressTimer(): void {
  if (press?.timer != null) {
    clearTimeout(press.timer)
    press.timer = null
  }
}

function clearReleaseTimer(): void {
  if (releaseTimer != null) {
    clearTimeout(releaseTimer)
    releaseTimer = null
  }
}

function paint(element: HTMLElement): void {
  element.setAttribute(PRESSED_ATTRIBUTE, '')
}

function unpaint(element: HTMLElement): void {
  element.removeAttribute(PRESSED_ATTRIBUTE)
}

function reset(): void {
  clearPressTimer()
  if (press != null)
    unpaint(press.element)
  press = null
}

/** 抬手后让样式先画到 1，再撤掉属性，这样淡出的是 CSS 过渡。 */
function releaseAfterTap(element: HTMLElement): void {
  paint(element)
  clearReleaseTimer()
  releaseTimer = setTimeout(() => {
    releaseTimer = null
    unpaint(element)
  }, 0)
}

function onPointerDown(event: PointerEvent): void {
  if (event.pointerType === 'mouse')
    return
  const target = event.target
  if (!(target instanceof Element))
    return
  const element = target.closest<HTMLElement>(`[${PRESSABLE_ATTRIBUTE}]`)
  if (element == null)
    return

  reset()
  press = {
    pointerId: event.pointerId,
    element,
    startX: event.clientX,
    startY: event.clientY,
    believed: false,
    cancelled: false,
    timer: setTimeout(() => {
      if (press == null || press.cancelled)
        return
      press.believed = true
      press.timer = null
      paint(press.element)
    }, HOLD_MS),
  }
}

function onPointerMove(event: PointerEvent): void {
  if (press == null || press.cancelled || event.pointerId !== press.pointerId)
    return
  const travelled = Math.hypot(event.clientX - press.startX, event.clientY - press.startY)
  if (travelled < MOVE_TOLERANCE_PX)
    return
  // 手指一滑就把这次按压作废，本题内不再恢复。
  press.cancelled = true
  clearPressTimer()
  unpaint(press.element)
}

function onPointerUp(event: PointerEvent): void {
  if (press == null || event.pointerId !== press.pointerId)
    return
  const current = press
  clearPressTimer()
  press = null
  // 已经作废的一次按压到此为止，不能因为抬手又亮回来。
  if (current.cancelled || current.believed)
    unpaint(current.element)
  else
    releaseAfterTap(current.element)
}

/** 浏览器收回这次手势（来电、系统手势），直接作废，不要补那一下。 */
function onPointerCancel(event: PointerEvent): void {
  if (press == null || event.pointerId !== press.pointerId)
    return
  clearPressTimer()
  press.cancelled = true
  unpaint(press.element)
  press = null
}

function onScroll(): void {
  if (press == null)
    return
  press.cancelled = true
  clearPressTimer()
  unpaint(press.element)
}

function install(): void {
  if (installed || typeof document === 'undefined')
    return
  installed = true
  document.addEventListener('pointerdown', onPointerDown, true)
  document.addEventListener('pointermove', onPointerMove, true)
  document.addEventListener('pointerup', onPointerUp, true)
  document.addEventListener('pointercancel', onPointerCancel, true)
  document.addEventListener('scroll', onScroll, true)
}

function uninstall(): void {
  if (!installed || typeof document === 'undefined')
    return
  installed = false
  document.removeEventListener('pointerdown', onPointerDown, true)
  document.removeEventListener('pointermove', onPointerMove, true)
  document.removeEventListener('pointerup', onPointerUp, true)
  document.removeEventListener('pointercancel', onPointerCancel, true)
  document.removeEventListener('scroll', onScroll, true)
  clearReleaseTimer()
  reset()
}

/** 测试用：拆掉控制器，回到没有任何人用过它的状态。 */
export function resetPressFeedbackForTest(): void {
  users = 0
  uninstall()
}

/**
 * 对应原版 Astryx 的 `hooks/usePressFeedback`。
 *
 * 手指按下去时，CSS 的 `:active` 会在手指落下的瞬间就亮，而且滚动已经开始了它可能还亮着。
 * 这里的按压模型反过来：先等 150 毫秒，确认这真是按压；手指一动超过 10 像素、
 * 或者页面滚走了，马上作废，本次按压里不再亮回来；快速点一下则在抬手时补上；
 * 松手后 200 毫秒淡出。这几个时间和系统列表的手感一致。
 *
 * 一个文档级控制器给所有带标记的元素做这件事（第一个用到的组件装上，最后一个卸载时拆掉），
 * 所以调用这个组合式函数不会给你的元素加监听，也不加状态。
 *
 * 鼠标上的表现不变：`styles/pressable.css` 里给鼠标留了 `:active`，
 * 在 `@media (pointer: coarse)` 之外才生效。
 */
export function usePressFeedback(): UsePressFeedbackReturn {
  users += 1
  install()
  if (getCurrentScope() != null) {
    onScopeDispose(() => {
      users -= 1
      if (users <= 0)
        uninstall()
    })
  }

  return { pressableProps: PRESSABLE_PROPS as Record<string, string> }
}

/** 测试用：当前有没有装着控制器。 */
export function isPressFeedbackInstalledForTest(): boolean {
  return installed
}
