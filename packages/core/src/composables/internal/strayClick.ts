/**
 * 菜单按压模型的两个模块级小状态：吞掉多余的 click，以及「正在派发按压激活」的标记。
 *
 * 按压模型在松开时已经替那一行派发过一次 click，浏览器随后还会再补一个（手指的那次落在按下的那一行上）。
 * 这里在 window 的捕获阶段把那一个吞掉，赶在应用和行自己的监听之前。
 * 松开时布下，下一次按下或 400 毫秒后撤掉。`detail === 0` 的 click（键盘、读屏、按压模型自己派发的）一律放行。
 *
 * 手指松开时还可以让这个口子直接取消那根手指的 touchend：浏览器就不会为它生成 click，
 * 慢一拍的页面上，那个 click 也不会晚到、落在新出现的行上。取消之后立刻撤掉，之后没有按压对应的 click 照常放行。
 * 只取消挑选那根手指的 touchend；浏览器当作滚动的 touchend（不可取消）不碰。
 */

/** 松开之后，浏览器补发的 click 在这么长时间内仍然会被吞掉。 */
export const MENU_PRESS_STRAY_CLICK_MS = 400

let isModelActivation = false

/**
 * 按压模型派发的那次行激活是不是正在进行。只在那次派发的同步过程中为真，
 * 所以把激活转交给里面链接的行，能分清这是模型的 click 还是浏览器多出来的那个。
 */
export function isMenuPressActivation(): boolean {
  return isModelActivation
}

/** 在「模型激活」标记下执行一段同步代码。 */
export function runAsMenuPressActivation(run: () => void): void {
  isModelActivation = true
  try {
    run()
  }
  finally {
    isModelActivation = false
  }
}

interface StrayClickSwallower {
  doc: Document
  isArmed: boolean
  timer: ReturnType<typeof setTimeout> | null
  cancelsTouchEnd: boolean
  /** 挑选的那根手指。不知道是哪根时，任何手指的 touchend 都算。 */
  touchIdentifier: number | null
}

export interface ArmStrayClickOptions {
  /** 同时取消这次松开的 touchend。 */
  cancelsTouchEnd?: boolean
  /** 挑选那根手指的 touch 标识；没有时取消遇到的第一个 touchend。 */
  touchIdentifier?: number | null
}

let swallower: StrayClickSwallower | null = null

function disarm(): void {
  if (swallower == null)
    return
  swallower.isArmed = false
  swallower.cancelsTouchEnd = false
  swallower.touchIdentifier = null
  if (swallower.timer != null) {
    clearTimeout(swallower.timer)
    swallower.timer = null
  }
}

function onWindowClickCapture(event: MouseEvent): void {
  if (swallower == null || !swallower.isArmed)
    return
  if (event.detail === 0 || isModelActivation)
    return
  event.preventDefault()
  event.stopImmediatePropagation()
  disarm()
}

function onWindowTouchEndCapture(event: TouchEvent): void {
  if (swallower == null || !swallower.isArmed || !swallower.cancelsTouchEnd || !event.cancelable)
    return
  const { touchIdentifier } = swallower
  if (touchIdentifier != null && event.changedTouches != null
    && !Array.from(event.changedTouches).some(touch => touch.identifier === touchIdentifier)) {
    return
  }
  event.preventDefault()
  disarm()
}

/** 布下吞 click 的口子。同一个文档只装一次监听。 */
export function armStrayClick(doc: Document, options: ArmStrayClickOptions = {}): void {
  const view = doc.defaultView
  if (view == null)
    return
  if (swallower == null || swallower.doc !== doc) {
    if (swallower != null) {
      swallower.doc.defaultView?.removeEventListener('click', onWindowClickCapture, true)
      swallower.doc.defaultView?.removeEventListener('touchend', onWindowTouchEndCapture, true)
      swallower.doc.removeEventListener('pointerdown', disarm, true)
    }
    view.addEventListener('click', onWindowClickCapture, true)
    view.addEventListener('touchend', onWindowTouchEndCapture, { capture: true, passive: false })
    // 下一次按下是新的手势，它的 click 绝不能被吞。
    doc.addEventListener('pointerdown', disarm, true)
    swallower = { doc, isArmed: false, timer: null, cancelsTouchEnd: false, touchIdentifier: null }
  }
  disarm()
  swallower.isArmed = true
  swallower.cancelsTouchEnd = options.cancelsTouchEnd === true
  swallower.touchIdentifier = options.touchIdentifier ?? null
  swallower.timer = setTimeout(disarm, MENU_PRESS_STRAY_CLICK_MS)
}

/** 撤掉已经布下的口子。卸载和测试里用。 */
export function resetMenuPress(): void {
  disarm()
}

/**
 * 跟踪某个指针对应的 touch 标识。指针按下之后的下一个 touchstart 就是它的：
 * WebKit 给 touch 的标识和指针 id 相同；Chromium 用自己的标识，这时唯一的那个改变的 touch 就是。
 * 有好几个 touch 而且没有一个和指针 id 对得上，就说不出是哪根。
 * 返回停止跟踪的函数，`identifier()` 取当前读到的标识。
 */
export function trackTouchOfPointer(view: Window, pointerId: number): { identifier: () => number | null, stop: () => void } {
  let identifier: number | null = null
  const stop = (): void => view.removeEventListener('touchstart', onTouchStart, true)
  function onTouchStart(event: TouchEvent): void {
    stop()
    const touches = event.changedTouches == null ? [] : Array.from(event.changedTouches)
    if (touches.some(touch => touch.identifier === pointerId))
      identifier = pointerId
    else
      identifier = touches.length === 1 ? touches[0]!.identifier : null
  }
  view.addEventListener('touchstart', onTouchStart, true)
  return { identifier: () => identifier, stop }
}
