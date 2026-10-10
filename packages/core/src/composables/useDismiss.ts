import type { Ref } from 'vue'
import { onScopeDispose, watch } from 'vue'

export interface UseDismissOptions {
  /** 要监听点击外部的容器元素 */
  container: Ref<HTMLElement | null>
  /** 触发器元素（点击它不算点击外部） */
  trigger?: Ref<HTMLElement | null>
  /** 是否启用点击外部关闭 */
  isEnabled: Ref<boolean>
  /** 是否启用 Escape 键关闭 */
  enableEscape?: Ref<boolean>
  /** 关闭回调 */
  onDismiss: () => void
}

/**
 * 统一处理浮层组件的关闭逻辑：点击外部和按 Escape 键。
 * 用于 Popover、Tooltip、DropdownMenu、ContextMenu 等。
 */
export function useDismiss(options: UseDismissOptions): void {
  const {
    container,
    trigger,
    isEnabled,
    enableEscape = { value: true } as Ref<boolean>,
    onDismiss,
  } = options

  function onClickOutside(event: MouseEvent): void {
    if (!isEnabled.value)
      return

    const el = container.value
    if (!el)
      return

    const target = event.target as Node
    // 点击在容器内，忽略
    if (el.contains(target))
      return

    // 点击在触发器上，忽略（触发器通常自己处理切换逻辑）
    const triggerEl = trigger?.value
    if (triggerEl?.contains(target))
      return

    onDismiss()
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (!isEnabled.value || !enableEscape.value)
      return

    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      onDismiss()
    }
  }

  function setup(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', onClickOutside, true)
      document.addEventListener('keydown', onKeyDown, true)
    }
  }

  function teardown(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('mousedown', onClickOutside, true)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }

  watch(isEnabled, (enabled) => {
    if (enabled) {
      // 稍微延迟，避免立即触发（打开动作的点击事件可能还在冒泡）
      setTimeout(setup, 0)
    }
    else {
      teardown()
    }
  }, { immediate: true })

  onScopeDispose(teardown)
}
