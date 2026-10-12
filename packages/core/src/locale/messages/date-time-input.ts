import type { AstryxLocale } from '../types.js'
import { clearLabel } from './shared.js'

export interface DateTimeInputMessages {
  dateLabel: string
  timeLabel: string
  clear: (label?: string) => string
}

export const dateTimeInputMessages: Record<AstryxLocale, DateTimeInputMessages> = {
  'en': {
    dateLabel: 'Date',
    timeLabel: 'Time',
    clear: label => clearLabel(label, 'Clear', 'Clear '),
  },
  'zh-CN': {
    dateLabel: '日期',
    timeLabel: '时间',
    clear: label => clearLabel(label, '清除', '清除'),
  },
}
