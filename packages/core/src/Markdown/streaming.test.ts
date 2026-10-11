import { describe, expect, it } from 'vitest'
import { computeBoundaries, computeSegments, parseCssDuration } from './streaming.js'

describe('markdown streaming cursor', () => {
  it('records the previous length and drops boundaries past the cap', () => {
    const initial = computeBoundaries([], 0, 2)
    expect(initial).toEqual([0])

    const same = computeBoundaries(initial, 0, 2)
    expect(same).toBe(initial)

    let boundaries = computeBoundaries(initial, 2, 2)
    boundaries = computeBoundaries(boundaries, 4, 2)
    boundaries = computeBoundaries(boundaries, 6, 2)
    expect(boundaries).toEqual([4, 6])
  })

  it('splits a text node into settled and fading slices', () => {
    expect(computeSegments('hello', 0, [], 'n')).toBeNull()
    expect(computeSegments('hello', 0, [5], 'n')).toBeNull()
    expect(computeSegments('hello', 0, [0], 'n')).toEqual([
      { key: 'fade-n-b0', text: 'hello', fading: true },
    ])

    expect(computeSegments('hello world', 0, [6], 'n')).toEqual([
      { key: 'settled-n', text: 'hello ', fading: false },
      { key: 'fade-n-b6', text: 'world', fading: true },
    ])
  })

  it('parses motion duration tokens', () => {
    expect(parseCssDuration('165ms')).toBe(165)
    expect(parseCssDuration('0.2s')).toBe(200)
    expect(parseCssDuration('fast')).toBeNull()
  })
})
