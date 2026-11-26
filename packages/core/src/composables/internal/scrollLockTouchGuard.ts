/**
 * 锁滚动期间在触屏上挡住页面被一根手指拖动。
 *
 * iOS Safari 不认 `overflow: hidden` 的页面：手指一拖，背景照样跟着滚、还会回弹。
 * 这里取消那种拖动的 `touchmove`，但只取消没人接的：
 * - 两根手指（捏合）一律放行，页面被放大后一根手指的拖动是在平移放大的视图，也放行；
 * - 原生滑块（range）上的拖动放行；
 * - 手指下面往外的滚动链里，只要有一个元素在这个方向上还能滚（浮层里的滚动区），就放行。
 * 滚动方向要超过一点点位移才判断，起手的抖动不决定轴。
 */

/** 超过这么多像素才判断这次拖动往哪个轴。 */
const AXIS_SLOP = 4

type Axis = 'x' | 'y'

interface TouchStart {
  x: number
  y: number
  axis: Axis | null
  /** 这次拖动有没有被放行。放行了就一直放行，不会半路被取消。 */
  isAllowed: boolean
}

function canScroll(element: Element, axis: Axis, delta: number): boolean {
  const style = getComputedStyle(element)
  const overflow = axis === 'y' ? style.overflowY : style.overflowX
  if (overflow !== 'auto' && overflow !== 'scroll')
    return false
  const size = axis === 'y' ? element.clientHeight : element.clientWidth
  const content = axis === 'y' ? element.scrollHeight : element.scrollWidth
  const offset = axis === 'y' ? element.scrollTop : element.scrollLeft
  const max = content - size
  if (max <= 1)
    return false
  // 手指往下（delta > 0）是内容往上走，要还能往回滚；手指往上则要还没到底。
  return delta > 0 ? offset > 0 : offset < max
}

function scrollChainTakes(target: EventTarget | null, axis: Axis, delta: number): boolean {
  for (let node = target instanceof Element ? target : null; node != null; node = node.parentElement) {
    if (node === node.ownerDocument.documentElement || node === node.ownerDocument.body)
      return false
    if (canScroll(node, axis, delta))
      return true
  }
  return false
}

function isZoomed(view: Window | null): boolean {
  return (view?.visualViewport?.scale ?? 1) > 1.01
}

/** 触屏为主指针的设备才需要。返回拆掉监听的函数。 */
export function attachScrollLockTouchGuard(doc: Document): () => void {
  const view = doc.defaultView
  if (view == null || typeof view.matchMedia !== 'function' || !view.matchMedia('(pointer: coarse)').matches)
    return () => {}

  let touch: TouchStart | null = null

  function onTouchStart(event: TouchEvent): void {
    if (event.touches.length !== 1) {
      touch = null
      return
    }
    const point = event.touches[0]!
    const target = event.target instanceof Element ? event.target : null
    touch = {
      x: point.clientX,
      y: point.clientY,
      axis: null,
      isAllowed: isZoomed(view) || target?.closest('input[type="range"]') != null,
    }
  }

  function onTouchMove(event: TouchEvent): void {
    if (touch == null || touch.isAllowed)
      return
    if (event.touches.length !== 1) {
      touch.isAllowed = true
      return
    }
    const point = event.touches[0]!
    const dx = point.clientX - touch.x
    const dy = point.clientY - touch.y
    if (touch.axis == null) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < AXIS_SLOP)
        return
      touch.axis = Math.abs(dy) >= Math.abs(dx) ? 'y' : 'x'
    }
    const delta = touch.axis === 'y' ? dy : dx
    if (scrollChainTakes(event.target, touch.axis, delta)) {
      touch.isAllowed = true
      return
    }
    if (event.cancelable)
      event.preventDefault()
  }

  function onTouchEnd(): void {
    touch = null
  }

  doc.addEventListener('touchstart', onTouchStart, { capture: true, passive: true })
  doc.addEventListener('touchmove', onTouchMove, { capture: true, passive: false })
  doc.addEventListener('touchend', onTouchEnd, { capture: true, passive: true })
  doc.addEventListener('touchcancel', onTouchEnd, { capture: true, passive: true })
  return () => {
    doc.removeEventListener('touchstart', onTouchStart, true)
    doc.removeEventListener('touchmove', onTouchMove, true)
    doc.removeEventListener('touchend', onTouchEnd, true)
    doc.removeEventListener('touchcancel', onTouchEnd, true)
  }
}
