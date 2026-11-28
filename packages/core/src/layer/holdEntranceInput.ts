/**
 * @file holdEntranceInput.ts
 * @input 刚开始播 CSS 进场动画的浮层根元素
 * @output holdEntranceInput：主指针是粗略指针（手指、笔）时，进场播完之前挡住输入
 * @position 用 CSS 进场的浮层（Dialog、Drawer、MobileNav）的进场暂挡，建在 `inputHold.ts` 上
 */

import { isCoarsePointer } from '../utils/coarsePointer'
import { holdInput } from './inputHold'

/** {@link holdEntranceInput} 的选项。 */
export interface EntranceHoldOptions {
  /**
   * 为 true 时挡住哪里的输入都挡；为 false 时只挡落在浮层上的，页面照常。
   * @default true
   */
  isModal?: boolean
  /**
   * 进场动画所在的元素，不是浮层自己时传（比如对话框里的抽屉面板）。
   * @default 浮层自己
   */
  entrance?: Element | null
  /** 最多挡多少毫秒。进场比这还长，到点也放开。 */
  capMs?: number
}

/**
 * 进场播完前（最多 `capMs`）把手指和笔的输入挡在 `layer` 外面。返回放开的函数；
 * 没有进场在播、或主指针是精细指针时什么都不挡，返回 `null`。
 */
export function holdEntranceInput(
  layer: Element,
  { isModal = true, entrance: animated = layer, capMs }: EntranceHoldOptions = {},
): (() => void) | null {
  if (animated == null || typeof animated.getAnimations !== 'function')
    return null
  // getAnimations() 会刷新样式，刚打开就开始的进场也列得出来。主题时长、减少动效
  // 下更短的进场、被取消的进场，结束时都放开。
  const entrance = animated.getAnimations().filter(isEntrance)
  if (entrance.length === 0)
    return null
  // 只看打开那一刻的触屏呈现：主指针精细的设备（比如带触屏的笔记本）上的手指不挡。
  if (!isCoarsePointer(layer.ownerDocument.defaultView))
    return null
  const ended = Promise.all(entrance.map(async animation => animation.finished))
  return holdInput(layer, {
    until: capMs == null ? ended : Promise.race([ended, after(capMs)]),
    scope: isModal ? 'viewport' : 'surface',
  })
}

async function after(ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/** 会自己结束的、正在播的动画：进场，而不是转圈。 */
function isEntrance(animation: Animation): boolean {
  if (animation.playState !== 'running')
    return false
  const end = animation.effect?.getComputedTiming().endTime
  return typeof end === 'number' && Number.isFinite(end)
}
