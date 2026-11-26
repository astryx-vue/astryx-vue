import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { COMPACT_TOUCH, installMatchMedia } from '../composables/testing/fakeMatchMedia.js'
import ContextMenu from '../ContextMenu/ContextMenu.vue'
import DropdownMenu from '../DropdownMenu/DropdownMenu.vue'
import MoreMenu from '../MoreMenu/MoreMenu.vue'
import MultiSelector from '../MultiSelector/MultiSelector.vue'
import Selector from '../Selector/Selector.vue'

enableAutoUnmount(afterEach)

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

const options = [{ value: 'a', label: 'Apple' }, { value: 'b', label: 'Banana' }]

async function openDropdown(): Promise<void> {
  mount(DropdownMenu, {
    attachTo: document.body,
    props: { presentation: 'adaptive', button: { label: 'Actions' }, items: [{ label: 'Edit' }] },
  })
  document.querySelector<HTMLButtonElement>('.astryx-dropdown-menu-trigger button')!.click()
  await flushPromises()
}

const sheetMenu = () => document.querySelector('.astryx-dropdown-menu.is-sheet')

describe('adaptive presentation', () => {
  it('opens a DropdownMenu as a sheet on a compact touch screen by the theme compact definition', async () => {
    installMatchMedia(query => query === COMPACT_TOUCH)
    await openDropdown()
    await vi.waitFor(() => expect(sheetMenu()).not.toBeNull())
  })

  it('keeps a DropdownMenu sheet while it is open, even when the screen stops being compact', async () => {
    const media = installMatchMedia(query => query === COMPACT_TOUCH)
    await openDropdown()
    await vi.waitFor(() => expect(sheetMenu()).not.toBeNull())

    media.set(() => false)
    await nextTick()
    await flushPromises()
    expect(sheetMenu()).not.toBeNull()
    expect(document.querySelector('.astryx-dropdown-menu-trigger button')!.getAttribute('aria-expanded')).toBe('true')
  })

  it('offers adaptive on Selector: a sheet on a compact touch screen, a popover elsewhere', async () => {
    const media = installMatchMedia(query => query === COMPACT_TOUCH)
    const wrapper = mount(Selector, { attachTo: document.body, props: { label: 'Fruit', options, presentation: 'adaptive' } })
    await wrapper.find('.astryx-selector-trigger').trigger('click')
    await flushPromises()
    expect(document.querySelector('.astryx-selector-listbox.is-sheet')).not.toBeNull()

    // 开着的时候转屏不会把底部弹层换成浮层。
    media.set(() => false)
    await nextTick()
    expect(document.querySelector('.astryx-selector-listbox.is-sheet')).not.toBeNull()
  })

  it('offers adaptive on MultiSelector', async () => {
    installMatchMedia(query => query === COMPACT_TOUCH)
    const wrapper = mount(MultiSelector, { attachTo: document.body, props: { label: 'Fruit', options, presentation: 'adaptive' } })
    await wrapper.find('.astryx-multi-selector-trigger').trigger('click')
    await flushPromises()
    expect(document.querySelector('.astryx-multi-selector-listbox.is-sheet, [class*="multi-selector"].is-sheet')).not.toBeNull()
  })

  it('keeps a Selector popover where the window has no matchMedia', async () => {
    vi.stubGlobal('matchMedia', undefined)
    const wrapper = mount(Selector, { attachTo: document.body, props: { label: 'Fruit', options, presentation: 'adaptive' } })
    await wrapper.find('.astryx-selector-trigger').trigger('click')
    await flushPromises()
    expect(document.querySelector('.astryx-selector-listbox')).not.toBeNull()
    expect(document.querySelector('.is-sheet')).toBeNull()
  })

  it('opens a ContextMenu as a sheet on a landscape phone (shorter than 500px)', async () => {
    installMatchMedia(query => query === COMPACT_TOUCH)
    mount(ContextMenu, {
      attachTo: document.body,
      props: { label: 'Row actions', presentation: 'adaptive', items: [{ label: 'Rename' }] },
      slots: { default: () => h('button', { type: 'button' }, 'Target') },
    })
    document.querySelector('.astryx-context-menu-trigger')!.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, detail: 1 }))
    await flushPromises()
    expect(document.querySelector('.astryx-bottom-sheet-dialog')).not.toBeNull()
  })
  it('presents a MoreMenu as a sheet on a compact touch screen', () => {
    installMatchMedia(query => query === COMPACT_TOUCH)
    mount(MoreMenu, { attachTo: document.body, props: { presentation: 'adaptive', items: [{ label: 'Edit', onClick: () => {} }] } })
    expect(document.querySelector('.astryx-more-menu')!.getAttribute('data-presentation')).toBe('bottom-sheet')
  })
})
