/**
 * @file lightboxPager.ts
 * @input 视口（手势表面）和页面轨道、页数、页距、受控的当前页、是否能拖、各种回调
 * @output useLightboxPager：照片 App 那样的图集左右滑动翻页，照着 UIKit 分页滚动视图还原
 * @position 灯箱内部的翻页器。选页规则和拖动位置在 pagerRelease.ts，松手后的落位曲线在
 *   motion/paging.ts，「接住」识别器复用 composables/internal/snapPagingCatcher.ts。
 *
 * - 横向拖动 1:1 带着轨道走，每一步只写一次 `translate`，不读布局。越过第一页或最后一页按 UIKit
 *   的橡皮筋让步（d = 页宽）。
 * - 抬手时按 UIKit 实测的规则选页（`pageForRelease`），再按 UIKit 的分页积分器（`solvePaging`）
 *   落位，速度按主题的节奏（themeTempo）换算，烘焙成合成器关键帧。
 * - 手指落在正在落位的轨道上，过 `paging.catchStopMs` 才停住，和 UIKit 一样；停住后不拖直接抬起，
 *   停到最近的一页。按钮、方向键引起的翻页（`goTo`）手指一碰就停。
 * - 受控的当前页变了：触屏呈现下滑过去（`setContentOffset(_:animated:)` 的曲线），精细指针下直接到位。
 *   报出去的页没被采纳（受控父组件拒绝），轨道弹回父组件给的那一页。
 * - 减少动效：拖动照样跟手，抬手后不再滑行。手指松手就地淡入淡出，鼠标或触控笔的松手和 `goTo`
 *   在粗指针上淡入淡出、精细指针上直接到位（动画器的默认处理）。
 */

import type { GestureEventContext, GestureTouch, Point, PointerKind } from '../gestures/types'
import type { MotionCurve, MotionHandle } from '../motion/animator'
import { nextTick, watch } from 'vue'
import { SettleCatcher } from '../composables/internal/snapPagingCatcher'
import { PanGestureRecognizer } from '../gestures/PanGestureRecognizer'
import { useAttachment } from '../gestures/useAttachment'
import { useGestureRecognizer } from '../gestures/useGestureRecognizer'
import { createMotionEngine } from '../motion/animator'
import { pagingSettleVelocity, solveAnimatedPageScroll, solvePaging } from '../motion/paging'
import { resolveMotion } from '../motion/resolveMotion'
import { rubberBandUnclamp } from '../motion/rubberBand'
import { themeTempo } from '../motion/themeTempo'
import { paging, registerPagingTable } from '../motion/uikit/paging'
import { isRtlElement } from '../utils/isRtlElement'
import { lockSelection, locksSelectionFor } from '../utils/selectionLock'
import { observeResize } from '../utils/sharedResizeObserver'
import { dragTrackPosition, pageForRelease } from './pagerRelease'

export interface LightboxPagerOptions {
  /** 手势表面：页面透过它显示、被裁切的盒子。 */
  readonly viewport: () => HTMLElement | null
  /** 被平移的那一排页面。 */
  readonly track: () => HTMLElement | null
  readonly count: () => number
  /** 页与页之间的距离，px；只在翻页途中看得见。 */
  readonly gap: number
  /** 受控的当前页。 */
  readonly index: () => number
  /** 能不能拖着翻页（关掉时进行中的拖动被取消）。 */
  readonly isPanEnabled: () => boolean
  /** 当前页变化时滑过去（否则直接到位）。被拒绝的页总是滑回去。 */
  readonly isControlledChangeAnimated: () => boolean
  /** 拖动开始时，按它在屏幕上的方向问一下；返回 false 把这一下留给别人（比如还能往那边平移的放大照片）。 */
  readonly shouldBeginPan?: (direction: 'left' | 'right') => boolean
  /** 拖动识别器的额外条件（比如从视频控件上起的拖动不翻页）。 */
  readonly panShouldBegin?: (pan: PanGestureRecognizer) => boolean
  /** 松手选中了另一页（落位已经在走）。 */
  readonly onIndexChange: (index: number) => void
  /** 轨道停在了 `index` 上。 */
  readonly onSettle?: (index: number) => void
}

export interface LightboxPager {
  readonly pan: PanGestureRecognizer
  /** 轨道自己在动（落位或 goTo）。 */
  isSettling: () => boolean
  /** 屏幕上的内容偏移（px）。 */
  presentation: () => number
  goTo: (index: number, animated: boolean) => void
}

