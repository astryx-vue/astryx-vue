/**
 * Secondary text on the translucent neutral fill (an unselected
 * SegmentedControl label, AvatarGroup's overflow count) lifts the page under
 * it. Neutral's defaults are measured on the composited fill and must reach
 * 4.5:1 in both modes over the surface, card and body backgrounds.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { compositeOver, contrastRatio, parseColor } from '../core/src/Theme/contrast.js'

const css = readFileSync(join(process.cwd(), 'packages/themes/neutral/base.css'), 'utf8')

/** The light and dark stops of a `light-dark(a, b)` token declared in Neutral's base. */
function stops(token: string): [string, string] {
  const match = new RegExp(`${token}:\\s*light-dark\\(\\s*([^,]+),\\s*([^)]+)\\)`).exec(css)
  if (match === null)
    throw new Error(`${token} is not a light-dark() token in neutral/base.css`)
  return [match[1]!.trim(), match[2]!.trim()]
}

const pages = ['--astryx-color-background-surface', '--astryx-color-background-card', '--astryx-color-background-body'] as const

describe('neutral secondary text on the neutral fill', () => {
  for (const [index, mode] of (['light', 'dark'] as const).entries()) {
    for (const page of pages) {
      it(`meets 4.5:1 in the ${mode} theme over ${page}`, () => {
        const fill = parseColor(stops('--astryx-color-neutral')[index]!)
        const backdrop = parseColor(stops(page)[index]!)
        const text = parseColor(stops('--astryx-color-text-secondary')[index]!)
        if (fill === null || backdrop === null || text === null)
          throw new Error('Neutral colors must parse')
        expect(contrastRatio(text, compositeOver(fill, backdrop))).toBeGreaterThanOrEqual(4.5)
      })
    }
  }
})
