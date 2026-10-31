import { HIGHLIGHTED_TOKEN_TYPES } from '@astryx-vue/core'

/** 主题给每个代码块加的类名（`theme.ts`）；颜色规则靠它找到编辑器里的代码块。 */
export const CODE_SYNTAX_CLASS = 'astryx-richtext-code'

let injected = false

/**
 * 注入一次代码块的颜色规则：每种 token 取和 core 的 CodeBlock 同一个语法色变量
 * （`--astryx-code-syntax-*`），所以换语法主题时编辑器和 CodeBlock 一起变。
 */
export function ensureSyntaxRules(): void {
  if (injected || typeof document === 'undefined')
    return
  injected = true
  const style = document.createElement('style')
  style.setAttribute('data-astryx-richtext-code-syntax', '')
  style.textContent = HIGHLIGHTED_TOKEN_TYPES
    .map(type => `.${CODE_SYNTAX_CLASS}::highlight(astryx-${type}) { color: var(--astryx-code-syntax-${type}, currentColor); }`)
    .join('\n')
  document.head.append(style)
}

/** 浏览器有没有 CSS Custom Highlight API。 */
export function supportsHighlights(): boolean {
  return typeof CSS !== 'undefined' && 'highlights' in CSS && typeof Highlight !== 'undefined'
}
