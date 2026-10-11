import { describe, expect, it } from 'vitest'
import { slugify, uniqueSlug } from './slug.js'

describe('heading slugs', () => {
  it('keeps letters and numbers from any language', () => {
    expect(slugify('Hello, World!')).toBe('hello-world')
    expect(slugify('安装指南')).toBe('安装指南')
    expect(slugify('  "Quoted"  ')).toBe('quoted')
    expect(slugify('   ')).toBe('')
  })

  it('suffixes duplicates and names an empty slug section', () => {
    const counts = new Map<string, number>()
    expect(uniqueSlug('setup', counts)).toBe('setup')
    expect(uniqueSlug('setup', counts)).toBe('setup-1')
    expect(uniqueSlug('', counts)).toBe('section')
    expect(uniqueSlug('', counts)).toBe('section-1')
  })
})
