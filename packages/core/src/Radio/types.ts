import type { ComputedRef, InjectionKey, Ref, VNode } from 'vue'
import type { FieldPartStylingProps } from '../Field/fieldParts.js'
import type { FieldLabelProps, FieldStatusInput, FieldStatusType, FieldStatusVariant } from '../Field/types.js'

export type RadioValue = string | number
export type RadioSize = 'sm' | 'md'
export type RadioOrientation = 'horizontal' | 'vertical'
export type RadioStatus = FieldStatusInput
export type RadioStatusType = FieldStatusType
export type RadioChangeEvent = CustomEvent<{ value: RadioValue, originalEvent: Event }>

export interface RadioOption {
  value: RadioValue
  label: string
  description?: string
  isDisabled?: boolean
}

export interface RadioGroupProps extends Omit<FieldLabelProps, 'inputId' | 'labelId' | 'descriptionId' | 'isGroupLabel'>, FieldPartStylingProps {
  modelValue: RadioValue
  id?: string
  name?: string
  options?: RadioOption[]
  status?: RadioStatus
  statusVariant?: FieldStatusVariant | 'tooltip'
  width?: number | string
  isDisabled?: boolean
  isReadOnly?: boolean
  /**
   * 整组被禁用的原因。和 `isDisabled` 一起用时，悬停或键盘聚焦会显示这段提示，
   * 每个选项仍可聚焦（带 `aria-disabled`），但选不中。
   */
  disabledMessage?: string
  /** 只在单选列表里使用。sm 为 20px，md 为 24px。普通 Radio 不传，保持 18px。 */
  size?: RadioSize
  /** 选项排列方向。只在单选列表里默认垂直。 */
  orientation?: RadioOrientation
}

export interface RadioGroupEmits {
  'update:modelValue': [value: RadioValue]
  'change': [value: RadioValue, event: RadioChangeEvent]
}

export interface RadioListProps extends RadioGroupProps {}

export interface RadioGroupSlots {
  default?: () => VNode[]
  labelIcon?: () => VNode[]
}

export interface RadioProps {
  value: RadioValue
  label: string
  description?: string
  id?: string
  isDisabled?: boolean
  isReadOnly?: boolean
}

export interface RadioEmits {
  change: [value: RadioValue, event: CustomEvent]
}

export interface RadioSlots {
  labelIcon?: () => VNode[]
  /** 富文本标题。里面的链接可以单独点，不会选中这一项。 */
  label?: () => VNode[]
  /** 富文本说明。 */
  description?: () => VNode[]
  end?: () => VNode[]
}

export interface RadioContext {
  name: ComputedRef<string>
  selectedValue: Readonly<Ref<RadioValue>>
  select: (value: RadioValue, event: Event) => void
  isGroupDisabled: ComputedRef<boolean>
  isGroupReadOnly: ComputedRef<boolean>
  isRequired: ComputedRef<boolean>
  /** 整组禁用时对外解释用的文字，没传就没有。 */
  disabledMessage: ComputedRef<string | undefined>
  /** 上面那段文字对应的元素 id，给 `aria-describedby` 用。 */
  disabledMessageId: ComputedRef<string | undefined>
  size?: ComputedRef<RadioSize | undefined>
}

export const radioContextKey: InjectionKey<RadioContext> = Symbol('astryx-radio-context')
