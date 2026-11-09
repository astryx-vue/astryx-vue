import { arc } from 'd3-shape'

/**
 * 生成圆心位于 (0, 0) 的扇区路径。d3 的 0 弧度在正上方，径向坐标使用数学约定，
 * 所以在这里统一补 90 度。cornerRadius 交给 d3 实际绘制内外圆角。
 */
export function radialArcPath(
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
  cornerRadius = 0,
): string {
  return arc().cornerRadius(Math.max(0, cornerRadius))({
    innerRadius,
    outerRadius,
    startAngle: startAngle + Math.PI / 2,
    endAngle: endAngle + Math.PI / 2,
  }) ?? ''
}
