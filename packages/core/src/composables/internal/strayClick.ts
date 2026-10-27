/**
 * 菜单按压模型的两个模块级小状态：吞掉多余的 click，以及「正在派发按压激活」的标记。
 *
 * 按压模型在松开时已经替那一行派发过一次 click，浏览器随后还会再补一个（手指的那次落在按下的那一行上）。
 * 这里在 window 的捕获阶段把那一个吞掉，赶在应用和行自己的监听之前。
 * 松开时布下，下一次按下或 400 毫秒后撤掉。`detail === 0` 的 click（键盘、读屏、按压模型自己派发的）一律放行。
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
}

let swallower: StrayClickSwallower | null = null

function disarm(): void {
  if (swallower == null)
    return
  swallower.isArmed = false
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

/** 布下吞 click 的口子。同一个文档只装一次监听。 */
export function armStrayClick(doc: Document): void {
  const view = doc.defaultView
  if (view == null)
    return
  if (swallower == null || swallower.doc !== doc) {
    if (swallower != null) {
      swallower.doc.defaultView?.removeEventListener('click', onWindowClickCapture, true)
      swallower.doc.removeEventListener('pointerdown', disarm, true)
    }
    view.addEventListener('click', onWindowClickCapture, true)
    // 下一次按下是新的手势，它的 click 绝不能被吞。
    doc.addEventListener('pointerdown', disarm, true)
    swallower = { doc, isArmed: false, timer: null }
  }
  disarm()
  swallower.isArmed = true
  swallower.timer = setTimeout(disarm, MENU_PRESS_STRAY_CLICK_MS)
}

/** 撤掉已经布下的口子。卸载和测试里用。 */
export function resetMenuPress(): void {
  disarm()
}
