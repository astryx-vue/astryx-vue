import type { LayerGutter } from './gutter.js'
import { resolveLayerGutter } from './gutter.js'

export type LayerPlacement = 'above' | 'below' | 'start' | 'end'
export type LayerAlignment = 'start' | 'center' | 'end'

export interface LayerPosition {
  top: number
  left: number
  placement: LayerPlacement
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
  if (resolved === 'above' || resolved === 'below') {
    top = resolved === 'above' ? anchor.top - gap - layer.height : anchor.bottom + gap
    left = alignOnAxis(anchor.left, anchor.width, layer.width, alignment)
  }
  else {
    left = resolved === 'start' ? anchor.left - gap - layer.width : anchor.right + gap
    top = alignOnAxis(anchor.top, anchor.height, layer.height, alignment)
  }

  // 锚点完全位于视口之外时不做视口夹紧：浮层跟随锚点停留在其相对位置上，
  // 而不是被钉在视口边缘。锚点回到视口后再次计算即可正常显示。
  if (!isAnchorInViewport(anchor, viewport))
    return { top, left, placement: resolved }

  return {
    top: clamp(top, gutter.blockStart, viewport.height - layer.height - gutter.blockEnd),
    left: clamp(left, gutter.inlineStart, viewport.width - layer.width - gutter.inlineEnd),
    placement: resolved,
  }
}

function isAnchorInViewport(anchor: DOMRect, viewport: LayerBox): boolean {
  return anchor.right > 0
    && anchor.bottom > 0
    && anchor.left < viewport.width
    && anchor.top < viewport.height
}
