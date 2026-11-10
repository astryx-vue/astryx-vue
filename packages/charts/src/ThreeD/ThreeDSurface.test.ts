import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mountThreeD } from '../../test-support/three-d.js'
import ThreeDSurface from './ThreeDSurface.vue'

const grid = [0, 1, 2].flatMap(x => [0, 1, 2].map(z => ({ x, y: x + z, z })))

describe('threeDSurface', () => {
  it('builds four quad faces from a complete 3x3 grid', () => {
    const wrapper = mountThreeD({ data: grid }, () => h(ThreeDSurface, { colorRange: ['#336699'] }))
    const polygons = [...wrapper.element.querySelectorAll('polygon')]
    expect(polygons).toHaveLength(4)
    for (const polygon of polygons) {
      expect(polygon.getAttribute('points')?.split(' ')).toHaveLength(4)
      expect(polygon.getAttribute('fill')).toBe('#336699')
      expect(polygon.getAttribute('points')).not.toContain('NaN')
    }
    wrapper.unmount()
  })

  it('selects the nearest ramp color by normalized face height', () => {
    const wrapper = mountThreeD({ data: grid }, () => h(ThreeDSurface, { colorRange: ['#aaaaaa', '#bbbbbb'] }))
    const fills = [...wrapper.element.querySelectorAll('polygon')].map(polygon => polygon.getAttribute('fill'))
    expect(fills.filter(fill => fill === '#aaaaaa')).toHaveLength(1)
    expect(fills.filter(fill => fill === '#bbbbbb')).toHaveLength(3)
    wrapper.unmount()
  })

  it('renders wireframe faces without fill', () => {
    const wrapper = mountThreeD({ data: grid }, () => h(ThreeDSurface, { colorRange: ['#336699'], wireframe: true }))
    for (const polygon of wrapper.element.querySelectorAll('polygon')) {
      expect(polygon.getAttribute('fill')).toBe('none')
      expect(polygon.getAttribute('stroke')).toBe('#336699')
    }
    wrapper.unmount()
  })

  it('skips missing cells and degenerate grids', () => {
    const holed = mountThreeD({ data: grid.filter(row => !(row.x === 2 && row.z === 2)) }, () => h(ThreeDSurface, { colorRange: ['#336699'] }))
    expect(holed.element.querySelectorAll('polygon')).toHaveLength(3)
    holed.unmount()

    const flat = mountThreeD({ data: grid.filter(row => row.z === 0) }, () => h(ThreeDSurface, { colorRange: ['#336699'] }))
    expect(flat.element.querySelector('polygon')).toBeNull()
    flat.unmount()
  })

  it('does not render a face containing an invalid point', () => {
    const invalid = grid.map(row => row.x === 2 && row.z === 2 ? { ...row, y: Number.NaN } : row)
    const wrapper = mountThreeD({ data: invalid }, () => h(ThreeDSurface, { colorRange: [] }))
    expect(wrapper.element.querySelectorAll('polygon')).toHaveLength(3)
    expect(wrapper.element.querySelector('svg')?.outerHTML).not.toContain('NaN')
    wrapper.unmount()
  })
})
