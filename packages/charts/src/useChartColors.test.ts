import { describe, expect, it } from 'vitest'
import { useChartColors } from './useChartColors.js'

describe('useChartColors', () => {
  it('returns the requested number of categorical colors', () => {
    const colors = useChartColors().categorical(4)
    expect(colors).toHaveLength(4)
    for (const c of colors) {
      expect(typeof c).toBe('string')
      expect(c.length).toBeGreaterThan(0)
    }
  })

  it('assigns distinct colors within the first palette cycle', () => {
    const colors = useChartColors().categorical(4)
    expect(new Set(colors).size).toBe(4)
  })

  it('wraps around the palette when more series than slots are requested', () => {
    const colors = useChartColors().categorical(12)
    expect(colors).toHaveLength(12)
    // 10 个分类色，第 10、11 个回到第 0、1 个。
    expect(colors[10]).toBe(colors[0])
    expect(colors[11]).toBe(colors[1])
  })

  it('returns an empty palette for a non-positive count', () => {
    expect(useChartColors().categorical(0)).toEqual([])
  })

  it('returns a referentially stable API across rerenders', () => {
    expect(useChartColors()).toBe(useChartColors())
  })

  it('mixes transparency into a CSS variable with color-mix', () => {
    const colors = useChartColors()
    expect(colors.alpha(colors.categorical(1)[0], 0.25)).toBe(
      'color-mix(in srgb, var(--astryx-color-data-categorical-blue) 25%, transparent)',
    )
    expect(colors.alpha('#ff0000', 0.5)).toBe(colors.alpha('ff0000', 0.5))
  })
})
