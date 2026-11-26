import type { ISODateRange, WeekStartsOn } from '../composables/useDateRange.js'
import type { FieldPartStylingProps } from '../Field/fieldParts.js'
import type { FieldStatusInput, FieldStatusVariant } from '../Field/types.js'
import type { CalendarSystem } from '../utils/calendarSystem.js'

export type DateRange = ISODateRange

export interface DateRangePreset {
  label: string
  getRange: () => DateRange
}

export interface DateRangeInputProps extends FieldPartStylingProps {
  label: string
  modelValue?: DateRange | null
  id?: string
  description?: string
  placeholder?: string
  presets?: readonly DateRangePreset[]
  monthCount?: number
  /** 并排月份数。传了这项时优先于 monthCount。 */
  numberOfMonths?: 1 | 2
  min?: string
  max?: string
  /** 任一函数返回 false 时禁用这一天。 */
  dateConstraints?: ReadonlyArray<(date: Date) => boolean>
  minRangeSpan?: number
  maxRangeSpan?: number
  weekStartsOn?: WeekStartsOn
  /**
   * 按钮文字和弹出日历用的历法，例如 `persian`。值、`min`、`max` 和预设仍是公历 ISO 日期。
   * 不传时用最近 `InternationalizationProvider` 的历法，再没有就是公历。
   */
  calendar?: CalendarSystem
  hasClear?: boolean
  clearLabel?: string
  size?: 'sm' | 'md' | 'lg'
  isDisabled?: boolean
  /**
   * 为什么禁用。悬停或键盘聚焦会显示这段提示，并把提示关联到触发按钮。
   * 禁用和忙碌时按钮始终可聚焦（带 `aria-disabled`），但打不开日历也改不了值。
   */
  disabledMessage?: string
  isLoading?: boolean
  /** 值提交之后再跑。返回 Promise 时，字段保持加载直到它结束。 */
  changeAction?: (value: DateRange | null) => void | Promise<void>
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

export interface DateRangeInputEmits {
  'update:modelValue': [value: DateRange | null]
  'change': [value: DateRange | null]
}
