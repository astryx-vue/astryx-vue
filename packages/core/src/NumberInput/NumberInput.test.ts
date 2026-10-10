import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import NumberInput from './NumberInput.vue'

describe('NumberInput', () => {
  it('应该正确渲染', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        min: 0,
        max: 10,
      },
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.element.value).toBe('5')
  })

  it('递增按钮应该增加值', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        min: 0,
        max: 10,
        step: 1,
      },
    })

    const incrementButton = wrapper.find('[aria-label="Increment"]')
    await incrementButton.trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([6])
  })

  it('递减按钮应该减少值', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        min: 0,
        max: 10,
        step: 1,
      },
    })

    const decrementButton = wrapper.find('[aria-label="Decrement"]')
    await decrementButton.trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
  })

  it('不应该超过最大值', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 10,
        min: 0,
        max: 10,
        step: 1,
      },
    })

    const incrementButton = wrapper.find('[aria-label="Increment"]')
    await incrementButton.trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('不应该低于最小值', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 0,
        min: 0,
        max: 10,
        step: 1,
      },
    })

    const decrementButton = wrapper.find('[aria-label="Decrement"]')
    await decrementButton.trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('应该支持自定义步进值', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 0,
        min: 0,
        max: 20,
        step: 5,
      },
    })

    const incrementButton = wrapper.find('[aria-label="Increment"]')
    await incrementButton.trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([5])
  })

  it('输入框应该允许手动输入', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        min: 0,
        max: 10,
      },
    })

    const input = wrapper.find('input')
    await input.setValue('7')
    await input.trigger('blur')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([7])
  })

  it('禁用状态应该禁用所有按钮', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        min: 0,
        max: 10,
        disabled: true,
      },
    })

    const input = wrapper.find('input')
    const incrementButton = wrapper.find('[aria-label="Increment"]')
    const decrementButton = wrapper.find('[aria-label="Decrement"]')

    expect(input.attributes('disabled')).toBeDefined()
    expect(incrementButton.attributes('disabled')).toBeDefined()
    expect(decrementButton.attributes('disabled')).toBeDefined()
  })

  it('键盘上下箭头应该递增/递减值', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        min: 0,
        max: 10,
        step: 1,
      },
    })

    const input = wrapper.find('input')

    await input.trigger('keydown', { key: 'ArrowUp' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([6])

    await wrapper.setProps({ modelValue: 6 })

    await input.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([5])
  })
})
