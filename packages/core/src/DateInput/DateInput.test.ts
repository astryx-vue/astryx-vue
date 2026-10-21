import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import DateInput from './DateInput.vue'

function ensureDialogModalApi(): void {
  const proto = HTMLDialogElement.prototype as unknown as Record<string, unknown>
  if (typeof proto.showModal === 'function')
    return
  Object.defineProperty(proto, 'open', {
    configurable: true,
    get(this: HTMLDialogElement) {
      return this.hasAttribute('open')
    },
    set(this: HTMLDialogElement, value: boolean) {
      if (value)
        this.setAttribute('open', '')
      else
        this.removeAttribute('open')
    },
  })
  proto.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  proto.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open')
  }
}

function mockPointer(coarse: boolean): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: coarse && query === '(pointer: coarse)',
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
    onchange: null,
  }))
}

describe('dateInput', () => {
  it('renders component', () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
      },
    })

    expect(wrapper.find('.astryx-date-input').exists()).toBe(true)
  })

  it('formats a committed date as a long date by default', () => {
    const testDate = new Date(2024, 2, 15)
    const wrapper = mount(DateInput, {
      props: {
        modelValue: testDate,
      },
    })

    const vm = wrapper.vm as any
    expect(vm.inputValue).toBe('March 15, 2024')
  })

  it('formats named and custom display values from the committed date', () => {
    const testDate = new Date(2026, 2, 21)
    const read = (format: 'date' | 'date_long' | 'date_weekday' | 'system_date' | ((iso: string) => string)) => {
      const wrapper = mount(DateInput, { props: { modelValue: testDate, format } })
      return (wrapper.vm as any).inputValue as string
    }

    expect(read('date')).toBe('Mar 21, 2026')
    expect(read('date_long')).toBe('March 21, 2026')
    expect(read('date_weekday')).toBe('Sat, Mar 21, 2026')
    expect(read('system_date')).toBe('2026-03-21')
    expect(read(iso => `Ship by ${iso}`)).toBe('Ship by 2026-03-21')
  })

  it('handles null value', () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
      },
    })

    const vm = wrapper.vm as any
    expect(vm.inputValue).toBe('')
  })

  it('opens the calendar from a click, not from focus alone', async () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
      },
    })

    const input = wrapper.get('input.astryx-date-input-field')
    await input.trigger('focus')
    expect((wrapper.vm as any).isOpen).toBe(false)

    await input.trigger('click')
    expect((wrapper.vm as any).isOpen).toBe(true)
  })

  it('closes popover after selecting date', async () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
      },
    })

    const vm = wrapper.vm as any
    vm.isOpen = true

    vm.onCalendarChange(new Date(2024, 2, 15))
    await nextTick()

    expect(vm.isOpen).toBe(false)
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('clears value', async () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: new Date(2024, 2, 15),
        clearable: true,
      },
    })

    const vm = wrapper.vm as any
    vm.onClear(new Event('click'))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
  })

  it('applies disabled prop', () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
        disabled: true,
      },
    })

    expect(wrapper.props('disabled')).toBe(true)
  })

  it('applies size classes', () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
        size: 'sm',
      },
    })

    expect(wrapper.find('.astryx-date-input').classes()).toContain('size-sm')
  })

  it('applies status classes', () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
        status: 'error',
      },
    })

    expect(wrapper.find('.astryx-date-input').classes()).toContain('status-error')
  })

  it('shows the label, description, and status message', () => {
    const wrapper = mount(DateInput, {
      props: {
        label: 'Event date',
        description: 'Pick a date for your event',
        modelValue: new Date(2026, 0, 25),
        status: { type: 'error', message: 'This date is already booked' },
      },
    })

    expect(wrapper.text()).toContain('Event date')
    expect(wrapper.text()).toContain('Pick a date for your event')
    expect(wrapper.text()).toContain('This date is already booked')
    expect(wrapper.get('input.astryx-date-input-field').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('label').attributes('for')).toBe(wrapper.get('input.astryx-date-input-field').attributes('id'))
  })

  it('parses date string', () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
      },
    })

    const vm = wrapper.vm as any
    const parsed = vm.parseDate('2024-03-15')

    expect(parsed).toBeInstanceOf(Date)
    expect(parsed.getFullYear()).toBe(2024)
    expect(parsed.getMonth()).toBe(2)
    expect(parsed.getDate()).toBe(15)
  })

  it('returns null for invalid date string', () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
      },
    })

    const vm = wrapper.vm as any
    const parsed = vm.parseDate('invalid')

    expect(parsed).toBeNull()
  })

  it('passes props to calendar', () => {
    const min = new Date(2024, 0, 1)
    const max = new Date(2024, 11, 31)

    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
        min,
        max,
      },
    })

    expect(wrapper.props('min')).toEqual(min)
    expect(wrapper.props('max')).toEqual(max)
  })

  it('opens the calendar in a bottom sheet when presentation is bottom-sheet', async () => {
    ensureDialogModalApi()
    const wrapper = mount(DateInput, {
      attachTo: document.body,
      props: {
        label: 'Booking date',
        presentation: 'bottom-sheet',
        modelValue: null,
      },
    })

    expect(wrapper.find('.astryx-date-input').attributes('data-presentation')).toBe('bottom-sheet')
    expect(document.querySelector('dialog')?.hasAttribute('open')).toBe(false)

    await wrapper.get('input.astryx-date-input-field').trigger('click')
    await nextTick()

    expect(document.querySelector('dialog')?.hasAttribute('open')).toBe(true)
    expect(document.querySelector('.astryx-popover')?.getAttribute('style') ?? '').toContain('display: none')
    wrapper.unmount()
  })

  it('uses a bottom sheet for adaptive-bottom-sheet only on a coarse pointer', async () => {
    ensureDialogModalApi()
    mockPointer(true)
    const coarse = mount(DateInput, {
      attachTo: document.body,
      props: { presentation: 'adaptive-bottom-sheet', modelValue: null },
    })
    expect(coarse.find('.astryx-date-input').attributes('data-presentation')).toBe('bottom-sheet')
    coarse.unmount()

    mockPointer(false)
    const fine = mount(DateInput, {
      attachTo: document.body,
      props: { presentation: 'adaptive-bottom-sheet', modelValue: null },
    })
    await fine.get('input.astryx-date-input-field').trigger('click')
    await nextTick()
    expect(fine.find('.astryx-date-input').attributes('data-presentation')).toBe('popover')
    expect(document.querySelector('dialog')).toBeNull()
    expect((fine.vm as any).isOpen).toBe(true)
    fine.unmount()
    vi.unstubAllGlobals()
  })

  it('uses the system date control and marks the field required', () => {
    const wrapper = mount(DateInput, {
      props: {
        presentation: 'native',
        label: 'Due',
        modelValue: new Date(2026, 2, 21),
        isRequired: true,
        labelTooltip: 'Ship on a weekday',
      },
    })
    const input = wrapper.get('input')
    expect(input.attributes('type')).toBe('date')
    expect(input.element.value).toBe('2026-03-21')
    expect(input.attributes('aria-required')).toBe('true')
    expect(wrapper.text()).toContain('March 21, 2026')
    expect(wrapper.find('.astryx-date-input').attributes('data-presentation')).toBe('native')
  })

  it('follows nativePicker when presentation is omitted', () => {
    const always = mount(DateInput, { props: { nativePicker: 'always', modelValue: null, label: 'Due' } })
    expect(always.get('input').attributes('type')).toBe('date')
    always.unmount()

    mockPointer(true)
    const touch = mount(DateInput, { props: { nativePicker: 'touch', modelValue: null, label: 'Due' } })
    expect(touch.get('input').attributes('type')).toBe('date')
    touch.unmount()
    vi.unstubAllGlobals()
  })

  it('disables the field and runs changeAction after the value is committed', async () => {
    let release: () => void = () => {}
    const changeAction = vi.fn(() => new Promise<void>((resolve) => {
      release = resolve
    }))
    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
        presentation: 'popover',
        label: 'Due',
        isOptional: true,
        isLoading: false,
        changeAction,
      },
    })
    expect(wrapper.text()).toContain('Optional')
    const input = wrapper.get('input.astryx-date-input-field')
    await input.setValue('2026-03-15')
    await input.trigger('input')
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(new Date(2026, 2, 15))
    expect(changeAction).toHaveBeenCalledWith(new Date(2026, 2, 15))
    expect(input.attributes('aria-busy')).toBe('true')
    expect(input.attributes('disabled')).toBeDefined()
    expect(wrapper.find('.astryx-date-input-spinner').exists()).toBe(true)
    release()
    await nextTick()
    await Promise.resolve()
    await nextTick()
    expect(wrapper.get('input.astryx-date-input-field').attributes('aria-busy')).toBeUndefined()
  })

  it('shows the clear button through hasClear and through the older clearable name', () => {
    const viaHasClear = mount(DateInput, { props: { label: 'Due', modelValue: new Date(2026, 2, 15), hasClear: true } })
    expect(viaHasClear.find('.astryx-date-input-clear').exists()).toBe(true)

    const viaClearable = mount(DateInput, { props: { label: 'Due', modelValue: new Date(2026, 2, 15), clearable: true } })
    expect(viaClearable.find('.astryx-date-input-clear').exists()).toBe(true)

    const withoutClear = mount(DateInput, { props: { label: 'Due', modelValue: new Date(2026, 2, 15) } })
    expect(withoutClear.find('.astryx-date-input-clear').exists()).toBe(false)
  })

  it('returns focus to the input after clearing', async () => {
    const wrapper = mount(DateInput, {
      props: { label: 'Due', modelValue: new Date(2026, 2, 15), hasClear: true },
      attachTo: document.body,
    })
    await wrapper.get('.astryx-date-input-clear').trigger('click')
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
    expect(document.activeElement).toBe(wrapper.get('input.astryx-date-input-field').element)
  })

  it('keeps a disabled field focusable while a disabledMessage explains why', async () => {
    const wrapper = mount(DateInput, {
      props: { label: 'Due', modelValue: new Date(2026, 2, 15), disabled: true, disabledMessage: 'Only editors can change the date' },
      attachTo: document.body,
    })
    const input = wrapper.get<HTMLInputElement>('input.astryx-date-input-field')
    expect(input.attributes('disabled')).toBeUndefined()
    expect(input.attributes('readonly')).toBe('')
    expect(input.attributes('aria-disabled')).toBe('true')
    expect(input.attributes('aria-describedby')?.split(' ')).toContain(`${input.attributes('id')}-disabled`)
    expect(wrapper.text()).toContain('Only editors can change the date')

    input.element.focus()
    await nextTick()
    const tooltip = document.querySelector<HTMLElement>('[role="tooltip"]')
    expect(tooltip?.textContent).toBe('Only editors can change the date')
    expect(tooltip?.style.display).not.toBe('none')
  })

  it('treats a blank disabledMessage as absent', () => {
    const wrapper = mount(DateInput, { props: { label: 'Due', disabled: true, disabledMessage: '   ' } })
    expect(wrapper.get('input.astryx-date-input-field').attributes('disabled')).toBeDefined()
    expect(wrapper.get('input.astryx-date-input-field').attributes('aria-disabled')).toBeUndefined()
  })

  it('rejects a native date that fails a constraint', async () => {
    const wrapper = mount(DateInput, {
      props: {
        presentation: 'native',
        label: 'Due',
        modelValue: new Date(2026, 2, 20),
        dateConstraints: [(date: Date) => date.getDay() !== 0],
      },
    })
    const input = wrapper.get('input')
    input.element.value = '2026-03-22'
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.get('[role="alert"]').text()).toContain('Invalid date')
  })
})

afterEach(() => {
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
})
