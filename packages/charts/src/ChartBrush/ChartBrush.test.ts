import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
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

function stubLocalCoordinates(brush: ReturnType<typeof mountBrush>): void {
  const surface = brush.getComponent(ChartBrush).get('rect[fill="transparent"]')
  const svg = (surface.element as SVGRectElement).ownerSVGElement!
  Object.defineProperty(svg, 'createSVGPoint', {
    configurable: true,
    value: () => ({
      x: 0,
      y: 0,
      matrixTransform() {
        return { x: this.x, y: this.y }
      },
    }),
  })
  Object.defineProperty(surface.element, 'getScreenCTM', {
    configurable: true,
    value: () => ({ inverse: () => ({}) }),
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

  it('discards a pending selection on pointercancel without emitting a result', async () => {
    const wrapper = mountBrush()
    stubLocalCoordinates(wrapper)
    const brush = wrapper.getComponent(ChartBrush)
    const surface = brush.get('rect[fill="transparent"]')
    await surface.trigger('pointerdown', { pointerId: 1, clientX: 100, clientY: 100 })
    await surface.trigger('pointermove', { pointerId: 1, clientX: 180, clientY: 140 })
    expect(brush.findAll('rect')).toHaveLength(2)
    await surface.trigger('pointercancel', { pointerId: 1 })
    expect(brush.findAll('rect')).toHaveLength(1)
    expect(brush.emitted('brush')).toBeUndefined()
    expect(brush.emitted('clear')).toBeUndefined()
    wrapper.unmount()
  })

  it('limits root touch-action none to charts containing drag interactions', () => {
    const css = readFileSync(resolve(process.cwd(), 'packages/charts/styles/chart.css'), 'utf8')
    expect(css).toContain('.astryx-chart__plot > svg:has(.astryx-chart-brush, .astryx-chart-zoom)')
    expect(css).toContain('touch-action: none')
  })
})
