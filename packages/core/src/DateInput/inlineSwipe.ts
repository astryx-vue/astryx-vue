import { PASSIVE } from './scrollSettle.js'

/** 竖向位移不超过横向的这么多倍，就算横向。拇指划过时走的是弧线，所以偏向横向。 */
export const VERTICAL_DOMINANCE = 2

/** 小于这个位移是抖动，不定方向。 */
const AXIS_LOCK_SLOP = 6

/** 浏览器没有滚动时，横向划过这么远才算翻页。 */
export const SWIPE_DISTANCE = 32

/**
 * 让横向滚动器自己留住横向手势，竖向的交给底部面板。
 *
 * 只靠 `touch-action: pan-x` 不够：面板的 `touchmove` 监听是脚本，它的 preventDefault()
 * 照样会取消滚动。这里锁定方向后对横向手势 stopPropagation，面板就收不到。
 * 浏览器自己不肯平移的斜向划动（`pan-x` 拒绝的那些），由 `onSwipe` 按页翻；
 * 浏览器已经平移过的手势不报，惯性和吸附不被二次干预。
 *
 * `onSwipe` 的参数是滚动偏移要加的符号，可以直接 `scrollBy({ left: direction * pageWidth })`，
 * 它是物理方向，两种书写方向下都对。
 */
export function attachInlineSwipe(element: HTMLElement, onSwipe: (direction: 1 | -1) => void): () => void {
  let claimed: boolean | null = null
  let originX = 0
  let originY = 0
  let lastX = 0
  let offsetAtStart = 0
  let didPan = false

  const onStart = (event: TouchEvent): void => {
    const touch = event.touches[0]
    originX = touch?.clientX ?? 0
    originY = touch?.clientY ?? 0
    lastX = originX
    offsetAtStart = element.scrollLeft
    didPan = false
    claimed = null
  }

  const onMove = (event: TouchEvent): void => {
    if (claimed === false)
      return
    const touch = event.touches[0]
    if (touch == null)
      return
    if (claimed == null) {
      const dx = Math.abs(touch.clientX - originX)
      const dy = Math.abs(touch.clientY - originY)
      if (Math.max(dx, dy) < AXIS_LOCK_SLOP)
        return
      claimed = dy <= dx * VERTICAL_DOMINANCE
      if (!claimed)
        return
    }
    lastX = touch.clientX
    didPan ||= Math.abs(element.scrollLeft - offsetAtStart) >= 1
    event.stopPropagation()
  }

  const onEnd = (): void => {
    if (claimed === true && !didPan && Math.abs(lastX - originX) >= SWIPE_DISTANCE)
      onSwipe(lastX < originX ? 1 : -1)
    claimed = null
  }

  element.addEventListener('touchstart', onStart, PASSIVE)
  element.addEventListener('touchmove', onMove, PASSIVE)
  element.addEventListener('touchend', onEnd, PASSIVE)
  element.addEventListener('touchcancel', onEnd, PASSIVE)
  return () => {
    element.removeEventListener('touchstart', onStart, PASSIVE)
    element.removeEventListener('touchmove', onMove, PASSIVE)
    element.removeEventListener('touchend', onEnd, PASSIVE)
    element.removeEventListener('touchcancel', onEnd, PASSIVE)
  }
}
