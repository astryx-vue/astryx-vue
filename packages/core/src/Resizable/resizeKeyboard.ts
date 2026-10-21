import type { ResizableProps } from '../composables/useResizable.js'
import { getCollapseControls } from '../composables/internal/resizableChannel.js'

const KEYBOARD_STEP = 10
const KEYBOARD_LARGE_STEP = 50

function gesture(resizable: ResizableProps, delta: number): void {
  resizable._onResizeStart()
  resizable._onResizeMove(delta)
  resizable._onResizeEnd()
}

/** 折叠时展开回之前的尺寸。没有登记控制函数时，收到最小值。 */
export function toggleCollapse(resizable: ResizableProps): void {
  const controls = getCollapseControls(resizable)
  if (controls) {
    if (resizable._isCollapsed)
      controls.expand()
    else
      controls.collapse()
    return
  }
  gesture(resizable, resizable._isCollapsed ? resizable._minSizePx : -resizable._size)
}

function grows(key: string, rtl: number, sign: number, isHorizontal: boolean): boolean {
  const axis = key === 'ArrowRight' || key === 'ArrowDown'
    ? 1
    : key === 'ArrowLeft' || key === 'ArrowUp'
      ? -1
      : 0
  return axis * (isHorizontal ? rtl : 1) * sign > 0
}

function adjacentSnap(resizable: ResizableProps, direction: 1 | -1, count: number): number {
  const ceiling = Number.isFinite(resizable._maxSizePx) ? resizable._maxSizePx : Number.POSITIVE_INFINITY
  const points = [...new Set(
    resizable._snaps.map(point => Math.min(ceiling, Math.max(resizable._minSizePx, point))),
  )].sort((left, right) => left - right)
  const ahead = direction > 0
    ? points.filter(point => point > resizable._size)
    : points.filter(point => point < resizable._size).reverse()
  if (ahead.length === 0)
    return resizable._size
  return ahead[Math.min(count, ahead.length) - 1] ?? resizable._size
}

/**
 * 分隔条上的方向键、Home、End、Enter。
 * 使用者自己的 keydown 要在调用本函数之前先跑。
 */
export function handleResizeKey(
  event: KeyboardEvent,
  resizable: ResizableProps,
  sign: number,
  rtl: number,
  isHorizontal: boolean,
): void {
  const step = event.shiftKey ? KEYBOARD_LARGE_STEP : KEYBOARD_STEP
  const key = event.key
  if (key === 'ArrowRight' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowUp') {
    event.preventDefault()
    if (resizable._isCollapsed) {
      if (grows(key, rtl, sign, isHorizontal))
        gesture(resizable, Math.max(resizable._minSizePx + step, resizable._collapsedSize))
      return
    }
    if (resizable._snaps.length > 0) {
      const direction = grows(key, rtl, sign, isHorizontal) ? 1 : -1
      gesture(resizable, adjacentSnap(resizable, direction, event.shiftKey ? 2 : 1) - resizable._size)
      return
    }
    const direction = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1
    gesture(resizable, direction * step * (isHorizontal ? rtl : 1) * sign)
    return
  }
  if (key === 'Home') {
    event.preventDefault()
    gesture(resizable, resizable._minSizePx - resizable._size)
    return
  }
  if (key === 'End') {
    event.preventDefault()
    if (Number.isFinite(resizable._maxSizePx))
      gesture(resizable, resizable._maxSizePx - resizable._size)
    return
  }
  if (key === 'Enter') {
    event.preventDefault()
    if (resizable._collapsible)
      toggleCollapse(resizable)
  }
}
