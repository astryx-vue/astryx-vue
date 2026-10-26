import type { ChartScale } from './types.js'
import { scaleBand } from 'd3-scale'
import { describe, expect, it } from 'vitest'
import { isBandScale, xPixel } from './utils.js'

describe('isBandScale', () => {
  it('recognizes a band scale', () => {
    expect(isBandScale(scaleBand().domain(['a']).range([0, 10]))).toBe(true)
  })

  it('rejects a linear scale', () => {
    expect(isBandScale(linearStub())).toBe(false)
  })
})

describe('xPixel', () => {
  const band = scaleBand<string>().domain(['a', 'b']).range([0, 100]).padding(0)

  it('returns the center of the band for categorical x', () => {
    expect(xPixel({ k: 'a' }, 'k', band)).toBe(25)
    expect(xPixel({ k: 'b' }, 'k', band)).toBe(75)
  })

  it('falls back to the band origin for a value outside the domain', () => {
    // 不在域里的分类取不到位置，按带的起点算，不会变成 NaN。
    expect(xPixel({ k: 'zzz' }, 'k', band)).toBe(0 + band.bandwidth() / 2)
  })

  it('passes finite numbers straight through on a linear scale', () => {
    expect(xPixel({ k: 5 }, 'k', linearStub())).toBe(50)
  })

  it('returns NaN for values that cannot be placed', () => {
    expect(Number.isNaN(xPixel({ k: 'nope' }, 'k', linearStub()))).toBe(true)
    expect(Number.isNaN(xPixel({ k: Number.POSITIVE_INFINITY }, 'k', linearStub()))).toBe(true)
    expect(Number.isNaN(xPixel({}, 'k', linearStub()))).toBe(true)
  })
})

/** 一个最小的线性比例尺替身：0-10 映射到 0-100。 */
function linearStub(): ChartScale {
  return ((v: number): number => (v / 10) * 100) as unknown as ChartScale
}
