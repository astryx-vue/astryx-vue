import type { SankeyLinkProps } from './types.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mountSankey, sankeyLinks, sankeyNodes } from '../../test-support/sankey.js'
import SankeyChart from './SankeyChart.vue'
import SankeyLink from './SankeyLink.vue'

function renderLink(props: SankeyLinkProps = {}, width = 1000): ReturnType<typeof mountSankey> {
  return mountSankey({ height: 300, width }, () => h(SankeyLink, props))
}

describe('sankeyLink', () => {
  it('renders one bezier ribbon per link using layout coordinates', () => {
    const wrapper = renderLink()
    const paths = wrapper.element.querySelectorAll('path')
    expect(paths).toHaveLength(2)
    expect(paths[0].getAttribute('d')).toBe('M20,28 C255,28 255,28 490,28 L490,156 C255,156 255,156 20,156 Z')
    expect(paths[1].getAttribute('d')).toBe('M510,28 C745,28 745,28 980,28 L980,156 C745,156 745,156 510,156 Z')
    wrapper.unmount()
  })

  it('renders source-to-target gradients with default and biased stops', () => {
    const wrapper = renderLink()
    const gradients = wrapper.element.querySelectorAll('linearGradient')
    expect(gradients).toHaveLength(2)
    expect(gradients[0].getAttribute('gradientUnits')).toBe('userSpaceOnUse')
    expect(gradients[0].getAttribute('x1')).toBe('20')
    expect(gradients[0].getAttribute('x2')).toBe('490')
    const stops = gradients[0].querySelectorAll('stop')
    expect([...stops].map(stop => stop.getAttribute('offset'))).toEqual(['0%', '35%', '65%', '100%'])
    expect(stops[0].getAttribute('stop-color')).toBe('oklch(0.5 0.1 100 / 0.7)')
    expect(stops[1].getAttribute('stop-color')).toBe('oklch(0.5 0.1 100 / 0.63)')
    expect(wrapper.element.querySelector('path')?.getAttribute('fill')).toBe(`url(#${gradients[0].id})`)
    wrapper.unmount()

    const biased = renderLink({ color: { gradient: 0.75 } })
    const biasedStops = biased.element.querySelectorAll('linearGradient')[0].querySelectorAll('stop')
    expect(biasedStops[1].getAttribute('offset')).toBe('60%')
    expect(biasedStops[2].getAttribute('offset')).toBe('90%')
    biased.unmount()
  })

  it('supports source, target and flat color modes', () => {
    const source = renderLink({ color: 'source' })
    expect(source.element.querySelector('linearGradient')).toBeNull()
    expect(source.element.querySelectorAll('path')[0].getAttribute('fill')).toBe('oklch(0.5 0.1 100 / 0.7)')
    expect(source.element.querySelectorAll('path')[1].getAttribute('fill')).toBe('oklch(0.6 0.2 200 / 0.7)')
    source.unmount()

    const target = renderLink({ color: 'target' })
    expect(target.element.querySelectorAll('path')[0].getAttribute('fill')).toBe('oklch(0.6 0.2 200 / 0.7)')
    target.unmount()

    const flat = renderLink({ color: '#ff8800', opacity: 0.5 })
    expect(flat.element.querySelector('defs')).toBeNull()
    expect(flat.element.querySelector('path')?.getAttribute('fill')).toBe('#ff8800')
    expect(flat.element.querySelector('path')?.getAttribute('opacity')).toBe('0.5')
    flat.unmount()
  })

  it('draws straight ribbons at zero tension', () => {
    const wrapper = renderLink({ tension: 0 })
    expect(wrapper.element.querySelector('path')?.getAttribute('d')).toBe('M20,28 C20,28 490,28 490,28 L490,156 C490,156 20,156 20,156 Z')
    wrapper.unmount()
  })

  it('uses unique gradient IDs across charts on the same page', () => {
    const wrapper = mount(defineComponent({
      render: () => h('div', [
        h(SankeyChart, { nodes: sankeyNodes, links: sankeyLinks, width: 1000 }, { default: () => h(SankeyLink) }),
        h(SankeyChart, { nodes: sankeyNodes, links: sankeyLinks, width: 1000 }, { default: () => h(SankeyLink) }),
      ]),
    }))
    const gradients = wrapper.element.querySelectorAll('linearGradient')
    expect(gradients).toHaveLength(4)
    expect(new Set([...gradients].map(gradient => gradient.id)).size).toBe(4)
    wrapper.unmount()
  })

  it('renders no ribbons before width is known', () => {
    const wrapper = renderLink({}, 0)
    expect(wrapper.element.querySelectorAll('path')).toHaveLength(0)
    wrapper.unmount()
  })
})
