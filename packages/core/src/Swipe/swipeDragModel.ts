/**
 * @file swipeDragModel.ts
 * @input 共享拖动通道交来的拖动（SnapDragMove、SnapDragRelease），行的状态和几何，
 *   UIKit 的横滑常量
 * @output createSwipeDragModel：横滑交给 createSnapDrag 的拖动模型（begin、move、release、
 *   cancel），即拖动把行画在哪、松手落在哪；以及模型和 useSwipeAction.ts 共用的类型
 * @position useSwipeAction.ts 的手指模型。落位和触发由 useSwipeAction 通过 SwipeDragHost 提供。
 */

import type { SnapDrag, SnapDragLanding, SnapDragMove, SnapDragRelease, SnapDragTarget } from '../dragToSnapPoints/createDragToSnapPoints'
import type { SpringCurve, SpringDescription } from '../motion/spring'
import type { Stop, SwipeLayout, SwipeReleaseBehavior, SwipeSide, SwipeState } from './swipeRelease'
import { DEFAULT_FLICK_THRESHOLD } from '../dragToSnapPoints/createDragToSnapPoints'
import { reducedMotionFade } from '../motion/reducedMotion'
import { resolveMotion } from '../motion/resolveMotion'
import { resolveSnapPoint } from '../motion/resolveSnapPoint'
import { solveSpring, toSpring } from '../motion/spring'
import { swipeActions as SWIPE } from '../motion/uikit/swipeActions'
import { isRtlElement } from '../utils/isRtlElement'
import { openWidthOf, sidePanelOf } from './swipeDom'
import {
  AT_REST_PX,
  confirmedOffset,
  confirmPoint,
  isSwipeOpen,
  physicalSign,
  resolveRelease,
  sideFor,
  stopsOf,
  SWIPE_OPEN_PROPERTY,
  SWIPE_PIN_PROPERTY,
  SWIPE_SIGN_PROPERTY,
  SWIPE_SLIDE_PROPERTY,
} from './swipeRelease'

/**
 * 是什么开始了一次落位：触摸拖动结束（松手，或浏览器接走了触摸），或别的。
 * 别的是 Escape、指针落在外面、点了操作、点了内容、滚动，或笔和触控板的松手。
 */
export type SettleCause = 'release' | 'other'

/** 一次落位的选项。 */
export interface SwipeSettleOptions {
  cause?: SettleCause
  velocity?: number
  /** 落位用的弹簧；不写这个键时用 UIKit 的 settle 弹簧，写成 undefined 用共享拖动自己的。 */
  spring?: SpringDescription
  onPass?: { offset: number, direction: 1 | -1, call: () => void }
  /** 在输入事件自己的任务里请求（见 createSnapDrag）。 */
  start?: 'next-frame'
  /** 行落位期间盖满面板的操作。 */
  cover?: number | null
}

/** 行交给横滑的、随渲染更新的选项。 */
export interface SwipeActionOptions {
  behavior: SwipeReleaseBehavior
  /**
   * 每一侧有几个操作。朝没有操作的一侧的拖动不会开始；有两个及以上操作的一侧，
   * 只有从停开在这一侧的行开始，全滑才会确认。
   */
  sides: Record<SwipeSide, number>
  /** 触发这一侧最外侧的操作。返回行之后是否停在外面（操作的 `hasRemoval`）。 */
  fireOutermost: (side: SwipeSide) => boolean
  /** 这一侧最外侧的操作能否触发：禁用的操作永远不让全滑确认。 */
  canConfirm: (side: SwipeSide) => boolean
}

/** 模型向 useSwipeAction 要的东西。 */
export interface SwipeDragHost {
  root: () => HTMLElement | null
  snap: () => SnapDrag | null
  options: () => SwipeActionOptions
  state: () => SwipeState
  setState: (next: SwipeState) => void
  setLayout: (layout: SwipeLayout) => void
  /** 最近一次按下落在哪一侧的最外侧操作上（行正开在那一侧时）。 */
  landedOn: () => SwipeSide | null
  /** 行现在在屏幕上的位移，逻辑方向，按 `layout` 的那一侧算。 */
  travelNow: (layout: SwipeLayout) => number
  settle: (layout: SwipeLayout, stop: Stop, phase: 'idle' | 'resting' | 'held', options?: SwipeSettleOptions) => void
  slideOutAndFire: (layout: SwipeLayout, cause: SettleCause, motion: { velocity?: number, spring?: SpringDescription }) => void
}

