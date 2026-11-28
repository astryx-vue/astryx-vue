import type { ComputedRef } from 'vue'
import type { FieldStatusInput } from '../Field/types.js'
import type { InputGroupContext } from '../InputGroup/context.js'
import type { TokenizerProps } from './types.js'
import { computed } from 'vue'
import { useInputStatusIcon } from '../composables/useInputStatusIcon.js'

interface TokenizerFieldAriaOptions {
  props: Pick<TokenizerProps, 'status' | 'statusMessage' | 'statusVariant' | 'description'>
  attrs: Record<string, unknown>
  inputId: string
  fieldLabelId: string
  disabledId: string
  /** 禁用说明是否画在输入框旁边、需要被 aria-describedby 引用。 */
  hasDisabledDescription: ComputedRef<boolean>
  /** 所在的 InputGroup。在组里，标签、说明和状态由组统一负责。 */
  group?: InputGroupContext | null
}

/** 输入框的名字、说明和状态图标。 */
export function useTokenizerFieldAria(options: TokenizerFieldAriaOptions): {
  fieldStatus: ComputedRef<FieldStatusInput | undefined>
  labelledBy: ComputedRef<string | undefined>
  statusIcon: ReturnType<typeof useInputStatusIcon>['statusIcon']
  statusIconProps: ReturnType<typeof useInputStatusIcon>['statusIconProps']
  describedBy: ComputedRef<string | undefined>
} {
  const { props, attrs, inputId, fieldLabelId, disabledId, hasDisabledDescription, group = null } = options
  const fieldStatus = computed<FieldStatusInput | undefined>(() => {
    if (group != null || !props.statusMessage || props.status === 'default')
      return undefined
    return { type: props.status!, message: props.statusMessage }
  })
  /** 调用方的 aria-labelledby 接在字段自己的标签后面，不取代它；在组里，组标签排在最前。 */
  const labelledBy = computed(() => {
    const given = attrs['aria-labelledby']
    const external = typeof given === 'string' && given !== '' ? given : undefined
    if (group == null)
      return external ? `${fieldLabelId} ${external}` : undefined
    return [group.labelId.value, fieldLabelId, external].filter(Boolean).join(' ')
  })
  const { statusIcon, statusIconProps } = useInputStatusIcon({
    status: () => fieldStatus.value,
    statusVariant: () => props.statusVariant ?? 'attached',
  })
  const describedBy = computed(() => {
    // 外面给的 aria-describedby 和自己算出来的说明都要读，不能二选一。
    // 在组里，组的说明和状态替代本地的：本地的 id 在组里没有对应的元素。
    const external = typeof attrs['aria-describedby'] === 'string' ? attrs['aria-describedby'] : undefined
    const local = group != null
      ? [group.describedBy.value]
      : [props.description ? `${inputId}-description` : undefined, props.statusMessage ? `${inputId}-status` : undefined]
    return [external, ...local, hasDisabledDescription.value ? disabledId : undefined].filter(Boolean).join(' ') || undefined
  })
  return { fieldStatus, labelledBy, statusIcon, statusIconProps, describedBy }
}
