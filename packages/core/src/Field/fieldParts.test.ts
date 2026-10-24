import { describe, expect, it } from 'vitest'
import { mountComposable } from '../composables/testing/mountComposable.js'
import { useFieldPartStyling } from './fieldParts.js'

describe('useFieldPartStyling', () => {
  it('把透传属性拆开：class/style 和保留名不进主语义控件，其余进去', () => {
    const attrs = { 'class': 'a', 'style': 'color: red', 'id': 'x', 'data-testid': 't', 'aria-details': 'd', 'onFocus': () => {} }
    const { result } = mountComposable(() => useFieldPartStyling({ component: 'Demo', props: {}, attrs, reservedAttrs: ['id'] }))
    expect(Object.keys(result.forwardedAttrs()).sort()).toEqual(['aria-details', 'data-testid', 'onFocus'])
  })

  it('本体拿到根上的 class/style 加 controlClass/controlStyle，外壳只拿 container*', () => {
    const props = { containerClass: 'c1', containerStyle: { color: 'red' }, controlClass: 'k1', controlStyle: { color: 'blue' } }
    const { result } = mountComposable(() => useFieldPartStyling({ component: 'Demo', props, attrs: { class: 'root', style: { margin: '1px' } } }))
    expect(result.controlClass()).toEqual(['root', 'k1'])
    expect(result.controlStyle()).toEqual([{ margin: '1px' }, { color: 'blue' }])
    expect(result.containerClass.value).toBe('c1')
    expect(result.containerStyle.value).toEqual({ color: 'red' })
    expect(result.hasFieldBox.value).toBe(true)
  })
})
