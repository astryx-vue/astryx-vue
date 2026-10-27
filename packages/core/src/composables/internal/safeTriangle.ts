/**
 * 子菜单行和它的飞出层之间的安全三角。
 *
 * 对应原版 Astryx `useMenuHover` 里的 `isPointInSafeTriangle`。指针离开那一行后，
 * 只要还在这个三角里，就是在往飞出层去，飞出层要保持打开。
 */

export interface MenuPoint {
  x: number
  y: number
}

export interface MenuEdgeRect {
  top: number
  bottom: number
  left: number
  right: number
}

/**
 * Slack on the flyout's near edge, so a pointer skimming the corners still
 * counts as heading for the flyout. Upstream constant, 8px.
 */
export const SAFE_TRIANGLE_PADDING_PX = 8

function sign(p1: MenuPoint, p2: MenuPoint, p3: MenuPoint): number {
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y)
}

function isPointInTriangle(p: MenuPoint, a: MenuPoint, b: MenuPoint, c: MenuPoint): boolean {
  const d1 = sign(p, a, b)
  const d2 = sign(p, b, c)
  const d3 = sign(p, c, a)
  const hasNegative = d1 < 0 || d2 < 0 || d3 < 0
  const hasPositive = d1 > 0 || d2 > 0 || d3 > 0
  return !(hasNegative && hasPositive)
}

/**
 * Whether `point` lies inside the triangle from `origin` (where the pointer
 * left the row) to the flyout's near edge — the edge facing the origin.
 */
export function isPointInSafeTriangle(point: MenuPoint, origin: MenuPoint, flyout: MenuEdgeRect): boolean {
  const pad = SAFE_TRIANGLE_PADDING_PX
  let edgeStart: MenuPoint
  let edgeEnd: MenuPoint
  if (origin.x <= flyout.left) {
    edgeStart = { x: flyout.left, y: flyout.top - pad }
    edgeEnd = { x: flyout.left, y: flyout.bottom + pad }
  }
  else if (origin.x >= flyout.right) {
    edgeStart = { x: flyout.right, y: flyout.top - pad }
    edgeEnd = { x: flyout.right, y: flyout.bottom + pad }
  }
  else if (origin.y <= flyout.top) {
    edgeStart = { x: flyout.left - pad, y: flyout.top }
    edgeEnd = { x: flyout.right + pad, y: flyout.top }
  }
  else if (origin.y >= flyout.bottom) {
    edgeStart = { x: flyout.left - pad, y: flyout.bottom }
    edgeEnd = { x: flyout.right + pad, y: flyout.bottom }
  }
  else {
    // The origin is over the flyout itself: nothing to travel toward.
    return false
  }
  return isPointInTriangle(point, origin, edgeStart, edgeEnd)
}
