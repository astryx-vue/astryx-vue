import type { AstryxLocale } from '../types.js'

export interface FieldMessages {
  /** 字段标签后面的「可选」标记。 */
  optional: string
  /** 字段标签后面的「必填」标记。 */
  required: string
  /** 标签后面小「i」按钮的无障碍名称，例如「About Auto-save」。 */
  labelTooltip: (label: string) => string
  /** 错误状态没写说明时，读屏在标签之后读到的兜底说明。 */
  errorFallback: string
}

export const fieldMessages: Record<AstryxLocale, FieldMessages> = {
  'en': {
    optional: 'Optional',
    required: 'Required',
    labelTooltip: label => `About ${label}`,
    errorFallback: 'Invalid value',
  },
  'zh-CN': {
    optional: '可选',
    required: '必填',
    labelTooltip: label => `关于${label}`,
    errorFallback: '无效的值',
  },
}
