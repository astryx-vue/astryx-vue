/**
 * Spacing and data-color tokens across the shipped themes.
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

describe('data color tokens', () => {
  it('declare the same 56 values in every theme', () => {
    const reference = [...declarations('neutral')].filter(([name]) => name.startsWith('--astryx-color-data-'))
    expect(reference).toHaveLength(56)
    for (const theme of ALL_THEMES) {
      const declared = declarations(theme)
      for (const [name, value] of reference)
        expect(declared.get(name), `${theme} ${name}`).toBe(value)
    }
  })
})
