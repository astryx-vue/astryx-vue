import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import Dialog from '../Dialog/Dialog.vue'
import Selector from './Selector.vue'

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
]

async function open(wrapper: ReturnType<typeof mount>): Promise<HTMLButtonElement> {
  const trigger = wrapper.get('button.astryx-selector-trigger').element as HTMLButtonElement
  await wrapper.get('button.astryx-selector-trigger').trigger('click')
  await nextTick()
  return trigger
}

describe('selector Escape 把焦点还回触发器', () => {
  it('搜索框里按 Escape，列表关掉，焦点回到触发器', async () => {
    const wrapper = mount(Selector, {
      attachTo: document.body,
      props: { label: 'Fruit', options: fruits, searchable: true },
    })
    const trigger = await open(wrapper)
    const search = document.querySelector<HTMLInputElement>('.astryx-selector-search-input')
    expect(search).not.toBeNull()
    search?.focus()
    search?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger)
    wrapper.unmount()
  })

  it('选项上按 Escape，列表关掉，焦点回到触发器', async () => {
    const wrapper = mount(Selector, {
      attachTo: document.body,
      props: { label: 'Fruit', options: fruits },
    })
    const trigger = await open(wrapper)
    const option = document.querySelector<HTMLElement>('.astryx-selector-option')
    expect(option).not.toBeNull()
    option?.focus()
    option?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger)
    wrapper.unmount()
  })

  it('选项操作按钮上按 Escape，网格关掉，焦点回到触发器', async () => {
    const wrapper = mount(Selector, {
      attachTo: document.body,
      props: {
        label: 'City',
        options: [
          { value: 'paris', label: 'Paris', action: h('button', { type: 'button' }, 'Edit') },
          { value: 'lyon', label: 'Lyon' },
        ],
      },
    })
    const trigger = await open(wrapper)
    const edit = document.querySelector('[role="grid"] button')
    expect(edit).toBeInstanceOf(HTMLButtonElement)
    ;(edit as HTMLButtonElement).focus()
    edit?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger)
    wrapper.unmount()
  })

  it('对话框里按 Escape 只关选择器，焦点回到触发器', async () => {
    const wrapper = mount(Dialog, {
      attachTo: document.body,
      props: { 'isOpen': true, 'aria-label': 'Settings' },
      slots: {
        default: () => h(Selector, { label: 'Fruit', options: fruits, searchable: true }),
      },
    })
    await nextTick()
    const dialog = document.querySelector('dialog')
    const trigger = await open(wrapper)
    const search = document.querySelector<HTMLInputElement>('.astryx-selector-search-input')
    search?.focus()
    search?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()

    expect(dialog?.open).toBe(true)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger)
    wrapper.unmount()
  })
})
