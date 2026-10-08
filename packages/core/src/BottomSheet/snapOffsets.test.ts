import { describe, expect, it } from 'vitest'
import {
  computeDetentOffsets,
  DETENT_DEDUP_PX,
  isValidSnapPoint,
  MIN_PEEK_SCRIM_OPACITY,
  nearestOffset,
  peekOffsetFor,
  resolveSettleOffset,
  resolveSnapPoints,
  scrimOpacityForOffset,
  visibleHeightForOffset,
} from './snapOffsets.js'

describe('snap point parsing', () => {
  it('accepts viewport fractions, percentages, and px lengths', () => {
    expect(isValidSnapPoint(0.5)).toBe(true)
    expect(isValidSnapPoint(1)).toBe(true)
    expect(isValidSnapPoint('50%')).toBe(true)
    expect(isValidSnapPoint('320px')).toBe(true)
  })

  it('rejects unitless strings, non-positive values, and unsupported units', () => {
    for (const point of ['0.5', 0, -1, 1.5, '50vh', '10rem', 'calc(50%)', 'px', ''])
      expect(isValidSnapPoint(point)).toBe(false)
  })

  it('resolves percentages and fractions against the viewport', () => {
    expect(resolveSnapPoints([0.5, '50%', '320px', 'bogus'], 800)).toEqual([400, 400, 320])
  })
})

describe('detent offsets', () => {
  it('always starts fully open and only keeps heights shorter than the sheet', () => {
    expect(computeDetentOffsets(600, [])).toEqual([0])
    expect(computeDetentOffsets(600, [600, 800])).toEqual([0])
    expect(computeDetentOffsets(600, [300])).toEqual([0, 300])
  })

  it('de-duplicates stops closer than the dedup distance', () => {
    expect(computeDetentOffsets(600, [580, 560])).toEqual([0])
    expect(DETENT_DEDUP_PX).toBe(48)
  })

  it('resolves the nearest stop and clamps to the drag direction', () => {
    const offsets = [0, 200, 400]
    expect(nearestOffset(170, offsets)).toBe(200)
    expect(resolveSettleOffset(100, offsets, 1, 200)).toBe(200)
    expect(resolveSettleOffset(100, offsets, -1, 200)).toBe(0)
    expect(resolveSettleOffset(320, offsets, 0, 200)).toBe(400)
  })
})

describe('peek stops', () => {
  it('treats a sliver as a peek and a working height as a stop', () => {
    expect(peekOffsetFor([0, 400], 600)).toBeNull()
    expect(peekOffsetFor([0, 552], 600)).toBe(552)
  })

  it('has no peek with a single stop', () => {
    expect(peekOffsetFor([0], 600)).toBeNull()
  })
})

describe('scrim opacity', () => {
  it('stays opaque down to the shortest working stop', () => {
    const offsets = [0, 400]
    expect(scrimOpacityForOffset(0, offsets, 640, null)).toBe(1)
    expect(scrimOpacityForOffset(400, offsets, 640, null)).toBe(1)
    expect(scrimOpacityForOffset(640, offsets, 640, null)).toBe(0)
    expect(scrimOpacityForOffset(520, offsets, 640, null)).toBeCloseTo(0.5)
  })

  it('thins to the peek floor rather than clearing', () => {
    const offsets = [0, 200, 552]
    expect(scrimOpacityForOffset(200, offsets, 640, 552)).toBe(1)
    expect(scrimOpacityForOffset(552, offsets, 640, 552)).toBe(MIN_PEEK_SCRIM_OPACITY)
  })
})

describe('visible height', () => {
  it('excludes the reserved overscroll below the viewport', () => {
    expect(visibleHeightForOffset(648, 0, 48)).toBe(600)
    expect(visibleHeightForOffset(648, 200, 48)).toBe(400)
    expect(visibleHeightForOffset(648, 900, 48)).toBe(0)
  })
})
