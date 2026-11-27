import { describe, expect, it } from 'vitest'
import { contrastRatio, parseColor } from '../Theme/contrast.js'
import { defineTheme } from '../Theme/defineTheme.js'
import { generateTonalPalette, PALETTE_RECIPE, PALETTE_RECIPES } from './generator'
import { themePalette } from './themePalette'

const HEX = /^#[0-9a-f]{6}(?:[0-9a-f]{2})?$/i

function ratio(foreground: string, background: string): number {
  return contrastRatio(parseColor(foreground)!, parseColor(background)!)
}

describe('themePalette', () => {
  it('maps an accent seed to the accent, its text, its tint and the content on it', () => {
    const palette = themePalette({ accent: '#5b3cc4' })
    expect(palette.kind).toBe('theme-palette')
    expect(palette.recipe).toBe(PALETTE_RECIPE)
    for (const token of ['--color-accent', '--color-on-accent', '--color-text-accent', '--color-icon-accent', '--color-accent-muted', '--focus-outline-color']) {
      const [light, dark] = palette.tokens[token]!
      expect(light, token).toMatch(HEX)
      expect(dark, token).toMatch(HEX)
    }
    // The light accent is the seed itself, and its content reads on it.
    expect(palette.tokens['--color-accent']![0]).toBe('#5b3cc4')
    expect(ratio(palette.tokens['--color-on-accent']![0], palette.tokens['--color-accent']![0])).toBeGreaterThanOrEqual(4.5)
    expect(ratio(palette.tokens['--color-on-accent']![1], palette.tokens['--color-accent']![1])).toBeGreaterThanOrEqual(4.5)
  })

  it('takes the surfaces, text and borders from a neutral seed, and status colors from theirs', () => {
    const palette = themePalette({ accent: '#5b3cc4', neutral: '#6b6b70', danger: '#d1242f', success: '#1a7f37' })
    for (const token of ['--color-background-surface', '--color-background-body', '--color-text-primary', '--color-text-secondary', '--color-border', '--color-error', '--color-on-error', '--color-text-error', '--color-success', '--color-on-success']) {
      expect(palette.tokens[token], token).toBeDefined()
    }
    expect(palette.tokens['--color-error']![0]).toBe('#d1242f')
    // Text on the page reads at 4.5:1 in both modes.
    expect(ratio(palette.tokens['--color-text-primary']![0], palette.tokens['--color-background-surface']![0])).toBeGreaterThanOrEqual(4.5)
    expect(ratio(palette.tokens['--color-text-primary']![1], palette.tokens['--color-background-surface']![1])).toBeGreaterThanOrEqual(4.5)
    expect(ratio(palette.tokens['--color-text-secondary']![0], palette.tokens['--color-background-surface']![0])).toBeGreaterThanOrEqual(4.5)
  })

  it('is deterministic, and a recipe changes the shades', () => {
    expect(themePalette({ accent: '#0074e2', neutral: '#6b6b70' })).toEqual(themePalette({ accent: '#0074e2', neutral: '#6b6b70' }))
    const v1 = themePalette({ accent: '#0074e2', neutral: '#6b6b70', recipe: 'astryx-oklch-v1' })
    const v2 = themePalette({ accent: '#0074e2', neutral: '#6b6b70', recipe: 'astryx-oklch-v2' })
    expect(v2.recipe).toBe('astryx-oklch-v2')
    expect(v1.tokens).not.toEqual(v2.tokens)
  })

  it('lifts secondary text on the accent tint, the neutral track and the colored cards', () => {
    const palette = themePalette({ accent: '#0074e2', neutral: '#6b6b70' })
    const lifted = palette.components.item!['selected:true']!
    expect(lifted['@light']['--color-text-secondary']).toMatch(HEX)
    expect(lifted['@dark']['--color-text-secondary']).toMatch(HEX)
    expect(palette.components['segmented-control-item']!.base!['@light']['--segmented-control-item-foreground']).toMatch(HEX)
    expect(palette.components.citation!['variant:number']!['@dark']['--citation-foreground']).toMatch(HEX)
    expect(palette.components['file-input']!['mode:dropzone']).toBeDefined()
    expect(Object.keys(palette.components.card!)).toContain('variant:blue')
  })

  it('refuses what is not a palette input', () => {
    expect(() => themePalette(null as never)).toThrow(/takes an object of seed colors/)
    expect(() => themePalette({} as never)).toThrow(/needs at least one seed color/)
    expect(() => themePalette({ accent: '#5b3cc4', hue: 3 } as never)).toThrow(/"hue" is not a palette key/)
    expect(() => themePalette({ accent: '#5b3cc4', recipe: 'v3' as never })).toThrow(/is not a palette recipe/)
    expect(() => themePalette({ accent: '#5b3cc4', vibrancy: 50.5 })).toThrow(/whole number from 0 to 100/)
    expect(() => themePalette({ accent: 'not-a-color' })).toThrow(/one opaque color/)
    expect(() => themePalette({ accent: '#5b3cc480' })).toThrow(/one opaque color/)
  })
})

describe('generateTonalPalette', () => {
  it('runs both recipes over a family request', () => {
    expect(PALETTE_RECIPES).toEqual(['astryx-oklch-v1', 'astryx-oklch-v2'])
    const candidate = generateTonalPalette({ families: [{ id: 'accent', seed: '#0074e2' }] })
    expect(Object.keys(candidate.palette.accent!.light!)).toHaveLength(21)
  })
})

describe('defineTheme({ palette })', () => {
  it('takes its color tokens from the palette, and explicit tokens still win', () => {
    const palette = themePalette({ accent: '#5b3cc4', neutral: '#6b6b70' })
    const theme = defineTheme({
      name: 'acme',
      palette,
      tokens: { '--color-on-accent': ['#ffffff', '#000000'] },
    })
    expect(theme.tokens['--astryx-color-accent']).toBe(`light-dark(${palette.tokens['--color-accent']![0]}, ${palette.tokens['--color-accent']![1]})`)
    expect(theme.tokens['--astryx-color-on-accent']).toBe('light-dark(#ffffff, #000000)')
  })

  it('writes the lifted secondary text as color-mode blocks, under the theme\'s own styles', () => {
    const palette = themePalette({ accent: '#0074e2', neutral: '#6b6b70' })
    const lift = palette.components.item!['selected:true']!['@dark']['--color-text-secondary']
    const plain = defineTheme({ name: 'lifted', palette })
    expect(plain.components?.item?.['selected:true']?.['@dark']).toEqual({ '--color-text-secondary': lift })
    expect(plain.css).toContain(`--astryx-color-text-secondary: ${lift};`)
    // A property the theme sets for both modes leaves the palette's blocks.
    const own = defineTheme({ name: 'lifted-own', palette, components: { item: { 'selected:true': { '--color-text-secondary': '#123456' } } } })
    expect(own.components?.item?.['selected:true']).toEqual({ '--color-text-secondary': '#123456' })
  })

  it('refuses a palette that themePalette did not make', () => {
    expect(() => defineTheme({ name: 'bad', palette: { accent: '#5b3cc4' } as never })).toThrow(/must be made by themePalette\(\)/)
    expect(() => defineTheme({ name: 'bad', palette: null as never })).toThrow(/got null/)
  })

  it('stays out of the way when no palette is given', () => {
    const theme = defineTheme({ name: 'no-palette', tokens: { '--color-accent': '#111111' } })
    expect(theme.tokens['--astryx-color-accent']).toBe('#111111')
  })
})
