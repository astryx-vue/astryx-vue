/**
 * The own-fill rule for a striped table's painted rows only applies to a
 * striped table: a plain table's rows keep the text around them instead of
 * resetting it to the theme's own text.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = join(process.cwd(), 'packages/themes')

describe.each(['butter', 'gothic', 'y2k'])('%s own-fill striped rows', (theme) => {
  const css = readFileSync(join(root, theme, 'own-fill.css'), 'utf8')

  it('scopes the painted-row rule to a striped table', () => {
    expect(css).toContain(`[data-astryx-theme='${theme}'] .astryx-table[data-striped='true'] tbody tr:nth-child(even of :not([data-expansion-panel]))`)
  })

  it('has no painted-row rule that reaches a plain table', () => {
    expect(css).not.toContain('.astryx-table tbody tr:nth-child(even')
  })
})
