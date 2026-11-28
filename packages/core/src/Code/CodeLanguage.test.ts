import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import CodeBlock from './CodeBlock.vue'
import { createCodeLanguage } from './grammar.js'
import { objectiveC } from './languages/objective-c/index.js'
import { thrift } from './languages/thrift/index.js'

const THRIFT = 'struct User {\n  1: required string name;\n}'

function keywordTexts(root: ParentNode): string[] {
  return Array.from(root.querySelectorAll('.astryx-token-keyword')).map(node => node.textContent ?? '')
}

function render(props: Record<string, unknown>): ReturnType<typeof mount> {
  return mount(CodeBlock, { props: { highlightMode: 'spans', ...props } as never })
}

describe('a language value as `language`', () => {
  it('paints and labels with the value; a string never reaches a module', () => {
    const plain = render({ code: THRIFT, language: 'thrift' })
    expect(keywordTexts(plain.element)).toEqual([])

    const wrapper = render({ code: THRIFT, language: thrift })
    expect(keywordTexts(wrapper.element)).toEqual(expect.arrayContaining(['struct', 'required', 'string']))
    expect(wrapper.text()).toContain('thrift')
  })

  it('reflects the first identifier as data-language', () => {
    const wrapper = render({ code: '@interface A\n@end', language: objectiveC })
    expect(wrapper.get('pre').attributes('data-language')).toBe('objective-c')
  })

  it('paints a custom language made with createCodeLanguage', () => {
    const zig = createCodeLanguage({ name: 'zig', identifiers: ['zig'], tokenize: () => [{ type: 'keyword', start: 0, end: 3 }] })
    const wrapper = render({ code: 'pub fn main() void {}', language: zig })
    expect(keywordTexts(wrapper.element)).toEqual(['pub'])
    expect(wrapper.get('pre').attributes('data-language')).toBe('zig')
  })

  it('labels with the value name and reflects its first identifier', () => {
    const zig = createCodeLanguage({ name: 'Zig Lang', identifiers: ['zig', 'ziglang'], tokenize: () => [] })
    const wrapper = render({ code: 'const a = 1;', language: zig })
    expect(wrapper.get('.astryx-code-block-title').text()).toBe('Zig Lang')
    expect(wrapper.get('pre').attributes('data-language')).toBe('zig')
  })

  it('names a diff over a language value with the value name', () => {
    const wrapper = render({ code: '+const a = 1;', language: thrift, isDiff: true })
    expect(wrapper.get('.astryx-code-block-title').text()).toBe('thrift diff')
  })

  it('paints a custom language synchronously at any length, as tokenizer does', () => {
    const long = 'pub '.repeat(600)
    const zig = createCodeLanguage({
      name: 'zig',
      identifiers: ['zig'],
      tokenize: code => Array.from(code.matchAll(/pub/g), match => ({ type: 'keyword', start: match.index, end: match.index + 3 })),
    })
    const wrapper = render({ code: long, language: zig })
    expect(keywordTexts(wrapper.element)).toHaveLength(600)
  })

  it('keeps the tokenizer prop winning, as released', () => {
    const tokenizer = (): Array<{ type: string, start: number, end: number }> => [{ type: 'string', start: 0, end: 6 }]
    const builtIn = render({ code: 'const x = 1;', language: 'ts', tokenizer })
    expect(keywordTexts(builtIn.element)).toEqual([])
    expect(builtIn.get('.astryx-token-string').text()).toBe('const')
    const value = render({ code: THRIFT, language: thrift, tokenizer })
    expect(keywordTexts(value.element)).toEqual([])
  })

  it('paints a language value in the server render', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(CodeBlock, { code: THRIFT, language: thrift, highlightMode: 'spans' }) }))
    expect(html).toContain('astryx-token-keyword')
  })
})
