/**
 * 菜单按压时的边缘自动滚动：按住的指针停在会滚动的菜单上下边缘附近，菜单就朝那边滚。
 */

/** 离边缘多近算「停在边缘」，单位像素。 */
export const MENU_PRESS_AUTOSCROLL_ZONE_PX = 24
const AUTOSCROLL_STEP_PX = 6
const AUTOSCROLL_INTERVAL_MS = 16

export interface MenuAutoscroll {
  /** 按指针的位置决定滚不滚、往哪滚。`scroller` 为 null 时停下。 */
  update: (event: PointerEvent, scroller: HTMLElement | null) => void
  stop: () => void
}

/** `onTick` 在每次真的滚动之后调用：行在静止的指针下面移动了，要重新看指针下是哪一行。 */
export function createMenuAutoscroll(onTick: () => void): MenuAutoscroll {
  let running: { timer: ReturnType<typeof setInterval>, direction: 1 | -1 } | null = null

  function stop(): void {
    if (running != null) {
      clearInterval(running.timer)
      running = null
    }
  }

  function directionFor(event: PointerEvent, scroller: HTMLElement): 1 | -1 | 0 {
    const rect = scroller.getBoundingClientRect()
    if (rect.height <= 0)
      return 0
    if (event.clientY <= rect.top + MENU_PRESS_AUTOSCROLL_ZONE_PX)
      return -1
    if (event.clientY >= rect.bottom - MENU_PRESS_AUTOSCROLL_ZONE_PX)
      return 1
    return 0
  }

  function update(event: PointerEvent, scroller: HTMLElement | null): void {
    const direction = scroller == null ? 0 : directionFor(event, scroller)
    if (direction === 0 || scroller == null) {
      stop()
      return
    }
    if (running?.direction === direction)
      return
    stop()
    const tick = (): void => {
      const before = scroller.scrollTop
      scroller.scrollTop = before + direction * AUTOSCROLL_STEP_PX
      if (scroller.scrollTop === before) {
        stop()
        return
      }
      onTick()
    }
    running = { direction, timer: setInterval(tick, AUTOSCROLL_INTERVAL_MS) }
    tick()
  }

  return { stop, update }
}

/** 默认的滚动容器：菜单根自己溢出时就是它。 */
export function overflowingMenu(menu: HTMLElement | null): HTMLElement | null {
  if (menu == null)
    return null
  return menu.scrollHeight > menu.clientHeight + 1 ? menu : null
}
