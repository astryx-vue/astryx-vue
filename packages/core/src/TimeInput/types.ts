import type { HourFormat, NativePicker, TimePresentation } from '../composables/useTimeValue.js'
import type { FieldPartStylingProps } from '../Field/fieldParts.js'
import type { FieldStatusInput, FieldStatusVariant } from '../Field/types.js'
import type { EntryErrorBehavior } from '../FormLayout/context.js'
import type { TimeInputEntryError } from './useTypedTime.js'

export type { TimeInputEntryError } from './useTypedTime.js'

export type TimeInputSize = 'sm' | 'md' | 'lg'

export interface TimeInputProps extends FieldPartStylingProps {
  label: string
  modelValue?: string | null
  id?: string
  description?: string
  placeholder?: string
  /** 时制。不传就跟随当前语言的时制（`en-US` 12 小时，`en-GB`、`de-DE`、`zh-CN` 24 小时）。 */
  hourFormat?: HourFormat
  hasSeconds?: boolean
  increment?: number
  min?: string
  max?: string
  presentation?: TimePresentation
  nativePicker?: NativePicker
  hasClear?: boolean
  clearLabel?: string
  size?: TimeInputSize
  isDisabled?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  isOptional?: boolean
  isLabelHidden?: boolean
  /** 旧名。和 `isLabelHidden` 任一为真就藏起标签。 */
  labelHidden?: boolean
  labelTooltip?: string
  /** 正在加载。字段不可改，并显示加载指示。 */
  isLoading?: boolean
  /** 加载指示的读屏文本。 */
  loadingLabel?: string
  /** 为什么禁用。和 `isDisabled` 一起用时，字段仍可聚焦（带 `aria-disabled`），但不能改值。 */
  disabledMessage?: string
  status?: FieldStatusInput
  statusVariant?: FieldStatusVariant | 'tooltip'
  width?: number | string
  /**
   * 打字被拒什么时候亮出来：`complete` 在时间打完整时就亮，`blur-or-enter` 等到 Enter 或失焦。
   * 不传时用最近 FormLayout 的 `defaultEntryErrorBehavior`，再没有就是 `complete`。
   */
  entryErrorBehavior?: EntryErrorBehavior
}

export interface TimeInputEmits {
  'update:modelValue': [value: string | null]
  'change': [value: string | null]
  /** 字段对打进来的文字的拒绝开始、改变或结束时触发，结束时参数是 `null`。 */
  'entryErrorChange': [error: TimeInputEntryError | null]
}
