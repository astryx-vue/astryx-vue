import type { ChatEmojiOption } from './types.js'

/** 短名包含查询，或者查询本身就是那个表情字符。大小写不敏感，首尾空白不算。 */
export function filterEmojis(emojis: readonly ChatEmojiOption[], query: string): ChatEmojiOption[] {
  const trimmed = query.trim().toLowerCase()
  if (trimmed === '')
    return [...emojis]
  return emojis.filter(option =>
    option.name.toLowerCase().includes(trimmed) || option.emoji === trimmed,
  )
}
