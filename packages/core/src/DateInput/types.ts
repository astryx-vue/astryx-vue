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
 * `adaptive-bottom-sheet` uses a bottom sheet for a coarse pointer and the
 * popover otherwise, matching the original `(pointer: coarse)` check.
 */
export type DateInputPresentation = 'popover' | 'bottom-sheet' | 'adaptive-bottom-sheet'

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
  /** 表单字段名 */
  name?: string
  /** 输入框标签。传入后会显示在字段上方。 */
  label?: string
  /** 标签下方的说明。 */
  description?: string
  /** 只把标签留给读屏，不显示出来。 */
  isLabelHidden?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 禁用原因 */
  disabledReason?: string
  /** 是否可清除 */
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
  /** 日历的打开方式。默认 `popover`。 */
  presentation?: DateInputPresentation
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
