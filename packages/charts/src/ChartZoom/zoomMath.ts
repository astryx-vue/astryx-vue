export type NumericDomain = [number, number]

/** 围绕 pivot 缩放一条数值轴；factor < 1 是放大，factor > 1 是缩小。 */
export function zoomAxis(domain: NumericDomain, factor: number, pivot: number): NumericDomain {
  const [min, max] = domain
  const range = max - min
  if (!Number.isFinite(factor) || factor <= 0 || !Number.isFinite(pivot) || range === 0)
    return [...domain]

  const pivotRatio = (pivot - min) / range
  const nextRange = range * factor
  return [pivot - nextRange * pivotRatio, pivot + nextRange * (1 - pivotRatio)]
}
