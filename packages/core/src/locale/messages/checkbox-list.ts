import type { AstryxLocale } from '../types.js'

export interface CheckboxListMessages {
  loading: string
}

export const checkboxListMessages: Record<AstryxLocale, CheckboxListMessages> = {
  'en': {
    loading: 'Loading',
  },
  'zh-CN': {
    loading: '正在加载',
  },
}
