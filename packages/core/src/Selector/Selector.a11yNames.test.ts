import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import InputGroup from '../InputGroup/InputGroup.vue'
import Selector from './Selector.vue'

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
]

afterEach(() => {
  document.body.innerHTML = ''
})

function nameOf(el: Element): string {
  const ids = el.getAttribute('aria-labelledby')?.split(' ') ?? []
  if (ids.length === 0)
    return el.getAttribute('aria-label') ?? ''
  return ids.map(id => document.getElementById(id)?.textContent?.replace(/\s+/g, ' ').trim() ?? '').join(' ').trim()
}

describe('selector 触发器与列表的名字', () => {
  it('调用方的 aria-labelledby 接在字段标签后面，不取代它', () => {
    document.body.innerHTML = '<h2 id="lunch">Lunch</h2>'
    const wrapper = mount(Selector, {
      attachTo: document.body,
      props: { label: 'Fruit', options: fruits },
      attrs: { 'aria-labelledby': 'lunch' },
    })
    const trigger = wrapper.get('button.astryx-selector-trigger').element
    expect(nameOf(trigger)).toBe('Fruit Lunch')
  })

  it('没有调用方 aria-labelledby 时仍由 aria-label 命名', () => {
    const wrapper = mount(Selector, { props: { label: 'Fruit', options: fruits } })
    const trigger = wrapper.get('button.astryx-selector-trigger')
    expect(trigger.attributes('aria-labelledby')).toBeUndefined()
    expect(trigger.attributes('aria-label')).toBe('Fruit')
  })

  it('组内先是组标签，再是字段标签，最后是调用方的', () => {
    document.body.innerHTML = '<h2 id="lunch">Lunch</h2>'
    const wrapper = mount(InputGroup, {
      attachTo: document.body,
      props: { label: 'Order' },
      slots: { default: () => h(Selector, { 'label': 'Fruit', 'options': fruits, 'aria-labelledby': 'lunch' }) },
    })
    const trigger = wrapper.get('button.astryx-selector-trigger').element
    expect(nameOf(trigger)).toBe('Order Fruit Lunch')
  })

  it('列表由字段标签命名，弹层形态和底部弹层都一样', async () => {
    const wrapper = mount(Selector, { attachTo: document.body, props: { label: 'Fruit', options: fruits } })
    await wrapper.get('button.astryx-selector-trigger').trigger('click')
    await nextTick()
    const listbox = document.querySelector('.astryx-selector-listbox')
    expect(listbox?.getAttribute('aria-label')).toBe('Fruit')
    wrapper.unmount()

    const sheet = mount(Selector, { attachTo: document.body, props: { label: 'Fruit', options: fruits, presentation: 'bottom-sheet' } })
    await sheet.get('button.astryx-selector-trigger').trigger('click')
    await nextTick()
    expect(document.querySelector('.astryx-selector-listbox')?.getAttribute('aria-label')).toBe('Fruit')
    sheet.unmount()
  })

  it('可搜索的触发器名字带上所选的值', async () => {
    const wrapper = mount(Selector, {
      attachTo: document.body,
      props: { label: 'Fruit', options: fruits, searchable: true, modelValue: 'banana' },
    })
    const trigger = wrapper.get('button.astryx-selector-trigger').element
    expect(nameOf(trigger)).toBe('Fruit Banana')
    await wrapper.setProps({ modelValue: null, placeholder: 'Pick one' })
    expect(nameOf(trigger)).toBe('Fruit Pick one')
  })

  it('可搜索的触发器带调用方 aria-labelledby 时，名字是字段标签、调用方的、值', () => {
    document.body.innerHTML = '<h2 id="lunch">Lunch</h2>'
    const wrapper = mount(Selector, {
      attachTo: document.body,
      props: { label: 'Fruit', options: fruits, searchable: true, modelValue: 'apple' },
      attrs: { 'aria-labelledby': 'lunch' },
    })
    expect(nameOf(wrapper.get('button.astryx-selector-trigger').element)).toBe('Fruit Lunch Apple')
  })

  it('不可搜索的触发器名字里没有值（combobox 自己念值）', () => {
    const wrapper = mount(Selector, { props: { label: 'Fruit', options: fruits, modelValue: 'banana' } })
    expect(wrapper.get('button.astryx-selector-trigger').attributes('aria-labelledby')).toBeUndefined()
  })

  it('必填的可搜索 Selector：触发器不带 aria-required，搜索框带', async () => {
    const wrapper = mount(Selector, {
      attachTo: document.body,
      props: { label: 'Fruit', options: fruits, searchable: true, isRequired: true },
    })
    const trigger = wrapper.get('button.astryx-selector-trigger')
    expect(trigger.attributes('aria-required')).toBeUndefined()
    await trigger.trigger('click')
    await nextTick()
    expect(document.querySelector('.astryx-selector-search-input')?.getAttribute('aria-required')).toBe('true')
  })

  it('必填的普通 Selector 触发器是 combobox，带 aria-required', () => {
    const wrapper = mount(Selector, { props: { label: 'Fruit', options: fruits, isRequired: true } })
    expect(wrapper.get('button.astryx-selector-trigger').attributes('aria-required')).toBe('true')
  })
})
