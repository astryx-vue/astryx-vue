import type { Component, VNode } from 'vue'
import type { FieldPartStylingProps } from '../Field/fieldParts.js'
import type { FieldStatusInput, FieldStatusPlacement, FieldStatusType } from '../Field/types.js'
import type { EntryErrorBehavior } from '../FormLayout/context.js'
import type { IconName } from '../Icon/types.js'
import type { NumberInputEntryError } from './useTypedNumber.js'

export type { NumberInputEntryError } from './useTypedNumber.js'

/** 带说明的校验状态。仍接受单独的状态字符串。 */
export type NumberInputStatus = FieldStatusInput | 'default' | FieldStatusType

export interface NumberInputProps extends FieldPartStylingProps {
  /** 当前值 */
  modelValue?: number | null
  /** 输入框的 id。不传时自动生成。 */
  id?: string
  /** 占位文本 */
  placeholder?: string
  /** 最小值。小于它的输入在提交时按这个值处理。 */
  min?: number | null
  /** 最大值。大于它的输入在提交时按这个值处理。 */
  max?: number | null
  /** 步进值 */
  step?: number | null
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否禁用。等同于 isDisabled。 */
  disabled?: boolean
  /** 禁用原因。与 isDisabled 一起用时，悬停或键盘聚焦会显示提示，字段变成只读但仍可聚焦。 */
  disabledMessage?: string
  /** 禁用原因。等同于 disabledMessage。 */
  disabledReason?: string
  /** 是否只读：值照常显示和提交，但不能编辑，也不响应步进 */
  isReadOnly?: boolean
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 标签 */
  label?: string
  /** 标签下方的说明 */
  description?: string
  /** 只把标签留给读屏 */
  isLabelHidden?: boolean
  /** 字段是否可选 */
  isOptional?: boolean
  /** 字段是否必填。与 isOptional 互斥。 */
  isRequired?: boolean
  /** 标签末尾信息图标里的提示文本 */
  labelTooltip?: string
  /** 标签文字前的图标组件 */
  labelIcon?: Component
  /** 输入框起始位置的图标：语义图标名（如 `'search'`），或一个图标组件 */
  startIcon?: IconName | Component
  /** 单位，显示在输入框末尾，例如 % */
  units?: string | null
  /** 有值时显示清除按钮 */
  hasClear?: boolean
  /** 有值时显示清除按钮。等同于 hasClear。 */
  clearable?: boolean
  /** 在输入框末尾显示加、减按钮 */
  hasNumberSteppers?: boolean
  /** 挂载后自动聚焦输入框 */
  hasAutoFocus?: boolean
  /** 只接受整数 */
  isIntegerOnly?: boolean
  /** 输入框聚焦时，滚轮是否改变值 */
  isWheelEnabled?: boolean
  /** 未聚焦时用于显示已提交的值。聚焦后显示原始数字，便于编辑 */
  formatValue?: (value: number) => string
  /** 原生 autocomplete 属性 */
  autoComplete?: string
  /** 整个字段（标签、输入框、状态）的宽度。数字按像素算，字符串原样使用 */
  width?: number | string
  /** 表单提交用的字段名 */
  htmlName?: string
  /** 表单提交用的字段名。等同于 htmlName。 */
  name?: string
  /** 校验状态。对象形式会在字段下方显示说明。 */
  status?: NumberInputStatus
  /** 状态说明的呈现方式 */
  statusVariant?: FieldStatusPlacement
  /**
   * 被拒的输入什么时候亮出来。一个数只有 Enter 或失焦才算打完，所以 `'complete'` 和 `'blur-or-enter'`
   * 对数字框的时机相同：打字时什么都不亮，Enter 或失焦时才亮。这个属性不会写到 input 上，
   * 数字框也不读 FormLayout 的默认值；有它是为了让一个表单能把同一个值传给里面所有的日期、时间和数字字段。
   */
  entryErrorBehavior?: EntryErrorBehavior
}

export interface NumberInputEmits {
  'update:modelValue': [value: number | null]
  'change': [value: number | null]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'enter': [event: KeyboardEvent]
  'keydown': [event: KeyboardEvent]
  /** 字段对打进来的文字的拒绝变了：开始、改变、结束（`null`）。卸载时若还有拒绝，也会带 `null` 报一次。 */
  'entryErrorChange': [error: NumberInputEntryError | null]
}

export interface NumberInputSlots {
  /** 输入框起始位置的图标 */
  icon?: () => VNode[]
  /** 标签文字前的图标 */
  labelIcon?: () => VNode[]
}
