import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.resetModules()
  vi.unstubAllGlobals()
})

describe('sharedMutationObserver', () => {
  it('batches descendant changes and removes only the matching registration', async () => {
    const { observeContent } = await import('./sharedMutationObserver.js')
    const root = document.createElement('div')
    const child = document.createElement('span')
    root.appendChild(child)
    document.body.appendChild(root)
    const first = vi.fn()
    const second = vi.fn()
    const stopFirst = observeContent(root, first)
    const stopSecond = observeContent(root, second)

    child.textContent = 'one'
    child.textContent = 'two'
    await vi.waitFor(() => {
      expect(first).toHaveBeenCalledTimes(1)
      expect(second).toHaveBeenCalledTimes(1)
    })

    stopFirst()
    child.textContent = 'three'
    await vi.waitFor(() => expect(second).toHaveBeenCalledTimes(2))
    expect(first).toHaveBeenCalledTimes(1)
    stopSecond()
    root.remove()
  })

  it('shares one observer across elements', async () => {
    const NativeMutationObserver = globalThis.MutationObserver
    let created = 0
    vi.stubGlobal('MutationObserver', class extends NativeMutationObserver {
      constructor(callback: MutationCallback) {
        super(callback)
        created++
      }
    })
    const { observeContent } = await import('./sharedMutationObserver.js')
    const first = document.createElement('div')
    const second = document.createElement('div')
    const stopFirst = observeContent(first, vi.fn())
    const stopSecond = observeContent(second, vi.fn())

    expect(created).toBe(1)
    stopFirst()
    stopSecond()
  })
})
