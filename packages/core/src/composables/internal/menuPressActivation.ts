/**
 * 菜单按压模型的两件小事：「正在派发按压激活」的标记，以及跟踪某个指针对应的 touch 标识。
 *
 * 按压模型在松开时已经替那一行派发过一次 click，浏览器随后还会再补一个。吞掉那一个的是全包共用的
 * click 守卫（utils/clickGuard.ts）：手势宿主、动作组和菜单都用它，只有一份监听、一个时间窗口。
 * 菜单松开时布下的守卫一直装着（`staysInstalled`），手指松开时还取消挑选那根手指的 touchend，
 * 浏览器就不会为它生成 click。
 */

import { CLICK_GUARD_WINDOW_MS, disarmEveryClickGuard, withoutClickGuard } from '../../utils/clickGuard'

/** 松开之后，浏览器补发的 click 在这么长时间内仍然会被吞掉。 */
export const MENU_PRESS_STRAY_CLICK_MS = CLICK_GUARD_WINDOW_MS

let isModelActivation = false

/**
 * 按压模型派发的那次行激活是不是正在进行。只在那次派发的同步过程中为真，
 * 所以把激活转交给里面链接的行，能分清这是模型的 click 还是浏览器多出来的那个。
 */
export function isMenuPressActivation(): boolean {
  return isModelActivation
}

/** 在「模型激活」标记下执行一段同步代码；其间派发的 click 都不被守卫吞掉。 */
export function runAsMenuPressActivation(run: () => void): void {
  withoutClickGuard(() => {
    isModelActivation = true
    try {
      run()
    }
    finally {
      isModelActivation = false
    }
  })
}

/** 撤掉已经布下的守卫。卸载和测试里用。 */
export function resetMenuPress(): void {
  disarmEveryClickGuard()
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
