import type { HitInsets } from './hitArea.js'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SCROLL_QUIET_MS } from './hitAreaGate.js'
import { watchHitArea } from './hitAreaWatch.js'

/**
 * 粗指针下热区的测量不抢在手指前面读布局：按压不读、滚动里不测、
 * 祖先在播会挪盒子的动画时先不测，页面结构的变化只匹配新增的子树。
 * 没有真实布局，矩形由 `data-rect`（left,top,width,height）给出。
 */

let frames: FrameRequestCallback[] = []
let reads = 0
const stops: Array<() => void> = []

function rectOf(element: Element): DOMRect {
  const [left = 0, top = 0, width = 0, height = 0] = (element.getAttribute('data-rect') ?? '').split(',').map(Number)
  return { left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) }
}

async function runFrames(): Promise<void> {
  await Promise.resolve()
  while (frames.length > 0) {
    const due = frames
    frames = []
    due.forEach(frame => frame(0))
  }
  await Promise.resolve()
}

function button(rect: string, parent: Element = document.body): HTMLButtonElement {
  const element = document.createElement('button')
  element.setAttribute('data-rect', rect)
  parent.append(element)
  return element
}

function watch(element: HTMLElement): { last: () => HitInsets | null } {
  let last: HitInsets | null = null
  stops.push(watchHitArea(element, (insets) => {
    last = insets
  }))
  return { last: () => last }
}

/** happy-dom 没有 getAnimations：直接换成一份固定的动画列表。 */
function setAnimations(list: Animation[]): void {
  Object.defineProperty(document, 'getAnimations', { configurable: true, value: () => list })
}

function pointerdown(target: Element, x: number, y: number): void {
  const event = new Event('pointerdown', { bubbles: true, cancelable: true })
  Object.assign(event, { clientX: x, clientY: y, button: 0, pointerId: 1, pointerType: 'touch', isPrimary: true })
  target.dispatchEvent(event)
}

function click(target: Element): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })
  target.dispatchEvent(event)
  return event
}

function animation(target: Element, props: string[], settle: Promise<unknown>): Animation {
  return {
    playState: 'running',
    finished: settle,
    effect: {
      target,
      getComputedTiming: () => ({ endTime: 300 }),
      getKeyframes: () => props.map(prop => ({ [prop]: '0' })),
    },
  } as unknown as Animation
}

beforeEach(() => {
  frames = []
  reads = 0
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback))
  vi.stubGlobal('cancelAnimationFrame', () => undefined)
  vi.stubGlobal('IntersectionObserver', undefined)
  vi.stubGlobal('ResizeObserver', undefined)
  vi.stubGlobal('matchMedia', () => ({
    matches: true,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }))
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    reads += 1
    return rectOf(this)
  })
})

afterEach(() => {
  stops.splice(0).forEach(stop => stop())
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
  Reflect.deleteProperty(document, 'getAnimations')
  document.body.innerHTML = ''
})

