import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { resetLiveRegionsForTest } from '../composables/internal/announce.js'
import { ensureDialogModalApi } from '../Dialog/testUtils.js'
import DateInput from './DateInput.vue'

function nextFrame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()))
}

function politeRegion(): HTMLElement | null {
  return document.body.querySelector(':scope > [data-astryx-live-region="polite"]')
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

beforeEach(() => {
  mockPointer(false)
})

afterEach(() => {
  resetLiveRegionsForTest()
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
})

describe('dateInput 忙碌和禁用', () => {
  it('忙碌的字段不画成禁用的样子，禁用的才画', async () => {
    const wrapper = mount(DateInput, { props: { label: 'Due', presentation: 'popover', isLoading: true } })
    const box = wrapper.get('.astryx-date-input-wrapper')
    expect(box.attributes('data-disabled')).toBeUndefined()
    expect(box.attributes('data-busy')).toBe('true')
    expect(wrapper.get('input').attributes('aria-disabled')).toBe('true')

    await wrapper.setProps({ isLoading: false, disabled: true })
    expect(box.attributes('data-disabled')).toBe('true')
    expect(box.attributes('data-busy')).toBeUndefined()
  })

  it('系统日期控件那一路同样只在禁用时画成禁用', () => {
    const wrapper = mount(DateInput, { props: { label: 'Due', presentation: 'native', isLoading: true } })
    const box = wrapper.get('.astryx-date-input-wrapper')
    expect(box.attributes('data-disabled')).toBeUndefined()
    expect(box.attributes('data-busy')).toBe('true')
  })

  it.each(['popover', 'native'] as const)('%s：转圈不出声，进入忙碌时字段自己播报一次', async (presentation) => {
    const wrapper = mount(DateInput, { attachTo: document.body, props: { label: 'Due', presentation } })
    await nextFrame()
    expect(politeRegion()?.textContent ?? '').toBe('')

    await wrapper.setProps({ isLoading: true })
    await nextFrame()
    await nextFrame()
    const spinner = wrapper.get('.astryx-spinner')
    expect(spinner.attributes('aria-hidden')).toBe('true')
    expect(politeRegion()?.textContent).toBe('Loading')

    politeRegion()!.textContent = ''
    await wrapper.setProps({ modelValue: new Date(2026, 2, 1) })
    await nextFrame()
    expect(politeRegion()?.textContent).toBe('')

    await wrapper.setProps({ isLoading: false })
    await wrapper.setProps({ isLoading: true })
    await nextFrame()
    await nextFrame()
    expect(politeRegion()?.textContent).toBe('Loading')
  })

  it('底部面板开着时，忙碌从面板里播报', async () => {
    ensureDialogModalApi()
    const matches = HTMLElement.prototype.matches
    vi.spyOn(HTMLElement.prototype, 'matches').mockImplementation(function (this: HTMLElement, selector: string) {
      if (selector === ':modal')
        return this instanceof HTMLDialogElement && this.open
      return matches.call(this, selector)
    })
    const wrapper = mount(DateInput, { attachTo: document.body, props: { label: 'Due', presentation: 'bottom-sheet' } })
    await wrapper.get('input').trigger('click')
    await nextTick()
    await wrapper.setProps({ isLoading: true })
    await nextFrame()
    await nextFrame()
    const dialog = document.querySelector('dialog')
    const region = dialog?.querySelector(':scope > [data-astryx-live-region="polite"]')
    expect(region?.getAttribute('role')).toBe('status')
    expect(region?.textContent).toBe('Loading')
    expect(politeRegion()?.textContent ?? '').toBe('')
  })

  it('禁用的面板里按重置什么都不做，日历不翻回今天', async () => {
    ensureDialogModalApi()
    const wrapper = mount(DateInput, {
      attachTo: document.body,
      props: { label: 'Due', presentation: 'bottom-sheet', modelValue: new Date(2020, 2, 21) },
    })
    await wrapper.get('input').trigger('click')
    await nextTick()
    await wrapper.setProps({ disabled: true })
    const title = document.querySelector('.astryx-date-touch-title')
    const before = title?.textContent
    document.querySelector<HTMLButtonElement>('.astryx-date-touch-reset')?.click()
    await nextTick()
    expect(document.querySelector('.astryx-date-touch-title')?.textContent).toBe(before)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('dateInput 弹出日历', () => {
  it('关着的字段不挂日历，打开时才挂', async () => {
    const wrapper = mount(DateInput, { attachTo: document.body, props: { label: 'Due', presentation: 'popover' } })
    expect(document.querySelector('.astryx-calendar')).toBeNull()
    await wrapper.get('input').trigger('click')
    await nextTick()
    expect(document.querySelector('.astryx-calendar')).not.toBeNull()
  })

  it('按在输入框、label、清除按钮上日历不关，按在外面才关', async () => {
    const wrapper = mount(DateInput, {
      attachTo: document.body,
      props: { label: 'Due', presentation: 'popover', clearable: true, modelValue: new Date(2026, 2, 21) },
    })
    const input = wrapper.get('input')
    await input.trigger('click')
    await nextTick()
    const vm = wrapper.vm as unknown as { isOpen: boolean }
    expect(vm.isOpen).toBe(true)

    input.element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }))
    await nextTick()
    expect(vm.isOpen).toBe(true)

    const label = document.querySelector<HTMLLabelElement>(`label[for="${input.attributes('id')}"]`)
    expect(label).not.toBeNull()
    label!.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }))
    await nextTick()
    expect(vm.isOpen).toBe(true)

    const clear = wrapper.get('.astryx-date-input-clear')
    clear.element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }))
    await clear.trigger('click')
    await nextTick()
    expect(vm.isOpen).toBe(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }))
    await nextTick()
    expect(vm.isOpen).toBe(false)
  })

  it('焦点从字段移到外面的控件时日历关上，移进日历时不关', async () => {
    const outside = document.createElement('button')
    document.body.appendChild(outside)
    const wrapper = mount(DateInput, { attachTo: document.body, props: { label: 'Due', presentation: 'popover' } })
    const input = wrapper.get('input')
    await input.trigger('click')
    await nextTick()
    const vm = wrapper.vm as unknown as { isOpen: boolean }
    const day = document.querySelector<HTMLElement>('.astryx-calendar button')
    expect(day).not.toBeNull()

    input.element.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: day }))
    await nextTick()
    expect(vm.isOpen).toBe(true)

    input.element.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }))
    await nextTick()
    expect(vm.isOpen).toBe(true)

    input.element.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: outside }))
    await nextTick()
    expect(vm.isOpen).toBe(false)
  })
})

