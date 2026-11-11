export interface EmojiOption {
  /** 表情字符，例如 "🎉"。 */
  emoji: string
  /** 名称，用于搜索和按钮的无障碍名，例如 "Party popper"。 */
  name: string
  /** 搜索时一并匹配的其他词，例如 ["celebration", "tada"]。 */
  keywords?: readonly string[]
}

export interface EmojiCategory {
  /** 分组标题，例如 "Smileys & emotion"。 */
  name: string
  emojis: readonly EmojiOption[]
}

export interface EmojiPickerProps {
  /**
   * 列在最前面、出现在「常用」下面的表情。传入空数组则不显示这一行。
   * @default DEFAULT_FREQUENT_EMOJIS
   */
  frequentEmojis?: readonly EmojiOption[]
  /**
   * 按组分好的表情。不传时，第一次挂载会加载内置集：Emoji 15 以内的全部表情，
   * 带英文 CLDR 名称。要本地化或自定义时传入自己的分组。
   */
  categories?: readonly EmojiCategory[]
  /**
   * 可滚动表情列表的高度。
   * @default 'calc(var(--astryx-spacing-8, 32px) * 10)'
   */
  height?: number | string
  /**
   * 挂载时聚焦搜索框，适合内嵌或放在对话框里。
   * 放在弹出层里时，应改用弹出层自己的自动聚焦。
   * @default false
   */
  hasAutoFocus?: boolean
  /**
   * 表情列表的无障碍名称。
   * 不传时用 `@astryx.emojiPicker.label`。
   */
  label?: string
  /**
   * 搜索框的占位符和隐藏标签。
   * 不传时用 `@astryx.emojiPicker.searchLabel`。
   */
  searchLabel?: string
}

export interface EmojiPickerEmits {
  /** 选中的表情字符和对应的选项。 */
  select: [emoji: string, option: EmojiOption]
}
