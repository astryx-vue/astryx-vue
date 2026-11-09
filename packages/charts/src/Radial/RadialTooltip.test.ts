import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { mountRadial, pieData, spiderData } from '../../test-support/radial.js'
import RadialSlice from './RadialSlice.vue'
import RadialTooltip from './RadialTooltip.vue'

afterEach(() => {
  document.body.querySelectorAll('.astryx-radial-tooltip').forEach(element => element.remove())
})

function mountTooltip(props: Record<string, unknown> = {}, chartProps: Record<string, unknown> = {}, spider = false) {
  return mountRadial(
    spider
      ? { data: spiderData, axes: ['speed', 'handling', 'comfort'], ...chartProps }
      : { data: pieData, valueKey: 'revenue', labelKey: 'region', ...chartProps },
    () => [
      h(RadialSlice, { colors: ['#111111', '#222222', '#333333'] }),
      h(RadialTooltip, props),
    ],
  )
}

function stubCoordinates(wrapper: ReturnType<typeof mountTooltip>): Element {
  const capture = wrapper.get('circle[fill="transparent"]').element as SVGCircleElement
  const svg = capture.ownerSVGElement!
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
  Object.defineProperty(capture, 'getScreenCTM', {
    configurable: true,
    value: () => ({ inverse: () => ({}) }),
  })
  return capture
}

async function hover(wrapper: ReturnType<typeof mountTooltip>, x: number, y: number): Promise<void> {
  await wrapper.get('circle[fill="transparent"]').trigger('pointermove', {
    clientX: x,
    clientY: y,
    pointerType: 'mouse',
  })
  await nextTick()
  await nextTick()
}

describe('radialTooltip', () => {
  it('mounts the capture surface with scroll-friendly touch defaults', () => {
    const wrapper = mountTooltip()
    const capture = wrapper.get('circle[fill="transparent"]')
    expect(capture.attributes('r')).toBe('170')
    expect((capture.element as SVGCircleElement).style.touchAction).toBe('pan-y')
    wrapper.unmount()

    const interactive = mountTooltip({}, { interactive: true })
    expect((interactive.get('circle[fill="transparent"]').element as SVGCircleElement).style.touchAction).toBe('none')
    expect((interactive.get('svg').element as SVGSVGElement).style.touchAction).toBe('none')
    interactive.unmount()
  })

  it('hit-tests a pie slice, shows its data and highlights the actual sector', async () => {
    const wrapper = mountTooltip()
    stubCoordinates(wrapper)
    await hover(wrapper, 400, 200)
    const tooltip = document.body.querySelector('.astryx-radial-tooltip')
    expect(tooltip?.textContent).toContain('NA')
    expect(tooltip?.textContent).toContain('500')
    expect(tooltip?.textContent).toContain('50%')
    expect(wrapper.get('.astryx-radial-slice__highlight').attributes('transform')).not.toBe('translate(300 200)')

    await wrapper.get('circle[fill="transparent"]').trigger('pointerleave', { pointerType: 'mouse' })
    expect(document.body.querySelector('.astryx-radial-tooltip')).toBeNull()
    expect(wrapper.find('.astryx-radial-slice__highlight').exists()).toBe(false)
    wrapper.unmount()
  })

  it('rejects the donut hole and pad-angle gaps', async () => {
    const donut = mountTooltip({}, { innerRadius: 0.6 })
    stubCoordinates(donut)
    await hover(donut, 300, 200)
    expect(document.body.querySelector('.astryx-radial-tooltip')).toBeNull()
    donut.unmount()

    const gap = mountTooltip()
    stubCoordinates(gap)
    await hover(gap, 302, 300)
    expect(document.body.querySelector('.astryx-radial-tooltip')).toBeNull()
    gap.unmount()
  })

  it('hit-tests the nearest spider axis and returns the highest series value', async () => {
    const wrapper = mountTooltip({}, {}, true)
    stubCoordinates(wrapper)
    await hover(wrapper, 300, 100)
    const tooltip = document.body.querySelector('.astryx-radial-tooltip')
    expect(tooltip?.textContent).toContain('speed')
    expect(tooltip?.textContent).toContain('10')
    expect(tooltip?.textContent).not.toContain('Share')
    wrapper.unmount()
  })

  it('supports touch scrubbing and dismisses on pointer up', async () => {
    const wrapper = mountTooltip({}, { interactive: true })
    const capture = stubCoordinates(wrapper)
    const pointerCapture = vi.fn()
    Object.defineProperty(capture, 'setPointerCapture', { configurable: true, value: pointerCapture })
    await wrapper.get('circle[fill="transparent"]').trigger('pointerdown', {
      clientX: 400,
      clientY: 200,
      pointerType: 'touch',
    })
    await nextTick()
    expect(document.body.querySelector('.astryx-radial-tooltip')?.textContent).toContain('NA')
    expect(pointerCapture).toHaveBeenCalledOnce()
    await wrapper.get('circle[fill="transparent"]').trigger('pointerup', { pointerId: 1, pointerType: 'touch' })
    await nextTick()
    expect(document.body.querySelector('.astryx-radial-tooltip')).toBeNull()
    wrapper.unmount()
  })

  it('supports custom Vue slot content', async () => {
    const wrapper = mountRadial(
      { data: pieData, valueKey: 'revenue', labelKey: 'region' },
      () => h(RadialTooltip, null, {
        default: (datum: { label: string, value: number }) => h('span', { class: 'custom-radial-tooltip' }, `${datum.label}: ${datum.value}`),
      }),
    )
    stubCoordinates(wrapper)
    await hover(wrapper, 400, 200)
    expect(document.body.querySelector('.custom-radial-tooltip')?.textContent).toBe('NA: 500')
    expect(document.body.querySelector('.astryx-radial-tooltip__content')).toBeNull()
    wrapper.unmount()
  })
})
