/**
 * 列表被键盘滚动时，静止不动的鼠标下会冒出新的行并补发 mouseenter。
 * 这种事件的坐标和上一次真实移动一样，不该抢走键盘的高亮；鼠标真的动了才算数。
 */
export interface StillPointerGate {
  /** 容器上每次 mousemove 都记下坐标。 */
  track: (event: MouseEvent) => void
  /** 这次 mouseenter 是不是鼠标真的移到了新位置。 */
  moved: (event: MouseEvent) => boolean
}

export function createStillPointerGate(): StillPointerGate {
  let lastX = Number.NaN
  let lastY = Number.NaN
  return {
    track(event) {
      lastX = event.clientX
      lastY = event.clientY
    },
    moved(event) {
      const changed = event.clientX !== lastX || event.clientY !== lastY
      lastX = event.clientX
      lastY = event.clientY
      return changed
    },
  }
}