/** 只认手指、触控笔、鼠标拖动和触控板横扫的分页拖动，记下这一下是哪种指针。 */
class PagerPan extends PanGestureRecognizer {
  pointerType: PointerKind | null = null

  protected override touchesBegan(touches: ReadonlyArray<GestureTouch>, event: GestureEventContext): void {
    if (this.state === 'possible' && touches.length > 0)
      this.pointerType = touches[0]!.pointerType
    super.touchesBegan(touches, event)
  }

  // UIKit 嵌套滚动的规则：横向占主导（含 45°）就归翻页器，否则留给别人（比如往下拖关闭）。
  protected override classify(translation: Point): 'begin' | 'fail' | 'wait' {
    const decided = super.classify(translation)
    if (decided !== 'wait')
      return decided
    const along = Math.abs(translation.x)
    const across = Math.abs(translation.y)
    if (along === 0 && across === 0)
      return 'wait'
    return along >= paging.nestedPanAxisRatio * across ? 'begin' : 'fail'
  }
}

/** 触控板横扫走过不到这么多页，不论多快都按静止松手。 */
const STILL_RELEASE_FRACTION = 0.1

function isScrollContact(recognizer: PanGestureRecognizer): boolean {
  return recognizer.trackedTouches[0]?.scrollType != null
}

