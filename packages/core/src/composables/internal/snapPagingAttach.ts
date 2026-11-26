import type { FrameClock, SpringMotion } from './snapPagingMotion.js'
import type { HeldRowListener, SnapPagingAttachment, SnapPagingOptions, SnapTarget } from './snapPagingValue.js'
import { getGestureHost } from '../../gestures/GestureHost'
import { PanGestureRecognizer } from '../../gestures/PanGestureRecognizer'
import { paging } from '../../motion/uikit/paging'
import { lockSelection, locksSelectionFor } from '../../utils/selectionLock'
import { SettleCatcher } from './snapPagingCatcher.js'
import { browserClock, nearestIndex, pickPage, springTo, viewPages } from './snapPagingMotion.js'
import { followSkippedStops } from './snapPagingSkip.js'
import { createSnapTrack } from './snapPagingTrack.js'

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * 把吸附分页挂到滚动行上。拖动走手势引擎：一个横向的拖动识别器接手指、触控笔和
 * 触控板横扫，过了 UIKit 的 10pt 起拖距离才接管这一行，松手速度由识别器的
 * VelocityTracker 给出；鼠标拖动和鼠标滚轮留给原生滚动。另有一个不认领触摸的
 * 「接住」识别器：翻页途中按上去就停住这一行。
 *
 * - 松手后的翻页：按下后这一行再走 `paging.catchStopMs` 才停住，和 UIKit 实测一致；
 *   手指或触控笔的这次触摸到不了下面的内容，鼠标保留它的点击。
 * - 按钮、方向键、`scrollTo` 这类程序发起的翻页：手指一碰就停住。鼠标仍然等那一段。
 * - 停住后不拖、直接抬起：停到最近的一页。停住之前就抬起：翻页照常走完。
 */
