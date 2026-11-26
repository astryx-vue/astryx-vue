import type { Component, VNode } from 'vue'
import type { FieldPartStylingProps } from '../Field/fieldParts.js'
import type { TextEntryTraitProps } from '../Field/textEntryTraits.js'
import type { FieldLabelProps, FieldStatusInput, FieldStatusPlacement, FieldStatusType } from '../Field/types.js'
import type { IconName } from '../Icon/types.js'

export type TextInputSize = 'sm' | 'md' | 'lg'
/**
 * 原生 input 类型。`email`、`tel`、`url`、`password` 除了本身的含义，还决定软键盘（邮箱、数字拨号、网址）和自动大写；
 * `search` 让字段成为搜索框，搭配 `enterKeyHint="search"` 得到搜索键。
 */
export type TextInputType = 'text' | 'password' | 'email' | 'search' | 'tel' | 'url'
export type TextInputStatus = FieldStatusInput
export type TextInputStatusType = FieldStatusType
export type TextInputChangeEvent = CustomEvent<{ value: string, originalEvent: Event }>
export type TextInputChangeAction = (value: string, event: TextInputChangeEvent) => void | Promise<void>

export interface TextInputProps extends Omit<FieldLabelProps, 'inputId' | 'labelId' | 'descriptionId' | 'isGroupLabel'>, FieldPartStylingProps, TextEntryTraitProps {
  modelValue: string
  id?: string
  type?: TextInputType
  size?: TextInputSize
  isReadOnly?: boolean
  disabledMessage?: string
  /** 输入框起始位置的图标：语义图标名（如 `'search'`），或一个图标组件。 */
  startIcon?: IconName | Component
  status?: TextInputStatus
  statusVariant?: FieldStatusPlacement
  changeAction?: TextInputChangeAction
  isLoading?: boolean
  placeholder?: string
  width?: number | string
  hasClear?: boolean
  hasAutoFocus?: boolean
  htmlName?: string
  autoComplete?: string
  /** 是否给拼错的词画下划线（原生 `spellcheck`）。不传时由浏览器决定。 */
  hasSpellCheck?: boolean
  clearLabel?: string
  loadingLabel?: string
}

export interface TextInputEmits {
  change: [value: string, event: TextInputChangeEvent]
  clear: [event: MouseEvent]
  enter: [event: KeyboardEvent]
  keydown: [event: KeyboardEvent]
  actionError: [error: unknown, value: string, event: TextInputChangeEvent]
}

export interface TextInputSlots {
  icon?: () => VNode[]
  end?: () => VNode[]
  labelIcon?: () => VNode[]
}
