import { describe, expect, it } from 'vitest'
import { defineTheme } from './defineTheme.js'
import { PRESS_BELIEVED_SELECTOR } from './pressSelector.js'

function css(components: Parameters<typeof defineTheme>[0]['components']): string {
  return defineTheme({ name: 'modes', components }).css ?? ''
}

describe('color-mode blocks', () => {
  it('write nothing extra for a theme without them', () => {
    const plain = css({ button: { base: { backgroundColor: 'red' } } })
    expect(plain).not.toMatch(/prefers-color-scheme|data-astryx-color-mode=|data-astryx-media/)
  })

  it('apply in their mode: the root mode, the reader preference, and the nearest surface', () => {
    const out = css({ button: { base: { 'backgroundColor': 'red', '@dark': { backgroundColor: 'blue' } } } })
    expect(out).toContain('background-color: red;')
    const darkRules = out.split('\n}\n').filter(rule => rule.includes('background-color: blue'))
    // A forced dark root, a system root under a dark preference, and a dark surface.
    expect(darkRules).toHaveLength(3)
    expect(darkRules[0]).toContain(':is(.astryx-button):where(:scope[data-astryx-color-mode="dark"] *)')
    expect(darkRules[1]).toContain('@media (prefers-color-scheme: dark)')
    expect(darkRules[1]).toContain(':where(:scope:not([data-astryx-color-mode="light"], [data-astryx-color-mode="dark"]) *)')
    expect(darkRules[2]).toContain('[data-astryx-media="dark"]')
    // The mode rules come after the rule they refine, at the same weight.
    expect(out.indexOf('background-color: blue')).toBeGreaterThan(out.indexOf('background-color: red'))
    expect(out).not.toContain('prefers-color-scheme: light')
  })

  it('put the dark block before the light block, so light wins a property both set', () => {
    const out = css({ text: { base: { '@light': { color: 'black' }, '@dark': { color: 'white' } } } })
    expect(out.indexOf('color: white')).toBeLessThan(out.indexOf('color: black'))
  })

  it('carry pseudo-class overrides inside the block', () => {
    const out = css({ button: { base: { '@dark': { 'color': 'white', ':hover': { color: 'yellow' } } } } })
    expect(out).toContain('color: yellow;')
    expect(out).toMatch(/\.astryx-button\)[^{]*:hover:where\(/)
  })

  it('keep the nearest media surface in charge', () => {
    const out = css({ button: { base: { '@dark': { color: 'white' } } } })
    const surfaceRule = out.split('\n}\n').find(rule => rule.includes('[data-astryx-media="dark"]'))!
    // Inside a dark surface, unless a light surface sits nearer.
    expect(surfaceRule).toContain(':scope [data-astryx-media="dark"] *:not(:scope [data-astryx-media="dark"] [data-astryx-media="light"] *)')
  })

  it('apply on a media surface only for the surface mode', () => {
    const out = defineTheme({
      name: 'surface-modes',
      onDark: { components: { button: { base: { '@dark': { color: 'white' }, '@light': { color: 'black' } } } } },
    }).css ?? ''
    expect(out).toContain('[data-astryx-media="dark"] .astryx-button')
    expect(out).toContain('color: white;')
    expect(out).not.toContain('color: black;')
  })

  it('merge per property with the theme they extend', () => {
    const base = defineTheme({ name: 'mode-base', components: { button: { base: { '@dark': { color: 'white', opacity: '1' } } } } })
    const child = defineTheme({ name: 'mode-child', extends: base, components: { button: { base: { '@dark': { color: 'silver' } } } } })
    expect(child.components?.button?.base?.['@dark']).toEqual({ color: 'silver', opacity: '1' })
  })

  it('refuse a block that is not an object', () => {
    expect(() => css({ button: { base: { '@dark': 'red' as never } } })).toThrow(/@dark/)
  })
})

describe('themed :active', () => {
  it('follows the touch press model', () => {
    const out = css({ button: { base: { ':active': { backgroundColor: 'rebeccapurple' } } } })
    const fine = /@media not all and \(pointer: coarse\) \{\n([^{]+)\{([^}]*)\}/.exec(out)
    expect(fine?.[1]).toContain('.astryx-button:active')
    expect(fine?.[2]).toContain('background-color: rebeccapurple')
    const coarse = /@media \(pointer: coarse\) \{\n([^{]+)\{([^}]*)\}/.exec(out)
    expect(coarse?.[1]).toContain(`.astryx-button${PRESS_BELIEVED_SELECTOR}`)
    expect(coarse?.[1]).not.toContain(':active')
    expect(coarse?.[2]).toContain('background-color: rebeccapurple')
    const outsideFine = out.replace(/@media not all and \(pointer: coarse\) \{[^{}]*\{[^}]*\}\s*\}/g, '')
    expect(outsideFine).not.toContain('.astryx-button:active')
  })
})

describe('values left undefined', () => {
  it('are not set in a component style, a style key, or a color-mode block', () => {
    const out = css({
      button: {
        'base': { 'color': undefined as never, 'backgroundColor': 'red', '@dark': { color: undefined as never } },
        'variant:ghost': undefined as never,
      },
      card: undefined as never,
    })
    expect(out).toContain('background-color: red;')
    expect(out).not.toMatch(/undefined/)
    expect(out).not.toContain('prefers-color-scheme')
  })

  it('do not hide an inherited value', () => {
    const base = defineTheme({ name: 'undef-base', components: { button: { base: { color: 'red' } } } })
    const child = defineTheme({ name: 'undef-child', extends: base, components: { button: { base: { color: undefined as never } } } })
    expect(child.components?.button?.base?.color).toBe('red')
  })

  it('skip a local token left undefined and refuse a root localTokens left undefined', () => {
    const theme = defineTheme({ name: 'undef-local', localTokens: { '--brand-ink': '#111111', '--brand-gap': undefined as never } })
    expect(theme.localTokens).toEqual({ '--brand-ink': '#111111' })
    expect(() => defineTheme({ name: 'undef-root', localTokens: undefined })).toThrow(/localTokens is undefined/)
  })
})

describe('padding written with functions', () => {
  it('splits a shorthand on its top-level whitespace', () => {
    const out = css({ card: { base: { padding: 'clamp(8px, 2vw, 16px) 24px' } } })
    expect(out).toContain('--astryx-card-padding-block-start: clamp(8px, 2vw, 16px);')
    expect(out).toContain('--astryx-card-padding-inline: 24px;')
  })

  it('treats an empty shorthand as setting nothing', () => {
    const out = css({ card: { base: { paddingBlockStart: '4px', padding: '' } } })
    expect(out).toContain('--astryx-card-padding-block-start: 4px;')
  })
})
