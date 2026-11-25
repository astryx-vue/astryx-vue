import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ComplexSelector from '../ComplexSelector/ComplexSelector.vue'
import MultiSelector from '../MultiSelector/MultiSelector.vue'
import Selector from '../Selector/Selector.vue'
import { LAYER_MAX_INLINE_SIZE } from './inlineSize.js'

enableAutoUnmount(afterEach)

// 触发器比视口上限还宽。列表的最小宽度跟着触发器走，但 CSS 里最小宽度优先于最大宽度，
// 所以最小宽度本身必须压在上限之内，列表才不会撑出屏幕。
const WIDE = 900
const clamped = `min(${WIDE}px, ${LAYER_MAX_INLINE_SIZE})`

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
    { x: 0, y: 0, top: 0, left: 0, right: WIDE, bottom: 32, width: WIDE, height: 32, toJSON: () => ({}) } as DOMRect,
  )
})

afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

const options = [{ value: 'apple', label: 'Apple' }, { value: 'pear', label: 'Pear' }]

describe('选择器的列表不会因为触发器太宽而撑出视口', () => {
  it('selector', async () => {
    const wrapper = mount(Selector, { props: { label: 'Fruit', options }, attachTo: document.body })
    await wrapper.get('.astryx-selector-trigger').trigger('click')
    await flushPromises()
    expect(document.querySelector<HTMLElement>('[role="listbox"]')?.style.minWidth).toBe(clamped)
  })

  it('multiSelector', async () => {
    const wrapper = mount(MultiSelector, { props: { label: 'Fruit', options }, attachTo: document.body })
    await wrapper.get('button[aria-haspopup="listbox"]').trigger('click')
    await flushPromises()
    expect(document.querySelector<HTMLElement>('.astryx-multi-selector-listbox')?.style.minWidth).toBe(clamped)
  })

  it('complexSelector', async () => {
    const wrapper = mount(ComplexSelector, {
      props: { label: 'Fruit', modelValue: null },
      slots: { default: () => 'Body' },
      attachTo: document.body,
    })
    await wrapper.get('button.astryx-complex-selector').trigger('click')
    await flushPromises()
    const minWidth = document.querySelector<HTMLElement>('.astryx-popover')?.style.minWidth
    expect(minWidth).toBe(`min(min(${WIDE}px, 320px), ${LAYER_MAX_INLINE_SIZE})`)
  })
})
