import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mountThreeD } from '../../test-support/three-d.js'
import ThreeDBar from './ThreeDBar.vue'

describe('threeDBar', () => {
  it('renders three shaded, four-corner faces per bar in depth order', () => {
    const wrapper = mountThreeD({ data: [{ x: 0, y: 1, z: 0 }, { x: 2, y: 2, z: 2 }] }, () => h(ThreeDBar, { color: '#00ff00' }))
    const bars = wrapper.element.querySelectorAll('.astryx-three-d-bar')
    expect(bars).toHaveLength(2)
    expect(wrapper.element.querySelectorAll('polygon')).toHaveLength(6)
    for (const bar of bars) {
      const polygons = [...bar.querySelectorAll('polygon')]
      expect(polygons.map(polygon => polygon.getAttribute('fill-opacity'))).toEqual(['0.9', '0.7', '1'])
      for (const polygon of polygons) {
        expect(polygon.getAttribute('fill')).toBe('#00ff00')
        expect(polygon.getAttribute('points')?.split(' ')).toHaveLength(4)
        expect(polygon.getAttribute('points')).not.toContain('NaN')
      }
    }
    wrapper.unmount()
  })

  it('accepts custom normalized width and depth', () => {
    const wrapper = mountThreeD({}, () => h(ThreeDBar, { color: '#00ff00', barWidth: 0.2, barDepth: 0.1 }))
    expect(wrapper.element.querySelectorAll('polygon')).toHaveLength(6)
    expect(wrapper.element.querySelector('polygon')?.getAttribute('points')).not.toContain('NaN')
    wrapper.unmount()
  })
})
