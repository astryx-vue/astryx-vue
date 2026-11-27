import type { LayerGutter } from './gutter.js'
import { resolveLayerGutter } from './gutter.js'

export type LayerPlacement = 'above' | 'below' | 'start' | 'end'
export type LayerAlignment = 'start' | 'center' | 'end'

export interface LayerPosition {
  top: number
  left: number
  placement: LayerPlacement
  /** 内容比可用空地高时的高度上限，超出的部分在浮层里滚动。 */
  maxHeight?: number
  /** 盖在锚点原位上的浮层要撑到的最小宽度。 */
  minWidth?: number
}

export interface LayerBox {
  width: number
  height: number
}

function alignOnAxis(start: number, size: number, own: number, alignment: LayerAlignment): number {
  if (alignment === 'start')
    return start
  if (alignment === 'end')
    return start + size - own
  return start + (size - own) / 2
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}

/**
 * 计算浮层相对锚点的位置。空间不足时翻转到相反方向，最终位置保持在视口内。
 * `gutter` 是浮层离视口每条边的最小空隙，不传就按基础空隙加设备安全区算。
 */
export function computeLayerPosition(
  anchor: DOMRect,
  layer: LayerBox,
  viewport: LayerBox,
  placement: LayerPlacement,
  alignment: LayerAlignment,
  gap: number,
  gutter: LayerGutter = resolveLayerGutter(),
): LayerPosition {
  let resolved = placement
  if (resolved === 'above' && anchor.top - gap - layer.height < 0)
    resolved = 'below'
  else if (resolved === 'below' && anchor.bottom + gap + layer.height > viewport.height)
    resolved = 'above'
  else if (resolved === 'start' && anchor.left - gap - layer.width < 0)
    resolved = 'end'
  else if (resolved === 'end' && anchor.right + gap + layer.width > viewport.width)
    resolved = 'start'

  let top: number
  let left: number
  let alignedTo = alignment
  if (resolved === 'above' || resolved === 'below') {
    // 原版靠 position-try 的 flip-inline：start 对齐的浮层右边越界就改成 end 对齐（反之亦然），
    // 前提是翻过去能放下；放不下才由下面的夹紧兜底。
    if (alignment === 'start' && anchor.left + layer.width > viewport.width - gutter.inlineEnd
      && anchor.right - layer.width >= gutter.inlineStart) {
      alignedTo = 'end'
    }
    else if (alignment === 'end' && anchor.right - layer.width < gutter.inlineStart
      && anchor.left >= gutter.inlineStart
      && anchor.left + layer.width <= viewport.width - gutter.inlineEnd) {
      alignedTo = 'start'
    }
  }
  if (resolved === 'above' || resolved === 'below') {
    top = resolved === 'above' ? anchor.top - gap - layer.height : anchor.bottom + gap
    left = alignOnAxis(anchor.left, anchor.width, layer.width, alignedTo)
  }
  else {
    left = resolved === 'start' ? anchor.left - gap - layer.width : anchor.right + gap
    top = alignOnAxis(anchor.top, anchor.height, layer.height, alignment)
  }

  // 锚点完全位于视口之外时不做视口夹紧：浮层跟随锚点停留在其相对位置上，
  // 而不是被钉在视口边缘。锚点回到视口后再次计算即可正常显示。
  if (!isAnchorInViewport(anchor, viewport))
    return { top, left, placement: resolved }

  // 和原版一致：空隙只落在浮层「可能越界的那一侧」。
  // - 放置轴（above/below/start/end）：贴锚点的一侧由间距负责，空隙只留在远离锚点的视口边。
  // - 对齐轴：start 对齐只留结束边，end 对齐只留起始边，居中两边都留。
  // 所以 start 对齐的菜单可以和触发器同起点，即使触发器离视口边只有 8px。
  const horizontalPlacement = resolved === 'above' || resolved === 'below'
  const minTop = horizontalPlacement
    ? (resolved === 'below' ? 0 : gutter.blockStart)
    : (alignment === 'start' ? 0 : gutter.blockStart)
  const minLeft = horizontalPlacement
    ? (alignedTo === 'start' ? 0 : gutter.inlineStart)
    : (resolved === 'end' ? 0 : gutter.inlineStart)
  const maxTop = viewport.height - layer.height - (
    horizontalPlacement ? (resolved === 'above' ? 0 : gutter.blockEnd) : (alignment === 'end' ? 0 : gutter.blockEnd)
  )
  const maxLeft = viewport.width - layer.width - (
    horizontalPlacement ? (alignedTo === 'end' ? 0 : gutter.inlineEnd) : (resolved === 'start' ? 0 : gutter.inlineEnd)
  )
  return {
    top: clamp(top, minTop, maxTop),
    left: clamp(left, minLeft, maxLeft),
    placement: resolved,
  }
}

function isAnchorInViewport(anchor: DOMRect, viewport: LayerBox): boolean {
  return anchor.right > 0
    && anchor.bottom > 0
    && anchor.left < viewport.width
    && anchor.top < viewport.height
}

/** 盖在锚点原位上的浮层，比锚点向左、向上各多出的距离。 */
export const OVERLAP_OUTSET = 8

/**
 * 让浮层盖在锚点原位上：浮层左上角比锚点左上角各外扩 `OVERLAP_OUTSET`，
 * 宽度至少比锚点宽两倍外扩距离。浮层里第一行内容离浮层边缘也是这个距离时，
 * 正好落在锚点内容原来的位置上。最终位置保持在视口内。
 */
export function computeOverlapPosition(
  anchor: DOMRect,
  layer: LayerBox,
  viewport: LayerBox,
  gutter: LayerGutter = resolveLayerGutter(),
): LayerPosition {
  const minWidth = anchor.width + OVERLAP_OUTSET * 2
  const width = Math.max(layer.width, minWidth)
  const top = anchor.top - OVERLAP_OUTSET
  const left = anchor.left - OVERLAP_OUTSET
  if (!isAnchorInViewport(anchor, viewport))
    return { top, left, placement: 'below', minWidth }
  return {
    top: clamp(top, 0, viewport.height - layer.height - gutter.blockEnd),
    left: clamp(left, 0, viewport.width - width - gutter.inlineEnd),
    placement: 'below',
    minWidth,
  }
}
