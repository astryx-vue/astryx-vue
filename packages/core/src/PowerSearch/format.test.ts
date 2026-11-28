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

describe('formatFilterValue date_absolute', () => {
  // 2026-03-09T15:00:00Z，也就是东京的 3 月 10 日零点。
  const tokyoMidnight = Date.UTC(2026, 2, 9, 15) / 1000

  it('reads a calendar day in the given zone, and as the UTC day without one', () => {
    const operator = { type: 'date_absolute' } as const
    const value = { type: 'date_absolute', unixSeconds: tokyoMidnight } as const
    expect(formatFilterValue(operator, value, 40, powerSearchMessages.en, 'en', 'Asia/Tokyo')).toBe('Mar 10, 2026')
    expect(formatFilterValue(operator, value, 40, powerSearchMessages.en, 'en')).toBe('Mar 9, 2026')
    expect(formatFilterValue({ ...operator, isDateOnly: true }, value, 40, powerSearchMessages.en, 'en')).toBe('Mar 9, 2026')
  })

  it('gives isDateOnly: false its time of day, in the given zone', () => {
    const out = formatFilterValue(
      { type: 'date_absolute', isDateOnly: false },
      { type: 'date_absolute', unixSeconds: tokyoMidnight },
      40,
      powerSearchMessages.en,
      'en',
      'Asia/Tokyo',
    )
    expect(out).toContain('Mar 10, 2026')
    expect(out).toMatch(/12:00\s?AM/)
  })
})
