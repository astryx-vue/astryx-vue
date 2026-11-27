import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(process.cwd(), 'packages/richtext/styles/richtext-document.css'), 'utf8')

describe('block direction styles', () => {
  it('reads the document direction where the surface sits, from :dir()', () => {
    expect(css).toContain('--_richtext-document-direction: ltr;')
    expect(css).toMatch(/:dir\(rtl\)[^{]*\{\s*--_richtext-document-direction: rtl;/)
  })

  it('lets a prose block with no direction of its own follow the document, and leaves a block that has one alone', () => {
    const rule = css.match(/\.astryx-richtext__paragraph:is\(\[dir='auto'\], :not\(\[dir\]\)\)[^{]*\{[^}]*\}/)![0]
    expect(rule).toContain('.astryx-richtext__list-item:is([dir=\'auto\'], :not([dir]))')
    expect(rule).toContain('direction: var(--_richtext-document-direction, inherit);')
  })

  it('makes containers take their parent\'s direction, and gives code lines their own', () => {
    const rule = css.match(/\.astryx-richtext__list,\s*\.astryx-richtext__code,[^{]*\{[^}]*\}/)![0]
    for (const name of ['table', 'table-wrap', 'table-row', 'table-cell', 'table-cell-header'])
      expect(rule).toContain(`.astryx-richtext__${name}`)
    expect(rule).toContain('direction: inherit;')
    expect(css).toMatch(/\.astryx-richtext__code \{\s*unicode-bidi: plaintext;/)
  })

  it('puts the list inset on the item, where an outside marker is drawn', () => {
    expect(css).toMatch(/\.astryx-richtext__list \{[^}]*padding-inline: 0;/)
    expect(css).toMatch(/\.astryx-richtext__list-item \{\s*margin-inline-start: var\(--astryx-spacing-6, 24px\);/)
  })
})
