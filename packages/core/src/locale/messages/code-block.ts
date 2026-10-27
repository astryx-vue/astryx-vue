import type { AstryxLocale } from '../types.js'

export interface CodeBlockMessages {
  /** 复制成功后，复制按钮短暂换成的名字。 */
  copied: string
  /** 复制按钮平时的名字和提示。 */
  copyCode: string
  /** 认不出代码语言时，滚动区域的默认无障碍名。 */
  code: string
}

export const codeBlockMessages: Record<AstryxLocale, CodeBlockMessages> = {
  'en': {
    copied: 'Copied',
    copyCode: 'Copy code',
    code: 'Code',
  },
  'zh-CN': {
    copied: '已复制',
    copyCode: '复制代码',
    code: '代码',
  },
}
