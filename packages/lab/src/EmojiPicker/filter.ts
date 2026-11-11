import type { EmojiCategory, EmojiOption } from './types.js'
import { EMOJI_PICKER_COLUMNS } from './constants.js'

export interface EmojiPickerSection {
  key: string
  label: string
  emojis: readonly EmojiOption[]
}

/**
 * 搜索词的每一个词都要出现在名称或关键词的某个词开头：
 * `cat` 能找到 Cat face，不会命中 Vacation。
 */
export function emojiMatches(option: EmojiOption, queryWords: readonly string[]): boolean {
  const words = [option.name, ...(option.keywords ?? [])]
    .join(' ')
    .toLowerCase()
    .split(/[\s:,()-]+/)
  return queryWords.every(query => words.some(word => word.startsWith(query)))
}

/** 一组表情按 8 个一行排开，最后一行用空格子补齐，保持网格几何。 */
export function toRows(emojis: readonly EmojiOption[]): (EmojiOption | null)[][] {
  const rows: (EmojiOption | null)[][] = []
  for (let start = 0; start < emojis.length; start += EMOJI_PICKER_COLUMNS) {
    const row: (EmojiOption | null)[] = emojis.slice(start, start + EMOJI_PICKER_COLUMNS)
    while (row.length < EMOJI_PICKER_COLUMNS)
      row.push(null)
    rows.push(row)
  }
  return rows
}

export function queryWordsOf(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean)
}

export function buildSections(options: {
  queryWords: readonly string[]
  frequentEmojis: readonly EmojiOption[]
  groups: readonly EmojiCategory[]
  frequentLabel: string
  searchResultsLabel: string
  groupLabel: (group: EmojiCategory, index: number) => string
}): EmojiPickerSection[] {
  const { queryWords, frequentEmojis, groups, frequentLabel, searchResultsLabel, groupLabel } = options
  if (queryWords.length === 0) {
    return [
      ...(frequentEmojis.length > 0
        ? [{ key: 'frequent', label: frequentLabel, emojis: frequentEmojis }]
        : []),
      ...groups.map((group, index) => ({
        key: `group-${index}`,
        label: groupLabel(group, index),
        emojis: group.emojis,
      })),
    ]
  }

  const seen = new Set<string>()
  // 先匹配再去重：常用表情可能没有关键词，真正命中的往往是分组里的那一条。
  const matches = [frequentEmojis, ...groups.map(group => group.emojis)]
    .flat()
    .filter(option => emojiMatches(option, queryWords))
    .filter((option) => {
      if (seen.has(option.emoji))
        return false
      seen.add(option.emoji)
      return true
    })

  return matches.length > 0
    ? [{ key: 'results', label: searchResultsLabel, emojis: matches }]
    : []
}
