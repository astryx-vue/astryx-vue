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
  /** 输入的日期解析不了或不在允许范围时，读屏播报的提示。 */
  invalidDate: string
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
    loading: 'Loading',
    resetPicking: 'Reset',
    savePicking: 'Save',
    doneChoosingMonth: 'Done',
    chooseMonthYear: monthYear => `${monthYear}, Choose month and year`,
    monthWheel: 'Month',
    yearWheel: 'Year',
  },
  'zh-CN': {
    placeholder: '选择日期',
    dialogLabel: '选择日期',
    openCalendar: '打开日历',
    closeCalendar: '关闭日历',
    toggleCalendarClose: '收起日历',
    clear: label => clearLabel(label, '清除', '清除'),
    invalidDate: '日期无效',
    loading: '正在加载',
    resetPicking: '重置',
    savePicking: '保存',
    doneChoosingMonth: '完成',
    chooseMonthYear: monthYear => `${monthYear}，切换月份和年份`,
    monthWheel: '月份',
    yearWheel: '年份',
  },
}
