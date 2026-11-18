/**
 * Six theme palettes' parity with upstream v0.7.1.
 *
 * Expected values come from upstream `packages/themes/<name>/src/<name>Theme.ts`,
 * not from our own stylesheets. Each theme is checked the same way, so the table
 * below is the single place that carries the upstream numbers. Values are read
 * after following the `var()` chain, so a token that points at another token is
 * compared by its final color.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseCustomProperties } from '../../apps/docs/components/theme-tokens/parseTokens'

const root = process.cwd()
const THEMES = ['butter', 'chocolate', 'gothic', 'matcha', 'stone', 'y2k'] as const

type Theme = (typeof THEMES)[number]
type Stops = [string, string]

/** Remove a block starting at `start`, matching braces, so `@layer`/`@media` scopes stay out. */
function removeBlock(css: string, start: number): string {
  let depth = 0
  for (let index = css.indexOf('{', start); index < css.length; index += 1) {
    if (css[index] === '{') {
      depth += 1
    }
    else if (css[index] === '}') {
      depth -= 1
      if (depth === 0)
        return css.slice(0, start) + css.slice(index + 1)
    }
  }
  return css
}

/**
 * Root declarations only: `astryx.overrides` blocks scope their tokens per
 * element, and the touch type pin lives inside a media query, so neither is a
 * root value.
 */
function rootDeclarations(theme: Theme): Map<string, string> {
  const dir = join(root, 'packages/themes', theme)
  const declared = new Map<string, string>()
  for (const file of readdirSync(dir).filter(name => name.endsWith('.css')).sort()) {
    if (file === 'mobile-type.css')
      continue
    let css = readFileSync(join(dir, file), 'utf8')
    for (const marker of ['@layer astryx.overrides {', '@media']) {
      let index = css.indexOf(marker)
      while (index >= 0) {
        css = removeBlock(css, index)
        index = css.indexOf(marker)
      }
    }
    for (const property of parseCustomProperties(css))
      declared.set(property.name, property.value)
  }
  return declared
}

const declared = new Map(THEMES.map(theme => [theme, rootDeclarations(theme)]))

function resolve(theme: Theme, value: string): string {
  const map = declared.get(theme) ?? new Map<string, string>()
  let current = value
  for (let round = 0; round < 10; round += 1) {
    const match = /var\(\s*(--astryx-[a-z0-9-]+)\s*\)/.exec(current)
    if (!match)
      return current
    const target = map.get(match[1] ?? '')
    if (target === undefined)
      return current
    current = current.replace(match[0], target)
  }
  return current
}

/** Both stops of a token, with the var() chain followed and light-dark() split. */
function stops(theme: Theme, name: string): Stops {
  const value = resolve(theme, declared.get(theme)?.get(name) ?? '')
  const open = 'light-dark('.length
  if (!value.startsWith('light-dark(') || !value.endsWith(')'))
    return [value, value]
  const body = value.slice(open, -1)
  let depth = 0
  for (let index = 0; index < body.length; index += 1) {
    if (body[index] === '(')
      depth += 1
    else if (body[index] === ')')
      depth -= 1
    else if (body[index] === ',' && depth === 0)
      return [body.slice(0, index).trim(), body.slice(index + 1).trim()]
  }
  return [value, value]
}

const lightDark = (light: string, dark: string): Stops => [light, dark]

/** Hex case is not a difference; compare colors as lowercase. */
const same = (value: Stops): Stops => value.map(part => part.toLowerCase()) as Stops

