import type { FrameClock, SpringMotion } from './snapPagingMotion.js'
import type { HeldRowListener, SnapPagingAttachment, SnapPagingOptions, SnapTarget } from './snapPagingValue.js'
import { browserClock, createVelocitySampler, nearestIndex, pickPage, springTo, viewPages } from './snapPagingMotion.js'
import { followSkippedStops } from './snapPagingSkip.js'
import { createSnapTrack } from './snapPagingTrack.js'

/** 手指移动超过这么多像素才算拖动；先往竖直方向走的交给页面滚动。 */
const DRAG_SLOP = 6
/** 触控板的横向滚动停了这么久，就当手指离开了触控板。 */
export const WHEEL_IDLE_MS = 120

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface Drag {
  readonly id: number
  x: number
  readonly y: number
  from: number
  isActive: boolean
}

/**
 * 把吸附分页挂到滚动行上。手指、触控笔和触控板横扫会接管这一行，停稳后交还；
 * 鼠标拖动和鼠标滚轮仍然是原生滚动。
 */
export function attachPaging(
  element: HTMLElement,
  options: () => SnapPagingOptions,
  onHeld?: HeldRowListener,
  clock: FrameClock = browserClock,
): SnapPagingAttachment {
  const track = createSnapTrack(element, onHeld)
  const skip = followSkippedStops(element, track)
  const sampler = createVelocitySampler()
  // 接管时量好的各页停点，和起手所在那一页的下标。
  let pages: number[] = [0]
  let anchor = 0
  // 朝末端为正时，屏幕上的横向位移要乘的符号。从右往左排版时是 -1。
  let sign = 1
  let motion: SpringMotion | null = null
  let drag: Drag | null = null
  let wheelTimer: ReturnType<typeof setTimeout> | null = null

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
    if (drag?.isActive || wheelTimer != null)
      return
    track.handBack(skip.takeDue())
  }

  function settleTo(target: number, velocity: number): void {
    motion?.stop()
    motion = null
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
    settleTo(pages[pickPage(pages, at, velocity, anchor)] ?? at, velocity)
  }

  function onPointerDown(event: PointerEvent): void {
    if (event.pointerType === 'mouse' || !event.isPrimary)
      return
    // 手指按住一段正在进行的翻页，就地接住它。
    const caught = motion != null
    if (caught)
      hold()
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, from: track.position(), isActive: caught }
    sampler.reset()
    if (caught)
      sampler.add(clock.now(), track.position())
  }

  function onPointerMove(event: PointerEvent): void {
    if (drag == null || event.pointerId !== drag.id)
      return
    if (!drag.isActive) {
      const dx = event.clientX - drag.x
      const dy = event.clientY - drag.y
      if (Math.abs(dx) < DRAG_SLOP && Math.abs(dy) < DRAG_SLOP)
        return
      if (Math.abs(dy) > Math.abs(dx) || track.travel() <= 1) {
        drag = null
        return
      }
      hold()
      drag.isActive = true
      drag.x = event.clientX
      drag.from = track.position()
      try {
        element.setPointerCapture(event.pointerId)
      }
      catch {}
    }
    event.preventDefault()
    track.place(drag.from - sign * (event.clientX - drag.x))
    sampler.add(clock.now(), track.position())
  }

  function endDrag(event: PointerEvent, velocity: (now: number) => number): void {
    if (drag == null || event.pointerId !== drag.id)
      return
    const wasActive = drag.isActive
    drag = null
    if (wasActive)
      release(velocity(clock.now()))
  }

  const onPointerUp = (event: PointerEvent): void => endDrag(event, now => sampler.velocity(now))
  const onPointerCancel = (event: PointerEvent): void => endDrag(event, () => 0)

  // 触控板横扫：跟着增量走，最多走到起手那一页的前后一页，停下后按速度翻页。
  // 鼠标滚轮只给竖直增量（或按行计），留给原生滚动。
  function onWheel(event: WheelEvent): void {
    if (event.defaultPrevented || event.deltaMode !== 0 || event.deltaX === 0 || Math.abs(event.deltaX) <= Math.abs(event.deltaY))
      return
    if (drag?.isActive) {
      event.preventDefault()
      return
    }
    if (wheelTimer == null) {
      if (!track.isHeld() && track.travel() <= 1)
        return
      hold()
      sampler.reset()
    }
    else {
      clearTimeout(wheelTimer)
    }
    event.preventDefault()
    const low = pages[anchor - 1] ?? pages[0] ?? 0
    const high = pages[anchor + 1] ?? pages[pages.length - 1] ?? 0
    track.place(Math.min(Math.max(track.position() + sign * event.deltaX, low), high))
    sampler.add(clock.now(), track.position())
    wheelTimer = setTimeout(() => {
      wheelTimer = null
      release(sampler.velocity(sampler.lastTime() ?? clock.now()))
    }, WHEEL_IDLE_MS)
  }

  function move(target: SnapTarget): void {
    // 手指在这一行上时，这一行归手指。
    if (drag?.isActive)
      return
    const velocity = motion?.velocity() ?? 0
    if (wheelTimer != null) {
      clearTimeout(wheelTimer)
      wheelTimer = null
    }
    hold()
    const end = track.travel()
    settleTo(Math.min(Math.max(target(track.position(), end), 0), end), velocity)
  }

  // 拖动期间横向的触摸由这里处理，竖直方向仍交给页面滚动。
  const ownTouchAction = element.style.getPropertyValue('touch-action')
  element.style.setProperty('touch-action', 'pan-y pinch-zoom')
  element.addEventListener('pointerdown', onPointerDown)
  element.addEventListener('pointermove', onPointerMove)
  element.addEventListener('pointerup', onPointerUp)
  element.addEventListener('pointercancel', onPointerCancel)
  element.addEventListener('wheel', onWheel, { passive: false })

  return {
    detach() {
      element.removeEventListener('pointerdown', onPointerDown)
      element.removeEventListener('pointermove', onPointerMove)
      element.removeEventListener('pointerup', onPointerUp)
      element.removeEventListener('pointercancel', onPointerCancel)
      element.removeEventListener('wheel', onWheel)
      if (ownTouchAction === '')
        element.style.removeProperty('touch-action')
      else
        element.style.setProperty('touch-action', ownTouchAction)
      if (wheelTimer != null)
        clearTimeout(wheelTimer)
      wheelTimer = null
      motion?.stop()
      motion = null
      drag = null
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
