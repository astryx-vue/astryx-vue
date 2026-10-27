import type { AstryxLocale } from '../types.js'
import { clearLabel } from './shared.js'

export interface TextInputMessages {
  /** 清除按钮的无障碍名，带上字段名，例如「清除邮箱」。 */
  clear: (label?: string) => string
}

export const textInputMessages: Record<AstryxLocale, TextInputMessages> = {
  'en': {
    clear: label => clearLabel(label, 'Clear', 'Clear '),
  },
  'zh-CN': {
    clear: label => clearLabel(label, '清除', '清除'),
  },
}
