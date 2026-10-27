import type { Component, VNode } from 'vue'
import type { FieldPartStylingProps } from '../Field/fieldParts.js'
import type { FieldLabelProps, FieldStatusInput, FieldStatusType, FieldStatusVariant } from '../Field/types.js'

export type TextAreaSize = 'sm' | 'md' | 'lg'
export type TextAreaStatus = FieldStatusInput
export type TextAreaStatusType = FieldStatusType
export type TextAreaChangeEvent = CustomEvent<{ value: string, originalEvent: Event }>
export type TextAreaChangeAction = (value: string, event: TextAreaChangeEvent) => void | Promise<void>
export type TextAreaWrap = 'soft' | 'hard'
export type TextAreaResize = 'none' | 'both' | 'horizontal' | 'vertical'

export interface TextAreaProps extends Omit<FieldLabelProps, 'inputId' | 'labelId' | 'descriptionId' | 'isGroupLabel'>, FieldPartStylingProps {
  modelValue: string
  id?: string
  size?: TextAreaSize
  isReadOnly?: boolean
  disabledMessage?: string
  startIcon?: Component
  status?: TextAreaStatus
  statusVariant?: FieldStatusVariant | 'tooltip'
  changeAction?: TextAreaChangeAction
  isLoading?: boolean
  placeholder?: string
  width?: number | string
  rows?: number
  cols?: number
  /**
   * 原生的 `autocomplete` 属性，原样转给 textarea。
   */
  autoComplete?: string
  /**
   * 是否启用浏览器拼写检查。
   * @default true
   */
  hasSpellCheck?: boolean
  minlength?: number | string
  /**
   * 可见字符上限。计数按人眼看到的字符，一个 emoji 算一个。
   * 可以继续输入，超出后计数变红并播报，不会用原生 maxlength 截断。
   */
  maxlength?: number | string
  wrap?: TextAreaWrap
  resize?: TextAreaResize
  hasClear?: boolean
  hasAutoFocus?: boolean
  htmlName?: string
  form?: string
  clearLabel?: string
  loadingLabel?: string
}

export interface TextAreaEmits {
  change: [value: string, event: TextAreaChangeEvent]
  clear: [event: MouseEvent]
  enter: [event: KeyboardEvent]
  keydown: [event: KeyboardEvent]
  actionError: [error: unknown, value: string, event: TextAreaChangeEvent]
}

export interface TextAreaSlots {
  icon?: () => VNode[]
  end?: () => VNode[]
  labelIcon?: () => VNode[]
}
