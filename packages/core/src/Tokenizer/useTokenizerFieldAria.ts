import type { ComputedRef } from 'vue'
import type { FieldStatusInput } from '../Field/types.js'
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
}

/** 输入框的名字、说明和状态图标。 */
export function useTokenizerFieldAria(options: TokenizerFieldAriaOptions): {
  fieldStatus: ComputedRef<FieldStatusInput | undefined>
  labelledBy: ComputedRef<string | undefined>
  statusIcon: ReturnType<typeof useInputStatusIcon>['statusIcon']
  statusIconProps: ReturnType<typeof useInputStatusIcon>['statusIconProps']
  describedBy: ComputedRef<string | undefined>
} {
  const { props, attrs, inputId, fieldLabelId, disabledId, hasDisabledDescription } = options
  const fieldStatus = computed<FieldStatusInput | undefined>(() => {
    if (!props.statusMessage || props.status === 'default')
      return undefined
    return { type: props.status!, message: props.statusMessage }
  })
  /** 调用方的 aria-labelledby 接在字段自己的标签后面，不取代它。 */
  const labelledBy = computed(() => {
    const external = attrs['aria-labelledby']
    return typeof external === 'string' && external !== '' ? `${fieldLabelId} ${external}` : undefined
  })
  const { statusIcon, statusIconProps } = useInputStatusIcon({
    status: () => fieldStatus.value,
    statusVariant: () => props.statusVariant ?? 'attached',
  })
  const describedBy = computed(() => {
    // 外面给的 aria-describedby 和自己算出来的说明都要读，不能二选一。
    const external = typeof attrs['aria-describedby'] === 'string' ? attrs['aria-describedby'] : undefined
    return [external, props.description ? `${inputId}-description` : undefined, props.statusMessage ? `${inputId}-status` : undefined, hasDisabledDescription.value ? disabledId : undefined].filter(Boolean).join(' ') || undefined
  })
  return { fieldStatus, labelledBy, statusIcon, statusIconProps, describedBy }
}
