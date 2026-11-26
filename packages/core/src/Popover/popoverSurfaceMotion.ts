/**
 * Popover 在手指下的呈现和关闭（上游 Popover/popoverSurfaceMotion.ts）：像 UIKit
 * 的 popover 一样从触发器长出来、缩回去。
 *
 * 浮层绕它和触发器相接的点缩放。横跨触发器那条边的缩放是 s = s₀ + (1 − s₀)·p；
 * 背离触发器的那个轴上是 s·f，f = f₀ + (1 − f₀)·p 是占满长度的比例。两者跟着
 * 同一条缓动进度 p，作为曲线交给合成器播放。长出途中关闭、缩回途中又打开，都从
 * 屏幕上的那一帧折返。
 *
 * - 新的一次呈现到下一个动画帧才读写：打开的那个任务里写样式再读盒子会让页面多
 *   排一次版。浮层自己的 CSS 进场在打开它的脚本返回后（一个微任务）关掉。
 * - 长出从透明度下限起淡入，第一帧就画出内容。
 * - 浮层一关就藏起来，缩回播在浮层的退场副本上，播完移除。
 * - 长出期间浮层的输入暂挡接住所有触摸：点外面不关闭，也碰不到下面的东西。
 * - 减少动效时按动画器的规则：触屏上满尺寸淡入，原地淡出。
 */
import type { Animator, AnimatorOptions, MotionCurve, MotionHandle } from '../motion/animator.js'
import type { PopoverCollapsedState, PopoverSurfaceGeometry, SurfaceState } from './popoverSurfaceFrame.js'
import { holdInput } from '../layer/inputHold.js'
import { createMotionEngine } from '../motion/animator.js'
import { ENTRANCE_OPACITY_FLOOR } from '../motion/opacityFloor.js'
import { mapProgress, mapRange } from '../motion/progress.js'
import { readThemeTimingOrInstant } from '../motion/themeTiming.js'
import { placePopoverExitCopy } from './popoverExitCopy.js'
import {
  frameOf,
  POPOVER_ENTRANCE_TOKENS,
  POPOVER_EXIT_TOKENS,
  popoverCollapsedState,
  PRESENTED,
} from './popoverSurfaceFrame.js'

type SurfaceCurves = Record<'scaleX' | 'scaleY' | 'opacity', MotionCurve>

/** 进度从 0 到 1 时从 `from` 到 `to` 的曲线；沿轴的缩放是缩放和长度的乘积。 */
function surfaceCurves(
  from: SurfaceState,
  to: SurfaceState,
  axis: 'x' | 'y',
  progress: MotionCurve,
  opacityFloor = 0,
): SurfaceCurves {
  // 不夹住：会过冲的缓动带着各通道一起过冲。
  const lerp = (a: number, b: number): ((p: number) => number) => mapRange([0, 1], [a, b], { clamp: false })
  const scale = lerp(from.scale, to.scale)
  const length = lerp(from.length, to.length)
  const opacity = lerp(from.opacity, to.opacity)
  const across = mapProgress(progress, scale)
  const along = mapProgress(progress, p => scale(p) * length(p))
  return {
    scaleX: axis === 'x' ? along : across,
    scaleY: axis === 'y' ? along : across,
    opacity: mapProgress(progress, p => Math.max(opacityFloor, opacity(p))),
  }
}

/** 动画器此刻画的样子，拆回缩放和长度。 */
function readState(animator: Animator, axis: 'x' | 'y'): SurfaceState {
  const across = animator.get(axis === 'x' ? 'scaleY' : 'scaleX')
  const along = animator.get(axis === 'x' ? 'scaleX' : 'scaleY')
  return { scale: across, length: across > 0 ? along / across : 1, opacity: animator.get('opacity') }
}

export interface PopoverSurfaceMotion {
  /**
   * 浮层刚以触屏方式显示：从下一个动画帧起、画出之前，从触发器长出。`measure`
   * 在那一帧写任何东西之前读几何，此时浮层是满尺寸。缩回途中再打开时，从缩回
   * 画到的地方立刻折返，不调用 `measure`。
   */
  enter: (measure: () => PopoverSurfaceGeometry) => void
  /** 浮层开始关闭（还显示着）：缩回触发器。上一次不是触屏呈现时什么都不做。 */
  exit: () => void
  /** 取消一切，元素恢复组件样式的样子。 */
  dispose: () => void
}

export interface PopoverSurfaceMotionOptions extends Pick<AnimatorOptions, 'now'> {
  /** 安排呈现时的那次读取（默认是窗口的动画帧）。 */
  requestFrame?: (callback: () => void) => number
  /** 取消 `requestFrame` 安排的读取。 */
  cancelFrame?: (handle: number) => void
}

const MOTION_STYLE_PROPERTIES = ['scale', 'opacity', 'transform-origin', 'animation-name'] as const

