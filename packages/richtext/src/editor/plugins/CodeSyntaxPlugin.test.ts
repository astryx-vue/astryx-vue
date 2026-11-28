import { CodeLineTokens, createCodeLanguage } from '@astryx-vue/core'
import { describe, expect, it } from 'vitest'
import { renderedTokens, syncLineTokens } from './CodeSyntaxPlugin.js'

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

  it('paints with a language value, and a value\'s own function runs on the code', () => {
    const zig = createCodeLanguage({ name: 'zig', identifiers: ['zig'], tokenize: () => [{ type: 'keyword', start: 0, end: 3 }] })
    const lines = renderedTokens('pub fn', zig, 'pub fn')
    expect(lines).toEqual([[{ type: 'keyword', start: 0, end: 3 }]])
  })
})

describe('syncLineTokens', () => {
  const lines = Array.from({ length: 50 }, (_, index) => `const value${index} = call(${index}, "row") // note`)
  const code = lines.join('\n')

  it('re-tokenizes only the edited line and keeps every other line\'s tokens as they were', () => {
    const first = syncLineTokens(undefined, code, 'ts')
    const kept = [...first.tokens]
    const edited = code.replace('value25', 'value25x')
    const next = syncLineTokens(first, edited, 'ts')
    expect(next).toBe(first)
    expect(next.text).toBe(edited)
    next.tokens.forEach((line, index) => {
      if (index === 25)
        expect(line).not.toBe(kept[index])
      else
        expect(line).toBe(kept[index])
    })
    expect(next.tokens).toEqual(new CodeLineTokens(edited, 'ts').tokens)
  })

  it('handles an edit that spans lines by matching a whole re-tokenize', () => {
    const first = syncLineTokens(undefined, code, 'ts')
    const edited = `${code.slice(0, 100)}\nx = 1\n${code.slice(100)}`
    expect(syncLineTokens(first, edited, 'ts').tokens).toEqual(new CodeLineTokens(edited, 'ts').tokens)
  })

  it('starts over when the language changes', () => {
    const first = syncLineTokens(undefined, code, 'ts')
    const next = syncLineTokens(first, code, 'python')
    expect(next).not.toBe(first)
    expect(next.language).toBe('python')
  })
})
