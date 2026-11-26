import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import PickerWheel from './PickerWheel.vue'
import TouchDateSheet from './TouchDateSheet.vue'

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

function arrow(label: string): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>(`.astryx-date-touch-arrow[aria-label="${label}"]`)
}

async function openWheels(): Promise<void> {
  document.querySelector<HTMLButtonElement>('.astryx-date-touch-title')?.click()
  await nextTick()
}

describe('touchDateSheet 翻月箭头的焦点', () => {
  it('聚焦的下一月箭头到了范围尽头消失时，焦点交给上一月箭头', async () => {
    mount(TouchDateSheet, {
      attachTo: document.body,
      props: { selected: new Date(2026, 2, 10), min: new Date(2026, 0, 1), max: new Date(2026, 3, 30) },
    })
    await nextTick()
    const next = arrow('Next month')
    next?.focus()
    next?.click()
    await nextTick()
    await nextTick()
    expect(arrow('Next month')).toBeNull()
    expect(document.activeElement).toBe(arrow('Previous month'))
  })

  it('上一月箭头消失时，焦点交给这时才出现的下一月箭头', async () => {
    const wrapper = mount(TouchDateSheet, {
      attachTo: document.body,
      props: { selected: new Date(2026, 2, 10), min: new Date(2026, 1, 1), max: new Date(2026, 2, 31) },
    })
    await nextTick()
    expect(arrow('Next month')).toBeNull()
    const prev = wrapper.get<HTMLButtonElement>('.astryx-date-touch-arrow[aria-label="Previous month"]').element
    prev.focus()
    prev.click()
    await nextTick()
    await nextTick()
    expect(arrow('Previous month')).toBeNull()
    expect(document.activeElement).toBe(arrow('Next month'))
  })
})

describe('touchDateSheet 的月份年份滚轮', () => {
  it('手指下，滚轮带着已选日期走，月底没有的日子落在月底', async () => {
    mockPointer(true)
    const wrapper = mount(TouchDateSheet, { attachTo: document.body, props: { selected: new Date(2026, 0, 31) } })
    await nextTick()
    await openWheels()
    wrapper.findAllComponents(PickerWheel)[0]!.vm.$emit('update:modelValue', '2')
    await nextTick()
    expect(wrapper.emitted('pick')?.at(-1)).toEqual([new Date(2026, 1, 28)])

    wrapper.findAllComponents(PickerWheel)[1]!.vm.$emit('update:modelValue', '2028')
    await nextTick()
    expect(wrapper.emitted('pick')?.at(-1)).toEqual([new Date(2028, 1, 29)])
  })

  it('落点超出最大日期时收进范围里', async () => {
    mockPointer(true)
    const wrapper = mount(TouchDateSheet, {
      attachTo: document.body,
      props: { selected: new Date(2026, 0, 25), max: new Date(2026, 2, 10) },
    })
    await nextTick()
    await openWheels()
    wrapper.findAllComponents(PickerWheel)[0]!.vm.$emit('update:modelValue', '3')
    await nextTick()
    expect(wrapper.emitted('pick')?.at(-1)).toEqual([new Date(2026, 2, 10)])
  })

  it('约束拒绝的日子不选，只翻日历', async () => {
    mockPointer(true)
    const wrapper = mount(TouchDateSheet, {
      attachTo: document.body,
      props: { selected: new Date(2026, 0, 15), isDateDisabled: (date: Date) => date.getMonth() === 1 },
    })
    await nextTick()
    await openWheels()
    wrapper.findAllComponents(PickerWheel)[0]!.vm.$emit('update:modelValue', '2')
    await nextTick()
    expect(wrapper.emitted('pick')).toBeUndefined()
    expect(document.querySelector('.astryx-date-touch-title')?.textContent).toContain('February')
  })

  it('没有已选日期，或者用鼠标时，滚轮只翻日历', async () => {
    mockPointer(true)
    const empty = mount(TouchDateSheet, { attachTo: document.body, props: { selected: null } })
    await nextTick()
    await openWheels()
    empty.findAllComponents(PickerWheel)[0]!.vm.$emit('update:modelValue', '2')
    await nextTick()
    expect(empty.emitted('pick')).toBeUndefined()
    empty.unmount()

    mockPointer(false)
    const mouse = mount(TouchDateSheet, { attachTo: document.body, props: { selected: new Date(2026, 0, 15) } })
    await nextTick()
    await openWheels()
    mouse.findAllComponents(PickerWheel)[0]!.vm.$emit('update:modelValue', '2')
    await nextTick()
    expect(mouse.emitted('pick')).toBeUndefined()
  })
})
