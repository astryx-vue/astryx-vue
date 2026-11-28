/**
 * The mouse picker column fades its rows by colour, not opacity: the centre row
 * is the primary text colour and the ends stop halfway to the secondary text
 * colour (a `color-mix(in oklab, …)` of the two). That ends colour reads at
 * 4.5:1 over the popover and page surfaces in every shipped theme, in both
 * modes. Values come from the shipped stylesheets.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { contrastRatio, parseColor } from '../core/src/Theme/contrast.js'

const root = process.cwd()
const THEMES = ['butter', 'chocolate', 'gothic', 'matcha', 'neutral', 'stone', 'y2k'] as const
const SURFACES = ['--astryx-color-background-popover', '--astryx-color-background-surface'] as const

function token(sheet: string, name: string): [string, string] {
  const raw = [...sheet.matchAll(new RegExp(`${name}:\\s*([^;]+);`, 'g'))].at(-1)?.[1]?.trim()
  if (raw === undefined)
    throw new Error(`${name} is not set`)
  const wrapped = /^light-dark\((#[\da-f]{6}),\s*(#[\da-f]{6})\)$/i.exec(raw)
  if (wrapped)
    return [wrapped[1]!, wrapped[2]!]
  if (/^#[\da-f]{6}$/i.test(raw))
    return [raw, raw]
  throw new Error(`${name}: cannot read ${raw}`)
}

function toLinear(channel: number): number {
  const value = channel / 255
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

function fromLinear(channel: number): number {
  const value = channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055
  return Math.round(Math.min(255, Math.max(0, value * 255)))
}

function toOklab(hex: string): [number, number, number] {
  const c = parseColor(hex)!
  const [r, g, b] = [toLinear(c.r), toLinear(c.g), toLinear(c.b)]
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

function fromOklab([L, a, b]: [number, number, number]): string {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(fromLinear)
  return `#${rgb.map(channel => channel.toString(16).padStart(2, '0')).join('')}`
}

/** `color-mix(in oklab, a, b)`: the midpoint in Oklab. */
function mix(a: string, b: string): string {
  const [x, y] = [toOklab(a), toOklab(b)]
  return fromOklab([(x[0] + y[0]) / 2, (x[1] + y[1]) / 2, (x[2] + y[2]) / 2])
}

describe.each(THEMES)('%s picker column fade colour', (theme) => {
  const sheet = readFileSync(join(root, 'packages/themes', theme, 'base.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  const primary = token(sheet, '--astryx-color-text-primary')
  const secondary = token(sheet, '--astryx-color-text-secondary')

  for (const [index, mode] of (['light', 'dark'] as const).entries()) {
    for (const surface of SURFACES) {
      it(`reads at 4.5:1 over ${surface.replace('--astryx-color-background-', '')} in ${mode} mode`, () => {
        const ends = mix(primary[index]!, secondary[index]!)
        const background = token(sheet, surface)[index]!
        expect(contrastRatio(parseColor(ends)!, parseColor(background)!)).toBeGreaterThanOrEqual(4.5)
        expect(contrastRatio(parseColor(primary[index]!)!, parseColor(background)!)).toBeGreaterThanOrEqual(4.5)
      })
    }
  }
})
