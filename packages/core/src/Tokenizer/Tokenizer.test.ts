import type { SearchableItem } from '../composables/useAsyncSource.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { createStaticSource } from '../composables/useAsyncSource.js'
import Tokenizer from './Tokenizer.vue'

const people: SearchableItem[] = [
  { id: 'ada', label: 'Ada' },
  { id: 'grace', label: 'Grace' },
]

async function flush(): Promise<void> {
  await nextTick()
  await Promise.resolve()
  await nextTick()
}

function mountTokenizer(props: Record<string, unknown> = {}) {
  return mount(Tokenizer, {
    attachTo: document.body,
    props: {
      label: 'People',
      searchSource: createStaticSource(people),
      debounceMs: 0,
      showOnFocus: true,
      ...props,
    },
  })
}

describe('tokenizer', () => {
  it('adds a result and removes the last token with Backspace', async () => {
    const wrapper = mountTokenizer()
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await flush()
    await input.setValue('gr')
    await flush()
    await input.trigger('keydown', { key: 'Enter' })
    await flush()
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([people[1]])
    expect(wrapper.emitted('change')?.[0]?.[1]).toMatchObject({ type: 'add', item: people[1] })

    await wrapper.setProps({ modelValue: [people[1]] })
    const current = wrapper.get('input[role="combobox"]')
    await current.setValue('')
    await current.trigger('keydown', { key: 'Backspace' })
    await flush()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([])
    wrapper.unmount()
  })

  it('creates a token from free text and shows an error status', async () => {
    const wrapper = mountTokenizer({ creatable: true, status: 'error', statusMessage: 'Pick at least one' })
    expect(wrapper.text()).toContain('Pick at least one')
    const input = wrapper.get('input[role="combobox"]')
    await input.setValue('Lin')
    await flush()
    const create = [...document.querySelectorAll('[role="option"]')].find(option => option.textContent?.includes('Lin'))
    expect(create).toBeTruthy()
    create?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flush()
    expect(wrapper.emitted('change')?.[0]?.[1]).toMatchObject({ type: 'create', item: { id: 'Lin', label: 'Lin' } })
    wrapper.unmount()
  })

  it('shows +N when collapsed tokens do not fit', async () => {
    const items = [
      { id: 'a', label: 'Alpha' },
      { id: 'b', label: 'Bravo' },
      { id: 'c', label: 'Charlie' },
    ]
    const wrapper = mountTokenizer({ modelValue: items, overflow: 'unfocused-inline', searchSource: createStaticSource(items) })
    const row = wrapper.get('.astryx-tokenizer-tokens').element
    const originals = new Map<Element, () => DOMRect>()
    function mockWidth(element: Element, width: number): void {
      const original = element.getBoundingClientRect.bind(element)
      originals.set(element, original)
      element.getBoundingClientRect = () => {
        const rect = original()
        return {
          ...rect,
          width,
          height: 24,
          top: 0,
          left: 0,
          right: width,
          bottom: 24,
          x: 0,
          y: 0,
          toJSON() {
            return {}
          },
        }
      }
    }
    Object.defineProperty(row, 'clientWidth', { configurable: true, value: 100 })
    mockWidth(row, 100)
    wrapper.findAll('[data-overflow-item]').forEach(item => mockWidth(item.element, 48))
    const indicator = wrapper.get('[data-overflow-indicator]').element
    mockWidth(indicator, 32)
    await wrapper.get('input').trigger('focus')
    await wrapper.get('input').trigger('blur')
    await flush()
    expect(wrapper.text()).toContain('+')
    wrapper.unmount()
  })
})
