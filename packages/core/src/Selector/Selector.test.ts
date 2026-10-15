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
    expect(chosen?.querySelector('.astryx-selector-option-mark')).toBe(chosen?.lastElementChild)
    wrapper.unmount()
  })

  it('keeps a read-only value focusable and refuses to open', async () => {
    const wrapper = mount(Selector, {
      props: { options, modelValue: 'banana', isReadOnly: true, clearable: true, label: 'Fruit' },
    })
    const trigger = wrapper.get('.astryx-selector-trigger')
    expect(trigger.attributes('aria-readonly')).toBe('true')
    expect(trigger.attributes('disabled')).toBeUndefined()
    expect(wrapper.find('.astryx-selector-icon').exists()).toBe(false)
    expect(wrapper.find('.astryx-selector-clear').exists()).toBe(false)
    expect(wrapper.find('.astryx-selector-field').classes()).not.toContain('is-disabled')
    await trigger.trigger('click')
    expect(trigger.attributes('aria-expanded')).toBe('false')

    await wrapper.setProps({ disabled: true })
    expect(trigger.attributes('aria-readonly')).toBeUndefined()
    expect(trigger.attributes('disabled')).toBeDefined()
  })

  it('shows a spinner and stays quiet while loading', async () => {
    const wrapper = mount(Selector, {
      props: { options: [], isLoading: true, emptyText: 'No options', searchable: true },
      attachTo: document.body,
    })
    expect(wrapper.find('.astryx-selector-spinner').exists()).toBe(true)
    await wrapper.get('.astryx-selector-trigger').trigger('click')
    await flushPromises()
    expect(document.querySelector('.astryx-selector-empty')).toBeNull()
    wrapper.unmount()
  })

  it('uses a different message when a search misses', async () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        searchable: true,
        emptyText: 'No options',
        emptySearchText: 'Nothing like that',
      },
      attachTo: document.body,
    })
    await wrapper.get('.astryx-selector-trigger').trigger('click')
    await flushPromises()
    const search = document.querySelector('.astryx-selector-search-input') as HTMLInputElement
    search.value = 'pear'
    search.dispatchEvent(new Event('input', { bubbles: true }))
    await flushPromises()
    await nextTick()
    expect(document.body.textContent).toContain('Nothing like that')
    expect(document.body.textContent).not.toContain('No options')
    wrapper.unmount()
  })

  it('places the selection mark on the requested side', async () => {
    const wrapper = mount(Selector, {
      props: { options, modelValue: 'apple', indicatorPosition: 'start' },
      attachTo: document.body,
    })
    const trigger = wrapper.get('.astryx-selector-trigger')
    await trigger.trigger('click')
    await flushPromises()
    const controls = trigger.attributes('aria-controls') ?? ''
    const listboxes = document.querySelectorAll(`[id="${controls}"]`)
    const listbox = listboxes[listboxes.length - 1]
    const option = listbox?.querySelector('.astryx-selector-option.is-selected')
    expect(option?.firstElementChild?.classList.contains('astryx-selector-option-mark')).toBe(true)
    wrapper.unmount()
  })

  it('marks the field optional or required', () => {
    const wrapper = mount(Selector, {
      props: { options, label: 'Fruit', isOptional: true },
    })
    expect(wrapper.text()).toContain('Optional')
    expect(wrapper.text()).toContain('Fruit')
  })

  it('draws the status icon inside the field and keeps the chevron when the message is detached', () => {
    const attached = mount(Selector, {
      props: { options, label: 'Role', status: 'error', statusMessage: 'Please select a role' },
    })
    expect(attached.find('.astryx-icon--error').exists()).toBe(true)
    expect(attached.find('.astryx-selector-icon').exists()).toBe(false)
    expect(attached.text()).toContain('Please select a role')

    const detached = mount(Selector, {
      props: { options, label: 'Role', status: 'warning', statusMessage: 'Limited', statusVariant: 'detached' },
    })
    expect(detached.find('.astryx-field-status-glyph').exists()).toBe(false)
    expect(detached.find('.astryx-selector-icon').exists()).toBe(true)

    const tooltip = mount(Selector, {
      props: { options, label: 'Density', variant: 'ghost', status: 'warning', statusMessage: 'This setting affects all users', statusVariant: 'tooltip' },
    })
    expect(tooltip.get('button.astryx-field-status-glyph').attributes('aria-label')).toBe('Warning details')
    expect(tooltip.find('.astryx-selector-icon').exists()).toBe(false)
  })

  it('shows the selected option icon in the closed trigger', () => {
    const wrapper = mount(Selector, {
      props: {
        modelValue: 'private',
        label: 'Visibility',
        options: [{ value: 'private', label: 'Private', icon: 'lock-icon' }],
      },
    })
    expect(wrapper.get('.astryx-selector-value-icon').classes()).toContain('lock-icon')
    expect(wrapper.get('.astryx-selector-value').text()).toBe('Private')
  })

  it('puts an option icon beside the label and the check at the end', async () => {
    const wrapper = mount(Selector, {
      props: {
        options: [{ value: 'private', label: 'Private', description: 'Members only', icon: 'lock' }],
        modelValue: 'private',
      },
      attachTo: document.body,
    })
    await wrapper.get('.astryx-selector-trigger').trigger('click')
    await flushPromises()
    const controls = wrapper.get('.astryx-selector-trigger').attributes('aria-controls') ?? ''
    const listboxes = document.querySelectorAll(`[id="${controls}"]`)
    const option = listboxes[listboxes.length - 1]?.querySelector('.astryx-selector-option')
    const body = option?.querySelector('.astryx-selector-option-body')
    expect(body?.firstElementChild?.classList.contains('astryx-selector-option-icon')).toBe(true)
    expect(body?.querySelector('.astryx-selector-option-copy .astryx-selector-option-description')?.textContent).toContain('Members only')
    expect(option?.lastElementChild?.classList.contains('astryx-selector-option-mark')).toBe(true)
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
