/**
 * @file useDragToSnapPoints.test.ts
 * @input vitest (happy-dom, fake clock), Vue Test Utils, the composable
 * @output `settleTo` from a key settles and calls the latest `onSettle`. An
 *   unmount stops reporting, and an empty list stays empty. The drag follows
 *   an element mounted later and one that replaces it. A reactive option
 *   change creates the drag again and leaves the element where it is. The
 *   composable holds no behavior of its own.
 * @position Testing; validates useDragToSnapPoints.ts
 */

import type { DragToSnapPointsOptions } from '../dragToSnapPoints/createDragToSnapPoints'
import fs from 'node:fs'
import path from 'node:path'
import { mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, reactive, ref } from 'vue'
import { coarsePrimaryPointer } from '../gestures/__tests__/pointerQuery'
import { exposeTouchEvents } from '../gestures/__tests__/touchEvents'
import { useDragToSnapPoints } from './useDragToSnapPoints'

/** The keyframes of every animation the element played, in order. */
const played: (Keyframe[] | PropertyIndexedKeyframes | null)[] = []

let restoreTouchEvents: () => void = () => {}
beforeAll(() => {
  restoreTouchEvents = exposeTouchEvents()
})

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['setTimeout', 'clearTimeout', 'performance', 'requestAnimationFrame', 'cancelAnimationFrame'],
  })
  HTMLElement.prototype.animate = function (keyframes: Keyframe[] | PropertyIndexedKeyframes | null) {
    played.push(keyframes)
    let start: number | null = null
    const animation = {
      get startTime() {
        return start
      },
      set startTime(value: number | null) {
        start = value
      },
      playState: 'running',
      ready: new Promise(() => {}),
      finish() {},
      cancel() {},
    }
    requestAnimationFrame(() => {
      start ??= performance.now()
    })
    return animation as unknown as Animation
  }
})

afterEach(() => {
  Reflect.deleteProperty(HTMLElement.prototype, 'animate')
  vi.useRealTimers()
  document.body.innerHTML = ''
})

afterAll(() => {
  restoreTouchEvents()
})

const POINTS = [0, 240, 480]

function touch(type: string, target: EventTarget, contact: { x: number, y: number }, time: number, isLift = false): void {
  const event = new Event(type, { bubbles: true, cancelable: true })
  const entry = { identifier: 1, clientX: contact.x, clientY: contact.y, target }
  Object.defineProperty(event, 'changedTouches', { value: [entry] })
  Object.defineProperty(event, 'touches', { value: isLift ? [] : [entry] })
  Object.defineProperty(event, 'timeStamp', { value: time })
  target.dispatchEvent(event)
}

// The document's host outlives a test, so event times only move forward.
let clock = 2_000_000

/** A drawer whose drag reads `options`; returns its `settleTo`. */
function drawer(options: DragToSnapPointsOptions): { settleTo: (index: number) => void, element: () => HTMLElement, unmount: () => void } {
  let settleTo: (index: number) => void = () => {}
  const Drawer = defineComponent({
    setup() {
      const target = ref<HTMLElement | null>(null)
      settleTo = useDragToSnapPoints(target, options).settleTo
      return () => h('div', { 'ref': target, 'data-testid': 'sheet' })
    },
  })
  const wrapper = mount(Drawer, { attachTo: document.body })
  return {
    settleTo: index => settleTo(index),
    element: () => wrapper.element as HTMLElement,
    unmount: () => wrapper.unmount(),
  }
}

async function settleFor(ms: number): Promise<void> {
  await vi.advanceTimersByTimeAsync(ms)
}

