import { describe, expect, it } from 'vitest'
import { useChartRange } from './useChartRange'

describe('useChartRange', () => {
  it('initializes with zero x domain and a unit y domain', () => {
    const range = useChartRange({ xWindow: 300 })
    expect(range.xDomain.value).toEqual([0, 0])
    expect(range.yDomain.value).toEqual([0, 1])
  })

  it('uses a fixed y domain without tracking pushed values', () => {
    const yDomain: [number, number] = [0, 100]
    const range = useChartRange({ xWindow: 300, yDomain })
    expect(range.yDomain.value).toEqual(yDomain)
    range.push(1, 200)
    expect(range.yDomain.value).toEqual(yDomain)
  })

  it('grows x during warmup, then slides synchronously', () => {
    const range = useChartRange({ xWindow: 100 })
    range.push(0, 10)
    expect(range.xDomain.value).toEqual([0, 1])
    range.push(50, 10)
    expect(range.xDomain.value).toEqual([0, 50])
    range.push(80, 20)
    expect(range.xDomain.value).toEqual([0, 80])
    range.push(150, 20)
    expect(range.xDomain.value).toEqual([50, 150])
  })

  it('tracks y with padding, including a single-point fallback range', () => {
    const range = useChartRange({ xWindow: 100, yPadding: 0.1 })
    range.push(1, 50)
    expect(range.yDomain.value[0]).toBeCloseTo(49.9)
    expect(range.yDomain.value[1]).toBeCloseTo(50.1)
    range.push(2, 100)
    expect(range.yDomain.value[0]).toBeCloseTo(45)
    expect(range.yDomain.value[1]).toBeCloseTo(105)
  })

  it('centers y around zero when requested', () => {
    const range = useChartRange({ xWindow: 100, yCenter: true, yPadding: 0 })
    range.push(1, -30)
    range.push(2, 10)
    expect(range.yDomain.value).toEqual([-30, 30])
  })

  it('does not replace the y domain when a new point stays inside the range', () => {
    const range = useChartRange({ xWindow: 100 })
    range.push(1, 0)
    range.push(2, 100)
    const current = range.yDomain.value
    range.push(3, 50)
    expect(range.yDomain.value).toBe(current)
  })

  it('resets automatic and fixed ranges', () => {
    const automatic = useChartRange({ xWindow: 200 })
    automatic.push(500, 99)
    automatic.reset()
    expect(automatic.xDomain.value).toEqual([0, 0])
    expect(automatic.yDomain.value).toEqual([0, 1])
    automatic.push(10, 20)
    expect(automatic.yDomain.value[0]).toBeLessThan(20)

    const fixed = useChartRange({ xWindow: 200, yDomain: [0, 100] })
    fixed.push(500, 200)
    fixed.reset()
    expect(fixed.xDomain.value).toEqual([0, 0])
    expect(fixed.yDomain.value).toEqual([0, 100])
  })
})
