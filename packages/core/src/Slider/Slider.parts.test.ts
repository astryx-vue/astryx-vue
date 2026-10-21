import type { SliderValue } from './types.js'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { resetInteractionModalityForTest } from '../composables/internal/interactionModality.js'
import { FormLayout } from '../FormLayout/index.js'
import Slider from './Slider.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  vi.restoreAllMocks()
  resetInteractionModalityForTest()
})

describe('slider 样式分层、端点和焦点环', () => {
  it('外壳吃 container，轨道吃 control，单值滑块吃 data-testid', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Slider, {
      props: {
        label: 'Volume',
        modelValue: 50,
        containerClass: 'box-a',
        containerStyle: { marginTop: '7px' },
        controlClass: 'ctl-a',
        controlStyle: { marginBottom: '9px' },
        orientation: 'vertical',
        isDisabled: true,
      },
      attrs: { 'class': 'root-a', 'data-testid': 'member', 'aria-details': 'details-id' },
    })
    const field = wrapper.get('.astryx-field')
    const control = wrapper.get('.astryx-slider-control')
    const thumb = wrapper.get('[role="slider"]')
    expect(field.classes()).toEqual(expect.arrayContaining(['box-a', 'root-a', 'astryx-slider']))
    expect(field.classes()).not.toContain('ctl-a')
    expect((field.element as HTMLElement).style.marginTop).toBe('7px')
    expect(control.classes()).toContain('ctl-a')
    expect(control.attributes('data-orientation')).toBe('vertical')
    expect(control.attributes('data-disabled')).toBe('true')
    expect(thumb.attributes('data-testid')).toBe('member')
    expect(thumb.attributes('aria-details')).toBe('details-id')
    expect(thumb.classes()).not.toContain('ctl-a')
    expect(warn).not.toHaveBeenCalled()
  })

  it('区间滑块把 data-testid 放在 group 上', () => {
    const wrapper = mount(Slider, {
      props: { label: 'Price', modelValue: [20, 80] },
      attrs: { 'data-testid': 'price' },
    })
    expect(wrapper.get('[role="group"]').attributes('data-testid')).toBe('price')
  })

  it('横向标签的表单里 container 不生效，并警告一次', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const Host = defineComponent({
      setup: () => () => h(FormLayout, { direction: 'horizontal-labels' }, {
        default: () => h(Slider, { label: 'Volume', modelValue: 10, containerClass: 'box-a', controlClass: 'ctl-a' }),
      }),
    })
    const wrapper = mount(Host)
    expect(wrapper.find('.box-a').exists()).toBe(false)
    expect(wrapper.get('.astryx-slider-control').classes()).toContain('ctl-a')
    expect(warn.mock.calls.some(call => String(call[0]).startsWith('Slider:') && String(call[0]).includes('no Field box renders'))).toBe(true)
  })

  it('按 End 落到步长网格够不着的最大值，方向键仍然吸附', async () => {
    const wrapper = mount(Slider, {
      props: {
        'label': 'Volume',
        'modelValue': 0,
        'min': 0,
        'max': 100,
        'step': 3,
        'onUpdate:modelValue': (value: SliderValue) => { void wrapper.setProps({ modelValue: value }) },
      },
    })
    const thumb = wrapper.get('[role="slider"]')
    await thumb.trigger('keydown', { key: 'End' })
    expect(thumb.attributes('aria-valuenow')).toBe('100')
    await thumb.trigger('keydown', { key: 'ArrowLeft' })
    expect(thumb.attributes('aria-valuenow')).toBe('96')
    await thumb.trigger('keydown', { key: 'PageUp' })
    expect(thumb.attributes('aria-valuenow')).toBe('100')
    await thumb.trigger('keydown', { key: 'Home' })
    expect(thumb.attributes('aria-valuenow')).toBe('0')
  })

  it('鼠标拖动不画键盘焦点环，方向键会画，单独按 Shift 不把环叫回来', async () => {
    const wrapper = mount(Slider, {
      attachTo: document.body,
      props: {
        'label': 'Volume',
        'modelValue': 0,
        'onUpdate:modelValue': (value: SliderValue) => { void wrapper.setProps({ modelValue: value }) },
      },
    })
    const track = wrapper.get('.astryx-slider-control').element as HTMLElement
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({ left: 0, right: 220, top: 0, bottom: 24, width: 220, height: 24, x: 0, y: 0, toJSON: () => ({}) } as DOMRect)
    await wrapper.get('.astryx-slider-control').trigger('pointerdown', { button: 0, pointerId: 1, clientX: 40, clientY: 10 })
    expect(wrapper.get('[role="slider"]').attributes('data-keyboard-focus')).toBeUndefined()
    await wrapper.get('[role="slider"]').trigger('keydown', { key: 'Shift' })
    expect(wrapper.get('[role="slider"]').attributes('data-keyboard-focus')).toBeUndefined()
    await wrapper.get('[role="slider"]').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.get('[role="slider"]').attributes('data-keyboard-focus')).toBe('true')
  })
})
