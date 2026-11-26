import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import DateTimeInput from '../DateTimeInput/DateTimeInput.vue'
import FormLayout from '../FormLayout/FormLayout.vue'
import DateInput from './DateInput.vue'

function mockPointer(): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
    onchange: null,
  }))
}

beforeEach(mockPointer)

afterEach(() => {
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
})

function pressEnter(input: HTMLInputElement): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
  input.dispatchEvent(event)
  return event
}

function mountField(props: Record<string, unknown> = {}) {
  return mount(DateInput, { attachTo: document.body, props: { label: 'Due', presentation: 'popover', ...props } })
}

describe('dateInput 留下被拒的文字并说明原因', () => {
  it('读不成日期的文字打字时不报错，失焦时留在框里，显示原因并标成无效', async () => {
    const onEntryErrorChange = vi.fn()
    const wrapper = mountField({ modelValue: new Date(2026, 2, 21), onEntryErrorChange })
    const input = wrapper.get('input')
    await input.setValue('next tuesday')
    expect(wrapper.text()).not.toContain('Invalid date')
    expect(input.attributes('aria-invalid')).toBeUndefined()
    expect(onEntryErrorChange).not.toHaveBeenCalled()

    await input.trigger('blur')
    expect((input.element as HTMLInputElement).value).toBe('next tuesday')
    expect(wrapper.text()).toContain('Invalid date')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(onEntryErrorChange).toHaveBeenLastCalledWith({ kind: 'unreadable', text: 'next tuesday' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    // 改完仍然不对，拒绝继续亮着，不重新报。
    await input.setValue('next tuesda')
    expect(wrapper.text()).toContain('Invalid date')
    expect(onEntryErrorChange).toHaveBeenCalledTimes(1)

    // 改成能收的日子立刻消失，并提交。
    await input.setValue('2026-03-25')
    expect(wrapper.text()).not.toContain('Invalid date')
    expect(onEntryErrorChange).toHaveBeenLastCalledWith(null)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([new Date(2026, 2, 25)])
  })

  it('半截日期失焦时报 incomplete，显示读不成日期的那句话', async () => {
    const onEntryErrorChange = vi.fn()
    const wrapper = mountField({ onEntryErrorChange })
    const input = wrapper.get('input')
    await input.setValue('2026-0')
    await input.trigger('blur')
    expect(wrapper.text()).toContain('Invalid date')
    expect(onEntryErrorChange).toHaveBeenLastCalledWith({ kind: 'incomplete', text: '2026-0' })
  })

  it('打完整的日子超出范围时立刻说明，不提交', async () => {
    const onEntryErrorChange = vi.fn()
    const wrapper = mountField({ min: new Date(2026, 2, 10), onEntryErrorChange })
    const input = wrapper.get('input')
    await input.setValue('2026-03-05')
    expect(wrapper.text()).toContain('Enter a date on or after March 10, 2026')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(onEntryErrorChange).toHaveBeenLastCalledWith({ kind: 'outOfRange', text: '2026-03-05', date: '2026-03-05' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('被规则排除的日子报 unavailable，日历上没有的日子请人输入真实日期', async () => {
    const onEntryErrorChange = vi.fn()
    const wrapper = mountField({ isDateDisabled: (date: Date) => date.getDate() === 13, onEntryErrorChange })
    const input = wrapper.get('input')
    await input.setValue('2026-03-13')
    expect(wrapper.text()).toContain('Enter an available date')
    expect(onEntryErrorChange).toHaveBeenLastCalledWith({ kind: 'unavailable', text: '2026-03-13', date: '2026-03-13' })

    await input.setValue('2026-02-30')
    expect(wrapper.text()).toContain('Enter a real date')
    expect(onEntryErrorChange).toHaveBeenLastCalledWith({ kind: 'nonexistent', text: '2026-02-30' })
  })

  it('blur-or-enter 下打字什么都不亮，Enter 才亮', async () => {
    const wrapper = mountField({ min: new Date(2026, 2, 10), entryErrorBehavior: 'blur-or-enter' })
    const input = wrapper.get('input')
    await input.setValue('2026-03-05')
    expect(wrapper.text()).not.toContain('Enter a date on or after')
    expect(pressEnter(input.element as HTMLInputElement).defaultPrevented).toBe(true)
    await nextTick()
    expect(wrapper.text()).toContain('Enter a date on or after March 10, 2026')
  })

  it('不传时跟随 FormLayout 的默认值，字段自己的设置优先', async () => {
    const wrapper = mount(defineComponent({
      setup() {
        return () => h(FormLayout, { defaultEntryErrorBehavior: 'blur-or-enter' }, () => [
          h(DateInput, { 'label': 'Inherits', 'presentation': 'popover', 'min': new Date(2026, 2, 10), 'data-test': 'inherits' }),
          h(DateInput, { 'label': 'Own', 'presentation': 'popover', 'min': new Date(2026, 2, 10), 'entryErrorBehavior': 'complete', 'data-test': 'own' }),
        ])
      },
    }), { attachTo: document.body })
    const fields = wrapper.findAllComponents(DateInput)
    await fields[0]!.get('input').setValue('2026-03-05')
    await fields[1]!.get('input').setValue('2026-03-05')
    expect(fields[0]!.text()).not.toContain('Enter a date on or after')
    expect(fields[1]!.text()).toContain('Enter a date on or after')
  })

  it('没有监听时字段自己的说明顶替调用方的状态；监听了，调用方带说明的 error 替字段措辞，并念一次', async () => {
    const status = { type: 'error' as const, message: 'Pick a weekday' }
    const plain = mountField({ status })
    await plain.get('input').setValue('nope')
    await plain.get('input').trigger('blur')
    expect(plain.text()).toContain('Invalid date')
    expect(plain.text()).not.toContain('Pick a weekday')
    plain.unmount()

    const worded = mountField({ status, onEntryErrorChange: () => {} })
    const input = worded.get('input')
    await input.setValue('nope')
    await input.trigger('blur')
    expect(worded.text()).toContain('Pick a weekday')
    expect(worded.text()).not.toContain('Invalid date')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(worded.get('.astryx-date-input-alert').text()).toBe('Pick a weekday')
  })

  it('亮出拒绝那一刻传进来的值不顶掉文字，之后的新值才顶掉', async () => {
    const value = ref<Date | null>(new Date(2026, 2, 21))
    const wrapper = mount(defineComponent({
      setup() {
        return () => h(DateInput, {
          'label': 'Due',
          'presentation': 'popover',
          'modelValue': value.value,
          'onUpdate:modelValue': (next: Date | null) => {
            value.value = next
          },
          'onEntryErrorChange': (error: unknown) => {
            if (error)
              value.value = new Date(2026, 2, 1)
          },
        })
      },
    }), { attachTo: document.body })
    const input = wrapper.get('input')
    await input.setValue('nope')
    await input.trigger('blur')
    await nextTick()
    expect((input.element as HTMLInputElement).value).toBe('nope')
    expect(wrapper.text()).toContain('Invalid date')

    value.value = new Date(2026, 4, 1)
    await nextTick()
    expect((input.element as HTMLInputElement).value).toBe('May 1, 2026')
    expect(wrapper.text()).not.toContain('Invalid date')
  })

  it('打完整的日子提交一次，框里保留打的文字，失焦后才换成显示格式', async () => {
    const value = ref<Date | null>(null)
    const onUpdate = vi.fn((next: Date | null) => {
      value.value = next
    })
    const wrapper = mount(defineComponent({
      setup() {
        return () => h(DateInput, { 'label': 'Due', 'presentation': 'popover', 'modelValue': value.value, 'onUpdate:modelValue': onUpdate })
      },
    }), { attachTo: document.body })
    const input = wrapper.get('input')
    await input.setValue('2026-03-2')
    expect(onUpdate).not.toHaveBeenCalled()
    await input.setValue('2026-03-25')
    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect((input.element as HTMLInputElement).value).toBe('2026-03-25')
    await input.trigger('blur')
    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect((input.element as HTMLInputElement).value).toBe('March 25, 2026')
  })

  it('禁用时藏起拒绝，能改了再亮出来；留下读不成的文字后 Enter 照常提交表单', async () => {
    const wrapper = mountField()
    const input = wrapper.get('input')
    await input.setValue('nope')
    await input.trigger('blur')
    expect(wrapper.text()).toContain('Invalid date')
    expect(pressEnter(input.element as HTMLInputElement).defaultPrevented).toBe(false)

    await wrapper.setProps({ disabled: true })
    expect(wrapper.text()).not.toContain('Invalid date')
    await wrapper.setProps({ disabled: false })
    expect(wrapper.text()).toContain('Invalid date')
  })

  it('显示格式的文字改一改也能在失焦时提交', async () => {
    const wrapper = mountField({ modelValue: new Date(2026, 2, 21) })
    const input = wrapper.get('input')
    await input.setValue('March 22, 2026')
    await input.trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([new Date(2026, 2, 22)])
  })
})

describe('dateTimeInput 转发日期那段的拒绝', () => {
  it('日期那段的拒绝通过 entryErrorChange 报出来', async () => {
    const onEntryErrorChange = vi.fn()
    const wrapper = mount(DateTimeInput, {
      attachTo: document.body,
      props: { label: 'Starts', presentation: 'popover', onEntryErrorChange },
    })
    const input = wrapper.get('input.astryx-date-input-field')
    await input.setValue('nope')
    await input.trigger('blur')
    expect(onEntryErrorChange).toHaveBeenLastCalledWith({ kind: 'unreadable', text: 'nope' })
    expect(wrapper.text()).toContain('Invalid date')
  })
})
