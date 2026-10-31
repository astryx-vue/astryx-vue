import { describe, expect, it } from 'vitest'
import { renderedTokens } from './CodeSyntaxPlugin.js'

describe('renderedTokens', () => {
  const code = 'const a = 1\nreturn a'

  it('gives per-line tokens when the rendered text keeps the line breaks', () => {
    const lines = renderedTokens(code, 'js', code)
    expect(lines?.length).toBe(2)
    expect(lines?.[0]?.some(t => t.type === 'keyword')).toBe(true)
  })

  it('joins every line into one run of offsets when line breaks render as empty elements', () => {
    const rendered = code.replaceAll('\n', '')
    const lines = renderedTokens(code, 'js', rendered)
    expect(lines?.length).toBe(1)
    // 第二行的 `return` 在去掉换行后的文字里，起点是第一行的长度 11
    const second = lines![0]!.find(t => t.type === 'keyword' && t.start >= 11)
    expect(second?.start).toBe(11)
  })

  it('returns null while the rendered text does not match the code yet', () => {
    expect(renderedTokens(code, 'js', 'something else')).toBeNull()
  })

  it('returns no tokens for a language it does not know', () => {
    expect(renderedTokens('x', 'no-such-language', 'x')).toEqual([])
  })
})
