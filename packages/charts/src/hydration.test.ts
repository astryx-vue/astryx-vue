import type { Component } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import RadialArea from './Radial/RadialArea.vue'
import RadialAxis from './Radial/RadialAxis.vue'
import RadialChart from './Radial/RadialChart.vue'
import RadialGrid from './Radial/RadialGrid.vue'
import RadialSlice from './Radial/RadialSlice.vue'
import ThreeDChart from './ThreeD/ThreeDChart.vue'
import ThreeDScatter from './ThreeD/ThreeDScatter.vue'
import ThreeDSurface from './ThreeD/ThreeDSurface.vue'

/**
 * `Math.sin`、`Math.cos` 由引擎自行近似：构建文档的 Node 和读者的浏览器可能只差最后一位。
 * 客户端这一趟把两者放大一个 ulp，模拟换了引擎，hydration 仍然不能有差异。
 */
function useOtherEngineTrig(): void {
  const { cos, sin } = Math
  const ulp = 1 + Number.EPSILON
  vi.spyOn(Math, 'cos').mockImplementation(value => cos(value) * ulp)
  vi.spyOn(Math, 'sin').mockImplementation(value => sin(value) * ulp)
}

afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

async function hydrationProblems(render: () => ReturnType<typeof h>): Promise<unknown[]> {
  const Host: Component = { render }
  document.body.innerHTML = `<div id="app">${await renderToString(createSSRApp(Host))}</div>`

  useOtherEngineTrig()
  const problems: unknown[] = []
  const app = createSSRApp(Host)
  app.config.warnHandler = message => problems.push(message)
  app.config.errorHandler = error => problems.push(error)
  app.mount('#app')
  await nextTick()
  app.unmount()
  return problems
}

const wave = Array.from({ length: 6 }, (_, x) => Array.from({ length: 6 }, (_, z) => ({
  x,
  y: 5 + Math.sin(x * 0.7) * Math.cos(z * 0.6) * 2.5,
  z,
}))).flat()

describe('chart hydration across JS engines', () => {
  it('writes the same 3D coordinates on the server and in the browser', async () => {
    const problems = await hydrationProblems(() => h(ThreeDChart, {
      data: wave,
      xKey: 'x',
      yKey: 'y',
      zKey: 'z',
      width: 600,
      height: 400,
    }, {
      default: () => [h(ThreeDSurface, { colorRange: ['#112233', '#445566', '#778899'] }), h(ThreeDScatter, { color: '#336699' })],
    }))

    expect(problems).toEqual([])
  })

  it('writes the same radial coordinates on the server and in the browser', async () => {
    const problems = await hydrationProblems(() => h('div', [
      h(RadialChart, {
        data: [{ model: 'A', speed: 10, handling: 5, range: 7 }],
        axes: ['speed', 'handling', 'range'],
        width: 600,
        height: 400,
      }, {
        default: () => [h(RadialGrid), h(RadialArea, { dataKey: 'A', color: '#111111' }), h(RadialAxis)],
      }),
      h(RadialChart, {
        data: [{ region: 'NA', revenue: 60 }, { region: 'EU', revenue: 40 }],
        valueKey: 'revenue',
        labelKey: 'region',
        width: 600,
      }, {
        default: () => h(RadialSlice, { colors: ['#111111', '#222222'], labels: true }),
      }),
    ]))

    expect(problems).toEqual([])
  })
})
