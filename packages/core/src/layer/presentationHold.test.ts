import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { mountComposable } from '../composables/testing/mountComposable.js'
import { createPresentationHold, usePresentationHold } from './presentationHold.js'

describe('createPresentationHold', () => {
  it('holds the taken choice until released', () => {
    const hold = createPresentationHold<'popover' | 'bottom-sheet'>()
    expect(hold.isHeld()).toBe(false)
    hold.take('bottom-sheet')
    expect(hold.current()).toBe('bottom-sheet')
    hold.take('popover')
    expect(hold.current()).toBe('popover')
    hold.release()
    expect(hold.isHeld()).toBe(false)
    expect(hold.current()).toBeUndefined()
  })
})

describe('usePresentationHold', () => {
  it('keeps the opening choice through the close until released', async () => {
    const isOpen = ref(false)
    const presentation = ref<'popover' | 'bottom-sheet'>('bottom-sheet')
    const { result } = mountComposable(() => usePresentationHold({ isOpen, presentation }))
    expect(result.isHeld.value).toBe(false)
    expect(result.presentation.value).toBeNull()

    isOpen.value = true
    expect(result.presentation.value).toBe('bottom-sheet')
    await nextTick()
    presentation.value = 'popover'
    await nextTick()
    expect(result.presentation.value).toBe('bottom-sheet')

    isOpen.value = false
    await nextTick()
    expect(result.presentation.value).toBe('bottom-sheet')
    result.release()
    expect(result.isHeld.value).toBe(false)

    isOpen.value = true
    await nextTick()
    expect(result.presentation.value).toBe('popover')
  })
})
