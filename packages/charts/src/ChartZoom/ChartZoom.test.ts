import type { VueWrapper } from '@vue/test-utils'
import type { ChartZoomProps } from './types.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import Chart from '../Chart/Chart.vue'
import { line } from '../marks/index.js'
import ChartZoom from './ChartZoom.vue'
import { zoomAxis } from './zoomMath.js'

const data = [{ x: 0, y: 10 }, { x: 1, y: 20 }, { x: 2, y: 30 }]

function mountZoom(props: ChartZoomProps = {}, categorical = false) {
  return mount(Chart, {
    props: {
      data: categorical ? data.map((row, index) => ({ ...row, x: `P${index}` })) : data,
      xKey: 'x',
      series: [line('y')],
      width: 500,
      height: 300,
      xDomain: categorical ? undefined : [0, 2],
      yDomain: [0, 40],
    },
    slots: { interactions: () => h(ChartZoom, props) },
  })
}

function zoomWrapper(wrapper: VueWrapper) {
  return wrapper.getComponent(ChartZoom)
}

type ZoomWrapper = ReturnType<typeof zoomWrapper>

function stubLocalCoordinates(zoom: ZoomWrapper): void {
  const surface = zoom.get('rect[fill="transparent"]')
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

function lastDomain(zoom: ZoomWrapper, event: 'xDomainChange' | 'yDomainChange'): [number, number] {
  const events = zoom.emitted(event)
  return events?.[events.length - 1]?.[0] as [number, number]
}

describe('zoomAxis', () => {
  it('keeps the pivot fixed and supports off-center zooming', () => {
    expect(zoomAxis([0, 10], 0.5, 5)).toEqual([2.5, 7.5])
    expect(zoomAxis([0, 10], 0.5, 2)).toEqual([1, 6])
  })

  it('does not invert or collapse invalid and zero-length domains', () => {
    expect(zoomAxis([1, 1], 0.5, 1)).toEqual([1, 1])
    expect(zoomAxis([0, 10], 0, 5)).toEqual([0, 10])
  })
})

describe('chartZoom', () => {
  it('renders the full plot surface and a positioned toolbar', async () => {
    const wrapper = mountZoom()
    await nextTick()
    const zoom = zoomWrapper(wrapper)
    const surface = zoom.get('rect[fill="transparent"]')
    expect(surface.attributes('width')).toBe('428')
    expect(surface.attributes('height')).toBe('244')
    expect(wrapper.findAll('button')).toHaveLength(3)
    const toolbar = wrapper.get('.astryx-chart-zoom__toolbar')
    expect(toolbar.attributes('data-position')).toBe('top-right')
    expect(toolbar.element.namespaceURI).toBe('http://www.w3.org/1999/xhtml')
    wrapper.unmount()
  })

  it('can hide or reposition the toolbar', async () => {
    const hidden = mountZoom({ toolbar: false })
    await nextTick()
    expect(hidden.findAll('button')).toHaveLength(0)
    hidden.unmount()

    const positioned = mountZoom({ toolbar: 'bottom-left' })
    await nextTick()
    expect(positioned.get('.astryx-chart-zoom__toolbar').attributes('data-position')).toBe('bottom-left')
    positioned.unmount()
  })

  it('zooms both axes around the wheel pointer', async () => {
    const wrapper = mountZoom()
    const zoom = zoomWrapper(wrapper)
    stubLocalCoordinates(zoom)
    await zoom.get('rect').trigger('wheel', { deltaY: -50, clientX: 214, clientY: 122 })
    const x = lastDomain(zoom, 'xDomainChange')
    const y = lastDomain(zoom, 'yDomainChange')
    expect(x[0]).toBeCloseTo(0.1)
    expect(x[1]).toBeCloseTo(1.9)
    expect(y[0]).toBeCloseTo(2)
    expect(y[1]).toBeCloseTo(38)
    wrapper.unmount()
  })

  it('resets to the initial domains from the toolbar', async () => {
    const wrapper = mountZoom()
    await nextTick()
    const zoom = zoomWrapper(wrapper)
    stubLocalCoordinates(zoom)
    await zoom.get('rect').trigger('wheel', { deltaY: -50, clientX: 214, clientY: 122 })
    await wrapper.get('[aria-label="Reset zoom"]').trigger('click')
    expect(lastDomain(zoom, 'xDomainChange')).toEqual([0, 2])
    expect(lastDomain(zoom, 'yDomainChange')).toEqual([0, 40])
    wrapper.unmount()
  })

  it('pans using the domains captured at pointer down', async () => {
    const wrapper = mountZoom()
    const zoom = zoomWrapper(wrapper)
    const surface = zoom.get('rect')
    await surface.trigger('pointerdown', { pointerId: 1, clientX: 100, clientY: 100 })
    await surface.trigger('pointermove', { pointerId: 1, clientX: 150, clientY: 120 })
    const x = lastDomain(zoom, 'xDomainChange')
    const y = lastDomain(zoom, 'yDomainChange')
    expect(x[0]).toBeCloseTo(-(50 / 428) * 2)
    expect(x[1]).toBeCloseTo(2 - (50 / 428) * 2)
    expect(y[0]).toBeCloseTo((20 / 244) * 40)
    expect(y[1]).toBeCloseTo(40 + (20 / 244) * 40)
    await surface.trigger('pointerup', { pointerId: 1 })
    wrapper.unmount()
  })

  it('pinches both axes around their initial midpoint', async () => {
    const wrapper = mountZoom()
    const zoom = zoomWrapper(wrapper)
    const surface = zoom.get('rect')
    await surface.trigger('pointerdown', { pointerId: 1, clientX: 100, clientY: 100 })
    await surface.trigger('pointerdown', { pointerId: 2, clientX: 200, clientY: 100 })
    await surface.trigger('pointermove', { pointerId: 2, clientX: 300, clientY: 100 })
    expect(lastDomain(zoom, 'xDomainChange')).toEqual([0.5, 1.5])
    expect(lastDomain(zoom, 'yDomainChange')).toEqual([10, 30])
    await surface.trigger('pointerup', { pointerId: 1 })
    await surface.trigger('pointerup', { pointerId: 2 })
    wrapper.unmount()
  })

  it('honors xOnly and skips a categorical x axis', async () => {
    const xOnly = mountZoom({ xOnly: true })
    const xZoom = zoomWrapper(xOnly)
    stubLocalCoordinates(xZoom)
    await xZoom.get('rect').trigger('wheel', { deltaY: -50, clientX: 214, clientY: 122 })
    expect(xZoom.emitted('xDomainChange')).toHaveLength(1)
    expect(xZoom.emitted('yDomainChange')).toBeUndefined()
    xOnly.unmount()

    const categorical = mountZoom({}, true)
    const categoricalZoom = zoomWrapper(categorical)
    stubLocalCoordinates(categoricalZoom)
    await categoricalZoom.get('rect').trigger('wheel', { deltaY: -50, clientX: 214, clientY: 122 })
    expect(categoricalZoom.emitted('xDomainChange')).toBeUndefined()
    expect(categoricalZoom.emitted('yDomainChange')).toHaveLength(1)
    categorical.unmount()
  })
})
