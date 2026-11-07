import type { TokenLine } from '@astryx-vue/core'

export interface CodeEditorProps {
  /** 受控文本。 */
  value: string
  /** 高亮语言，默认 plaintext。 */
  language?: string
  /** 可编辑区域的无障碍名称。 */
  label: string
  hasLineNumbers?: boolean
  isReadOnly?: boolean
  placeholder?: string
  maxHeight?: number | string
  size?: 'sm' | 'md'
  tokenizer?: (code: string, language: string) => TokenLine[]
  /** 告诉读屏用户如何离开 Tab 缩进区域。 */
  escapeHint?: string
}

export interface CodeEditorEmits {
  change: [value: string]
}
