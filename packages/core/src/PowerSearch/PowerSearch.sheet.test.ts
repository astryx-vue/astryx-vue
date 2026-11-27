import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { installMatchMedia } from '../composables/testing/fakeMatchMedia.js'
import {
  buttonByText,
  click,
  combobox,
  confirmation,
  nameFilter,
  openDialogs,
  openSheet,
  phone,
  pickField,
  renderPowerSearch,
  settle,
  step,
  trigger,
} from './sheetTestUtils.js'

enableAutoUnmount(afterEach)

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/power-search-sheet.css'), 'utf8')
const rule = (selector: string) => css.slice(css.indexOf(`${selector} {`), css.indexOf('}', css.indexOf(`${selector} {`)))

describe('power search presentation', () => {
  it('defaults to adaptive: a sheet trigger on a compact touch screen', () => {
    phone()
    renderPowerSearch()
    expect(combobox()).toBeNull()
    expect(trigger().getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
  })

  it('keeps the inline combobox on a desktop and wherever popover is pinned', () => {
    installMatchMedia(() => false)
    renderPowerSearch()
    expect(combobox()).not.toBeNull()
    document.body.innerHTML = ''

    phone()
    renderPowerSearch({ props: { presentation: 'popover' } })
    expect(combobox()).not.toBeNull()
    expect(document.querySelector('.astryx-power-search-sheet-trigger')).toBeNull()
  })

  it('names the trigger by the label and everything shown in the field', () => {
    phone()
    renderPowerSearch({ filters: [nameFilter('ada')] })
    const [labelId, contentId] = trigger().getAttribute('aria-labelledby')!.split(' ')
    expect(document.getElementById(labelId!)?.textContent).toContain('Search people')
    expect(document.getElementById(contentId!)?.textContent).toContain('ada')
    // 字段里的标签只展示，整个框只有触发器一个 Tab 停靠点。
    expect(document.querySelectorAll('.astryx-power-search-sheet-field button:not(.astryx-power-search-sheet-trigger)')).toHaveLength(0)
  })

  it('ends a long placeholder in an ellipsis on one line', () => {
    phone()
    renderPowerSearch({ props: { placeholder: 'Search by name, role, team or the date someone joined' } })
    expect(trigger().querySelector('.astryx-power-search-sheet-trigger__placeholder')?.textContent).toContain('Search by name')
    const placeholder = rule('.astryx-power-search-sheet-trigger__placeholder')
    expect(placeholder).toContain('text-overflow: ellipsis')
    expect(placeholder).toContain('white-space: nowrap')
  })

  it('leaves the grab bar band to the sheet, and lifts only the scrolling value header into it', async () => {
    // BottomSheet 自己在抓手下面留出 24px，标题不再补第二段。
    expect(rule('.astryx-power-search-sheet__header')).toContain('padding: 0 var(--astryx-spacing-4, 16px)')
    const lifted = rule('.astryx-power-search-sheet__header--scrolls-to-top')
    expect(lifted).toContain('margin-block-start: calc(-1 * var(--astryx-spacing-6, 24px))')
    expect(lifted).toContain('padding-block-start: var(--astryx-spacing-6, 24px)')

    phone()
    renderPowerSearch({ filters: [nameFilter('ada')] })
    await openSheet()
    expect(step('manage')!.querySelector('.astryx-power-search-sheet__header--scrolls-to-top')).toBeNull()
    await click(step('manage')!.querySelector<HTMLElement>('[data-sheet-add]'))
    expect(step('fields')!.querySelector('.astryx-power-search-sheet__header--scrolls-to-top')).toBeNull()
    await pickField('role')
    expect(step('value')!.querySelector('.astryx-power-search-sheet__header--scrolls-to-top')).not.toBeNull()
  })

  it('warns once in development about props that have no surface in the sheet', () => {
    phone()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    renderPowerSearch({ props: { menuWidth: 320, overflow: 'unfocused-inline' } })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('`menuWidth`, `overflow`'))
  })
})

