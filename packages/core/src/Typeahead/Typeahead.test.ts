import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { createStaticSource } from '../composables/useAsyncSource.js'
import BaseTypeahead from './BaseTypeahead.vue'
import Typeahead from './Typeahead.vue'
import { requestedMenuWidth } from './useAnchoredListbox.js'

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

// 下拉挂在 body 上，前一个用例断言失败时可能留下节点，每个用例开始前清干净。
afterEach(() => {
  document.body.innerHTML = ''
})

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
    await wrapper.setProps({ modelValue: { id: 'banana', label: 'Banana' } })
    await flush()
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toMatchObject({ id: 'banana' })
    expect(wrapper.emitted('change')?.[0]?.[0]).toMatchObject({ id: 'banana' })
    expect(input.attributes('aria-expanded')).toBe('false')
    expect(wrapper.get('.astryx-token').text()).toContain('Banana')
    expect((input.element as HTMLInputElement).value).toBe('')
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
    expect(document.body.textContent).toContain('Loading')

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

  it('renders the default option row', async () => {
    const wrapper = mountTypeahead()
    await wrapper.get('input[role="combobox"]').trigger('focus')
    await flush()
    expect(document.querySelector('.astryx-typeahead-item')?.textContent).toContain('Apple')
    wrapper.unmount()
  })

  it('renders a bare combobox without a field label', async () => {
    const wrapper = mount(BaseTypeahead, {
      attachTo: document.body,
      props: {
        label: 'Command',
        searchSource: createStaticSource(fruits),
        debounceMs: 0,
      },
    })
    expect(wrapper.find('label').exists()).toBe(false)
    expect(wrapper.find('.astryx-typeahead--bare').exists()).toBe(true)
    expect(wrapper.get('input').attributes('aria-label')).toBe('Command')
    expect(wrapper.get('.astryx-typeahead-control').classes()).toContain('is-bare')
    wrapper.unmount()
  })

  it('keeps the border and chrome when wrapped by Typeahead', () => {
    const wrapper = mount(Typeahead, {
      attachTo: document.body,
      props: { label: 'Fruit', searchSource: createStaticSource(fruits), debounceMs: 0 },
    })
    expect(wrapper.get('.astryx-typeahead-control').classes()).not.toContain('is-bare')
    expect(wrapper.find('.astryx-typeahead--bare').exists()).toBe(false)
    wrapper.unmount()
  })
})

describe('typeahead minQueryLength', () => {
  it('skips the search and stays closed below the threshold, then searches at it', async () => {
    const search = vi.fn((query: string) => fruits.filter(item => item.label.toLowerCase().includes(query)))
    const source: SearchSource = { search }
    const wrapper = mountTypeahead({ searchSource: source, showOnFocus: false, minQueryLength: 3 })
    const input = wrapper.get('input[role="combobox"]')

    await input.setValue('ap')
    await flush()
    expect(search).not.toHaveBeenCalled()
    expect(input.attributes('aria-expanded')).toBe('false')
    expect(document.querySelector('.astryx-typeahead-option')).toBeNull()

    await input.setValue('app')
    await flush()
    expect(search).toHaveBeenCalledWith('app', expect.anything())
    expect(input.attributes('aria-expanded')).toBe('true')
    wrapper.unmount()
  })

  it('still shows bootstrap entries on focus with an empty query', async () => {
    const wrapper = mountTypeahead({ hasEntriesOnFocus: true, minQueryLength: 3 })
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await flush()
    expect(input.attributes('aria-expanded')).toBe('true')
    expect(document.querySelectorAll('.astryx-typeahead-option')).toHaveLength(3)
    wrapper.unmount()
  })
})

describe('typeahead aliases and additions', () => {
  it('treats hasEntriesOnFocus as the name for showOnFocus', async () => {
    const wrapper = mountTypeahead({ showOnFocus: false, hasEntriesOnFocus: true })
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await flush()
    expect(input.attributes('aria-expanded')).toBe('true')
    wrapper.unmount()
  })

  it('emits changeQuery next to search', async () => {
    const wrapper = mountTypeahead({ showOnFocus: false })
    await wrapper.get('input[role="combobox"]').setValue('ba')
    await flush()
    expect(wrapper.emitted('search')?.[0]).toEqual(['ba'])
    expect(wrapper.emitted('changeQuery')?.[0]).toEqual(['ba'])
    wrapper.unmount()
  })

  it('accepts hasClear as another name for clearable', async () => {
    const wrapper = mountTypeahead({ modelValue: fruits[0], clearable: true, hasClear: false })
    expect(wrapper.find('.astryx-typeahead-clear').exists()).toBe(false)
    await wrapper.setProps({ hasClear: true, clearable: true })
    expect(wrapper.find('.astryx-typeahead-clear').exists()).toBe(true)
    await wrapper.setProps({ clearable: false })
    expect(wrapper.find('.astryx-typeahead-clear').exists()).toBe(false)
    wrapper.unmount()
  })

  it('focuses the input on mount with hasAutoFocus', async () => {
    const wrapper = mountTypeahead({ hasAutoFocus: true, showOnFocus: false })
    await flush()
    expect(document.activeElement).toBe(wrapper.get('input[role="combobox"]').element)
    expect(wrapper.get('input[role="combobox"]').attributes('data-autofocus')).toBe('true')
    wrapper.unmount()
  })

  it('shows labelTooltip next to the label', async () => {
    const wrapper = mountTypeahead({ labelTooltip: 'Where this fruit goes' })
    expect(wrapper.get('.astryx-field-label-row').text()).toContain('Fruit')
    expect(wrapper.get('.astryx-field-label-row').html()).toContain('Where this fruit goes')
    wrapper.unmount()
  })

  it('reads the disabled message out when disabled', async () => {
    const wrapper = mountTypeahead({ disabled: true, disabledMessage: 'Editors only' })
    const input = wrapper.get('input[role="combobox"]')
    expect(input.attributes('aria-disabled')).toBe('true')
    expect(input.attributes('disabled')).toBeUndefined()
    await input.trigger('focus')
    await flush()
    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain('Editors only')
    wrapper.unmount()
  })

  it('falls back to the emptySearchText default and lets an empty string render nothing', async () => {
    const wrapper = mountTypeahead({ showOnFocus: false })
    const input = wrapper.get('input[role="combobox"]')
    await input.setValue('zzz')
    await flush()
    const empty = document.querySelector('.astryx-typeahead-state:not([role="status"])')
    expect(empty?.textContent?.trim()).toBe('No results found')
    expect(empty?.getAttribute('role')).toBe('option')

    await wrapper.setProps({ emptySearchText: '' })
    await flush()
    expect(document.querySelector('.astryx-typeahead-state')?.textContent?.trim()).toBe('')

    await wrapper.setProps({ emptySearchText: null, emptyText: 'Nothing here' })
    await flush()
    expect(document.querySelector('.astryx-typeahead-state')?.textContent?.trim()).toBe('Nothing here')
    wrapper.unmount()
  })
})

