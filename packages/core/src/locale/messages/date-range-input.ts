import type { AstryxLocale } from '../types.js'
import { clearLabel } from './shared.js'

export interface DateRangeInputMessages {
  placeholder: string
  dialogLabel: string
  clear: (label?: string) => string
  /** 弹层侧边那一列快捷区间（例如「最近 7 天」）的无障碍名。 */
  presetDateRanges: string
}

export const dateRangeInputMessages: Record<AstryxLocale, DateRangeInputMessages> = {
  'en': {
    placeholder: 'Select date range',
    dialogLabel: 'Choose date range',
    clear: label => clearLabel(label, 'Clear', 'Clear '),
    presetDateRanges: 'Preset date ranges',
  },
  'zh-CN': {
    placeholder: '选择日期范围',
    dialogLabel: '选择日期范围',
    clear: label => clearLabel(label, '清除', '清除'),
    presetDateRanges: '快捷日期范围',
  },
}
