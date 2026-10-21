import { describe, expect, it, vi } from 'vitest'
import { githubDark } from '../Code/syntaxTheme.js'
import { defineTheme, isDefinedTheme, neutralTheme, normalizeTokenName } from './defineTheme.js'

describe('defineTheme', () => {
  it('prefixes upstream token names and writes light-dark tuples', () => {
    const theme = defineTheme({
      name: 'ocean',
      tokens: {
        '--color-accent': ['#0077B6', '#48CAE4'],
        '--radius-container': '16px',
      },
    })

    expect(theme.tokens['--astryx-color-accent']).toBe('light-dark(#0077B6, #48CAE4)')
    expect(theme.tokens['--astryx-radius-container']).toBe('16px')
    expect(isDefinedTheme(theme)).toBe(true)
  })

  it('keeps an existing --astryx- prefix', () => {
    expect(normalizeTokenName('--astryx-color-text-primary')).toBe('--astryx-color-text-primary')
    expect(normalizeTokenName('color-text-primary')).toBe('--astryx-color-text-primary')
  })

  it('accepts a [light, dark] tuple for color.accent', () => {
    const paired = defineTheme({ name: 'paired', color: { accent: ['#0064E0', '#B7410E'] } })
    const single = defineTheme({ name: 'single', color: { accent: '#0064E0' } })
    const [pairedLight, pairedDark] = paired.tokens['--astryx-color-accent']!.slice('light-dark('.length, -1).split(', ')
    const [singleLight, singleDark] = single.tokens['--astryx-color-accent']!.slice('light-dark('.length, -1).split(', ')
    expect(pairedLight).toBe(singleLight)
    expect(pairedDark).not.toBe(singleDark)
  })

  it('lets a child theme override the theme it extends', () => {
    const base = defineTheme({
      name: 'base',
      tokens: {
        '--color-accent': '#111111',
        '--color-border': '#222222',
      },
      onDark: { tokens: { '--color-accent': '#ffffff' } },
    })
    const child = defineTheme({
      name: 'child',
      extends: base,
      tokens: { '--color-accent': '#333333' },
      syntax: githubDark,
    })

    expect(child.tokens['--astryx-color-accent']).toBe('#333333')
    expect(child.tokens['--astryx-color-border']).toBe('#222222')
    expect(child.onDark['--astryx-color-accent']).toBe('#ffffff')
    expect(child.syntax).toBe(githubDark)
  })

  it('carries an extended theme into the child CSS, under the child name', () => {
    const base = defineTheme({
      name: 'base-css',
      components: { badge: { base: { fontWeight: '700' } } },
      onDark: { components: { button: { base: { color: 'white' } } } },
    })
    const child = defineTheme({ name: 'child-css', extends: base })
    expect(child.css).toContain('@scope ([data-astryx-theme="child-css"])')
    expect(child.css).toContain('.astryx-badge {\n  font-weight: 700;')
    expect(child.css).toContain('[data-astryx-media="dark"] .astryx-button {\n  color: white;')
    expect(child.css).not.toContain('base-css')
  })

  it('refuses an extends that is missing or not a theme', () => {
    expect(() => defineTheme({ name: 'broken', extends: { name: 'nope' } as never })).toThrow(/extends/)
    expect(() => defineTheme({ name: 'missing', extends: undefined })).toThrow(/extends/)
  })

  it('ships neutral with no token overrides', () => {
    expect(neutralTheme.name).toBe('neutral')
    expect(neutralTheme.tokens).toEqual({})
    expect(neutralTheme.css).toBeUndefined()
    expect(neutralTheme.icons).toBeUndefined()
    expect(neutralTheme.indicators).toBeUndefined()
  })
})

