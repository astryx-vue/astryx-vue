import type { DatePresentation } from '../composables/useDatePresentation.js'
import type { WeekStartsOn } from '../composables/useDateRange.js'
import type { NativePicker } from '../composables/useTimeValue.js'
import type { FieldStatusInput, FieldStatusType, FieldStatusVariant } from '../Field/types.js'

/**
 * Named display formats for a committed date. Same shapes as Timestamp:
 * `date` (Mar 21, 2026), `date_long` (March 21, 2026, the default),
 * `date_weekday` (Sat, Mar 21, 2026), and `system_date` (2026-03-21).
 * A function receives the ISO calendar date and returns the display string.
 */
export type DateInputFormatName = 'date' | 'date_long' | 'date_weekday' | 'system_date'
export type DateInputFormat = DateInputFormatName | ((iso: string) => string)

/**
 * Which surface opens for the calendar.
 *
 * `popover` is the desktop calendar. `bottom-sheet` always uses a bottom sheet.
 * `native` always uses the system date control. `adaptive-bottom-sheet` uses a
 * bottom sheet for a coarse pointer. `adaptive-native` uses the system control
 * for a coarse pointer and the popover otherwise. When neither this nor
 * `nativePicker` is set, the field follows `adaptive-native`.
 */
export type DateInputPresentation = DatePresentation

/**
 * Older name for the picker surface.
 * `touch` follows the pointer, `always` uses the system control, `never` keeps the calendar.
 * `presentation` wins when both are set.
 */
export type DateInputNativePicker = NativePicker

/** Legacy string status. Prefer `{ type, message }` so the message is visible. */
export type DateInputStatusType = 'default' | FieldStatusType
export type DateInputStatus = DateInputStatusType | FieldStatusInput

export interface DateInputProps {
  /** 输入框 id。不传时组件自己生成。 */
  id?: string
  /** 额外的无障碍描述，接在字段说明后面。 */
  describedBy?: string
  /** 当前选中的日期 */
  modelValue?: Date | null
  /** 占位符文本 */
  placeholder?: string
  /** 最小可选日期 */
  min?: Date
  /** 最大可选日期 */
  max?: Date
  /** 禁用的日期判断函数 */
  isDateDisabled?: (date: Date) => boolean
  /** 任一函数返回 false 时禁用这一天。 */
  dateConstraints?: ReadonlyArray<(date: Date) => boolean>
  /** 表单字段名 */
  name?: string
  /** 输入框标签。传入后会显示在字段上方。 */
  label?: string
  /** 标签下方的说明。 */
  description?: string
  /** 只把标签留给读屏，不显示出来。 */
  isLabelHidden?: boolean
  /** 在标签旁标成可选。 */
  isOptional?: boolean
  /** 把字段标成必填。 */
  isRequired?: boolean
  /** 标签末尾信息图标里的说明。 */
  labelTooltip?: string
  /** 是否禁用 */
  disabled?: boolean
  /**
   * 为什么禁用。和 disabled 一起用时，悬停或键盘聚焦会显示这段提示，
   * 输入框仍可聚焦（带 aria-disabled），但改不了值。
   */
  disabledMessage?: string
  /** 禁用原因。等同于 disabledMessage。 */
  disabledReason?: string
  /** 正在提交。字段不可改，并显示加载指示。 */
  isLoading?: boolean
  /**
   * 值已经提交之后再跑。返回 Promise 时，字段保持加载直到它结束。
   */
  changeAction?: (value: Date | null) => void | Promise<void>
  /** 有值时显示清除按钮。点完值清空，焦点回到输入框。默认 false。 */
  hasClear?: boolean
  /** 有值时显示清除按钮。等同于 hasClear。 */
  clearable?: boolean
  /** 清除按钮标签 */
  clearLabel?: string
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 校验状态。传 `{ type, message }` 时在字段下方显示说明。
   * 仍接受 `'error' | 'warning' | 'success'` 字符串，那种写法只有边框、没有说明。
   */
  status?: DateInputStatus
  /** 状态说明的位置。`attached` 紧贴字段。 */
  statusVariant?: FieldStatusVariant | 'tooltip'
  /**
   * 已提交日期的显示格式。默认 `date_long`。
   * 函数参数是 `YYYY-MM-DD`，只作用于已提交的值，不作用于正在输入的文本。
   */
  format?: DateInputFormat
  /** 日历的打开方式。不传时，鼠标用弹出层，触摸设备用系统日期控件。 */
  presentation?: DateInputPresentation
  /** 旧的打开方式。同时传了 `presentation` 时以 `presentation` 为准。 */
  nativePicker?: DateInputNativePicker
  /** 弹出日历并排的月份数。系统日期控件表达不了这项。 */
  numberOfMonths?: 1 | 2
  /** 弹出日历从哪一天开始一周。系统日期控件表达不了这项。 */
  weekStartsOn?: WeekStartsOn
  /** 整段字段的宽度。数字按像素算。 */
  width?: number | string
}

export interface DateInputEmits {
  (event: 'update:modelValue', value: Date | null): void
  (event: 'change', value: Date | null): void
}

export interface DateInputSlots {
  /** 自定义前缀图标 */
  prefix?: () => any
  /** 自定义后缀内容 */
  suffix?: () => any
}
