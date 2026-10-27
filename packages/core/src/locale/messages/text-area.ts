import type { AstryxLocale } from '../types.js'
import { englishPlural, formatCount } from './shared.js'

export interface TextAreaMessages {
  /** 快到字数上限时播报还能输入多少个字符。 */
  charactersRemaining: (count: number) => string
  /** 超过字数上限时播报超出了多少个字符。 */
  charactersOverLimit: (count: number) => string
}

export const textAreaMessages: Record<AstryxLocale, TextAreaMessages> = {
  'en': {
    charactersRemaining: count => `${formatCount(count, 'en')} ${englishPlural(count, 'character', 'characters')} remaining`,
    charactersOverLimit: count => `${formatCount(count, 'en')} ${englishPlural(count, 'character', 'characters')} over the limit`,
  },
  'zh-CN': {
    charactersRemaining: count => `还可以输入 ${formatCount(count, 'zh-CN')} 个字符`,
    charactersOverLimit: count => `已超出 ${formatCount(count, 'zh-CN')} 个字符`,
  },
}
