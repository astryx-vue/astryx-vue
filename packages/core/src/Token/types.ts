export const TOKEN_COLORS = ['default', 'red', 'orange', 'yellow', 'green', 'teal', 'cyan', 'blue', 'purple', 'pink', 'gray'] as const

export type TokenColor = (typeof TOKEN_COLORS)[number]
export type TokenSize = 'sm' | 'md' | 'lg'

export interface TokenProps {
  /** 标签文字。 */
  label: string
  size?: TokenSize
  color?: TokenColor
  disabled?: boolean
  /**
   * 显示可聚焦的删除按钮。点击、Backspace、Delete 都会发出 remove。
   * 对话输入区复用时打开它，再监听 remove。
   */
  removable?: boolean
  /** 有值时渲染成链接。和删除按钮同时存在时，链接和按钮是兄弟节点。 */
  href?: string
  /** 补充说明，读屏可读。 */
  description?: string
  /** 视觉上隐藏文字，仍然作为无障碍名称。 */
  isLabelHidden?: boolean
  /** `isLabelHidden` 的旧名。两者任一为真就隐藏。 */
  labelHidden?: boolean
}

export interface TokenEmits {
  /** 点击删除按钮，或在标签上按 Backspace / Delete。 */
  remove: [event: Event]
}

export interface TokenSlots {
  /** 文字前面的图标。对话输入区可以放类型图标。 */
  icon?: () => unknown
  /** 文字后面、删除按钮前面的内容。 */
  end?: () => unknown
  /** 和 `end` 是同一个插槽，用原版的属性名。 */
  endContent?: () => unknown
}
