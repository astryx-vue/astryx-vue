/**
 * Spacing and data-color tokens shared by the shipped themes.
 *
 * Spacing steps are rem, so gaps and padding grow with the reader's root font
 * size the same way the rem type scale does. At the default 16px root every
 * step is still 4px times the step: --astryx-spacing-2 is 8px.
 *
 * Matcha and y2k declare their own denser or looser steps. Those stay as the
 * themes ship them; only the shared default ladder is checked here.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseCustomProperties } from '../../apps/docs/components/theme-tokens/parseTokens'

const root = process.cwd()

/** Upstream tokens.stylex.ts `spacingDefaults`, with the --astryx- prefix. */
const SPACING_DEFAULTS: Readonly<Record<string, string>> = {
  '--astryx-spacing-0': '0rem',
  '--astryx-spacing-0-5': '0.125rem',
  '--astryx-spacing-1': '0.25rem',
  '--astryx-spacing-1-5': '0.375rem',
  '--astryx-spacing-2': '0.5rem',
  '--astryx-spacing-3': '0.75rem',
  '--astryx-spacing-4': '1rem',
  '--astryx-spacing-5': '1.25rem',
  '--astryx-spacing-6': '1.5rem',
  '--astryx-spacing-7': '1.75rem',
  '--astryx-spacing-8': '2rem',
  '--astryx-spacing-9': '2.25rem',
  '--astryx-spacing-10': '2.5rem',
  '--astryx-spacing-11': '2.75rem',
  '--astryx-spacing-12': '3rem',
}

const SHARED_SCALE_THEMES = ['neutral', 'butter', 'chocolate', 'gothic', 'stone'] as const
const ALL_THEMES = [...SHARED_SCALE_THEMES, 'matcha', 'y2k'] as const

function declarations(theme: string): Map<string, string> {
  const css = readFileSync(join(root, `packages/themes/${theme}/base.css`), 'utf8')
  return new Map(parseCustomProperties(css).map(property => [property.name, property.value]))
}

function stepOf(name: string): number {
  return Number(name.replace('--astryx-spacing-', '').replace('-', '.'))
}

describe('spacing tokens', () => {
  it('match the upstream rem ladder in every theme that keeps the shared scale', () => {
    for (const theme of SHARED_SCALE_THEMES) {
      const declared = declarations(theme)
      for (const [name, value] of Object.entries(SPACING_DEFAULTS))
        expect(declared.get(name), `${theme} ${name}`).toBe(value)
    }
  })

  it('equal 4px times the step at the default 16px root', () => {
    for (const [name, value] of Object.entries(SPACING_DEFAULTS))
      expect(Number.parseFloat(value) * 16, name).toBe(stepOf(name) * 4)
  })

  it('never write a px length, so every theme follows the root font size', () => {
    for (const theme of ALL_THEMES) {
      for (const [name, value] of declarations(theme)) {
        if (name.startsWith('--astryx-spacing-'))
          expect(value, `${theme} ${name}`).toMatch(/^\d+(?:\.\d+)?rem$/)
      }
    }
  })
})

/** Upstream dataTokens.stylex.ts names, in its order. */
const DATA_TOKEN_NAMES = [
  ...['blue', 'orange', 'purple', 'green', 'pink', 'cyan', 'red', 'teal', 'brown', 'indigo'].map(name => `--astryx-color-data-categorical-${name}`),
  '--astryx-color-data-neutral',
  ...['blue', 'shamrock', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow', 'gray'].flatMap(hue =>
    [5, 4, 3, 2, 1].map(step => `--astryx-color-data-${hue}-${step}`),
  ),
]

describe('data color tokens', () => {
  const dataCss = readFileSync(join(root, 'packages/themes/data.css'), 'utf8')
  const declared = parseCustomProperties(dataCss)

  it('declare the complete upstream group once, on :root', () => {
    expect(DATA_TOKEN_NAMES).toHaveLength(56)
    expect(declared.map(property => property.name)).toEqual(DATA_TOKEN_NAMES)
    expect(dataCss).toContain(':root {')
    expect(dataCss).not.toContain('data-astryx-theme')
    const values = new Map(declared.map(property => [property.name, property.value]))
    expect(values.get('--astryx-color-data-categorical-blue')).toBe('light-dark(#0171E3, #0171E3)')
    expect(values.get('--astryx-color-data-neutral')).toBe('light-dark(#8494A3, #8C939B)')
    expect(values.get('--astryx-color-data-gray-5')).toBe('light-dark(#25363F, #333338)')
  })

  it('stay out of the per-theme stylesheets, so nested themes inherit them', () => {
    for (const theme of ALL_THEMES)
      expect([...declarations(theme).keys()].filter(name => name.startsWith('--astryx-color-data-')), theme).toEqual([])
  })

  it('reach every theme entry', () => {
    for (const theme of ALL_THEMES) {
      const entry = readFileSync(join(root, `packages/themes/${theme}.css`), 'utf8')
      expect(entry, theme).toContain('@import \'./data.css\';')
    }
  })
})
