import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { resetLiveRegionsForTest } from '../composables/testing/resetLiveRegions.js'
import CommandPalette from './CommandPalette.vue'

const mounted: Array<{ unmount: () => void }> = []

function mountPalette(searchSource: SearchSource) {
  const wrapper = mount(CommandPalette, { attachTo: document.body, props: { isInline: true, isOpen: true, searchSource } })
  mounted.push(wrapper)
  return wrapper
}

interface Deferred {
  query: string
  resolve: (items: SearchableItem[]) => void
  reject: (error: unknown) => void
}

function deferredSource(calls: Deferred[]): SearchSource {
  return {
    bootstrap: () => new Promise<SearchableItem[]>((resolve, reject) => {
      calls.push({ query: '', resolve, reject })
    }),
    search: query => new Promise<SearchableItem[]>((resolve, reject) => {
      calls.push({ query, resolve, reject })
    }),
  }
}

async function frame(): Promise<void> {
  await nextTick()
  await new Promise(resolve => requestAnimationFrame(resolve))
  await new Promise(resolve => requestAnimationFrame(resolve))
}

function liveText(): string {
  return [...document.querySelectorAll('[data-astryx-live-region]')].map(node => node.textContent).join(' ')
}

afterEach(() => {
  for (const wrapper of mounted.splice(0))
    wrapper.unmount()
  resetLiveRegionsForTest()
})

describe('command palette first search pending', () => {
  it('keeps one hidden line of height, and no "Type to search", over a query typed while the first search loads', async () => {
    const calls: Deferred[] = []
    const wrapper = mountPalette(deferredSource(calls))
    await nextTick()
    expect(wrapper.get('.astryx-command-palette-empty').attributes('aria-hidden')).toBe('true')

    await wrapper.get('[role="combobox"]').setValue('abc')
    await flushPromises()
    const empty = wrapper.get('.astryx-command-palette-empty')
    expect(empty.attributes('aria-hidden')).toBe('true')
    expect(empty.text()).not.toContain('Type to search')
    expect(empty.text()).not.toContain('No results')
  })

  it('keeps the no-results text mounted across keystrokes after a query settled empty', async () => {
    const calls: Deferred[] = []
    const wrapper = mountPalette(deferredSource(calls))
    await nextTick()
    calls[0]!.resolve([{ id: 'a', label: 'Alpha' }])
    await flushPromises()

    await wrapper.get('[role="combobox"]').setValue('zz')
    await flushPromises()
    calls.at(-1)!.resolve([])
    await flushPromises()
    const settled = wrapper.get('.astryx-command-palette-empty')
    expect(settled.text()).toBe('No results')

    await wrapper.get('[role="combobox"]').setValue('zzz')
    await flushPromises()
    const pending = wrapper.get('.astryx-command-palette-empty')
    expect(pending.element).toBe(settled.element)
    expect(pending.text()).toBe('No results')
    expect(pending.attributes('aria-hidden')).toBeUndefined()
  })

  it('settles a rejected search as an empty answer', async () => {
    const calls: Deferred[] = []
    const wrapper = mountPalette(deferredSource(calls))
    await nextTick()
    calls[0]!.resolve([{ id: 'a', label: 'Alpha' }])
    await flushPromises()
    await wrapper.get('[role="combobox"]').setValue('boom')
    await flushPromises()
    calls.at(-1)!.reject(new Error('offline'))
    await frame()
    expect(wrapper.get('.astryx-command-palette-empty').text()).toBe('No results')
    expect(liveText()).toContain('No results')
  })
})

describe('command palette busy announcement', () => {
  it('announces the busy start from the input, and never after the outcome it precedes', async () => {
    const calls: Deferred[] = []
    const wrapper = mountPalette(deferredSource(calls))
    await frame()
    expect(liveText()).toContain('Loading')
    expect(wrapper.find('.astryx-command-palette-spinner').attributes('aria-hidden')).toBe('true')

    calls[0]!.resolve([{ id: 'a', label: 'Alpha' }])
    await flushPromises()
    await wrapper.get('[role="combobox"]').setValue('al')
    await nextTick()
    calls.at(-1)!.resolve([{ id: 'a', label: 'Alpha' }])
    await frame()
    expect(liveText()).toContain('1 result')
    expect(liveText()).not.toContain('Loading')
  })

  it('refreshes the shown query when the source is replaced while open', async () => {
    const wrapper = mountPalette({ search: () => [{ id: 'old', label: 'Old' }] })
    await wrapper.get('[role="combobox"]').setValue('o')
    await flushPromises()
    expect(wrapper.text()).toContain('Old')
    await wrapper.setProps({ searchSource: { search: () => [{ id: 'new', label: 'New' }] } })
    await flushPromises()
    expect(wrapper.text()).toContain('New')
    expect(wrapper.text()).not.toContain('Old')
  })
})

describe('command palette input search keyboard', () => {
  it('asks a touch keyboard for the Search key and no autocorrection', () => {
    const input = mountPalette({ search: () => [] }).get('[role="combobox"]')
    expect(input.attributes('enterkeyhint')).toBe('search')
    expect(input.attributes('autocorrect')).toBe('off')
  })
})
