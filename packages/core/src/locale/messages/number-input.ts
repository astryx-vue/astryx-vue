import type { AstryxLocale } from '../types.js'
import { clearLabel } from './shared.js'

export interface NumberInputMessages {
  increment: (label?: string) => string
  decrement: (label?: string) => string
  /** 清除按钮的无障碍名，带上字段名。 */
  clear: (label?: string) => string
  /** 输入的不是合法数字时，读屏播报的提示。 */
  invalidNumber: string
}

export const numberInputMessages: Record<AstryxLocale, NumberInputMessages> = {
  'en': {
    increment: label => clearLabel(label, 'Increment', 'Increment '),
    decrement: label => clearLabel(label, 'Decrement', 'Decrement '),
    clear: label => clearLabel(label, 'Clear', 'Clear '),
    invalidNumber: 'Invalid number',
  },
  'zh-CN': {
    increment: label => clearLabel(label, '增加', '增加'),
    decrement: label => clearLabel(label, '减少', '减少'),
    clear: label => clearLabel(label, '清除', '清除'),
    invalidNumber: '数字无效',
  },
}
