import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import NumberInput from './NumberInput.vue'

function textInput(wrapper: ReturnType<typeof mount>) {
  return wrapper.get('input[type="text"]')
}

function inputElement(wrapper: ReturnType<typeof mount>): HTMLInputElement {
  return textInput(wrapper).element as HTMLInputElement
}

describe('numberInput', () => {
  it('renders with initial value', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 42,
      },
    })

    expect(inputElement(wrapper).value).toBe('42')
  })

  it('renders empty when value is null', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: null,
      },
    })

    expect(inputElement(wrapper).value).toBe('')
  })

  it('hides the number steppers by default', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
      },
    })

    expect(wrapper.find('.increment').exists()).toBe(false)
    expect(wrapper.find('.decrement').exists()).toBe(false)
  })

  it('increments value on button click', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        step: 1,
        hasNumberSteppers: true,
      },
    })

    const incrementButton = wrapper.get('.increment')
    expect(incrementButton.attributes('aria-label')).toBe('Increment')
    expect(incrementButton.find('.astryx-number-input-chevron').exists()).toBe(true)
    await incrementButton.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([6])
    expect(wrapper.emitted('change')?.[0]).toEqual([6])
  })

  it('decrements value on button click', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        step: 1,
        hasNumberSteppers: true,
      },
    })

    await wrapper.get('.decrement').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
    expect(wrapper.emitted('change')?.[0]).toEqual([4])
  })

  it('disables a stepper button at its bound', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 10,
        max: 10,
        hasNumberSteppers: true,
      },
    })

    expect(wrapper.get('.increment').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.decrement').attributes('disabled')).toBeUndefined()
  })

  it('increments with ArrowUp key', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
      },
    })

    await textInput(wrapper).trigger('keydown', { key: 'ArrowUp' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([6])
  })

  it('decrements with ArrowDown key', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
      },
    })

    await textInput(wrapper).trigger('keydown', { key: 'ArrowDown' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
  })

  it('lets a keydown listener cancel the arrow stepping', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        onKeydown: (event: KeyboardEvent) => event.preventDefault(),
      },
    })

    await textInput(wrapper).trigger('keydown', { key: 'ArrowUp' })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('commits a typed number on blur, not on each keystroke', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
      },
    })

    const input = inputElement(wrapper)
    input.value = '10'
    await input.dispatchEvent(new Event('input'))
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await textInput(wrapper).trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10])
  })

  it('keeps the typed text while editing and commits it on blur', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
      },
    })

    const input = inputElement(wrapper)
    input.value = '007'
    await input.dispatchEvent(new Event('input'))

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(input.value).toBe('007')

    await textInput(wrapper).trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([7])
  })

  it('commits a decimal on blur', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
      },
    })

    const input = inputElement(wrapper)
    input.value = '7.5'
    await input.dispatchEvent(new Event('input'))
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await textInput(wrapper).trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([7.5])
  })

  it('reverts an empty draft unless the field can be cleared', async () => {
    const kept = mount(NumberInput, {
      props: {
        modelValue: 5,
      },
    })
    inputElement(kept).value = ''
    await inputElement(kept).dispatchEvent(new Event('input'))
    await textInput(kept).trigger('blur')
    expect(kept.emitted('update:modelValue')).toBeUndefined()

    const cleared = mount(NumberInput, {
      props: {
        modelValue: 5,
        hasClear: true,
      },
    })
    inputElement(cleared).value = ''
    await inputElement(cleared).dispatchEvent(new Event('input'))
    expect(cleared.emitted('update:modelValue')).toBeUndefined()
    await textInput(cleared).trigger('blur')
    expect(cleared.emitted('update:modelValue')?.[0]).toEqual([null])
  })

  it('clamps to min and max on blur, and marks the draft invalid while typing', async () => {
    const below = mount(NumberInput, {
      props: {
        modelValue: 5,
        min: 0,
      },
    })
    inputElement(below).value = '-10'
    await inputElement(below).dispatchEvent(new Event('input'))
    expect(below.emitted('update:modelValue')).toBeUndefined()
    expect(textInput(below).attributes('aria-invalid')).toBe('true')
    expect(below.get('[role="alert"]').text()).toBe('Invalid number')
    await textInput(below).trigger('blur')
    expect(below.emitted('update:modelValue')?.[0]).toEqual([0])

    const above = mount(NumberInput, {
      props: {
        modelValue: 5,
        max: 10,
      },
    })
    inputElement(above).value = '20'
    await inputElement(above).dispatchEvent(new Event('input'))
    await textInput(above).trigger('blur')
    expect(above.emitted('update:modelValue')?.[0]).toEqual([10])
  })

  it('uses custom step', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 10,
        step: 5,
        hasNumberSteppers: true,
      },
    })

    await wrapper.get('.increment').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([15])
  })

  it('disables input and buttons when disabled', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        isDisabled: true,
        hasNumberSteppers: true,
      },
    })

    expect(textInput(wrapper).attributes('disabled')).toBeDefined()
    expect(wrapper.get('.increment').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.decrement').attributes('disabled')).toBeDefined()
  })

  it('still accepts the disabled alias', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        disabled: true,
      },
    })

    expect(textInput(wrapper).attributes('disabled')).toBeDefined()
  })

  it('displays placeholder', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: null,
        placeholder: 'Enter a number',
      },
    })

    expect(textInput(wrapper).attributes('placeholder')).toBe('Enter a number')
  })

  it('applies correct size class', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        size: 'lg',
      },
    })

    expect(wrapper.get('.astryx-number-input').classes()).toContain('size-lg')
  })

  it('passes the field name to the native input for form submission', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 42,
        htmlName: 'quantity',
      },
    })

    expect(textInput(wrapper).attributes('name')).toBe('quantity')
  })

  it('submits the raw number through a hidden input when formatting the value', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 42,
        htmlName: 'quantity',
        formatValue: (value: number) => `${value} items`,
      },
    })

    expect(textInput(wrapper).attributes('name')).toBeUndefined()
    const hidden = wrapper.get('input[type="hidden"][name="quantity"]')
    expect((hidden.element as HTMLInputElement).value).toBe('42')
  })

  it('still accepts the name alias', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 42,
        name: 'quantity',
      },
    })

    expect(textInput(wrapper).attributes('name')).toBe('quantity')
  })

  it('keeps text that is not a number until the field loses focus', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
      },
    })

    const input = inputElement(wrapper)
    input.value = 'abc'
    await input.dispatchEvent(new Event('input'))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(input.value).toBe('abc')
    expect(textInput(wrapper).attributes('aria-invalid')).toBe('true')

    await textInput(wrapper).trigger('blur')
    expect(input.value).toBe('5')
  })

  it('has correct inputmode attribute', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
      },
    })

    expect(textInput(wrapper).attributes('inputmode')).toBe('decimal')
  })

  it('shows the label, description, units, status message, and clear button', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 75,
        label: 'Progress',
        description: 'How far along the work is',
        units: '%',
        hasClear: true,
        status: { type: 'success', message: 'On track' },
      },
    })

    expect(wrapper.text()).toContain('Progress')
    expect(wrapper.text()).toContain('How far along the work is')
    expect(wrapper.text()).toContain('%')
    expect(wrapper.text()).toContain('On track')
    expect(wrapper.get('.astryx-number-input').attributes('data-status')).toBe('success')

    await wrapper.get('.astryx-number-input-clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
  })

  it('still accepts the clearable alias', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 75,
        clearable: true,
      },
    })

    expect(wrapper.find('.astryx-number-input-clear').exists()).toBe(true)
  })

  it('hides the clear button for an empty value', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: null,
        hasClear: true,
      },
    })

    expect(wrapper.find('.astryx-number-input-clear').exists()).toBe(false)
  })

  it('describes the input by the units text', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 50,
        units: '%',
      },
    })

    const describedBy = textInput(wrapper).attributes('aria-describedby')
    expect(describedBy).toBeDefined()
    expect(wrapper.get(`#${describedBy}`).text()).toBe('%')
  })

  it('exposes the value as a spinbutton', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        min: 0,
        max: 10,
      },
    })

    const input = textInput(wrapper)
    expect(input.attributes('role')).toBe('spinbutton')
    expect(input.attributes('aria-valuemin')).toBe('0')
    expect(input.attributes('aria-valuemax')).toBe('10')
    expect(input.attributes('aria-valuenow')).toBe('5')
  })

  describe('formatValue', () => {
    it('shows the formatted value while the input is not focused', () => {
      const wrapper = mount(NumberInput, {
        props: {
          modelValue: 1234,
          formatValue: (value: number) => `${value.toLocaleString('en-US')} items`,
        },
      })

      expect(inputElement(wrapper).value).toBe('1,234 items')
      expect(textInput(wrapper).attributes('aria-valuetext')).toBe('1,234 items')
    })

    it('shows the raw number while focused and the formatted value after blur', async () => {
      const wrapper = mount(NumberInput, {
        props: {
          modelValue: 1234,
          formatValue: (value: number) => `${value} items`,
        },
      })

      const input = inputElement(wrapper)
      await textInput(wrapper).trigger('focus')
      expect(input.value).toBe('1234')

      await textInput(wrapper).trigger('blur')
      expect(input.value).toBe('1234 items')
    })
  })

  describe('isIntegerOnly', () => {
    it('switches the input mode to numeric', () => {
      const wrapper = mount(NumberInput, {
        props: {
          modelValue: 5,
          isIntegerOnly: true,
        },
      })

      expect(textInput(wrapper).attributes('inputmode')).toBe('numeric')
    })

    it('does not commit a decimal value', async () => {
      const wrapper = mount(NumberInput, {
        props: {
          modelValue: 5,
          isIntegerOnly: true,
        },
      })

      const input = inputElement(wrapper)
      input.value = '5.5'
      await input.dispatchEvent(new Event('input'))

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(textInput(wrapper).attributes('aria-invalid')).toBe('true')
    })

    it('commits whole numbers', async () => {
      const wrapper = mount(NumberInput, {
        props: {
          modelValue: null,
          isIntegerOnly: true,
        },
      })

      const input = inputElement(wrapper)
      input.value = '7'
      await input.dispatchEvent(new Event('input'))
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()

      await textInput(wrapper).trigger('blur')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([7])
    })
  })

  describe('isReadOnly', () => {
    it('marks the input readonly and hides the clear button', () => {
      const wrapper = mount(NumberInput, {
        props: {
          modelValue: 5,
          isReadOnly: true,
          hasClear: true,
          hasNumberSteppers: true,
        },
      })

      expect(textInput(wrapper).attributes('readonly')).toBeDefined()
      expect(wrapper.find('.astryx-number-input-clear').exists()).toBe(false)
      expect(wrapper.get('.increment').attributes('disabled')).toBeDefined()
    })

    it('ignores arrow keys and typed text', async () => {
      const wrapper = mount(NumberInput, {
        props: {
          modelValue: 5,
          isReadOnly: true,
        },
      })

      await textInput(wrapper).trigger('keydown', { key: 'ArrowUp' })
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('disabledMessage', () => {
    it('keeps the input focusable and announces the reason', () => {
      const wrapper = mount(NumberInput, {
        props: {
          modelValue: 5,
          isDisabled: true,
          disabledMessage: 'Editing is locked while the order is processing',
        },
      })

      const input = textInput(wrapper)
      expect(input.attributes('disabled')).toBeUndefined()
      expect(input.attributes('aria-disabled')).toBe('true')
      expect(input.attributes('readonly')).toBeDefined()
      expect(wrapper.text()).toContain('Editing is locked while the order is processing')

      const describedBy = input.attributes('aria-describedby') ?? ''
      expect(describedBy.split(' ').some(id => id.includes('disabled'))).toBe(true)
    })

    it('still accepts the disabledReason alias', () => {
      const wrapper = mount(NumberInput, {
        props: {
          modelValue: 5,
          isDisabled: true,
          disabledReason: 'Locked',
        },
      })

      expect(wrapper.text()).toContain('Locked')
    })
  })

  it('focuses the input on mount with hasAutoFocus', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        hasAutoFocus: true,
      },
      attachTo: document.body,
    })

    expect(document.activeElement).toBe(inputElement(wrapper))
    wrapper.unmount()
  })

  it('passes autoComplete to the input', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        autoComplete: 'off',
      },
    })

    expect(textInput(wrapper).attributes('autocomplete')).toBe('off')
  })

  it('sizes the whole field with width', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        label: 'Quantity',
        width: 240,
      },
    })

    const field = wrapper.get('.astryx-field')
    expect(field.attributes('style')).toContain('--astryx-field-width: 240px')
  })

  it('shows the optionality hint from isOptional', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        label: 'Quantity',
        isOptional: true,
      },
    })

    expect(wrapper.text()).toContain('Optional')
    expect(textInput(wrapper).attributes('aria-required')).toBeUndefined()
  })

  it('marks the input required from isRequired', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        label: 'Quantity',
        isRequired: true,
      },
    })

    expect(textInput(wrapper).attributes('aria-required')).toBe('true')
  })

  it('shows the label tooltip', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        label: 'Quantity',
        labelTooltip: 'How many units you need',
      },
    })

    expect(wrapper.find('.astryx-field-info-tip').exists()).toBe(true)
  })

  it('renders the label icon slot', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
        label: 'Quantity',
      },
      slots: {
        labelIcon: () => h('svg', { class: 'test-label-icon' }),
      },
    })

    expect(wrapper.find('.test-label-icon').exists()).toBe(true)
  })

  it('renders the start icon slot', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
      },
      slots: {
        icon: () => h('svg', { class: 'test-start-icon' }),
      },
    })

    expect(wrapper.get('.astryx-number-input-icon').find('.test-start-icon').exists()).toBe(true)
  })

  it('emits focus, blur, and enter', async () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: 5,
      },
    })

    await textInput(wrapper).trigger('focus')
    await textInput(wrapper).trigger('blur')
    await textInput(wrapper).trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(wrapper.emitted('enter')).toHaveLength(1)
  })

  describe('wheel stepping', () => {
    function mountFocused(props: Record<string, unknown> = {}) {
      const wrapper = mount(NumberInput, {
        props: { modelValue: 5, ...props },
        attachTo: document.body,
      })
      const input = inputElement(wrapper)
      input.focus()
      return { wrapper, input }
    }

    it('steps the value when the focused input is scrolled', async () => {
      const { wrapper, input } = mountFocused()

      const event = new WheelEvent('wheel', { deltaY: -1, cancelable: true })
      input.dispatchEvent(event)
      await nextTick()

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([6])
      wrapper.unmount()
    })

    it('does nothing when isWheelEnabled is false', async () => {
      const { wrapper, input } = mountFocused({ isWheelEnabled: false })

      input.dispatchEvent(new WheelEvent('wheel', { deltaY: -1, cancelable: true }))
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      wrapper.unmount()
    })

    it('leaves the page scroll alone when the input is not focused', async () => {
      const wrapper = mount(NumberInput, {
        props: { modelValue: 5 },
        attachTo: document.body,
      })

      inputElement(wrapper).dispatchEvent(new WheelEvent('wheel', { deltaY: -1, cancelable: true }))
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      wrapper.unmount()
    })
  })

  it('reads a grouped paste on blur and steps from the draft', async () => {
    const wrapper = mount(NumberInput, {
      props: { modelValue: 5, hasNumberSteppers: true },
    })
    const input = inputElement(wrapper)
    input.value = '1,234'
    await input.dispatchEvent(new Event('input'))
    await wrapper.get('.increment').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1235])

    const pasted = mount(NumberInput, { props: { modelValue: 5 } })
    inputElement(pasted).value = '1,234'
    await inputElement(pasted).dispatchEvent(new Event('input'))
    expect(pasted.emitted('update:modelValue')).toBeUndefined()
    await textInput(pasted).trigger('blur')
    expect(pasted.emitted('update:modelValue')?.[0]).toEqual([1234])
  })

  it('rejects an unreadable draft and says the number is invalid', async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: 5 } })
    inputElement(wrapper).value = '12abc'
    await inputElement(wrapper).dispatchEvent(new Event('input'))
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(textInput(wrapper).attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[role="alert"]').text()).toBe('Invalid number')

    await textInput(wrapper).trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(inputElement(wrapper).value).toBe('12abc')

    await textInput(wrapper).trigger('blur')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(inputElement(wrapper).value).toBe('5')
  })

  it('works with v-model', async () => {
    const Host = defineComponent({
      components: { NumberInput },
      setup() {
        const value = ref<number | null>(1)
        return { value }
      },
      template: '<NumberInput v-model="value" label="Quantity" has-number-steppers />',
    })

    const wrapper = mount(Host)
    await wrapper.get('.increment').trigger('click')
    await nextTick()

    expect(inputElement(wrapper).value).toBe('2')
  })
})
