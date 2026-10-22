import type { WeekStartsOn } from '../composables/useDateRange.js'
import type { HourFormat, NativePicker, TimePresentation } from '../composables/useTimeValue.js'
import type { FieldPartStylingProps } from '../Field/fieldParts.js'
import type { FieldStatusInput, FieldStatusVariant } from '../Field/types.js'

export type DateTimeInputSize = 'sm' | 'md' | 'lg'

export interface DateTimeInputProps extends FieldPartStylingProps {
  label: string
  modelValue?: string | null
  id?: string
  description?: string
  placeholder?: string
  hourFormat?: HourFormat
  presentation?: TimePresentation
  nativePicker?: NativePicker
  hasClear?: boolean
  clearLabel?: string
  size?: DateTimeInputSize
  /** 时间那段带秒。系统时间控件表达不了，所以会固定用 Astryx 的时间字段。 */
  hasSeconds?: boolean
  /** 方向键调整分钟的步长，默认 1 分钟。 */
  timeIncrement?: 1 | 5 | 10 | 15 | 30
  /** 时间那段的预设列表的分钟间隔。传了就会在时钟图标下弹出可选时间。 */
  timeOptionInterval?: 5 | 10 | 15 | 30 | 60
  /** 时间那段的读屏标签。默认用当前语言的「时间」。 */
  timeLabel?: string
  /** 时间那段的占位符。 */
  timePlaceholder?: string
  /** 为什么禁用。和 `isDisabled` 一起用时，两段都仍可聚焦（带 `aria-disabled`），但不能改值。 */
  disabledMessage?: string
  min?: string
  max?: string
  /** 任一函数返回 false 时，日期那一半禁用这一天。 */
  dateConstraints?: ReadonlyArray<(date: Date) => boolean>
  numberOfMonths?: 1 | 2
  weekStartsOn?: WeekStartsOn
  isDisabled?: boolean
  isLoading?: boolean
  /** 日期和时间都齐了之后再跑。返回 Promise 时，字段保持加载直到它结束。 */
  changeAction?: (value: string | null) => void | Promise<void>
  isReadOnly?: boolean
  isRequired?: boolean
  isOptional?: boolean
  isLabelHidden?: boolean
  /** 旧名。和 `isLabelHidden` 任一为真就藏起标签。 */
  labelHidden?: boolean
  labelTooltip?: string
  status?: FieldStatusInput
  statusVariant?: FieldStatusVariant | 'tooltip'
  width?: number | string
}

export interface DateTimeInputEmits {
  'update:modelValue': [value: string | null]
  'change': [value: string | null]
}
