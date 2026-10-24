import type { Ref } from 'vue'
import { onMounted, shallowRef } from 'vue'
import { getInteractionModality, trackInteractionModality } from './interactionModality.js'

export interface FocusReturnVisibility {
  /** 为真时，焦点回到的那个元素不画焦点环。绑到它的 `data-*` 或类名上，让样式压掉环。 */
  isFocusRingSuppressed: Readonly<Ref<boolean>>
  /** 关闭浮层、准备把焦点还回去之前调：上一次是指针就压住焦点环。 */
  prepareFocusReturn: () => void
  /** 焦点归还处理完了，或者浮层又打开了：解除压制。 */
  resetFocusReturn: () => void
  /** 绑到接焦点的元素的 `focus` 上：之后如果是键盘把焦点移过来，环要重新出现。 */
  onFocusReturnTargetFocus: () => void
}

/**
 * 对应原版 Astryx 的 `hooks/useFocusReturnVisibility`（内部用）。
 *
 * 焦点照常还回去，但用鼠标或手指关掉浮层时不画焦点环。给那些自己画焦点环、
 * 光靠 `focusForLastInput` 不够的触发器（例如 DropdownMenu 的触发按钮、Selector）。
 */
export function useFocusReturnVisibility(): FocusReturnVisibility {
  const isFocusRingSuppressed = shallowRef(false)

  onMounted(trackInteractionModality)

  return {
    isFocusRingSuppressed,
    onFocusReturnTargetFocus: () => {
      if (getInteractionModality() === 'keyboard')
        isFocusRingSuppressed.value = false
    },
    prepareFocusReturn: () => {
      isFocusRingSuppressed.value = getInteractionModality() === 'pointer'
    },
    resetFocusReturn: () => {
      isFocusRingSuppressed.value = false
    },
  }
}
