import type { CalendarDate } from '@internationalized/date'
import type { Ref } from 'vue'
import type { WeekStartsOn } from '../composables/useDateRange.js'

export interface CalendarRangeValue {
  start: Date | null
  end: Date | null
}

export interface CalendarHandle {
  /** 把可见月份移到这一天，并把键盘焦点放到这一天。 */
  navigateTo: (date: Date) => void
}

export type CalendarHandleRef = Ref<CalendarHandle | null> | ((handle: CalendarHandle | null) => void)

export interface CalendarProps {
  /** 当前选中的日期。`mode="range"` 时改用 `range`。 */
  modelValue?: Date | null
  /** 选一天，或选一段起止日期。 */
  mode?: 'single' | 'range'
  /** 范围模式下的起止日期，用 `v-model:range` 绑定。 */
  range?: CalendarRangeValue | null
  /** 并排显示的月份数。 */
  numberOfMonths?: 1 | 2
  /**
   * 先显示这一天所在的月份。
   * 配合 `v-model:focus-date` 时，翻月会把新月份交还给外面。
   */
  focusDate?: Date
  /** 最小可选日期 */
  min?: Date
  /** 最大可选日期 */
  max?: Date
  /** 返回 true 时禁用这一天。和 `dateConstraints` 一起生效。 */
  isDateDisabled?: (date: Date) => boolean
  /** 任一函数返回 false 时禁用这一天。 */
  dateConstraints?: ReadonlyArray<(date: Date) => boolean>
  /**
   * 范围最短天数，含两端。2 表示不能只选同一天。
   * 起点已经选中后，比这个更近的日期不可选；再点一次起点会取消这次选择。
   */
  minRangeSpan?: number
  /**
   * 范围最长天数，含两端。7 表示从起点起最多七天。
   * 起点还没选中时，这个限制不生效。
   */
  maxRangeSpan?: number
  /** 显示相邻月份的日期。这些日期只用来补齐格子，不能选。 */
  hasOutsideDays?: boolean
  /** 在每一行左侧显示 ISO 周数。 */
  hasWeekNumbers?: boolean
  /** 按当月收缩行数。关闭时固定六行，高度不变。 */
  hasVariableRowCount?: boolean
  /** 一周的第一天。0 是周日，也可以写 sun、mon 这样的缩写。 */
  weekStartsOn?: WeekStartsOn
  /** 命令式翻月。`navigateTo` 会显示那一天所在的月份并聚焦它。 */
  handleRef?: CalendarHandleRef
  /** 日历标签 */
  label?: string
  /** 是否禁用 */
  disabled?: boolean
}

export interface CalendarEmits {
  (event: 'update:modelValue', value: Date | null): void
  (event: 'update:range', value: CalendarRangeValue): void
  (event: 'update:focusDate', value: Date): void
  (event: 'change', value: Date | null): void
}

export interface CalendarSlots {
  /** 自定义日期单元格 */
  day?: (props: { date: CalendarDate, isSelected: boolean, isDisabled: boolean, isToday: boolean, isInMonth: boolean }) => any
  /** 自定义头部 */
  header?: () => any
}
