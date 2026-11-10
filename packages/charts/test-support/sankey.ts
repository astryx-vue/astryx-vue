import type { SankeyChartProps } from '../src/Sankey/types.js'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import SankeyChart from '../src/Sankey/SankeyChart.vue'

export const sankeyNodes = [
  { id: 'a', label: 'A', value: 8, color: [0.5, 0.1, 100] as [number, number, number] },
  { id: 'b', label: 'B', value: 8, color: [0.6, 0.2, 200] as [number, number, number] },
  { id: 'c', label: 'C', value: 8, color: [0.7, 0.3, 300] as [number, number, number] },
]

export const sankeyLinks = [
  { source: 'a', target: 'b', value: 4 },
  { source: 'b', target: 'c', value: 4 },
]

export function mountSankey(
  props: Partial<SankeyChartProps> = {},
  slot: () => unknown = () => h('g'),
): ReturnType<typeof mount> {
  return mount(SankeyChart, {
    props: { nodes: sankeyNodes, links: sankeyLinks, width: 1000, ...props },
    slots: { default: slot },
  })
}
