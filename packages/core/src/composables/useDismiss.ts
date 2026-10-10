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

  let ignoreNextOutsideClick = false

  function onClickOutside(event: PointerEvent): void {
    if (!isEnabled.value)
      return

    if (ignoreNextOutsideClick) {
      ignoreNextOutsideClick = false
      return
    }

    const el = container.value
    if (!el)
      return

    const target = event.target as Node
    if (el.contains(target))
      return

    const triggerEl = trigger?.value
    if (triggerEl?.contains(target))
      return

    onDismiss()
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (!isEnabled.value || !enableEscape.value)
      return

    if (event.key === 'Escape') {
      const el = container.value
      const target = event.target as Node

      if (el && el.contains(target)) {
        return
      }

      event.preventDefault()
      onDismiss()
    }
  }

  function setup(): void {
    if (typeof document !== 'undefined') {
      ignoreNextOutsideClick = true
      setTimeout(() => {
        ignoreNextOutsideClick = false
      }, 0)
      document.addEventListener('pointerdown', onClickOutside as EventListener, true)
      document.addEventListener('keydown', onKeyDown, true)
    }
  }

  function teardown(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('pointerdown', onClickOutside as EventListener, true)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }

  watch(isEnabled, (enabled) => {
    if (enabled) {
      setup()
    }
    else {
      teardown()
    }
  }, { immediate: true })

  onScopeDispose(teardown)
}
