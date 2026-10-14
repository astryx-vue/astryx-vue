import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useFieldControlState } from './useFieldControlState.js'

describe('useFieldControlState', () => {
  it('keeps a read-only control activatable until it is also disabled', () => {
    const disabled = ref(false)
    const readOnly = ref(true)
    const state = useFieldControlState({ disabled, readOnly, loading: false })
    expect(state.isReadOnly.value).toBe(true)
    expect(state.canActivate.value).toBe(false)

    disabled.value = true
    expect(state.isDisabled.value).toBe(true)
    expect(state.isReadOnly.value).toBe(false)
    expect(state.canActivate.value).toBe(false)
  })
})
