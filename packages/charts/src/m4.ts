export interface M4Point {
  x: number
  y: number
}

interface M4Bucket {
  first: M4Point | null
  last: M4Point | null
  min: M4Point | null
  max: M4Point | null
}

/**
 * 按 x 轴像素宽度缩减有序时间序列。每个像素桶保留首点、尾点、最低点和最高点，
 * 以减少折线渲染的数据量，同时保留当前分辨率下可见的峰值和低谷。
 *
 * 输入必须按 x 升序排列。`xDomain` 需要与图表的 x 轴范围一致；范围外的点会归入
 * 最近的边缘桶，以保留折线边界。数据量不超过桶容量的四倍时直接返回原数组。
 */
export function m4Reduce(
  data: M4Point[],
  width: number,
  xDomain?: [number, number],
): M4Point[] {
  if (data.length === 0 || !Number.isFinite(width) || width <= 0)
    return []

  if (data.length <= width * 4)
    return data

  const xMin = xDomain ? xDomain[0] : data[0].x
  const xMax = xDomain ? xDomain[1] : data[data.length - 1].x
  const xRange = xMax - xMin
  if (!Number.isFinite(xRange) || xRange <= 0)
    return [data[0]]

  const bucketCount = Math.ceil(width)
  const buckets: M4Bucket[] = Array.from({ length: bucketCount }, () => ({
    first: null,
    last: null,
    min: null,
    max: null,
  }))

  for (const point of data) {
    const bucketIndex = Math.max(0, Math.min(
      bucketCount - 1,
      Math.floor(((point.x - xMin) / xRange) * bucketCount),
    ))
    const bucket = buckets[bucketIndex]

    if (!bucket.first) {
      bucket.first = point
      bucket.last = point
      bucket.min = point
      bucket.max = point
    }
    else {
      bucket.last = point
      if (bucket.min && point.y < bucket.min.y)
        bucket.min = point
      if (bucket.max && point.y > bucket.max.y)
        bucket.max = point
    }
  }

  const result: M4Point[] = []
  for (const bucket of buckets) {
    if (!bucket.first || !bucket.last || !bucket.min || !bucket.max)
      continue

    const unique = [...new Set([bucket.first, bucket.min, bucket.max, bucket.last])]
    unique.sort((a, b) => a.x - b.x)
    result.push(...unique)
  }

  return result
}
