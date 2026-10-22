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

afterEach(() => {
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
})

describe('dateInput 触屏面板', () => {
  it('点一天就写入，面板留着，保存才收起', async () => {
    ensureDialogModalApi()
    const wrapper = mount(DateInput, {
      attachTo: document.body,
      props: { label: 'Due', presentation: 'bottom-sheet', modelValue: null },
    })
    const input = wrapper.get('input.astryx-date-input-field')
    expect(input.attributes('readonly')).toBe('')
    await input.trigger('click')
    await nextTick()
    const dialog = document.querySelector('dialog')
    expect(dialog?.hasAttribute('open')).toBe(true)
    expect(dialog?.textContent).toContain('Save')
    expect(dialog?.textContent).toContain('Reset')
    const day = dialog?.querySelector<HTMLButtonElement>('button[data-date]:not(.is-other-month):not(.is-disabled)')
    expect(day).toBeTruthy()
    day?.click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.length).toBeGreaterThan(0)
    expect(document.querySelector('dialog')?.hasAttribute('open')).toBe(true)
    const save = [...(dialog?.querySelectorAll('button') ?? [])].find(button => button.textContent === 'Save')
    save?.click()
    await nextTick()
    expect(document.querySelector('dialog')?.hasAttribute('open')).toBe(false)
  })

  it('标题打开月份和年份滚轮，同时藏起翻月箭头', async () => {
    ensureDialogModalApi()
    const wrapper = mount(DateInput, {
      attachTo: document.body,
      props: { label: 'Due', presentation: 'bottom-sheet', modelValue: new Date(2026, 2, 21) },
    })
    await wrapper.get('input').trigger('click')
    await nextTick()
    const title = document.querySelector<HTMLButtonElement>('.astryx-date-touch-title')
    expect(title?.getAttribute('aria-expanded')).toBe('false')
    title?.click()
    await nextTick()
    expect(document.querySelector('[role="listbox"][aria-label="Month"]')).not.toBeNull()
    expect(document.querySelector('[role="listbox"][aria-label="Year"]')).not.toBeNull()
    expect(document.querySelector('.astryx-date-touch-arrow')).toBeNull()
    expect(document.querySelector('.astryx-date-touch-reset')).toBeNull()
  })

  it('显式 presentation 压过 nativePicker', () => {
    mockPointer(false)
    const wrapper = mount(DateInput, {
      props: { label: 'Due', presentation: 'bottom-sheet', nativePicker: 'always', modelValue: null },
    })
    expect(wrapper.get('input').attributes('readonly')).toBe('')
    expect(wrapper.find('input[type="date"]').exists()).toBe(false)
  })

  it('不传 presentation 时，粗指针用系统日期控件，细指针可以打字', () => {
    mockPointer(true)
    const coarse = mount(DateInput, { props: { label: 'Due', modelValue: null } })
    expect(coarse.get('input').attributes('type')).toBe('date')
    coarse.unmount()
    mockPointer(false)
    const fine = mount(DateInput, { props: { label: 'Due', modelValue: null } })
    expect(fine.get('input.astryx-date-input-field').attributes('readonly')).toBeUndefined()
    expect(fine.find('input[type="date"]').exists()).toBe(false)
  })
})
