import type { FieldPartStylingProps } from '../Field/fieldParts.js'
import type { FieldStatusInput, FieldStatusVariant } from '../Field/types.js'

export type FileInputMode = 'input' | 'dropzone'
export type FileInputSize = 'sm' | 'md' | 'lg'
export type FileInputValue = File | File[] | null
export type FileInputStatus = FieldStatusInput

export interface FileInputProps extends FieldPartStylingProps {
  label: string
  modelValue?: FileInputValue
  id?: string
  accept?: string
  description?: string
  placeholder?: string
  mode?: FileInputMode
  size?: FileInputSize
  isMultiple?: boolean
  maxSize?: number
  maxFiles?: number
  isDisabled?: boolean
  isRequired?: boolean
  isOptional?: boolean
  isLabelHidden?: boolean
  /** 标签末尾信息图标里的说明。 */
  labelTooltip?: string
  isLoading?: boolean
  /**
   * 为什么禁用。和 `isDisabled` 一起用时，悬停或键盘聚焦会显示这段提示，
   * 触发按钮仍可聚焦（带 `aria-disabled`），但打不开文件选择框。
   */
  disabledMessage?: string
  status?: FileInputStatus
  statusVariant?: FieldStatusVariant | 'tooltip'
  width?: number | string
  clearLabel?: string
  /**
   * 选中或清除之后调用。失败时组件发出 `actionError`，值保持这次提交的结果。
   */
  changeAction?: (files: FileInputValue) => void | Promise<void>
}

export interface FileInputEmits {
  'update:modelValue': [value: FileInputValue]
  'change': [value: FileInputValue]
  'actionError': [error: unknown, value: FileInputValue]
}
