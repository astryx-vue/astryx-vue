import type { Component } from 'vue'
import type { LegendItem } from './types.js'
import { InternationalizationProvider } from '@astryx-vue/core'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { byRole } from '../../test-support/a11y.js'
import { ChartLegend } from './index.js'

const items: LegendItem[] = [
  { label: 'Revenue', color: '#ff0000', type: 'bar' },
  { label: 'Profit', color: '#00ff00', type: 'line' },
]

/** 挂图例，返回根节点。图例只有一个根元素，直接取 `wrapper.element`。 */
function mountLegend(props: Record<string, unknown> = {}, locale?: string) {
  const props_ = { items, ...props }
  if (locale === undefined) {
    const wrapper = mount(ChartLegend as Component, { props: props_ })
    return wrapper.element as HTMLElement
  }
  const wrapper = mount({
    render: () => h(InternationalizationProvider as Component, { locale }, {
      default: () => h(ChartLegend as Component, props_),
    }),
  })
  return (wrapper.element as HTMLElement).firstElementChild as HTMLElement
}

describe('chartLegend', () => {
  it('exposes list semantics with one item per legend entry', () => {
    const root = mountLegend()
    const list = byRole('list', 'Chart legend', root.parentElement ?? root)
    const rows = [...list.querySelectorAll('[role="listitem"]')]
    expect(rows).toHaveLength(2)
    expect(rows[0]!.textContent).toContain('Revenue')
    expect(rows[1]!.textContent).toContain('Profit')
  })

  it('localizes the list label', async () => {
    // core 的文案目录还没收录图表那几条键，这里验证包内的 zh-CN 兜底。
    const wrapper = mount({
      render: () => h(InternationalizationProvider as Component, { locale: 'zh-CN' }, {
        default: () => h(ChartLegend as Component, { items }),
      }),
    })
    await nextTick()
    expect(byRole('list', '图表图例', wrapper.element as HTMLElement)).not.toBeNull()
  })

  it('renders a decorative swatch in each entry with the item color', () => {
    const root = mountLegend()
    const rows = [...root.querySelectorAll('[role="listitem"]')]
    const firstSwatch = rows[0]!.querySelector('[aria-hidden="true"]')!
    const secondSwatch = rows[1]!.querySelector('[aria-hidden="true"]')!
    expect(firstSwatch).not.toBeNull()
    expect(firstSwatch.getAttribute('style')).toContain('#ff0000')
    expect(secondSwatch.getAttribute('style')).toContain('#00ff00')
  })

  it('renders nothing when there are no items', () => {
    const wrapper = mount(ChartLegend as Component, { props: { items: [] } })
    expect(wrapper.html()).toBe('<!--v-if-->')
  })

  it('renders nothing when items are omitted entirely', () => {
    const wrapper = mount(ChartLegend as Component)
    expect(wrapper.html()).toBe('<!--v-if-->')
  })

  it('keeps list semantics in the vertical (start/end) orientation', () => {
    const root = mountLegend({ position: 'end' })
    const list = byRole('list', 'Chart legend', root.parentElement ?? root)
    expect(list.querySelectorAll('[role="listitem"]')).toHaveLength(2)
  })
})
