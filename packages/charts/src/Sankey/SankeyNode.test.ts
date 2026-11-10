import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mountSankey } from '../../test-support/sankey.js'
import SankeyNode from './SankeyNode.vue'

describe('sankeyNode', () => {
  it('renders glow and bar geometry with per-node colors', () => {
    const wrapper = mountSankey({ height: 300 }, () => h(SankeyNode))
    const rects = wrapper.element.querySelectorAll('rect')
    expect(rects).toHaveLength(6)
    expect(rects[0].getAttribute('x')).toBe('-3')
    expect(rects[0].getAttribute('y')).toBe('27')
    expect(rects[0].getAttribute('width')).toBe('26')
    expect(rects[0].getAttribute('height')).toBe('258')
    expect(rects[0].getAttribute('fill')).toBe('oklch(0.5 0.1 100 / 0.12)')
    expect(rects[1].getAttribute('x')).toBe('0')
    expect(rects[1].getAttribute('y')).toBe('28')
    expect(rects[1].getAttribute('height')).toBe('256')
    expect(rects[1].getAttribute('fill')).toBe('oklch(0.5 0.1 100 / 0.9)')
    expect(rects[3].getAttribute('x')).toBe('490')
    expect(rects[5].getAttribute('x')).toBe('980')
    wrapper.unmount()
  })

  it('can disable glow and supports a global node color', () => {
    const plain = mountSankey({ height: 300 }, () => h(SankeyNode, { glow: false }))
    expect(plain.element.querySelectorAll('rect')).toHaveLength(3)
    plain.unmount()

    const override = mountSankey({ height: 300, nodeColor: '#334455' }, () => h(SankeyNode))
    for (const rect of override.element.querySelectorAll('rect'))
      expect(rect.getAttribute('fill')).toBe('#334455')
    expect(override.element.querySelector('rect')?.getAttribute('opacity')).toBe('0.12')
    override.unmount()
  })
})
