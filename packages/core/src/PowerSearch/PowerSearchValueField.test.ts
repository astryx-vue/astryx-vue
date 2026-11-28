import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { COMPACT_TOUCH, installMatchMedia } from '../composables/testing/fakeMatchMedia.js'
import { powerSearchSheetMessages } from '../locale/messages/power-search-sheet.js'
import { powerSearchMessages } from '../locale/messages/power-search.js'
import Selector from '../Selector/Selector.vue'
import TextInput from '../TextInput/TextInput.vue'
import PowerSearchValueField from './PowerSearchValueField.vue'
import { buildRelativeDateOptions } from './relativeDates.js'

enableAutoUnmount(afterEach)

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('power search value field', () => {
  // 值编辑器本身就在浮层里，列表值的 Tokenizer 在手机上也保持行内输入，不再叠一层底部弹层。
  it.each(['string_list', 'entity_list'] as const)('keeps the %s tokenizer inline on a compact touch screen', (type) => {
    installMatchMedia(query => query === COMPACT_TOUCH)
    mount(PowerSearchValueField, {
      attachTo: document.body,
      props: {
        operatorValue: { type, searchSource: { search: () => [] } },
        messages: powerSearchMessages.en,
      },
    })
    expect(document.querySelector('input[role="combobox"]')).not.toBeNull()
    expect(document.querySelector('.astryx-tokenizer-sheet-trigger')).toBeNull()
  })
})

describe('power search relative date editor', () => {
  it('offers the fixed relative-date choices in a selector instead of a free text box', () => {
    const wrapper = mount(PowerSearchValueField, {
      props: {
        operatorValue: { type: 'date_relative' },
        filterValue: { type: 'date_relative', value: '3d_ago' },
        messages: powerSearchMessages.en,
      },
    })
    const options = wrapper.findComponent(Selector).props('options') as Array<{ value: string, label: string }>
    expect(options).toHaveLength(24)
    expect(options.slice(0, 2)).toEqual([
      { value: '1d_ago', label: '1 day ago' },
      { value: '1d_from_now', label: '1 day from now' },
    ])
    expect(wrapper.find('.astryx-selector-value').text()).toBe('3 days ago')
    expect(wrapper.findComponent(TextInput).exists()).toBe(false)
  })

  it('saves as soon as a choice is picked', () => {
    const wrapper = mount(PowerSearchValueField, {
      props: { operatorValue: { type: 'date_relative' }, messages: powerSearchMessages.en },
    })
    wrapper.findComponent(Selector).vm.$emit('update:modelValue', '2w_from_now')
    expect(wrapper.emitted('change')).toEqual([[{ type: 'date_relative', value: '2w_from_now' }, true]])
  })
})

describe('build relative date options', () => {
  it('lists days, weeks and months in display order, past before future', () => {
    const values = buildRelativeDateOptions({}, powerSearchSheetMessages.en).map(option => option.value)
    expect(values).toEqual([
      '1d_ago',
      '1d_from_now',
      '3d_ago',
      '3d_from_now',
      '7d_ago',
      '7d_from_now',
      '14d_ago',
      '14d_from_now',
      '30d_ago',
      '30d_from_now',
      '1w_ago',
      '1w_from_now',
      '2w_ago',
      '2w_from_now',
      '4w_ago',
      '4w_from_now',
      '1m_ago',
      '1m_from_now',
      '3m_ago',
      '3m_from_now',
      '6m_ago',
      '6m_from_now',
      '12m_ago',
      '12m_from_now',
    ])
  })

  it('drops the direction the operator does not allow', () => {
    const past = buildRelativeDateOptions({ isFutureAllowed: false }, powerSearchSheetMessages.en)
    const future = buildRelativeDateOptions({ isPastAllowed: false }, powerSearchSheetMessages.en)
    expect(past).toHaveLength(12)
    expect(past.every(option => option.value.endsWith('_ago'))).toBe(true)
    expect(future).toHaveLength(12)
    expect(future.every(option => option.value.endsWith('_from_now'))).toBe(true)
  })

  it('labels the choices in the active language', () => {
    const zh = buildRelativeDateOptions({}, powerSearchSheetMessages['zh-CN'])
    expect(zh.find(option => option.value === '3m_from_now')?.label).toBe('3 个月后')
    const en = buildRelativeDateOptions({}, powerSearchSheetMessages.en)
    expect(en.find(option => option.value === '1w_ago')?.label).toBe('1 week ago')
    expect(en.find(option => option.value === '12m_ago')?.label).toBe('12 months ago')
  })
})
