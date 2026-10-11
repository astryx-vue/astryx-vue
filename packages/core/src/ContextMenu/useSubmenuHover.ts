import type { Ref } from 'vue'
import type { MenuPoint } from './safeTriangle.js'
import { onScopeDispose, unref } from 'vue'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import { isPointInSafeTriangle } from './safeTriangle.js'

/**
 * Hover intent for one submenu row.
 *
 * 对应原版 Astryx 的 `hooks/useMenuHover`，用在 `DropdownMenuSubMenu` 上的那一半：
 * 指针进入父项后等 `SUBMENU_SHOW_DELAY_MS` 再打开；离开父项或飞出层后等
 * `SUBMENU_HIDE_DELAY_MS` 再关掉 hover 打开的那一层；斜着移向飞出层时走安全三角。
 * 键盘或点击打开的飞出层是钉住的，指针离开空白处不会关。
 *
 * 移到同级项并不会在同一帧关掉上一个：离开父项后同样等这段关闭延迟，
 * 所以新的一层在 150ms 打开时，上一层还要再等大约 50ms 才关。
 * 斜着移向飞出层、指针还在安全三角里时，延迟会重新计时，飞出层保持打开。
 *
 * 任意一次关闭之后的 `SUBMENU_REOPEN_SUPPRESS_MS` 内，忽略落在原父项上的
 * pointerenter：飞出层消失后，静止的指针会重新命中父项，这个 enter 不能把它再打开。
 * 真正的 pointerleave 会提前清掉这扇窗。
 */

/** Delay before a hover opens the flyout. Upstream `showDelay`, 150ms. */
export const SUBMENU_SHOW_DELAY_MS = 150

/** Delay before leaving a hover-opened flyout closes it. Upstream `hideDelay`, 200ms. */
export const SUBMENU_HIDE_DELAY_MS = 200

/**
 * Window after a hover-open in which a click confirms the flyout instead of
 * closing it. Upstream `clickGuardMs`, 500ms.
 */
export const SUBMENU_CLICK_GUARD_MS = 500

/**
 * After any close, ignore a pointer enter on the row for this long.
 * Upstream reopen suppression, 300ms, not configurable.
 */
export const SUBMENU_REOPEN_SUPPRESS_MS = 300

export interface UseSubmenuHoverOptions {
  /** A disabled row never opens. */
  isEnabled: () => boolean
  isOpen: () => boolean
  flyout: Ref<HTMLElement | null>
  /** Hover opened the flyout. Do not move focus. */
  openFromHover: () => void
  /** A click or a synthesized activation opened the flyout. */
  openPinned: () => void
  /** Pointer dismissed the flyout. Do not move focus. */
  closeFromPointer: () => void
}

export interface SubmenuHover {
  onTriggerPointerEnter: (event: PointerEvent) => void
  onTriggerPointerLeave: (event: PointerEvent) => void
  onTriggerClick: (event: MouseEvent) => void
  onFlyoutPointerEnter: (event: PointerEvent) => void
  onFlyoutPointerLeave: (event: PointerEvent) => void
  /** A keyboard or click open pins the flyout. Pointer leave will not dismiss it. */
  notePinned: () => void
  /** The hover timer opened the flyout. */
  noteHoverOpened: () => void
  /** Something else closed the flyout. Pending timers go with it. */
  markClosed: () => void
  /** Drop a pending open or close, for example when the root menu closes. */
  cancel: () => void
  /** This flyout was opened by hover, so pointer leave — not focus — owns dismissal. */
  isHoverDriven: () => boolean
}

