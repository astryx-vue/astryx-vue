import type { VueWrapper } from '@vue/test-utils'
import type { SliderProps, SliderValue } from './types.js'
import { renderToString } from '@vue/server-renderer'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, h, nextTick } from 'vue'
import Slider from './Slider.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})
function renderSlider(props: Partial<SliderProps> = {}, attrs: Record<string, unknown> = {}): VueWrapper {
  const wrapper = mount(Slider, {
    attachTo: document.body,
    attrs,
    props: { 'label': 'Volume', 'modelValue': 50 as SliderValue, 'onUpdate:modelValue': (value: SliderValue) => { void wrapper.setProps({ modelValue: value }) }, ...props },
  })
  return wrapper
}
function geometry(wrapper: VueWrapper): HTMLElement {
  const track = wrapper.get('.astryx-slider-control').element as HTMLElement
  vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({ left: 0, right: 220, top: 0, bottom: 220, width: 220, height: 220 } as DOMRect)
  return track
}

describe('slider', () => {
  it('connects the label, description, status and external description', () => {
    const wrapper = renderSlider({ id: 'volume', description: 'Playback volume', status: { type: 'error', message: 'Choose a lower volume' } }, { 'aria-describedby': 'external' })
    expect(wrapper.get('[role="slider"]').attributes()).toMatchObject({ 'aria-labelledby': 'volume-label', 'aria-describedby': 'external volume-description volume-status', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '50', 'aria-invalid': 'true', 'tabindex': '0' })
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('changes with keyboard arrows, pages and endpoints and emits exact changeEnd values', async () => {
    const wrapper = renderSlider({ modelValue: 0.1, min: 0, max: 1, step: 0.1 })
    const thumb = wrapper.get('[role="slider"]')
    await thumb.trigger('keydown', { key: 'ArrowRight' })
    await thumb.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('change')?.at(-1)).toEqual([0.3])
    expect(wrapper.emitted('changeEnd')?.at(-1)).toEqual([0.3])
    await thumb.trigger('keydown', { key: 'PageUp' })
    expect(thumb.attributes('aria-valuenow')).toBe('1')
    await thumb.trigger('keydown', { key: 'Home' })
    expect(thumb.attributes('aria-valuenow')).toBe('0')
    await thumb.trigger('keydown', { key: 'End' })
    expect(thumb.attributes('aria-valuenow')).toBe('1')
    await thumb.trigger('keydown', { key: 'PageDown' })
    expect(thumb.attributes('aria-valuenow')).toBe('0')
  })

  it('snaps relative to min and removes floating-point noise for tiny steps', async () => {
    const wrapper = renderSlider({ modelValue: 1e-7, min: 1e-7, max: 1e-6, step: 1e-7 })
    await wrapper.get('[role="slider"]').trigger('keydown', { key: 'ArrowRight' })
    await wrapper.get('[role="slider"]').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('change')?.at(-1)).toEqual([3e-7])
  })

  it('constrains range thumbs, updates ARIA bounds and never mutates the input tuple', async () => {
    const range: [number, number] = [20, 80]
    const wrapper = renderSlider({ modelValue: range, minStepsBetweenThumbs: 2, step: 5, minLabel: 'Lower', maxLabel: 'Upper' })
    const [low, high] = wrapper.findAll('[role="slider"]')
    expect(wrapper.get('[role="group"]').attributes('aria-labelledby')).toBe(low!.attributes('aria-labelledby')?.split(' ')[0])
    expect(low!.attributes('aria-valuemax')).toBe('70')
    expect(high!.attributes('aria-valuemin')).toBe('30')
    await low!.trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('changeEnd')?.at(-1)).toEqual([[70, 80]])
    await high!.trigger('keydown', { key: 'Home' })
    expect(high!.attributes('aria-valuenow')).toBe('80')
    expect(range).toEqual([20, 80])
    expect(wrapper.text()).toContain('Lower')
    expect(wrapper.text()).toContain('Upper')
  })

  it('handles reversed, out-of-bounds, collapsed and non-finite inputs without NaN ARIA', async () => {
    const wrapper = renderSlider({ modelValue: [200, -20], min: 0, max: 100 })
    expect(wrapper.findAll('[role="slider"]').map(t => t.attributes('aria-valuenow'))).toEqual(['0', '100'])
    await wrapper.setProps({ modelValue: Number.NaN, min: 10, max: 5, step: 0 })
    expect(wrapper.get('[role="slider"]').attributes()).toMatchObject({ 'aria-valuenow': '10', 'aria-valuemin': '10', 'aria-valuemax': '10' })
    await wrapper.get('[role="slider"]').trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('changeEnd')?.at(-1)).toEqual([10])
  })

  it('keeps pointer dragging active across model updates and ends only for its pointer', async () => {
    const wrapper = renderSlider({ modelValue: 0 })
    geometry(wrapper)
    const track = wrapper.get('.astryx-slider-control')
    await track.trigger('pointerdown', { button: 0, pointerId: 1, clientX: 110, clientY: 0 })
    expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe('50')
    await track.trigger('pointermove', { pointerId: 2, clientX: 210, clientY: 0 })
    expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe('50')
    await track.trigger('pointermove', { pointerId: 1, clientX: 170, clientY: 0 })
    expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe('80')
    await track.trigger('pointerup', { pointerId: 1 })
    await track.trigger('lostpointercapture', { pointerId: 1 })
    expect(wrapper.emitted('changeEnd')).toEqual([[80]])
  })

  it('selects the nearest thumb for track presses and the actual thumb at overlap', async () => {
    const wrapper = renderSlider({ modelValue: [20, 80] })
    geometry(wrapper)
    const track = wrapper.get('.astryx-slider-control')
    await track.trigger('pointerdown', { button: 0, pointerId: 1, clientX: 190 })
    await track.trigger('pointerup', { pointerId: 1 })
    expect(wrapper.emitted('changeEnd')?.at(-1)).toEqual([[20, 90]])
    await wrapper.setProps({ modelValue: [50, 50] })
    await wrapper.findAll('[role="slider"]')[1]!.trigger('pointerdown', { button: 0, pointerId: 2, clientX: 110 })
    await track.trigger('pointermove', { pointerId: 2, clientX: 150 })
    await track.trigger('pointercancel', { pointerId: 2 })
    expect(wrapper.emitted('changeEnd')?.at(-1)).toEqual([[50, 70]])
  })

  it('uses exact mark values and filters marks outside the interval', async () => {
    const wrapper = renderSlider({ marks: [{ value: 0, label: 'Quiet' }, { value: 80, label: 'Loud' }, { value: 200 }] })
    geometry(wrapper)
    expect(wrapper.findAll('.astryx-slider-mark')).toHaveLength(2)
    await wrapper.get('[data-mark-value="80"]').trigger('pointerdown', { button: 0, pointerId: 1, clientX: 70 })
    expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe('80')
  })

  it('maps vertical positions bottom to top', async () => {
    const wrapper = renderSlider({ orientation: 'vertical' })
    geometry(wrapper)
    await wrapper.get('.astryx-slider-control').trigger('pointerdown', { button: 0, pointerId: 1, clientY: 10 })
    expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe('100')
    expect(wrapper.get('[role="slider"]').attributes('aria-orientation')).toBe('vertical')
  })

  it('mirrors horizontal pointer and arrow movement in RTL', async () => {
    const wrapper = renderSlider({}, { style: { direction: 'rtl' } })
    const track = geometry(wrapper)
    track.style.direction = 'rtl'
    await wrapper.get('[role="slider"]').trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe('51')
    await wrapper.get('.astryx-slider-control').trigger('pointerdown', { button: 0, pointerId: 1, clientX: 10 })
    expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe('100')
  })

  it('blocks disabled controls and keeps disabled reasons focusable', async () => {
    const wrapper = renderSlider({ isDisabled: true })
    const thumb = wrapper.get('[role="slider"]')
    expect(thumb.attributes('tabindex')).toBe('-1')
    await thumb.trigger('keydown', { key: 'End' })
    await wrapper.get('.astryx-slider-control').trigger('pointerdown', { button: 0, pointerId: 1, clientX: 210 })
    expect(wrapper.emitted('change')).toBeUndefined()
    await wrapper.setProps({ disabledMessage: 'Unavailable during playback' })
    expect(thumb.attributes('tabindex')).toBe('0')
    expect(thumb.attributes('aria-disabled')).toBe('true')
    expect(document.getElementById(thumb.attributes('aria-describedby')!)?.textContent).toBe('Unavailable during playback')
    await thumb.trigger('focusin')
    expect(document.querySelector('[role="tooltip"]')?.textContent).not.toBeNull()
  })

  it('cancels active dragging when disabled and ignores right clicks and modified keys', async () => {
    const wrapper = renderSlider()
    geometry(wrapper)
    const track = wrapper.get('.astryx-slider-control')
    await track.trigger('pointerdown', { button: 2, pointerId: 1, clientX: 210 })
    await wrapper.get('[role="slider"]').trigger('keydown', { key: 'End', ctrlKey: true })
    expect(wrapper.emitted('change')).toBeUndefined()
    await track.trigger('pointerdown', { button: 0, pointerId: 1, clientX: 110 })
    await wrapper.setProps({ isDisabled: true })
    await track.trigger('pointermove', { pointerId: 1, clientX: 210 })
    await track.trigger('pointerup', { pointerId: 1 })
    expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe('50')
    expect(wrapper.emitted('changeEnd')).toBeUndefined()
  })

  it('submits one or two values, follows parent updates, and excludes disabled values', async () => {
    const form = document.createElement('form')
    form.id = 'filters'
    document.body.append(form)
    const wrapper = renderSlider({ modelValue: [20, 80], htmlName: 'price', form: 'filters' })
    expect(new FormData(form).getAll('price')).toEqual(['20', '80'])
    await wrapper.setProps({ modelValue: [30, 70] })
    expect(new FormData(form).getAll('price')).toEqual(['30', '70'])
    await wrapper.setProps({ isDisabled: true })
    expect(new FormData(form).getAll('price')).toEqual([])
  })

  it('formats text and accessible values and describes required state without unsupported ARIA', () => {
    const wrapper = renderSlider({ modelValue: 25, valueDisplay: 'text', formatValue: value => `${value}%`, isRequired: true, requiredLabel: '必填' })
    expect(wrapper.get('.astryx-slider-value').text()).toBe('25%')
    const thumb = wrapper.get('[role="slider"]')
    expect(thumb.attributes('aria-valuetext')).toBe('25%')
    expect(thumb.attributes('aria-required')).toBeUndefined()
    expect(document.getElementById(thumb.attributes('aria-describedby')!)?.textContent).toBe('必填')
  })

  it('shows the value tooltip on focus and dismisses it with Escape', async () => {
    const wrapper = renderSlider()
    const thumb = wrapper.get('[role="slider"]')
    await thumb.trigger('focus')
    await nextTick()
    const tooltip = document.querySelector('[role="tooltip"]') as HTMLElement
    expect(tooltip.textContent).toBe('50')
    expect(tooltip.style.display).not.toBe('none')
    await thumb.trigger('keydown', { key: 'Escape' })
    expect(tooltip.style.display).toBe('none')
  })

  it('keeps fractional range gaps exact in ARIA and emitted values', async () => {
    const wrapper = renderSlider({ modelValue: [0.1, 0.9], min: 0, max: 1, step: 0.1, minStepsBetweenThumbs: 3 })
    const [low, high] = wrapper.findAll('[role="slider"]')
    expect(low!.attributes('aria-valuemax')).toBe('0.6')
    expect(high!.attributes('aria-valuemin')).toBe('0.4')
    await high!.trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('changeEnd')?.at(-1)).toEqual([[0.1, 0.4]])
  })

  it('repositions an open tooltip when the thumb moves', async () => {
    const wrapper = renderSlider()
    const thumb = wrapper.get('[role="slider"]')
    const bounds = vi.spyOn(thumb.element, 'getBoundingClientRect')
    bounds.mockReturnValue({ left: 100, right: 120, top: 100, bottom: 120, width: 20, height: 20 } as DOMRect)
    await thumb.trigger('focus')
    await nextTick()
    const tooltip = document.querySelector('[role="tooltip"]') as HTMLElement
    expect(tooltip.style.left).toBe('110px')
    bounds.mockReturnValue({ left: 200, right: 220, top: 100, bottom: 120, width: 20, height: 20 } as DOMRect)
    await wrapper.setProps({ modelValue: 70 })
    await nextTick()
    expect(tooltip.style.left).toBe('210px')
  })

  it('renders meaningful values, labels and hidden carriers during SSR', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(Slider, { label: 'Price', modelValue: [20, 80], htmlName: 'price' }) }))
    expect(html.match(/role="slider"/g)).toHaveLength(2)
    expect(html).toContain('aria-valuenow="20"')
    expect(html).toContain('aria-valuenow="80"')
    expect(html).toContain('name="price"')
  })
})
