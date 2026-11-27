import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useLinkify } from './useLinkify.js'

const issue = {
  pattern: /#(\d+)/g,
  href: (match: RegExpMatchArray) => `https://tracker.test/issues/${match[1]}`,
}

describe('useLinkify', () => {
  it('网址、邮箱切成链接，其余原样留作文字', () => {
    const { value } = useLinkify('Visit https://example.com or mail hi@example.com now')
    expect(value).toEqual([
      { type: 'text', text: 'Visit ' },
      { type: 'link', text: 'https://example.com', href: 'https://example.com', isExternal: true },
      { type: 'text', text: ' or mail ' },
      { type: 'link', text: 'hi@example.com', href: 'mailto:hi@example.com', isExternal: false },
      { type: 'text', text: ' now' },
    ])
  })

  it('没有命中或文字为空时只有一段文字', () => {
    expect(useLinkify('plain note').value).toEqual([{ type: 'text', text: 'plain note' }])
    expect(useLinkify('').value).toEqual([{ type: 'text', text: '' }])
  })

  it('自定义规则用捕获组生成地址，label 可改显示文字', () => {
    const { value } = useLinkify('see #123 and #456', {
      patterns: [{ ...issue, label: match => `Issue ${match[1]}` }],
    })
    expect(value.filter(segment => segment.type === 'link')).toEqual([
      { type: 'link', text: 'Issue 123', href: 'https://tracker.test/issues/123', isExternal: false },
      { type: 'link', text: 'Issue 456', href: 'https://tracker.test/issues/456', isExternal: false },
    ])
  })

  it('hasBuiltins 为 false 时只认自定义规则', () => {
    const { value } = useLinkify('https://example.com #7', { patterns: [issue], hasBuiltins: false })
    expect(value.filter(segment => segment.type === 'link').map(segment => segment.text)).toEqual(['#7'])
  })

  it('重叠时先出现的赢，起点相同则自定义规则赢', () => {
    const wide = { pattern: /example\.com\/[a-z]+/g, href: () => '/custom' }
    const { value } = useLinkify('https://example.com/docs', { patterns: [wide] })
    expect(value.map(segment => segment.text)).toEqual(['https://example.com/docs'])
    expect(value[0]).toMatchObject({ type: 'link', isExternal: true })

    const same = { pattern: /https:\/\/example\.com/g, href: () => '/custom' }
    expect(useLinkify('https://example.com', { patterns: [same] }).value[0]).toMatchObject({ href: '/custom' })
  })

  it('同一条正则重复使用不受 lastIndex 影响', () => {
    const options = { patterns: [issue] }
    expect(useLinkify('#1', options).value).toEqual(useLinkify('#1', options).value)
  })

  it('文字是 ref 时跟着变', () => {
    const text = ref('none')
    const segments = useLinkify(text)
    expect(segments.value).toHaveLength(1)
    text.value = 'a@b.co'
    expect(segments.value[0]).toMatchObject({ type: 'link', href: 'mailto:a@b.co' })
  })
})
