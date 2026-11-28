// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/number-input.css'), 'utf8')

describe('number input styles', () => {
  it('hides the compact steppers on coarse pointers, after the rule that shows them', () => {
    const shown = css.indexOf('.astryx-number-input-buttons {\n    display: flex;')
    const hidden = css.search(/@media \(pointer: coarse\) \{\s*\.astryx-number-input-buttons \{\s*display: none;/)
    expect(shown).toBeGreaterThan(-1)
    expect(hidden).toBeGreaterThan(shown)
  })

  it('shows the focus look at once under a coarse pointer', () => {
    expect(css).toMatch(/@media \(pointer: coarse\) \{[^}]*\.astryx-number-input \{\s*transition-duration: 0s;/)
  })

  it('keeps a focused disabled field visible, also under forced colors', () => {
    expect(css).toContain('.astryx-number-input[data-disabled=\'true\']:has(.astryx-number-input-field:focus-visible)')
    expect(css).toMatch(/forced-colors: active\) \{[\s\S]*data-disabled='true'\]:has\(\.astryx-number-input-field:focus-visible\) \{\s*border-color: Highlight;/)
  })
})
