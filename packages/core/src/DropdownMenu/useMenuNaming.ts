import type { ComputedRef } from 'vue'
import { computed, shallowRef } from 'vue'
import { readAccessibleName } from '../utils/accessibleName.js'

export interface UseMenuNamingOptions {
  /** 调用方放在菜单上的属性：`id`、`aria-label`、`aria-labelledby`。 */
  attrs: () => Record<string, unknown>
  hasCustomTrigger: () => boolean
  /** 内置触发按钮的 `label`。 */
  buttonLabel: () => unknown
  /** 都没有名字时用的默认名。 */
  fallback: () => string
  /** 自定义触发器的 id，菜单用它命名。 */
  triggerId: string
  /** 菜单面板没有调用方给的 id 时用的 id。 */
  menuId: string
  getTriggerControl: () => HTMLElement | null
}

/**
 * 菜单面板、对话框和底部弹层的名字与 id。
 *
 * 内置按钮开的菜单以按钮文字命名；自定义触发器开的菜单以调用方的 `aria-label`
 * 命名，没有就用触发器自己的可访问名称，不再一律叫「Menu」。
 */
export function useMenuNaming(options: UseMenuNamingOptions): {
  surfaceId: ComputedRef<string>
  menuLabel: ComputedRef<string | undefined>
  menuAriaLabel: ComputedRef<string | undefined>
  menuAriaLabelledBy: ComputedRef<string | undefined>
  sheetLabel: ComputedRef<string>
  /** 触发器的名字渲染出来才读得到：每次打开时读一次。 */
  captureTriggerName: () => void
} {
  const triggerName = shallowRef<string | undefined>()
  const buttonLabel = (): string | undefined => {
    const label = options.buttonLabel()
    return typeof label === 'string' ? label : undefined
  }

  function captureTriggerName(): void {
    triggerName.value = options.hasCustomTrigger() ? readAccessibleName(options.getTriggerControl()) : undefined
  }

  const surfaceId = computed(() => {
    const provided = options.attrs().id
    return typeof provided === 'string' && provided.length > 0 ? provided : options.menuId
  })

  const menuLabel = computed(() => {
    const explicit = options.attrs()['aria-label']
    if (typeof explicit === 'string' && explicit.length > 0)
      return explicit
    return buttonLabel()
  })

  const menuAriaLabel = computed(() => {
    const explicit = options.attrs()['aria-label']
    if (typeof explicit === 'string')
      return explicit
    return options.hasCustomTrigger() ? undefined : buttonLabel()
  })

  const menuAriaLabelledBy = computed(() => {
    const explicit = options.attrs()['aria-labelledby']
    if (typeof explicit === 'string')
      return explicit
    if (menuAriaLabel.value != null)
      return undefined
    return options.hasCustomTrigger() ? options.triggerId : undefined
  })

  const sheetLabel = computed(() => {
    if (options.hasCustomTrigger()) {
      const explicit = options.attrs()['aria-label']
      if (typeof explicit === 'string' && explicit.trim() !== '')
        return explicit
      return triggerName.value ?? options.fallback()
    }
    return buttonLabel() ?? options.fallback()
  })

  return { captureTriggerName, menuAriaLabel, menuAriaLabelledBy, menuLabel, sheetLabel, surfaceId }
}
