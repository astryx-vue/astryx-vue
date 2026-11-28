import { idlePressGesture, pressGestureStep } from './pressGesture.js'
import { apply, button, finger, finish, releaseIfDead, takeOver } from './pressSlot.js'
import { pressSurfaceAt } from './pressSurface.js'

/**
 * 鼠标键和空格键的按压。`@media (pointer: coarse)` 读的是主指针，所以手机和平板上，
 * 连接的鼠标、触控板和键盘也丢了 `:active`。这些按压立刻亮、按住期间一直亮、松开后和手指一样淡出。
 * 主指针精细的设备（桌面）上这里什么都不做，`:active` 照旧。
 */

/**
 * 样式是不是已经把 `:active` 丢给了控制器：`@media (pointer: coarse)` 读的是主指针，
 * 所以在手机和平板上，连接的鼠标、触控板和空格键也丢了 `:active`。每次这类按压时才问，
 * 渲染可按元素从不查询指针。
 */
export function stylesheetDroppedActive(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches
}

/** 空格键能当按钮激活的 `<input>` 类型。浏览器按住空格时它们和 `<button>` 一样匹配 `:active`。 */
const SPACE_ACTIVATED_INPUT_TYPES: ReadonlySet<string> = new Set(['button', 'image', 'reset', 'submit'])

/** 菜单自己的高亮是它唯一的画面：按住一行、高亮却跟着指针走到另一行，不能亮两行。 */
const MENU_PRESS_ROOT = '[data-astryx-menu-press]'

/**
 * 鼠标键或空格键按压画在哪个元素上：最里层的可按元素，菜单里除外。
 * 键盘的按压只画在自己就是可按元素的焦点元素上，和 `:active` 一样。
 */
function buttonSurfaceAt(target: EventTarget | null, pointerId: number | null): HTMLElement | null {
  const element = pressSurfaceAt(target)
  if (element == null || element.closest(MENU_PRESS_ROOT) != null)
    return null
  if (pointerId == null && element !== target)
    return null
  return element
}

/** 在可按元素上开始一次鼠标键或空格键的按压。 */
export function pressButton(target: EventTarget | null, pointerId: number | null): void {
  // 还在淡出的上一次按压立刻结束：新的一次拥有这个槽位。
  finish(button)
  const element = buttonSurfaceAt(target, pointerId)
  if (element == null)
    return
  takeOver(finger, element)
  button.live = { element, gesture: idlePressGesture(), pointerId, timer: null }
  holdKey(pointerId == null)
  apply(button, pressGestureStep(button.live.gesture, { kind: 'buttonDown' }))
}

/** 鼠标键或按键松开：和手指一样淡出。 */
export function releaseButton(): void {
  holdKey(false)
  if (button.live == null)
    return
  apply(button, pressGestureStep(button.live.gesture, { kind: 'up' }))
}

/** 平台拿走了鼠标的按压：画面立刻消失。 */
export function cancelButton(): void {
  holdKey(false)
  if (button.live == null)
    return
  apply(button, pressGestureStep(button.live.gesture, { kind: 'cancel' }))
  releaseIfDead(button)
}

/** 空格键能不能激活这个目标：`<button>` 和几种按钮型 `<input>`。链接和 `role="button"` 按空格什么都不发生。 */
function activatesOnSpace(target: EventTarget | null): boolean {
  if (target instanceof HTMLButtonElement)
    return true
  return target instanceof HTMLInputElement && SPACE_ACTIVATED_INPUT_TYPES.has(target.type)
}

/**
 * 空格落在自己就是可按元素的焦点按钮上。在冒泡阶段听，页面自己的处理函数之后：
 * 页面取消了的按压（preventDefault）什么都不画，和 `:active` 不会成立一样。
 */
export function onKeyDown(event: KeyboardEvent): void {
  if (
    event.key !== ' '
    || event.repeat
    || event.isComposing
    || event.defaultPrevented
    || !activatesOnSpace(event.target)
    || !stylesheetDroppedActive()
  ) {
    return
  }
  pressButton(event.target, null)
}

function onKeyUp(event: KeyboardEvent): void {
  if (event.key === ' ' && button.live != null && button.live.pointerId == null)
    releaseButton()
}

/** 焦点离开了被按的按钮，或窗口失去焦点：松开事件可能再也到不了，这次按压现在就带着淡出结束。 */
function onBlur(): void {
  if (button.live != null && button.live.pointerId == null)
    releaseButton()
}

const PASSIVE = { passive: true } as const
const PASSIVE_CAPTURE = { capture: true, passive: true } as const

/** 空格键的松开和失焦监听是否挂着。 */
let keyHeld = false

/**
 * 只在空格按住期间挂着松开和失焦的监听，按完就拆：静止时按键路径只有一个 keydown 监听。
 * `blur` 不冒泡，捕获阶段才听得到元素和窗口失焦。
 */
function holdKey(held: boolean): void {
  if (held === keyHeld)
    return
  keyHeld = held
  if (held) {
    window.addEventListener('keyup', onKeyUp, PASSIVE)
    window.addEventListener('blur', onBlur, PASSIVE_CAPTURE)
  }
  else {
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('blur', onBlur, PASSIVE_CAPTURE)
  }
}

button.onFinish = () => holdKey(false)

/**
 * 挂上空格键的监听。空格要在冒泡阶段听，才看得到页面自己的 preventDefault，
 * 所以不走共用输入流（它在捕获阶段）。
 */
export function attachButtonKeys(): void {
  window.addEventListener('keydown', onKeyDown, PASSIVE)
}

export function detachButtonKeys(): void {
  window.removeEventListener('keydown', onKeyDown)
  holdKey(false)
}
