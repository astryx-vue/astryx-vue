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

const VIEWPORT_MARGIN = 8

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
 */
export function computeLayerPosition(
  anchor: DOMRect,
  layer: LayerBox,
  viewport: LayerBox,
  placement: LayerPlacement,
  alignment: LayerAlignment,
  gap: number,
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

  return {
    top: clamp(top, VIEWPORT_MARGIN, viewport.height - layer.height - VIEWPORT_MARGIN),
    left: clamp(left, VIEWPORT_MARGIN, viewport.width - layer.width - VIEWPORT_MARGIN),
    placement: resolved,
  }
}
