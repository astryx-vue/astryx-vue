import type { AstryxLocale } from '../types.js'
import { clearLabel } from './shared.js'

export interface DateInputMessages {
  placeholder: string
  dialogLabel: string
  openCalendar: string
  closeCalendar: string
  clear: (label?: string) => string
  invalidDate: string
  loading: string
}

export const dateInputMessages: Record<AstryxLocale, DateInputMessages> = {
  'en': {
    placeholder: 'Select a date',
    dialogLabel: 'Choose date',
    openCalendar: 'Open calendar',
    closeCalendar: 'Close calendar',
    clear: label => clearLabel(label, 'Clear', 'Clear '),
    invalidDate: 'That date is not available',
    loading: 'Loading',
  },
  'zh-CN': {
    placeholder: '选择日期',
    dialogLabel: '选择日期',
    openCalendar: '打开日历',
    closeCalendar: '关闭日历',
    clear: label => clearLabel(label, '清除', '清除'),
    invalidDate: '这个日期不可用',
    loading: '正在加载',
  },
}
