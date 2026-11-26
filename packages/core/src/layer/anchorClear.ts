import type { LayerGutter } from './gutter.js'
import type { LayerBox, LayerPosition } from './position.js'

function overlapsAnchor(anchor: DOMRect, top: number, left: number, layer: LayerBox): boolean {
  return left < anchor.right
    && left + layer.width > anchor.left
    && top < anchor.bottom
    && top + layer.height > anchor.top
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}

/**
 * 浮层比触发器四周的空地都高时，普通落点会被夹进视口，盖在触发器上。
 * 要「不盖住触发器」的浮层（Tooltip）改按这个顺序找落点：
 * 1. 触发器的右侧、再是左侧，宽度不变，纵向夹进视口；
 * 2. 触发器上下两侧里空地更大的一侧，高度限制在那块空地里，超出的内容在浮层里滚动。
 *
 * `placed` 没盖住触发器时原样返回，装得下的浮层不受影响。
 */
export function keepClearOfAnchor(
  placed: LayerPosition,
  anchor: DOMRect,
  layer: LayerBox,
  viewport: LayerBox,
  gap: number,
  gutter: LayerGutter,
): LayerPosition {
  if (!overlapsAnchor(anchor, placed.top, placed.left, layer))
    return placed

  const minTop = gutter.blockStart
  const maxTop = Math.max(minTop, viewport.height - layer.height - gutter.blockEnd)
  const sideTop = clamp(anchor.top + (anchor.height - layer.height) / 2, minTop, maxTop)
  const rightLeft = anchor.right + gap
  const leftLeft = anchor.left - gap - layer.width
  const canBeSide = layer.height <= viewport.height - gutter.blockStart - gutter.blockEnd
  if (canBeSide && rightLeft + layer.width <= viewport.width - gutter.inlineEnd)
    return { top: sideTop, left: rightLeft, placement: 'end' }
  if (canBeSide && leftLeft >= gutter.inlineStart)
    return { top: sideTop, left: leftLeft, placement: 'start' }

  const roomAbove = anchor.top - gap - gutter.blockStart
  const roomBelow = viewport.height - anchor.bottom - gap - gutter.blockEnd
  const above = roomAbove >= roomBelow
  const room = Math.max(0, above ? roomAbove : roomBelow)
  const height = Math.min(layer.height, room)
  const left = clamp(placed.left, gutter.inlineStart, Math.max(gutter.inlineStart, viewport.width - layer.width - gutter.inlineEnd))
  return {
    top: above ? anchor.top - gap - height : anchor.bottom + gap,
    left,
    placement: above ? 'above' : 'below',
    maxHeight: room < layer.height ? room : undefined,
  }
}
