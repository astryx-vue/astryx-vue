/**
 * Neutral theme palette parity with upstream v0.7.1.
 *
 * Expected values come from upstream `packages/themes/neutral/src/neutralTheme.ts`
 * and the palette stops in `neutralPaletteRefs.generated.ts`, not from our own
 * stylesheets. Component values are read after following the `var()` chain, so a
 * component that points at a semantic token is compared by its final color.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseCustomProperties } from '../../apps/docs/components/theme-tokens/parseTokens'

const root = process.cwd()

function read(themeFile: string): string {
  return readFileSync(join(root, 'packages/themes/neutral', themeFile), 'utf8')
}

/** Root declarations only: `@layer astryx.overrides` blocks scope per element. */
function rootDeclarations(): Map<string, string> {
  const files = [
    'base.css',
    'local-tokens.css',
    'badge.css',
    'banner.css',
    'button.css',
    'card.css',
    'code.css',
    'heading.css',
    'progress-bar.css',
    'segmented-control.css',
    'section.css',
    'status-dot.css',
    'switch.css',
    'text.css',
  ]
  const declared = new Map<string, string>()
  for (const file of files) {
    const css = read(file).replace(/@layer astryx\.overrides \{[\s\S]*?\n\}\n/g, '')
    for (const property of parseCustomProperties(css))
      declared.set(property.name, property.value)
  }
  return declared
}

const declared = rootDeclarations()

function resolve(value: string): string {
  let current = value
  for (let round = 0; round < 10; round += 1) {
    const match = /var\(\s*(--astryx-[a-z0-9-]+)\s*\)/.exec(current)
    if (!match)
      return current
    const target = declared.get(match[1] ?? '')
    if (target === undefined)
      return current
    current = current.replace(match[0], target)
  }
  return current
}

/** Both stops of a token, with the var() chain followed and light-dark() split. */
function stops(name: string): [string, string] {
  const value = resolve(declared.get(name) ?? '')
  const match = /^light-dark\((.*),\s*([^,]*)\)$/.exec(value)
  if (!match)
    return [value, value]
  return [match[1] ?? '', match[2] ?? '']
}

function lightDark(light: string, dark: string): [string, string] {
  return [light, dark]
}

describe('neutral palette', () => {
  it('maps semantic colors to the reviewed palette stops', () => {
    const expected: Record<string, [string, string]> = {
      '--astryx-color-accent': lightDark('#1b1b1b', '#f1f1f1'),
      '--astryx-color-text-primary': lightDark('#000000', '#ffffff'),
      '--astryx-color-text-secondary': lightDark('#474747', '#9e9e9e'),
      '--astryx-color-text-accent': lightDark('#1b1b1b', '#f1f1f1'),
      '--astryx-color-icon-secondary': lightDark('#6a6a6a', '#9e9e9e'),
      '--astryx-color-border': lightDark('#00000014', '#ffffff1a'),
      '--astryx-color-success': lightDark('#00490b', '#a4d6a3'),
      '--astryx-color-error': lightDark('#76000c', '#ffc4be'),
      '--astryx-color-warning': lightDark('#4b3900', '#f8d36a'),
      '--astryx-color-background-gray': lightDark('#e2e2e2', '#303030'),
      '--astryx-color-text-blue': lightDark('#003978', '#a1caff'),
    }
    for (const [name, want] of Object.entries(expected))
      expect(stops(name), name).toEqual(want)
  })

  it('keeps radius and shadow tokens on the upstream values', () => {
    expect(declared.get('--astryx-radius-none')).toBe('0px')
    expect(declared.get('--astryx-shadow-inset-selected')).toBe('inset 0px 0px 0px 2px #0074e280')
    expect(declared.get('--astryx-shadow-inset-error')).toBe('inset 0px 0px 0px 2px #de47454d')
  })
})

describe('neutral theme-local status tokens', () => {
  it('carries the separately approved status fills', () => {
    expect(stops('--astryx-theme-neutral-color-status-fill-accent')).toEqual(lightDark('#0074e2', '#6d9cfe'))
    expect(stops('--astryx-theme-neutral-color-status-fill-success')).toEqual(lightDark('#198100', '#64af4c'))
    expect(stops('--astryx-theme-neutral-color-status-fill-warning')).toEqual(lightDark('#ffce2f', '#ffce2f'))
    expect(stops('--astryx-theme-neutral-color-status-fill-error')).toEqual(lightDark('#c9303a', '#ff705d'))
    expect(stops('--astryx-theme-neutral-color-status-muted-accent')).toEqual(lightDark('#b9d7ff', '#88bcff3d'))
  })

  it('resolves the badge status fills through those tokens', () => {
    expect(stops('--astryx-badge-info-background')).toEqual(lightDark('#0074e2', '#6d9cfe'))
    expect(stops('--astryx-badge-error-background')).toEqual(lightDark('#c9303a', '#ff705d'))
    expect(stops('--astryx-badge-error-foreground')).toEqual(lightDark('#ffffff', '#111111'))
    expect(stops('--astryx-badge-warning-foreground')).toEqual(lightDark('#111111', '#111111'))
  })
})

describe('neutral syntax palette', () => {
  it('gives punctuation its own AA-passing neutral stop', () => {
    const code = read('code.css')
    expect(code).toContain('--astryx-code-syntax-punctuation: light-dark(#6a6a6a, #9e9e9e);')
    expect(code).toContain('--astryx-code-syntax-comment: light-dark(#6a6a6a, #9e9e9e);')
    expect(code).toContain('--astryx-code-syntax-keyword: light-dark(#6b187c, #efa8ff);')
    expect(code).toContain('--astryx-code-block-background: light-dark(#ffffff, #111111);')
  })
})

describe('neutral touch type pin', () => {
  it('floors body to 16px below the lg breakpoint and keeps display-1 sized', () => {
    const css = read('mobile-type.css')
    expect(css).toContain('@media (width < 1024px) and (pointer: coarse)')
    expect(css).toContain('--astryx-font-size-base: 1rem;')
    expect(css).toContain('--astryx-font-size-lg: 1.1875rem;')
    expect(css).not.toContain('--astryx-font-size-5xl')
    expect(declared.get('--astryx-font-size-5xl')).toBe('2.625rem')
  })

  it('stays out of the root declarations so desktop sizes are untouched', () => {
    expect(declared.get('--astryx-font-size-base')).toBe('0.875rem')
    expect(declared.get('--astryx-text-heading-3-weight')).toBe('var(--astryx-font-weight-bold)')
  })
})
