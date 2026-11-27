import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { defineTheme } from './defineTheme.js'
import { compactDefinition, DEFAULT_COMPACT_DEFINITION } from './index.js'
import Theme from './Theme.vue'
import { resolveTypography } from './typography.js'
import { useTheme } from './useTheme.js'

describe('compact definition', () => {
  it('is exported with the standard points and follows a theme md point', () => {
    expect(DEFAULT_COMPACT_DEFINITION.query).toBe('(width < 768px), (height < 500px)')
    expect(Object.isFrozen(DEFAULT_COMPACT_DEFINITION)).toBe(true)
    expect(compactDefinition({ md: 800 }).widthBelow).toBe(800)
  })
})

describe('drawer padding', () => {
  it('reaches the drawer through the container padding variable', () => {
    const theme = defineTheme({ name: 'drawer-pad', components: { drawer: { base: { padding: '24px' } } } })
    expect(theme.css).toContain('--astryx-drawer-padding: 24px;')
    expect(theme.css).not.toMatch(/[;{]\s*padding: 24px/)
  })
})

describe('--radius-chat', () => {
  it('is no step of the radius scale and follows the container radius', () => {
    const scaled = defineTheme({ name: 'chat-scale', radius: { base: 4, multiplier: 1.5 } })
    expect(scaled.tokens['--astryx-radius-container']).toBe('18px')
    expect(scaled.tokens['--astryx-radius-chat']).toBe('var(--astryx-radius-container)')
    expect(scaled.css).toContain('--astryx-radius-chat: var(--astryx-radius-container);')
  })

  it('is declared again where a theme sets the container radius', () => {
    const theme = defineTheme({ name: 'chat-container', tokens: { '--radius-container': '18px' } })
    expect(theme.css).toContain('--astryx-radius-chat: var(--astryx-radius-container);')
    expect(theme.derivedTokens).toContain('--astryx-radius-chat')
  })

  it('keeps a value the theme sets or inherits', () => {
    const base = defineTheme({ name: 'chat-pinned', tokens: { '--radius-container': '12px', '--radius-chat': '28px' } })
    const child = defineTheme({ name: 'chat-pinned-child', extends: base, tokens: { '--radius-container': '8px' } })
    expect(base.css).not.toContain('--astryx-radius-chat: var(--astryx-radius-container);')
    expect(child.css).toContain('--astryx-radius-chat: 28px;')
    expect(child.css).not.toContain('--astryx-radius-chat: var(--astryx-radius-container);')
  })

  it('is not declared by a theme with no radius', () => {
    expect(defineTheme({ name: 'chat-none' }).css ?? '').not.toContain('radius-chat')
  })

  it('follows the container of an inherited derived value in the child', () => {
    const base = defineTheme({ name: 'chat-derived', tokens: { '--radius-container': '12px' } })
    const child = defineTheme({ name: 'chat-derived-child', extends: base, tokens: { '--radius-container': '8px' } })
    expect(child.tokens['--astryx-radius-chat']).toBe('var(--astryx-radius-container)')
  })
})

describe('typography font lists', () => {
  it('give a heading family only its own fallbacks, and build nothing from fallbacks alone', () => {
    const theme = defineTheme({
      name: 'heading-family-only',
      typography: {
        body: { family: 'Inter', fallbacks: 'sans-serif' },
        heading: { family: 'Lora' },
        code: { fallbacks: 'monospace' },
      },
    })
    expect(theme.tokens['--astryx-font-family-body']).toBe('Inter, sans-serif')
    expect(theme.tokens['--astryx-font-family-heading']).toBe('Lora')
    expect(theme.tokens['--astryx-font-family-code']).toBeUndefined()
  })

  it('give a heading with no family the body font list', () => {
    const { tokens } = resolveTypography({ body: { family: 'Inter', fallbacks: 'sans-serif' }, heading: { fallbacks: 'serif' } })
    expect(tokens['--font-family-heading']).toBe('Inter, sans-serif')
  })

  it('write a numeric weight as its text', () => {
    const { tokens } = resolveTypography({ scale: { base: 14, ratio: 1.2 }, heading: { weight: 700 }, body: { weight: 500 } })
    expect(tokens['--text-heading-1-weight']).toBe('700')
    expect(tokens['--text-body-weight']).toBe('500')
  })
})

describe('a styled accent link', () => {
  it('keeps the hover color a container or theme sets', () => {
    const out = defineTheme({ name: 'link-hover-pin', components: { link: { base: { textDecoration: 'underline' } } } }).css ?? ''
    expect(out).toContain(':where(:hover):where(:not(:disabled, [aria-disabled="true"])) { color: var(--astryx-link-hover-color, var(--astryx-link-accent-foreground, #0074e2)); }')
    // Only the accent link has a hover color of its own.
    expect(out).not.toContain('data-color="primary"]:where(:hover)')
  })

  it('falls back to the theme\'s own accent link color on hover', () => {
    const out = defineTheme({ name: 'link-hover-own', components: { link: { 'color:accent': { color: '#0000ff' } } } }).css ?? ''
    expect(out).toContain('{ color: var(--astryx-link-hover-color, #0000ff); }')
  })
})

describe('useTheme mode', () => {
  it('is always light or dark: a mode outside light|dark|system resolves like system', () => {
    const Probe = defineComponent({
      setup() {
        const theme = useTheme()
        return () => h('span', theme.mode.value)
      },
    })
    const theme = defineTheme({ name: 'odd-mode' })
    const wrapper = mount(Theme, { props: { theme, mode: 'banana' as never }, slots: { default: () => h(Probe) } })
    expect(['light', 'dark']).toContain(wrapper.text())
    expect(wrapper.attributes('data-astryx-color-mode')).toBe('banana')
    const light = mount(Theme, { props: { theme, mode: 'light' }, slots: { default: () => h(Probe) } })
    expect(light.text()).toBe('light')
    wrapper.unmount()
    light.unmount()
  })
})
