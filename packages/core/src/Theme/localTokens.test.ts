import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineTheme } from './defineTheme.js'
import Theme from './Theme.vue'

describe('theme-local tokens', () => {
  it('keep their exact names, with no prefix added or required', () => {
    const theme = defineTheme({
      name: 'brand',
      localTokens: {
        '--brand-ink': ['#111111', '#eeeeee'],
        '--astryx-theme-brand-fill': 'var(--brand-ink)',
      },
    })
    expect(theme.localTokens).toEqual({
      '--brand-ink': 'light-dark(#111111, #eeeeee)',
      '--astryx-theme-brand-fill': 'var(--brand-ink)',
    })
    expect(theme.localTokenOwners).toEqual({ '--brand-ink': 'brand', '--astryx-theme-brand-fill': 'brand' })
  })

  it('reach the Theme root with their exact names', () => {
    const theme = defineTheme({ name: 'brand-root', localTokens: { '--brand-ink': '#123456' } })
    const wrapper = mount(Theme, { props: { theme }, slots: { default: 'x' } })
    expect(wrapper.element.style.getPropertyValue('--brand-ink')).toBe('#123456')
    wrapper.unmount()
  })

  it('may be referenced from components with their exact names', () => {
    const theme = defineTheme({
      name: 'brand-ref',
      localTokens: { '--brand-ink': '#123456' },
      components: { button: { base: { color: 'var(--brand-ink)' } } },
    })
    expect(theme.css).toContain('color: var(--brand-ink);')
  })

  it('refuse a shared token name, a bad name, and a cycle', () => {
    expect(() => defineTheme({ name: 'x', localTokens: { '--color-accent': 'red' } })).toThrow(/shared theme token/)
    expect(() => defineTheme({ name: 'x', localTokens: { '--astryx-spacing-4': '1px' } })).toThrow(/shared theme token/)
    expect(() => defineTheme({ name: 'x', localTokens: { 'brand-ink': 'red' } })).toThrow(/custom property/)
    expect(() => defineTheme({
      name: 'x',
      localTokens: { '--a': 'var(--b)', '--b': 'var(--a)' },
    })).toThrow(/cycle detected: --a -> --b -> --a/)
  })

  it('are inherited, may be replaced by a child, and keep the first owner', () => {
    const base = defineTheme({ name: 'family', localTokens: { '--brand-ink': '#111111', '--brand-paper': '#ffffff' } })
    const child = defineTheme({ name: 'family-dark', extends: base, localTokens: { '--brand-ink': '#eeeeee', '--brand-accent': '#f00' } })
    expect(child.localTokens).toEqual({ '--brand-ink': '#eeeeee', '--brand-paper': '#ffffff', '--brand-accent': '#f00' })
    expect(child.localTokenOwners).toEqual({ '--brand-ink': 'family', '--brand-paper': 'family', '--brand-accent': 'family-dark' })
  })

  it('are left out entirely when no theme in the lineage declares any', () => {
    expect(defineTheme({ name: 'plain' }).localTokens).toBeUndefined()
  })

  it('may be replaced by an adaptation rule, but a rule cannot add one', () => {
    const theme = defineTheme({
      name: 'adapt-local',
      localTokens: { '--brand-ink': '#111111' },
      adaptations: { rules: [{ when: { pointer: 'coarse' }, value: { localTokens: { '--brand-ink': '#222222' } } }] },
    })
    expect(theme.adaptationRules?.[0]?.localTokens).toEqual({ '--brand-ink': '#222222' })
    expect(theme.css).toContain('--brand-ink: #222222 !important;')
    expect(() => defineTheme({
      name: 'adapt-new',
      adaptations: { rules: [{ when: { pointer: 'coarse' }, value: { localTokens: { '--brand-new': 'red' } } }] },
    })).toThrow(/cannot add a theme-local token/)
    expect(() => defineTheme({
      name: 'adapt-misrouted',
      localTokens: { '--brand-ink': '#111111' },
      adaptations: { rules: [{ when: { pointer: 'coarse' }, value: { tokens: { '--brand-ink': 'red' } } }] },
    })).toThrow(/write it through value.localTokens/)
  })
})
