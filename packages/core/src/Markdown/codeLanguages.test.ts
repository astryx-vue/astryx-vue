import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createCodeLanguage } from '../Code/grammar.js'
import { thrift } from '../Code/languages/thrift/index.js'
import Markdown from './Markdown.vue'

const FENCE = '```thrift\nstruct User {}\n```'

function keywords(wrapper: ReturnType<typeof mount>): string[] {
  return wrapper.findAll('.astryx-token-keyword').map(node => node.text())
}

describe('markdown codeLanguages', () => {
  it('without codeLanguages a thrift fence renders plain', () => {
    expect(keywords(mount(Markdown, { props: { content: FENCE } }))).toEqual([])
  })

  it('a listed language value claims its fence word and labels with its name', () => {
    const wrapper = mount(Markdown, { props: { content: FENCE, codeLanguages: [thrift] } })
    expect(keywords(wrapper)).toContain('struct')
    expect(wrapper.get('.astryx-code-block-title').text()).toBe('thrift')
  })

  it('claims a word ahead of a built-in with the same identifier, and a later entry wins', () => {
    const first = createCodeLanguage({ name: 'first', identifiers: ['ts'], tokenize: () => [{ type: 'string', start: 0, end: 5 }] })
    const second = createCodeLanguage({ name: 'second', identifiers: ['ts'], tokenize: () => [{ type: 'number', start: 0, end: 5 }] })
    const wrapper = mount(Markdown, { props: { content: '```ts\nconst a = 1\n```', codeLanguages: [first, second] } })
    expect(wrapper.get('.astryx-code-block-title').text()).toBe('second')
    expect(wrapper.find('.astryx-token-number').exists()).toBe(true)
    expect(wrapper.find('.astryx-token-keyword').exists()).toBe(false)
  })

  it('keeps one list while it names the same values, so an inline array does not repaint', async () => {
    let calls = 0
    const counted = createCodeLanguage({
      name: 'counted',
      identifiers: ['counted'],
      tokenize: () => {
        calls += 1
        return []
      },
    })
    const wrapper = mount(Markdown, { props: { content: '```counted\nx\n```', codeLanguages: [counted] } })
    const before = calls
    await wrapper.setProps({ codeLanguages: [counted] })
    expect(calls).toBe(before)
  })
})
