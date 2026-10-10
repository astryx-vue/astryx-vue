import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import Selector from './Selector.vue'
import type { ComboboxOption } from './types.js'

describe('Selector', () => {
  const options: ComboboxOption[] = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ]

  it('应该正确渲染', () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        modelValue: '',
        placeholder: 'Select an option',
      },
    })

    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('input').attributes('placeholder')).toBe('Select an option')
  })

  it('点击输入框应该打开下拉列表', async () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        modelValue: '',
      },
      attachTo: document.body,
    })

    const input = wrapper.find('input')
    await input.trigger('click')
    await nextTick()

    const listbox = document.querySelector('[role="listbox"]')
    expect(listbox).toBeTruthy()

    wrapper.unmount()
  })

  it('应该正确显示已选中的选项', () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        modelValue: '2',
      },
    })

    const input = wrapper.find('input')
    expect(input.element.value).toBe('Option 2')
  })

  it('清除按钮应该清空选择', async () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        modelValue: '2',
        clearable: true,
      },
    })

    const clearButton = wrapper.find('[aria-label="Clear selection"]')
    expect(clearButton.exists()).toBe(true)

    await clearButton.trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
  })

  it('输入搜索应该过滤选项', async () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        modelValue: '',
        searchable: true,
      },
      attachTo: document.body,
    })

    const input = wrapper.find('input')
    await input.trigger('click')
    await nextTick()

    await input.setValue('Option 1')
    await nextTick()

    const listbox = document.querySelector('[role="listbox"]')
    const visibleOptions = listbox?.querySelectorAll('[role="option"]')

    expect(visibleOptions?.length).toBe(1)
    expect(visibleOptions?.[0].textContent).toContain('Option 1')

    wrapper.unmount()
  })

  it('禁用状态应该正确应用', () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        modelValue: '',
        disabled: true,
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('disabled')).toBeDefined()
  })

  it('必填状态应该正确应用', () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        modelValue: '',
        required: true,
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('required')).toBeDefined()
  })

  it('键盘导航应该正确工作', async () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        modelValue: '',
      },
      attachTo: document.body,
    })

    const input = wrapper.find('input')
    await input.trigger('click')
    await nextTick()

    await input.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    const firstOption = document.querySelector('[role="option"][data-active="true"]')
    expect(firstOption).toBeTruthy()

    wrapper.unmount()
  })
})
