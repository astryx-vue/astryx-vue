import { describe, expect, it } from 'vitest'
import { monotonePath, niceTicks } from '../apps/docs/components/playground/playgroundChartKit'

describe('playground chart kit', () => {
  it('picks the same five y ticks as recharts for the template data', () => {
    expect(niceTicks(20, 320)).toEqual([0, 80, 160, 240, 320])
    expect(niceTicks(0, 1030)).toEqual([0, 300, 600, 900, 1200])
    expect(niceTicks(0, 1244)).toEqual([0, 350, 700, 1050, 1400])
    expect(niceTicks(0, 4350)).toEqual([0, 1500, 3000, 4500, 6000])
    expect(niceTicks(0, 55)).toEqual([0, 15, 30, 45, 60])
    expect(niceTicks(0, 95)).toEqual([0, 25, 50, 75, 100])
  })

  it('draws a curve through every point', () => {
    const d = monotonePath([{ x: 0, y: 10 }, { x: 10, y: 5 }, { x: 20, y: 8 }])
    expect(d.startsWith('M0,10C')).toBe(true)
    expect(d.endsWith('20,8')).toBe(true)
  })
})
