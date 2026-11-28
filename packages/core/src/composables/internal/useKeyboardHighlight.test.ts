import { afterEach, describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { mountComposable } from '../testing/mountComposable.js'
import { useKeyboardHighlight } from './useKeyboardHighlight.js'

function key(): void {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
}

function press(): void {
  document.dispatchEvent(new Event('pointerdown', { bubbles: true }))
}

describe('useKeyboardHighlight', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('follows the last input each time the highlight moves', async () => {
    const active = ref(-1)
    const { result } = mountComposable(() => useKeyboardHighlight(active))
    key()
    active.value = 0
    await nextTick()
    expect(result.isKeyboardHighlight.value).toBe(true)

    press()
    active.value = 1
    await nextTick()
    expect(result.isKeyboardHighlight.value).toBe(false)

    key()
    active.value = 2
    await nextTick()
    expect(result.isKeyboardHighlight.value).toBe(true)
  })

  it('treats a hover move as pointer even after keyboard use, once', async () => {
    const active = ref(0)
    const { result } = mountComposable(() => useKeyboardHighlight(active))
    key()
    result.notePointerMove()
    active.value = 3
    await nextTick()
    expect(result.isKeyboardHighlight.value).toBe(false)

    active.value = 4
    await nextTick()
    expect(result.isKeyboardHighlight.value).toBe(true)
  })
})
