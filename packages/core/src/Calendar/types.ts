import type { CalendarDate } from '@internationalized/date'

export interface CalendarRangeValue {
  start: Date | null
  end: Date | null
}

export interface CalendarProps {
  /** 当前选中的日期。`mode="range"` 时改用 `range`。 */
  modelValue?: Date | null
  /** 选一天，或选一段起止日期。 */
  mode?: 'single' | 'range'
  /** 范围模式下的起止日期，用 `v-model:range` 绑定。 */
  range?: CalendarRangeValue | null
  /** 并排显示的月份数。 */
  numberOfMonths?: 1 | 2
  /** 打开时先显示这一天所在的月份。 */
  focusDate?: Date
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
  (event: 'update:range', value: CalendarRangeValue): void
  (event: 'change', value: Date | null): void
}

export interface CalendarSlots {
  /** 自定义日期单元格 */
  day?: (props: { date: CalendarDate, isSelected: boolean, isDisabled: boolean, isToday: boolean, isInMonth: boolean }) => any
  /** 自定义头部 */
  header?: () => any
}
