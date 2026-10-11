import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import NumberInput from './NumberInput.vue'

describe('numberInput', () => {
  it('renders with initial value', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 42,
      },
    })

    const input = wrapper.find('input[type="text"]')
    expect((input.element as HTMLInputElement).value).toBe('42')
  })

  it('renders empty when value is null', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: null,
      },
    })

    const input = wrapper.find('input[type="text"]')
    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('increments value on button click', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        step: 1,
      },
    })

    const incrementButton = wrapper.find('.increment')
    await incrementButton.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([6])
    expect(wrapper.emitted('change')?.[0]).toEqual([6])
  })

  it('decrements value on button click', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        step: 1,
      },
    })

    const decrementButton = wrapper.find('.decrement')
    await decrementButton.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
    expect(wrapper.emitted('change')?.[0]).toEqual([4])
  })

  it('increments with ArrowUp key', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
      },
    })

    const input = wrapper.find('input[type="text"]')
    await input.trigger('keydown', { key: 'ArrowUp' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([6])
  })

  it('decrements with ArrowDown key', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
      },
    })

    const input = wrapper.find('input[type="text"]')
    await input.trigger('keydown', { key: 'ArrowDown' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
  })

  it('updates value on input', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
      },
    })

    const input = wrapper.find('input[type="text"]').element as HTMLInputElement
    input.value = '10'
    await input.dispatchEvent(new Event('input'))

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10])
  })

  it('handles decimal input', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
      },
    })

    const input = wrapper.find('input[type="text"]').element as HTMLInputElement
    input.value = '7.5'
    await input.dispatchEvent(new Event('input'))

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([7.5])
  })

  it('clears value with empty input', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
      },
    })

    const input = wrapper.find('input[type="text"]').element as HTMLInputElement
    input.value = ''
    await input.dispatchEvent(new Event('input'))

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
  })

  it('respects min constraint', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        min: 0,
      },
    })

    const input = wrapper.find('input[type="text"]').element as HTMLInputElement
    input.value = '-10'
    await input.dispatchEvent(new Event('input'))

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])
  })

  it('respects max constraint', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        max: 10,
      },
    })

    const input = wrapper.find('input[type="text"]').element as HTMLInputElement
    input.value = '20'
    await input.dispatchEvent(new Event('input'))

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10])
  })

  it('uses custom step', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 10,
        step: 5,
      },
    })

    const incrementButton = wrapper.find('.increment')
    await incrementButton.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([15])
  })

  it('disables input and buttons when disabled', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        disabled: true,
      },
    })

    const input = wrapper.find('input[type="text"]')
    const incrementButton = wrapper.find('.increment')
    const decrementButton = wrapper.find('.decrement')

    expect(input.attributes('disabled')).toBeDefined()
    expect(incrementButton.attributes('disabled')).toBeDefined()
    expect(decrementButton.attributes('disabled')).toBeDefined()
  })

  it('displays placeholder', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: null,
        placeholder: 'Enter a number',
      },
    })

    const input = wrapper.find('input[type="text"]')
    expect(input.attributes('placeholder')).toBe('Enter a number')
  })

  it('applies correct size class', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        size: 'lg',
      },
    })

    expect(wrapper.find('.astryx-number-input').classes()).toContain('size-lg')
  })

  it('includes hidden input for form submission', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 42,
        name: 'quantity',
      },
    })

    const hiddenInput = wrapper.find('input[type="hidden"][name="quantity"]')
    expect(hiddenInput.exists()).toBe(true)
    expect((hiddenInput.element as HTMLInputElement).value).toBe('42')
  })

  it('rejects invalid input', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
      },
    })

    const input = wrapper.find('input[type="text"]').element as HTMLInputElement
    input.value = 'abc'
    await input.dispatchEvent(new Event('input'))
    await nextTick()

    // 应该恢复到上一个有效值
    expect(input.value).toBe('5')
  })

  it('has correct inputmode attribute', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
      },
    })

    const input = wrapper.find('input[type="text"]')
    expect(input.attributes('inputmode')).toBe('decimal')
  })
})
