import { describe, expect, it } from 'vitest'
import { Comment, Fragment, h, Text } from 'vue'
import { isRenderable } from './isRenderable.js'

describe('isRenderable', () => {
  it('rejects empty values and accepts elements', () => {
    expect(isRenderable(undefined)).toBe(false)
    expect(isRenderable(null)).toBe(false)
    expect(isRenderable(false)).toBe(false)
    expect(isRenderable('')).toBe(false)
    expect(isRenderable([])).toBe(false)
    expect(isRenderable(h(Comment, 'empty'))).toBe(false)
    expect(isRenderable(h(Text, '   '))).toBe(false)
    expect(isRenderable(h(Fragment, [h(Comment, 'x')]))).toBe(false)
    expect(isRenderable(h('span'))).toBe(true)
    expect(isRenderable([false, h('span')])).toBe(true)
  })
})
