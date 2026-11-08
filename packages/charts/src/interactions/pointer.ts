export interface LocalChartPoint {
  x: number
  y: number
}

/** 把指针的视口坐标换算成当前 SVG 绘图区的局部坐标。 */
export function localChartPoint(event: MouseEvent): LocalChartPoint | null {
  const target = event.currentTarget as SVGRectElement | null
  const svg = target?.ownerSVGElement
  const matrix = target?.getScreenCTM()?.inverse()
  if (!svg || !matrix)
    return null

  const point = svg.createSVGPoint()
  point.x = event.clientX
  point.y = event.clientY
  const local = point.matrixTransform(matrix)
  return { x: local.x, y: local.y }
}
