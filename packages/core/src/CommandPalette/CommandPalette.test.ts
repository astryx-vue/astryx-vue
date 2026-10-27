import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { resetLiveRegionsForTest } from '../composables/testing/resetLiveRegions.js'
import { createStaticSource } from '../composables/useAsyncSource.js'
import CommandPalette from './CommandPalette.vue'
import CommandPaletteInput from './CommandPaletteInput.vue'
import CommandPaletteItem from './CommandPaletteItem.vue'
import CommandPaletteList from './CommandPaletteList.vue'
import { moveHighlight } from './keyboard.js'

const items: SearchableItem[] = [
  { id: 'home', label: 'Home', auxiliaryData: { group: 'Navigate' } },
  { id: 'settings', label: 'Settings', auxiliaryData: { group: 'Navigate' } },
  { id: 'profile', label: 'Profile' },
]

const Harness = defineComponent({
  components: { CommandPalette },
  setup() {
    const isOpen = ref(true)
    const value = ref<string | undefined>(undefined)
    const source = createStaticSource(items)
    return { isOpen, source, value }
  },
  template: `
    <CommandPalette
      v-model:value="value"
      is-inline
      :is-open="isOpen"
      :search-source="source"
      @open-change="isOpen = $event"
    />
  `,
})

describe('command palette', () => {
  it('groups items, moves the highlight, and selects with enter', async () => {
    const wrapper = mount(Harness, { attachTo: document.body })
    await nextTick()
    const input = wrapper.get('[role="combobox"]')
    expect(input.attributes('aria-activedescendant')).toBeUndefined()
    expect(wrapper.get('[role="group"]').attributes('aria-label')).toBe('Navigate')
    expect(wrapper.text()).toContain('Profile')

    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(input.attributes('aria-activedescendant')).toContain('-item-0')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.vm.value).toBe('home')
    expect(wrapper.vm.isOpen).toBe(false)
    wrapper.unmount()
    resetLiveRegionsForTest()
  })

  it('filters and announces the result count without moving the highlight', async () => {
    const wrapper = mount(Harness, { attachTo: document.body })
    await nextTick()
    const input = wrapper.get('[role="combobox"]')
    await input.setValue('set')
    await nextTick()
    await new Promise(resolve => requestAnimationFrame(resolve))
    expect(wrapper.text()).toContain('Settings')
    expect(wrapper.text()).not.toContain('Home')
    expect(input.attributes('aria-activedescendant')).toBeUndefined()
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toContain('1 result')
    wrapper.unmount()
    resetLiveRegionsForTest()
  })

  it('shows the empty state and closes on escape', async () => {
    const wrapper = mount(Harness, { attachTo: document.body })
    await nextTick()
    await wrapper.get('[role="combobox"]').setValue('zzzz')
    await nextTick()
    expect(wrapper.get('.astryx-command-palette-empty').text()).toBe('No results')
    await wrapper.get('[role="combobox"]').trigger('keydown', { key: 'Escape' })
    expect(wrapper.vm.isOpen).toBe(false)
    wrapper.unmount()
    resetLiveRegionsForTest()
  })

  it('discards a response that resolves after close', async () => {
    let resolveSearch: ((items: SearchableItem[]) => void) | undefined
    const source: SearchSource = {
      bootstrap: () => [],
      search: () => new Promise((resolve) => {
        resolveSearch = resolve
      }),
    }
    const wrapper = mount(CommandPalette, {
      attachTo: document.body,
      props: { isInline: true, isOpen: true, searchSource: source },
    })
    await wrapper.get('[role="combobox"]').setValue('late')
    await nextTick()
    await wrapper.setProps({ isOpen: false })
    resolveSearch?.([{ id: 'stale', label: 'Stale item' }])
    await nextTick()
    await wrapper.setProps({ isOpen: true })
    await nextTick()
    expect(wrapper.text()).not.toContain('Stale item')
    wrapper.unmount()
  })
})

