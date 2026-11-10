import { describe, expect, it } from 'vitest'
import { computeDomain3D, createProjection3D, normalize3D, resolveDomain3D } from './projection.js'

describe('threeD projection', () => {
  it('projects the center and preserves vertical direction and depth', () => {
    const project = createProjection3D(600, 400, { azimuth: 0, elevation: 0 })
    expect(project(0.5, 0.5, 0.5)).toEqual({ px: 300, py: 200, depth: 0 })
    expect(project(0.5, 1, 0.5)).toEqual({ px: 300, py: 130, depth: 0 })
    expect(project(0.5, 0.5, 1).depth).toBe(0.5)
  })

  it('rotates azimuth and elevation with finite coordinates', () => {
    for (const camera of [
      { azimuth: 35, elevation: 25 },
      { azimuth: 90, elevation: 0 },
      { azimuth: -30, elevation: 15 },
      { azimuth: 180, elevation: -20 },
    ]) {
      const project = createProjection3D(600, 400, camera)
      for (const point of [[0, 0, 0], [1, 1, 1], [0.3, 0.7, 0.9]]) {
        const projected = project(...point as [number, number, number])
        expect(Number.isFinite(projected.px)).toBe(true)
        expect(Number.isFinite(projected.py)).toBe(true)
        expect(Number.isFinite(projected.depth)).toBe(true)
      }
    }
  })

  it('computes domains from finite numbers and handles degenerate ranges', () => {
    const data = [{ x: 3 }, { x: -2 }, { x: Number.NaN }, { x: '4' }]
    expect(computeDomain3D(data, 'x')).toEqual([-2, 3])
    expect(computeDomain3D([], 'x')).toEqual([0, 1])
    expect(resolveDomain3D(data, 'x', [5, 5])).toEqual([5, 5])
    expect(normalize3D(8, [5, 5])).toBe(0.5)
    expect(normalize3D(1, [0, 2])).toBe(0.5)
  })
})
