import type { Component, VNode } from 'vue'
import type { FieldPartStylingProps } from '../Field/fieldParts.js'
import type { TextEntryTraitProps } from '../Field/textEntryTraits.js'
import type { FieldLabelProps, FieldStatusInput, FieldStatusPlacement, FieldStatusType } from '../Field/types.js'
import type { IconName } from '../Icon/types.js'

export type TextAreaSize = 'sm' | 'md' | 'lg'
export type TextAreaStatus = FieldStatusInput
export type TextAreaStatusType = FieldStatusType
export type TextAreaChangeEvent = CustomEvent<{ value: string, originalEvent: Event }>
export type TextAreaChangeAction = (value: string, event: TextAreaChangeEvent) => void | Promise<void>
export type TextAreaWrap = 'soft' | 'hard'
export type TextAreaResize = 'none' | 'both' | 'horizontal' | 'vertical'

export interface TextAreaProps extends Omit<FieldLabelProps, 'inputId' | 'labelId' | 'descriptionId' | 'isGroupLabel'>, FieldPartStylingProps, TextEntryTraitProps {
  modelValue: string
  id?: string
  size?: TextAreaSize
  isReadOnly?: boolean
  disabledMessage?: string
  /** 文本框起始位置的图标：语义图标名（如 `'search'`），或一个图标组件。 */
  startIcon?: IconName | Component
  status?: TextAreaStatus
  statusVariant?: FieldStatusPlacement
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
  /** 同 `maxlength`，原版的写法（`max-length`）；两个都给时以它为准 */
  maxLength?: number | string
  /**
   * 原生 `maxlength` 属性：输入达到这么多个 UTF-16 码元后，浏览器不再接受输入（一个 emoji 可能占两个或更多）。
   * 独立于 `maxlength` / `maxLength` 那个按可见字符计数的软计数器：不显示也不改变计数器。
   * 组件自己不截断、不校验，更长的受控值保持原样。
   */
  htmlMaxLength?: number
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
