/**
 * Secondary text on a coloured or muted card reads at 4.5:1 over the card's
 * fill, which is composited over the page, in both modes.
 *
 * A theme lifts the text with a rule on the card variant (`card-text.css`,
 * `card.css`); a variant without one keeps the theme's own secondary text.
 * Values are read from the shipped stylesheets, so a theme that regresses a
 * stop fails here.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { compositeOver, contrastRatio, parseColor } from '../core/src/Theme/contrast.js'

const root = join(process.cwd(), 'packages/themes')
const THEMES = ['butter', 'chocolate', 'gothic', 'matcha', 'neutral', 'stone', 'y2k'] as const
const VARIANTS = ['blue', 'cyan', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow', 'muted'] as const

function css(theme: string): string {
  const dir = join(root, theme)
  return readdirSync(dir)
    .filter(name => name.endsWith('.css'))
    .sort()
    .map(name => readFileSync(join(dir, name), 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''))
    .join('\n')
}

/** Split `a, b` at the top-level comma. */
function splitStops(value: string): [string, string] {
  let depth = 0
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === '(')
      depth += 1
    else if (value[index] === ')')
      depth -= 1
    else if (value[index] === ',' && depth === 0)
      return [value.slice(0, index).trim(), value.slice(index + 1).trim()]
  }
  return [value.trim(), value.trim()]
}

/** The two stops of the last matching declaration, following `var(--astryx-*)` aliases. */
function stopsOf(sheet: string, property: string, scope = ''): [string, string] | null {
  const opener = scope === '' ? '[^{}]*\\{' : `${scope}\\s*\\{`
  const pattern = new RegExp(`${opener}[^{}]*?${property}:\\s*([^;]+);`, 'g')
  // Later rules win, and the stylesheets are concatenated in cascade order.
  const raw = [...sheet.matchAll(pattern)].at(-1)?.[1]?.trim()
  if (raw === undefined)
    return null
  const alias = /^var\((--astryx-[\w-]+)\)$/.exec(raw)
  if (alias)
    return stopsOf(sheet, alias[1]!)
  const wrapped = /^light-dark\(([\s\S]*)\)$/.exec(raw)
  return wrapped ? splitStops(wrapped[1]!) : [raw, raw]
}

function color(value: string) {
  const parsed = parseColor(value)
  if (parsed === null)
    throw new Error(`cannot parse ${value}`)
  return parsed
}

describe.each(THEMES)('%s card secondary text', (theme) => {
  const sheet = css(theme)
  const baseSheet = readFileSync(join(root, theme, 'base.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

  describe.each(VARIANTS)('%s card', (variant) => {
    for (const [index, mode] of (['light', 'dark'] as const).entries()) {
      it(`meets 4.5:1 in ${mode} mode`, () => {
        const fillName = variant === 'muted' ? '--astryx-color-background-muted' : `--astryx-color-background-${variant}`
        const fill = stopsOf(baseSheet, fillName)
        const page = stopsOf(baseSheet, '--astryx-color-background-body')
        const lifted = stopsOf(sheet, '--astryx-color-text-secondary', `\\.astryx-card\\[data-variant='${variant}'\\]`)
        const text = lifted ?? stopsOf(baseSheet, '--astryx-color-text-secondary')
        if (fill === null || page === null || text === null)
          throw new Error(`${theme} ${variant}: missing token`)
        const backdrop = color(page[index]!)
        const surface = compositeOver(color(fill[index]!), backdrop)
        expect(contrastRatio(color(text[index]!), surface)).toBeGreaterThanOrEqual(4.5)
      })
    }
  })
})