export function attachPaging(
  element: HTMLElement,
  options: () => SnapPagingOptions,
  onHeld?: HeldRowListener,
  clock: FrameClock = browserClock,
): SnapPagingAttachment {
  const track = createSnapTrack(element, onHeld)
  const skip = followSkippedStops(element, track)
  // 接管时量好的各页停点，和起手所在那一页的下标。
  let pages: number[] = [0]
  let anchor = 0
  // 朝末端为正时，屏幕上的横向位移要乘的符号。从右往左排版时是 -1。
  let sign = 1
  let motion: SpringMotion | null = null
  // 正在走的这段翻页是不是松手带出来的（而不是程序发起的）。
  let isReleaseSettle = false
  // 正在拖动时：起拖那一刻这一行的位置，以及这次拖动是不是触控板横扫。
  let drag: { from: number, isScroll: boolean } | null = null
  // 按下来、接住了一段翻页，还没抬起。
  let isCaught = false
  // 按下来了，接住的计时还没到。
  let isCatchArmed = false
  // 按住接住的这一行时，浏览器的长按选字和弹出菜单先关掉。
  let releaseSelection: (() => void) | null = null
  // 拆掉以后，识别器收尾时报来的状态一概不理。
  let isAttached = true

  function hold(): void {
    motion?.stop()
    motion = null
    track.takeOver()
    sign = getComputedStyle(element).direction === 'rtl' ? -1 : 1
    const at = track.position()
    const { stops } = track.pages()
    pages = (options().pages ?? 'view') === 'item'
      ? stops
      : viewPages(stops, nearestIndex(stops, at), track.viewWidth())
    anchor = nearestIndex(pages, at)
  }

  function finish(): void {
    if (drag != null || isCaught)
      return
    track.handBack(skip.takeDue())
  }

  function settleTo(target: number, velocity: number, fromRelease: boolean): void {
    motion?.stop()
    motion = null
    isReleaseSettle = fromRelease
    if (prefersReducedMotion()) {
      track.place(target)
      finish()
      return
    }
    motion = springTo(clock, track.position(), target, velocity, at => track.place(at), () => {
      motion = null
      finish()
    })
  }

  function release(velocity: number): void {
    const at = track.position()
    settleTo(pages[pickPage(pages, at, velocity, anchor)] ?? at, velocity, true)
  }

  const host = getGestureHost(element.ownerDocument)
  const pan = new PanGestureRecognizer({
    name: 'snapPaging',
    direction: 'horizontal',
    allowedPointerTypes: ['touch', 'pen'],
    // 触控板的横扫也是拖动；鼠标滚轮不是。
    allowedScrollTypes: ['continuous'],
    // 没有可滚的距离、也没被接住时，不接管。
    shouldBegin: () => track.isHeld() || track.travel() > 1,
  })

  // 零时长的长按，只在有翻页在走、手上没在拖时开始。
  const catcher = new SettleCatcher({
    name: 'snapPagingCatch',
    minimumPressDuration: 0,
    allowableMovement: Number.POSITIVE_INFINITY,
    // 它自己按住什么也不做，所以不锁选字：停着的一行上，原生长按照旧。接住时才锁。
    selectionLock: null,
    shouldBegin: () => motion != null && drag == null,
  })
  catcher.recognizeSimultaneouslyWith(pan)

  function holdSelection(on: boolean): void {
    if (on && releaseSelection == null && locksSelectionFor(catcher.pointerType ?? 'touch')) {
      releaseSelection = lockSelection([element], null)
    }
    else if (!on && releaseSelection != null) {
      releaseSelection()
      releaseSelection = null
    }
  }

  function clearCatchTimer(): void {
    if (isCatchArmed) {
      isCatchArmed = false
      catcher.disarmCatch()
    }
  }

  function catchSettle(): void {
    if (motion == null || drag != null)
      return
    hold()
    isCaught = true
  }

  pan.addListener(() => {
    if (!isAttached)
      return
    const state = pan.state
    if (state === 'began') {
      // 拖动一开始就接住，从屏幕上的位置起步。
      clearCatchTimer()
      hold()
      drag = { from: track.position(), isScroll: pan.trackedTouches[0]?.scrollType != null }
    }
    if (drag == null)
      return
    if (state === 'began' || state === 'changed') {
      let at = drag.from - sign * pan.translation().x
      if (drag.isScroll) {
        // 触控板横扫最多走到起手那一页的前后一页。
        const low = pages[anchor - 1] ?? pages[0] ?? 0
        const high = pages[anchor + 1] ?? pages[pages.length - 1] ?? 0
        at = Math.min(Math.max(at, low), high)
      }
      // 这次写入是识别器自己在滚这一行，不是浏览器接走了手指。
      host.ownScroll(element)
      track.place(at)
      return
    }
    if (state === 'ended' || state === 'cancelled') {
      drag = null
      isCaught = false
      release(state === 'ended' ? -sign * pan.velocity().x : 0)
    }
  })

  catcher.addListener(() => {
    if (!isAttached)
      return
    const state = catcher.state
    if (state === 'began') {
      holdSelection(true)
      const isMouse = catcher.pointerType === 'mouse'
      // 鼠标保留它的点击；手指或触控笔的这次触摸到不了内容。
      if (isReleaseSettle && !isMouse)
        catcher.takeFromContent()
      clearCatchTimer()
      isCaught = false
      if (!isReleaseSettle && !isMouse) {
        // UIKit 在触摸的那一刻就停住程序发起的 `setContentOffset` 动画。
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
    if (state === 'ended' || state === 'cancelled') {
      holdSelection(false)
      if (isCatchArmed) {
        // 还没接住就抬起：翻页照常走完。
        clearCatchTimer()
        return
      }
      const wasCaught = isCaught
      isCaught = false
      // 接住后不拖、直接抬起：停到最近的一页。
      if (wasCaught && drag == null && motion == null)
        release(0)
    }
  })

  const detachPan = host.attach(element, pan)
  const detachCatch = host.attach(element, catcher)

  function move(target: SnapTarget): void {
    // 手指在这一行上时，这一行归手指。触控板横扫则让给这次翻页，横扫余下的部分不再移动这一行。
    if (drag != null && !drag.isScroll)
      return
    drag = null
    const velocity = motion?.velocity() ?? 0
    hold()
    const end = track.travel()
    settleTo(Math.min(Math.max(target(track.position(), end), 0), end), velocity, false)
  }

  return {
    detach() {
      isAttached = false
      clearCatchTimer()
      holdSelection(false)
      detachCatch()
      detachPan()
      motion?.stop()
      motion = null
      drag = null
      isCaught = false
      track.handBack()
      skip.stop()
    },
    move,
    moveHeld(target) {
      if (!track.isHeld())
        return false
      move(target)
      return true
    },
  }
}
