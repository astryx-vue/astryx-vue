import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Radio from '../Radio/Radio.vue'
import CheckboxInput from './CheckboxInput.vue'

const BAND = 'astryx-touch-hit-area-band'

describe('粗指针下复选框和单选项的触控热区', () => {
  it('有标签、可用的复选框整行带热区；标签隐藏、禁用或只读的没有', () => {
    const on = mount(CheckboxInput, { props: { modelValue: false, label: 'Subscribe' } })
    expect(on.get('.astryx-checkbox-row').classes()).toContain(BAND)

    for (const extra of [{ isLabelHidden: true }, { isDisabled: true }, { isReadOnly: true }]) {
      const off = mount(CheckboxInput, { props: { modelValue: false, label: 'Subscribe', ...extra } })
      expect(off.get('.astryx-checkbox-row').classes()).not.toContain(BAND)
    }
  })

  it('起点在热区（行盒子之外）的点按切换复选框，起点在盒子里的不重复切换', async () => {
    const wrapper = mount(CheckboxInput, { attachTo: document.body, props: { modelValue: false, label: 'Subscribe' } })
    const row = wrapper.get('.astryx-checkbox-row')
    row.element.getBoundingClientRect = () => ({ left: 10, top: 10, right: 110, bottom: 30, width: 100, height: 20, x: 10, y: 10, toJSON: () => ({}) })
    const input = wrapper.get<HTMLInputElement>('input').element

    row.element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 5, clientY: 20 }))
    row.element.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    expect(input.checked).toBe(true)

    row.element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 50, clientY: 20 }))
    row.element.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    expect(input.checked).toBe(true)

    row.element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 5, clientY: 20 }))
    row.element.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 0 }))
    expect(input.checked).toBe(true)
    wrapper.unmount()
  })

  it('可用的单选项整行带热区，禁用的没有', () => {
    const on = mount(Radio, { props: { value: 'a', label: 'A' } })
    expect(on.get('label').classes()).toContain(BAND)
    const off = mount(Radio, { props: { value: 'a', label: 'A', isDisabled: true } })
    expect(off.get('label').classes()).not.toContain(BAND)
  })
})
