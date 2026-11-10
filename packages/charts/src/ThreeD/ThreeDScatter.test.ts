import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mountThreeD } from '../../test-support/three-d.js'
import ThreeDScatter from './ThreeDScatter.vue'

const data = [
  { x: 0, y: 0, z: 0 },
  { x: 2, y: 2, z: 2 },
  { x: 1, y: 2, z: 0 },
]

describe('threeDScatter', () => {
  it('renders every valid point with finite coordinates and depth sorting', () => {
    const wrapper = mountThreeD({ data }, () => h(ThreeDScatter, { color: '#ff0000' }))
    const circles = wrapper.element.querySelectorAll('circle')
    expect(circles).toHaveLength(3)
    for (const circle of circles) {
      expect(circle.getAttribute('fill')).toBe('#ff0000')
      expect(Number.isFinite(Number(circle.getAttribute('cx')))).toBe(true)
      expect(Number.isFinite(Number(circle.getAttribute('cy')))).toBe(true)
    }
    const radii = [...circles].map(circle => Number(circle.getAttribute('r')))
    expect(radii[0]).toBeLessThan(radii[1])
    expect(radii[1]).toBeLessThan(radii[2])
    wrapper.unmount()
  })

  it('scales radius and opacity from props and skips invalid rows', () => {
    const wrapper = mountThreeD({ data: [...data, { x: Number.NaN, y: 1, z: 1 }] }, () => h(ThreeDScatter, {
      color: '#ff0000',
      radius: 10,
      opacity: 0.5,
    }))
    const circles = [...wrapper.element.querySelectorAll('circle')]
    expect(circles).toHaveLength(3)
    for (const circle of circles) {
      expect(Number(circle.getAttribute('r'))).toBeLessThanOrEqual(10)
      expect(Number(circle.getAttribute('fill-opacity'))).toBeLessThanOrEqual(0.5)
    }
    wrapper.unmount()
  })
})
