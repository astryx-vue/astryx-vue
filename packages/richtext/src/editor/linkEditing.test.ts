import { describe, expect, it } from 'vitest'
import { toLinkHref } from './linkEditing.js'

describe('toLinkHref', () => {
  it('keeps an allowed address, without the spaces around it', () => {
    expect(toLinkHref('  https://example.com/a  ')).toBe('https://example.com/a')
    expect(toLinkHref('mailto:team@example.com')).toBe('mailto:team@example.com')
  })

  it('turns a bare domain into an https address', () => {
    expect(toLinkHref('example.com')).toBe('https://example.com/')
  })

  it('refuses an address the link rules do not allow', () => {
    expect(toLinkHref('javascript:alert(1)')).toBeNull()
    expect(toLinkHref('   ')).toBeNull()
  })
})