/** 手指的横滑从按下算起走过这么远才开始：行对这次触摸的认领。从这里起行就在手指的位移上。 */
const FINGER_SWIPE_START = SWIPE.claim

/** 飞行中的领先量离目标多近算长好了（px）。 */
const LEAD_REST = 0.25

interface Drag {
  layout: SwipeLayout
  /** 全滑在这个位移确认。 */
  confirmAt: number
  /** 全滑能确认：最外侧操作能触发，且有两个及以上操作的一侧在拖动开始时就开着。 */
  canConfirm: boolean
  /** 由触控板滚动驱动，不是手指或笔。 */
  isScroll: boolean
  /** 横滑已经开始：行在跟。 */
  started: boolean
  /** 横滑开始的方向：朝这一侧 +1，背离 −1。 */
  startSign: number
  /** 横滑开始时行已有的位移（逻辑，≥ 0）。 */
  baseTravel: number
  /** 按 UIKit 的量法算的横滑位移，手指从它的死区算起（逻辑，≥ 0）。全滑按它确认。 */
  raw: number
  /** 行画在哪（不含领先量，逻辑，≥ 0）。手指的行在手指从按下算起的位移上。 */
  held: number
  /** 确认后手指的行在领先量长好后跑在手指前面多远（逻辑）；没确认时是 0。 */
  lead: number
  /** 领先量正在长或缩的曲线和开始时间（ms）。 */
  leadMotion: { curve: SpringCurve, start: number } | null
  /** 已确认：横滑越过了确认点。 */
  isArmed: boolean
  /** 这次横滑中曾经确认过。 */
  wasConfirmed: boolean
  /** 减少动效下，确认或退回引起的淡入淡出到这个时间（ms）结束；之前的移动不打扰它。 */
  dipUntil?: number
}

/** 手指在 `now` 时的领先量：长好了的，或飞行中的。 */
function leadNow(drag: Drag, now: number): number {
  const motion = drag.leadMotion
  if (motion == null)
    return drag.lead
  const t = (now - motion.start) / 1000
  return t < motion.curve.settleTime(LEAD_REST) ? motion.curve.value(t) : drag.lead
}

/** 手指的领先量在 `now` 时动得多快（px/s）。 */
function leadVelocity(drag: Drag, now: number): number {
  const motion = drag.leadMotion
  return motion == null ? 0 : motion.curve.velocity((now - motion.start) / 1000)
}

/** 把一侧的几何写在它的窗口上，让操作贴着外缘。 */
function writeSideGeometry(root: HTMLElement, layout: SwipeLayout): void {
  const frame = sidePanelOf(root, layout.side)?.window
  if (frame == null)
    return
  const sign = physicalSign(layout.side, layout.inlineSign)
  frame.style.setProperty(SWIPE_PIN_PROPERTY, `${sign * layout.openWidth}px`)
  frame.style.setProperty(SWIPE_SIGN_PROPERTY, String(sign))
  frame.style.setProperty(SWIPE_OPEN_PROPERTY, `${layout.openWidth}px`)
  frame.style.setProperty(SWIPE_SLIDE_PROPERTY, `${sign * (layout.openWidth - layout.outerWidth)}px`)
}

/**
 * 横滑的拖动模型。拖动停在它的一侧：同一次手势里开着的行只会合上，不会越过原位到另一侧。
 *
 * - 触控板的横向滑动从越过 pan 的 8 px 起一比一跟随，松手按位置和速度落到最近的停靠点。
 * - 手指或笔的拖动从行的 8 px 认领开始，之后行一直在手指从按下算起的位移上。全滑按 UIKit 的
 *   量法、从 UIKit 的 25 px 死区算起确认；确认后行在 UIKit 的 tracking 弹簧上跑到确认偏移并
 *   保持领先。松手按 resolveRelease，在 UIKit 的 settle 弹簧上从行自己的速度出发。
 *
 * 减少动效下拖动本身仍一比一跟随，但确认和退回改成淡入淡出。
 */
