/**
 * 在结果列表上用手指上下拖动时，把焦点从搜索框挪开（上游
 * internal/useDismissSearchOnTouchDrag.ts）。
 *
 * 搜索框失去焦点，屏幕键盘就收起来，下面的行露出来；输入的文字保留。焦点交给调用方
 * 给的目标（弹层自己的面板），不会落到弹层后面的页面上。不监听 scroll：过滤结果会
 * 把 scrollTop 收回来，打字时也会触发 scroll。小幅移动、轻点、多指手势都不动焦点。
 */

const DRAG_THRESHOLD_PX = 8

type SearchInput = HTMLInputElement | null | undefined

export interface DismissSearchOnTouchDragHandlers {
  onTouchstart: (event: TouchEvent) => void
  onTouchmove: (event: TouchEvent) => void
  onTouchend: () => void
  onTouchcancel: () => void
}

export function dismissSearchOnTouchDrag(
  getSearchInputs: () => readonly SearchInput[],
  getFocusTarget?: () => HTMLElement | null | undefined,
): DismissSearchOnTouchDragHandlers {
  let startY: number | null = null
  const reset = (): void => {
    startY = null
  }
  return {
    onTouchstart(event) {
      startY = event.touches.length === 1 ? event.touches[0]!.clientY : null
    },
    onTouchmove(event) {
      if (event.touches.length !== 1) {
        reset()
        return
      }
      if (startY == null || Math.abs(event.touches[0]!.clientY - startY) < DRAG_THRESHOLD_PX)
        return
      reset()
      const focused = getSearchInputs().find(input => input != null && input === input.ownerDocument.activeElement)
      if (focused == null)
        return
      const target = getFocusTarget?.()
      if (target != null)
        target.focus({ preventScroll: true })
      else
        focused.blur()
    },
    onTouchend: reset,
    onTouchcancel: reset,
  }
}
