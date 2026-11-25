import { describe, expect, it } from 'vitest'
import { DEFAULT_LINK_MATCHERS } from './editor/plugins/autoLink.js'

const matchEmail = DEFAULT_LINK_MATCHERS[1]!

describe('邮箱自动链接', () => {
  it.each([
    ['first.last+tag@sub.example.co.uk', 'first.last+tag@sub.example.co.uk'],
    ['"john doe"@example.com', '"john doe"@example.com'],
    ['user@[192.168.0.1]', 'user@[192.168.0.1]'],
    ['(a@b.com)', 'a@b.com'],
    ['写信到 hi@example.com 就行', 'hi@example.com'],
  ])('从 %s 里认出邮箱', (text, email) => {
    expect(matchEmail(text)?.text).toBe(email)
  })

  it.each([
    ['一长串字母', 'a'.repeat(100_000)],
    ['一长串引号', '"'.repeat(100_000)],
    ['一长串带点的片段', 'a.'.repeat(50_000)],
  ])('扫描%s不卡住，耗时和长度成正比', (_, text) => {
    const start = performance.now()
    expect(matchEmail(text)).toBeNull()
    expect(performance.now() - start).toBeLessThan(500)
  })
})
