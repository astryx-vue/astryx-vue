import type { Ref } from 'vue'
import { nextTick, onScopeDispose, watch } from 'vue'

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

// 全局 Escape 层级栈：最后一个（最内层）处理 Escape
const escapeStack: Array<() => void> = []

/**
 * 统一处理浮层组件的关闭逻辑：点击外部和按 Escape 键。
 * 用于 Popover、Tooltip、DropdownMenu、ContextMenu 等。
 *
 * 设计决策：
 * - 使用 pointerdown 事件（包含 mouse 和 touch）
 * - 在 nextTick 后附加监听器，避免打开时的点击立即触发关闭
 * - Escape 键使用全局栈，确保最内层的浮层优先处理
 */
export function useDismiss(options: UseDismissOptions): void {
  const {
    container,
    trigger,
    isEnabled,
    enableEscape = { value: true } as Ref<boolean>,
    onDismiss,
  } = options

  let isAttached = false

  function onClickOutside(event: PointerEvent): void {
    if (!isEnabled.value)
      return

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

  function onEscapeKey(event: KeyboardEvent): void {
    if (!isEnabled.value || !enableEscape.value)
      return

    if (event.key === 'Escape') {
      // 只有栈顶（最内层）的浮层处理 Escape
      const topHandler = escapeStack[escapeStack.length - 1]
      if (topHandler === onDismiss) {
        event.preventDefault()
        onDismiss()
      }
    }
  }

  async function setup(): Promise<void> {
    if (typeof document === 'undefined' || isAttached)
      return

    // 在 nextTick 后附加监听器，避免打开时的点击立即触发关闭
    await nextTick()

    if (!isEnabled.value) // 可能在 nextTick 期间被禁用
      return

    isAttached = true
    document.addEventListener('pointerdown', onClickOutside as EventListener, true)
    document.addEventListener('keydown', onEscapeKey, true)

    // 将当前 dismiss 处理器推入 Escape 栈
    if (enableEscape.value) {
      escapeStack.push(onDismiss)
    }
  }

  function teardown(): void {
    if (typeof document === 'undefined' || !isAttached)
      return

    isAttached = false
    document.removeEventListener('pointerdown', onClickOutside as EventListener, true)
    document.removeEventListener('keydown', onEscapeKey, true)

    // 从 Escape 栈中移除
    const index = escapeStack.indexOf(onDismiss)
    if (index !== -1) {
      escapeStack.splice(index, 1)
    }
  }

  watch(isEnabled, (enabled) => {
    if (enabled) {
      void setup()
    }
    else {
      teardown()
    }
  }, { immediate: true })

  onScopeDispose(teardown)
}
