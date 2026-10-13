import { describe, expect, it } from 'vitest'
import { contrastRatio, parseColor, pickMediaMode } from './contrast.js'

describe('media contrast', () => {
  it('parses hex and rgb colors', () => {
    expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255, a: 1 })
    expect(parseColor('rgb(10, 19, 23)')).toMatchObject({ r: 10, g: 19, b: 23, a: 1 })
    expect(parseColor('transparent')?.a).toBe(0)
  })

  it('skips a surface the ambient text already reads on', () => {
    const background = parseColor('#ffffff')!
    const ambient = parseColor('#171717')!
    expect(contrastRatio(ambient, background)).toBeGreaterThan(3)
    expect(pickMediaMode(background, ambient)).toBe('off')
  })

  it('picks dark text treatment for a dark painted surface', () => {
    const background = parseColor('#0a1317')!
    const ambient = parseColor('#0a1317')!
    expect(pickMediaMode(background, ambient)).toBe('dark')
  })

  it('returns null when the background is transparent', () => {
    expect(pickMediaMode(parseColor('transparent')!, parseColor('#171717')!)).toBeNull()
  })
})
