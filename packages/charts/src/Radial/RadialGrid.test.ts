import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mountRadial, pieData, spiderAxes, spiderData } from '../../test-support/radial.js'
import RadialGrid from './RadialGrid.vue'

function mountGrid(rings?: number) {
  return mountRadial(
    { data: spiderData, axes: spiderAxes },
    () => h(RadialGrid, { rings }),
  )
}

describe('radialGrid', () => {
  it('renders five rings by default or the requested ring count', () => {
    const standard = mountGrid()
    expect(standard.findAll('polygon')).toHaveLength(5)
    standard.unmount()

    const four = mountGrid(4)
    expect(four.findAll('polygon')).toHaveLength(4)
    four.unmount()
  })

  it('gives each ring one vertex per axis and puts the outer ring at the radius', () => {
    const wrapper = mountGrid()
    const polygons = wrapper.findAll('polygon')
    for (const polygon of polygons)
      expect((polygon.attributes('points') ?? '').split(' ')).toHaveLength(3)
    const [x, y] = polygons[polygons.length - 1]!.attributes('points')!.split(' ')[0]!.split(',').map(Number)
    expect(x).toBeCloseTo(300)
    expect(y).toBeCloseTo(40)
    wrapper.unmount()
  })

  it('draws one axis line per axis from center to the outer radius', () => {
    const wrapper = mountGrid()
    const lines = wrapper.findAll('line')
    expect(lines).toHaveLength(3)
    expect(Number(lines[0].attributes('x1'))).toBeCloseTo(300)
    expect(Number(lines[0].attributes('y1'))).toBeCloseTo(200)
    expect(Number(lines[0].attributes('x2'))).toBeCloseTo(300)
    expect(Number(lines[0].attributes('y2'))).toBeCloseTo(40)
    wrapper.unmount()
  })

  it('renders nothing in pie mode or with zero rings', () => {
    const pie = mountRadial({ data: pieData, valueKey: 'revenue' }, () => h(RadialGrid))
    expect(pie.find('polygon').exists()).toBe(false)
    expect(pie.find('line').exists()).toBe(false)
    pie.unmount()

    const zero = mountGrid(0)
    expect(zero.find('polygon').exists()).toBe(false)
    zero.unmount()
  })
})
