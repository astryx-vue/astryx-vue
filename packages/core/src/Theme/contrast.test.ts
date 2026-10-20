import { describe, expect, it } from 'vitest'
import { compositeOver, contrastRatio, parseColor, pickMediaMode } from './contrast.js'

const WHITE = parseColor('#ffffff')!
const INK = parseColor('#171717')!

describe('media contrast', () => {
  it('parses hex and rgb colors', () => {
    expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255, a: 1 })
    expect(parseColor('rgb(10, 19, 23)')).toMatchObject({ r: 10, g: 19, b: 23, a: 1 })
    expect(parseColor('transparent')?.a).toBe(0)
  })

  it('skips a surface the ambient text already reads on', () => {
    expect(contrastRatio(INK, WHITE)).toBeGreaterThan(3)
    expect(pickMediaMode(WHITE, INK, WHITE, INK)).toBe('off')
  })

  it('picks the side whose text contrasts more on the painted surface', () => {
    const dark = parseColor('#0a1317')!
    expect(pickMediaMode(dark, dark, WHITE, INK)).toBe('dark')
    const pale = parseColor('#e5e5e5')!
    expect(pickMediaMode(pale, pale, WHITE, INK)).toBe('light')
  })

  it('reads the theme text colors instead of fixed white and ink', () => {
    const mid = parseColor('#7a7a7a')!
    const cream = parseColor('#fff7d6')!
    const coffee = parseColor('#2a1a05')!
    expect(pickMediaMode(mid, mid, cream, coffee)).toBe(contrastRatio(cream, mid) >= contrastRatio(coffee, mid) ? 'dark' : 'light')
  })

  it('returns null when a text color cannot be read', () => {
    expect(pickMediaMode(WHITE, INK, null, INK)).toBeNull()
  })

  it('composites a translucent layer over its backdrop', () => {
    expect(compositeOver({ r: 0, g: 0, b: 0, a: 0.5 }, WHITE)).toEqual({ r: 127.5, g: 127.5, b: 127.5, a: 1 })
  })
})
