import type { CalendarDate } from '@internationalized/date'

export interface CalendarProps {
  /** 当前选中的日期 */
  modelValue?: Date | null
  /** 最小可选日期 */
  min?: Date
  /** 最大可选日期 */
  max?: Date
  /** 禁用的日期判断函数 */
  isDateDisabled?: (date: Date) => boolean
  /** 日历标签 */
  label?: string
  /** 是否禁用 */
  disabled?: boolean
}

export interface CalendarEmits {
  (event: 'update:modelValue', value: Date | null): void
  (event: 'change', value: Date | null): void
}

export interface CalendarSlots {
  /** 自定义日期单元格 */
  day?: (props: { date: CalendarDate, isSelected: boolean, isDisabled: boolean, isToday: boolean, isInMonth: boolean }) => any
  /** 自定义头部 */
  header?: () => any
}
