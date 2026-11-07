import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Chart from '../Chart/Chart.vue'
import ChartBrush from './ChartBrush.vue'

function mountBrush(mode: 'x' | 'xy' = 'x') {
  return mount(Chart, {
    props: {
      data: [{ x: 0, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 3 }],
      xKey: 'x',
      series: [],
      width: 500,
      height: 300,
    },
    slots: { interactions: () => h(ChartBrush, { mode }) },
  })
}

describe('chartBrush', () => {
  it('renders a full-plot capture surface and no selection before dragging', () => {
    const wrapper = mountBrush()
    const brush = wrapper.getComponent(ChartBrush)
    const surface = brush.get('rect[fill="transparent"]')
    expect(surface.attributes('width')).toBe('428')
    expect(surface.attributes('height')).toBe('244')
    expect(brush.findAll('rect')).toHaveLength(1)
    wrapper.unmount()
  })

  it('supports the rectangular xy mode without an initial selection', () => {
    const wrapper = mountBrush('xy')
    const brush = wrapper.getComponent(ChartBrush)
    expect(brush.findAll('rect')).toHaveLength(1)
    expect(brush.get('rect').attributes('style')).toContain('crosshair')
    wrapper.unmount()
  })
})
