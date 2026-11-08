import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Chart from '../Chart/Chart.vue'
import { line } from '../marks/index.js'
import ChartSelect from './ChartSelect.vue'

const data = [
  { x: 0, y: 10 },
  { x: 1, y: 20 },
  { x: 2, y: 30 },
]

function mountSelect(selected: number[] = [], chartData: Record<string, unknown>[] = data) {
  return mount(Chart, {
    props: {
      data: chartData,
      xKey: 'x',
      series: [line('y', { dots: true })],
      width: 500,
      height: 300,
    },
    slots: { interactions: () => h(ChartSelect, { selected }) },
  })
}

function selectWrapper(wrapper: VueWrapper) {
  return wrapper.getComponent(ChartSelect)
}

type SelectWrapper = ReturnType<typeof selectWrapper>

function stubLocalCoordinates(select: SelectWrapper): void {
  const surface = select.get('rect[fill="transparent"]')
  const svg = (surface.element as SVGRectElement).ownerSVGElement!
  Object.defineProperty(svg, 'createSVGPoint', {
    configurable: true,
    value: () => ({
      x: 0,
      y: 0,
      matrixTransform() {
        return { x: this.x, y: this.y }
      },
    }),
  })
  Object.defineProperty(surface.element, 'getScreenCTM', {
    configurable: true,
    value: () => ({ inverse: () => ({}) }),
  })
}

async function clickRing(select: SelectWrapper, index: number, modifiers: Record<string, boolean> = {}): Promise<void> {
  const ring = select.findAll('circle')[index]
  const point = { clientX: Number(ring.attributes('cx')), clientY: Number(ring.attributes('cy')) }
  await select.get('rect[fill="transparent"]').trigger('pointerup', { ...point, ...modifiers })
}

describe('chartSelect', () => {
  it('renders the full plot capture surface and no rings by default', () => {
    const wrapper = mountSelect()
    const select = selectWrapper(wrapper)
    const surface = select.get('rect[fill="transparent"]')
    expect(surface.attributes('width')).toBe('428')
    expect(surface.attributes('height')).toBe('244')
    expect(select.findAll('circle')).toHaveLength(0)
    wrapper.unmount()
  })

  it('renders controlled selection rings and ignores out-of-range indices', () => {
    const wrapper = mountSelect([0, 2])
    const select = selectWrapper(wrapper)
    expect(select.findAll('circle')).toHaveLength(2)
    for (const ring of select.findAll('circle')) {
      expect(ring.attributes('fill')).toBe('none')
      expect(ring.attributes('r')).toBe('6')
      expect(ring.attributes('stroke')).toBe('var(--astryx-color-accent)')
    }
    wrapper.unmount()

    const invalid = mountSelect([-1, 5])
    expect(selectWrapper(invalid).findAll('circle')).toHaveLength(0)
    invalid.unmount()
  })

  it('uses resolved positions for categorical x values', () => {
    const rows = [{ x: 'Jan', y: 10 }, { x: 'Feb', y: 20 }]
    const wrapper = mountSelect([1], rows)
    const ring = selectWrapper(wrapper).get('circle')
    expect(Number.isFinite(Number(ring.attributes('cx')))).toBe(true)
    expect(Number.isFinite(Number(ring.attributes('cy')))).toBe(true)
    wrapper.unmount()
  })

  it('selects the nearest point and replaces the selection without modifiers', async () => {
    const wrapper = mountSelect([0, 1, 2])
    const select = selectWrapper(wrapper)
    stubLocalCoordinates(select)
    await clickRing(select, 1)
    expect(select.emitted('select')).toEqual([[data[1], 1]])
    expect(select.emitted('selectionChange')).toEqual([[[1]]])
    wrapper.unmount()
  })

  it('toggles a point with Shift or Meta and preserves other selected rows', async () => {
    const wrapper = mountSelect([0, 1, 2])
    const select = selectWrapper(wrapper)
    stubLocalCoordinates(select)
    const ring = select.findAll('circle')[1]
    const point = { clientX: Number(ring.attributes('cx')), clientY: Number(ring.attributes('cy')) }
    await select.get('rect[fill="transparent"]').trigger('pointerup', { ...point, metaKey: true })
    expect(select.emitted('selectionChange')).toEqual([[[0, 2]]])
    wrapper.unmount()

    const adding = mountSelect([0, 2])
    const addingSelect = selectWrapper(adding)
    stubLocalCoordinates(addingSelect)
    await addingSelect.get('rect[fill="transparent"]').trigger('pointerup', { ...point, shiftKey: true })
    expect(addingSelect.emitted('selectionChange')).toEqual([[[0, 2, 1]]])
    adding.unmount()
  })

  it('does not emit when the pointer is more than 30 pixels from every point', async () => {
    const wrapper = mountSelect([0, 1, 2])
    const select = selectWrapper(wrapper)
    stubLocalCoordinates(select)
    await select.get('rect[fill="transparent"]').trigger('pointerup', { clientX: -100, clientY: -100 })
    expect(select.emitted('select')).toBeUndefined()
    expect(select.emitted('selectionChange')).toBeUndefined()
    wrapper.unmount()
  })
})
