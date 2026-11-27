/**
 * @file regionMotion.ts
 * @input `useResizable` 一个区域的状态读写（`RegionMotionHost`）、LayoutPanel 交来的面板
 * @output `createRegionMotion`：区域的拖动手势（起、移、松手、取消），以及收起展开时的面板滑动
 * @position Resizable 内部，useResizable 的单个区域持有一个
 *
 * - 收起和展开（按钮、受控的 isCollapsed、双击、方向键、Enter）都让 LayoutPanel 从朝向
 *   ResizeHandle 的那条边滑开滑合；指针拖动重新打开面板时跟手，不滑。
 * - 拉过上下限时有橡皮筋：面板尺寸停在限位上，分隔条在合成器上最多画出约 8px，
 *   松手后按 settle 弹簧从松手速度弹回。只有 LayoutPanel 渲染的面板、指针拖动时才有。
 * - 拖动途中不收起：松手时手指在收起阈值以下，或甩得够快、预计停在阈值以下，才收起，
 *   收起的滑动同样按 settle 弹簧从松手速度走。方向键的一步走到阈值以下，按 `collapse()` 收起。
 * - 手指按住还在滑合的面板：超过最小值就在那里打开；不到最小值时滑动暂停，跟着手指走。
 */
import type { OvershootDrawing } from './overshootDrawing.js'
import type { RegionPaneSlot, ResizablePane } from './resizablePane.js'
import { project } from '../motion/projection.js'
import { resolveMotion } from '../motion/resolveMotion.js'
import { rubberBand, rubberBandInverse, rubberBandSlope } from '../motion/rubberBand.js'
import { springs } from '../motion/uikit/springs.js'
import { createOvershootDrawing } from './overshootDrawing.js'
import {
  createPaneReveal,
  createRegionPaneSlot,
  isScriptMotion,
  shownSizeReader,
  slideMotionsOf,
  slideNextOnRelease,
} from './resizablePane.js'

/** 拉过限位时分隔条最多画出的距离。 */
export const RUBBER_BAND_TRAVEL_PX = 8

export interface RegionMotionHost {
  isCollapsed: () => boolean
  /** 展开时的尺寸。 */
  size: () => number
  /** 这次手势固定下来的上下限。 */
  limits: () => { min: number, max: number }
  collapsible: boolean
  collapsedSize: number
  /** 面板旁边的 ResizeHandle。 */
  handleOf: (pane: ResizablePane) => HTMLElement | null
  /** 拖到 `raw`：按上下限和吸附点夹住后展开显示，并通知调用方。 */
  paint: (raw: number, useSnaps: boolean) => number
  /** 收起；展开时恢复到 `restore`（为 null 时保持原来的展开尺寸）。 */
  close: (restore: number | null) => void
  /** 手势结束：保存尺寸、重新分配空间。 */
  endGesture: () => void
}

interface ClosingSlide {
  fromSize: number
  startedAt: number
  remaining: (elapsedMs: number) => number
  readShown: (() => number) | null
}

export interface RegionMotion {
  readonly slot: RegionPaneSlot
  start: () => void
  move: (delta: number) => void
  end: (velocity?: number) => void
  cancel: () => void
  /** 区域状态刚变：是否收起前后、尺寸是否变了。 */
  noteChange: (wasCollapsed: boolean, isCollapsed: boolean) => void
  dispose: () => void
}

