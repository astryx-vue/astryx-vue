import { describe, expect, it } from 'vitest'
import { docsIcons } from '../apps/docs/components/docsIcons'
import { defaultSemanticIcons } from '../packages/core/src/Icon/semantic'

describe('docs icon table', () => {
  it('lists exactly the drawings core maps semantic names to', () => {
    const expected = [...new Set(Object.values(defaultSemanticIcons))].sort()
    expect([...docsIcons].sort()).toEqual(expected)
  })
})
