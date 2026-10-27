import { describe, expect, it } from 'vitest'
import { powerSearchMessages } from '../locale/messages/power-search.js'
import { characterCount } from '../utils/characters.js'
import { formatFilterValue } from './format.js'

describe('formatFilterValue', () => {
  it('truncates by graphemes and counts the ellipsis toward the limit', () => {
    const family = '\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}'.repeat(3)
    const out = formatFilterValue(
      { type: 'string' },
      { type: 'string', value: family },
      2,
      powerSearchMessages.en,
      'en',
    )
    expect(characterCount(out)).toBe(2)
    expect(out.endsWith('…')).toBe(true)
    expect(out.includes('\u{200D}')).toBe(true)
  })
})
