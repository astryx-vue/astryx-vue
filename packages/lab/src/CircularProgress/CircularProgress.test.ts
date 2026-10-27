import type { VueWrapper } from '@vue/test-utils'
import { renderToString } from '@vue/server-renderer'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import CircularProgress from './CircularProgress.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
})

function renderProgress(props: Record<string, unknown> = {}, slot = '', attrs: Record<string, unknown> = {}): VueWrapper {
  return mount(CircularProgress, {
    attachTo: document.body,
    props: { value: 50, label: 'Progress', ...props },
    slots: slot ? { default: slot } : {},
    attrs,
  })
}

describe('circularProgress', () => {
  it('renders with default props', () => {
    const bar = renderProgress().get('[role="progressbar"]')
    expect(bar.attributes('aria-valuenow')).toBe('50')
    expect(bar.attributes('aria-valuemin')).toBe('0')
    expect(bar.attributes('aria-valuemax')).toBe('100')
  })

  it('uses role="progressbar" (not "meter") for determinate progress', () => {
    // progressbar 描述任务进度，meter 描述一个静态测量值。和 core 的 ProgressBar 一致。
    const wrapper = renderProgress()
    expect(wrapper.find('[role="meter"]').exists()).toBe(false)
    expect(wrapper.find('[role="progressbar"]').exists()).toBe(true)
  })

  it('renders an empty determinate ring when value is omitted', () => {
    const wrapper = mount(CircularProgress, { props: { label: 'Progress' } })
    const bar = wrapper.get('[role="progressbar"]')
    expect(bar.attributes('aria-valuenow')).toBe('0')
    expect(bar.attributes('aria-valuemax')).toBe('100')
  })

  it('renders label as visually hidden by default', () => {
    const wrapper = renderProgress({ label: 'Upload progress' })
    const label = wrapper.get('.astryx-circular-progress__label')
    expect(label.text()).toBe('Upload progress')
    expect(label.classes()).toContain('astryx-circular-progress__visually-hidden')
    expect(wrapper.get('[role="progressbar"]').attributes('aria-labelledby')).toBeTruthy()
  })

  it('shows label visually when isLabelHidden is false', () => {
    const wrapper = renderProgress({ label: 'Upload progress', isLabelHidden: false })
    const label = wrapper.get('.astryx-circular-progress__label')
    expect(label.classes()).not.toContain('astryx-circular-progress__visually-hidden')
    expect(wrapper.get('[role="progressbar"]').attributes('aria-labelledby')).toBe(label.attributes('id'))
  })

  it('links the label to the progressbar via aria-labelledby', () => {
    const wrapper = renderProgress({ label: 'Upload progress' })
    const label = wrapper.get('.astryx-circular-progress__label')
    expect(wrapper.get('[role="progressbar"]').attributes('aria-labelledby')).toBe(label.attributes('id'))
  })

  it('respects custom max', () => {
    const bar = renderProgress({ value: 3, max: 10 }).get('[role="progressbar"]')
    expect(bar.attributes('aria-valuenow')).toBe('3')
    expect(bar.attributes('aria-valuemax')).toBe('10')
  })

  it('clamps value to [0, max]', async () => {
    const wrapper = renderProgress({ value: 150, max: 100 })
    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('100')

    await wrapper.setProps({ value: -10, max: 100 })
    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('0')
  })

  it('sets aria-valuetext from formatValueLabel', () => {
    expect(renderProgress().get('[role="progressbar"]').attributes('aria-valuetext')).toBe('50%')
  })

  it('shows the formatted value in the ring center when hasValueLabel', () => {
    const wrapper = renderProgress({ value: 75, hasValueLabel: true })
    expect(wrapper.get('.astryx-circular-progress__value').text()).toBe('75%')
  })

  it('uses custom formatValueLabel', () => {
    const wrapper = renderProgress({
      value: 3,
      max: 10,
      hasValueLabel: true,
      formatValueLabel: (value: number, max: number) => `${value} of ${max}`,
    })
    expect(wrapper.get('.astryx-circular-progress__value').text()).toBe('3 of 10')
    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuetext')).toBe('3 of 10')
  })

  it('lets slot content take precedence over the value label', () => {
    const wrapper = renderProgress({ value: 75, hasValueLabel: true }, 'Almost there')
    expect(wrapper.get('.astryx-circular-progress__center').text()).toBe('Almost there')
    expect(wrapper.text()).not.toContain('75%')
  })

  it('renders slot content in the center', () => {
    expect(renderProgress({ value: 75 }, '75%').get('.astryx-circular-progress__center').text()).toBe('75%')
  })

  it('forwards attrs to the outer container', () => {
    const wrapper = renderProgress({}, '', { 'data-testid': 'my-progress' })
    const root = wrapper.get('[data-testid="my-progress"]')
    expect(root.element.tagName).toBe('DIV')
    expect(root.classes()).toContain('astryx-circular-progress')
  })

  it('renders with all variant and size options', async () => {
    const wrapper = renderProgress()
    for (const variant of ['accent', 'success', 'warning', 'error', 'neutral'] as const) {
      await wrapper.setProps({ variant })
      expect(wrapper.find('[role="progressbar"]').exists()).toBe(true)
      expect(wrapper.get('.astryx-circular-progress__fill').attributes('data-variant')).toBe(variant)
    }
    for (const size of ['sm', 'md', 'lg'] as const) {
      await wrapper.setProps({ size })
      expect(wrapper.find('[role="progressbar"]').exists()).toBe(true)
    }
  })

  it('sets ring geometry from size', () => {
    const wrapper = renderProgress({ size: 'md' })
    const svg = wrapper.get('svg')
    expect(svg.attributes('width')).toBe('48')
    expect(svg.attributes('height')).toBe('48')
    expect(svg.attributes('viewBox')).toBe('0 0 48 48')
    // 半径 = (直径 - 线宽) / 2 = (48 - 4) / 2
    for (const circle of wrapper.findAll('circle')) {
      expect(circle.attributes('r')).toBe('22')
      expect(circle.attributes('stroke-width')).toBe('4')
    }
  })

  it('computes stroke-dashoffset from value', () => {
    const fill = renderProgress({ value: 25, max: 100 }).get('.astryx-circular-progress__fill')
    // 周长 = 2π * 22 ≈ 138.23；偏移 = 周长 * (1 - 0.25)
    expect(Number.parseFloat(fill.attributes('stroke-dasharray') ?? '')).toBeCloseTo(138.23, 1)
    expect(Number.parseFloat(fill.attributes('stroke-dashoffset') ?? '')).toBeCloseTo(103.67, 1)
  })

  it('handles zero max gracefully', () => {
    const bar = renderProgress({ value: 0, max: 0 }).get('[role="progressbar"]')
    expect(bar.attributes('aria-valuenow')).toBe('0')
    expect(bar.attributes('aria-valuemax')).toBe('0')
  })

  it('treats a NaN value as empty progress instead of leaking "NaN"', () => {
    const wrapper = renderProgress({ value: Number.NaN, hasValueLabel: true })
    expect(wrapper.text()).not.toContain('NaN')
    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('0')
  })

  it('treats a NaN max as an empty range instead of leaking "NaN"', () => {
    const wrapper = renderProgress({ value: 50, max: Number.NaN, hasValueLabel: true })
    expect(wrapper.text()).not.toContain('NaN')
    const bar = wrapper.get('[role="progressbar"]')
    expect(bar.attributes('aria-valuenow')).toBe('0')
    expect(bar.attributes('aria-valuemax')).toBe('0')
  })

  it('does not render NaN in the value label when max is zero', () => {
    const wrapper = renderProgress({ value: 5, max: 0, hasValueLabel: true })
    expect(wrapper.text()).not.toMatch(/NaN|Infinity/)
    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuetext')).toBe('0%')
    expect(wrapper.get('.astryx-circular-progress__value').text()).toBe('0%')
  })

  describe('disabled state', () => {
    it('swaps the fill to the disabled variant', () => {
      const wrapper = renderProgress({ isDisabled: true })
      expect(wrapper.get('.astryx-circular-progress__fill').attributes('data-variant')).toBe('disabled')
      // 根元素保留原 variant，主题还能按它选样式。
      expect(wrapper.get('.astryx-circular-progress').attributes('data-variant')).toBe('accent')
    })

    it('still renders label and value label when disabled', () => {
      const wrapper = renderProgress({ label: 'Canceled', isDisabled: true, hasValueLabel: true, isLabelHidden: false })
      expect(wrapper.get('.astryx-circular-progress__label').text()).toBe('Canceled')
      expect(wrapper.get('.astryx-circular-progress__value').text()).toBe('50%')
    })
  })

  describe('indeterminate mode', () => {
    it('renders indeterminate when isIndeterminate is true', () => {
      const bar = renderProgress({ isIndeterminate: true }).get('[role="progressbar"]')
      expect(bar.exists()).toBe(true)
      expect(bar.attributes('aria-valuenow')).toBeUndefined()
      expect(bar.attributes('aria-valuemin')).toBeUndefined()
      expect(bar.attributes('aria-valuemax')).toBeUndefined()
    })

    it('does not set aria-valuetext when indeterminate', () => {
      expect(renderProgress({ isIndeterminate: true }).get('[role="progressbar"]').attributes('aria-valuetext')).toBeUndefined()
    })

    it('is labelled via aria-labelledby when indeterminate', () => {
      expect(renderProgress({ isIndeterminate: true, label: 'Loading data' }).get('[role="progressbar"]').attributes('aria-labelledby')).toBeTruthy()
    })

    it('suppresses the value label when indeterminate', () => {
      const wrapper = renderProgress({ isIndeterminate: true, hasValueLabel: true })
      expect(wrapper.text()).not.toContain('50%')
      expect(wrapper.find('.astryx-circular-progress__center').exists()).toBe(false)
    })

    it('animates the dashed arc instead of drawing a fixed dasharray', () => {
      const wrapper = renderProgress({ isIndeterminate: true })
      const fill = wrapper.get('.astryx-circular-progress__fill')
      expect(fill.classes()).toContain('astryx-circular-progress__fill--indeterminate')
      expect(fill.attributes('stroke-dasharray')).toBeUndefined()
      expect(wrapper.get('svg').classes()).toContain('astryx-circular-progress__svg--indeterminate')
    })

    it('renders slot content alongside indeterminate animation', () => {
      expect(renderProgress({ isIndeterminate: true }, '...').get('.astryx-circular-progress__center').text()).toBe('...')
    })
  })

  it('renders on the server', async () => {
    const app = createSSRApp({
      render: () => h(CircularProgress, {
        value: 75,
        label: 'Upload progress',
        variant: 'success',
        hasValueLabel: true,
        isLabelHidden: false,
      }),
    })
    const html = await renderToString(app)
    expect(html).toContain('role="progressbar"')
    expect(html).toContain('aria-valuenow="75"')
    expect(html).toContain('data-variant="success"')
    expect(html).toContain('>75%<')
  })
})
