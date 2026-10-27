import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { formatCalendarMonth, standaloneShortWeekdayNames, weekdayNames } from './format.js'
import { normalizeLocale, provideAstryxLocale, useAstryxMessages } from './index.js'
import { astryxMessages } from './messages.js'

describe('locale', () => {
  it('defaults to English and keeps tags that have their own catalog', () => {
    expect(normalizeLocale(undefined)).toBe('en')
    expect(normalizeLocale('en')).toBe('en')
    expect(normalizeLocale('en-us')).toBe('en-US')
    expect(normalizeLocale('en-GB')).toBe('en-GB')
    expect(normalizeLocale('zh')).toBe('zh-CN')
    expect(normalizeLocale('zh-CN')).toBe('zh-CN')
    expect(normalizeLocale('zh-Hans')).toBe('zh-CN')
    expect(normalizeLocale('zh-TW')).toBe('zh-TW')
    expect(normalizeLocale('ja-jp')).toBe('ja-JP')
    expect(normalizeLocale('not a locale')).toBe('en')
  })

  it('formats months and Sunday-first weekdays for both locales', () => {
    expect(formatCalendarMonth(2024, 3, 'en')).toBe('March 2024')
    expect(formatCalendarMonth(2024, 3, 'zh-CN')).toBe('2024年3月')
    expect(weekdayNames('en', 'narrow')).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S'])
    expect(standaloneShortWeekdayNames('en')).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'])
    expect(standaloneShortWeekdayNames('zh-CN')[0]).toBe('周日')
    expect(weekdayNames('zh-CN', 'narrow')[0]).toBe('日')
  })

  it('reads CLDR stand-alone weekday headers for every vendored locale, then the base language, then English', () => {
    expect(standaloneShortWeekdayNames('fr-FR')).toEqual(['di', 'lu', 'ma', 'me', 'je', 've', 'sa'])
    expect(standaloneShortWeekdayNames('ja-JP')[1]).toBe('月')
    expect(standaloneShortWeekdayNames('zh-TW')).toEqual(['日', '一', '二', '三', '四', '五', '六'])
    expect(standaloneShortWeekdayNames('pt-PT')[6]).toBe('sáb.')
    expect(standaloneShortWeekdayNames('en-GB')).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'])
    expect(standaloneShortWeekdayNames('xx')).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'])
  })

  it('keeps a regional English tag and still reads the English copy', () => {
    const Probe = defineComponent({
      setup() {
        const messages = useAstryxMessages()
        return () => h('span', messages.value.selector.placeholder)
      },
    })
    const Parent = defineComponent({
      setup() {
        provideAstryxLocale('en-GB')
        return () => h(Probe)
      },
    })
    expect(mount(Parent).text()).toBe('Select…')
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

  it('keeps the English and Chinese strings for inputs and pagination', () => {
    expect(astryxMessages.en.dateInput.clear('Name')).toBe('Clear Name')
    expect(astryxMessages.en.dateInput.clear(undefined)).toBe('Clear')
    expect(astryxMessages['zh-CN'].dateInput.clear('日期')).toBe('清除日期')
    expect(astryxMessages.en.numberInput.increment(undefined)).toBe('Increment')
    expect(astryxMessages['zh-CN'].numberInput.decrement('数量')).toBe('减少数量')
    expect(astryxMessages.en.pagination.total(10, 1, 10)).toBe('1–10 of 10')
    expect(astryxMessages['zh-CN'].pagination.total(10, 1, 10)).toBe('共 10 条，显示 1-10')
    expect(astryxMessages.en.pagination.compact(1, 20)).toBe('1 / 20')
    expect(astryxMessages['zh-CN'].pagination.compact(1, 20)).toBe('1 / 20')
    expect(astryxMessages['zh-CN'].selector.placeholder).toBe('请选择')
  })
})
