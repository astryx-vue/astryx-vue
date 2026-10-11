import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { createStaticSource } from '../composables/useAsyncSource.js'
import Typeahead from './Typeahead.vue'

const fruits: SearchableItem[] = [
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
  { id: 'cherry', label: 'Cherry', disabled: true },
]

async function flush(): Promise<void> {
  await nextTick()
  await Promise.resolve()
  await nextTick()
}

function mountTypeahead(props: Record<string, unknown> = {}) {
  return mount(Typeahead, {
    attachTo: document.body,
    props: {
      label: 'Fruit',
      searchSource: createStaticSource(fruits),
      debounceMs: 0,
      showOnFocus: true,
      ...props,
    },
  })
}

describe('typeahead', () => {
  it('opens a listbox and selects with the keyboard', async () => {
    const wrapper = mountTypeahead()
    const input = wrapper.get('input[role="combobox"]')
    expect(input.attributes('aria-autocomplete')).toBe('list')
    expect(input.attributes('aria-expanded')).toBe('false')

    await input.trigger('focus')
    await flush()
    expect(input.attributes('aria-expanded')).toBe('true')
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(3)

    await input.setValue('ban')
    await flush()
    const options = [...document.querySelectorAll<HTMLElement>('[role="option"]')]
    expect(options).toHaveLength(1)
    expect(options[0]?.textContent).toContain('Banana')

    await input.trigger('keydown', { key: 'Enter' })
    await flush()
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toMatchObject({ id: 'banana' })
    expect(wrapper.emitted('change')?.[0]?.[0]).toMatchObject({ id: 'banana' })
    wrapper.unmount()
  })

  it('shows a selected token and restores it on escape', async () => {
    const wrapper = mountTypeahead({ modelValue: fruits[1] })
    expect(wrapper.text()).toContain('Banana')
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await flush()
    expect((input.element as HTMLInputElement).value).toBe('Banana')

    await input.trigger('keydown', { key: 'Escape' })
    await flush()
    expect(input.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('.astryx-token').exists()).toBe(true)
    wrapper.unmount()
  })

  it('reports loading, then an error from an async source', async () => {
    let rejectSearch: ((error: Error) => void) | undefined
    const source: SearchSource = {
      search: () => new Promise((_resolve, reject) => {
        rejectSearch = reject
      }),
    }
    const wrapper = mountTypeahead({ searchSource: source, showOnFocus: false })
    const input = wrapper.get('input[role="combobox"]')
    await input.setValue('a')
    await flush()
    expect(document.body.textContent).toContain('Loading results')

    rejectSearch?.(new Error('offline'))
    await flush()
    expect(document.querySelector('[role="alert"]')?.textContent).toContain('Couldn\'t load results')
    wrapper.unmount()
  })

  it('does not open while disabled, and stays focusable when a reason is given', async () => {
    const wrapper = mountTypeahead({ disabled: true, disabledReason: 'Editors only' })
    const input = wrapper.get('input[role="combobox"]')
    expect(input.attributes('aria-disabled')).toBe('true')
    expect(input.attributes('disabled')).toBeUndefined()
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await flush()
    expect(input.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })
})
