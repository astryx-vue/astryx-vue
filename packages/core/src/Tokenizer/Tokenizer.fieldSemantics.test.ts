import type { SearchableItem } from '../composables/useAsyncSource.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { resetLiveRegionsForTest } from '../composables/internal/announce.js'
import { createStaticSource } from '../composables/useAsyncSource.js'
import Tokenizer from './Tokenizer.vue'

const people: SearchableItem[] = [
  { id: 'ada', label: 'Ada' },
  { id: 'grace', label: 'Grace' },
  { id: 'linus', label: 'Linus' },
]

async function flush(): Promise<void> {
  await nextTick()
  await Promise.resolve()
  await nextTick()
}

afterEach(() => {
  document.body.innerHTML = ''
  resetLiveRegionsForTest()
  vi.useRealTimers()
})

function mountTokenizer(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
  const wrapper = mount(Tokenizer, {
    attachTo: document.body,
    props: {
      'label': 'People',
      'searchSource': createStaticSource(people),
      'debounceMs': 0,
      // 和 v-model 一样：选中的值立刻回到属性里。
      'onUpdate:modelValue': (value: SearchableItem[]) => wrapper.setProps({ modelValue: value }),
      ...props,
    },
    attrs,
  })
  return wrapper
}

function textOfIds(ids: string | undefined): string {
  return (ids ?? '').split(/\s+/).filter(Boolean).map(id => document.getElementById(id)?.textContent?.trim() ?? '').join(' ')
}

function liveText(): string {
  return document.querySelector('[data-astryx-live-region="polite"]')?.textContent ?? ''
}

describe('tokenizer field semantics', () => {
  it('submits no value while disabled', () => {
    const enabled = mountTokenizer({ name: 'people', modelValue: [people[0]] })
    expect(enabled.findAll('input[type="hidden"][name="people"]')).toHaveLength(1)
    const disabled = mountTokenizer({ name: 'people', modelValue: [people[0]], disabled: true })
    expect(disabled.findAll('input[type="hidden"]')).toHaveLength(0)
  })

  it('names the input by the field label followed by a caller aria-labelledby', () => {
    const wrapper = mountTokenizer({}, { 'aria-labelledby': 'team-heading' })
    const heading = document.createElement('h2')
    heading.id = 'team-heading'
    heading.textContent = 'Team'
    document.body.append(heading)
    const input = wrapper.get('input[role="combobox"]')
    expect(textOfIds(input.attributes('aria-labelledby'))).toBe('People Team')
  })

  it('exposes an error status as aria-invalid and the required state as aria-required', () => {
    const wrapper = mountTokenizer({ status: 'error', statusMessage: 'Pick someone', required: true })
    const input = wrapper.get('input[role="combobox"]')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-required')).toBe('true')
    expect(mountTokenizer().get('input[role="combobox"]').attributes('aria-invalid')).toBeUndefined()
  })

  it('announces Clear all once, in the field\'s own words', async () => {
    vi.useFakeTimers()
    const wrapper = mountTokenizer({ modelValue: [people[0], people[1]], clearable: true })
    await wrapper.get('button.astryx-tokenizer-clear').trigger('click')
    await vi.advanceTimersByTimeAsync(50)
    expect(liveText()).toBe('All items removed')
  })

  it('draws the status icon in the field, and as a focusable button for the tooltip variant', () => {
    const attached = mountTokenizer({ status: 'error', statusMessage: 'Pick someone' })
    expect(attached.find('.astryx-tokenizer-control > .astryx-field-icon').exists()).toBe(true)
    expect(attached.find('.astryx-tokenizer-control > button.astryx-field-info-tip').exists()).toBe(false)
    const tooltip = mountTokenizer({ status: 'warning', statusMessage: 'Almost full', statusVariant: 'tooltip' })
    expect(tooltip.find('.astryx-tokenizer-control > button.astryx-field-info-tip').exists()).toBe(true)
    const detached = mountTokenizer({ status: 'error', statusMessage: 'Pick someone', statusVariant: 'detached' })
    expect(detached.find('.astryx-tokenizer-control > .astryx-field-icon').exists()).toBe(false)
  })

  it('keeps focus and the list open after a pick from the focus list, with the next choice active', async () => {
    const wrapper = mountTokenizer({ hasEntriesOnFocus: true, modelValue: [] })
    const input = wrapper.get('input[role="combobox"]')
    ;(input.element as HTMLInputElement).focus()
    await flush()
    expect(input.attributes('aria-expanded')).toBe('true')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'Enter' })
    await flush()
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([people[1]])
    expect(input.attributes('aria-expanded')).toBe('true')
    const active = input.attributes('aria-activedescendant')
    expect(document.getElementById(active ?? '')?.textContent).toContain('Linus')
  })

  it('closes the list when no choice remains after the pick', async () => {
    const wrapper = mountTokenizer({ hasEntriesOnFocus: true, modelValue: [people[0], people[1]] })
    const input = wrapper.get('input[role="combobox"]')
    ;(input.element as HTMLInputElement).focus()
    await flush()
    await input.trigger('keydown', { key: 'Enter' })
    await flush()
    expect(input.attributes('aria-expanded')).toBe('false')
  })

  it('announces the match count for a typed search, including matches past maxMenuItems', async () => {
    vi.useFakeTimers()
    const many: SearchableItem[] = Array.from({ length: 5 }, (_, index) => ({ id: `n${index}`, label: `Name ${index}` }))
    const wrapper = mountTokenizer({ searchSource: createStaticSource(many), maxMenuItems: 2 })
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await input.setValue('name')
    await vi.advanceTimersByTimeAsync(50)
    expect(liveText()).toBe('5 results')
  })

  it('throws a named error in development when modelValue is not an array', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => mountTokenizer({ modelValue: 'ada' })).toThrow(/Tokenizer: `modelValue` must be an array/)
    error.mockRestore()
  })
})
