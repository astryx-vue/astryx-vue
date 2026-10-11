import { describe, expect, it } from 'vitest'
import { linkOpensInNewTab, sanitizeMarkdownImageUrl, sanitizeMarkdownLinkUrl } from './url.js'

describe('markdown urls', () => {
  it('drops script and html data targets, including disguised schemes', () => {
    expect(sanitizeMarkdownLinkUrl('javascript:alert(1)')).toBeNull()
    expect(sanitizeMarkdownLinkUrl('JavaScript:alert(1)')).toBeNull()
    expect(sanitizeMarkdownLinkUrl('java\u0000script:alert(1)')).toBeNull()
    expect(sanitizeMarkdownLinkUrl('javascript: alert(1)')).toBeNull()
    expect(sanitizeMarkdownLinkUrl('vbscript:msgbox(1)')).toBeNull()
    expect(sanitizeMarkdownLinkUrl('data:text/html,hi')).toBeNull()
  })

  it('keeps ordinary navigation targets', () => {
    expect(sanitizeMarkdownLinkUrl('  https://example.com  ')).toBe('https://example.com')
    expect(sanitizeMarkdownLinkUrl('/docs')).toBe('/docs')
    expect(sanitizeMarkdownLinkUrl('mailto:a@b.c')).toBe('mailto:a@b.c')
    expect(sanitizeMarkdownLinkUrl('')).toBeNull()
  })

  it('rejects every data url on images', () => {
    expect(sanitizeMarkdownImageUrl('data:image/png;base64,aaaa')).toBeNull()
    expect(sanitizeMarkdownImageUrl('javascript:alert(1)')).toBeNull()
    expect(sanitizeMarkdownImageUrl('https://example.com/a.png')).toBe('https://example.com/a.png')
  })

  it('opens only http(s) links in a new tab', () => {
    expect(linkOpensInNewTab('https://example.com')).toBe(true)
    expect(linkOpensInNewTab('HTTP://example.com')).toBe(true)
    expect(linkOpensInNewTab('/docs')).toBe(false)
    expect(linkOpensInNewTab('mailto:a@b.c')).toBe(false)
  })
})
