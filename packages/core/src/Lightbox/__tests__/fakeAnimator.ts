/**
 * @file fakeAnimator.ts
 * @input 真实的 motion/animator 模块
 * @output fakeAnimatorModule：把 createMotionEngine 换成记录调用的假动画器；animators：每个假动画器挂在哪个元素上、被要求了什么
 * @position Lightbox 手势测试的共用工具。happy-dom 不跑动画，测试看灯箱交给动画器的终点、弹簧和松手选项。
 *
 * 假动画器记住 set 写下的值，get 读得回来；animate 和 play 立刻落到终点并报告「走完了」。
 */

import type * as AnimatorModule from '../../motion/animator'

export interface AnimatorCall {
  readonly name: string
  readonly args: unknown[]
}

export interface FakeAnimator {
  element: Element | null
  readonly pseudoElement: string | undefined
  readonly calls: AnimatorCall[]
  readonly values: Map<string, number>
}

export const animators: FakeAnimator[] = []

interface CurveLike {
  readonly duration: number
  readonly at: (t: number) => number
}

function endOf(name: string, args: unknown[]): Record<string, number> {
  if (name === 'animate')
    return args[0] as Record<string, number>
  if (name === 'play') {
    const curves = args[0] as Record<string, CurveLike>
    return Object.fromEntries(Object.entries(curves).map(([key, curve]) => [key, curve.at(curve.duration)]))
  }
  return {}
}

export function fakeAnimatorModule(actual: typeof AnimatorModule): typeof AnimatorModule {
  const createMotionEngine = (element: Element | null, options: { pseudoElement?: string } = {}): unknown => {
    const fake: FakeAnimator = { element, pseudoElement: options.pseudoElement, calls: [], values: new Map() }
    animators.push(fake)
    const record = (name: string) => (...args: unknown[]) => {
      fake.calls.push({ name, args })
      if (name === 'set' || name === 'animate' || name === 'play') {
        const values = name === 'set' ? args[0] as Record<string, number> : endOf(name, args)
        for (const [key, value] of Object.entries(values)) {
          if (typeof value === 'number')
            fake.values.set(key, value)
        }
      }
      return { finished: Promise.resolve(true), started: Promise.resolve(0) }
    }
    return {
      get element() {
        return fake.element
      },
      get: (key: string) => fake.values.get(key) ?? (key === 'scale' || key === 'opacity' ? 1 : 0),
      getVelocity: () => 0,
      set: record('set'),
      animate: record('animate'),
      play: record('play'),
      rebase: record('rebase'),
      decay: record('decay'),
      stop: record('stop'),
      attach: (next: Element | null) => {
        fake.element = next
      },
      atRest: async () => new Promise<void>(() => {}),
      reducedMotion: () => 'off',
      dispose: () => {},
    }
  }
  // animatorFor 按元素共用一个动画器，这里也照样共用，测试才找得到它。
  const shared = new Map<string, unknown>()
  const ids = new WeakMap<Element, number>()
  let nextId = 0
  const animatorFor = (element: HTMLElement, options: { pseudoElement?: string } = {}): unknown => {
    if (!ids.has(element))
      ids.set(element, nextId++)
    const key = `${ids.get(element)}${options.pseudoElement ?? ''}`
    if (!shared.has(key))
      shared.set(key, createMotionEngine(element, options))
    return shared.get(key)
  }
  return { ...actual, createMotionEngine, animatorFor } as unknown as typeof AnimatorModule
}

/** 挂在 `element`（和伪元素）上的动画器收到的调用。 */
export function callsOf(element: Element | null | undefined, pseudoElement?: string): AnimatorCall[] {
  return animators.find(animator => animator.element === element && animator.pseudoElement === pseudoElement)?.calls ?? []
}
