import { describe, expect, it } from 'vitest'
import { BUNDLED_GROUP_KEYS } from './constants.js'
import { bundledGroupLabelKey, loadBundledCategories, resetBundledCategories } from './emojiData.js'

describe('bundled emoji data', () => {
  it('lists every CLDR group but the component group, in order', async () => {
    resetBundledCategories()
    const groups = await loadBundledCategories()
    expect(groups.map(group => group.name)).toEqual([
      'Smileys & emotion',
      'People & body',
      'Animals & nature',
      'Food & drink',
      'Travel & places',
      'Activities',
      'Objects',
      'Symbols',
      'Flags',
    ])
    expect(groups.every(group => bundledGroupLabelKey(group) === BUNDLED_GROUP_KEYS[group.name])).toBe(true)
  })

  it('names every emoji once, with no skin-tone variants', async () => {
    const groups = await loadBundledCategories()
    const emojis = groups.flatMap(group => group.emojis)
    expect(emojis.length).toBeGreaterThan(1800)
    const characters = emojis.map(option => option.emoji)
    expect(new Set(characters).size).toBe(characters.length)
    expect(emojis.every(option => option.name.trim() !== '')).toBe(true)
    expect(characters.some(emoji => /[\u{1F3FB}-\u{1F3FF}]/u.test(emoji))).toBe(false)
  })
})
