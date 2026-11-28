/**
 * Popover 触屏呈现的纯几何（上游 Popover/popoverSurfaceFrame.ts）：浮层从哪里
 * 长出、从什么形状长出，以及长到某个进度时的缩放和透明度。不碰 DOM，也不碰
 * 动画器；popoverSurfaceMotion.ts 负责播放。
 */
import type { EntranceBox } from '../layer/layerEntranceSide.js'
import type { ThemeTimingTokens } from '../motion/themeTiming.js'
import { layerEntranceSide } from '../layer/layerEntranceSide.js'
import { popover } from '../motion/uikit/popover.js'

/**
 * 长出用 `--duration-medium-min`（默认主题里最接近 iOS 实测长出时长的一档）和
 * 进场曲线。打开是一次轻点，轻点没有速度，所以不放弹簧。
 */
export const POPOVER_ENTRANCE_TOKENS: ThemeTimingTokens = {
  duration: '--duration-medium-min',
  easing: '--ease-entrance',
}

/** 缩回用所有浮层共用的退场时长和曲线。 */
export const POPOVER_EXIT_TOKENS: ThemeTimingTokens = {
  duration: '--duration-exit',
  easing: '--ease-exit',
}

/** 浮层在哪、挂在什么上，都是视口 px。 */
export interface PopoverSurfaceGeometry {
  /** 摆好位置后的浮层边框盒，满尺寸。 */
  surface: EntranceBox
  /** 浮层锚定的那个元素的盒子。 */
  source: EntranceBox
}

/** 浮层从哪里长出，从什么形状长出。 */
export interface PopoverCollapsedState {
  /** 缩放原点，从浮层左上角量起的 px。 */
  originX: number
  originY: number
  /** 同时带着长度的那个缩放轴：背离触发器的方向（上下弹出时是 `y`）。 */
  axis: 'x' | 'y'
  /** 起始的等比缩放。 */
  scale: number
  /** 沿 `axis` 起始长度占满长度的比例，最多为 1。 */
  length: number
}

/** 浮层表面的缩放和透明度。 */
export interface PopoverFrame {
  scaleX: number
  scaleY: number
  opacity: number
}

export interface SurfaceState {
  scale: number
  /** 沿轴长度占满长度的比例。 */
  length: number
  opacity: number
}

export const PRESENTED: SurfaceState = { scale: 1, length: 1, opacity: 1 }

/**
 * 浮层和触发器相接的点，以及长出的起始形状。这个点在浮层朝向触发器的那条边上、
 * 正对触发器中心（箭头尖的位置）。鼠标进场按同一规则找原点，所以手指和鼠标从
 * 同一处长出。盖住触发器中心的浮层没有侧，只从那个中心缩放。
 */
export function popoverCollapsedState({ surface, source }: PopoverSurfaceGeometry): PopoverCollapsedState {
  const side = layerEntranceSide(surface, source)
  const horizontal = side != null && side.x !== 0
  const overSource = side != null && side.x === 0 && side.y === 0
  const fullLength = horizontal ? surface.width : surface.height
  return {
    originX: side?.originX ?? 0,
    originY: side?.originY ?? 0,
    axis: horizontal ? 'x' : 'y',
    scale: popover.collapsedScale,
    length: !overSource && fullLength > 0 ? Math.min(1, popover.collapsedLengthPx / fullLength) : 1,
  }
}

export function frameOf(state: SurfaceState, axis: 'x' | 'y'): PopoverFrame {
  const along = state.scale * state.length
  return {
    scaleX: axis === 'x' ? along : state.scale,
    scaleY: axis === 'y' ? along : state.scale,
    opacity: state.opacity,
  }
}

/** 长到进度 `p` 时的浮层：UIKit 的 popover 在这一进度上画出的那一帧。 */
export function popoverFrame(state: PopoverCollapsedState, p: number): PopoverFrame {
  return frameOf({
    scale: state.scale + (1 - state.scale) * p,
    length: state.length + (1 - state.length) * p,
    opacity: p,
  }, state.axis)
}
