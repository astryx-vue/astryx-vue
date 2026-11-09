import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { byText } from '../../test-support/a11y.js'
import { mountRadial, pieData, spiderAxes, spiderData } from '../../test-support/radial.js'
import RadialAxis from './RadialAxis.vue'

function mountAxis(labelOffset = 16) {
  return mountRadial(
    { data: spiderData, axes: spiderAxes },
    () => h(RadialAxis, { labelOffset }),
  )
}

describe('radialAxis', () => {
  it('renders one label per axis inside the SVG', () => {
    const wrapper = mountAxis()
    const svg = wrapper.get('svg').element
    expect(svg.querySelectorAll('text')).toHaveLength(3)
    expect(byText(svg, 'speed')).not.toBeNull()
    expect(byText(svg, 'handling')).not.toBeNull()
    expect(byText(svg, 'comfort')).not.toBeNull()
    wrapper.unmount()
  })

  it('anchors labels by their side and applies the label offset', () => {
    const wrapper = mountAxis()
    const svg = wrapper.get('svg').element
    const top = byText(svg, 'speed')
    expect(top.getAttribute('text-anchor')).toBe('middle')
    expect(byText(svg, 'handling').getAttribute('text-anchor')).toBe('start')
    expect(byText(svg, 'comfort').getAttribute('text-anchor')).toBe('end')
    expect(Number(top.getAttribute('x'))).toBeCloseTo(300)
    expect(Number(top.getAttribute('y'))).toBeCloseTo(24)
    wrapper.unmount()
  })

  it('keeps measured side labels inside a narrow SVG', async () => {
    const prototype = SVGTextElement.prototype
    const original = Object.getOwnPropertyDescriptor(prototype, 'getComputedTextLength')
    Object.defineProperty(prototype, 'getComputedTextLength', {
      configurable: true,
      value(this: SVGTextElement) {
        return (this.textContent ?? '').length * 7
      },
    })
    let wrapper: ReturnType<typeof mountRadial> | undefined
    try {
      wrapper = mountRadial(
        {
          data: spiderData.map(row => ({ ...row, reliability: 7, efficiency: 8 })),
          axes: ['speed', 'handling', 'comfort', 'reliability', 'efficiency'],
          width: 320,
          height: 360,
        },
        () => h(RadialAxis),
      )
      await nextTick()
      await nextTick()
      const svg = wrapper.get('svg').element
      const efficiency = byText(svg, 'efficiency')
      const handling = byText(svg, 'handling')
      expect(Number(efficiency.getAttribute('x')) - 70).toBeGreaterThanOrEqual(4)
      expect(Number(handling.getAttribute('x')) + 56).toBeLessThanOrEqual(316)
    }
    finally {
      wrapper?.unmount()
      if (original)
        Object.defineProperty(prototype, 'getComputedTextLength', original)
      else
        delete (prototype as Partial<SVGTextElement>).getComputedTextLength
    }
  })

  it('renders nothing inside pie mode', () => {
    const wrapper = mountRadial({ data: pieData, valueKey: 'revenue' }, () => h(RadialAxis))
    expect(wrapper.find('text').exists()).toBe(false)
    wrapper.unmount()
  })
})
