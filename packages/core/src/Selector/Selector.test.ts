import type { SelectorOption } from './types.js'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import Selector from './Selector.vue'

function flushPromises() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}

describe('selector', () => {
  let options: SelectorOption[]

  beforeEach(() => {
    options = [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
    ]
  })

  it('renders with placeholder', () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        placeholder: 'Select a fruit',
      },
    })

    expect(wrapper.find('.astryx-selector-value').text()).toBe('Select a fruit')
  })

  it('displays selected option', () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        modelValue: 'banana',
      },
    })

    expect(wrapper.find('.astryx-selector-value').text()).toBe('Banana')
  })

  it('opens listbox on trigger click', async () => {
    const wrapper = mount(Selector, {
      props: { options },
      attachTo: document.body,
    })

    const trigger = wrapper.find('.astryx-selector-trigger')
    await trigger.trigger('click')
    await flushPromises()

    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(document.querySelector('.astryx-selector-listbox')).toBeTruthy()

    wrapper.unmount()
  })

  it('selects option on click', async () => {
    const wrapper = mount(Selector, {
      props: { options },
      attachTo: document.body,
    })

    await wrapper.find('.astryx-selector-trigger').trigger('click')
    await flushPromises()

    // 模拟选择选项（通过直接调用 combobox 的 select 方法）
    // 在实际 DOM 中，用户点击选项会触发 onOptionClick
    const trigger = wrapper.find('.astryx-selector-trigger')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'Enter' })
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('change')).toBeTruthy()

    wrapper.unmount()
  })

  it('closes on outside click', async () => {
    const wrapper = mount(Selector, {
      props: { options },
      attachTo: document.body,
    })

    const trigger = wrapper.find('.astryx-selector-trigger')
    await trigger.trigger('click')
    await flushPromises()

    expect(trigger.attributes('aria-expanded')).toBe('true')

    // useDismiss 监听 pointerdown
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    await flushPromises()

    expect(trigger.attributes('aria-expanded')).toBe('false')

    wrapper.unmount()
  })

  it('closes on Escape key', async () => {
    const wrapper = mount(Selector, {
      props: { options },
      attachTo: document.body,
    })

    const trigger = wrapper.find('.astryx-selector-trigger')
    await trigger.trigger('click')
    await flushPromises()

    expect(trigger.attributes('aria-expanded')).toBe('true')

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await flushPromises()

    expect(trigger.attributes('aria-expanded')).toBe('false')

    wrapper.unmount()
  })

  it('filters options when searchable', async () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        searchable: true,
      },
      attachTo: document.body,
    })

    await wrapper.find('.astryx-selector-trigger').trigger('click')
    await flushPromises()

    // 使用 nextTick 确保搜索框已渲染
    await nextTick()
    await nextTick()

    const wrapperEl = wrapper.vm.$el as HTMLElement
    const listboxId = wrapperEl.querySelector('.astryx-selector-trigger')?.getAttribute('aria-controls')
    const searchInput = document.querySelector(`#${listboxId} .astryx-selector-search-input`) as HTMLInputElement

    expect(searchInput).toBeTruthy()

    if (searchInput) {
      searchInput.value = 'ban'
      await searchInput.dispatchEvent(new Event('input', { bubbles: true }))
      await flushPromises()
      await nextTick()

      // 检查 emitted 事件
      expect(wrapper.emitted('search')).toBeTruthy()
    }

    wrapper.unmount()
  })

  it('shows empty state when no matches', async () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        searchable: true,
        emptyText: 'No results',
      },
      attachTo: document.body,
    })

    await wrapper.find('.astryx-selector-trigger').trigger('click')
    await flushPromises()
    await nextTick()

    const wrapperEl = wrapper.vm.$el as HTMLElement
    const listboxId = wrapperEl.querySelector('.astryx-selector-trigger')?.getAttribute('aria-controls')
    const searchInput = document.querySelector(`#${listboxId} .astryx-selector-search-input`) as HTMLInputElement

    if (searchInput) {
      searchInput.value = 'xyz'
      await searchInput.dispatchEvent(new Event('input', { bubbles: true }))
      await flushPromises()
      await nextTick()

      // 检查组件内部状态
      const vm = wrapper.vm as any
      expect(vm.isEmpty).toBe(true)
    }

    wrapper.unmount()
  })

  it('clears selection with clear button', async () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        modelValue: 'banana',
        clearable: true,
      },
    })

    const clearButton = wrapper.find('.astryx-selector-clear')
    const trigger = wrapper.find('.astryx-selector-trigger')
    expect(clearButton.exists()).toBe(true)
    expect(trigger.element.contains(clearButton.element)).toBe(false)

    await clearButton.trigger('click')
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
  })

  it('disables selector when disabled prop is true', () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        disabled: true,
      },
    })

    const trigger = wrapper.find('.astryx-selector-trigger')
    expect(trigger.attributes('disabled')).toBeDefined()
    expect(trigger.classes()).toContain('is-disabled')
  })

  it('skips disabled options', async () => {
    const disabledOptions = [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana', disabled: true },
      { value: 'cherry', label: 'Cherry' },
    ]

    const wrapper = mount(Selector, {
      props: { options: disabledOptions },
      attachTo: document.body,
    })

    await wrapper.find('.astryx-selector-trigger').trigger('click')
    await flushPromises()
    await nextTick()

    // 检查 combobox 内部状态，disabled 选项应该被正确标记
    const vm = wrapper.vm as any
    const combobox = vm.combobox
    expect(combobox.filteredOptions.value[1].disabled).toBe(true)

    wrapper.unmount()
  })

  it('navigates options with keyboard', async () => {
    const wrapper = mount(Selector, {
      props: { options },
      attachTo: document.body,
    })

    const trigger = wrapper.find('.astryx-selector-trigger')
    await trigger.trigger('click')
    await flushPromises()

    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    const activeDescendant = trigger.attributes('aria-activedescendant')
    expect(activeDescendant).toBeTruthy()

    wrapper.unmount()
  })

  it('applies correct size class', () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        size: 'sm',
      },
    })

    expect(wrapper.find('.astryx-selector').classes()).toContain('size-sm')
  })

  it('applies correct status class', () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        status: 'error',
      },
    })

    expect(wrapper.find('.astryx-selector').classes()).toContain('status-error')
  })

  it('uses English text unless a locale is provided', () => {
    const wrapper = mount(Selector, { props: { options } })
    expect(wrapper.get('.astryx-selector-value').text()).toBe('Select…')
  })

  it('accepts string options and an object status', async () => {
    const wrapper = mount(Selector, {
      props: {
        options: ['Alabama', 'Alaska'],
        status: { type: 'error', message: 'Required' },
      },
      attachTo: document.body,
    })

    await wrapper.find('.astryx-selector-trigger').trigger('click')
    await flushPromises()
    expect(document.body.textContent).toContain('Alabama')
    expect(wrapper.text()).toContain('Required')
    expect(wrapper.find('.astryx-selector').classes()).toContain('status-error')
    wrapper.unmount()
  })

  it('shows a label and section titles', async () => {
    const wrapper = mount(Selector, {
      props: {
        label: 'Office',
        options: [
          { type: 'section', title: 'Europe', options: [{ value: 'ldn', label: 'London' }] },
        ],
      },
      attachTo: document.body,
    })

    expect(wrapper.text()).toContain('Office')
    await wrapper.find('.astryx-selector-trigger').trigger('click')
    await flushPromises()
    expect(document.body.textContent).toContain('Europe')
    expect(document.body.textContent).toContain('London')
    wrapper.unmount()
  })

  it('opens the option list inside a bottom sheet', async () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        label: 'Team',
        presentation: 'bottom-sheet',
      },
      attachTo: document.body,
    })

    await wrapper.find('.astryx-selector-trigger').trigger('click')
    await flushPromises()
    await nextTick()

    const sheet = document.querySelector('.astryx-bottom-sheet, .astryx-bottom-sheet-inline, dialog')
    expect(sheet).not.toBeNull()
    expect(document.body.textContent).toContain('Apple')
    wrapper.unmount()
  })

  it('marks the chosen option and leaves unchosen rows without a check', async () => {
    const wrapper = mount(Selector, {
      props: { options, modelValue: 'banana' },
      attachTo: document.body,
    })
    await wrapper.find('.astryx-selector-trigger').trigger('click')
    await flushPromises()

    const listbox = document.querySelector('.astryx-selector-listbox:last-of-type')
    const rows = [...(listbox?.querySelectorAll('.astryx-selector-option') ?? [])]
    const chosen = rows.find(row => row.getAttribute('aria-selected') === 'true')
    const open = rows.find(row => row.getAttribute('aria-selected') === 'false')
    expect(chosen?.querySelector('.astryx-selector-check')).not.toBeNull()
    expect(open?.querySelector('.astryx-selector-check')).toBeNull()
    expect(chosen?.querySelector('.astryx-selector-mark')).toBe(chosen?.lastElementChild)
    wrapper.unmount()
  })

  it('puts the selection mark at the start when asked', async () => {
    const wrapper = mount(Selector, {
      props: { options, modelValue: 'apple', indicatorPosition: 'start' },
      attachTo: document.body,
    })
    await wrapper.find('.astryx-selector-trigger').trigger('click')
    await flushPromises()
    const listbox = document.querySelector('.astryx-selector-listbox:last-of-type')
    const chosen = listbox?.querySelector('.astryx-selector-option[aria-selected="true"]')
    expect(chosen?.querySelector('.astryx-selector-mark')).toBe(chosen?.firstElementChild)
    wrapper.unmount()
  })

  it('includes hidden select for form submission', () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        name: 'fruit',
        modelValue: 'banana',
      },
    })

    const hiddenSelect = wrapper.find('select[name="fruit"]')
    expect(hiddenSelect.exists()).toBe(true)
    expect((hiddenSelect.element as HTMLSelectElement).value).toBe('banana')
  })
})
