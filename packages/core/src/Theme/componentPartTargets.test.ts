/**
 * Parts that paint inside a component carry a theme target of their own, so
 * `defineTheme({ components })` can reach them.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import AlertDialog from '../AlertDialog/AlertDialog.vue'
import BottomSheet from '../BottomSheet/BottomSheet.vue'
import Calendar from '../Calendar/Calendar.vue'
import Card from '../Card/Card.vue'
import Dialog from '../Dialog/Dialog.vue'
import Kbd from '../Kbd/Kbd.vue'
import LayoutFooter from '../Layout/LayoutFooter.vue'
import LayoutHeader from '../Layout/LayoutHeader.vue'
import ToggleButton from '../ToggleButton/ToggleButton.vue'
import ToggleButtonGroup from '../ToggleButton/ToggleButtonGroup.vue'
import { targetSelectors } from './componentStyles.js'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('component part theme targets', () => {
  it('kbd-key is on every key badge', () => {
    const wrapper = mount(Kbd, { props: { keys: 'mod+k' } })
    expect(wrapper.findAll('kbd.astryx-kbd-key')).toHaveLength(2)
  })

  it('calendar-range is on the committed band, with start and end on its edges', () => {
    const wrapper = mount(Calendar, {
      props: {
        mode: 'range',
        focusDate: new Date(2026, 0, 1),
        range: { start: new Date(2026, 0, 13), end: new Date(2026, 0, 15) },
      },
    })
    const band = wrapper.findAll('.astryx-calendar-range')
    expect(band.map(cell => cell.attributes('data-date'))).toEqual(['2026-01-14'])
    expect(band[0]!.attributes('data-start')).toBe('start')
    expect(band[0]!.attributes('data-end')).toBe('end')
    expect(wrapper.find('.astryx-calendar-range-preview').exists()).toBe(false)
  })

  it('calendar-range-preview is on the hover band while a range is pending', async () => {
    const wrapper = mount(Calendar, {
      props: { 'mode': 'range', 'focusDate': new Date(2026, 0, 1), 'range': null, 'onUpdate:range': () => {} },
    })
    await wrapper.get('[data-date="2026-01-10"]').trigger('click')
    await wrapper.get('[data-date="2026-01-13"]').trigger('mouseenter')
    await nextTick()
    expect(wrapper.findAll('.astryx-calendar-range-preview').length).toBeGreaterThan(0)
    expect(wrapper.find('.astryx-calendar-range').exists()).toBe(false)
  })

  it('bottom-sheet-handle is on the grab bar', async () => {
    mount(BottomSheet, { attachTo: document.body, props: { isOpen: true, label: 'Sheet' }, slots: { default: () => h('p', 'Body') } })
    await nextTick()
    expect(document.querySelector('.astryx-bottom-sheet-handle')).not.toBeNull()
  })

  it('alert-dialog-title and alert-dialog-description are on the title and description', async () => {
    mount(AlertDialog, {
      attachTo: document.body,
      props: { isOpen: true, title: 'Delete?', description: 'This cannot be undone.', actionLabel: 'Delete' },
    })
    await nextTick()
    expect(document.querySelector('.astryx-alert-dialog-title')?.textContent).toContain('Delete?')
    expect(document.querySelector('.astryx-alert-dialog-description')?.textContent).toContain('cannot be undone')
  })

  it('toggle-button reflects grouped inside a ToggleButtonGroup only', () => {
    const lone = mount(ToggleButton, { props: { label: 'Bold' } })
    expect(lone.get('button').attributes('data-grouped')).toBeUndefined()
    const group = mount(ToggleButtonGroup, {
      props: { label: 'View', value: 'list' },
      slots: { default: () => [h(ToggleButton, { label: 'List', value: 'list' })] },
    })
    expect(group.get('button').attributes('data-grouped')).toBe('grouped')
  })

  it('a theme reaches a grouped toggle button through its grouped state', () => {
    expect(targetSelectors('toggle-button', 'grouped')).toContain('.astryx-toggle-button[data-grouped="grouped"]')
  })
})

describe('layout header and footer reflect their container', () => {
  it('is card inside a Card, and absent outside any container', () => {
    const inCard = mount(Card, { slots: { default: () => [h(LayoutHeader), h(LayoutFooter)] } })
    expect(inCard.get('.astryx-layout-header').attributes('data-container')).toBe('card')
    expect(inCard.get('.astryx-layout-footer').attributes('data-container')).toBe('card')
    const bare = mount(LayoutHeader)
    expect(bare.attributes('data-container')).toBeUndefined()
  })

  it('is dialog inside a Dialog, even when the Dialog sits in a Card', async () => {
    mount(Card, {
      attachTo: document.body,
      slots: { default: () => h(Dialog, { isOpen: true, purpose: 'required' }, { default: () => h(LayoutHeader) }) },
    })
    await nextTick()
    expect(document.querySelector('.astryx-dialog .astryx-layout-header')?.getAttribute('data-container')).toBe('dialog')
  })

  it('is bottom-sheet inside a BottomSheet', async () => {
    mount(BottomSheet, { attachTo: document.body, props: { isOpen: true, label: 'Sheet' }, slots: { default: () => h(LayoutHeader) } })
    await nextTick()
    expect(document.querySelector('.astryx-bottom-sheet .astryx-layout-header')?.getAttribute('data-container')).toBe('bottom-sheet')
  })
})

describe('typeahead-popup and the link hover color', () => {
  const core = resolve(process.cwd(), 'packages/core')

  it('typeahead-popup is on the result popup', () => {
    const source = readFileSync(resolve(core, 'src/Typeahead/BaseTypeahead.vue'), 'utf8')
    expect(source).toMatch(/class="astryx-typeahead-listbox astryx-typeahead-popup/)
  })

  it('an accent link takes --link-hover-color on hover', () => {
    const css = readFileSync(resolve(core, 'styles/link.css'), 'utf8')
    expect(css).toContain('var(--astryx-link-hover-color, var(--astryx-link-accent-foreground')
  })

  it('accent-painted text reads the text accent role', () => {
    const table = readFileSync(resolve(core, 'styles/table.css'), 'utf8')
    const metadata = readFileSync(resolve(core, 'styles/metadata-list.css'), 'utf8')
    expect(table).toMatch(/\.astryx-table__sort-rank \{\s*color: var\(--astryx-color-text-accent/)
    expect(metadata).toMatch(/\.astryx-metadata-list__toggle \{[^}]*color: var\(--astryx-color-text-accent/)
  })
})
