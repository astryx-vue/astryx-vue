/**
 * Gothic draws accent text and icons in one light color. A media surface
 * redeclares the accent, and the text and icon accents must follow it: on a
 * light surface they take the dark `--astryx-color-on-light`, on a dark one
 * they keep the light `--astryx-color-on-dark`, each at 4.5:1 or more against
 * the surface.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { contrastRatio, parseColor } from '../core/src/Theme/contrast.js'

const root = process.cwd()
const base = readFileSync(join(root, 'packages/themes/gothic/base.css'), 'utf8')
const mediaAccent = readFileSync(join(root, 'packages/themes/gothic/media-accent.css'), 'utf8')
const mediaTheme = readFileSync(join(root, 'packages/core/styles/media-theme.css'), 'utf8')

function declared(sheet: string, name: string): string {
  const value = new RegExp(`${name}:\\s*([^;]+);`).exec(sheet)?.[1]
  if (value === undefined)
    throw new Error(`${name} is not declared`)
  return value.trim()
}

function color(value: string) {
  const parsed = parseColor(value)
  if (parsed === null)
    throw new Error(`cannot parse ${value}`)
  return parsed
}

describe('gothic accent text and icons on media surfaces', () => {
  it('follow the surface accent for text and icons, on both surfaces', () => {
    for (const mode of ['light', 'dark']) {
      expect(mediaAccent).toContain(`[data-astryx-theme='gothic'] [data-astryx-media='${mode}']`)
      expect(mediaAccent).toContain('--astryx-color-text-accent: var(--astryx-color-accent);')
      expect(mediaAccent).toContain('--astryx-color-icon-accent: var(--astryx-color-accent);')
    }
  })

  it('reach 4.5:1 on a light surface', () => {
    expect(declared(mediaTheme.slice(mediaTheme.indexOf('[data-astryx-media=\'light\']')), '--astryx-color-accent')).toBe('var(--astryx-color-on-light, #171717)')
    const accent = color(declared(base, '--astryx-color-on-light'))
    expect(contrastRatio(accent, color('#ffffff'))).toBeGreaterThanOrEqual(4.5)
  })

  it('reach 4.5:1 on a dark surface', () => {
    expect(declared(mediaTheme.slice(mediaTheme.indexOf('[data-astryx-media=\'dark\']')), '--astryx-color-accent')).toBe('var(--astryx-color-on-dark, #ffffff)')
    const accent = color(declared(base, '--astryx-color-on-dark'))
    expect(contrastRatio(accent, color(declared(base, '--astryx-color-background-surface')))).toBeGreaterThanOrEqual(4.5)
  })
})
