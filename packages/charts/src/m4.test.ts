import type { M4Point } from './m4'
import { describe, expect, it } from 'vitest'
import { m4Reduce } from './m4'

function points(length: number, y: (index: number) => number = index => index): M4Point[] {
  return Array.from({ length }, (_, x) => ({ x, y: y(x) }))
}

describe('m4Reduce', () => {
  it('returns empty input and invalid widths without allocating buckets', () => {
    expect(m4Reduce([], 100)).toEqual([])
    expect(m4Reduce(points(100), 0)).toEqual([])
    expect(m4Reduce(points(100), -1)).toEqual([])
    expect(m4Reduce(points(100), Number.NaN)).toEqual([])
    expect(m4Reduce(points(100), Number.POSITIVE_INFINITY)).toEqual([])
  })

  it('returns the original array when no reduction is needed', () => {
    const data = points(3)
    expect(m4Reduce(data, 100)).toBe(data)
  })

  it('reduces a large dataset to at most four points per pixel bucket', () => {
    const data = points(10_000, index => Math.sin(index * 0.01) * 100)
    const reduced = m4Reduce(data, 100)
    expect(reduced.length).toBeLessThanOrEqual(400)
    expect(reduced.length).toBeGreaterThan(0)
  })

  it('preserves min, max, first and last points', () => {
    const spike = points(1_000, index => index === 500 ? 999 : 0)
    const reducedSpike = m4Reduce(spike, 10)
    expect(Math.max(...reducedSpike.map(point => point.y))).toBe(999)

    const ascending = points(1_000)
    const reduced = m4Reduce(ascending, 10)
    expect(reduced[0]).toBe(ascending[0])
    expect(reduced[reduced.length - 1]).toBe(ascending[ascending.length - 1])
  })

  it('keeps output ordered and does not mutate the input', () => {
    const data = points(1_000, index => Math.sin(index))
    const snapshot = data.map(point => ({ ...point }))
    const reduced = m4Reduce(data, 10)
    expect(data).toEqual(snapshot)
    expect(reduced.every((point, index) => index === 0 || reduced[index - 1].x <= point.x)).toBe(true)
  })

  it('supports a custom domain, including points beyond both edges', () => {
    const data = points(1_000).map(point => ({ ...point, x: point.x + 500 }))
    const reduced = m4Reduce(data, 10, [700, 1_200])
    expect(reduced.length).toBeLessThanOrEqual(40)
    expect(reduced.length).toBeGreaterThan(0)
    expect(reduced.every((point, index) => index === 0 || reduced[index - 1].x <= point.x)).toBe(true)
  })

  it('handles one point and a degenerate domain', () => {
    const one = [{ x: 5, y: 10 }]
    expect(m4Reduce(one, 100)).toBe(one)
    expect(m4Reduce(points(100), 1, [4, 4])).toEqual([{ x: 0, y: 0 }])
  })
})