export function createPopoverSurfaceMotion(
  element: HTMLElement,
  { requestFrame, cancelFrame, ...animatorOptions }: PopoverSurfaceMotionOptions = {},
): PopoverSurfaceMotion {
  const animator = createMotionEngine(element, animatorOptions)
  const view = element.ownerDocument.defaultView
  const scheduleFrame = requestFrame ?? ((callback: () => void): number => {
    if (typeof view?.requestAnimationFrame === 'function')
      return view.requestAnimationFrame(() => callback())
    callback()
    return 0
  })
  const unscheduleFrame = cancelFrame ?? ((handle: number): void => {
    view?.cancelAnimationFrame?.(handle)
  })

  let pendingFrame: number | null = null
  // 进行中或上一次播放的呈现；浮层处在本动效不管的呈现里时为 null。
  let collapsed: PopoverCollapsedState | null = null
  // 呈现量到的几何：长出期间元素的盒子带着只有曲线知道的缩放。
  let measured: PopoverSurfaceGeometry | null = null
  let presentHandle: MotionHandle | null = null
  let exiting: { copy: HTMLElement, animator: Animator } | null = null
  let releaseHold: (() => void) | null = null

  const cancelPending = (): void => {
    if (pendingFrame != null)
      unscheduleFrame(pendingFrame)
    pendingFrame = null
  }

  const endHold = (): void => {
    releaseHold?.()
    releaseHold = null
  }

  const endExit = (): void => {
    if (exiting == null)
      return
    exiting.animator.dispose()
    exiting.copy.remove()
    exiting = null
  }

  // CSS 进场属于鼠标呈现；这里播自己的长出。
  const holdEntrance = (): void => {
    element.style.setProperty('animation-name', 'none')
  }

  const restoreElement = (promote?: false): void => {
    animator.set({ scaleX: 1, scaleY: 1, opacity: 1 }, promote === false ? { promote } : undefined)
    for (const property of MOTION_STYLE_PROPERTIES)
      element.style.removeProperty(property)
  }

  const present = (from: SurfaceState | null, geometry: PopoverSurfaceGeometry, timing: MotionCurve): void => {
    const next = from != null && collapsed != null ? collapsed : popoverCollapsedState(geometry)
    collapsed = next
    measured = geometry
    const start = from ?? { scale: next.scale, length: next.length, opacity: 0 }
    animator.set(frameOf(start, next.axis))
    holdEntrance()
    element.style.setProperty('transform-origin', `${next.originX}px ${next.originY}px`)
    // 从透明度下限淡入，浏览器会画出第一帧；减少动效时换成从透明开始的淡入。
    const handle = animator.play(surfaceCurves(start, PRESENTED, next.axis, timing, ENTRANCE_OPACITY_FLOOR))
    presentHandle = handle
    endHold()
    releaseHold = holdInput(element, { until: handle, scope: 'viewport' })
    void handle.finished.then(() => {
      if (presentHandle === handle) {
        presentHandle = null
        endHold()
      }
    })
  }

  const enter = (measure: () => PopoverSurfaceGeometry): void => {
    cancelPending()
    if (exiting != null && collapsed != null && measured != null) {
      // 缩回途中又打开：从屏幕上的那一帧、绕同一个点折返。
      const from = readState(exiting.animator, collapsed.axis)
      const timing = readThemeTimingOrInstant(element, POPOVER_ENTRANCE_TOKENS)
      animator.attach(element)
      endExit()
      present(from, measured, timing)
      return
    }
    animator.attach(element)
    endExit()
    let presented = false
    const frame = scheduleFrame(() => {
      presented = true
      pendingFrame = null
      // 这一帧写任何东西之前读一次；CSS 进场已经关掉，盒子是满尺寸。
      const geometry = measure()
      present(null, geometry, readThemeTimingOrInstant(element, POPOVER_ENTRANCE_TOKENS))
    })
    if (presented)
      return
    pendingFrame = frame
    // 打开它的脚本返回后再关 CSS 进场：那段脚本自己的读取不会因此多排一次版。
    queueMicrotask(() => {
      if (pendingFrame === frame)
        holdEntrance()
    })
  }

  const exit = (): void => {
    endHold()
    if (pendingFrame != null) {
      // 还没画出来就关了：屏幕上没东西可缩，元素按组件样式留着。
      cancelPending()
      collapsed = null
      measured = null
      presentHandle = null
      restoreElement(false)
      return
    }
    const target = collapsed
    if (target == null || exiting != null)
      return
    const from = readState(animator, target.axis)
    const timing = readThemeTimingOrInstant(element, POPOVER_EXIT_TOKENS)
    presentHandle = null
    // 副本站在浮层画着的地方，长出到一半的那一帧也算。
    const copy = placePopoverExitCopy(element)
    if (copy == null) {
      restoreElement()
      return
    }
    copy.style.setProperty('transform-origin', `${target.originX}px ${target.originY}px`)
    const closing = createMotionEngine(copy, animatorOptions)
    closing.set(frameOf(from, target.axis))
    const handle = closing.play(surfaceCurves(
      from,
      { scale: target.scale, length: target.length, opacity: 0 },
      target.axis,
      timing,
    ))
    exiting = { copy, animator: closing }
    // 元素马上会被藏起来：恢复静止并放开合成层，下一次呈现再接上。
    restoreElement(false)
    animator.attach(null)
    void handle.finished.then((finished) => {
      if (finished && exiting?.copy === copy)
        endExit()
    })
  }

  return {
    enter,
    exit,
    dispose() {
      cancelPending()
      endHold()
      endExit()
      restoreElement()
      animator.dispose()
      collapsed = null
      measured = null
      presentHandle = null
    },
  }
}
