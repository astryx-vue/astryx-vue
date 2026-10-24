import type { AstryxLocale } from '../types.js'

export interface CheckboxListMessages {
  loading: string
  /** 富文本标签给勾选框命名时，藏在里面的那个词。 */
  checkbox: string
}

export const checkboxListMessages: Record<AstryxLocale, CheckboxListMessages> = {
  'en': {
    loading: 'Loading',
    checkbox: 'Checkbox',
  },
  'zh-CN': {
    loading: '正在加载',
    checkbox: '复选框',
  },
}
