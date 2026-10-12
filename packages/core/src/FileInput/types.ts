import type { FieldStatusInput, FieldStatusVariant } from '../Field/types.js'

export type FileInputMode = 'input' | 'dropzone'
export type FileInputSize = 'sm' | 'md' | 'lg'
export type FileInputValue = File | File[] | null
export type FileInputStatus = FieldStatusInput

export interface FileInputProps {
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
  isLoading?: boolean
  status?: FileInputStatus
  statusVariant?: FieldStatusVariant | 'tooltip'
  width?: number | string
  clearLabel?: string
}

export interface FileInputEmits {
  'update:modelValue': [value: FileInputValue]
  'change': [value: FileInputValue]
}
