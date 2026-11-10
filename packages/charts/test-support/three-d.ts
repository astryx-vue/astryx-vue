import type { ThreeDChartProps } from '../src/ThreeD/types.js'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import ThreeDChart from '../src/ThreeD/ThreeDChart.vue'

export const threeDData = [
  { x: 0, y: 0, z: 0 },
  { x: 2, y: 2, z: 2 },
]

export function mountThreeD(
  props: Partial<ThreeDChartProps> = {},
  slot: () => unknown = () => h('g'),
): ReturnType<typeof mount> {
  return mount(ThreeDChart, {
    props: { data: threeDData, xKey: 'x', yKey: 'y', zKey: 'z', width: 600, ...props },
    slots: { default: slot },
  })
}
