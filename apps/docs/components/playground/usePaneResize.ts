import type { Ref } from 'vue'
import { ref } from 'vue'

/** 左右两栏都至少留这么宽。 */
const MIN_PANE = 280
/** 键盘方向键每按一次移动多少像素。 */
const KEY_STEP = 24

export interface PaneResize {
  /** 左侧编辑栏的宽度，写进 `--editor-size`。 */
  editorSize: Ref<string>
  onDividerDown: (event: PointerEvent) => void
  onDividerKey: (event: KeyboardEvent) => void
}

/** 拖动或用左右方向键调整编辑栏和预览栏之间的分隔条。 */
export function usePaneResize(
  editorPane: Ref<HTMLElement | null>,
  body: Ref<HTMLElement | null>,
): PaneResize {
  const editorSize = ref('440px')

  function onDividerDown(event: PointerEvent): void {
    if (event.button !== 0)
      return
    const target = event.currentTarget
    if (!(target instanceof HTMLElement))
      return
    target.setPointerCapture(event.pointerId)
    const startX = event.clientX
    const startWidth = editorPane.value?.getBoundingClientRect().width ?? 0
    const move = (ev: PointerEvent): void => {
      const bodyWidth = body.value?.getBoundingClientRect().width ?? 0
      const next = Math.min(Math.max(startWidth + ev.clientX - startX, MIN_PANE), Math.max(MIN_PANE, bodyWidth - MIN_PANE))
      editorSize.value = `${next}px`
    }
    const up = (ev: PointerEvent): void => {
      if (target.hasPointerCapture(ev.pointerId))
        target.releasePointerCapture(ev.pointerId)
      target.removeEventListener('pointermove', move)
      target.removeEventListener('pointerup', up)
    }
    target.addEventListener('pointermove', move)
    target.addEventListener('pointerup', up)
  }

  function onDividerKey(event: KeyboardEvent): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
      return
    event.preventDefault()
    const current = editorPane.value?.getBoundingClientRect().width ?? 480
    const delta = event.key === 'ArrowLeft' ? -KEY_STEP : KEY_STEP
    editorSize.value = `${Math.max(MIN_PANE, current + delta)}px`
  }

  return { editorSize, onDividerDown, onDividerKey }
}
