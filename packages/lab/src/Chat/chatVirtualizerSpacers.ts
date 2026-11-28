/**
 * 把占位空白写到 DOM 上：上下两个 spacer 让挂着的行处在滚动范围里的真实位置，
 * 焦点行和尾部新到的行与窗口之间各有一段 gap。内容块的 min-height 是滚动范围的下限，
 * 只在这里写，行被移除到下一轮重算之间范围不会塌，浏览器也就没有东西可以夹 scrollTop。
 */
import type { RowGeometry, RowWindow } from './chatVirtualizerTypes.js'
import { offsetAfter } from './chatVirtualizerGeometry.js'

export interface SpacerElements {
  content: HTMLElement | null
  top: HTMLElement | null
  bottom: HTMLElement | null
  gapTop: HTMLElement | null
  gapBottom: HTMLElement | null
  gapTail: HTMLElement | null
}

export interface SpacerLayout {
  geo: RowGeometry
  win: RowWindow
  pinnedKey: string | null
  tailKey: string | null
  /** 手指滚动期间由顶部 spacer 吸收的位置修正（其余时候为 0）。 */
  gestureAdj: number
}

function write(el: HTMLElement | null, prop: 'height' | 'minHeight', px: number): void {
  if (el)
    el.style[prop] = `${px}px`
}

export function writeSpacers(els: SpacerElements, layout: SpacerLayout): void {
  const { geo: g, win: w } = layout
  const empty = w.end < w.start || g.offsets.length === 0
  const pinned = empty || layout.pinnedKey === null ? undefined : g.index.get(layout.pinnedKey)
  const pinnedAbove = pinned !== undefined && pinned < w.start
  const pinnedBelow = pinned !== undefined && pinned > w.end
  const tailIndex = empty || layout.tailKey === null ? undefined : g.index.get(layout.tailKey)
  const tail = tailIndex !== undefined && tailIndex > w.end ? tailIndex : undefined
  const first = pinnedAbove ? pinned : w.start
  const last = tail !== undefined ? g.keys.length - 1 : pinnedBelow ? pinned : w.end
  // 在列表最顶上没有空白可吸收，夹到 0。
  const top = empty ? 0 : Math.max(0, g.offsets[first] + layout.gestureAdj)
  const belowEnd = empty ? 0 : offsetAfter(g, last)
  write(els.top, 'height', top)
  write(els.gapTop, 'height', pinnedAbove ? Math.max(0, g.offsets[w.start] - offsetAfter(g, pinned)) : 0)
  write(
    els.gapBottom,
    'height',
    pinnedBelow
      ? Math.max(0, g.offsets[pinned] - offsetAfter(g, w.end))
      : tail !== undefined ? Math.max(0, g.offsets[tail] - offsetAfter(g, w.end)) : 0,
  )
  write(els.gapTail, 'height', pinnedBelow && tail !== undefined ? Math.max(0, g.offsets[tail] - offsetAfter(g, pinned)) : 0)
  write(els.bottom, 'height', Math.max(0, g.total - belowEnd))
  write(els.content, 'minHeight', empty ? g.total : g.total + top - g.offsets[first])
}
