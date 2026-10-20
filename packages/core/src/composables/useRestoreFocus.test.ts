import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { mountComposable } from './testing/mountComposable.js'
import { useRestoreFocus } from './useRestoreFocus.js'

enableAutoUnmount(afterEach)

describe('useRestoreFocus', () => {
  let button1: HTMLButtonElement
  let button2: HTMLButtonElement

  beforeEach(() => {
    button1 = document.createElement('button')
    button2 = document.createElement('button')
    button1.textContent = 'Button 1'
    button2.textContent = 'Button 2'
    document.body.append(button1, button2)
  })

  afterEach(() => {
    button1.remove()
    button2.remove()
  })

  it('应该在打开时保存当前焦点并在关闭时恢复', async () => {
    const isEnabled = ref(true)
    const shouldRestore = ref(false)

    button1.focus()
    expect(document.activeElement).toBe(button1)

    mountComposable(() => useRestoreFocus({
      isEnabled,
      shouldRestore,
    }))

    await nextTick()
    shouldRestore.value = true
    await nextTick()

    button2.focus()
    expect(document.activeElement).toBe(button2)

    shouldRestore.value = false
    await nextTick()

    expect(document.activeElement).toBe(button1)
  })

  it('当禁用时不应该恢复焦点', async () => {
    const isEnabled = ref(false)
    const shouldRestore = ref(false)

    button1.focus()

    mountComposable(() => useRestoreFocus({
      isEnabled,
      shouldRestore,
    }))

    await nextTick()
    shouldRestore.value = true
    await nextTick()

    button2.focus()
    expect(document.activeElement).toBe(button2)

    shouldRestore.value = false
    await nextTick()

    expect(document.activeElement).toBe(button2)
  })

  it('手动调用 save 和 restore 应该生效', async () => {
    const isEnabled = ref(true)
    const shouldRestore = ref(false)

    button1.focus()

    const { result: focus } = mountComposable(() => useRestoreFocus({
      isEnabled,
      shouldRestore,
    }))

    await nextTick()
    focus.save()

    button2.focus()
    expect(document.activeElement).toBe(button2)

    focus.restore()
    await nextTick()

    expect(document.activeElement).toBe(button1)
  })
})
