// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const stylesDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../styles')
const textInput = readFileSync(resolve(stylesDir, 'text-input.css'), 'utf8')
const textArea = readFileSync(resolve(stylesDir, 'text-area.css'), 'utf8')

describe('text input styles', () => {
  it('takes the larger of the size and one bordered text line as its height, so larger text grows the row', () => {
    expect(textInput).toMatch(/height: max\(var\(--astryx-input-height-md, 32px\), var\(--astryx-text-input-line/)
    expect(textInput).toMatch(/--astryx-text-input-line: calc\(var\(--astryx-text-body-size, 14px\) \* var\(--astryx-text-body-leading, 1\.4286\) \+ 2 \* var\(--astryx-border-width, 1px\)\)/)
  })

  it('shows the focus look at once under a coarse pointer', () => {
    expect(textInput).toMatch(/@media \(pointer: coarse\) \{[^}]*\.astryx-text-input \{\s*transition-duration: 0s;/)
    expect(textArea).toMatch(/@media \(pointer: coarse\) \{[^}]*\.astryx-text-area \{\s*transition-duration: 0s;/)
  })

  it('keeps a focused disabled field visible, also under forced colors', () => {
    expect(textInput).toContain(':has(> [aria-disabled=\'true\']:focus-visible)')
    expect(textArea).toContain(':has(> [aria-disabled=\'true\']:focus-visible)')
    expect(textInput).toMatch(/forced-colors: active\) \{[\s\S]*:has\(> \[aria-disabled='true'\]:focus-visible\) \{\s*border-color: Highlight;/)
  })
})
