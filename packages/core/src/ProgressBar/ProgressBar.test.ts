import type { VueWrapper } from '@vue/test-utils'
import { renderToString } from '@vue/server-renderer'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import ProgressBar from './ProgressBar.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
})

function renderProgressBar(props: Record<string, unknown> = {}): VueWrapper<InstanceType<typeof ProgressBar>> {
  return mount(ProgressBar, {
    attachTo: document.body,
    props: {
      value: 50,
      label: 'Loading',
      ...props,
    },
  })
}

describe('progressBar', () => {
  it('renders track with progressbar role and aria values', () => {
    const wrapper = renderProgressBar({ value: 30, min: 0, max: 200 })
    const track = wrapper.get('[role="progressbar"]')
    expect(track.attributes('aria-valuemin')).toBe('0')
    expect(track.attributes('aria-valuemax')).toBe('200')
    expect(track.attributes('aria-valuenow')).toBe('30')
    expect(track.attributes('aria-valuetext')).toBe('15%')
    expect(track.attributes('aria-labelledby')).toContain('-label')
  })

  it('clamps value within min and max', () => {
    const wrapper = renderProgressBar({ value: 120, max: 100 })
    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('100')
    expect(wrapper.get('.astryx-progress-bar-fill').attributes('style')).toContain('width: 100%')
  })

  it('renders indeterminate state without aria-valuenow', () => {
    const wrapper = renderProgressBar({ isIndeterminate: true })
    const track = wrapper.get('[role="progressbar"]')
    expect(track.attributes('aria-valuenow')).toBeUndefined()
    expect(track.attributes('aria-valuetext')).toBeUndefined()
    expect(track.attributes('aria-valuemin')).toBeUndefined()
    expect(track.attributes('aria-valuemax')).toBeUndefined()
    expect(wrapper.get('.astryx-progress-bar-track').element.contains(wrapper.get('.astryx-progress-bar-fill').element)).toBe(true)
  })

  it('keeps a hidden label in the accessibility tree', () => {
    const wrapper = renderProgressBar({ label: 'Risk level', isLabelHidden: true })
    const hidden = wrapper.get('.astryx-visually-hidden')
    expect(hidden.text()).toBe('Risk level')
    expect(wrapper.find('.astryx-progress-bar-header').exists()).toBe(false)
    expect(wrapper.get('[role="progressbar"]').attributes('aria-labelledby')).toBe(hidden.attributes('id'))
  })

  it('shows value text when showValue is true', () => {
    const wrapper = renderProgressBar({ value: 75, showValue: true })
    expect(wrapper.get('.astryx-progress-bar-value').text()).toBe('75%')
  })

  it('uses custom valueText', () => {
    const wrapper = renderProgressBar({ value: 75, showValue: true, valueText: '3 of 4' })
    expect(wrapper.get('.astryx-progress-bar-value').text()).toBe('3 of 4')
    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuetext')).toBe('3 of 4')
  })

  it('formats the value label from the current value and max', () => {
    const wrapper = renderProgressBar({
      value: 3.2,
      max: 5,
      hasValueLabel: true,
      formatValueLabel: (value: number, max: number) => `${value} GB / ${max} GB`,
    })
    expect(wrapper.get('.astryx-progress-bar-value').text()).toBe('3.2 GB / 5 GB')
    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuetext')).toBe('3.2 GB / 5 GB')
    expect(wrapper.attributes('data-variant')).toBe('accent')
  })

  it('paints the accent variant', () => {
    const wrapper = renderProgressBar({ value: 60, variant: 'accent', hasValueLabel: true })
    expect(wrapper.attributes('data-variant')).toBe('accent')
    expect(wrapper.get('.astryx-progress-bar-value').text()).toBe('60%')
  })

  it('places named marks on the fill or the remaining track', () => {
    const wrapper = renderProgressBar({
      value: 40,
      marks: [
        { value: 25, label: 'Quarter' },
        { value: 80, label: 'Late' },
        { value: 10, label: '' },
      ],
    })
    const marks = wrapper.findAll('.astryx-progress-bar-mark')
    expect(marks).toHaveLength(2)
    expect(marks[0]!.attributes('aria-label')).toBe('Quarter')
    expect(marks[0]!.attributes('data-placement')).toBe('fill')
    expect(marks[1]!.attributes('data-placement')).toBe('track')
    expect(wrapper.get('.astryx-progress-bar-mark-anchor').attributes('style')).toContain('25%')
  })

  it('hides marks while the progress is indeterminate', () => {
    const wrapper = renderProgressBar({
      isIndeterminate: true,
      marks: [{ value: 50, label: 'Halfway' }],
    })
    expect(wrapper.find('.astryx-progress-bar-mark').exists()).toBe(false)
  })

  it('keeps focusable marks outside the progressbar subtree', () => {
    const wrapper = renderProgressBar({
      marks: [{ value: 40, label: 'Goal' }],
    })
    const track = wrapper.get('[role="progressbar"]')
    const mark = wrapper.get('.astryx-progress-bar-mark')
    expect(track.element.contains(mark.element)).toBe(false)
    expect(mark.attributes('tabindex')).toBe('0')
  })

  it('treats a non-finite value as empty progress', () => {
    const wrapper = renderProgressBar({ value: Number.NaN, max: 100 })
    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('0')
    expect(wrapper.get('.astryx-progress-bar-fill').attributes('style')).toContain('width: 0%')
  })

  it('renders server-side', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(ProgressBar, { value: 60, label: 'Upload' }) }))
    expect(html).toContain('role="progressbar"')
    expect(html).toContain('aria-valuenow="60"')
    expect(html).toContain('60%')
  })

  it('marks a disabled bar so the stylesheet can dim it', () => {
    const live = renderProgressBar()
    expect(live.get('.astryx-progress-bar').attributes('data-disabled')).toBeUndefined()

    const disabled = renderProgressBar({ isDisabled: true, hasValueLabel: true, variant: 'success' })
    const root = disabled.get('.astryx-progress-bar')
    expect(root.attributes('data-disabled')).toBe('true')
    expect(root.attributes('data-variant')).toBe('success')
    expect(disabled.get('.astryx-progress-bar-value').text()).toBe('50%')
  })
})
