import type { VueWrapper } from '@vue/test-utils'
import type { NumberInputEntryError } from './useTypedNumber.js'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { resetLiveRegionsForTest } from '../composables/testing/resetLiveRegions.js'
import FormLayout from '../FormLayout/FormLayout.vue'
import NumberInput from './NumberInput.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  resetLiveRegionsForTest()
  vi.useRealTimers()
  document.body.innerHTML = ''
})

type Wrapper = VueWrapper<InstanceType<typeof NumberInput>>

function render(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}): Wrapper {
  return mount(NumberInput, { attachTo: document.body, props: { label: 'Seats', modelValue: 5, ...props }, attrs })
}

function field(wrapper: Wrapper): HTMLInputElement {
  return wrapper.get<HTMLInputElement>('input[role="spinbutton"]').element
}

async function type(wrapper: Wrapper, text: string): Promise<void> {
  const input = field(wrapper)
  input.value = text
  input.dispatchEvent(new Event('input', { bubbles: true }))
  await nextTick()
}

async function key(wrapper: Wrapper, name: string): Promise<void> {
  await wrapper.get('input[role="spinbutton"]').trigger('keydown', { key: name })
  await nextTick()
}

async function blur(wrapper: Wrapper): Promise<void> {
  await wrapper.get('input[role="spinbutton"]').trigger('blur')
  await nextTick()
}

function description(wrapper: Wrapper): string {
  const ids = wrapper.get('input[role="spinbutton"]').attributes('aria-describedby') ?? ''
  return ids.split(' ').map(id => wrapper.find(`[id="${id}"]`).exists() ? wrapper.find(`[id="${id}"]`).text() : '').join(' ').trim()
}

