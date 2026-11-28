import type { AstryxLocale } from '../types.js'

export interface CodeBlockMessages {
  /** 复制成功后，复制按钮短暂换成的名字。 */
  copied: string
  /** 复制失败后，复制按钮短暂换成的名字、提示和播报。 */
  copyFailed: string
  /** 复制按钮平时的名字和提示。 */
  copyCode: string
  /** 认不出代码语言时，滚动区域的默认无障碍名。 */
  code: string
  /** 代码块以 diff 形式显示某种语言时的标题，例如 `tsx diff`。 */
  diffLabel: (language: string) => string
}

export const codeBlockMessages: Record<AstryxLocale, CodeBlockMessages> = {
  'en': {
    copied: 'Copied',
    copyFailed: 'Failed to copy value to clipboard.',
    copyCode: 'Copy code',
    code: 'Code',
    diffLabel: language => `${language} diff`,
  },
  'zh-CN': {
    copied: '已复制',
    copyFailed: '复制失败',
    copyCode: '复制代码',
    code: '代码',
    diffLabel: language => `${language} diff`,
  },
}
