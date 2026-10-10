import type { Ref } from 'vue'
import { onScopeDispose, watch } from 'vue'
import { getFocusables } from '../layer/focus.js'

export interface UseFocusTrapOptions {
  /** 要陷阱焦点的容器元素 */
  container: Ref<HTMLElement | null>
  /** 是否启用焦点陷阱 */
  isEnabled: Ref<boolean>
  /** 初始焦点目标（可选） */
  initialFocus?: () => HTMLElement | null
}

export interface FocusTrap {
  /** 手动更新可聚焦元素列表 */
  update: () => void
  /** 聚焦到陷阱内的第一个元素 */
  focusFirst: () => void
  /** 聚焦到陷阱内的最后一个元素 */
  focusLast: () => void
}

/**
 * 在容器内陷阱键盘焦点，按 Tab 时循环聚焦容器内的可聚焦元素。
 * 用于模态对话框、抽屉等需要限制焦点范围的浮层组件。
 */
export function useFocusTrap(options: UseFocusTrapOptions): FocusTrap {
  const { container, isEnabled, initialFocus } = options

  function onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !isEnabled.value)
      return

    const el = container.value
    if (!el || !el.contains(event.target as Node))
      return

    const focusables = getFocusables(el)
    if (focusables.length === 0) {
      event.preventDefault()
      return
    }

    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement

    if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    }
    else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  function update(): void {
    // 预留方法，未来可以在此更新可聚焦元素缓存
  }

  function focusFirst(): void {
    const el = container.value
    if (!el)
      return
    const focusables = getFocusables(el)
    if (focusables.length > 0)
      focusables[0].focus()
  }

  function focusLast(): void {
    const el = container.value
    if (!el)
      return
    const focusables = getFocusables(el)
    if (focusables.length > 0)
      focusables[focusables.length - 1].focus()
  }

  function setup(): void {
    document.addEventListener('keydown', onKeyDown, true)
  }

  function teardown(): void {
    document.removeEventListener('keydown', onKeyDown, true)
  }

  watch(isEnabled, (enabled) => {
    if (enabled) {
      setup()
      // 如果提供了初始焦点目标，立即聚焦
      const target = initialFocus?.()
      if (target) {
        target.focus()
      }
      else {
        focusFirst()
      }
    }
    else {
      teardown()
    }
  }, { immediate: true })

  onScopeDispose(teardown)

  return { update, focusFirst, focusLast }
}
