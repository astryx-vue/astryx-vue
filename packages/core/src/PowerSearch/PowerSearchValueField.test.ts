import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { COMPACT_TOUCH, installMatchMedia } from '../composables/testing/fakeMatchMedia.js'
import { powerSearchMessages } from '../locale/messages/power-search.js'
import PowerSearchValueField from './PowerSearchValueField.vue'

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