export function createSwipeDragModel(host: SwipeDragHost): {
  begin: (move: SnapDragMove) => boolean
  move: (move: SnapDragMove) => SnapDragTarget | null
  release: (end: SnapDragRelease) => SnapDragLanding | null
  cancel: () => SnapDragLanding | null
  dispose: () => void
} {
  let drag: Drag | null = null
  let leadFrame: number | null = null

  const coverOf = (side: SwipeSide): number => host.options().sides[side] - 1

  const stopLeadFrames = (): void => {
    if (leadFrame != null) {
      cancelAnimationFrame(leadFrame)
      leadFrame = null
    }
  }

  // 领先量在长或缩时，没有移动的帧也要画行：底子留在手指的位移上，领先量继续动。
  const drawLeadFrame = (): void => {
    leadFrame = null
    const snap = host.snap()
    if (drag?.leadMotion == null || snap == null)
      return
    const { layout, leadMotion } = drag
    const now = performance.now()
    const sign = physicalSign(layout.side, layout.inlineSign)
    snap.animator.set({ x: sign * (drag.held + leadNow(drag, now)) })
    if ((now - leadMotion.start) / 1000 < leadMotion.curve.settleTime(LEAD_REST))
      leadFrame = requestAnimationFrame(drawLeadFrame)
    else
      drag.leadMotion = null
  }

  const begin = (move: SnapDragMove): boolean => {
    const root = host.root()
    if (root == null)
      return false
    const inlineSign: 1 | -1 = isRtlElement(root) ? -1 : 1
    // 开着或在动的行继续在它那一侧（合上或走得更远）；合着的行取拖动朝向的一侧。
    const side: SwipeSide = Math.abs(move.start) > AT_REST_PX
      ? (move.start * inlineSign > 0 ? 'leading' : 'trailing')
      : sideFor(move.total, inlineSign)
    const panel = sidePanelOf(root, side)
    const layout: SwipeLayout = {
      inlineSign,
      openWidth: openWidthOf(panel),
      outerWidth: panel?.entries.at(-1)?.offsetWidth ?? 0,
      rowWidth: root.clientWidth,
      side,
    }
    // 操作按最近写下的几何贴着轨道。第一次拖动或操作变了，就趁轨道还藏着它们时写下。
    writeSideGeometry(root, layout)
    host.setLayout(layout)
    host.snap()?.setSnapPoints(stopsOf(layout))
    // 有两个及以上操作的一侧只从停开在这一侧的行确认全滑。行开着时按在最外侧操作上也算
    // （滚动可能在这次按压移动前就开始合行），最外侧操作盖满面板时也算。合着的行被拖动是打开它。
    const current = host.state()
    const { sides, canConfirm } = host.options()
    const isDeliberate
      = (move.input !== 'scroll' && host.landedOn() === side)
        || (current.side === side && (isSwipeOpen(current) || current.cover === coverOf(side)))
    drag = {
      baseTravel: 0,
      canConfirm: canConfirm(side) && (sides[side] < 2 || isDeliberate),
      confirmAt: confirmPoint(layout.openWidth, layout.rowWidth),
      isArmed: false,
      isScroll: move.input === 'scroll',
      raw: 0,
      held: 0,
      lead: 0,
      leadMotion: null,
      started: false,
      startSign: 1,
      wasConfirmed: false,
      layout,
    }
    return true
  }

  const track = (move: SnapDragMove): SnapDragTarget | null => {
    if (drag == null)
      return null
    const { layout } = drag
    const sign = physicalSign(layout.side, layout.inlineSign)
    if (!drag.started) {
      // 触控板从越过 pan 起点的第一个事件起跟随；手指从按下处走过 FINGER_SWIPE_START 才开始，
      // 之前行停在被接住的地方。
      if (!drag.isScroll && Math.abs(move.total) < FINGER_SWIPE_START)
        return null
      drag.started = true
      drag.startSign = Math.sign(move.total * sign) || 1
      drag.baseTravel = host.travelNow(layout)
      host.setState({
        cover: drag.isArmed ? coverOf(layout.side) : null,
        isArmed: drag.isArmed,
        phase: 'dragging',
        side: layout.side,
      })
    }
    // 按 UIKit 的量法：手指的横滑从 UIKit 的死区算起，触控板的从 pan 的起点算起。
    const swipe = drag.isScroll
      ? move.translation * sign
      : move.total * sign - drag.startSign * SWIPE.hysteresis
    // 同一次手势里行停在它那一侧：永不越过原位。
    const raw = Math.max(0, drag.baseTravel + swipe)
    drag.raw = raw
    // 手指的行在手指从按下算起的位移上：行上被手指按住的那一点一直在手指下。
    const held = drag.isScroll ? raw : Math.max(0, drag.baseTravel + move.total * sign)
    drag.held = held
    const isArmed = drag.canConfirm && raw >= drag.confirmAt
    const flipped = isArmed !== drag.isArmed
    const root = host.root()
    const fade = reducedMotionFade(root)
    const now = performance.now()
    if (flipped) {
      // 确认时，手指的行获得一段领先量，在 UIKit 的 tracking 弹簧上长到确认偏移；退回时在同一个
      // 弹簧上缩回。底子始终在手指的位移上。减少动效下领先量立即变化，在下面的淡入淡出里完成。
      const from = leadNow(drag, now)
      const velocity = leadVelocity(drag, now)
      drag.lead = isArmed ? Math.max(0, confirmedOffset(layout.rowWidth) - held) : 0
      drag.leadMotion = drag.isScroll || fade != null
        ? null
        : {
            curve: solveSpring(toSpring(resolveMotion(root, SWIPE.tracking)), { from, to: drag.lead, velocity }),
            start: now,
          }
      if (drag.leadMotion != null && leadFrame == null)
        leadFrame = requestAnimationFrame(drawLeadFrame)
      drag.isArmed = isArmed
      drag.wasConfirmed ||= isArmed
      host.setState({
        cover: isArmed ? coverOf(layout.side) : null,
        isArmed,
        phase: 'dragging',
        side: layout.side,
      })
    }
    // 确认后触控板的行跑到确认偏移，在那儿等手指。
    const travel = drag.isScroll
      ? (isArmed ? Math.max(raw, confirmedOffset(layout.rowWidth)) : raw)
      : held + leadNow(drag, now)
    const offset = sign * travel
    if (fade == null)
      return drag.isScroll && flipped ? { offset, spring: SWIPE.tracking } : { offset }
    if (flipped) {
      // 确认和退回是状态变化而不是拖动：减少动效下它们淡入淡出，淡完之前的移动不打扰它。
      drag.dipUntil = now + fade.duration
      return { offset, spring: SWIPE.tracking }
    }
    if (drag.dipUntil != null && now < drag.dipUntil)
      return null
    drag.dipUntil = undefined
    return { offset }
  }

  const release = (end: SnapDragRelease): SnapDragLanding | null => {
    const ended = drag
    drag = null
    stopLeadFrames()
    // 没变成横滑的拖动什么都没改：行留在被接住的地方。
    if (ended == null || !ended.started)
      return null
    const { layout } = ended
    const sign = physicalSign(layout.side, layout.inlineSign)
    const velocity = end.velocity * sign
    const cause: SettleCause = end.input === 'touch' ? 'release' : 'other'
    const { behavior } = host.options()
    let landing: 'closed' | 'open' | 'perform'
    if (ended.isScroll) {
      // 触控板的松手按位置和速度落到最近的停靠点；全滑只靠位置到达，速度永远不触发操作。
      if (ended.isArmed) {
        landing = 'perform'
      }
      else {
        const { index } = resolveSnapPoint({
          points: behavior === 'commit' ? [0] : [0, layout.openWidth],
          position: ended.raw,
          velocity,
          flickThreshold: DEFAULT_FLICK_THRESHOLD,
          start: ended.baseTravel,
        })
        landing = index === 1 ? 'open' : 'closed'
      }
    }
    else {
      landing = resolveRelease({
        behavior,
        isConfirmed: ended.isArmed,
        openWidth: layout.openWidth,
        travel: ended.held,
        velocity,
        wasConfirmed: ended.wasConfirmed,
      })
    }
    // 手指的落位从行自己的速度出发，用 UIKit 的弹簧；触控板的从手指最后一次移动的速度出发，
    // 用共享的 settle 弹簧。
    const motion = { velocity: end.velocity, spring: ended.isScroll ? undefined : SWIPE.settle }
    if (landing === 'perform')
      host.slideOutAndFire(layout, cause, motion)
    else if (landing === 'open')
      host.settle(layout, 'open', 'resting', { cause, ...motion })
    else
      host.settle(layout, 'rest', 'idle', { cause, ...motion })
    // 上面的落位是行自己的；共享拖动不再开始它自己的。
    return null
  }

  const cancel = (): SnapDragLanding | null => {
    const ended = drag
    drag = null
    stopLeadFrames()
    // 浏览器接走了行正在跟的触摸：行合上。
    if (ended != null && ended.started) {
      host.settle(ended.layout, 'rest', 'idle', {
        cause: 'release',
        spring: ended.isScroll ? undefined : SWIPE.settle,
      })
    }
    return null
  }

  return { begin, move: track, release, cancel, dispose: stopLeadFrames }
}
