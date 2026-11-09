import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { byRole, queryByRole } from '../../test-support/a11y.js'
import { stubResizeObserver } from '../../test-support/chart.js'
import { mountRadial, pieData, spiderAxes, spiderData } from '../../test-support/radial.js'
import { useRadial } from './context.js'

describe('radialChart accessibility', () => {
  it('names spider and pie charts from their fields', () => {
    const spider = mountRadial({ data: spiderData, axes: spiderAxes })
    expect(byRole('img', 'Radar chart of speed, handling, and comfort', spider.element)).not.toBeNull()
    spider.unmount()

    const pie = mountRadial({ data: pieData, valueKey: 'revenue', labelKey: 'region' })
    expect(byRole('img', 'Pie chart of revenue', pie.element)).not.toBeNull()
    pie.unmount()
  })

  it('uses a custom accessible label', () => {
    const wrapper = mountRadial({ data: pieData, valueKey: 'revenue', label: 'Revenue by region' })
    expect(byRole('img', 'Revenue by region', wrapper.element)).not.toBeNull()
    wrapper.unmount()
  })

  it('mirrors pie slices into a visually hidden table', () => {
    const wrapper = mountRadial({ data: pieData, valueKey: 'revenue', labelKey: 'region' })
    expect(byRole('rowheader', 'NA', wrapper.element)).not.toBeNull()
    expect(byRole('cell', '50.0%', wrapper.element)).not.toBeNull()
    expect(byRole('rowheader', 'EU', wrapper.element)).not.toBeNull()
    const table = byRole('table', undefined, wrapper.element)
    expect(table.parentElement?.hasAttribute('hidden')).toBe(false)
    wrapper.unmount()
  })

  it('mirrors spider rows across all axes and respects the cutoff', () => {
    const wrapper = mountRadial({ data: spiderData, axes: spiderAxes })
    expect(byRole('columnheader', 'speed', wrapper.element)).not.toBeNull()
    expect(byRole('rowheader', 'A', wrapper.element)).not.toBeNull()
    expect(byRole('rowheader', 'B', wrapper.element)).not.toBeNull()
    expect(byRole('cell', '8', wrapper.element)).not.toBeNull()
    wrapper.unmount()

    const big = Array.from({ length: 101 }, (_, index) => ({ region: `r${index}`, revenue: index + 1 }))
    const large = mountRadial({ data: big, valueKey: 'revenue', labelKey: 'region' })
    expect(queryByRole('table', large.element)).toBeNull()
    large.unmount()
  })
})

describe('radialChart sizing', () => {
  it('reserves height before measurement and renders after ResizeObserver reports width', async () => {
    const observer = stubResizeObserver()
    const wrapper = mountRadial({ data: pieData, valueKey: 'revenue', width: 0 })
    expect(wrapper.element.querySelector('svg')).toBeNull()
    expect((wrapper.element as HTMLElement).style.height).toBe('400px')
    await observer.reportWidth(600)
    const svg = byRole('img', 'Pie chart of revenue', wrapper.element)
    expect(svg.getAttribute('width')).toBe('600')
    expect(svg.getAttribute('height')).toBe('400')
    vi.unstubAllGlobals()
    wrapper.unmount()
  })

  it('uses explicit width and height for deterministic rendering', () => {
    const wrapper = mountRadial({ data: spiderData, axes: spiderAxes, width: 500, height: 300 })
    const svg = byRole('img', undefined, wrapper.element)
    expect(svg.getAttribute('width')).toBe('500')
    expect(svg.getAttribute('height')).toBe('300')
    wrapper.unmount()
  })
})

describe('useRadial', () => {
  it('throws when used outside RadialChart', () => {
    const Probe = defineComponent({
      setup() {
        useRadial()
        return () => null
      },
    })
    expect(() => mount(Probe)).toThrow('Radial components must be used inside <RadialChart>')
  })
})
