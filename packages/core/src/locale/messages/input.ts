import type { AstryxLocale } from '../types.js'

export interface InputMessages {
  statusError: string
  statusWarning: string
  statusSuccess: string
}

export const inputMessages: Record<AstryxLocale, InputMessages> = {
  'en': {
    statusError: 'Error details',
    statusWarning: 'Warning details',
    statusSuccess: 'Success details',
  },
  'zh-CN': {
    statusError: '错误详情',
    statusWarning: '警告详情',
    statusSuccess: '成功详情',
  },
}
