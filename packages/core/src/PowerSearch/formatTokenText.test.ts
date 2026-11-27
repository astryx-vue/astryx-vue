import type { PowerSearchMessages } from '../locale/messages/power-search.js'
import type { PowerSearchFilter, PowerSearchOperator } from './types.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { powerSearchMessages } from '../locale/messages/power-search.js'
import { formatTokenLabel, formatTokenText, tokenTextKeepsParts } from './formatTokenText.js'
import PowerSearchToken from './PowerSearchToken.vue'

const english = powerSearchMessages.en
const operator: PowerSearchOperator = { key: 'is', label: 'is', value: { type: 'string' } }
const filter: PowerSearchFilter = { field: 'status', operator: 'is', value: { type: 'string', value: 'Open' } }

// 把值放在标签前面的语言。
const valueFirst: PowerSearchMessages = {
  ...english,
  token: { ...english.token, labelValue: (label, value) => `${value} ← ${label}` },
}

function mountToken(messages: PowerSearchMessages) {
  return mount(PowerSearchToken, {
    props: { fieldLabel: 'Status', operator, filter, maxLength: 40, messages, locale: 'en', nameId: 'name' },
  })
}

describe('filter token text', () => {
  it('joins field, operator and value through the catalog messages', () => {
    expect(formatTokenLabel(english, 'Status', 'is')).toBe('Status: is')
    expect(formatTokenLabel(english, 'Status', '')).toBe('Status')
    expect(formatTokenText(english, 'Status: is', 'Open')).toBe('Status: is Open')
    expect(tokenTextKeepsParts(english)).toBe(true)
    expect(tokenTextKeepsParts(valueFirst)).toBe(false)
  })

  it('shows the label and the bold value as two parts when the locale keeps that order', () => {
    const wrapper = mountToken(english)
    expect(wrapper.find('.astryx-power-search-token-value').text()).toBe('Open')
    expect(wrapper.get('[hidden]').text()).toBe('Status: is Open')
  })

  it('shows the full text as one when the locale reorders it, so the pill reads as its name', () => {
    const wrapper = mountToken(valueFirst)
    expect(wrapper.find('.astryx-power-search-token-value').exists()).toBe(false)
    expect(wrapper.text()).toContain('Open ← Status: is')
    expect(wrapper.get('[hidden]').text()).toBe('Open ← Status: is')
  })
})
