import type { AstryxLocale } from '../types.js'
import { clearLabel } from './shared.js'

export interface NumberInputMessages {
  increment: (label?: string) => string
  decrement: (label?: string) => string
}

export const numberInputMessages: Record<AstryxLocale, NumberInputMessages> = {
  'en': {
    increment: label => clearLabel(label, 'Increment', 'Increment '),
    decrement: label => clearLabel(label, 'Decrement', 'Decrement '),
  },
  'zh-CN': {
    increment: label => clearLabel(label, '增加', '增加'),
    decrement: label => clearLabel(label, '减少', '减少'),
  },
}
