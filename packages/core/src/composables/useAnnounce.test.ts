import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { __resetLiveRegionsForTest, useAnnounce } from './useAnnounce.js'

afterEach(() => {
  __resetLiveRegionsForTest()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

function politeRegion(): HTMLElement | null {
  return document.querySelector('[data-astryx-live-region="polite"]')
}

function assertiveRegion(): HTMLElement | null {
  return document.querySelector('[data-astryx-live-region="assertive"]')
}

function mountAnnounce() {
  let announce: ReturnType<typeof useAnnounce> = () => {}
  const Host = defineComponent({
    setup() {
      announce = useAnnounce()
      return () => null
    },
  })
  const wrapper = mount(Host)
  return { announce, wrapper }
}

describe('useAnnounce', () => {
  it('mounts empty polite and assertive regions on the first announcement', async () => {
    const { announce } = mountAnnounce()
    expect(politeRegion()).toBeNull()

    announce('Saved')
    await nextTick()

    expect(politeRegion()?.getAttribute('aria-live')).toBe('polite')
    expect(politeRegion()?.getAttribute('aria-atomic')).toBe('true')
    expect(politeRegion()?.getAttribute('role')).toBe('status')
    expect(assertiveRegion()?.getAttribute('aria-live')).toBe('assertive')
    expect(assertiveRegion()?.getAttribute('role')).toBe('alert')
  })

  it('speaks a polite message and leaves the assertive region empty', async () => {
    const { announce } = mountAnnounce()
    announce('12 results')
    await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)))
    expect(politeRegion()?.textContent).toBe('12 results')
    expect(assertiveRegion()?.textContent).toBe('')
  })

  it('routes assertive messages to the assertive region', async () => {
    const { announce } = mountAnnounce()
    announce('Upload failed', 'assertive')
    await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)))
    expect(assertiveRegion()?.textContent).toBe('Upload failed')
    expect(politeRegion()?.textContent).toBe('')
  })

  it('repeats an identical message by clearing the region first', async () => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0)
      return 1
    })
    const { announce } = mountAnnounce()
    announce('No results found')
    expect(politeRegion()?.textContent).toBe('No results found')
    announce('No results found')
    expect(politeRegion()?.textContent).toBe('No results found')
  })

  it('clears a region when the message is empty, and drops the text after a delay', () => {
    vi.useFakeTimers()
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0)
      return 1
    })
    const { announce } = mountAnnounce()
    announce('Saved')
    expect(politeRegion()?.textContent).toBe('Saved')
    announce('')
    expect(politeRegion()?.textContent).toBe('')

    announce('Saved again')
    vi.advanceTimersByTime(2000)
    expect(politeRegion()?.textContent).toBe('')
  })
})
