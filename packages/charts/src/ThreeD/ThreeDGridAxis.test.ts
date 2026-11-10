import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mountThreeD } from '../../test-support/three-d.js'
import ThreeDAxis from './ThreeDAxis.vue'
import ThreeDGrid from './ThreeDGrid.vue'

describe('threeDGrid', () => {
  it('renders two finite floor lines per division boundary', () => {
    const wrapper = mountThreeD({}, () => h(ThreeDGrid))
    const lines = [...wrapper.element.querySelectorAll('line')]
    expect(lines).toHaveLength(12)
    for (const line of lines) {
      for (const attribute of ['x1', 'y1', 'x2', 'y2'])
        expect(Number.isFinite(Number(line.getAttribute(attribute)))).toBe(true)
    }
    wrapper.unmount()
  })

  it('supports custom divisions and guards zero divisions', () => {
    const custom = mountThreeD({}, () => h(ThreeDGrid, { divisions: 2 }))
    expect(custom.element.querySelectorAll('line')).toHaveLength(6)
    custom.unmount()
    const zero = mountThreeD({}, () => h(ThreeDGrid, { divisions: 0 }))
    expect(zero.element.querySelectorAll('line')).toHaveLength(4)
    zero.unmount()
  })
})

describe('threeDAxis', () => {
  it('draws three axes from one origin and labels their keys and domains', () => {
    const wrapper = mountThreeD({}, () => h(ThreeDAxis))
    const lines = [...wrapper.element.querySelectorAll('line')]
    expect(lines).toHaveLength(3)
    const origins = lines.map(line => [line.getAttribute('x1'), line.getAttribute('y1')])
    expect(origins[1]).toEqual(origins[0])
    expect(origins[2]).toEqual(origins[0])
    const texts = [...wrapper.element.querySelectorAll('text')].map(text => text.textContent?.replace(/\s+/g, ' ').trim())
    expect(texts).toEqual(['x [0–2]', 'y [0–2]', 'z [0–2]'])
    wrapper.unmount()
  })

  it('formats floating-point domains with compact numbers', () => {
    const data = [
      { x: 0.9424627589324874, y: 2.1470505580819994, z: 0.8000117521391559 },
      { x: 7.098397679912066, y: 7.896887887320895, z: 9.199171266497501 },
    ]
    const wrapper = mountThreeD({ data }, () => h(ThreeDAxis))
    const texts = [...wrapper.element.querySelectorAll('text')].map(text => text.textContent?.replace(/\s+/g, ' ').trim())
    expect(texts).toEqual(['x [0.9–7.1]', 'y [2.1–7.9]', 'z [0.8–9.2]'])
    wrapper.unmount()
  })

  it('can hide labels without hiding axis lines', () => {
    const wrapper = mountThreeD({}, () => h(ThreeDAxis, { labels: false }))
    expect(wrapper.element.querySelectorAll('line')).toHaveLength(3)
    expect(wrapper.element.querySelector('text')).toBeNull()
    wrapper.unmount()
  })
})
