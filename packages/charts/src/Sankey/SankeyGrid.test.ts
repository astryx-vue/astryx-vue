import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mountSankey } from '../../test-support/sankey.js'
import SankeyGrid from './SankeyGrid.vue'

const columns = [
  { ids: ['a'], label: 'Source' },
  { ids: ['b'], label: 'Middle' },
  { ids: ['c'], label: 'Target' },
]

describe('sankeyGrid', () => {
  it('renders dashed lines and rich column headers at bar centers', () => {
    const wrapper = mountSankey({ columns }, () => h(SankeyGrid))
    const lines = wrapper.element.querySelectorAll('line')
    expect(lines).toHaveLength(3)
    expect([...lines].map(line => line.getAttribute('x1'))).toEqual(['10', '500', '990'])
    expect(lines[0].getAttribute('y2')).toBe('320')
    expect(lines[0].getAttribute('stroke')).toBe('var(--astryx-color-border, #e5e5e5)')
    expect(lines[0].getAttribute('stroke-dasharray')).toBe('4 4')
    const texts = [...wrapper.element.querySelectorAll('text')]
    expect(texts.map(text => text.textContent?.trim())).toEqual(['Source', 'Middle', 'Target'])
    expect(texts.map(text => text.getAttribute('x'))).toEqual(['0', '500', '1000'])
    expect(texts.map(text => text.getAttribute('text-anchor'))).toEqual(['start', 'middle', 'end'])
    expect(texts[0].getAttribute('y')).toBe('318')
    wrapper.unmount()
  })

  it('can hide headers and accepts simple string-array columns', () => {
    const hidden = mountSankey({ columns }, () => h(SankeyGrid, { showHeaders: false }))
    expect(hidden.element.querySelectorAll('text')).toHaveLength(0)
    expect(hidden.element.querySelectorAll('line')).toHaveLength(3)
    hidden.unmount()

    const simple = mountSankey({ columns: [['a'], ['b'], ['c']] }, () => h(SankeyGrid))
    expect(simple.element.querySelectorAll('text')).toHaveLength(0)
    simple.unmount()
  })

  it('applies custom line color, dash pattern and opacity', () => {
    const wrapper = mountSankey({ columns }, () => h(SankeyGrid, { color: '#123456', dashArray: '2 6', opacity: 0.5 }))
    const line = wrapper.element.querySelector('line')
    expect(line?.getAttribute('stroke')).toBe('#123456')
    expect(line?.getAttribute('stroke-dasharray')).toBe('2 6')
    expect(line?.getAttribute('stroke-opacity')).toBe('0.5')
    wrapper.unmount()
  })
})
