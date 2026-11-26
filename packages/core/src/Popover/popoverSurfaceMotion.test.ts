/**
 * @file popoverSurfaceMotion.test.ts
 * @input vitest (happy-dom)、一个记录动画的 `Element.animate` 替身、手写的动画帧
 * @output 浮层从触发器的哪一点长出、每一帧都在 UIKit 实测的路径上；长出用进场
 *   时序、第一帧就画出内容，缩回用退场时序、播在退场副本上，播完移除；关闭早于
 *   呈现帧时什么都不留；缩回途中再打开从当前帧折返；长出期间挡住输入。
 */
import type { PopoverSurfaceGeometry } from './popoverSurfaceFrame.js'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isInHeldLayer } from '../layer/inputHold.js'
import { ENTRANCE_OPACITY_FLOOR } from '../motion/opacityFloor.js'
import { popover } from '../motion/uikit/popover.js'
import { findPopoverExitCopy } from './popoverExitCopy.js'
import { popoverCollapsedState, popoverFrame } from './popoverSurfaceFrame.js'
import { createPopoverSurfaceMotion } from './popoverSurfaceMotion.js'

// UIKit 实测：一个 120 × 44 的按钮在 (141, 160)，下方弹出 320 × 253 的浮层，居中对齐。
const GEOMETRY: PopoverSurfaceGeometry = {
  surface: { left: 41, top: 204, width: 320, height: 253 },
  source: { left: 141, top: 160, width: 120, height: 44 },
}

interface Recorded {
  target: Element
  keyframes: Keyframe[]
  options: KeyframeAnimationOptions
  cancelled: boolean
}

const scaleOf = (frame: Keyframe): number[] => String(frame.scale).split(' ').map(Number)

/** 动画里缩放最后一次变化的时刻（ms）：曲线播完后动画器还会静止保持一段。 */
function motionEndMs(animation: Recorded): number {
  const duration = Number(animation.options.duration)
  let end = 0
  let previous = ''
  for (const frame of animation.keyframes) {
    if (String(frame.scale) !== previous)
      end = Number(frame.offset) * duration
    previous = String(frame.scale)
  }
  return end
}

describe('popoverCollapsedState', () => {
  it('grows a popover below its source out of the source’s bottom centre', () => {
    const state = popoverCollapsedState(GEOMETRY)
    expect([state.originX, state.originY, state.axis]).toEqual([160, 0, 'y'])
    expect(state.scale).toBe(popover.collapsedScale)
    expect(state.length).toBeCloseTo(popover.collapsedLengthPx / 253, 12)
  })

  it('turns toward a source above or beside the popover', () => {
    const above = popoverCollapsedState({
      surface: { left: 41, top: 100, width: 320, height: 200 },
      source: { left: 141, top: 310, width: 120, height: 44 },
    })
    expect([above.originX, above.originY, above.axis]).toEqual([160, 200, 'y'])
    const right = popoverCollapsedState({
      surface: { left: 200, top: 100, width: 180, height: 240 },
      source: { left: 20, top: 150, width: 160, height: 40 },
    })
    expect([right.originX, right.originY, right.axis]).toEqual([0, 70, 'x'])
    expect(right.length).toBeCloseTo(popover.collapsedLengthPx / 180, 12)
  })

  it('scales a popover over its source’s centre from that centre, at full length', () => {
    const state = popoverCollapsedState({
      surface: { left: 100, top: 100, width: 200, height: 200 },
      source: { left: 150, top: 150, width: 40, height: 40 },
    })
    expect([state.originX, state.originY, state.length]).toEqual([70, 70, 1])
  })

  it('matches the popover view’s measured frames', () => {
    const state = popoverCollapsedState(GEOMETRY)
    for (const [scale, width, height] of [
      [0.3195, 102.25, 47.24],
      [0.6664, 213.26, 134.25],
      [0.9632, 308.22, 238.2],
    ]) {
      const p = (scale - popover.collapsedScale) / (1 - popover.collapsedScale)
      const frame = popoverFrame(state, p)
      expect(320 * frame.scaleX).toBeCloseTo(width, 1)
      expect(253 * frame.scaleY).toBeCloseTo(height, 1)
    }
  })
})

