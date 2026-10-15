import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CodeBlock from './CodeBlock.vue'
import { dracula, githubLight, oneDarkPro } from './syntaxPresets.js'
import { defineSyntaxTheme, githubDark } from './syntaxTheme.js'
import SyntaxTheme from './SyntaxTheme.vue'

describe('syntax theme', () => {
  it('resolves a light and dark tuple to light-dark()', () => {
    const theme = defineSyntaxTheme({
      name: 'pair',
      tokens: {
        ...githubDark.tokens,
        keyword: ['#111111', '#eeeeee'],
      },
    })

    expect(theme.tokens.keyword).toBe('light-dark(#111111, #eeeeee)')
    expect(theme.tokens.string).toBe(githubDark.tokens.string)
  })

  it('writes preset colors onto the subtree', () => {
    const wrapper = mount(SyntaxTheme, {
      props: { theme: dracula },
      slots: { default: 'code' },
    })

    expect(wrapper.attributes('data-astryx-syntax-theme')).toBe('dracula')
    expect(wrapper.element.style.getPropertyValue('--astryx-code-syntax-keyword')).toBe('#ff79c6')
    expect(wrapper.element.style.getPropertyValue('--astryx-code-block-background')).toBe('#282a36')
    expect(oneDarkPro.name).toBe('one-dark-pro')
    expect(githubLight.tokens.background).toBe('#ffffff')
  })

  it('accepts a syntax theme directly on CodeBlock', () => {
    const wrapper = mount(CodeBlock, {
      props: {
        code: 'const ready = true',
        language: 'ts',
        syntaxTheme: githubLight,
      },
    })

    const block = wrapper.get('pre').element as HTMLElement
    expect(block.style.getPropertyValue('--astryx-code-syntax-keyword')).toBe('#cf222e')
    expect(block.style.getPropertyValue('--astryx-code-block-background')).toBe('#ffffff')
    expect(block.style.getPropertyValue('--astryx-code-syntax-added')).toBe('')
    expect(block.style.getPropertyValue('--astryx-code-syntax-added-marker')).toBe('var(--astryx-code-syntax-punctuation)')
    expect(block.style.getPropertyValue('--astryx-code-syntax-removed-marker')).toBe('var(--astryx-code-syntax-punctuation)')
    expect(block.style.getPropertyValue('--astryx-code-syntax-diff-header')).toBe('transparent')
  })

  it('writes diff slots onto the same syntax variables when a theme sets them', () => {
    const theme = defineSyntaxTheme({
      name: 'diff',
      tokens: {
        ...githubDark.tokens,
        'added': '#e6ffec',
        'removed': ['#ffebe9', '#4d1116'],
        'diff-header': '#f6f8fa',
        'added-marker': '#1a7f37',
        'removed-marker': '#cf222e',
      },
    })

    expect(theme.tokens.removed).toBe('light-dark(#ffebe9, #4d1116)')

    const wrapper = mount(CodeBlock, {
      props: { code: '+const ready = true', language: 'ts', isDiff: true, syntaxTheme: theme },
    })
    const block = wrapper.get('pre').element as HTMLElement
    expect(block.style.getPropertyValue('--astryx-code-syntax-added')).toBe('#e6ffec')
    expect(block.style.getPropertyValue('--astryx-code-syntax-removed')).toBe('light-dark(#ffebe9, #4d1116)')
    expect(block.style.getPropertyValue('--astryx-code-syntax-diff-header')).toBe('#f6f8fa')
    expect(block.style.getPropertyValue('--astryx-code-syntax-added-marker')).toBe('#1a7f37')
  })
})
