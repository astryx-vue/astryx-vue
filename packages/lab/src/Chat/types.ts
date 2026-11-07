export interface ChatEmojiOption {
  /** 表情字符，例如 "🎉"。 */
  emoji: string
  /** 短名，用来过滤，也用来生成按钮的无障碍名，例如 "tada"。 */
  name: string
}

export interface ChatEmojiPickerProps {
  /**
   * 网格里的表情，每行 8 个。
   * @default DEFAULT_CHAT_EMOJIS
   */
  emojis?: readonly ChatEmojiOption[]
  /**
   * 弹出层对话框的无障碍名。
   * 不传时用内置的 “Pick an emoji”。
   */
  label?: string
  /**
   * 过滤框的占位符和隐藏标签。
   * 不传时用 `@astryx.emojiPicker.searchLabel`。
   */
  searchLabel?: string
}

export interface ChatEmojiPickerEmits {
  /** 选中的表情。弹出层随后关闭，过滤词清空。 */
  select: [emoji: string]
}

export interface ChatEmojiPickerSlots {
  /** 触发元素，里面要有一个按钮。 */
  default?: () => unknown
}

export interface ChatReaction {
  /** 表情字符，例如 "🎉"。 */
  emoji: string
  /** 用这个表情回应的人数。 */
  count: number
  /**
   * 当前用户是不是已经回应过。
   * 为真时胶囊用强调色，并且 `aria-pressed="true"`。
   * @default false
   */
  isSelected?: boolean
  /**
   * 给人看的说明，同时作为提示和无障碍名，
   * 例如 "Ana and Dana reacted with 🎉"。
   * 不传时按数量生成 “N reaction(s) with …”。
   */
  label?: string
}

export interface ChatReactionBarProps {
  /** 按显示顺序排列的回应。 */
  reactions: readonly ChatReaction[]
  /**
   * 添加回应时，选择器里的表情。
   * @default DEFAULT_CHAT_EMOJIS
   */
  emojis?: readonly ChatEmojiOption[]
  /**
   * 添加按钮和选择器对话框的无障碍名。
   * 不传时用 `@astryx.comments.addReaction`。
   */
  addLabel?: string
  /**
   * 这一组回应的无障碍名。
   * 不传时用内置的 “Reactions”。
   */
  label?: string
}

export interface ChatReactionBarEmits {
  /** 用户点了某个已有回应。 */
  toggle: [emoji: string]
  /**
   * 用户从选择器里新加了一个表情。
   * 只有监听了这个事件，末尾才会出现添加按钮。
   */
  add: [emoji: string]
}