describe('热区的测量不抢在手指前面读布局', () => {
  it('按下时不读任何矩形；点击来了才复查，而且只读不写', async () => {
    const save = button('0,0,80,28')
    const state = watch(save)
    await runFrames()
    expect(state.last()?.bottom).toBe(8)
    button('0,32,80,28')
    await runFrames()
    reads = 0
    pointerdown(save, 40, 31)
    expect(reads).toBe(0)
    const tap = click(save)
    expect(reads).toBeGreaterThan(0)
    // 触摸离邻居更近：这一下作废。
    expect(tap.defaultPrevented).toBe(true)
    // 复查不写热区，之后排的那次测量才写。
    expect(state.last()?.bottom).toBe(8)
    await runFrames()
    expect(state.last()?.bottom).toBe(2)
  })

  it('触摸变成滚动（pointercancel）就没有点击，也就什么都不读', async () => {
    const save = button('0,0,80,28')
    watch(save)
    await runFrames()
    reads = 0
    pointerdown(save, 40, 10)
    save.dispatchEvent(new Event('pointercancel'))
    click(save)
    expect(reads).toBe(0)
  })

  it('页面在滚动时不测量，到 scrollend 才测', async () => {
    const save = button('0,0,80,28')
    const state = watch(save)
    await runFrames()
    expect(state.last()?.bottom).toBe(8)
    document.dispatchEvent(new Event('scroll'))
    save.setAttribute('data-rect', '0,0,80,40')
    window.dispatchEvent(new Event('resize'))
    reads = 0
    await runFrames()
    expect(reads).toBe(0)
    expect(frames).toHaveLength(0)
    document.dispatchEvent(new Event('scrollend'))
    await runFrames()
    expect(reads).toBeGreaterThan(0)
    expect(state.last()?.bottom).toBe(2)
  })

  it('不支持 scrollend 的浏览器：150ms 没有滚动事件就放行', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    const save = button('0,0,80,28')
    const state = watch(save)
    await runFrames()
    document.dispatchEvent(new Event('scroll'))
    save.setAttribute('data-rect', '0,0,80,40')
    window.dispatchEvent(new Event('resize'))
    await runFrames()
    expect(state.last()?.bottom).toBe(8)
    vi.advanceTimersByTime(SCROLL_QUIET_MS - 1)
    document.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(SCROLL_QUIET_MS - 1)
    await runFrames()
    expect(state.last()?.bottom).toBe(8)
    vi.advanceTimersByTime(2)
    await runFrames()
    expect(state.last()?.bottom).toBe(2)
  })

  it('祖先在播会挪盒子的有限动画时先不测，播完再测', async () => {
    const layer = document.createElement('div')
    document.body.append(layer)
    const save = button('0,0,80,28', layer)
    let finish: () => void = () => undefined
    const settled = new Promise<void>((resolve) => {
      finish = resolve
    })
    const running = animation(layer, ['transform'], settled)
    setAnimations([running])
    const state = watch(save)
    reads = 0
    await runFrames()
    expect(reads).toBe(0)
    expect(state.last()).toBeNull()
    setAnimations([])
    finish()
    await settled
    await runFrames()
    expect(state.last()?.bottom).toBe(8)
  })

  it('淡入淡出不挪盒子，不用等', async () => {
    const layer = document.createElement('div')
    document.body.append(layer)
    const save = button('0,0,80,28', layer)
    setAnimations([animation(layer, ['opacity'], new Promise(() => undefined))])
    const state = watch(save)
    await runFrames()
    expect(state.last()?.bottom).toBe(8)
  })

  it('点击来之前祖先的动画挪了盒子：放行这次点击，由浏览器的命中测试决定', async () => {
    const layer = document.createElement('div')
    document.body.append(layer)
    const save = button('0,0,80,28', layer)
    watch(save)
    await runFrames()
    button('0,32,80,28', layer)
    pointerdown(save, 40, 31)
    setAnimations([animation(layer, ['transform'], new Promise(() => undefined))])
    expect(click(save).defaultPrevented).toBe(false)
  })

  it('页面结构变了，只匹配新增和离开的子树，不对整页重新查询', async () => {
    const callbacks: MutationCallback[] = []
    vi.stubGlobal('MutationObserver', class {
      constructor(callback: MutationCallback) {
        callbacks.push(callback)
      }

      observe(): void {}
      disconnect(): void {}
    })
    const save = button('0,0,80,28')
    const state = watch(save)
    await runFrames()
    expect(state.last()?.bottom).toBe(8)
    const spy = vi.spyOn(document, 'querySelectorAll')
    const added = button('0,32,80,28')
    callbacks[0]!([{ type: 'childList', target: document.body, addedNodes: [added], removedNodes: [] } as unknown as MutationRecord], {} as MutationObserver)
    window.dispatchEvent(new Event('resize'))
    await runFrames()
    // 新来的邻居已经算进来了。
    expect(state.last()?.bottom).toBe(2)
    added.remove()
    callbacks[0]!([{ type: 'childList', target: document.body, addedNodes: [], removedNodes: [added] } as unknown as MutationRecord], {} as MutationObserver)
    window.dispatchEvent(new Event('resize'))
    await runFrames()
    expect(state.last()?.bottom).toBe(8)
    expect(spy).not.toHaveBeenCalled()
  })
})
