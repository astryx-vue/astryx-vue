import { describe, expect, it } from 'vitest'
import { decodeMarkdownCharacterReferences } from './characterReferences.js'

describe('decodeMarkdownCharacterReferences', () => {
  it('decodes named and numeric references and leaves unknown text', () => {
    expect(decodeMarkdownCharacterReferences('&copy; &unknown;')).toBe('© &unknown;')
    expect(decodeMarkdownCharacterReferences('&#169;')).toBe('©')
    expect(decodeMarkdownCharacterReferences('&#xA9;')).toBe('©')
    expect(decodeMarkdownCharacterReferences('&#0;')).toBe('\uFFFD')
    expect(decodeMarkdownCharacterReferences('&copy')).toBe('&copy')
    expect(decodeMarkdownCharacterReferences('Fish &amp; chips')).toBe('Fish & chips')
  })
})
