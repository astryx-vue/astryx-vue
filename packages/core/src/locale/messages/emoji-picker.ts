import type { AstryxLocale } from '../types.js'
import { formatIcu } from '../icu.js'

/** 表情选择器。ChatEmojiPicker 用其中几条，分组、常用和加载失败留给以后的完整选择器。字段名对应 `@astryx.emojiPicker.*` 的最后一段。 */
export interface EmojiPickerMessages {
  frequentlyUsed: string
  groupActivities: string
  groupAnimalsNature: string
  groupFlags: string
  groupFoodDrink: string
  groupObjects: string
  groupPeopleBody: string
  groupSmileysEmotion: string
  groupSymbols: string
  groupTravelPlaces: string
  label: string
  loadFailed: string
  loading: string
  noResults: (query: string) => string
  searchLabel: string
  searchResults: string
  /** 弹出层对话框的默认无障碍名。原版写死，目录里没有对应键。 */
  pickLabel: string
  /** 格子按钮的无障碍名。原版写死成 React with {name}，目录里没有对应键。 */
  reactWith: (name: string) => string
}

function fill(template: string, locale: 'en' | 'zh-CN', values: Record<string, string | number>): string {
  return formatIcu(template, values, locale).replace(/[ \t]{2,}/g, ' ').trim()
}

export const emojiPickerMessages: Record<AstryxLocale, EmojiPickerMessages> = {
  'en': {
    frequentlyUsed: 'Frequently used',
    groupActivities: 'Activities',
    groupAnimalsNature: 'Animals & nature',
    groupFlags: 'Flags',
    groupFoodDrink: 'Food & drink',
    groupObjects: 'Objects',
    groupPeopleBody: 'People & body',
    groupSmileysEmotion: 'Smileys & emotion',
    groupSymbols: 'Symbols',
    groupTravelPlaces: 'Travel & places',
    label: 'Emoji',
    loadFailed: 'More emoji couldn\'t be loaded.',
    loading: 'Loading emoji',
    noResults: query => fill('No emoji match “{query}”', 'en', { query }),
    searchLabel: 'Search emoji',
    searchResults: 'Search results',
    pickLabel: 'Pick an emoji',
    reactWith: name => `React with ${name}`,
  },
  'zh-CN': {
    frequentlyUsed: '常用',
    groupActivities: '活动',
    groupAnimalsNature: '动物与自然',
    groupFlags: '旗帜',
    groupFoodDrink: '食物与饮品',
    groupObjects: '物品',
    groupPeopleBody: '人物与身体',
    groupSmileysEmotion: '表情与情绪',
    groupSymbols: '符号',
    groupTravelPlaces: '旅行与地点',
    label: '表情',
    loadFailed: '更多表情没能加载。',
    loading: '正在加载表情',
    noResults: query => fill('没有和“{query}”匹配的表情', 'zh-CN', { query }),
    searchLabel: '搜索表情',
    searchResults: '搜索结果',
    pickLabel: '选择表情',
    reactWith: name => `用${name}回应`,
  },
}
