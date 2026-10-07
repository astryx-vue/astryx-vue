import type { ButtonClickAction } from './types.js'
import { describe, expect, it, vi } from 'vitest'

import { computed } from 'vue'
import { useButtonAction } from './useButtonAction.js'

function createDeferred(): {
  promise: Promise<void>
  reject: (reason?: unknown) => void
  resolve: () => void
} {
  let rejectPromise: (reason?: unknown) => void = () => {}
  let resolvePromise: () => void = () => {}
  const promise = new Promise<void>((resolve, reject) => {
    rejectPromise = reject
    resolvePromise = resolve
  })

  return {
    promise,
    reject: rejectPromise,
    resolve: resolvePromise,
  }
}

function createActionHarness(getAction: () => ButtonClickAction | undefined) {
  const emitClick = vi.fn()
  const action = useButtonAction({
    clickAction: getAction,
    emitClick,
    isDisabled: computed(() => false),
    isInterruptible: computed(() => false),
    isLoading: computed(() => false),
  })

  return {
    action,
    emitClick,
  }
}

describe('useButtonAction', () => {
  it('clears pending state after a rejected action and allows retry', async () => {
    const first = createDeferred()
    const second = createDeferred()
    const actions = [first, second]
    const clickAction = vi.fn(() => actions.shift()?.promise ?? Promise.resolve())
    const { action } = createActionHarness(() => clickAction)
    const firstResult = action.handleClick(new MouseEvent('click'))

    expect(action.isPending.value).toBe(true)

    first.reject(new Error('Save failed'))
    await expect(firstResult).rejects.toThrow('Save failed')
    expect(action.isPending.value).toBe(false)

    const secondResult = action.handleClick(new MouseEvent('click'))
    expect(clickAction).toHaveBeenCalledTimes(2)
    expect(action.isPending.value).toBe(true)

    second.resolve()
    await secondResult
    expect(action.isPending.value).toBe(false)
  })

  it('clears pending state when an action throws synchronously', () => {
    const { action } = createActionHarness(() => () => {
      throw new Error('Synchronous failure')
    })

    expect(() => action.handleClick(new MouseEvent('click'))).toThrow('Synchronous failure')
    expect(action.isPending.value).toBe(false)
  })

  it('does not start an action after the click event is prevented', () => {
    const clickAction = vi.fn()
    const { action, emitClick } = createActionHarness(() => clickAction)
    emitClick.mockImplementation(event => event.preventDefault())

    action.handleClick(new MouseEvent('click', { cancelable: true }))

    expect(clickAction).not.toHaveBeenCalled()
    expect(action.isPending.value).toBe(false)
  })
})
