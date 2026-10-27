import type { AstryxLocale } from '../types.js'

export interface InputMessages {
  statusError: string
  statusWarning: string
  statusSuccess: string
  /** 清除按钮悬停和键盘聚焦时的提示，只说动作，不带字段名。 */
  tooltip: string
}

export const inputMessages: Record<AstryxLocale, InputMessages> = {
  'en': {
    statusError: 'Error details',
    statusWarning: 'Warning details',
    statusSuccess: 'Success details',
    tooltip: 'Clear',
  },
  'zh-CN': {
    statusError: '错误详情',
    statusWarning: '警告详情',
    statusSuccess: '成功详情',
    tooltip: '清除',
  },
}