describe('base typeahead', () => {
  function mountBase(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
    return mount(BaseTypeahead, {
      attachTo: document.body,
      props: {
        label: 'Fruit',
        searchSource: createStaticSource(fruits),
        debounceMs: 0,
        showOnFocus: false,
        ...props,
      },
      attrs,
    })
  }

  it('gives an outside keydown handler the first say', async () => {
    const onKeydown = vi.fn((event: KeyboardEvent) => event.preventDefault())
    const wrapper = mountBase({ showOnFocus: true }, { onKeydown })
    const input = wrapper.get('input[role="combobox"]')
    await input.trigger('focus')
    await flush()
    expect(input.attributes('aria-expanded')).toBe('true')

    const before = input.attributes('aria-activedescendant')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await flush()
    expect(onKeydown).toHaveBeenCalled()
    // 外面 preventDefault 了，内部导航不再动高亮。
    expect(input.attributes('aria-activedescendant')).toBe(before)
    wrapper.unmount()
  })

  it('reports the query through changeQuery', async () => {
    const wrapper = mountBase()
    await wrapper.get('input').setValue('b')
    await flush()
    expect(wrapper.emitted('changeQuery')?.[0]).toEqual(['b'])
    expect(wrapper.emitted('search')?.[0]).toEqual(['b'])
    wrapper.unmount()
  })

  it('applies inputTabIndex, aria aliases and menuWidth', async () => {
    const wrapper = mountBase({
      inputTabIndex: 3,
      ariaDescribedBy: 'outside-help',
      ariaLabelledBy: 'outside-label',
      menuWidth: 420,
    })
    const input = wrapper.get('input')
    expect(input.attributes('tabindex')).toBe('3')
    expect(input.attributes('aria-describedby')).toBe('outside-help')
    expect(input.attributes('aria-labelledby')).toBe('outside-label')

    expect(requestedMenuWidth(420)).toBe('min(420px, calc(100vw - 16px))')
    expect(requestedMenuWidth(undefined)).toBeUndefined()
    wrapper.unmount()
  })

  it('hides the label when isLabelHidden is set, and the old name still works', () => {
    const hidden = mountTypeahead({ isLabelHidden: true })
    expect(hidden.get('.astryx-field-label-group').attributes('data-hidden')).toBe('true')
    hidden.unmount()

    const aliased = mountTypeahead({ labelHidden: true })
    expect(aliased.get('.astryx-field-label-group').attributes('data-hidden')).toBe('true')
    aliased.unmount()

    const visible = mountTypeahead()
    expect(visible.get('.astryx-field-label-group').attributes('data-hidden')).toBeUndefined()
    visible.unmount()
  })

  it('groups options by item.auxiliaryData.group', async () => {
    const grouped: SearchableItem[] = [
      { id: 'apple', label: 'Apple', auxiliaryData: { group: 'Fruit' } },
      { id: 'banana', label: 'Banana', auxiliaryData: { group: 'Fruit' } },
      { id: 'carrot', label: 'Carrot', auxiliaryData: { group: 'Vegetable' } },
      { id: 'other', label: 'Other' },
    ]
    const wrapper = mountBase({ searchSource: createStaticSource(grouped), showOnFocus: true })
    await wrapper.get('input').trigger('focus')
    await flush()

    const groups = [...document.querySelectorAll('[role="group"]')]
    expect(groups.map(group => group.getAttribute('aria-label'))).toEqual(['Fruit', 'Vegetable'])
    const headings = [...document.querySelectorAll('.astryx-typeahead-group-heading')].map(node => node.textContent?.trim())
    expect(headings).toEqual(['Fruit', 'Vegetable'])
    expect(document.querySelectorAll('.astryx-typeahead-option')).toHaveLength(grouped.length)
    wrapper.unmount()
  })
})
