import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { formatCalendarMonth, weekdayNames } from './format.js'
import { normalizeLocale, provideAstryxLocale, useAstryxMessages } from './index.js'

describe('locale', () => {
  it('defaults to English and treats Chinese tags as zh-CN', () => {
    expect(normalizeLocale(undefined)).toBe('en')
    expect(normalizeLocale('en-US')).toBe('en')
    expect(normalizeLocale('zh')).toBe('zh-CN')
    expect(normalizeLocale('zh-CN')).toBe('zh-CN')
  })

  it('formats months and Sunday-first weekdays for both locales', () => {
    expect(formatCalendarMonth(2024, 3, 'en')).toBe('March 2024')
    expect(formatCalendarMonth(2024, 3, 'zh-CN')).toBe('2024年3月')
    expect(weekdayNames('en', 'narrow')).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S'])
    expect(weekdayNames('zh-CN', 'narrow')[0]).toBe('日')
  })

  it('reads messages from the provided locale', () => {
    const Probe = defineComponent({
      setup() {
        const messages = useAstryxMessages()
        return () => h('span', messages.value.selector.placeholder)
      },
    })
    const Parent = defineComponent({
      setup() {
        provideAstryxLocale('zh-CN')
        return () => h(Probe)
      },
    })
    expect(mount(Parent).text()).toBe('请选择')
  })
})