describe('createPopoverSurfaceMotion', () => {
  let clock = 1000
  let recorded: Recorded[] = []
  const frames = new Map<number, () => void>()
  let lastFrame = 0
  const runFrame = (): void => {
    const due = [...frames.values()]
    frames.clear()
    for (const callback of due)
      callback()
  }

  beforeEach(() => {
    clock = 1000
    recorded = []
    frames.clear()
    HTMLElement.prototype.animate = function (this: HTMLElement, keyframes, options) {
      const animation = {
        target: this,
        keyframes: keyframes as Keyframe[],
        options: options as KeyframeAnimationOptions,
        cancelled: false,
        startTime: clock as number | null,
        finished: new Promise(() => {}),
        addEventListener() {},
        cancel() {
          this.cancelled = true
        },
      }
      recorded.push(animation)
      return animation as unknown as Animation
    }
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('pointer: coarse'),
      media: query,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
    }))
  })

  afterEach(() => {
    Reflect.deleteProperty(HTMLElement.prototype, 'animate')
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  function create(): { element: HTMLElement, motion: ReturnType<typeof createPopoverSurfaceMotion> } {
    const element = document.createElement('div')
    element.className = 'astryx-popover'
    element.innerHTML = '<div role="dialog" id="popover-dialog"><button id="apply">Apply</button></div>'
    element.getBoundingClientRect = () => DOMRect.fromRect({
      x: GEOMETRY.surface.left,
      y: GEOMETRY.surface.top,
      width: GEOMETRY.surface.width,
      height: GEOMETRY.surface.height,
    })
    document.body.append(element)
    const motion = createPopoverSurfaceMotion(element, {
      now: () => clock,
      requestFrame: (callback) => {
        lastFrame += 1
        frames.set(lastFrame, callback)
        return lastFrame
      },
      cancelFrame: handle => frames.delete(handle),
    })
    return { element, motion }
  }

  const live = (property: string, target?: Element): Recorded[] => recorded.filter(animation =>
    !animation.cancelled
    && (target == null || animation.target === target)
    && animation.keyframes.some(frame => property in frame))

  it('grows the popover out of its source on the entrance timing, without the CSS entrance, visible from the first frame', async () => {
    const { element, motion } = create()
    const measure = vi.fn(() => {
      // 读几何时 CSS 进场已经关掉。
      expect(element.style.getPropertyValue('animation-name')).toBe('none')
      return GEOMETRY
    })
    motion.enter(measure)
    expect(measure).not.toHaveBeenCalled()
    await Promise.resolve()
    expect(element.style.getPropertyValue('animation-name')).toBe('none')
    runFrame()
    expect(measure).toHaveBeenCalledTimes(1)

    const state = popoverCollapsedState(GEOMETRY)
    expect(element.style.getPropertyValue('transform-origin')).toBe(`${state.originX}px ${state.originY}px`)
    const [scaleAnimation] = live('scale', element)
    const first = scaleOf(scaleAnimation.keyframes[0])
    expect(first[0]).toBeCloseTo(state.scale, 4)
    expect(first[1]).toBeCloseTo(state.scale * state.length, 4)
    expect(scaleOf(scaleAnimation.keyframes.at(-1)!)).toEqual([1, 1])
    expect(motionEndMs(scaleAnimation)).toBeGreaterThan(225 * 0.8)
    expect(motionEndMs(scaleAnimation)).toBeLessThanOrEqual(226)
    for (const frame of scaleAnimation.keyframes) {
      const [sx, sy] = scaleOf(frame)
      // 每一帧都在实测路径上：沿轴的缩放是等比缩放乘以长度。
      const p = (sx - state.scale) / (1 - state.scale)
      expect(sy).toBeCloseTo(popoverFrame(state, p).scaleY, 3)
    }
    const [opacityAnimation] = live('opacity', element)
    expect(Number(opacityAnimation.keyframes[0].opacity)).toBe(ENTRANCE_OPACITY_FLOOR)
    expect(Number(opacityAnimation.keyframes.at(-1)!.opacity)).toBe(1)
  })

  it('takes every touch while it grows', () => {
    const { element, motion } = create()
    motion.enter(() => GEOMETRY)
    expect(isInHeldLayer(element.querySelector('#apply'))).toBe(false)
    runFrame()
    expect(isInHeldLayer(element.querySelector('#apply'))).toBe(true)
    motion.exit()
    expect(isInHeldLayer(element.querySelector('#apply'))).toBe(false)
  })

  it('shrinks back into the source on a copy, on the exit timing, and leaves the layer at rest', () => {
    const { element, motion } = create()
    motion.enter(() => GEOMETRY)
    runFrame()
    clock += 1000
    motion.exit()

    const copy = findPopoverExitCopy(document.body)!
    expect(copy).not.toBeNull()
    expect(copy.previousElementSibling).toBe(element)
    expect(copy.hasAttribute('inert')).toBe(true)
    expect(copy.querySelectorAll('[id]')).toHaveLength(0)
    const state = popoverCollapsedState(GEOMETRY)
    expect(copy.style.getPropertyValue('transform-origin')).toBe(`${state.originX}px ${state.originY}px`)
    const [scaleAnimation] = live('scale', copy)
    expect(scaleOf(scaleAnimation.keyframes[0])).toEqual([1, 1])
    const last = scaleOf(scaleAnimation.keyframes.at(-1)!)
    expect(last[0]).toBeCloseTo(state.scale, 4)
    expect(last[1]).toBeCloseTo(state.scale * state.length, 4)
    expect(motionEndMs(scaleAnimation)).toBeGreaterThan(125 * 0.8)
    expect(motionEndMs(scaleAnimation)).toBeLessThanOrEqual(126)
    const [opacityAnimation] = live('opacity', copy)
    expect(Number(opacityAnimation.keyframes.at(-1)!.opacity)).toBe(0)
    // 活浮层恢复组件样式：没有缩放、没有关掉的 CSS 进场。
    expect(live('scale', element)).toHaveLength(0)
    expect(element.style.getPropertyValue('animation-name')).toBe('')
    expect(element.style.getPropertyValue('transform-origin')).toBe('')
  })

  it('leaves nothing behind when it closes before the frame that would present it', async () => {
    const { element, motion } = create()
    const measure = vi.fn(() => GEOMETRY)
    motion.enter(measure)
    await Promise.resolve()
    motion.exit()
    runFrame()
    expect(measure).not.toHaveBeenCalled()
    expect(findPopoverExitCopy(document.body)).toBeNull()
    expect(element.style.getPropertyValue('animation-name')).toBe('')
  })

  it('turns back from the frame on screen when it opens again during the shrink', () => {
    const { element, motion } = create()
    motion.enter(() => GEOMETRY)
    runFrame()
    clock += 1000
    motion.exit()
    const copy = findPopoverExitCopy(document.body)!
    clock += 60
    const measure = vi.fn(() => GEOMETRY)
    motion.enter(measure)

    expect(measure).not.toHaveBeenCalled()
    expect(copy.isConnected).toBe(false)
    const [scaleAnimation] = live('scale', element)
    const [sx] = scaleOf(scaleAnimation.keyframes[0])
    // 从缩回画到的地方起，不是从收起的形状重新长。
    expect(sx).toBeLessThan(1)
    expect(sx).toBeGreaterThan(popover.collapsedScale + 0.05)
    expect(scaleOf(scaleAnimation.keyframes.at(-1)!)).toEqual([1, 1])
  })

  it('restores the element and removes the copy when disposed', () => {
    const { element, motion } = create()
    motion.enter(() => GEOMETRY)
    runFrame()
    clock += 1000
    motion.exit()
    motion.dispose()
    expect(findPopoverExitCopy(document.body)).toBeNull()
    expect(element.style.getPropertyValue('scale')).toBe('')
  })
})
