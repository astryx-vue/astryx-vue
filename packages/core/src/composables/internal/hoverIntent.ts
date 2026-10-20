import type { MenuPoint } from './safeTriangle.js'
import { isPointInSafeTriangle } from './safeTriangle.js'

/**
 * 悬停菜单的离开计时：指针离开触发器或菜单后，等一会儿再关。
 *
 * 中间有安全三角：指针从离开的那一点朝飞出层靠近边走时，每动一下就重新计时；
 * 指针停在三角里（瞄准某一行的那一刻）也算还在路上，计时到了会再续一轮。
 * 第一次移出三角之后，正在跑的那轮计时照常跑完。
 */
export interface HideTimer {
  /**
   * 开始离开计时。`apex` 是指针离开的位置，`flyout` 是飞出层元素；
   * 两者都有、而且菜单开着时才启用安全三角。
   */
  schedule: (apex: MenuPoint | null, flyout: HTMLElement | null, isOpen: boolean) => void
  /** 停掉计时，拆掉三角的指针监听。 */
  clear: () => void
}

export function createHideTimer(delay: () => number, onHide: () => void): HideTimer {
  let timer: ReturnType<typeof setTimeout> | null = null
  let stopTriangle: (() => void) | null = null

  function clearTriangle(): void {
    stopTriangle?.()
    stopTriangle = null
  }

  function clear(): void {
    if (timer != null) {
      clearTimeout(timer)
      timer = null
    }
    clearTriangle()
  }

  function schedule(apex: MenuPoint | null, flyout: HTMLElement | null, isOpen: boolean): void {
    clear()
    let lastPoint: MenuPoint | null = apex
    let isInside: (point: MenuPoint) => boolean = () => false

    const arm = (): void => {
      if (timer != null)
        clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        if (stopTriangle != null && lastPoint != null && isInside(lastPoint)) {
          arm()
          return
        }
        clearTriangle()
        onHide()
      }, delay())
    }
    arm()

    if (flyout == null || apex == null || !isOpen)
      return
    const rect = flyout.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0)
      return
    isInside = point => isPointInSafeTriangle(point, apex, rect)
    const doc = flyout.ownerDocument
    const onPointerMove = (move: PointerEvent): void => {
      lastPoint = { x: move.clientX, y: move.clientY }
      if (isInside(lastPoint)) {
        arm()
        return
      }
      clearTriangle()
    }
    doc.addEventListener('pointermove', onPointerMove, true)
    stopTriangle = () => doc.removeEventListener('pointermove', onPointerMove, true)
  }

  return { clear, schedule }
}
