import type { AstryxLocale } from '../types.js'
import { clearLabel } from './shared.js'

export interface TimeInputMessages {
  placeholder: string
  formatHint12: string
  formatHint24: string
  outOfRange: string
  loading: string
  clear: (label?: string) => string
  /** 输入的时间解析不了时，读屏播报的提示。 */
  invalidTime: string
  /** 打开系统时间选择器的时钟按钮的名字。 */
  openPicker: (label: string) => string
}

export const timeInputMessages: Record<AstryxLocale, TimeInputMessages> = {
  'en': {
    placeholder: 'Select a time',
    formatHint12: 'e.g., 2:30 PM',
    formatHint24: 'e.g., 14:30',
    outOfRange: 'Time is outside the allowed range',
    loading: 'Loading',
    clear: label => clearLabel(label, 'Clear', 'Clear '),
    invalidTime: 'Invalid time',
    openPicker: label => `Open ${label}`,
  },
  'zh-CN': {
    placeholder: '选择时间',
    formatHint12: '例如 2:30 PM',
    formatHint24: '例如 14:30',
    outOfRange: '时间不在允许的范围内',
    loading: '加载中',
    clear: label => clearLabel(label, '清除', '清除'),
    invalidTime: '时间无效',
    openPicker: label => `打开${label}`,
  },
}
