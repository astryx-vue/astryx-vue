import type { EmojiOption } from './types.js'

/** 没有传入常用表情时，列在最前面的默认一组。 */
export const DEFAULT_FREQUENT_EMOJIS: readonly EmojiOption[] = Object.freeze([
  { emoji: '👍', name: 'Thumbs up' },
  { emoji: '❤️', name: 'Red heart' },
  { emoji: '😂', name: 'Face with tears of joy' },
  { emoji: '🎉', name: 'Party popper' },
  { emoji: '😮', name: 'Face with open mouth' },
  { emoji: '🙏', name: 'Folded hands' },
  { emoji: '👀', name: 'Eyes' },
  { emoji: '✅', name: 'Check mark button' },
])

/** 每行 8 个，方向键按这个固定几何移动。 */
export const EMOJI_PICKER_COLUMNS = 8

export const DEFAULT_EMOJI_LIST_HEIGHT = 'calc(var(--astryx-spacing-8, 32px) * 10)'

/** 内置分组标题对应的文案键，键是英文 CLDR 组名。 */
export const BUNDLED_GROUP_KEYS: Readonly<Record<string, string>> = {
  'Smileys & emotion': '@astryx.emojiPicker.groupSmileysEmotion',
  'People & body': '@astryx.emojiPicker.groupPeopleBody',
  'Animals & nature': '@astryx.emojiPicker.groupAnimalsNature',
  'Food & drink': '@astryx.emojiPicker.groupFoodDrink',
  'Travel & places': '@astryx.emojiPicker.groupTravelPlaces',
  'Activities': '@astryx.emojiPicker.groupActivities',
  'Objects': '@astryx.emojiPicker.groupObjects',
  'Symbols': '@astryx.emojiPicker.groupSymbols',
  'Flags': '@astryx.emojiPicker.groupFlags',
}
