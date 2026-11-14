import { describe, expect, it } from 'vitest'
import { appendDraftBlock, appendDraftInline, imagesToMarkdown } from './utils.js'

describe('comment draft helpers', () => {
  it('serializes uploaded images as Markdown paragraphs and escapes the URL', () => {
    expect(imagesToMarkdown(
      [{ url: 'https://example.com/a b.png', alt: 'Chart' }],
      'Image attachment',
    )).toBe('![Chart](https://example.com/a%20b.png)')
  })

  it('falls back to the localized alt when the image has none', () => {
    expect(imagesToMarkdown(
      [{ url: 'https://example.com/x.png', alt: '  ' }],
      'Image attachment',
    )).toBe('![Image attachment](https://example.com/x.png)')
  })

  it('appends a block as its own paragraph', () => {
    expect(appendDraftBlock('See this', '![Chart](a.png)')).toBe('See this\n\n![Chart](a.png)')
    expect(appendDraftBlock('', '![Chart](a.png)')).toBe('![Chart](a.png)')
  })

  it('spaces inline content from surrounding text', () => {
    expect(appendDraftInline('Ship it', '🎉')).toBe('Ship it 🎉')
    expect(appendDraftInline('Ship it ', '🎉')).toBe('Ship it 🎉')
    expect(appendDraftInline('', '🎉')).toBe('🎉')
  })
})
