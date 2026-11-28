import type { AstryxLocale } from '../types.js'
import { clearLabel } from './shared.js'

export interface DateInputMessages {
  placeholder: string
  dialogLabel: string
  openCalendar: string
  /** 日历弹层里那个关闭按钮的名字。 */
  closeCalendar: string
  /** 日历已经打开时，输入框旁边切换按钮的名字。 */
  toggleCalendarClose: string
  clear: (label?: string) => string
  /** Enter 或失焦留下的文字读不成日期（或是补不全的半截日期）时，字段下方显示并播报的错误。 */
  invalidDate: string
  /** 读得出来、但日历上没有的日子（例如 2 月 30 日）。 */
  nonexistentDate: string
  /**
   * 日期超出允许范围。`bounds` 是 `both`、`min`、`max` 表示超出了哪一头，
   * `other` 表示被自定义规则排除；`min`、`max` 是写好的边界日期。
   */
  outOfRangeDate: (bounds: 'both' | 'min' | 'max' | 'other', min: string, max: string) => string
  loading: string
  /** 触屏日期选择器顶部的「重置」：清掉已选日期，回到当前月。 */
  resetPicking: string
  /** 触屏日期选择器底部的「保存」：收起选择器。 */
  savePicking: string
  /** 月份和年份滚轮下面的「完成」：回到日历，不收起选择器。 */
  doneChoosingMonth: string
  /** 顶部月份按钮的名字，点了换成月份和年份滚轮。 */
  chooseMonthYear: (monthYear: string) => string
  monthWheel: string
  yearWheel: string
  /** 非公历日期字段聚焦且为空时的占位提示。`example` 是按那种历法数字写法写的示例日期。 */
  formatHint: (example: string) => string
  /** 字段的历法和应用的历法不同时，只给读屏的说明。`calendar` 是平台给的历法名，例如「波斯历」。 */
  calendarDescription: (calendar: string) => string
}

export const dateInputMessages: Record<AstryxLocale, DateInputMessages> = {
  'en': {
    placeholder: 'Select a date',
    dialogLabel: 'Choose date',
    openCalendar: 'Open calendar',
    closeCalendar: 'Close calendar',
    toggleCalendarClose: 'Close calendar',
    clear: label => clearLabel(label, 'Clear', 'Clear '),
    invalidDate: 'Invalid date',
    nonexistentDate: 'Enter a real date',
    outOfRangeDate: (bounds, min, max) => bounds === 'both'
      ? `Enter a date from ${min} to ${max}`
      : bounds === 'min'
        ? `Enter a date on or after ${min}`
        : bounds === 'max'
          ? `Enter a date on or before ${max}`
          : 'Enter an available date',
    loading: 'Loading',
    resetPicking: 'Reset',
    savePicking: 'Save',
    doneChoosingMonth: 'Done',
    chooseMonthYear: monthYear => `${monthYear}, Choose month and year`,
    monthWheel: 'Month',
    yearWheel: 'Year',
    formatHint: example => `e.g., ${example}`,
    calendarDescription: calendar => `Dates use the ${calendar}`,
  },
  'zh-CN': {
    placeholder: '选择日期',
    dialogLabel: '选择日期',
    openCalendar: '打开日历',
    closeCalendar: '关闭日历',
    toggleCalendarClose: '收起日历',
    clear: label => clearLabel(label, '清除', '清除'),
    invalidDate: '日期无效',
    nonexistentDate: '请输入一个真实存在的日期',
    outOfRangeDate: (bounds, min, max) => bounds === 'both'
      ? `请输入 ${min} 到 ${max} 之间的日期`
      : bounds === 'min'
        ? `请输入 ${min} 当天或之后的日期`
        : bounds === 'max'
          ? `请输入 ${max} 当天或之前的日期`
          : '请输入一个可选的日期',
    loading: '正在加载',
    resetPicking: '重置',
    savePicking: '保存',
    doneChoosingMonth: '完成',
    chooseMonthYear: monthYear => `${monthYear}，切换月份和年份`,
    monthWheel: '月份',
    yearWheel: '年份',
    formatHint: example => `例如 ${example}`,
    calendarDescription: calendar => `日期使用${calendar}`,
  },
}