export function useSubmenuHover(options: UseSubmenuHoverOptions): SubmenuHover {
  const hasHover = useMediaQuery('(hover: hover)')

  let showTimer: ReturnType<typeof setTimeout> | undefined
  let hideTimer: ReturnType<typeof setTimeout> | undefined
  let stopTriangle: (() => void) | null = null
  /** Hover opened this flyout, so leaving may close it. */
  let provenance: 'hover' | 'pinned' | null = null
  let hoverOpenedAt = 0
  /** When the flyout last closed. A pointer enter inside the suppress window is ignored. */
  let closedAt = 0
  /** While true, a point inside `isInsideTriangle` is still heading for the flyout. */
  let isTracking = false
  let isInsideTriangle: (point: MenuPoint) => boolean = () => false

  function clearShowTimer(): void {
    if (showTimer != null)
      clearTimeout(showTimer)
    showTimer = undefined
  }

  function clearHideTimer(): void {
    if (hideTimer != null)
      clearTimeout(hideTimer)
    hideTimer = undefined
  }

  function clearTriangle(): void {
    stopTriangle?.()
    stopTriangle = null
    isTracking = false
    isInsideTriangle = () => false
  }

  function cancelTimers(): void {
    clearShowTimer()
    clearHideTimer()
    clearTriangle()
  }

  function markClosed(): void {
    const shouldStamp = options.isOpen() || provenance != null
    cancelTimers()
    provenance = null
    hoverOpenedAt = 0
    if (shouldStamp)
      closedAt = Date.now()
  }

  function closeNow(): void {
    cancelTimers()
    provenance = null
    hoverOpenedAt = 0
    if (options.isOpen())
      options.closeFromPointer()
  }

  function notePinned(): void {
    cancelTimers()
    provenance = 'pinned'
    hoverOpenedAt = 0
    closedAt = 0
  }

  function noteHoverOpened(): void {
    provenance = 'hover'
    hoverOpenedAt = Date.now()
    closedAt = 0
  }

  function scheduleHide(event?: { clientX: number, clientY: number }): void {
    if (provenance !== 'hover')
      return

    clearHideTimer()
    clearTriangle()

    let lastPoint: MenuPoint | null = null
    const arm = (): void => {
      clearHideTimer()
      hideTimer = setTimeout(() => {
        // A pointer that stopped inside the triangle is still heading for the
        // flyout. Pausing is not leaving; re-arm instead of closing under it.
        if (isTracking && lastPoint != null && isInsideTriangle(lastPoint)) {
          arm()
          return
        }
        closeNow()
      }, SUBMENU_HIDE_DELAY_MS)
    }
    arm()

    const menu = unref(options.flyout)
    const apex: MenuPoint | null = event != null ? { x: event.clientX, y: event.clientY } : null
    if (menu == null || apex == null || !options.isOpen())
      return

    const rect = menu.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0)
      return

    const doc = menu.ownerDocument
    isInsideTriangle = point => isPointInSafeTriangle(point, apex, rect)
    isTracking = true
    lastPoint = apex

    const onPointerMove = (move: PointerEvent): void => {
      const point = { x: move.clientX, y: move.clientY }
      lastPoint = point
      if (isInsideTriangle(point)) {
        arm()
        return
      }
      // The first move outside lets the delay already running finish.
      isTracking = false
      clearTriangle()
    }
    doc.addEventListener('pointermove', onPointerMove, true)
    stopTriangle = () => {
      doc.removeEventListener('pointermove', onPointerMove, true)
    }
  }

  function onTriggerPointerEnter(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || !hasHover.value)
      return

    // Re-entering the open row abandons a pending close and does not re-arm
    // the click guard or turn a pinned flyout back into a hover one.
    if (options.isOpen()) {
      clearHideTimer()
      clearTriangle()
      return
    }

    if (
      closedAt > 0
      && Date.now() - closedAt < SUBMENU_REOPEN_SUPPRESS_MS
    ) {
      return
    }

    clearShowTimer()

    if (!options.isEnabled())
      return

    showTimer = setTimeout(() => {
      showTimer = undefined
      if (!options.isEnabled() || options.isOpen())
        return
      options.openFromHover()
    }, SUBMENU_SHOW_DELAY_MS)
  }

  function onTriggerPointerLeave(event: PointerEvent): void {
    if (event.pointerType !== 'mouse')
      return
    // A real leave ends the stationary-pointer case the suppression window
    // exists for, so the next enter is deliberate whenever it arrives.
    closedAt = 0
    clearShowTimer()
    scheduleHide(event)
  }

  function onFlyoutPointerEnter(event: PointerEvent): void {
    if (event.pointerType !== 'mouse')
      return
    // Arriving on the flyout is the end of the trip the delay and the
    // triangle were protecting.
    clearShowTimer()
    clearHideTimer()
    clearTriangle()
  }

  function onFlyoutPointerLeave(event: PointerEvent): void {
    if (event.pointerType !== 'mouse')
      return
    closedAt = 0
    scheduleHide(event)
  }

  function onTriggerClick(event: MouseEvent): void {
    if (!options.isEnabled())
      return

    // detail 0 is a keyboard or assistive activation, or the press model's
    // own dispatch. It opens and never toggles shut.
    if (event.detail === 0) {
      if (!options.isOpen())
        options.openPinned()
      return
    }

    cancelTimers()
    if (!options.isOpen()) {
      options.openPinned()
      return
    }

    const isConfirming = provenance === 'hover'
      && hoverOpenedAt > 0
      && Date.now() - hoverOpenedAt < SUBMENU_CLICK_GUARD_MS
    if (isConfirming) {
      provenance = 'pinned'
      hoverOpenedAt = 0
      return
    }

    options.closeFromPointer()
  }

  onScopeDispose(cancelTimers)

  return {
    cancel: cancelTimers,
    isHoverDriven: () => provenance === 'hover',
    markClosed,
    noteHoverOpened,
    notePinned,
    onFlyoutPointerEnter,
    onFlyoutPointerLeave,
    onTriggerClick,
    onTriggerPointerEnter,
    onTriggerPointerLeave,
  }
}
