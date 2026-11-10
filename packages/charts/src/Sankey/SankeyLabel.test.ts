import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mountSankey } from '../../test-support/sankey.js'
import SankeyLabel from './SankeyLabel.vue'

const shortNodes = [
  { id: 'a', label: 'Alpha', value: 8, color: [0.5, 0.1, 100] as [number, number, number] },
  { id: 'b', label: 'Bravo', value: 8, color: [0.6, 0.2, 200] as [number, number, number] },
  { id: 'c', label: 'Gamma', value: 8, color: [0.7, 0.3, 300] as [number, number, number] },
]

function textContents(element: Element): string[] {
  return [...element.querySelectorAll('text')].map(text => text.textContent?.trim() ?? '')
}

describe('sankeyLabel', () => {
  it('rotates labels onto tall bars and shows downstream percentages', () => {
    const wrapper = mountSankey({ height: 300 }, () => h(SankeyLabel))
    expect(textContents(wrapper.element)).toEqual(['A = 8', 'B = 8', '100%', 'C = 8', '100%'])
    const labelA = [...wrapper.element.querySelectorAll('text')].find(text => text.textContent?.trim() === 'A = 8')
    expect(labelA?.closest('g[transform]')?.getAttribute('transform')).toBe('translate(10, 156) rotate(-90)')
    const percentages = [...wrapper.element.querySelectorAll('text')].filter(text => text.textContent?.trim() === '100%')
    expect(percentages[0].getAttribute('x')).toBe('500')
    expect(percentages[1].getAttribute('x')).toBe('990')
    expect(percentages[0].getAttribute('y')).toBe('296')
    wrapper.unmount()
  })

  it('hides percentages and formats values through a callback', () => {
    const hidden = mountSankey({ height: 300 }, () => h(SankeyLabel, { showPercent: false }))
    expect(textContents(hidden.element)).toEqual(['A = 8', 'B = 8', 'C = 8'])
    hidden.unmount()

    const custom = mountSankey({ height: 300 }, () => h(SankeyLabel, {
      showPercent: false,
      formatValue: (value: number) => `${value}pts`,
    }))
    expect(textContents(custom.element)).toEqual(['A = 8pts', 'B = 8pts', 'C = 8pts'])
    custom.unmount()
  })

  it('chooses contrasting text for dark and light bars', () => {
    const wrapper = mountSankey({ height: 300 }, () => h(SankeyLabel, { showPercent: false }))
    const texts = wrapper.element.querySelectorAll('text')
    expect(texts[0].getAttribute('style')).toContain('var(--astryx-color-on-dark')
    expect(texts[2].getAttribute('style')).toContain('var(--astryx-color-on-light')
    wrapper.unmount()
  })

  it('places short labels beside bars and anchors the last column leftward', () => {
    const wrapper = mountSankey({ nodes: shortNodes, height: 100 }, () => h(SankeyLabel, { showPercent: false }))
    const texts = [...wrapper.element.querySelectorAll('text')]
    const alpha = texts.find(text => text.textContent?.trim() === 'Alpha = 8')
    expect(alpha?.getAttribute('x')).toBe('26')
    expect(alpha?.getAttribute('y')).toBe('56')
    expect(alpha?.getAttribute('text-anchor')).toBe('start')
    expect(alpha?.previousElementSibling?.getAttribute('width')).toBe('64')
    const gamma = texts.find(text => text.textContent?.trim() === 'Gamma = 8')
    expect(gamma?.getAttribute('x')).toBe('974')
    expect(gamma?.getAttribute('text-anchor')).toBe('end')
    expect(gamma?.previousElementSibling?.getAttribute('x')).toBe('914')
    wrapper.unmount()
  })

  it('compacts large values and keeps one decimal on small percentages', () => {
    const nodes = [
      { id: 'a', label: 'A', value: 12000, color: [0.5, 0.1, 100] as [number, number, number] },
      { id: 'b', label: 'B', value: 1500, color: [0.6, 0.2, 200] as [number, number, number] },
      { id: 'c', label: 'C', value: 600, color: [0.7, 0.3, 300] as [number, number, number] },
    ]
    const links = [{ source: 'a', target: 'b', value: 1500 }, { source: 'a', target: 'c', value: 600 }]
    const wrapper = mountSankey({ nodes, links, height: 300 }, () => h(SankeyLabel))
    expect(textContents(wrapper.element)).toEqual(['A = 12k', 'B = 1.5k', '13%', 'C = 600', '5.0%'])
    wrapper.unmount()
  })

  it('renders no labels before width is known', () => {
    const wrapper = mountSankey({ width: 0, height: 300 }, () => h(SankeyLabel))
    expect(wrapper.element.querySelectorAll('text')).toHaveLength(0)
    wrapper.unmount()
  })
})
