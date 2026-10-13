import { describe, expect, it } from 'vitest'
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

  it('rejects a base that is not a theme', () => {
    expect(() => defineTheme({
      name: 'broken',
      extends: { name: 'nope' } as never,
    })).toThrow(/defineTheme/)
  })

  it('ships neutral with no token overrides', () => {
    expect(neutralTheme.name).toBe('neutral')
    expect(neutralTheme.tokens).toEqual({})
  })
})
