import type { AstryxLocale } from '../types.js'

export interface TabListMessages {
  label: string
}

export const tabListMessages: Record<AstryxLocale, TabListMessages> = {
  'en': { label: 'Tabs' },
  'zh-CN': { label: '标签页' },
}
