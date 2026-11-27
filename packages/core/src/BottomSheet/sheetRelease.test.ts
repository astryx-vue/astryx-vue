import { describe, expect, it } from 'vitest'
import { rubberBand } from '../motion/rubberBand'
import { MIN_RESERVE, sheetReserve, stretchedOffset } from './sheetDragMath.js'
import { resolveSheetRelease } from './sheetRelease.js'

/** A 600 px tall sheet, reserve included, with stops at 0 and 168. */
const base = {
  height: 600,
  offsets: [0, 168],
  reserve: MIN_RESERVE,
  baseOffset: 0,
}

describe('resolveSheetRelease', () => {
  it('closes a short finger flick from the shortest stop, with the release speed', () => {
    const release = resolveSheetRelease({ ...base, baseOffset: 168, offset: 188, velocity: 1.2, dir: 1, travel: 20, isTouch: true })
    expect(release).toEqual({ kind: 'close', exit: { distance: 412, velocity: 1200 } })
  })

  it('takes no flick from a tap-sized finger move', () => {
    const release = resolveSheetRelease({ ...base, baseOffset: 168, offset: 174, velocity: 1.1, dir: 1, travel: 6, isTouch: true })
    expect(release).toEqual({ kind: 'settle', target: 168 })
  })

  it('cancels a finger release that turns back toward its start', () => {
    const release = resolveSheetRelease({ ...base, offset: 400, velocity: -0.3, dir: 1, travel: 400, isTouch: true })
    expect(release).toEqual({ kind: 'settle', target: 0 })
  })

  it('coasts a mouse release on the scroll deceleration, but not a short one', () => {
    const coasted = resolveSheetRelease({ ...base, offset: 60, velocity: 0.2, dir: 1, travel: 60, isTouch: false })
    expect(coasted).toEqual({ kind: 'settle', target: 168 })
    const short = resolveSheetRelease({ ...base, offset: 40, velocity: 0.2, dir: 1, travel: 40, isTouch: false })
    expect(short).toEqual({ kind: 'settle', target: 0 })
  })
})

describe('stretchedOffset', () => {
  it('stretches a finger past the top on the rubber band, up to the reserve', () => {
    const context = { pointerType: 'touch', height: 900, reserve: 300 }
    expect(stretchedOffset(-200, [0], context)).toBeCloseTo(rubberBand(-200, 600, 0.55))
    expect(stretchedOffset(-5000, [0], context)).toBe(-300)
  })

  it('caps a mouse past the top at the minimum reserve', () => {
    expect(stretchedOffset(-1000, [0], { pointerType: 'mouse', height: 900, reserve: 300 })).toBe(-MIN_RESERVE)
  })

  it('keeps 40% of the viewport as a touch device reserve', () => {
    expect(sheetReserve(800)).toBe(320)
    expect(sheetReserve(100)).toBe(MIN_RESERVE)
  })
})
