/**
 * ChatVirtualizer 的几何纯函数：每行的起点、按位置找行、算要挂载的区间、
 * 参照系和 scrollTop 之间的换算。不碰 DOM。
 */
import type { AnchorMode, RowGeometry, RowWindow, ScrollMode } from './chatVirtualizerTypes.js'

export const EMPTY_WINDOW: RowWindow = { start: 0, end: -1 }

/** 按身份顺序和每行高度（量过的或估的）算出几何。 */
export function buildGeometry(keys: readonly string[], sizeOf: (key: string, index: number) => number): RowGeometry {
  const offsets = Array.from<number>({ length: keys.length })
  const index = new Map<string, number>()
  let y = 0
  for (let i = 0; i < keys.length; i++) {
    index.set(keys[i], i)
    offsets[i] = y
    y += sizeOf(keys[i], i)
  }
  return { offsets, total: y, keys: [...keys], index }
}

/** 起点不超过 `y` 的最后一行。 */
export function indexAt(geo: RowGeometry, y: number): number {
  const { offsets } = geo
  let lo = 0
  let hi = offsets.length - 1
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (offsets[mid] <= y)
      lo = mid
    else
      hi = mid - 1
  }
  return lo
}

/** 某一行之后紧挨着的位置。 */
export function offsetAfter(geo: RowGeometry, i: number): number {
  return i + 1 < geo.offsets.length ? geo.offsets[i + 1] : geo.total
}

export interface WindowQuery {
  /** 视口顶边对应的 scrollTop。 */
  top: number
  clientHeight: number
  /** 内容起点在画面上的 scrollTop 偏移。 */
  origin: number
  overscanTop: number
  overscanBottom: number
}

/** 覆盖视口加上下余量的行区间。 */
export function computeWindow(geo: RowGeometry, query: WindowQuery): RowWindow {
  if (geo.keys.length === 0)
    return EMPTY_WINDOW
  const top = query.top - query.origin
  const start = indexAt(geo, Math.max(0, top - query.overscanTop))
  const bottomEdge = top + query.clientHeight + query.overscanBottom
  // 查到内容末尾以外时直接带上最后一行：高度为 0 的最后一行起点正好等于 total，二分永远选不到它。
  const end = bottomEdge >= geo.total ? geo.keys.length - 1 : indexAt(geo, bottomEdge)
  return { start, end }
}

/** 某个 scrollTop 处视口顶边所在的行，作为参照系。 */
export function anchorAt(geo: RowGeometry, scrollTop: number, origin: number): AnchorMode {
  const y = scrollTop - origin
  const idx = indexAt(geo, y)
  return { kind: 'anchor', key: geo.keys[idx], viewportOffset: geo.offsets[idx] - y }
}

export interface TargetQuery {
  clientHeight: number
  origin: number
  /** 调用方在列表下方放的内容高度（例如浮在底部的输入框占的溢出）。 */
  below: number
}

/** 参照系在当前几何下对应的 scrollTop，夹在可滚动范围内。盯住的行已不在数据里时返回 null。 */
export function targetFor(geo: RowGeometry, mode: ScrollMode, query: TargetQuery): number | null {
  const { origin, below, clientHeight } = query
  const max = origin + geo.total + below - clientHeight
  let raw: number
  if (mode.kind === 'end') {
    raw = max - mode.distance
  }
  else {
    const idx = geo.index.get(mode.key)
    if (idx === undefined)
      return null
    raw = origin + geo.offsets[idx] - mode.viewportOffset
  }
  return Math.max(0, Math.min(raw, max))
}
