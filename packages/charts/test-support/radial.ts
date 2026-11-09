import type { RadialChartProps } from '../src/Radial/types.js'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import RadialChart from '../src/Radial/RadialChart.vue'

export const spiderData = [
  { model: 'A', speed: 10, handling: 5, comfort: 8 },
  { model: 'B', speed: 5, handling: 10, comfort: 4 },
]

export const pieData = [
  { region: 'NA', revenue: 500 },
  { region: 'EU', revenue: 300 },
  { region: 'APAC', revenue: 200 },
]

export const spiderAxes = ['speed', 'handling', 'comfort']

export function mountRadial(
  props: RadialChartProps,
  slot: () => unknown = () => h('g'),
): ReturnType<typeof mount> {
  return mount(RadialChart, {
    props: { width: 600, ...props },
    slots: { default: slot },
  })
}
