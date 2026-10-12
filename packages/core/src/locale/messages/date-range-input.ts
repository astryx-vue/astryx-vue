import type { AstryxLocale } from '../types.js'
import { clearLabel } from './shared.js'

export interface DateRangeInputMessages {
  placeholder: string
  dialogLabel: string
  clear: (label?: string) => string
}

export const dateRangeInputMessages: Record<AstryxLocale, DateRangeInputMessages> = {
  'en': {
    placeholder: 'Select a date range',
    dialogLabel: 'Choose date range',
    clear: label => clearLabel(label, 'Clear', 'Clear '),
  },
  'zh-CN': {
    placeholder: '选择日期区间',
    dialogLabel: '选择日期区间',
    clear: label => clearLabel(label, '清除', '清除'),
  },
}