describe('theme targets', () => {
  it('match the stable target class and the reflected data attributes', () => {
    const theme = defineTheme({
      name: 'targets',
      components: {
        'button': { 'variant:destructive+size:sm': { padding: '2px 6px' } },
        'radio-indicator': { checked: { borderColor: '#000' } },
      },
    })
    expect(theme.css).toContain('.astryx-button[data-variant="destructive"][data-size="sm"]')
    expect(theme.css).toContain('.astryx-radio-indicator[data-checked="checked"]')
  })

  it('refuses camelCase and other non-kebab target names instead of rewriting them', () => {
    for (const name of ['buttonIcon', 'Card', 'radio_dot', 'card--header'])
      expect(() => defineTheme({ name: 'old', components: { [name]: { base: { color: 'red' } } } })).toThrow(/component-kebab/)
  })

  it('keeps a themed hover off disabled controls without adding specificity', () => {
    const theme = defineTheme({ name: 'hover', components: { button: { base: { ':hover': { color: 'red' } } } } })
    expect(theme.css).toContain('.astryx-button:hover:where(:not(:disabled, [aria-disabled="true"]))')
  })

  it('routes radius and padding through the derived component variables', () => {
    const theme = defineTheme({
      name: 'derived',
      components: {
        'card': { base: { borderRadius: '20px', paddingBlock: '8px', paddingInline: '24px' } },
        'dropdown-menu': { base: { padding: '6px' } },
      },
    })
    expect(theme.css).toContain('--_card-radius: 20px;')
    expect(theme.css).toContain('--astryx-card-padding-inline: 24px;')
    expect(theme.css).toContain('--astryx-card-padding-block-start: 8px;')
    expect(theme.css).not.toContain('padding-block: 8px')
    expect(theme.css).toContain('padding: 6px;')
    expect(theme.css).toContain('--_dropdown-menu-padding: 6px;')
  })

  it('expands dialog, bottom-sheet, chat and progress-bar-mark into their own variables', () => {
    const theme = defineTheme({
      name: 'surfaces',
      components: {
        'dialog': { base: { padding: '24px' } },
        'bottom-sheet': { base: { paddingBlock: '12px', paddingInline: '20px' } },
        'chat': { base: { borderRadius: '18px', padding: '10px' } },
        'progress-bar-mark': { base: { width: '4px', height: '12px' } },
      },
    })
    expect(theme.css).toContain('--astryx-dialog-padding: 24px;')
    expect(theme.css).not.toMatch(/[;{]\s*padding: 24px/)
    expect(theme.css).toContain('--astryx-bottom-sheet-padding-inline: 20px;')
    expect(theme.css).toContain('--astryx-bottom-sheet-padding-block-start: 12px;')
    expect(theme.css).toContain('--_chat-composer-radius: 18px;')
    expect(theme.css).toContain('--_chat-composer-padding: 10px;')
    expect(theme.css).toContain('--_progressbar-mark-width: 4px;')
    expect(theme.css).toContain('--_progressbar-mark-height: 12px;')
  })

  it('maps physical block padding through the container expansion', () => {
    const theme = defineTheme({ name: 'physical', components: { card: { base: { paddingTop: '4px' } } } })
    expect(theme.css).toContain('--astryx-card-padding-block-start: 4px;')
  })
})

describe('declaration boundary', () => {
  it('drops a token or style that would break out of its declaration, and keeps the rest', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const theme = defineTheme({
      name: 'guarded',
      tokens: {
        '--color-accent': 'red; } body { display: none',
        '--color-border': '#cccccc',
      },
      components: { button: { base: { color: 'red } body { display: none', fontWeight: '600' } } },
    })
    expect(theme.tokens['--astryx-color-accent']).toBeUndefined()
    expect(theme.tokens['--astryx-color-border']).toBe('#cccccc')
    expect(theme.css).toContain('font-weight: 600;')
    expect(theme.css).not.toContain('display: none')
    expect(warn).toHaveBeenCalledTimes(2)
    warn.mockRestore()
  })

  it('keeps valid CSS that only looks dangerous', () => {
    const theme = defineTheme({
      name: 'valid',
      tokens: { '--font-family-body': '"Gill Sans; Light", sans-serif' },
      components: { card: { base: { backgroundImage: 'url("data:image/svg+xml;utf8,<svg/>")' } } },
    })
    expect(theme.tokens['--astryx-font-family-body']).toBe('"Gill Sans; Light", sans-serif')
    expect(theme.css).toContain('url("data:image/svg+xml;utf8,<svg/>")')
  })

  it('never writes a closing style tag into the sheet', () => {
    const theme = defineTheme({ name: 'tag', components: { card: { base: { content: '"</style><script>"' } } } })
    expect(theme.css).not.toMatch(/<\/style/i)
  })
})

describe('media surfaces', () => {
  it('compiles onDark and onLight component styles under the media attribute, after the root rules', () => {
    const theme = defineTheme({
      name: 'surfaces',
      components: { button: { base: { color: 'black' } } },
      onDark: { tokens: { '--color-accent': '#90CAF9' }, components: { button: { base: { color: 'white' } } } },
      onLight: { components: { badge: { base: { color: 'navy' } } } },
    })
    const css = theme.css ?? ''
    expect(theme.onDark['--astryx-color-accent']).toBe('#90CAF9')
    expect(css).toContain('[data-astryx-media="dark"] .astryx-button {\n  color: white;')
    expect(css).toContain('[data-astryx-media="light"] .astryx-badge {\n  color: navy;')
    expect(css.indexOf('color: black')).toBeLessThan(css.indexOf('color: white'))
  })

  it('merges a base theme surface with the child surface per property', () => {
    const base = defineTheme({ name: 's-base', onDark: { components: { button: { base: { color: 'white', fontWeight: '600' } } } } })
    const child = defineTheme({ name: 's-child', extends: base, onDark: { components: { button: { base: { color: 'silver' } } } } })
    expect(child.onDarkComponents?.button?.base).toEqual({ color: 'silver', fontWeight: '600' })
  })
})
