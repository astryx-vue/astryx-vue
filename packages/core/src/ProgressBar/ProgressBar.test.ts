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
    expect(track.attributes('aria-valuemin')).toBe('0')
    expect(track.attributes('aria-valuemax')).toBe('100')
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

  it('renders server-side', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(ProgressBar, { value: 60, label: 'Upload' }) }))
    expect(html).toContain('role="progressbar"')
    expect(html).toContain('aria-valuenow="60"')
    expect(html).toContain('60%')
  })
})
