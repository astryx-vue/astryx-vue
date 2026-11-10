import type { ThreeDChartProps } from './types.js'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { byRole, queryByRole } from '../../test-support/a11y.js'
import { stubResizeObserver } from '../../test-support/chart.js'
import { mountThreeD } from '../../test-support/three-d.js'
import { use3D } from './context.js'

const CameraProbe = defineComponent({
  setup() {
    const chart = use3D()
    return () => h('g', [
      h('text', { class: 'camera-azimuth' }, String(chart.camera.azimuth)),
      h('text', { class: 'camera-elevation' }, String(chart.camera.elevation)),
    ])
  },
})

function mountCamera(props: Partial<ThreeDChartProps> = {}): ReturnType<typeof mountThreeD> {
  return mountThreeD(props, () => h(CameraProbe))
}

function cameraValue(wrapper: ReturnType<typeof mountThreeD>, name: string): number {
  return Number(wrapper.element.querySelector(`.camera-${name}`)?.textContent)
}

let rafCallbacks: Map<number, FrameRequestCallback>
let nextRafId: number
let cancelSpy: ReturnType<typeof vi.fn>

beforeEach(() => {
  rafCallbacks = new Map()
  nextRafId = 0
  cancelSpy = vi.fn((id: number) => rafCallbacks.delete(id))
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    nextRafId++
    rafCallbacks.set(nextRafId, callback)
    return nextRafId
  })
  vi.stubGlobal('cancelAnimationFrame', cancelSpy)
})

afterEach(() => vi.unstubAllGlobals())

async function flushFrame(now: number): Promise<void> {
  const callbacks = [...rafCallbacks.values()]
  rafCallbacks.clear()
  for (const callback of callbacks)
    callback(now)
  await nextTick()
}

describe('threeDChart accessibility and sizing', () => {
  it('derives an accessible name and is not a tab stop when static', () => {
    const wrapper = mountCamera()
    const svg = byRole('img', '3D chart of y by x and z', wrapper.element)
    expect(svg.hasAttribute('tabindex')).toBe(false)
    wrapper.unmount()
  })

  it('uses a custom label and explicit SSR dimensions', () => {
    const wrapper = mountCamera({ label: 'Revenue space', width: 640, height: 250 })
    const svg = byRole('img', 'Revenue space', wrapper.element)
    expect(svg.getAttribute('width')).toBe('640')
    expect(svg.getAttribute('height')).toBe('250')
    wrapper.unmount()
  })

  it('renders after ResizeObserver reports width when no explicit width is given', async () => {
    const observer = stubResizeObserver()
    const wrapper = mountCamera({ width: 0 })
    expect(queryByRole('img', wrapper.element)).toBeNull()
    expect((wrapper.element as HTMLElement).style.height).toBe('400px')
    await observer.reportWidth(600)
    expect(byRole('img', undefined, wrapper.element).getAttribute('width')).toBe('600')
    wrapper.unmount()
  })
})

describe('threeDChart camera controls', () => {
  it('rotates with arrow keys, prevents scrolling and clamps elevation', async () => {
    const wrapper = mountCamera({ interactive: true, elevation: 85 })
    const svg = wrapper.find('svg')
    expect(svg.attributes('tabindex')).toBe('0')
    await svg.trigger('keydown', { key: 'ArrowRight' })
    expect(cameraValue(wrapper, 'azimuth')).toBe(45)
    await svg.trigger('keydown', { key: 'ArrowLeft' })
    expect(cameraValue(wrapper, 'azimuth')).toBe(35)
    await svg.trigger('keydown', { key: 'ArrowUp' })
    expect(cameraValue(wrapper, 'elevation')).toBe(89)

    const event = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true })
    svg.element.dispatchEvent(event)
    await nextTick()
    expect(event.defaultPrevented).toBe(true)
    expect(cameraValue(wrapper, 'elevation')).toBe(79)
    wrapper.unmount()
  })

  it('ignores camera keys when not interactive', async () => {
    const wrapper = mountCamera({ autoRotate: 1 })
    const svg = wrapper.find('svg')
    await svg.trigger('keydown', { key: 'ArrowRight' })
    expect(cameraValue(wrapper, 'azimuth')).toBe(35)
    wrapper.unmount()
  })

  it('drags the same camera with pointer capture and stops after pointerup', async () => {
    const wrapper = mountCamera({ interactive: true })
    const svg = wrapper.find('svg')
    Object.defineProperty(svg.element, 'setPointerCapture', { value: vi.fn(), configurable: true })
    Object.defineProperty(svg.element, 'releasePointerCapture', { value: vi.fn(), configurable: true })
    Object.defineProperty(svg.element, 'hasPointerCapture', { value: vi.fn(() => false), configurable: true })
    await svg.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 100, clientY: 100 })
    await svg.trigger('pointermove', { pointerId: 1, pointerType: 'mouse', clientX: 120, clientY: 110 })
    expect(cameraValue(wrapper, 'azimuth')).toBe(45)
    expect(cameraValue(wrapper, 'elevation')).toBe(20)
    await svg.trigger('pointerup', { pointerId: 1, pointerType: 'mouse' })
    await svg.trigger('pointermove', { pointerId: 1, pointerType: 'mouse', clientX: 200, clientY: 200 })
    expect(cameraValue(wrapper, 'azimuth')).toBe(45)
    wrapper.unmount()
  })
})

describe('threeDChart auto rotation', () => {
  it('rotates over time and is focusable so keyboard users can pause it', async () => {
    const wrapper = mountCamera({ autoRotate: 1 })
    const svg = wrapper.find('svg')
    expect(svg.attributes('tabindex')).toBe('0')
    expect(rafCallbacks.size).toBe(1)
    await flushFrame(100)
    expect(cameraValue(wrapper, 'azimuth')).toBeGreaterThan(35)
    wrapper.unmount()
    expect(cancelSpy).toHaveBeenCalled()
  })

  it('pauses on hover and focus, then resumes on leave and blur', async () => {
    const wrapper = mountCamera({ autoRotate: 1 })
    const svg = wrapper.find('svg')
    await svg.trigger('pointerenter')
    await nextTick()
    expect(rafCallbacks.size).toBe(0)
    await svg.trigger('pointerleave')
    await nextTick()
    expect(rafCallbacks.size).toBe(1)
    await svg.trigger('focus')
    await nextTick()
    expect(rafCallbacks.size).toBe(0)
    await svg.trigger('blur')
    await nextTick()
    expect(rafCallbacks.size).toBe(1)
    wrapper.unmount()
  })

  it('does not start rotation under prefers-reduced-motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      onchange: null,
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList)
    const wrapper = mountCamera({ autoRotate: 1 })
    expect(rafCallbacks.size).toBe(0)
    expect(cameraValue(wrapper, 'azimuth')).toBe(35)
    wrapper.unmount()
  })
})

describe('use3D', () => {
  it('throws when used outside ThreeDChart', () => {
    const Probe = defineComponent({
      setup() {
        use3D()
        return () => null
      },
    })
    expect(() => mount(Probe)).toThrow('3D components must be used inside <ThreeDChart>')
  })
})
