import { describe, expect, it } from 'vitest'
import { contrastRatio, parseColor } from './contrast.js'
import { defineTheme } from './defineTheme.js'
import { expandColorScale } from './expandColorScale.js'
import { expandMotionScale } from './expandMotionScale.js'
import { expandRadiusScale } from './expandRadiusScale.js'
import { expandTypeScale } from './expandTypeScale.js'
import { hctToHex, hexToHct } from './hct.js'

function stops(value: string): readonly [string, string] {
  const match = /^light-dark\((.*)\)$/.exec(value)
  const body = match?.[1]
  if (!body)
    throw new Error(`expected light-dark, got ${value}`)
  const comma = body.indexOf(',')
  return [body.slice(0, comma).trim(), body.slice(comma + 1).trim()]
}

function ratio(foreground: string, background: string): number {
  const fg = parseColor(foreground)
  const bg = parseColor(background)
  if (!fg || !bg)
    throw new Error('unreadable color')
  return contrastRatio(fg, bg)
}

describe('expandColorScale', () => {
  it('derives an accent palette and keeps muted colors pointing at the accent', () => {
    const tokens = expandColorScale({ accent: '#0064E0' })
    expect(tokens['--color-accent']).toMatch(/^light-dark\(#/)
    expect(tokens['--color-accent-muted']).toBe(
      'light-dark(color-mix(in srgb, var(--color-accent) 20%, transparent), color-mix(in srgb, var(--color-accent) 25%, transparent))',
    )
    expect(tokens['--color-text-accent']).toBe('var(--color-accent)')
    expect(tokens['--color-icon-accent']).toBe('var(--color-accent)')
    expect(tokens['--color-on-accent']).toMatch(/^light-dark\(#/)

    const [accentLight, accentDark] = stops(tokens['--color-accent'] ?? '')
    const [onLight, onDark] = stops(tokens['--color-on-accent'] ?? '')
    const [textLight, textDark] = stops(tokens['--color-text-primary'] ?? '')
    const [surfaceLight, surfaceDark] = stops(tokens['--color-background-surface'] ?? '')
    const [borderLight, borderDark] = stops(tokens['--color-border-emphasized'] ?? '')
    expect(ratio(textLight, surfaceLight)).toBeGreaterThanOrEqual(4.5)
    expect(ratio(textDark, surfaceDark)).toBeGreaterThanOrEqual(4.5)
    expect(ratio(onLight, accentLight)).toBeGreaterThanOrEqual(4.5)
    expect(ratio(onDark, accentDark)).toBeGreaterThanOrEqual(4.5)
    expect(ratio(borderLight, surfaceLight)).toBeGreaterThanOrEqual(3)
    expect(ratio(borderDark, surfaceDark)).toBeGreaterThanOrEqual(3)
  })

  it('seeds each scheme from its own accent', () => {
    const paired = expandColorScale({ accent: ['#0064E0', '#B7410E'] })
    const single = expandColorScale({ accent: '#0064E0' })
    const [pairedLight] = stops(paired['--color-accent'] ?? '')
    const [singleLight, singleDark] = stops(single['--color-accent'] ?? '')
    const [, pairedDark] = stops(paired['--color-accent'] ?? '')
    expect(pairedLight).toBe(singleLight)
    expect(pairedDark).not.toBe(singleDark)
  })

  it('leaves accent tokens unset when only the neutrals change', () => {
    const tokens = expandColorScale({ neutralStyle: 'warm' })
    expect(tokens['--color-accent']).toBeUndefined()
    expect(tokens['--color-on-accent']).toBeUndefined()
    expect(tokens['--color-text-primary']).toMatch(/^light-dark\(/)
  })

  it('rejects an accent that is not hex', () => {
    expect(() => expandColorScale({ accent: 'blue' })).toThrow(/hex/)
  })
})

describe('hct', () => {
  it('round-trips a blue seed closely enough to keep the hue', () => {
    const hct = hexToHct('#0064E0')
    expect(hct.hue).toBeGreaterThan(200)
    expect(hct.hue).toBeLessThan(330)
    expect(hct.tone).toBeGreaterThan(40)
    expect(hct.tone).toBeLessThan(60)
    const back = hexToHct(hctToHex(hct))
    expect(Math.abs(back.hue - hct.hue)).toBeLessThan(2)
    expect(Math.abs(back.tone - hct.tone)).toBeLessThan(1)
  })
})

describe('expandTypeScale', () => {
  it('matches the 14px, 1.2 scale used by Neutral', () => {
    const tokens = expandTypeScale({ base: 14, ratio: 1.2 })
    expect(tokens['--font-size-base']).toBe('0.875rem')
    expect(tokens['--font-size-sm']).toBe('0.75rem')
    expect(tokens['--font-size-lg']).toBe('1.0625rem')
    expect(tokens['--font-size-2xl']).toBe('1.5rem')
    expect(tokens['--font-size-5xl']).toBe('2.625rem')
    expect(tokens['--text-body-size']).toBe('var(--font-size-base)')
    expect(tokens['--text-body-leading']).toBe('1.4286')
    expect(tokens['--text-heading-1-size']).toBe('var(--font-size-2xl)')
    expect(tokens['--text-heading-1-leading']).toBe('1.3333')
    expect(tokens['--text-heading-2-leading']).toBe('1.4')
    expect(tokens['--text-heading-5-leading']).toBe('1.6667')
    expect(tokens['--text-display-1-leading']).toBe('1.2381')
  })
})

describe('expandRadiusScale', () => {
  it('scales inner through page and leaves the anchors fixed', () => {
    expect(expandRadiusScale({ base: 4, multiplier: 1 })).toEqual({
      '--radius-none': '0px',
      '--radius-inner': '4px',
      '--radius-element': '8px',
      '--radius-container': '12px',
      '--radius-page': '28px',
      '--radius-chat': '28px',
      '--radius-full': '9999px',
    })
    expect(expandRadiusScale({ base: 4, multiplier: 0 })['--radius-element']).toBe('0px')
    expect(expandRadiusScale({ base: 4, multiplier: 0 })['--radius-full']).toBe('9999px')
  })
})

describe('expandMotionScale', () => {
  it('matches the Neutral duration scale', () => {
    expect(expandMotionScale({ fast: 125, medium: 300, slow: 700, ratio: 0.75 })).toEqual({
      '--duration-fast-min': '95ms',
      '--duration-fast': '125ms',
      '--duration-fast-max': '165ms',
      '--duration-medium-min': '225ms',
      '--duration-medium': '300ms',
      '--duration-medium-max': '400ms',
      '--duration-slow-min': '525ms',
      '--duration-slow': '700ms',
      '--duration-slow-max': '935ms',
    })
  })

  it('omits the slow band until slow is set', () => {
    const tokens = expandMotionScale({
      fast: 100,
      medium: 250,
      ratio: 0.75,
      easing: 'cubic-bezier(0.2, 0, 0, 1)',
    })
    expect(tokens['--duration-slow']).toBeUndefined()
    expect(tokens['--ease-standard']).toBe('cubic-bezier(0.2, 0, 0, 1)')
  })
})

describe('defineTheme generators', () => {
  it('prefixes generated tokens and lets an explicit token win', () => {
    const theme = defineTheme({
      name: 'brand',
      color: { accent: '#0064E0' },
      tokens: { '--color-accent': ['#111111', '#EEEEEE'] },
      radius: { base: 4, multiplier: 1 },
      motion: { fast: 125, medium: 300, slow: 700, ratio: 0.75 },
    })
    expect(theme.tokens['--astryx-color-accent']).toBe('light-dark(#111111, #EEEEEE)')
    expect(theme.tokens['--astryx-color-text-accent']).toBe('var(--astryx-color-accent)')
    expect(theme.tokens['--astryx-color-accent-muted']).toContain('var(--astryx-color-accent)')
    expect(theme.tokens['--astryx-radius-element']).toBe('8px')
    expect(theme.tokens['--astryx-duration-fast-min']).toBe('95ms')
  })

  it('writes a type scale, heading aliases, and component rules', () => {
    const theme = defineTheme({
      name: 'editorial',
      typography: {
        scale: { base: 16, ratio: 1.25 },
        body: { family: 'Source Serif 4', fallbacks: 'Georgia, serif', weight: 'regular' },
        heading: { weight: 'bold', weights: { 1: 'semibold' } },
        code: { family: 'JetBrains Mono', fallbacks: 'monospace' },
      },
    })
    expect(theme.tokens['--astryx-font-size-base']).toBe('1rem')
    expect(theme.tokens['--astryx-font-family-body']).toBe('"Source Serif 4", Georgia, serif')
    expect(theme.tokens['--astryx-font-family-heading']).toBe('"Source Serif 4", Georgia, serif')
    expect(theme.tokens['--astryx-text-body-weight']).toBe('var(--astryx-font-weight-normal)')
    expect(theme.tokens['--astryx-text-heading-1-weight']).toBe('var(--astryx-font-weight-semibold)')
    expect(theme.tokens['--astryx-text-heading-2-weight']).toBe('var(--astryx-font-weight-bold)')
    expect(theme.tokens['--astryx-heading-level-1-size']).toBe('var(--astryx-text-heading-1-size)')
    expect(theme.css).toContain('@scope ([data-astryx-theme="editorial"]) to ([data-astryx-theme])')
    expect(theme.css).toContain('.astryx-heading[data-level="1"], .astryx-heading.astryx-heading--level-1')
    expect(theme.css).toContain('font-size: var(--astryx-text-heading-1-size);')
    expect(theme.css).toContain('.astryx-text.astryx-text--type-code')
  })

  it('scopes a component override and skips disabled hover', () => {
    const theme = defineTheme({
      name: 'sharp',
      components: {
        button: {
          'base': { fontWeight: '600' },
          'variant:secondary': {
            'backgroundColor': 'var(--color-neutral)',
            ':hover': { backgroundColor: 'var(--color-overlay-hover)' },
          },
        },
      },
    })
    expect(theme.css).toContain('@scope ([data-astryx-theme="sharp"]) to ([data-astryx-theme])')
    expect(theme.css).toContain('.astryx-button {\n  font-weight: 600;')
    expect(theme.css).toContain('.astryx-button[data-variant="secondary"]')
    expect(theme.css).toContain('.astryx-button.astryx-button--variant-secondary')
    expect(theme.css).toContain(':hover:where(:not(:disabled, [aria-disabled="true"]))')
    expect(theme.css).toContain('background-color: var(--astryx-color-neutral);')
    expect(theme.css).toContain('@layer astryx.overrides')
  })

  it('keeps a base theme and lets the child replace one generated value', () => {
    const base = defineTheme({
      name: 'base-brand',
      color: { accent: '#0064E0' },
      components: { badge: { base: { fontWeight: '700' } } },
    })
    const child = defineTheme({
      name: 'child-brand',
      extends: base,
      tokens: { '--color-border': '#cccccc' },
      components: { button: { base: { fontWeight: '500' } } },
    })
    expect(child.tokens['--astryx-color-accent']).toBe(base.tokens['--astryx-color-accent'])
    expect(child.tokens['--astryx-color-border']).toBe('#cccccc')
    expect(child.css).toContain('@scope ([data-astryx-theme="child-brand"])')
    expect(child.css).toContain('.astryx-badge {\n  font-weight: 700;')
    expect(child.css).toContain('.astryx-button {\n  font-weight: 500;')
    expect(child.css).not.toContain('base-brand')
  })
})
