import type { TokenResolver } from './getChartColors.js'
import { describe, expect, it } from 'vitest'
import { getChartColorsFromResolver } from './getChartColors.js'

// 一个假的取色函数，灰度色阶故意选成整数，插值结果可以手算核对：
// 从第 5 档到第 1 档依次是 0x00、0x40、0x80、0xC0、0xFF。
const RAMP: Record<string, string> = {
  '--color-data-gray-5': '#000000',
  '--color-data-gray-4': '#404040',
  '--color-data-gray-3': '#808080',
  '--color-data-gray-2': '#C0C0C0',
  '--color-data-gray-1': '#FFFFFF',
}

const resolve: TokenResolver = name => RAMP[name] ?? `resolved(${name})`

describe('getChartColorsFromResolver', () => {
  it('returns exact token stops when n <= ramp length', () => {
    const colors = getChartColorsFromResolver(resolve)
    expect(colors.sequential.gray(5)).toEqual([
      '#000000',
      '#404040',
      '#808080',
      '#C0C0C0',
      '#FFFFFF',
    ])
  })

  it('interpolates between stops when n > ramp length', () => {
    const colors = getChartColorsFromResolver(resolve)
    // n=9 落在 5 个停靠点上：奇数位正好是两个相邻停靠点的中点。
    expect(colors.sequential.gray(9)).toEqual([
      '#000000',
      '#202020',
      '#404040',
      '#606060',
      '#808080',
      '#A0A0A0',
      '#C0C0C0',
      '#E0E0E0',
      '#FFFFFF',
    ])
  })

  it('falls back to the nearer endpoint when interpolating non-hex stops', () => {
    const colors = getChartColorsFromResolver(name =>
      name === '--color-data-gray-5' ? 'var(--custom)' : (RAMP[name] ?? ''),
    )
    const nine = colors.sequential.gray(9)
    // 读不出来的第一个停靠点在自己的槽位上原样保留，也当作第一个插值位的近端点。
    expect(nine[0]).toBe('var(--custom)')
    expect(nine[1]).toBe('#404040')
  })

  describe('alpha', () => {
    it('applies opacity to a hex color', () => {
      const colors = getChartColorsFromResolver(resolve)
      expect(colors.alpha('#0064E0', 0.2)).toBe('rgba(0, 100, 224, 0.2)')
    })

    it('applies opacity to bare hex without the leading # (pre-#3739 behavior)', () => {
      const colors = getChartColorsFromResolver(resolve)
      expect(colors.alpha('0064E0', 0.2)).toBe('rgba(0, 100, 224, 0.2)')
    })

    it('applies opacity to rgba() input, overriding its alpha', () => {
      const colors = getChartColorsFromResolver(resolve)
      expect(colors.alpha('rgba(0, 100, 224, 0.9)', 0.2)).toBe(
        'rgba(0, 100, 224, 0.2)',
      )
    })

    it('clamps out-of-range opacity and defaults non-finite opacity to 1', () => {
      const colors = getChartColorsFromResolver(resolve)
      expect(colors.alpha('#000000', 2)).toBe('#000000')
      expect(colors.alpha('#000000', -1)).toBe('rgba(0, 0, 0, 0)')
      expect(colors.alpha('#000000', Number.NaN)).toBe('#000000')
    })

    it('preserves unparseable input unchanged', () => {
      const colors = getChartColorsFromResolver(resolve)
      expect(colors.alpha('var(--color-accent)', 0.5)).toBe(
        'var(--color-accent)',
      )
    })
  })
})