describe('useDragToSnapPoints', () => {
  it('settleTo settles from a key and calls the latest onSettle', async () => {
    const first = vi.fn()
    const latest = vi.fn()
    const options = reactive<DragToSnapPointsOptions>({ axis: 'y', snapPoints: POINTS, onSettle: first })
    const { settleTo } = drawer(options)
    options.onSettle = latest
    settleTo(2)
    await settleFor(3000)
    expect(first).not.toHaveBeenCalled()
    expect(latest).toHaveBeenCalledWith(2)
  })

  it('after an unmount nothing reports', async () => {
    const onSettle = vi.fn()
    const { settleTo, unmount } = drawer({ axis: 'y', snapPoints: POINTS, onSettle })
    settleTo(1)
    unmount()
    await settleFor(3000)
    expect(onSettle).not.toHaveBeenCalled()
    expect(() => settleTo(2)).not.toThrow()
  })

  it('an empty list stays empty: settleTo does nothing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const onSettle = vi.fn()
    const { settleTo } = drawer({ axis: 'y', snapPoints: [], onSettle })
    settleTo(0)
    await settleFor(3000)
    expect(onSettle).not.toHaveBeenCalled()
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('drives an element mounted after the composable first ran, and follows the one that replaces it', async () => {
    const onSettle = vi.fn()
    const shown = ref(false)
    const version = ref(0)
    let settleTo: (index: number) => void = () => {}
    const Late = defineComponent({
      setup() {
        const target = ref<HTMLElement | null>(null)
        settleTo = useDragToSnapPoints(target, { axis: 'y', snapPoints: POINTS, onSettle }).settleTo
        return () => (shown.value ? h('div', { 'key': version.value, 'ref': target, 'data-testid': 'late' }) : null)
      },
    })
    mount(Late, { attachTo: document.body })
    shown.value = true
    await nextTick()
    settleTo(1)
    await settleFor(3000)
    expect(onSettle).toHaveBeenLastCalledWith(1)
    // A new node behind the ref: the drag moves to it.
    version.value = 1
    await nextTick()
    const replaced = document.querySelector('[data-testid="late"]') as HTMLElement
    settleTo(2)
    await settleFor(3000)
    expect(onSettle).toHaveBeenLastCalledWith(2)
    expect(replaced.style.translate).toContain('480px')
  })

  it('an option changed mid-use leaves the element where it is, and the next settle starts there', async () => {
    const onSettle = vi.fn()
    const options = reactive<DragToSnapPointsOptions>({ axis: 'y', snapPoints: POINTS, flickThreshold: 1008, onSettle })
    const { settleTo, element } = drawer(options)
    settleTo(1)
    await settleFor(3000)
    const settled = element().style.translate
    expect(settled).toContain('240px')
    options.flickThreshold = 600
    expect(element().style.translate).toBe(settled)
    // The next settle moves on from 240, not from the resting position.
    played.length = 0
    settleTo(2)
    expect(JSON.stringify(played[0])).toContain('240px')
    await settleFor(3000)
    expect(onSettle).toHaveBeenLastCalledWith(2)
  })

  it('an option changed during a settle stops it where it is, and the next settle starts there', async () => {
    const onSettle = vi.fn()
    const options = reactive<DragToSnapPointsOptions>({ axis: 'y', snapPoints: POINTS, flickThreshold: 1008, onSettle })
    const { settleTo } = drawer(options)
    settleTo(2)
    await settleFor(150)
    played.length = 0
    options.flickThreshold = 600
    // The drag is created again with the new option and nothing more: the
    // settle stops where the element is, and nothing reports.
    await settleFor(3000)
    expect(played).toHaveLength(0)
    expect(onSettle).not.toHaveBeenCalled()
    // The next settle starts from there: never from 0, never a jump.
    settleTo(2)
    const frames = played[0] as Keyframe[]
    const yOf = (frame: Keyframe | undefined): number =>
      Number.parseFloat(String(frame?.translate ?? '').split(' ')[1] ?? '')
    expect(yOf(frames[0])).toBeGreaterThan(0)
    expect(yOf(frames[0])).toBeLessThan(480)
    expect(yOf(frames.at(-1))).toBeCloseTo(480, 0)
    await settleFor(3000)
    expect(onSettle).toHaveBeenLastCalledWith(2)
  })

  it('new snap points leave a resting element where it is, and the next settle starts there', async () => {
    const onSettle = vi.fn()
    const options = reactive<DragToSnapPointsOptions>({ axis: 'y', snapPoints: POINTS, onSettle })
    const { settleTo } = drawer(options)
    settleTo(1)
    await settleFor(3000)
    // 240 is still a snap point, now the third: nothing moves.
    played.length = 0
    options.snapPoints = [0, 120, 240, 480]
    expect(played).toHaveLength(0)
    // 240 is gone: still nothing moves, and nothing reports.
    onSettle.mockClear()
    options.snapPoints = [0, 300, 600]
    await settleFor(3000)
    expect(played).toHaveLength(0)
    expect(onSettle).not.toHaveBeenCalled()
    // The next settle, to 300, starts from 240.
    settleTo(1)
    expect(JSON.stringify(played[0])).toContain('240px')
    await settleFor(3000)
    expect(onSettle).toHaveBeenLastCalledWith(1)
  })

  it('a new array with the same snap points keeps the drag', async () => {
    const onSettle = vi.fn()
    const options = reactive<DragToSnapPointsOptions>({ axis: 'y', snapPoints: POINTS, onSettle })
    const { settleTo } = drawer(options)
    settleTo(2)
    await settleFor(150)
    options.snapPoints = [...POINTS]
    await settleFor(3000)
    // The settle in flight carried on and reported.
    expect(onSettle).toHaveBeenLastCalledWith(2)
  })

  it('an option changed during a release’s settle leaves it where it is: the composable only creates the drag again', async () => {
    // A flick from 260 toward 480, stopped about 330 by a new option. Creating
    // the drag again is all the composable does, so nothing aims it at 240 or
    // reports a point it never reached.
    const restore = coarsePrimaryPointer()
    try {
      const onSettle = vi.fn()
      const options = reactive<DragToSnapPointsOptions>({ axis: 'y', snapPoints: POINTS, flickThreshold: 1008, onSettle })
      const { settleTo, element } = drawer(options)
      settleTo(1)
      await settleFor(3000)
      onSettle.mockClear()
      // From 240: 20 px down slowly, to 260, then 30 px in 20 ms (1500 px/s),
      // a flick toward 480.
      clock += 10_000
      const start = clock
      touch('touchstart', element(), { x: 10, y: 10 }, start)
      touch('touchmove', element(), { x: 10, y: 20 }, start + 200)
      touch('touchmove', element(), { x: 10, y: 30 }, start + 400)
      touch('touchmove', element(), { x: 10, y: 45 }, start + 410)
      touch('touchmove', element(), { x: 10, y: 60 }, start + 420)
      touch('touchend', element(), { x: 10, y: 60 }, start + 424, true)
      await settleFor(40)
      played.length = 0
      options.flickThreshold = 600
      await settleFor(3000)
      expect(played).toHaveLength(0)
      expect(onSettle).not.toHaveBeenCalled()
    }
    finally {
      restore()
    }
  })

  it('delegates entirely to the factory: the composable module holds no behavior of its own', () => {
    const source = fs.readFileSync(path.join(__dirname, 'useDragToSnapPoints.ts'), 'utf8')
    const imports = [...source.matchAll(/from '([^']+)'/g)].map(m => m[1])
    expect([...new Set(imports)].sort()).toEqual([
      '../dragToSnapPoints/createDragToSnapPoints',
      '../gestures/useAttachment',
      'vue',
    ])
    expect(source).toContain('createDragToSnapPoints(element')
    expect(source).toContain('useAttachment(')
    expect(source).not.toMatch(/\bmotion\//)
  })
})