export function useLightboxPager(options: LightboxPagerOptions): LightboxPager {
  registerPagingTable()
  const animator = createMotionEngine(null)
  let pageWidth = 0
  let isRtl = false
  let target = options.index()
  let dragging = false
  let dragStart = 0
  let dragPosition = 0
  let dragStartIndex = 0
  let settleHandle: MotionHandle | null = null
  let settleToken = 0
  let isReleaseSettle = false
  let isSwipeSettle = false
  let pendingReport = false
  let reportToken = 0
  let isCatchArmed = false
  let caughtSettle = false
  let suppressCancelSettle = false
  let releaseSelection: (() => void) | null = null

  const count = (): number => Math.max(1, options.count())
  const stride = (): number => pageWidth + options.gap
  const sign = (): number => (isRtl ? 1 : -1)
  const clampIndex = (index: number): number => Math.min(Math.max(0, index), count() - 1)
  const offsetOf = (index: number): number => index * stride()
  // `+ 0` 把镜像出来的 -0 变成 0。
  const positionToX = (position: number): number => sign() * position + 0
  const presentation = (): number => sign() * animator.get('x') + 0
  const nearestPage = (position: number): number =>
    stride() > 0 ? clampIndex(Math.round(position / stride())) : clampIndex(target)
  const view = (): Window | null => options.viewport()?.ownerDocument.defaultView ?? null

  // 报出新的一页。受控父组件没采纳（下一拍还是旧值）时，轨道滑回它给的那一页。
  const flushReport = (): void => {
    if (!pendingReport)
      return
    pendingReport = false
    options.onIndexChange(target)
    void nextTick(() => {
      const kept = options.index()
      if (kept !== target)
        goTo(kept, true)
    })
  }

  // 落位在合成器上跑起来两帧之后再报新的一页，Vue 的重新渲染不会挤掉落位的第一帧。
  const afterFrames = (frames: number, callback: () => void): void => {
    const frame = view()?.requestAnimationFrame?.bind(view())
    if (frame == null) {
      callback()
      return
    }
    const step = (left: number): void => {
      if (left <= 0)
        callback()
      else
        frame(() => step(left - 1))
    }
    step(frames)
  }

  const rest = (): void => {
    flushReport()
    isSwipeSettle = false
    options.onSettle?.(target)
  }

  const stopSettle = (): void => {
    settleToken += 1
    if (settleHandle != null) {
      settleHandle = null
      animator.stop(['x'])
    }
  }

  const play = (curve: MotionCurve, touchRelease: boolean, isRelease: boolean): void => {
    isSwipeSettle = false
    isReleaseSettle = isRelease
    const s = sign()
    const x: MotionCurve = {
      duration: curve.duration,
      at: t => s * curve.at(t) + 0,
      velocity: t => s * curve.velocity(t) + 0,
    }
    const handle = animator.play({ x }, { touchRelease })
    const token = ++settleToken
    settleHandle = handle
    if (pendingReport) {
      const reportAt = reportToken
      void handle.started.then(() => afterFrames(2, () => {
        if (reportAt === reportToken)
          flushReport()
      }))
    }
    void handle.finished.then((finished) => {
      if (token !== settleToken)
        return
      settleHandle = null
      if (finished) {
        animator.set({ x: x.at(x.duration) })
        rest()
      }
    })
  }

  /** 抬手（松开拖动，或停住后放开）后的落位。 */
  const settleFrom = (position: number, velocity: number, touchRelease: boolean): void => {
    const to = offsetOf(target)
    const curve = solvePaging({ from: position, velocity, to, tempo: themeTempo(options.track()) })
    if (curve.steps === 0) {
      animator.set({ x: positionToX(to) })
      rest()
      return
    }
    play(curve, touchRelease, true)
  }

  const releaseTo = (next: number, position: number, velocity: number, touchRelease: boolean): void => {
    target = next
    pendingReport = next !== options.index()
    reportToken += 1
    settleFrom(position, pagingSettleVelocity(velocity), touchRelease)
  }

  // 量页宽和书写方向，只在挂上、尺寸变化和拖动开始时量。变了就把轨道放回目标页。
  const measure = (): void => {
    const viewport = options.viewport()
    if (viewport == null)
      return
    const width = viewport.clientWidth
    const rtl = isRtlElement(viewport)
    if (width === pageWidth && rtl === isRtl)
      return
    pageWidth = width
    isRtl = rtl
    if (dragging)
      return
    const wasSettling = settleHandle != null
    stopSettle()
    animator.set({ x: positionToX(offsetOf(target)) })
    if (wasSettling)
      rest()
  }

  const pan = new PagerPan({
    name: 'Lightbox.pager',
    direction: 'horizontal',
    axisRatio: paging.panAxisRatio,
    maximumNumberOfTouches: 1,
    allowedPointerTypes: ['touch', 'pen', 'mouse'],
    allowedScrollTypes: ['continuous'],
    shouldBegin: (recognizer) => {
      if (options.panShouldBegin?.(recognizer) === false)
        return false
      const direction = recognizer.totalTranslation().x < 0 ? 'left' : 'right'
      return options.shouldBeginPan?.(direction) ?? true
    },
  })
  // 「接住」只在轨道自己在动、且能拖时开始，和拖动同时识别。它不认领触摸。
  const catcher = new SettleCatcher({
    minimumPressDuration: 0,
    allowableMovement: Number.POSITIVE_INFINITY,
    selectionLock: null,
    shouldBegin: () => settleHandle != null && !dragging && options.isPanEnabled(),
  })
  catcher.recognizeSimultaneouslyWith(pan)

  useGestureRecognizer(options.viewport, () => pan, (recognizer) => {
    const state = recognizer.state
    if (state === 'began') {
      const wasSwipeSettle = settleHandle != null && isSwipeSettle
      measure()
      isCatchArmed = false
      catcher.disarmCatch()
      const current = presentation()
      stopSettle()
      dragging = true
      // 停在两端以外（橡皮筋里）的轨道被接住：从没让步的位置起拖，第一步仍在手指下。
      dragStart = rubberBandUnclamp(current, 0, offsetOf(count() - 1), pageWidth > 0 ? pageWidth : 1)
      dragPosition = current
      // 上一次横扫还在落位时又来一次触控板横扫，从那次的目标页起算，连着翻。
      dragStartIndex = wasSwipeSettle && isScrollContact(recognizer) ? target : nearestPage(current)
      return
    }
    if (state === 'changed') {
      // 手指往右（dx > 0）在从左到右的书写方向里把内容带向前面的页。
      dragPosition = dragTrackPosition({
        start: dragStart,
        delta: sign() * recognizer.translation().x,
        stride: stride(),
        count: count(),
        pageWidth,
        startIndex: isScrollContact(recognizer) ? dragStartIndex : undefined,
      })
      animator.set({ x: positionToX(dragPosition) })
      return
    }
    if (state !== 'ended' && state !== 'cancelled')
      return
    dragging = false
    if (state === 'cancelled' && suppressCancelSettle) {
      suppressCancelSettle = false
      return
    }
    // 停住的手指以 0 速度松手（UIScrollView 保留速度）。
    let velocity = state === 'ended' ? sign() * recognizer.scrollVelocity().x : 0
    // 触控板横扫只走了不到十分之一页：速度尖峰不算轻扫。
    if (isScrollContact(recognizer) && stride() > 0
      && Math.abs(dragPosition - dragStart) / stride() < STILL_RELEASE_FRACTION) {
      velocity = 0
    }
    const next = pageForRelease({ position: dragPosition, velocity, stride: stride(), count: count(), startIndex: dragStartIndex })
    releaseTo(next, dragPosition, velocity, pan.pointerType === 'touch')
    isSwipeSettle = settleHandle != null && isScrollContact(recognizer)
  }, { isEnabled: options.isPanEnabled })

  const holdSelection = (on: boolean): void => {
    const track = options.track()
    if (on && releaseSelection == null && track != null && locksSelectionFor(catcher.pointerType ?? 'touch')) {
      releaseSelection = lockSelection([track], null)
    }
    else if (!on && releaseSelection != null) {
      releaseSelection()
      releaseSelection = null
    }
  }

  const catchSettle = (): void => {
    if (settleHandle != null && !dragging) {
      stopSettle()
      caughtSettle = true
    }
  }

  useGestureRecognizer(options.track, () => catcher, (recognizer) => {
    if (recognizer.state === 'began') {
      holdSelection(true)
      const isMouse = catcher.pointerType === 'mouse'
      // 鼠标保留它的点击；手指或触控笔的这次触摸到不了内容。
      if (isReleaseSettle && !isMouse)
        catcher.takeFromContent()
      caughtSettle = false
      if (!isReleaseSettle && !isMouse) {
        // UIKit 在触摸那一刻停住动画的 setContentOffset。
        catchSettle()
        return
      }
      isCatchArmed = true
      catcher.armCatch(paging.catchStopMs, () => {
        if (!isCatchArmed)
          return
        isCatchArmed = false
        catchSettle()
      })
      return
    }
    if (recognizer.state !== 'ended' && recognizer.state !== 'cancelled')
      return
    holdSelection(false)
    if (isCatchArmed) {
      // 停住之前就抬起：落位照常走完。
      isCatchArmed = false
      catcher.disarmCatch()
      return
    }
    const wasCaught = caughtSettle
    caughtSettle = false
    if (wasCaught && !dragging && settleHandle == null) {
      // 停住后不拖、直接抬起：停到最近的一页。
      const position = presentation()
      const next = pageForRelease({ position, velocity: 0, stride: stride(), count: count(), startIndex: nearestPage(position) })
      releaseTo(next, position, 0, catcher.pointerType === 'touch')
    }
  }, { manageStyle: false })

  function goTo(index: number, animated: boolean): void {
    const next = clampIndex(Math.round(index))
    if (dragging) {
      suppressCancelSettle = true
      dragging = false
      pan.cancel()
    }
    const from = presentation()
    // 被换掉的那段移动把速度交给新的一段。
    const velocity = settleHandle != null ? sign() * animator.getVelocity('x') : undefined
    pendingReport = false
    reportToken += 1
    stopSettle()
    target = next
    const to = offsetOf(next)
    if (!animated || from === to || pageWidth === 0) {
      animator.set({ x: positionToX(to) })
      rest()
      return
    }
    const track = options.track()
    play(solveAnimatedPageScroll({
      from,
      to,
      durationMs: resolveMotion(track, paging.animatedScroll, 'durationMs'),
      curve: resolveMotion(track, paging.animatedScroll.curve),
      velocity,
    }), false, false)
  }

  // 挂到轨道上，量一次尺寸，并跟着视口的尺寸变化重新量。轨道的 ref 比外层视口的先设上，
  // 视口到了再挂一次。
  useAttachment(options.track, (track) => {
    animator.attach(track)
    pageWidth = 0
    measure()
    animator.set({ x: positionToX(offsetOf(target)) })
    const viewport = options.viewport()
    const stopObserving = viewport != null ? observeResize(viewport, measure) : () => {}
    return () => {
      stopObserving()
      stopSettle()
      holdSelection(false)
      animator.attach(null)
    }
  }, options.viewport)

  // 受控的当前页变了：移过去。
  watch(options.index, (index) => {
    if (index !== target)
      goTo(index, options.isControlledChangeAnimated())
  })

  return {
    pan,
    isSettling: () => settleHandle != null,
    presentation,
    goTo,
  }
}
