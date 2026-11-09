import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mountRadial, pieData, spiderAxes, spiderData } from '../../test-support/radial.js'
import RadialArea from './RadialArea.vue'

function parsePoints(polygon: Element): number[][] {
  return (polygon.getAttribute('points') ?? '').split(' ').map(pair => pair.split(',').map(Number.parseFloat))
}

function mountArea(dataKey = 'A', dots = false) {
  return mountRadial(
    { data: spiderData, axes: spiderAxes },
    () => h(RadialArea, { dataKey, color: '#ff0000', dots, dotRadius: 6 }),
  )
}

describe('radialArea', () => {
  it('renders one polygon with one vertex per axis', () => {
    const wrapper = mountArea()
    const polygon = wrapper.get('polygon')
    expect(parsePoints(polygon.element)).toHaveLength(3)
    expect(polygon.attributes('fill')).toBe('#ff0000')
    wrapper.unmount()
  })

  it('maps the selected row values through the shared axis domains', () => {
    const first = mountArea('A')
    expect(parsePoints(first.get('polygon').element)[0][1]).toBeCloseTo(40)
    first.unmount()

    const second = mountArea('B')
    expect(parsePoints(second.get('polygon').element)[0][1]).toBeCloseTo(120)
    second.unmount()
  })

  it('falls back to the first row for an unmatched dataKey', () => {
    const wrapper = mountArea('missing')
    expect(parsePoints(wrapper.get('polygon').element)[0][1]).toBeCloseTo(40)
    wrapper.unmount()
  })

  it('renders optional vertex dots and no dots by default', () => {
    const dotted = mountArea('A', true)
    expect(dotted.findAll('circle')).toHaveLength(3)
    expect(dotted.get('circle').attributes('r')).toBe('6')
    dotted.unmount()

    const plain = mountArea()
    expect(plain.find('circle').exists()).toBe(false)
    plain.unmount()
  })

  it('renders nothing without data or inside pie mode', () => {
    const empty = mountRadial({ data: [], axes: spiderAxes }, () => h(RadialArea, { dataKey: 'A', color: 'red' }))
    expect(empty.find('polygon').exists()).toBe(false)
    empty.unmount()

    const pie = mountRadial({ data: pieData, valueKey: 'revenue' }, () => h(RadialArea, { dataKey: 'A', color: 'red' }))
    expect(pie.find('polygon').exists()).toBe(false)
    pie.unmount()
  })
})
