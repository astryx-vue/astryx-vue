import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { defineLayerScopedKey, readLayerScoped } from '../layer/scopedProvide.js'

export interface InputGroupContext {
  size: ComputedRef<'sm' | 'md' | 'lg'>
  disabled: ComputedRef<boolean>
  /** 组标签的 id。没有标签时为空。 */
  labelId: ComputedRef<string | undefined>
  /** 组的说明和状态文案 id，组内控件可以接进 aria-describedby。 */
  describedBy: ComputedRef<string | undefined>
}

export const INPUT_GROUP_KEY = defineLayerScopedKey<InputGroupContext | null>('InputGroup', null)

export function useInputGroupContext(): InputGroupContext | null {
  return readLayerScoped(INPUT_GROUP_KEY)
}

/**
 * 组内控件实际的禁用状态：自己禁用，或者所在的 InputGroup（含外层嵌套的组）禁用。
 * 组重新启用时，自己设了禁用的控件仍保持禁用。
 */
export function useInputGroupDisabled(ownDisabled: () => boolean | undefined): ComputedRef<boolean> {
  const group = useInputGroupContext()
  return computed(() => Boolean(ownDisabled()) || (group?.disabled.value ?? false))
}
