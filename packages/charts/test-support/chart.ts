import type { Component } from 'vue'
import type { SeriesDef } from '../src/types.js'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { vi } from 'vitest'
import Chart from '../src/Chart/Chart.vue'

export interface MountChartOptions {
  series: SeriesDef[]
  data?: Record<string, unknown>[]
  xKey?: string
  /** 绘图区宽度。默认 600，减去左右内边距后是 528。 */
  width?: number
  height?: number
  [key: string]: unknown
}

export interface MountedChart {
  wrapper: ReturnType<typeof mount>
  /** 根元素 */
  container: HTMLElement
  /** 按绘图区裁切的那个组，各系列的画都在里面 */
  plot: SVGGElement
}

/**
 * 挂一张图，返回根元素和画布里的绘图组。
 *
 * 上游测试靠 `ResizeObserver` 上报宽度，这里默认直接给 `width` prop ——
 * 浏览器里量宽度的那条路在 `Chart.test.ts` 里单独测。
 */
export function mountChart(
  options: MountChartOptions,
  slots: Record<string, () => unknown> = {},
  attrs: Record<string, unknown> = {},
): MountedChart {
  const { width = 600, ...props } = options
  const wrapper = mount(Chart as Component, {
    props: { width, ...props },
    slots,
    attrs,
  })
  const container = wrapper.element as HTMLElement
  const plot = container.querySelector<SVGGElement>('g[clip-path]')
  if (!plot)
    throw new Error('图表没有渲染出绘图组')
  return { wrapper, container, plot }
}

export interface ResizeObserverStub {
  /** 模拟浏览器上报容器宽度 */
  reportWidth: (width: number) => Promise<void>
}

/**
 * 换掉全局 `ResizeObserver`，把回调捏在手里，由测试决定什么时候、上报多宽。
 * 必须在挂载之前调用。
 */
export function stubResizeObserver(): ResizeObserverStub {
  let callback: ResizeObserverCallback | undefined
  let observed: Element | undefined

  vi.stubGlobal('ResizeObserver', class {
    constructor(handler: ResizeObserverCallback) {
      callback = handler
    }

    observe(element: Element): void {
      observed = element
    }

    unobserve(): void {}

    disconnect(): void {}
  })

  return {
    async reportWidth(width: number): Promise<void> {
      if (!observed)
        throw new Error('图表没有订阅 ResizeObserver')
      callback?.(
        [{ target: observed, contentRect: { width } } as unknown as ResizeObserverEntry],
        {} as ResizeObserver,
      )
      await nextTick()
    },
  }
}