function reducesMotion(element: Element | undefined): boolean {
  return element?.ownerDocument.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

export function createRegionMotion(host: RegionMotionHost): RegionMotion {
  let pane: ResizablePane | null = null
  let drawing: OvershootDrawing | null = null
  const paneReveal = createPaneReveal(() => pane?.element.parentElement ?? null)
  // `pendingFlip`：区域刚做出、面板还没渲染的收起或展开。
  let pendingFlip: { toCollapsed: boolean, isPlayable: boolean } | null = null
  let isPointerReopening = false
  let isPointerGesture = false
  let limits = { min: 0, max: Number.POSITIVE_INFINITY }
  let dragStartSize = 0
  let pointerSize = 0
  let sizeBeforeDrag: number | null = null
  let overshoot = 0
  // 手指接住画出来的越界时，在这段越界以内分隔条 1:1 跟手。
  let caught = 0
  let isDrawingHeldForSlide = false
  let isSpringingBack = false
  let closingSlide: ClosingSlide | null = null
  let held: { slide: ClosingSlide, motions: Animation[], durationMs: number, shutSize: number } | null = null

  const slot = createRegionPaneSlot((next) => {
    paneReveal.land()
    pendingFlip = null
    isDrawingHeldForSlide = false
    drawing?.clear()
    pane = next
    drawing = next == null ? null : createOvershootDrawing(next, () => host.handleOf(next))
  })

  slot.listen({
    beforeChange(toCollapsed) {
      if (pane == null)
        return
      if (pendingFlip?.toCollapsed === toCollapsed) {
        const { isPlayable } = pendingFlip
        pendingFlip = null
        if (isPlayable)
          paneReveal.measure(pane)
        else
          paneReveal.land()
      }
      dropHeldDrawing()
    },
    committed() {
      // 滑动在变化后量分隔条时，不带上画出来的越界。
      dropHeldDrawing()
      if (pane != null)
        paneReveal.committed(pane)
    },
  })

  function dropHeldDrawing(): void {
    if (isDrawingHeldForSlide) {
      isDrawingHeldForSlide = false
      drawing?.clear()
    }
  }

  function overshootPast(raw: number): number {
    const { min, max } = limits
    if (raw >= min && raw <= max) {
      caught = 0
      return 0
    }
    const bound = raw > max ? max : min
    const excess = raw - bound
    const kept = Math.sign(caught) === Math.sign(excess) ? caught : 0
    // 橡皮筋从接住的那段之后接着拉，用剩下的行程。
    const shown = Math.abs(excess) <= Math.abs(kept)
      ? excess
      : kept + rubberBand(excess - kept, Math.max(RUBBER_BAND_TRAVEL_PX - Math.abs(kept), 0))
    // 在最小值以下，画出来的分隔条停在 0，不越过。
    return Math.max(bound + shown, 0) - bound
  }

  function paintAt(raw: number, reopens: boolean, useSnaps = true): void {
    isPointerReopening = reopens
    try {
      host.paint(raw, useSnaps)
    }
    finally {
      isPointerReopening = false
    }
  }

  function settleOvershoot(velocity: number): void {
    const from = overshoot
    isSpringingBack = false
    overshoot = 0
    if (from === 0 || drawing == null || pane == null) {
      drawing?.clear()
      return
    }
    if (reducesMotion(pane.element)) {
      drawing.clear()
      return
    }
    // 画出来的分隔条以指针速度乘橡皮筋斜率在动。
    const slope = rubberBandSlope(rubberBandInverse(from, RUBBER_BAND_TRAVEL_PX), RUBBER_BAND_TRAVEL_PX)
    isSpringingBack = drawing.springBack(resolveMotion(pane.element, springs.settle), velocity * slope)
  }

  function closingShown(): number {
    const element = pane?.element
    const view = element?.ownerDocument.defaultView
    if (closingSlide == null || element == null || view == null)
      return 0
    // 面板自己的滑动告诉我们走到哪了；按住的滑动保留时间，落地的读到终点之后。
    const elapsed = typeof element.getAnimations === 'function'
      ? Number(element.getAnimations().find(motion =>
          (motion.playState === 'running' || motion.playState === 'paused') && isScriptMotion(motion))?.currentTime ?? Number.POSITIVE_INFINITY)
      : view.performance.now() - closingSlide.startedAt
    const share = closingSlide.remaining(elapsed)
    if (!(share > 0))
      return 0
    return closingSlide.readShown?.() ?? closingSlide.fromSize * share
  }

  function reopenAt(size: number): void {
    sizeBeforeDrag = Math.min(limits.max, Math.max(limits.min, size))
    caught = 0
    overshoot = pane == null ? 0 : overshootPast(size)
    drawing?.draw(overshoot)
    paintAt(size, true, false)
  }

  function catchClosing(shownSize: number, slide: ClosingSlide): void {
    dragStartSize = shownSize
    pointerSize = shownSize
    if (shownSize >= limits.min) {
      reopenAt(shownSize)
      return
    }
    const motions = pane == null ? [] : slideMotionsOf(pane)
    for (const motion of motions)
      motion.pause()
    const elapsed = Number(motions[0]?.currentTime ?? 0)
    const share = slide.remaining(Number.isFinite(elapsed) ? elapsed : 0)
    // 显示的尺寸跟着还没走完的比例变：从松手时排版的尺寸走到合上时的尺寸。
    const shutSize = share < 0.98 ? (shownSize - slide.fromSize * share) / (1 - share) : 0
    held = { slide, motions, durationMs: Number(motions[0]?.effect?.getComputedTiming().duration ?? 0), shutSize }
  }

  function holdAt(size: number): void {
    if (held == null)
      return
    const { slide, motions, durationMs, shutSize } = held
    const span = slide.fromSize - shutSize
    const share = span > 0 ? Math.min(1, Math.max(0, (size - shutSize) / span)) : 0
    let low = 0
    let high = durationMs
    while (high - low > 0.05) {
      const mid = (low + high) / 2
      if (slide.remaining(mid) > share)
        low = mid
      else
        high = mid
    }
    for (const motion of motions)
      motion.currentTime = (low + high) / 2
  }

  function letGoOfHeldSlide(velocity: number): void {
    const current = held
    held = null
    if (current == null)
      return
    if (Math.min(pointerSize, project(pointerSize, velocity)) < host.collapsedSize) {
      for (const motion of current.motions)
        motion.play()
      const view = pane?.element.ownerDocument.defaultView
      const elapsed = Number(current.motions[0]?.currentTime ?? 0)
      if (view != null && Number.isFinite(elapsed))
        closingSlide = { ...current.slide, startedAt: view.performance.now() - elapsed }
      return
    }
    const row = pane?.element.parentElement
    if (row != null)
      slideNextOnRelease(row, velocity, Math.max(limits.min - pointerSize, 1))
    // 打开照常滑动：暂停的那段从它显示的位置反向走。
    host.paint(limits.min, false)
  }

  function closeOnRelease(velocity: number): void {
    isSpringingBack = false
    const drawnAtLift = overshoot
    const shown = host.size() + overshoot
    // 在边还停在松手位置时量。
    const readShown = pane == null ? null : shownSizeReader(pane, host.handleOf(pane), shown)
    overshoot = 0
    isDrawingHeldForSlide = drawing != null
    const row = pane?.element.parentElement
    const remaining = row == null ? null : slideNextOnRelease(row, -velocity, shown)
    const view = pane?.element.ownerDocument.defaultView
    // 减少动态效果时面板立刻合上，没有可接住的滑动。
    closingSlide = remaining == null || view == null || reducesMotion(pane?.element)
      ? null
      : { fromSize: shown, startedAt: view.performance.now(), remaining, readShown }
    host.close(sizeBeforeDrag)
    // 受控的 isCollapsed 保持展开时没有滑动来量画出的越界：下一帧从画到的位置弹回。
    if (isDrawingHeldForSlide) {
      const springBackIfKept = (): void => {
        if (!isDrawingHeldForSlide)
          return
        isDrawingHeldForSlide = false
        overshoot = drawnAtLift
        settleOvershoot(velocity)
      }
      if (typeof view?.requestAnimationFrame === 'function')
        view.requestAnimationFrame(springBackIfKept)
      else
        setTimeout(springBackIfKept, 16)
    }
  }

  return {
    slot,
    start() {
      dropHeldDrawing()
      limits = host.limits()
      // 只有指针能接住滑动或弹回；方向键是一步一步走。
      const isPointer = slot.isPointerDragging()
      isPointerGesture = isPointer
      const closing = host.isCollapsed() && isPointer ? closingShown() : 0
      const slide = closingSlide
      closingSlide = null
      if (closing > 0 && slide != null) {
        catchClosing(closing, slide)
        return
      }
      const shown = !isPointer ? 0 : isSpringingBack ? (drawing?.shown() ?? 0) : overshoot
      isSpringingBack = false
      overshoot = shown
      caught = shown
      drawing?.draw(shown)
      dragStartSize = (host.isCollapsed() ? 0 : host.size()) + shown
      pointerSize = dragStartSize
      sizeBeforeDrag = host.isCollapsed() ? null : host.size()
    },
    move(delta) {
      const raw = dragStartSize + delta
      pointerSize = raw
      if (held != null) {
        if (raw < limits.min) {
          holdAt(raw)
          return
        }
        held = null
        reopenAt(raw)
        return
      }
      // 收起的面板等指针越过收起尺寸才打开；展开的面板拖动途中从不收起，交给松手决定。
      if (host.isCollapsed() && raw < host.collapsedSize)
        return
      const reopens = host.isCollapsed()
      const isPointer = slot.isPointerDragging()
      // 只有指针拖 LayoutPanel 借来的面板才有橡皮筋；只用 size 撑开的面板和方向键停在限位上。
      overshoot = pane == null || !isPointer ? 0 : overshootPast(raw)
      drawing?.draw(overshoot)
      paintAt(raw, reopens && isPointer)
    },
    end(velocity = 0) {
      if (held != null) {
        letGoOfHeldSlide(velocity)
        host.endGesture()
        return
      }
      const closes = host.collapsible
        && !host.isCollapsed()
        && Math.min(pointerSize, project(pointerSize, velocity)) < host.collapsedSize
      if (closes && !isPointerGesture)
        host.close(sizeBeforeDrag)
      else if (closes)
        closeOnRelease(velocity)
      else
        settleOvershoot(velocity)
      host.endGesture()
    },
    cancel() {
      if (held != null)
        letGoOfHeldSlide(Number.NEGATIVE_INFINITY)
      else
        settleOvershoot(0)
      host.endGesture()
    },
    noteChange(wasCollapsed, isCollapsed) {
      if (wasCollapsed !== isCollapsed) {
        pendingFlip = { toCollapsed: isCollapsed, isPlayable: !isPointerReopening }
        // 指针接管面板的边：正在播的合上立刻落地。
        if (isPointerReopening)
          paneReveal.land()
        return
      }
      // 既不收起也不展开的尺寸变化，让正在播的滑动落地。
      paneReveal.land()
    },
    dispose() {
      paneReveal.land()
      drawing?.clear()
    },
  }
}