/** Semantic colors as upstream writes them, light stop first. */
const SEMANTIC: Record<Theme, Record<string, Stops>> = {
  butter: {
    '--astryx-color-accent': lightDark('#225bff', '#fdee8c'),
    '--astryx-color-text-primary': lightDark('#1d1c11', '#f3f2e2'),
    '--astryx-color-text-secondary': lightDark('#605f52', '#adac9e'),
    '--astryx-color-border': lightDark('#e5e3d4', '#f3f2e21a'),
    '--astryx-color-success': lightDark('#004a05', '#83bc82'),
    '--astryx-color-error': lightDark('#821b00', '#ffc5b5'),
  },
  chocolate: {
    '--astryx-color-accent': lightDark('#8c5927', '#d4a06a'),
    '--astryx-color-text-primary': lightDark('#4a3520', '#ede4d4'),
    '--astryx-color-text-secondary': lightDark('#894d0e', '#c4a882'),
    '--astryx-color-border': lightDark('#c4ac95', '#ede4d41a'),
    '--astryx-color-success': lightDark('#709900', '#96bf2a'),
    '--astryx-color-error': lightDark('#fd0000', '#ff5c5c'),
  },
  gothic: {
    '--astryx-color-accent': lightDark('#e8f1f6', '#e8f1f6'),
    '--astryx-color-text-primary': lightDark('#e8f1f6', '#e8f1f6'),
    '--astryx-color-text-secondary': lightDark('#96a0ab', '#96a0ab'),
    '--astryx-color-border': lightDark('#e8f1f61a', '#e8f1f61a'),
    '--astryx-color-success': lightDark('#b3c79a', '#b3c79a'),
    '--astryx-color-error': lightDark('#c6a6a2', '#c6a6a2'),
  },
  matcha: {
    '--astryx-color-accent': lightDark('#3e481d', '#c0cba9'),
    '--astryx-color-text-primary': lightDark('#3e481d', '#c0cba9'),
    '--astryx-color-text-secondary': lightDark('#5a6b2a', '#a8bf6a'),
    '--astryx-color-border': lightDark('#dce3ce', '#c0cba91a'),
    '--astryx-color-success': lightDark('#4d9900', '#6dbf2a'),
    '--astryx-color-error': lightDark('#fd0000', '#ff5c5c'),
  },
  stone: {
    '--astryx-color-accent': lightDark('#25252a', '#f0f0f9'),
    '--astryx-color-text-primary': lightDark('#25252a', '#f0f0f9'),
    '--astryx-color-text-secondary': lightDark('#5f5f64', '#ababb3'),
    '--astryx-color-border': lightDark('#e2e2e8', '#f0f0f91a'),
    '--astryx-color-success': lightDark('#354f31', '#b3d0af'),
    '--astryx-color-error': lightDark('#603c37', '#e0bdb8'),
  },
  y2k: {
    '--astryx-color-accent': lightDark('#2d241b', '#edeffc'),
    '--astryx-color-text-primary': lightDark('#2d241b', '#edeffc'),
    '--astryx-color-text-secondary': lightDark('#5a5146', '#a6acd6'),
    '--astryx-color-border': lightDark('#382e24', '#edeffc1a'),
    '--astryx-color-success': lightDark('#c5e17a', '#c5e17a'),
    '--astryx-color-error': lightDark('#ffc3c3', '#ffc3c3'),
  },
}

describe.each(THEMES)('%s theme', (theme) => {
  it('carries the upstream semantic colors', () => {
    for (const [name, want] of Object.entries(SEMANTIC[theme]))
      expect(same(stops(theme, name)), name).toEqual(same(want))
  })

  it('keeps the radius-none contract at a hard zero', () => {
    /* Every theme resolves to the same hard zero as upstream's generated rules. */
    expect(declared.get(theme)?.get('--astryx-radius-none')).toBe('0px')
  })
})

/** Component values upstream pins per theme, compared after the var() chain. */
const COMPONENTS: Array<[Theme, string, Stops]> = [
  ['butter', '--astryx-button-padding-block', ['0.75rem', '0.75rem']],
  ['butter', '--astryx-badge-height', ['30px', '30px']],
  ['chocolate', '--astryx-button-secondary-border-width', ['1px', '1px']],
  ['chocolate', '--astryx-card-padding', ['0.75rem', '0.75rem']],
  ['gothic', '--astryx-code-syntax-added', ['#071607', '#071607']],
  ['gothic', '--astryx-badge-radius', ['0.5rem', '0.5rem']],
  ['matcha', '--astryx-section-padding', ['1.125rem', '1.125rem']],
  ['stone', '--astryx-input-success', lightDark('#7f977e', '#99b298')],
  ['stone', '--astryx-progress-bar-accent-fill', lightDark('#d7e4f5', '#a0acbc')],
  ['y2k', '--astryx-badge-radius', ['9999px', '9999px']],
  ['y2k', '--astryx-badge-border-width', ['1.5px', '1.5px']],
  ['y2k', '--astryx-button-border-width', ['1px', '1px']],
]

describe('theme component values', () => {
  it.each(COMPONENTS)('%s sets %s like upstream', (theme, name, want) => {
    const got = stops(theme, name).map(part => resolve(theme, part))
    const resolvedWant = want.map(part => resolve(theme, part)) as Stops
    expect(same(got as Stops)).toEqual(same(resolvedWant))
  })
})

describe('theme touch type pin', () => {
  it('re-derives the ladder only for the themes upstream adapts', () => {
    const withPin = THEMES.filter((theme) => {
      const dir = join(root, 'packages/themes', theme)
      return readdirSync(dir).includes('mobile-type.css')
    })
    expect(withPin).toEqual(['butter', 'chocolate', 'stone'])
    for (const theme of withPin) {
      const css = readFileSync(join(root, 'packages/themes', theme, 'mobile-type.css'), 'utf8')
      expect(css, theme).toContain('@media (width < 1024px) and (pointer: coarse)')
      expect(css, theme).toContain('calc(1rem * var(--_dynamic-type-body, 1))')
    }
  })
})
