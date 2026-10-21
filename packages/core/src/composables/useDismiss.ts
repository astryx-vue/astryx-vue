import type { MaybeRefOrGetter, Ref } from 'vue'
import type { DismissEscape } from '../layer/dismissStack.js'
import { onScopeDispose, toValue, watch } from 'vue'
import { pushLayer } from '../layer/dismissStack.js'

export interface UseDismissOptions {
  /** 要监听点击外部的容器元素 */
  container: Ref<HTMLElement | null>
  /** 触发器元素（点击它不算点击外部） */
  trigger?: Ref<HTMLElement | null>
  /** 是否启用关闭 */
  isEnabled: Ref<boolean>
  /**
   * Escape 到达这一层时怎么处理。
   * `'close'` 关掉，`'block'` 吃掉按键但不关，`'ignore'` 留给自己会
   * `preventDefault` 的输入组件。默认 `'close'`。
   */
  dismissOnEscape?: MaybeRefOrGetter<DismissEscape>
  /** 关闭回调 */
  onDismiss: () => void
  /**
   * Escape 单独处理。不传时和点击外部走同一个回调。
   * 菜单钻进子层时，Escape 先退一层，点击外部仍整层关闭。
   */
  onEscape?: () => void
}

/**
 * 统一处理浮层组件的关闭逻辑：点击外部和按 Escape 键。
 * 用于 Popover、Tooltip、DropdownMenu、ContextMenu 等。
 *
 * 真正的判定在 `layer/dismissStack.ts` 里：全页面共用一个关闭栈，
 * 一次点外面只关最上面那一层，Escape 也只打最上面那一层。这里只负责在
 * `isEnabled` 变真时把这一层登记进去，变假或作用域销毁时摘出来。
 *
 * 因为所有浮层都走这个入口，用它的组件自动获得了「只关最上面一层」的行为，
 * 组件自己不用改。
 */
export function useDismiss(options: UseDismissOptions): void {
  const { container, trigger, isEnabled, onDismiss } = options
  // 身份跟着这一次 composable 调用走，重新登记时排位不变。
  const token = {}

  let unregister: (() => void) | null = null

  function register(): void {
    unregister = pushLayer({
      token,
      getContainer: () => container.value,
      getTrigger: () => trigger?.value ?? null,
      dismissOnPointerOutside: true,
      dismissOnEscape: escapeMode(),
      onEscape: options.onEscape,
      onDismiss,
    })
  }

  function escapeMode(): DismissEscape {
    return toValue(options.dismissOnEscape) ?? 'close'
  }

  function teardown(): void {
    unregister?.()
    unregister = null
  }

  function sync(enabled: boolean): void {
    if (enabled) {
      // 已经登记过就先摘掉，避免选项变化时留下重复的登记。
      teardown()
      register()
    }
    else {
      teardown()
    }
  }

  watch([isEnabled, () => escapeMode()], ([enabled]) => sync(enabled), { immediate: true })

  onScopeDispose(teardown)
}
