/**
 * Every enabled progress fill reaches 3:1 against the bar's track in both
 * modes (WCAG 2.2 non-text contrast). A theme that sets no fill of its own
 * falls through to core's roles: status fills take the status text roles and a
 * neutral fill takes the secondary text role.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { compositeOver, contrastRatio, parseColor } from '../core/src/Theme/contrast.js'

const root = join(process.cwd(), 'packages/themes')
const THEMES = ['butter', 'chocolate', 'gothic', 'matcha', 'neutral', 'stone', 'y2k'] as const

/** What core's progress-bar.css uses when a theme sets no fill token. */
const CORE_FILL: Record<string, string> = {
  accent: 'var(--astryx-color-accent)',
  success: 'var(--astryx-color-text-success)',
  warning: 'var(--astryx-color-text-warning)',
  error: 'var(--astryx-color-text-error)',
  neutral: 'var(--astryx-color-text-secondary)',
}

function declarations(theme: string): Map<string, string> {
  const map = new Map<string, string>()
  for (const file of ['base.css', 'progress-bar.css']) {
    const css = readFileSync(join(root, theme, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
    const tokens = css.slice(css.indexOf('@layer astryx.tokens'), css.includes('@layer astryx.overrides {') ? css.indexOf('@layer astryx.overrides {') : undefined)
    for (const [, name, value] of tokens.matchAll(/(--astryx-[\w-]+):\s*([^;\s][^;]*);/g))
      map.set(name!, value!.trim())
  }
  return map
}

function splitTop(value: string): string[] {
  const parts: string[] = []
  let depth = 0
  let start = 0
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === '(') {
      depth += 1
    }
    else if (value[index] === ')') {
      depth -= 1
    }
    else if (value[index] === ',' && depth === 0) {
      parts.push(value.slice(start, index).trim())
      start = index + 1
    }
  }
  parts.push(value.slice(start).trim())
  return parts
}

function resolve(tokens: Map<string, string>, expr: string, mode: 0 | 1): string {
  const value = expr.trim()
  const alias = /^var\((--astryx-[\w-]+)\)$/.exec(value)
  if (alias) {
    const next = tokens.get(alias[1]!)
    if (next === undefined)
      throw new Error(`${alias[1]} is not declared`)
    return resolve(tokens, next, mode)
  }
  const pair = /^light-dark\(([\s\S]*)\)$/.exec(value)
  if (pair)
    return resolve(tokens, splitTop(pair[1]!)[mode]!, mode)
  return value
}

function color(value: string) {
  const parsed = parseColor(value)
  if (parsed === null)
    throw new Error(`cannot parse ${value}`)
  return parsed
}

describe.each(THEMES)('%s progress fills', (theme) => {
  const tokens = declarations(theme)
  const variants = Object.keys(CORE_FILL)
  for (const variant of variants) {
    for (const [index, mode] of (['light', 'dark'] as const).entries()) {
      it(`${variant} reaches 3:1 on the track in ${mode} mode`, () => {
        const fill = tokens.get(`--astryx-progress-bar-${variant}-fill`)
          ?? (variant === 'accent' ? tokens.get('--astryx-progress-bar-fill-background') : undefined)
          ?? CORE_FILL[variant]!
        const page = color(resolve(tokens, 'var(--astryx-color-background-body)', index as 0 | 1))
        const track = compositeOver(color(resolve(tokens, 'var(--astryx-progress-bar-track-background)', index as 0 | 1)), page)
        const fillColor = compositeOver(color(resolve(tokens, fill, index as 0 | 1)), track)
        expect(contrastRatio(fillColor, track)).toBeGreaterThanOrEqual(3)
      })
    }
  }
})
