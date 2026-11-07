import type { ChatEmojiOption } from './types.js'

/** 网格列数。方向键上下按这个跨度移动。 */
export const CHAT_EMOJI_COLUMNS = 8

/**
 * 两行常用回应。调用方可以用 `emojis` 换成自己的一组。
 * 内容和原版 `DEFAULT_CHAT_EMOJIS` 一致。
 */
export const DEFAULT_CHAT_EMOJIS: readonly ChatEmojiOption[] = [
  { emoji: '👍', name: 'thumbs up' },
  { emoji: '❤️', name: 'heart' },
  { emoji: '😂', name: 'joy' },
  { emoji: '🎉', name: 'tada' },
  { emoji: '😮', name: 'wow' },
  { emoji: '😢', name: 'cry' },
  { emoji: '🔥', name: 'fire' },
  { emoji: '👀', name: 'eyes' },
  { emoji: '✅', name: 'check' },
  { emoji: '🙏', name: 'pray' },
  { emoji: '💯', name: 'hundred' },
  { emoji: '🚀', name: 'rocket' },
  { emoji: '😍', name: 'heart eyes' },
  { emoji: '🤔', name: 'thinking' },
  { emoji: '👋', name: 'wave' },
  { emoji: '⭐', name: 'star' },
]
