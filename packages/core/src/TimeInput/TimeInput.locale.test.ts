import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import DateTimeInput from '../DateTimeInput/DateTimeInput.vue'
import { provideAstryxLocale } from '../locale/index.js'
import TimeInput from './TimeInput.vue'

beforeEach(() => {
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
})

afterEach(() => {
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
})

function inLocale(locale: string, child: () => ReturnType<typeof h>) {
  return mount(defineComponent({
    setup() {
      provideAstryxLocale(locale)
      return child
    },
  }), { attachTo: document.body })
}

describe('timeInput 按语言写时间', () => {
  it.each([
    ['en-US', '2:30 PM'],
    ['en-GB', '14:30'],
    ['de-DE', '14:30'],
    ['zh-CN', '14:30'],
    ['ko-KR', '오후 2:30'],
  ])('没写 hourFormat 时，%s 写成 %s', (locale, expected) => {
    const wrapper = inLocale(locale, () => h(TimeInput, { label: 'Time', modelValue: '14:30', presentation: 'text-input' }))
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe(expected)
  })

  it('写明的 hourFormat 压过语言的时制', () => {
    const twelve = inLocale('de-DE', () => h(TimeInput, { label: 'Time', modelValue: '14:30', hourFormat: '12h', presentation: 'text-input' }))
    expect((twelve.get('input').element as HTMLInputElement).value).toBe('2:30 PM')
    const twentyFour = inLocale('en-US', () => h(TimeInput, { label: 'Time', modelValue: '14:30', hourFormat: '24h', presentation: 'text-input' }))
    expect((twentyFour.get('input').element as HTMLInputElement).value).toBe('14:30')
  })

  it('读得回自己写出来的文字，也读得懂语言的上午下午', async () => {
    const wrapper = inLocale('ko-KR', () => h(TimeInput, { label: 'Time', modelValue: null, presentation: 'text-input' }))
    const input = wrapper.get('input')
    await input.setValue('오후 2:45')
    await input.trigger('blur')
    const model = wrapper.findComponent(TimeInput).emitted('update:modelValue')
    expect(model?.at(-1)).toEqual(['14:45'])
  })

  it('聚焦时的格式提示跟着时制', async () => {
    const wrapper = inLocale('de-DE', () => h(TimeInput, { label: 'Time', modelValue: null, presentation: 'text-input' }))
    const input = wrapper.get('input')
    await input.trigger('focus')
    expect(input.attributes('placeholder')).toBe('e.g., 14:30')
  })

  it('方向键按语言的写法写出步进后的时间', async () => {
    const wrapper = inLocale('de-DE', () => h(TimeInput, { label: 'Time', modelValue: '14:30', presentation: 'text-input' }))
    const input = wrapper.get('input')
    await input.trigger('keydown', { key: 'ArrowUp' })
    const model = wrapper.findComponent(TimeInput).emitted('update:modelValue')
    expect(model?.at(-1)).toEqual(['14:31'])
  })

  it('dateTimeInput 的时间那一段也按语言的时制写', () => {
    const wrapper = inLocale('en-GB', () => h(DateTimeInput, { label: 'When', modelValue: '2026-03-21T14:30', presentation: 'text-input' }))
    const inputs = wrapper.findAll('input')
    expect((inputs.at(-1)!.element as HTMLInputElement).value).toBe('14:30')
  })

  it('小数的 increment 不会写出不是时间的值', async () => {
    const wrapper = mount(TimeInput, { props: { label: 'Time', modelValue: '14:30', increment: 0.5, presentation: 'text-input' } })
    await wrapper.get('input').trigger('keydown', { key: 'ArrowUp' })
    await nextTick()
    const updates = wrapper.emitted('update:modelValue') ?? []
    expect(updates.every(([value]) => /^\d{2}:\d{2}$/.test(String(value)))).toBe(true)
    expect(updates.some(([value]) => value === '14:30.5')).toBe(false)
  })
})
