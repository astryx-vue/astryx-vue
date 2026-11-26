// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { DERIVED_VARS } from '../Theme/derivedVars.js'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/table.css'), 'utf8')

function rule(selector: string): string {
  const start = css.indexOf(`${selector} {`)
  expect(start, selector).toBeGreaterThanOrEqual(0)
  return css.slice(start, css.indexOf('}', start))
}

describe('table stylesheet', () => {
  it('lets a data-driven heading wrap under wrap, and keeps it on one line under truncate', () => {
    expect(rule('.astryx-table th')).not.toMatch(/white-space:\s*nowrap/)
    expect(rule('.astryx-table[data-layout=\'fixed\'][data-overflow=\'wrap\'] th')).toMatch(/white-space:\s*normal/)
    expect(rule('.astryx-table[data-overflow=\'truncate\'] th')).toMatch(/white-space:\s*nowrap/)
  })

  it('sizes a children-mode table from its content instead of breaking words letter by letter', () => {
    expect(css).not.toMatch(/\.astryx-table\[data-overflow='wrap'\] td \{/)
    const children = rule('.astryx-table:not([data-layout=\'fixed\'])[data-overflow=\'wrap\'] td')
    expect(children).not.toMatch(/max-width/)
    expect(children).not.toMatch(/word-break/)
    expect(rule('.astryx-table:not([data-layout=\'fixed\']) th')).toMatch(/white-space:\s*nowrap/)
  })

  it('truncates the header label before the sort indicator', () => {
    expect(rule('.astryx-table__header-label')).toMatch(/min-width:\s*0[\s\S]*text-overflow:\s*ellipsis/)
  })

  it('draws a pinned cell\'s own row divider at the cell\'s divider width', () => {
    const pinned = rule('.astryx-table__sticky::before')
    expect(pinned).toMatch(/border-bottom-width:\s*var\(--_table-row-divider-width/)
    expect(pinned).toMatch(/border-bottom-color:\s*inherit/)
    expect(pinned).toMatch(/margin-bottom:\s*calc\(-1 \* var\(--_table-row-divider-width/)
    expect(css).toMatch(/tr:not\(:last-child\) > td \{\s*--_table-row-divider-width:/)
  })

  it('paints a muted panel on its cell, not on its row', () => {
    expect(css).not.toMatch(/\.astryx-table__panel-row\[data-variant='muted'\] \{/)
    expect(rule('.astryx-table__panel-row[data-variant=\'muted\'] > .astryx-table__panel')).toMatch(/background/)
  })

  it('draws the shared focus ring on the scroll region and the tree toggles', () => {
    expect(rule('.astryx-table-scroll:focus-visible')).toMatch(/outline:\s*var\(--astryx-focus-outline-width/)
    expect(css).toMatch(/\.astryx-table__expander:not\(\.astryx-table__expander--column\):focus-visible \{\s*outline:/)
  })

  it('fades a hidden edge only under a coarse pointer', () => {
    expect(css).toMatch(/@media \(pointer: coarse\) \{\s*\.astryx-table-scroll\[data-scrollable-inline='true'\]:not\(:focus-visible\) \{\s*mask-image:/)
  })

  it('lets a theme\'s table-row background reach a pinned column', () => {
    expect(DERIVED_VARS['table-row']).toEqual([{ property: 'backgroundColor', vars: ['--table-row-overlay'] }])
  })
})
