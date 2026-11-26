import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CircularProgress from './CircularProgress.vue'

enableAutoUnmount(afterEach)

interface Call { keyframes: Keyframe[], options: KeyframeAnimationOptions, progress: number, cancelled: boolean }

let calls: Call[]
const originalAnimate = Element.prototype.animate
const originalStyle = window.getComputedStyle

/** jsdom 没有 Web Animations：缓动用线性替身，进度就是经过的比例。 */
function stubMotion(duration = '400ms', easing = 'linear'): void {
  calls = []
  class LinearEffect {
    time = 0
    getComputedTiming() {
      return { progress: this.time }
    }
  }
  class LinearProbe {
    constructor(private effect: LinearEffect) {}
    get currentTime(): number {
      return this.effect.time * 1000
    }

    set currentTime(ms: number) {
      this.effect.time = ms / 1000
    }
  }
  vi.stubGlobal('KeyframeEffect', LinearEffect)
  vi.stubGlobal('Animation', LinearProbe)
  Element.prototype.animate = function (keyframes: Keyframe[], options: KeyframeAnimationOptions) {
    const call: Call = { keyframes, options, progress: 0, cancelled: false }
    calls.push(call)
    return {
      cancel() {
        call.cancelled = true
      },
      playState: 'running',
      effect: { getComputedTiming: () => ({ progress: call.progress }) },
    } as unknown as Animation
  } as typeof Element.prototype.animate
  window.getComputedStyle = ((element: Element) => {
    const real = originalStyle(element)
    if (element.classList.contains('astryx-circular-progress__fill--layers'))
      return { ...real, transitionDuration: duration, transitionTimingFunction: easing } as CSSStyleDeclaration
    return real
  }) as typeof window.getComputedStyle
}

function angle(frame: Keyframe): number {
  return Number(/rotate\(([-\d.]+)deg\)/.exec(String(frame.transform))?.[1])
}

beforeEach(() => stubMotion())
afterEach(() => {
  Element.prototype.animate = originalAnimate
  window.getComputedStyle = originalStyle
  vi.unstubAllGlobals()
})

describe('circularProgress motion', () => {
  it('animates a value change from where the arc is drawn, each half on time', async () => {
    const wrapper = mount(CircularProgress, { props: { value: 20, label: 'Progress' } })
    expect(calls).toHaveLength(0)
    await wrapper.setProps({ value: 80 })
    expect(calls).toHaveLength(4)
    const [right, left, cap, start] = calls as [Call, Call, Call, Call]
    for (const call of calls) {
      expect(call.options.duration).toBe(400)
      expect(call.options.easing).toBe('linear')
    }
    // 从 20%（72°）到 80%（288°）；线性缓动，所以正好一半时越过 6 点。
    expect(angle(cap.keyframes[0]!)).toBeCloseTo(72, 5)
    expect(angle(cap.keyframes.at(-1)!)).toBeCloseTo(288, 5)
    const crossing = right.keyframes.findIndex(frame => angle(frame) === 180)
    expect(right.keyframes[crossing]!.offset).toBeCloseTo(0.5, 5)
    expect(left.keyframes.slice(0, crossing + 1).every(frame => angle(frame) === 180)).toBe(true)
    expect(angle(left.keyframes.at(-1)!)).toBeCloseTo(288, 5)
    // 越过 6 点之前隐藏，越过之后立刻显示。
    expect(left.keyframes[crossing]!.opacity).toBe(0)
    expect(left.keyframes[crossing + 1]!.opacity).toBe(1)
    expect(Number(left.keyframes[crossing + 1]!.offset) - Number(left.keyframes[crossing]!.offset)).toBeLessThanOrEqual(1e-4)
    expect(start.keyframes.every(frame => frame.opacity === 1)).toBe(true)
  })

  it('steps the left half at once when the arc shrinks through 6 o’clock', async () => {
    stubMotion('300ms')
    const wrapper = mount(CircularProgress, { props: { value: 80, label: 'Progress' } })
    await wrapper.setProps({ value: 20 })
    const left = calls[1]!.keyframes
    for (const frame of left) {
      if (angle(frame) > 180)
        expect(frame.opacity, `at ${frame.offset}`).toBe(1)
    }
    for (let i = 1; i < left.length; i += 1) {
      if (left[i]!.opacity !== left[i - 1]!.opacity)
        expect(Number(left[i]!.offset) - Number(left[i - 1]!.offset)).toBeLessThanOrEqual(1e-4)
    }
    expect(left.at(-1)!.opacity).toBe(0)
  })

  it('restarts an interrupted change from where its arc is drawn', async () => {
    const wrapper = mount(CircularProgress, { props: { value: 10, label: 'Progress' } })
    await wrapper.setProps({ value: 90 })
    const first = calls.slice()
    first[0]!.progress = 0.5
    await wrapper.setProps({ value: 40 })
    expect(first.every(call => call.cancelled)).toBe(true)
    const cap = calls[6]!
    // 10% → 90% 走到一半是 50%（180°），新的变化从那里转到 40%（144°）。
    expect(angle(cap.keyframes[0]!)).toBeCloseTo(180, 5)
    expect(angle(cap.keyframes.at(-1)!)).toBeCloseTo(144, 5)
  })

  it('releases a running change on unmount', async () => {
    const wrapper = mount(CircularProgress, { props: { value: 10, label: 'Progress' } })
    await wrapper.setProps({ value: 60 })
    wrapper.unmount()
    expect(calls.every(call => call.cancelled)).toBe(true)
  })

  it('draws the next value at once after indeterminate', async () => {
    const wrapper = mount(CircularProgress, { props: { value: 10, isIndeterminate: true, label: 'Progress' } })
    await wrapper.setProps({ isIndeterminate: false, value: 70 })
    expect(calls).toHaveLength(0)
    await wrapper.setProps({ value: 80 })
    expect(calls).toHaveLength(4)
  })

  it('skips the animation when the theme duration is zero', async () => {
    stubMotion('0s')
    const wrapper = mount(CircularProgress, { props: { value: 10, label: 'Progress' } })
    await wrapper.setProps({ value: 60 })
    expect(calls).toHaveLength(0)
  })

  it('pins the indeterminate rotation to the timeline origin', async () => {
    const animation = { startTime: 500 as number | null }
    const getAnimations = vi.fn(() => [animation])
    const original = Element.prototype.getAnimations
    Element.prototype.getAnimations = getAnimations as unknown as typeof Element.prototype.getAnimations
    const frames: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback))
    try {
      vi.resetModules()
      const { syncRotationPhase } = await import('./fillMotion.js')
      const rotor = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      syncRotationPhase(rotor)
      syncRotationPhase(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
      // 同一帧挂载的圆环一起处理。
      expect(frames).toHaveLength(1)
      frames[0]!(0)
      expect(animation.startTime).toBe(0)
    }
    finally {
      Element.prototype.getAnimations = original
    }
  })
})
