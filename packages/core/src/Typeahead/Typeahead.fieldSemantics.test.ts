import type { SearchableItem } from '../composables/useAsyncSource.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { resetLiveRegionsForTest } from '../composables/internal/announce.js'
import { createStaticSource } from '../composables/useAsyncSource.js'
import Typeahead from './Typeahead.vue'
import TypeaheadItem from './TypeaheadItem.vue'

const fruits: SearchableItem[] = Array.from({ length: 5 }, (_, index) => ({ id: `f${index}`, label: `Fruit ${index}` }))

afterEach(() => {
  document.body.innerHTML = ''
  resetLiveRegionsForTest()
  vi.useRealTimers()
})

function mountTypeahead(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
  return mount(Typeahead, {
    attachTo: document.body,
    props: { label: 'Fruit', searchSource: createStaticSource(fruits), debounceMs: 0, ...props },
    attrs,
  })
}

function textOfIds(ids: string | undefined): string {
  return (ids ?? '').split(/\s+/).filter(Boolean).map(id => document.getElementById(id)?.textContent?.trim() ?? '').join(' ')
}

describe('typeahead field semantics', () => {
  it('names the input by the field label followed by a caller aria-labelledby', () => {
    const wrapper = mountTypeahead({}, { 'aria-labelledby': 'lunch' })
    const heading = document.createElement('h2')
    heading.id = 'lunch'
    heading.textContent = 'Lunch'
    document.body.append(heading)
    expect(textOfIds(wrapper.get('input[role="combobox"]').attributes('aria-labelledby'))).toBe('Fruit Lunch')
  })

  it('exposes an error status as aria-invalid', () => {
    const invalid = mountTypeahead({ status: 'error', statusMessage: 'Pick a fruit' })
    expect(invalid.get('input[role="combobox"]').attributes('aria-invalid')).toBe('true')
    expect(mountTypeahead({ status: 'warning', statusMessage: 'Careful' }).get('input[role="combobox"]').attributes('aria-invalid')).toBeUndefined()
  })

  it('draws the status icon in the field by statusVariant', () => {
    const attached = mountTypeahead({ status: 'error', statusMessage: 'Pick a fruit' })
    expect(attached.find('.astryx-typeahead-control > .astryx-field-icon').exists()).toBe(true)
    const tooltip = mountTypeahead({ status: 'warning', statusMessage: 'Careful', statusVariant: 'tooltip' })
    expect(tooltip.find('.astryx-typeahead-control > button.astryx-field-info-tip').exists()).toBe(true)
    const detached = mountTypeahead({ status: 'error', statusMessage: 'Pick a fruit', statusVariant: 'detached' })
    expect(detached.find('.astryx-typeahead-control > .astryx-field-icon').exists()).toBe(false)
  })

  it('announces a result count that names every match, not only the rows shown', async () => {
    vi.useFakeTimers()
    const wrapper = mountTypeahead({ maxMenuItems: 2 })
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await input.setValue('fruit')
    await vi.advanceTimersByTimeAsync(50)
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('5 results')
  })

  it('throws a named error in development for a TypeaheadItem without an item', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => mount(TypeaheadItem, { props: {} as never })).toThrow(/TypeaheadItem: `item` is required/)
    error.mockRestore()
  })
})
