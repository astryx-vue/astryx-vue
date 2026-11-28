import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DialogHeader from './DialogHeader.vue'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/dialog-header.css'), 'utf8')

describe('dialog header row', () => {
  it('lets the row take the most negative slot offset, so a painted bar contains its title', () => {
    expect(css).toContain('--_dialog-header-row-offset: min(var(--_dialog-header-title-offset), var(--_dialog-header-end-offset), 0px)')
    expect(css).toMatch(/\.astryx-dialog-header \{[^}]*margin-block: var\(--_dialog-header-row-offset\)/)
    expect(css).toMatch(/\.astryx-dialog-header__title-block \{[^}]*margin-block: calc\(var\(--_dialog-header-title-offset\) - var\(--_dialog-header-row-offset\)\)/)
    expect(css).toMatch(/\.astryx-dialog-header-end-content \{[^}]*calc\(var\(--_dialog-header-end-offset\) - var\(--_dialog-header-row-offset\)\)/)
  })

  it('marks the row when the end actions bleed over its block edge', () => {
    const withClose = mount(DialogHeader, { props: { title: 'Title', hasCloseButton: true } })
    expect(withClose.classes()).toContain('astryx-dialog-header--compensate-end-block')

    const titleOnly = mount(DialogHeader, { props: { title: 'Title', hasCloseButton: false } })
    expect(titleOnly.classes()).not.toContain('astryx-dialog-header--compensate-end-block')
  })
})
