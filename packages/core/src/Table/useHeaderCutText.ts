import type { Ref } from 'vue'
import { shallowRef } from 'vue'
import { useCutTextOnKeyboardFocus } from '../Text/useCutTextOnKeyboardFocus.js'

export interface HeaderCutText {
  /** 键盘焦点所在的表头单元格。 */
  cell: Readonly<Ref<HTMLElement | null>>
  /** 单元格标题被截短时是完整标题，否则为 null。 */
  cutText: Readonly<Ref<string | null>>
  onFocusin: (event: FocusEvent) => void
  onFocusout: (event: FocusEvent) => void
  onPointerdown: () => void
  onKeydown: (event: KeyboardEvent) => void
}

/**
 * 表头标题被列宽截短时，键盘焦点到达单元格里的东西（可排序表头的排序按钮）
 * 就在提示里显示完整标题。鼠标悬停不显示。只在表格里的表头单元格上生效。
 * 监听挂在表头行或单元格上都行：焦点从哪个 `<th>` 里来，就量哪个。
 */
export function useHeaderCutText(): HeaderCutText {
  const cell = shallowRef<HTMLElement | null>(null)
  const cut = useCutTextOnKeyboardFocus({
    anchor: () => cell.value,
    isEnabled: () => cell.value?.closest('.astryx-table') != null,
  })

  return {
    cell,
    cutText: cut.cutText,
    onFocusin(event) {
      const target = event.target
      const next = target instanceof Element ? target.closest('th') : null
      if (next !== cell.value)
        cut.hide()
      cell.value = next
      cut.onFocusin(event)
    },
    onFocusout: cut.onFocusout,
    onPointerdown: cut.hide,
    onKeydown(event) {
      if (event.key === 'Escape')
        cut.hide()
    },
  }
}
