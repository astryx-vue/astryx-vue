import { describe, expect, it } from 'vitest'
import { contrastRatio, parseColor } from './contrast.js'
import { defineTheme } from './defineTheme.js'
import { deriveStatusRoleTokens } from './statusRoleDerivation.js'

function stops(value: string | undefined): [string, string] {
  const match = /^light-dark\((#[0-9a-f]{6}), (#[0-9a-f]{6})\)$/i.exec(value ?? '')
  if (!match)
    throw new Error(`not a light-dark pair: ${value}`)
  return [match[1]!, match[2]!]
}

function ratio(a: string, b: string): number {
  return contrastRatio(parseColor(a)!, parseColor(b)!)
}

describe('status role derivation', () => {
  it('derives content, text, and pale-fill content from a status fill alone', () => {
    const derived = deriveStatusRoleTokens({ '--astryx-color-success': '#16a34a' })

    const [onLight, onDark] = stops(derived['--astryx-color-on-success'])
    expect(ratio(onLight, '#16a34a')).toBeGreaterThanOrEqual(4.5)
    expect(ratio(onDark, '#16a34a')).toBeGreaterThanOrEqual(4.5)

    // Text reads on the default surface and card in both modes.
    const [textLight, textDark] = stops(derived['--astryx-color-text-success'])
    expect(ratio(textLight, '#ffffff')).toBeGreaterThanOrEqual(4.5)
    expect(ratio(textDark, '#262626')).toBeGreaterThanOrEqual(4.5)
    expect(ratio(textDark, '#1b1b1b')).toBeGreaterThanOrEqual(4.5)

    // Pale-fill content reads on the default light pale fill.
    const [onMutedLight] = stops(derived['--astryx-color-on-success-muted'])
    expect(ratio(onMutedLight, '#bce0bb')).toBeGreaterThanOrEqual(4.5)

    expect(derived['--astryx-color-icon-success']).toBe('var(--astryx-color-text-success)')
    expect(derived['--astryx-color-border-success']).toBe('var(--astryx-color-text-success)')
    // Fills are never derived, and other statuses are left alone.
    expect(derived['--astryx-color-success']).toBeUndefined()
    expect(Object.keys(derived).some(name => /info|warning|error/.test(name))).toBe(false)
  })

  it('picks dark content on a light fill and light content on a dark fill', () => {
    const light = deriveStatusRoleTokens({ '--astryx-color-warning': '#ffe066' })
    const dark = deriveStatusRoleTokens({ '--astryx-color-error': '#7a0010' })
    expect(stops(light['--astryx-color-on-warning'])[0]).toBe('#111111')
    expect(stops(dark['--astryx-color-on-error'])[0]).toBe('#FFFFFF')
  })

  it('never replaces a role the theme sets', () => {
    const derived = deriveStatusRoleTokens({
      '--astryx-color-error': '#b00020',
      '--astryx-color-text-error': '#990000',
      '--astryx-color-icon-error': '#660000',
    })
    expect(derived['--astryx-color-text-error']).toBeUndefined()
    expect(derived['--astryx-color-icon-error']).toBeUndefined()
    expect(derived['--astryx-color-border-error']).toBe('var(--astryx-color-text-error)')
    expect(derived['--astryx-color-on-error']).toBeDefined()
  })

  it('recomputes text roles against a theme surface', () => {
    const derived = deriveStatusRoleTokens({ '--astryx-color-background-surface': 'light-dark(#fff8e7, #3a3a3a)' })
    for (const status of ['info', 'success', 'warning', 'error']) {
      const [light, dark] = stops(derived[`--astryx-color-text-${status}`])
      expect(ratio(light, '#fff8e7')).toBeGreaterThanOrEqual(4.5)
      expect(ratio(dark, '#3a3a3a')).toBeGreaterThanOrEqual(4.5)
      // A surface does not change content on the fill.
      expect(derived[`--astryx-color-on-${status}`]).toBeUndefined()
    }
  })

  it('follows var() and light-dark() through the theme tokens', () => {
    const derived = deriveStatusRoleTokens({
      '--astryx-brand-green': 'light-dark(#0b7a3b, #4ade80)',
      '--astryx-color-success': 'var(--astryx-brand-green)',
    })
    const [onLight, onDark] = stops(derived['--astryx-color-on-success'])
    expect(ratio(onLight, '#0b7a3b')).toBeGreaterThanOrEqual(4.5)
    expect(ratio(onDark, '#4ade80')).toBeGreaterThanOrEqual(4.5)
  })

  it('leaves a status alone when a measured color is not concrete', () => {
    expect(deriveStatusRoleTokens({ '--astryx-color-info': 'oklch(60% 0.2 250)' })).toEqual({})
  })

  it('derives nothing for a theme that changes no status input', () => {
    expect(deriveStatusRoleTokens({ '--astryx-color-accent': '#7c3aed' })).toEqual({})
  })
})

describe('defineTheme status roles', () => {
  it('writes the derived roles and the component tokens that follow them', () => {
    const theme = defineTheme({ name: 'brand', tokens: { '--color-success': '#16a34a' } })
    expect(theme.tokens['--astryx-color-on-success']).toMatch(/^light-dark\(/)
    expect(theme.derivedTokens).toContain('--astryx-color-text-success')
    expect(theme.css).toContain('--astryx-color-text-success: light-dark(')
    expect(theme.css).toContain('--astryx-badge-success-background: #16a34a')
    expect(theme.css).toContain('--astryx-icon-success-foreground: var(--astryx-color-text-success)')
    expect(theme.css).toContain('--astryx-input-success: var(--astryx-color-text-success)')
  })

  it('derives again for a child that changes a fill its base derived from', () => {
    const base = defineTheme({ name: 'base', tokens: { '--color-error': '#ffb4ab' } })
    const child = defineTheme({ name: 'child', extends: base, tokens: { '--color-error': '#7a0010' } })
    expect(stops(base.tokens['--astryx-color-on-error'])[0]).toBe('#111111')
    expect(stops(child.tokens['--astryx-color-on-error'])[0]).toBe('#FFFFFF')
  })

  it('keeps a child role the theme sets over the base derivation', () => {
    const base = defineTheme({ name: 'base', tokens: { '--color-error': '#7a0010' } })
    const child = defineTheme({ name: 'child', extends: base, tokens: { '--color-text-error': '#990000' } })
    expect(child.tokens['--astryx-color-text-error']).toBe('#990000')
    expect(child.derivedTokens).not.toContain('--astryx-color-text-error')
  })
})
