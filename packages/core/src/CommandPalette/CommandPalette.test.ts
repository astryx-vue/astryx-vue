import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { resetLiveRegionsForTest } from '../composables/testing/resetLiveRegions.js'
import { createStaticSource } from '../composables/useAsyncSource.js'
import CommandPalette from './CommandPalette.vue'
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
