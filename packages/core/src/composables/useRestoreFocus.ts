import type { Ref } from 'vue'
import { onScopeDispose, watch } from 'vue'
import { focusForLastInput } from './internal/focusReturn.js'
import { trackInteractionModality } from './internal/interactionModality.js'

export interface UseRestoreFocusOptions {
  /** 是否启用焦点恢复 */
  isEnabled: Ref<boolean>
  /** 是否应该恢复焦点（例如，对话框是否已打开） */
  shouldRestore: Ref<boolean>
}

export interface RestoreFocus {
  /** 手动保存当前焦点元素 */
  save: () => void
  /** 手动恢复焦点到之前保存的元素 */
  restore: () => void
}

/**
 * 在浮层组件打开时保存当前焦点元素，关闭时恢复焦点。
 * 用于对话框、抽屉、弹出菜单等浮层组件。
 *
 * 恢复时焦点环跟着上一次的输入走：键盘关掉的照常画环，鼠标或手指关掉的不画。
 */
export function useRestoreFocus(options: UseRestoreFocusOptions): RestoreFocus {
  const { isEnabled, shouldRestore } = options
  let savedElement: HTMLElement | null = null

  function save(): void {
    if (!isEnabled.value || typeof document === 'undefined')
      return
    trackInteractionModality()
    const active = document.activeElement
    if (active instanceof HTMLElement) {
      savedElement = active
    }
  }

  function restore(): void {
    if (!isEnabled.value || !savedElement)
      return
    // 只在元素仍在文档中且可聚焦时恢复焦点
    if (savedElement.isConnected && !savedElement.hasAttribute('disabled')) {
      focusForLastInput(savedElement)
    }
    savedElement = null
  }

  watch(shouldRestore, (should) => {
    if (should) {
      save()
    }
    else if (isEnabled.value && savedElement) {
      restore()
    }
  })

  onScopeDispose(() => {
    savedElement = null
  })

  return { save, restore }
}
