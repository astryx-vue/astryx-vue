import type { VNode } from 'vue'
import type { CheckboxValue } from '../CheckboxInput/types.js'
import type { FieldPartStylingProps } from '../Field/fieldParts.js'
import type { FieldStatusInput, FieldStatusVariant } from '../Field/types.js'
import type { ListDensity } from '../List/types.js'

export interface CheckboxListProps extends FieldPartStylingProps {
  label: string
  modelValue?: string[]
  id?: string
  description?: string
  density?: ListDensity
  hasDividers?: boolean
  isDisabled?: boolean
  /**
   * 整组被禁用的原因。和 isDisabled 一起用时，每一行仍可聚焦，悬停或键盘聚焦能看到原因。
   * 单独禁用某一行时不用这句。
   */
  disabledMessage?: string
  /** 整组被禁用的原因。等同于 disabledMessage。 */
  disabledReason?: string
  /**
   * 整组只读。勾选状态还在，也不会变暗，但不能改。
   * 和 isDisabled 同时设置时按禁用处理。
   */
  isReadOnly?: boolean
  /**
   * 勾选变化之后执行。进行中的那一行会显示加载，并且不能再点。
   */
  changeAction?: (values: string[]) => void | Promise<void>
  isRequired?: boolean
  isOptional?: boolean
  isLabelHidden?: boolean
  status?: FieldStatusInput
  statusVariant?: FieldStatusVariant | 'tooltip'
  width?: number | string
}

export interface CheckboxListEmits {
  'update:modelValue': [value: string[]]
  'change': [value: string[]]
}

export interface CheckboxListItemProps {
  label: string
  value?: string
  description?: string
  /**
   * 覆盖复选框的无障碍名称。富文本标题没有可读文字时用它。
   * 写了它，名字就不再从可见标题里取。
   */
  ariaLabel?: string
  isDisabled?: boolean
  /** 这一行自己的加载。复选框里显示旋转指示，并且不能切换。 */
  isLoading?: boolean
  isChecked?: CheckboxValue
}

export interface CheckboxListItemEmits {
  check: [checked: boolean]
}

export interface CheckboxListItemSlots {
  /** 富文本标题。里面的链接可以单独点，不会切换这一行。 */
  label?: () => VNode[]
  /** 富文本说明。复选框通过 aria-describedby 读到它。 */
  description?: () => VNode[]
  end?: () => VNode[]
}