describe('dateInput 的 Enter', () => {
  function pressEnter(input: HTMLInputElement): KeyboardEvent {
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
    input.dispatchEvent(event)
    return event
  }

  it('没有打字时 Enter 照常提交表单', () => {
    const wrapper = mount(DateInput, { props: { label: 'Due', presentation: 'popover', modelValue: new Date(2026, 2, 21) } })
    expect(pressEnter(wrapper.get('input').element).defaultPrevented).toBe(false)
  })

  it('有打了一半的文字时 Enter 不提交表单，先收下文字', async () => {
    const wrapper = mount(DateInput, { props: { label: 'Due', presentation: 'popover', modelValue: new Date(2026, 2, 21) } })
    const input = wrapper.get('input')
    await input.setValue('2026-03')
    expect(pressEnter(input.element).defaultPrevented).toBe(true)
    await nextTick()
    expect(wrapper.text()).toContain('Invalid date')
  })

  it('禁用或忙碌的字段 Enter 不提交表单', async () => {
    const wrapper = mount(DateInput, { props: { label: 'Due', presentation: 'popover', disabled: true } })
    expect(pressEnter(wrapper.get('input').element).defaultPrevented).toBe(true)
    await wrapper.setProps({ disabled: false, isLoading: true })
    expect(pressEnter(wrapper.get('input').element).defaultPrevented).toBe(true)
  })
})
