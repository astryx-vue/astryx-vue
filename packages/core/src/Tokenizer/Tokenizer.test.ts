import type { SearchableItem } from '../composables/useAsyncSource.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
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

// 下拉挂在 body 上，前一个用例断言失败时可能留下节点，每个用例开始前清干净。
afterEach(() => {
  document.body.innerHTML = ''
})

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
    function setWidth(element: Element, width: number): void {
      Object.defineProperty(element, 'offsetWidth', { configurable: true, value: width })
      Object.defineProperty(element, 'offsetHeight', { configurable: true, value: 24 })
    }
    setWidth(wrapper.get('.astryx-tokenizer-tokens').element, 100)
    for (const child of wrapper.get('.astryx-tokenizer-measure').element.children)
      setWidth(child, child.hasAttribute('data-overflow-indicator') ? 32 : 48)
    await wrapper.get('input').trigger('focus')
    await wrapper.get('input').trigger('blur')
    await flush()
    expect(wrapper.text()).toContain('+2')
    wrapper.unmount()
  })
})

describe('tokenizer aliases and additions', () => {
  it('treats hasClear as the name for clearable', async () => {
    const wrapper = mountTokenizer({ modelValue: [people[0]], hasClear: true })
    expect(wrapper.find('.astryx-tokenizer-clear').exists()).toBe(true)
    await wrapper.setProps({ hasClear: false })
    expect(wrapper.find('.astryx-tokenizer-clear').exists()).toBe(false)
    wrapper.unmount()
  })

  it('treats hasCreate as the name for creatable and offers it below minQueryLength', async () => {
    const wrapper = mountTokenizer({ hasCreate: true, minQueryLength: 3, showOnFocus: false })
    const input = wrapper.get('input[role="combobox"]')
    await input.setValue('Li')
    await flush()
    // 两个字符不到搜索下限，但「新建」是从输入的文字派生的，照样给。
    expect(input.attributes('aria-expanded')).toBe('true')
    const options = [...document.querySelectorAll<HTMLElement>('.astryx-typeahead-option')]
    expect(options).toHaveLength(1)
    expect(options[0]?.textContent).toContain('Create')
    wrapper.unmount()
  })

  it('skips the search below minQueryLength', async () => {
    const search = vi.fn(() => people)
    const wrapper = mountTokenizer({ searchSource: { search }, minQueryLength: 3, showOnFocus: false })
    const input = wrapper.get('input[role="combobox"]')
    await input.setValue('ad')
    await flush()
    expect(search).not.toHaveBeenCalled()
    expect(input.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('emits changeQuery next to search', async () => {
    const wrapper = mountTokenizer({ showOnFocus: false })
    await wrapper.get('input[role="combobox"]').setValue('gr')
    await flush()
    expect(wrapper.emitted('search')?.[0]).toEqual(['gr'])
    expect(wrapper.emitted('changeQuery')?.[0]).toEqual(['gr'])
    wrapper.unmount()
  })

  it('emits focus and blur only when focus crosses the field boundary', async () => {
    const wrapper = mountTokenizer({ modelValue: [people[0], people[1]] })
    const control = wrapper.get('.astryx-tokenizer-control')
    await control.trigger('focusin', { relatedTarget: document.body })
    await flush()
    expect(wrapper.emitted('focus')).toHaveLength(1)

    // 在字段内部换焦点不算离开。
    await control.trigger('focusout', { relatedTarget: wrapper.get('.astryx-tokenizer-token').element })
    await flush()
    expect(wrapper.emitted('blur')).toBeUndefined()

    await control.trigger('focusout', { relatedTarget: document.body })
    await flush()
    expect(wrapper.emitted('blur')).toHaveLength(1)
    wrapper.unmount()
  })

  it('reads the disabled message out when disabled', async () => {
    const wrapper = mountTokenizer({ disabled: true, disabledMessage: 'Admins only' })
    const input = wrapper.get('input[role="combobox"]')
    expect(input.attributes('aria-disabled')).toBe('true')
    expect(input.attributes('disabled')).toBeUndefined()
    await input.trigger('focus')
    await flush()
    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain('Admins only')
    wrapper.unmount()
  })

  it('focuses the input on mount with hasAutoFocus', async () => {
    const wrapper = mountTokenizer({ hasAutoFocus: true })
    await flush()
    expect(document.activeElement).toBe(wrapper.get('input[role="combobox"]').element)
    wrapper.unmount()
  })
})