describe('numberInput rejected entry', () => {
  it.each(['abc', '12abc', '5.5', ''])('marks, shows and announces nothing while %j is typed', async (text) => {
    const wrapper = render({ isIntegerOnly: true, hasClear: true })
    await type(wrapper, text)
    expect(wrapper.get('input[role="spinbutton"]').attributes('aria-invalid')).toBeUndefined()
    expect(wrapper.text()).not.toContain('Invalid number')
    expect(wrapper.get('[role="alert"]').text()).toBe('')
  })

  it('keeps unreadable text at Enter, shows the message as the error status and ties it to the input', async () => {
    const wrapper = render()
    await type(wrapper, '12abc')
    await key(wrapper, 'Enter')
    expect(field(wrapper).value).toBe('12abc')
    expect(wrapper.get('input[role="spinbutton"]').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('.astryx-number-input').attributes('data-status')).toBe('error')
    expect(description(wrapper)).toContain('Invalid number')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('keeps unreadable text at blur', async () => {
    const wrapper = render()
    await type(wrapper, 'abc')
    await blur(wrapper)
    expect(field(wrapper).value).toBe('abc')
    expect(wrapper.get('input[role="spinbutton"]').attributes('aria-invalid')).toBe('true')
  })

  it('rejects a fraction in a whole-number field, and any number while min is above max', async () => {
    const fraction = render({ isIntegerOnly: true })
    await type(fraction, '2.5')
    await key(fraction, 'Enter')
    expect(field(fraction).value).toBe('2.5')
    expect(fraction.get('input[role="spinbutton"]').attributes('aria-invalid')).toBe('true')

    const empty = render({ min: 10, max: 2 })
    await type(empty, '4')
    await key(empty, 'Enter')
    expect(field(empty).value).toBe('4')
    expect(empty.get('input[role="spinbutton"]').attributes('aria-invalid')).toBe('true')
  })

  it('still clamps a number outside an ordinary range and commits it', async () => {
    const wrapper = render({ min: 0, max: 10 })
    await type(wrapper, '50')
    await key(wrapper, 'Enter')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10])
    expect(wrapper.get('input[role="spinbutton"]').attributes('aria-invalid')).toBeUndefined()
  })

  it('keeps the rejection while edits leave the text wrong, and ends it when the text becomes valid or empty', async () => {
    const onChange = vi.fn()
    const wrapper = render({}, { onEntryErrorChange: onChange })
    await type(wrapper, 'abc')
    await key(wrapper, 'Enter')
    expect(onChange).toHaveBeenCalledTimes(1)
    await type(wrapper, 'abcd')
    expect(wrapper.get('input[role="spinbutton"]').attributes('aria-invalid')).toBe('true')
    expect(onChange).toHaveBeenCalledTimes(1)
    await type(wrapper, '8')
    expect(wrapper.get('input[role="spinbutton"]').attributes('aria-invalid')).toBeUndefined()
    expect(onChange).toHaveBeenLastCalledWith(null)

    await type(wrapper, 'x')
    await key(wrapper, 'Enter')
    await type(wrapper, '')
    expect(wrapper.get('input[role="spinbutton"]').attributes('aria-invalid')).toBeUndefined()
  })

  it('announces the rejection once through the field status, and not again for an edit that stays wrong', async () => {
    const wrapper = render()
    await type(wrapper, 'abc')
    await key(wrapper, 'Enter')
    await nextTick()
    const assertive = (): string => Array.from(document.querySelectorAll('[aria-live="assertive"]')).map(node => node.textContent?.trim() ?? '').join('')
    expect(assertive()).toBe('Invalid number')
    await type(wrapper, 'abcd')
    await nextTick()
    expect(assertive()).toBe('Invalid number')
  })

  it('lets a caller error status with a message replace the field message, but not a warning or a messageless error', async () => {
    const withMessage = render({ status: { type: 'error', message: 'Enter whole seats' } })
    await type(withMessage, 'abc')
    await key(withMessage, 'Enter')
    expect(description(withMessage)).toContain('Enter whole seats')
    expect(description(withMessage)).not.toContain('Invalid number')

    const warning = render({ status: { type: 'warning', message: 'Careful' } })
    await type(warning, 'abc')
    await key(warning, 'Enter')
    expect(description(warning)).toContain('Invalid number')

    const messageless = render({ status: { type: 'error' } })
    await type(messageless, 'abc')
    await key(messageless, 'Enter')
    expect(description(messageless)).toContain('Invalid number')
  })

  it('reports each rejection through entryErrorChange with its kind, text and number', async () => {
    const onChange = vi.fn<(error: NumberInputEntryError | null) => void>()
    const wrapper = render({ isIntegerOnly: true }, { onEntryErrorChange: onChange })
    await type(wrapper, 'abc')
    await key(wrapper, 'Enter')
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'unreadable', text: 'abc' })
    await type(wrapper, '2.5')
    await key(wrapper, 'Enter')
    // 草稿仍然被拒，但换成了另一种拒绝：再报一次。
    expect(onChange).toHaveBeenLastCalledWith({ kind: 'fractional', text: '2.5', value: 2.5 })
    await key(wrapper, 'Enter')
    expect(onChange).toHaveBeenCalledTimes(2)
    wrapper.unmount()
    expect(onChange).toHaveBeenLastCalledWith(null)
  })

  it('reports null at unmount only while a rejection stands', async () => {
    const onChange = vi.fn()
    const wrapper = render({}, { onEntryErrorChange: onChange })
    wrapper.unmount()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('lets a caller word the rejection through entryErrorChange', async () => {
    const Host = defineComponent({
      setup() {
        const entry = ref<NumberInputEntryError | null>(null)
        return () => h(NumberInput, {
          label: 'Seats',
          modelValue: 5,
          isIntegerOnly: true,
          onEntryErrorChange: (error: NumberInputEntryError | null) => { entry.value = error },
          status: entry.value?.kind === 'fractional' ? { type: 'error', message: 'Enter a whole number of seats' } : undefined,
        })
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const input = wrapper.get<HTMLInputElement>('input[role="spinbutton"]')
    input.element.value = '2.5'
    input.element.dispatchEvent(new Event('input', { bubbles: true }))
    await input.trigger('keydown', { key: 'Enter' })
    await nextTick()
    await nextTick()
    expect(wrapper.text()).toContain('Enter a whole number of seats')
    expect(wrapper.text()).not.toContain('Invalid number')
  })

  it('drops a rejected draft when a new value arrives, but keeps it for a value passed in the revealing commit', async () => {
    const wrapper = render()
    await type(wrapper, 'abc')
    // 揭示拒绝的同一刻传进来的值（调用方恢复自己的值）不顶掉草稿。
    const enter = wrapper.get('input[role="spinbutton"]').trigger('keydown', { key: 'Enter' })
    await wrapper.setProps({ modelValue: 6 })
    await enter
    expect(field(wrapper).value).toBe('abc')
    expect(wrapper.get('input[role="spinbutton"]').attributes('aria-invalid')).toBe('true')
    // 之后的新值才替换它。
    await wrapper.setProps({ modelValue: 9 })
    await nextTick()
    expect(field(wrapper).value).toBe('9')
    expect(wrapper.get('input[role="spinbutton"]').attributes('aria-invalid')).toBeUndefined()
  })

  it('judges a kept draft again under new rules, unless a new value replaced it', async () => {
    const wrapper = render({ isIntegerOnly: true })
    await type(wrapper, '2.5')
    await key(wrapper, 'Enter')
    expect(wrapper.get('input[role="spinbutton"]').attributes('aria-invalid')).toBe('true')
    await wrapper.setProps({ isIntegerOnly: false })
    expect(wrapper.get('input[role="spinbutton"]').attributes('aria-invalid')).toBeUndefined()
  })

  it('drops the draft and the rejection when the field turns disabled', async () => {
    const wrapper = render()
    await type(wrapper, 'abc')
    await key(wrapper, 'Enter')
    await wrapper.setProps({ isDisabled: true })
    expect(wrapper.get('input[role="spinbutton"]').attributes('aria-invalid')).toBeUndefined()
    await wrapper.setProps({ isDisabled: false })
    expect(wrapper.get('input[role="spinbutton"]').attributes('aria-invalid')).toBeUndefined()
    expect(field(wrapper).value).toBe('5')
  })

  it('posts the committed number while blur keeps a rejected draft, and gives the input its name back once edited', async () => {
    const form = document.createElement('form')
    document.body.append(form)
    const wrapper = mount(NumberInput, { attachTo: form, props: { label: 'Seats', modelValue: 5, htmlName: 'seats' } })
    const input = wrapper.get<HTMLInputElement>('input[role="spinbutton"]')
    input.element.value = 'abc'
    input.element.dispatchEvent(new Event('input', { bubbles: true }))
    await input.trigger('blur')
    expect(input.attributes('name')).toBeUndefined()
    expect(new FormData(form).get('seats')).toBe('5')
    input.element.value = 'abcd'
    input.element.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    expect(input.attributes('name')).toBe('seats')
  })

  it('keeps a draft that blur kept when the field is focused again', async () => {
    const wrapper = render()
    await type(wrapper, 'abc')
    await blur(wrapper)
    await wrapper.get('input[role="spinbutton"]').trigger('focus')
    expect(field(wrapper).value).toBe('abc')
  })

  it('shows the message from the status icon with statusVariant tooltip', async () => {
    const wrapper = render({ statusVariant: 'tooltip' })
    await type(wrapper, 'abc')
    await key(wrapper, 'Enter')
    expect(wrapper.find('.astryx-field-info-tip').exists()).toBe(true)
  })
})

describe('numberInput entryErrorBehavior', () => {
  it.each(['complete', 'blur-or-enter'] as const)('keeps the timing of %s and never writes it to the input', async (entryErrorBehavior) => {
    const wrapper = render({ entryErrorBehavior })
    await type(wrapper, 'abc')
    expect(wrapper.get('input[role="spinbutton"]').attributes('aria-invalid')).toBeUndefined()
    expect(wrapper.get('input[role="spinbutton"]').attributes('entryerrorbehavior')).toBeUndefined()
    expect(wrapper.get('input[role="spinbutton"]').attributes('entry-error-behavior')).toBeUndefined()
    await key(wrapper, 'Enter')
    expect(wrapper.get('input[role="spinbutton"]').attributes('aria-invalid')).toBe('true')
  })

  it('reads no FormLayout default', async () => {
    const wrapper = mount(FormLayout, {
      props: { defaultEntryErrorBehavior: 'blur-or-enter' },
      slots: { default: () => h(NumberInput, { label: 'Seats', modelValue: 5 }) },
      attachTo: document.body,
    })
    const input = wrapper.get<HTMLInputElement>('input[role="spinbutton"]')
    input.element.value = 'abc'
    input.element.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    expect(input.attributes('aria-invalid')).toBeUndefined()
    await input.trigger('keydown', { key: 'Enter' })
    expect(input.attributes('aria-invalid')).toBe('true')
  })
})