describe('power search sheet flow', () => {
  it('goes straight to the field list when there are no filters', async () => {
    phone()
    renderPowerSearch()
    await openSheet()
    expect(step('fields')).not.toBeNull()
    expect(step('fields')!.querySelector('[data-sheet-field="role"]')).not.toBeNull()
  })

  it('edits a draft and applies it in order on Done', async () => {
    phone()
    const { changes, filters } = renderPowerSearch({ filters: [nameFilter('ada')] })
    await openSheet()
    expect(step('manage')).not.toBeNull()

    await click(step('manage')!.querySelector<HTMLElement>('[data-sheet-add]'))
    await pickField('role')
    const radios = step('value')!.querySelectorAll<HTMLInputElement>('input[type="radio"]')
    expect([...radios].map(radio => radio.closest('label')?.textContent?.trim())).toEqual(['Engineer', 'Designer'])
    await click(radios[1])
    await click(step('value')!.querySelector<HTMLElement>('[data-sheet-save]'))

    await vi.waitFor(() => expect(step('manage')!.querySelectorAll('[data-sheet-filter]')).toHaveLength(2))
    expect(changes).toEqual([])

    await click(step('manage')!.querySelector<HTMLElement>('[data-sheet-filter="0"] [data-sheet-remove]'))
    expect(changes).toEqual([])

    await click(buttonByText(step('manage')!, 'Done'))
    expect(changes.map(([, type, index]) => [type, index])).toEqual([['add', 1], ['remove', 0]])
    expect(filters.value).toEqual([{ field: 'role', operator: 'is', value: { type: 'enum', value: 'designer' } }])
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
  })

  it('asks before discarding a changed draft and keeps the filters when discarded', async () => {
    phone()
    const { changes, filters } = renderPowerSearch({ filters: [nameFilter('ada'), nameFilter('bob')] })
    await openSheet()
    await click(step('manage')!.querySelector<HTMLElement>('[data-sheet-filter="0"] [data-sheet-remove]'))

    openDialogs()[0]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await settle()
    await vi.waitFor(() => expect(confirmation()).not.toBeNull())
    expect(confirmation()!.textContent).toContain('Discard changes?')

    await click(buttonByText(confirmation()!, 'Discard changes'))
    await vi.waitFor(() => expect(trigger().getAttribute('aria-expanded')).toBe('false'))
    expect(changes).toEqual([])
    expect(filters.value).toHaveLength(2)
  })

  it('closes an unchanged draft without asking', async () => {
    phone()
    renderPowerSearch({ filters: [nameFilter('ada')] })
    await openSheet()
    openDialogs()[0]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await settle()
    expect(confirmation()).toBeNull()
    await vi.waitFor(() => expect(trigger().getAttribute('aria-expanded')).toBe('false'))
  })

  it('reports nothing on Done when the field became read-only meanwhile', async () => {
    phone()
    const { changes, filters, readOnly } = renderPowerSearch({ filters: [nameFilter('ada')] })
    await openSheet()
    await click(step('manage')!.querySelector<HTMLElement>('[data-sheet-filter="0"] [data-sheet-remove]'))
    readOnly.value = true
    await settle()
    await click(buttonByText(step('manage')!, 'Done'))
    expect(changes).toEqual([])
    expect(filters.value).toHaveLength(1)
  })

  it('clears all after confirming and keeps read-only filters', async () => {
    phone()
    const locked = nameFilter('locked', { isReadOnly: true })
    const { changes, filters } = renderPowerSearch({ filters: [locked, nameFilter('ada')] })
    await openSheet()
    await click(step('manage')!.querySelector<HTMLElement>('[data-sheet-clear]'))
    await vi.waitFor(() => expect(confirmation()).not.toBeNull())
    await click(buttonByText(confirmation()!, 'Clear filters'))
    await vi.waitFor(() => expect(step('manage')!.querySelectorAll('[data-sheet-filter]')).toHaveLength(1))
    await click(buttonByText(step('manage')!, 'Done'))
    expect(changes).toHaveLength(1)
    expect(filters.value).toEqual([locked])
  })
})
