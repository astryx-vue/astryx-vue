import { describe, expect, it } from 'vitest'
import { previewLayoutMode } from '../apps/docs/components/playground/previewLayout'

describe('preview layout', () => {
  it('centers a welcome card that is smaller than the stage on both axes', () => {
    expect(previewLayoutMode(800, 600, 400, 180)).toBe('center')
  })

  it('keeps a full-width page edge to edge', () => {
    expect(previewLayoutMode(800, 600, 800, 240)).toBe('fill')
    expect(previewLayoutMode(800, 600, 798, 240)).toBe('fill')
  })

  it('keeps a full-height shell edge to edge', () => {
    expect(previewLayoutMode(800, 600, 420, 600)).toBe('fill')
    expect(previewLayoutMode(800, 600, 420, 598)).toBe('fill')
  })
})
