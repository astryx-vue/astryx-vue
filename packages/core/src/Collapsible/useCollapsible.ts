import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import type { CollapsibleGroupContextValue } from './context.js'
import { computed, getCurrentInstance, shallowRef, toValue } from 'vue'
import { readLayerScoped } from '../layer/scopedProvide.js'
import { collapsibleGroupKey } from './context.js'

/**
 * 受控模式与默认值。传了这个对象，展开状态就不再是「自己管自己」，
 * 而是先读 `isOpen`，读不到才用 `defaultIsOpen`。
 */
export interface CollapsibleConfig {
  /**
   * 受控的展开状态，通常传 `v-model:isOpen` 的 model ref。
   * 留空表示不受控，状态由 hook 自己保存。
   */
  isOpen?: Ref<boolean | undefined>
  /**
   * 不受控时初始是否展开。
   * @default true
   */
  defaultIsOpen?: MaybeRefOrGetter<boolean>
  /**
   * 状态要变化时调用，参数是目标状态。
   * 受控时它是「请求」，不受控时它是「通知」。
   */
  onOpenChange?: (isOpen: boolean) => void
}

export interface UseCollapsibleOptions {
  /**
   * 是否启用折叠能力。
   * - `true`：自己管状态，初始展开。
   * - `false`：关闭折叠，`isOpen` 恒为 false，`toggle` 不做任何事。
   * - 传配置对象：做受控，或自定义默认值。
   * @default true
   */
  isCollapsible?: MaybeRefOrGetter<boolean | CollapsibleConfig | undefined>
  /**
   * 在 `CollapsibleGroup` 里的唯一标识。有明确值且位于组内时，展开状态由组统一管理。
   */
  value?: MaybeRefOrGetter<string | undefined>
  /**
   * 组上下文。一般不用传，默认从最近的 `CollapsibleGroup` 注入。
   */
  group?: CollapsibleGroupContextValue | null
}

export interface UseCollapsibleReturn {
  /** 折叠能力是否生效。`isCollapsible` 为 false 时是 false。 */
  isEnabled: ComputedRef<boolean>
  /** 内容当前是否展开。 */
  isOpen: ComputedRef<boolean>
  /** 切换展开状态：组内交给组，否则写受控 ref 或内部状态。 */
  toggle: () => void
}

function resolveConfig(value: boolean | CollapsibleConfig | undefined): CollapsibleConfig | null {
  if (value === false)
    return null
  if (value === true || value === undefined)
    return { defaultIsOpen: true }
  return value
}

/**
 * 对应原版 Astryx 的 `hooks/useCollapsible`：折叠面板的状态机。
 * 支持三种模式——组管理（在 `CollapsibleGroup` 里带 `value`）、受控（`isOpen`）、不受控。
 * `Collapsible` 组件内部也用它，所以自定义折叠 UI 和组件本身的行为一致。
 *
 * ```ts
 * const { isOpen, toggle } = useCollapsible({ isCollapsible: true })
 * ```
 */
export function useCollapsible(options: UseCollapsibleOptions = {}): UseCollapsibleReturn {
  const config = computed(() => resolveConfig(toValue(options.isCollapsible)))
  const isEnabled = computed(() => config.value != null)

  // 只有在组件 setup 里才读注入值，避免在普通函数里调用 inject() 报警告。
  const group = options.group !== undefined
    ? options.group
    : (getCurrentInstance() ? readLayerScoped(collapsibleGroupKey) : null)

  const initialIsOpen = toValue(config.value?.defaultIsOpen) ?? true
  const localIsOpen = shallowRef(initialIsOpen)

  function groupKey(): string | null {
    const key = toValue(options.value)
    return key != null && key !== '' ? key : null
  }

  const isOpen = computed(() => {
    if (!isEnabled.value)
      return false
    const key = groupKey()
    if (group != null && key != null)
      return group.isOpen(key)
    return config.value?.isOpen?.value ?? localIsOpen.value
  })

  function toggle(): void {
    if (!isEnabled.value)
      return

    const key = groupKey()
    if (group != null && key != null) {
      group.toggle(key)
      return
    }

    const next = !isOpen.value
    localIsOpen.value = next
    const controlled = config.value?.isOpen
    if (controlled != null)
      controlled.value = next
    config.value?.onOpenChange?.(next)
  }

  return { isEnabled, isOpen, toggle }
}
