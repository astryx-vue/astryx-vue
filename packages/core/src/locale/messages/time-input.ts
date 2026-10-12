import type { AstryxLocale } from '../types.js'
import { clearLabel } from './shared.js'

export interface TimeInputMessages {
  placeholder: string
  formatHint12: string
  formatHint24: string
  outOfRange: string
  clear: (label?: string) => string
}

export const timeInputMessages: Record<AstryxLocale, TimeInputMessages> = {
  'en': {
    placeholder: 'Select a time',
    formatHint12: 'e.g., 2:30 PM',
    formatHint24: 'e.g., 14:30',
    outOfRange: 'Time is outside the allowed range',
    clear: label => clearLabel(label, 'Clear', 'Clear '),
  },
  'zh-CN': {
    placeholder: '选择时间',
    formatHint12: '例如 2:30 PM',
    formatHint24: '例如 14:30',
    outOfRange: '时间不在允许的范围内',
    clear: label => clearLabel(label, '清除', '清除'),
  },
}
