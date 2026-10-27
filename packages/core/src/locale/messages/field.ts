import type { AstryxLocale } from '../types.js'

export interface FieldMessages {
  /** 字段标签后面的「可选」标记。 */
  optional: string
  /** 字段标签后面的「必填」标记。 */
  required: string
}

export const fieldMessages: Record<AstryxLocale, FieldMessages> = {
  'en': {
    optional: 'Optional',
    required: 'Required',
  },
  'zh-CN': {
    optional: '可选',
    required: '必填',
  },
}