describe('command palette item and input overrides', () => {
  it('lets an explicit isHighlighted / isSelected win outside a palette', () => {
    const plain = mount(CommandPaletteItem, {
      props: { value: 'a' },
      slots: { default: () => 'Item A' },
    })
    expect(plain.attributes('data-highlighted')).toBeUndefined()
    expect(plain.attributes('aria-selected')).toBe('false')

    const marked = mount(CommandPaletteItem, {
      props: { isHighlighted: true, isSelected: true, value: 'a' },
      slots: { default: () => 'Item A' },
    })
    expect(marked.attributes('data-highlighted')).toBe('true')
    expect(marked.attributes('data-selected')).toBe('true')
    expect(marked.attributes('aria-selected')).toBe('true')
  })

  it('emits select with the value when activated by pointer', async () => {
    const wrapper = mount(CommandPaletteItem, {
      props: { value: 'a' },
      slots: { default: () => 'Item A' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('select')).toEqual([['a']])
  })

  it('does not emit select for a disabled item', async () => {
    const wrapper = mount(CommandPaletteItem, {
      props: { isDisabled: true, value: 'a' },
      slots: { default: () => 'Item A' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('reports the picked value under the original callback name', async () => {
    const wrapper = mount(Harness, { attachTo: document.body })
    await nextTick()
    const input = wrapper.get('[role="combobox"]')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.findComponent(CommandPalette).emitted('valueChange')).toEqual([['home']])
    wrapper.unmount()
    resetLiveRegionsForTest()
  })

  it('takes a value prop and reports changes when it is controlled', async () => {
    const wrapper = mount(CommandPaletteInput, { props: { value: 'set' } })
    const input = wrapper.get('input')
    expect((input.element as HTMLInputElement).value).toBe('set')

    await input.setValue('settings')
    expect(wrapper.emitted('valueChange')).toEqual([['settings']])
    expect(wrapper.emitted('update:value')).toEqual([['settings']])
  })

  it('renders trailing content from the endContent slot', () => {
    const wrapper = mount(CommandPaletteInput, {
      slots: { endContent: '<kbd class="hint">/</kbd>' },
    })
    expect(wrapper.find('.astryx-command-palette-end .hint').exists()).toBe(true)
  })
})

describe('command palette keyboard and standalone parts', () => {
  it('leaves the highlight where it is for Home and End, and jumps with PageDown', async () => {
    const wrapper = mount(Harness, { attachTo: document.body })
    await nextTick()
    const input = wrapper.get('[role="combobox"]')
    await input.trigger('keydown', { key: 'ArrowDown' })
    const highlighted = input.attributes('aria-activedescendant')
    expect(highlighted).toContain('-item-0')
    await input.trigger('keydown', { key: 'Home' })
    await input.trigger('keydown', { key: 'End' })
    expect(input.attributes('aria-activedescendant')).toBe(highlighted)
    await input.trigger('keydown', { key: 'PageDown' })
    expect(input.attributes('aria-activedescendant')).toContain('-item-2')
    wrapper.unmount()
    resetLiveRegionsForTest()
  })

  it('does not scroll when the pointer moves the highlight, and does scroll for the arrow keys', async () => {
    const seen: Element[] = []
    const original = HTMLElement.prototype.scrollIntoView
    HTMLElement.prototype.scrollIntoView = function scrollIntoView(this: HTMLElement) {
      seen.push(this)
    }
    try {
      const wrapper = mount(Harness, { attachTo: document.body })
      await nextTick()
      const items = wrapper.findAll('[role="option"]')
      await items[1]!.trigger('mouseenter')
      await new Promise(resolve => requestAnimationFrame(resolve))
      expect(seen).toEqual([])
      expect(items[1]!.attributes('data-highlighted')).toBe('true')
      await wrapper.get('[role="combobox"]').trigger('keydown', { key: 'ArrowDown' })
      await new Promise(resolve => requestAnimationFrame(resolve))
      expect(seen.length).toBeGreaterThan(0)
      wrapper.unmount()
      resetLiveRegionsForTest()
    }
    finally {
      HTMLElement.prototype.scrollIntoView = original
    }
  })

  it('uses the default cursor on a disabled item', () => {
    const wrapper = mount(CommandPaletteItem, {
      props: { isDisabled: true, value: 'a' },
      slots: { default: () => 'Item A' },
    })
    expect(wrapper.attributes('data-disabled')).toBe('true')
    expect(wrapper.classes()).toContain('astryx-command-palette-item')
    const css = readFileSync(resolve('packages/core/styles/command-palette.css'), 'utf8')
    expect(css).toMatch(/\[data-disabled='true'\]\s*\{[^}]*cursor:\s*default/)
    expect(css).not.toContain('not-allowed')
  })

  it('names a standalone input from its label and keeps a standalone list id', () => {
    const input = mount(CommandPaletteInput, { props: { hasAutoFocus: false } })
    const field = input.get('input')
    expect(field.attributes('role')).toBe('searchbox')
    expect(field.attributes('aria-label')).toBe('Search commands')
    expect(field.attributes('placeholder')).not.toBe('Search commands')

    const list = mount(CommandPaletteList, {
      attrs: { id: 'caller-list' },
      slots: { default: () => 'row' },
    })
    expect(list.attributes('id')).toBe('caller-list')
    expect(list.attributes('role')).toBe('listbox')
  })
})

describe('moveHighlight', () => {
  it('skips disabled items and does not wrap', () => {
    const rows = [
      { id: 'a', label: 'A', disabled: true },
      { id: 'b', label: 'B' },
      { id: 'c', label: 'C' },
    ]
    expect(moveHighlight(rows, -1, 'next')).toBe(1)
    expect(moveHighlight(rows, 2, 'next')).toBe(2)
    expect(moveHighlight(rows, 2, 'first')).toBe(1)
  })
})
