/**
 * @file swipeDom.ts
 * @input 行根和 SwipeActionsLayer 渲染进去的面板（窗口 `[data-swipe-panel]` > 轨道 > 操作）
 * @output sidePanelOf、openWidthOf：读一侧面板；settleParts：落位时在合成器上移动的部件；
 *   subscribeOpenRowCloses：订阅让开着的行合上的输入；focusRowContent：面板在焦点底下合上时
 *   把焦点放回行的内容
 * @position useSwipeAction.ts 和 swipeDragModel.ts 的 DOM 辅助。
 */

import type { CompositorPart } from '../dragToSnapPoints/compositorSettle'
import type { SwipeLayout, SwipeSide } from './swipeRelease'
import { subscribeInput } from '../utils/inputStream'
import {
  confirmedOffset,
  confirmPoint,
  SWIPE_OPEN_PROPERTY,
  SWIPE_PIN_PROPERTY,
  SWIPE_SIGN_PROPERTY,
  SWIPE_SLIDE_PROPERTY,
} from './swipeRelease'

/** 一侧的面板：窗口（盖在行的静止盒子上）、轨道（跟着行走）和操作（最外侧在最后）。 */
export interface SidePanel {
  window: HTMLElement
  track: HTMLElement
  entries: HTMLElement[]
}

/** 行里一侧的面板；这一侧没有操作时返回 null。 */
export function sidePanelOf(root: HTMLElement, side: SwipeSide): SidePanel | null {
  const frame = root.querySelector<HTMLElement>(`:scope > [data-swipe-panel="${side}"]`)
  const track = frame?.firstElementChild
  if (frame == null || !(track instanceof HTMLElement))
    return null
  const entries = Array.from(track.children).filter((child): child is HTMLElement => child instanceof HTMLElement)
  return { window: frame, track, entries }
}

/** 操作的自然宽度之和（含最外侧）：行开多宽。 */
export function openWidthOf(panel: SidePanel | null): number {
  return panel?.entries.reduce((width, entry) => width + entry.offsetWidth, 0) ?? 0
}

/**
 * 行的各个移动部件，以及每个部件在某个位移下的偏移：根和轨道跟着位移走，窗口反着走（留在原位），
 * 操作在开宽之前贴着外缘、过了开宽跟着行走，最外侧的在确认点和确认偏移之间再滑到行边。
 * `layout` 是最近一次移动的那一侧，`confirmOf` 是确认进度。
 */
export function settleParts(
  root: HTMLElement,
  layout: SwipeLayout | null,
  confirmOf: (travel: number) => number,
): CompositorPart[] {
  const parts: CompositorPart[] = [{ element: root, offset: travel => travel }]
  for (const side of ['leading', 'trailing'] as const) {
    const panel = sidePanelOf(root, side)
    if (panel == null)
      continue
    // 这一侧的几何，带上它的 CSS 读的默认值。
    const read = (name: string, fallback: number): number => {
      const value = Number.parseFloat(panel.window.style.getPropertyValue(name))
      return Number.isNaN(value) ? fallback : value
    }
    const pin = read(SWIPE_PIN_PROPERTY, 0)
    const sign = read(SWIPE_SIGN_PROPERTY, 1)
    const open = read(SWIPE_OPEN_PROPERTY, 0)
    const slide = read(SWIPE_SLIDE_PROPERTY, 0)
    const entryX = (travel: number): number => pin - sign * Math.min(sign * travel, open)
    const confirmBends = layout == null || layout.side !== side
      ? []
      : [sign * confirmPoint(layout.openWidth, layout.rowWidth), sign * confirmedOffset(layout.rowWidth)]
    parts.push(
      { element: panel.window, offset: travel => -travel },
      { element: panel.track, offset: travel => travel },
    )
    panel.entries.forEach((entry, index) => {
      const isOuter = index === panel.entries.length - 1
      parts.push({
        element: entry,
        offset: isOuter ? travel => entryX(travel) + slide * confirmOf(travel) : entryX,
        bends: isOuter ? [sign * open, ...confirmBends] : [sign * open],
      })
    })
  }
  return parts
}

/**
 * 订阅开着的行的合上时机。指针落在行外任何地方都会合上它（拖邻居的行也就合上了它），
 * 所以同一时间只有一行停开，不用共享状态。任何带着它移动的滚动（列表、页面）也会合上它，
 * 就像 UIKit 的表格滚动时行会合上。从行本身开始的滚动不会在行外落指针。返回取消订阅。
 */
export function subscribeOpenRowCloses(
  root: HTMLElement,
  openSide: () => SwipeSide | undefined,
  close: (start?: 'next-frame') => void,
): () => void {
  const view = root.ownerDocument.defaultView
  if (view == null)
    return () => {}
  const onOutside = (event: PointerEvent): void => {
    if (event.target instanceof Node && !root.contains(event.target))
      close('next-frame')
  }
  const onScroll = (event: Event): void => {
    const { target } = event
    if (!(target === view.document || (target instanceof Element && target.contains(root))))
      return
    // 焦点在开着的面板里时，这次滚动可能是浏览器把聚焦的操作滚进视野（键盘或读屏），行留着。
    // 焦点在别处（包括行自己的内容）就合上。
    const side = openSide()
    const panel = side == null ? null : root.querySelector(`[data-swipe-panel="${side}"]`)
    if (panel?.contains(view.document.activeElement) !== true)
      close()
  }
  const stops = [
    subscribeInput(view, 'pointerdown', onOutside),
    subscribeInput(view, 'scroll', onScroll),
  ]
  return () => {
    for (const stop of stops)
      stop()
  }
}

/** 行里横滑面板之外第一个能聚焦的东西：停开的面板在焦点底下合上时，焦点落到它上面。 */
export function focusRowContent(root: HTMLElement): void {
  const candidates = root.querySelectorAll<HTMLElement>('button, a[href], input, [tabindex]:not([tabindex="-1"])')
  for (const element of candidates) {
    if (element.closest('[data-swipe-panel]') == null) {
      element.focus()
      return
    }
  }
  // 用行自己的文档和 realm，别的 frame 里的行也能用。
  const active = root.ownerDocument.activeElement
  const view = root.ownerDocument.defaultView
  if (view != null && active instanceof view.HTMLElement)
    active.blur()
}
