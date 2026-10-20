import type { Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { snapToGraphemeBoundary, useStreamingText } from './useStreamingText.js'

function stubMotion(matches = false): void {
  document.documentElement.style.setProperty('--astryx-duration-fast-min', '100ms')
  vi.stubGlobal('matchMedia', () => ({
    matches,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

function installFrames(): { flush: (times?: number) => Promise<void> } {
  const queue = new Map<number, FrameRequestCallback>()
  let nextId = 1
  let now = 0
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    const id = nextId
    nextId += 1
    queue.set(id, callback)
    return id
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    queue.delete(id)
  })
  return {
    async flush(times = 1) {
      for (let index = 0; index < times; index += 1) {
        const batch = [...queue.values()]
        queue.clear()
        now += 20
        for (const callback of batch)
          callback(now)
        await nextTick()
      }
    },
  }
}

function mountText(
  text: Ref<string>,
  streaming: Ref<boolean>,
  speed?: 'natural' | 'fast' | 'instant',
) {
  const Host = defineComponent({
    setup() {
      const shown = useStreamingText(text, streaming, speed == null ? undefined : { speed })
      return () => h('span', shown.value)
    },
  })
  return mount(Host)
}

describe('snapToGraphemeBoundary', () => {
  it('does not cut a surrogate pair or a zwj sequence', () => {
    expect(snapToGraphemeBoundary('😀', 1)).toBe(0)
    const sequence = '👨‍👩‍👧'
    expect(snapToGraphemeBoundary(sequence, 2)).toBe(0)
    expect(snapToGraphemeBoundary(sequence, sequence.length)).toBe(sequence.length)
  })
})

describe('useStreamingText', () => {
  afterEach(() => {
    document.documentElement.style.removeProperty('--astryx-duration-fast-min')
    vi.unstubAllGlobals()
  })

  it('returns the full source when streaming is off, instant, or reduced', async () => {
    stubMotion()
    const text = ref('hello')
    const streaming = ref(false)
    const idle = mountText(text, streaming)
    expect(idle.text()).toBe('hello')

    streaming.value = true
    const instant = mountText(text, streaming, 'instant')
    await nextTick()
    expect(instant.text()).toBe('hello')

    stubMotion(true)
    const reduced = mountText(text, streaming)
    await nextTick()
    expect(reduced.text()).toBe('hello')
  })

  it('reveals a short run per frame and snaps to the end when streaming stops', async () => {
    stubMotion()
    const frames = installFrames()
    const text = ref('hello world!!')
    const streaming = ref(true)
    const wrapper = mountText(text, streaming)
    expect(wrapper.text()).toBe('')

    await frames.flush(1)
    expect(wrapper.text()).toBe('hello worl')

    streaming.value = false
    await nextTick()
    expect(wrapper.text()).toBe('hello world!!')
  })

  it('starts again from empty after the source is cleared', async () => {
    stubMotion()
    const frames = installFrames()
    const text = ref('hello world!!')
    const streaming = ref(true)
    const wrapper = mountText(text, streaming)
    await frames.flush(2)
    expect(wrapper.text()).toBe('hello world!!')

    text.value = ''
    await nextTick()
    expect(wrapper.text()).toBe('')

    text.value = 'abcdef'
    await frames.flush(1)
    expect(wrapper.text()).toBe('abcdef')
  })

  it('restarts when a new source replaces the previous one', async () => {
    stubMotion()
    const frames = installFrames()
    const text = ref('hello world!!')
    const streaming = ref(true)
    const wrapper = mountText(text, streaming)
    await frames.flush(2)
    expect(wrapper.text()).toBe('hello world!!')

    text.value = 'abcdefghij extra'
    await nextTick()
    expect(wrapper.text()).toBe('')
    await frames.flush(1)
    expect(wrapper.text()).toBe('abcdefghij')
  })

  it('uses the faster step when speed is fast', async () => {
    stubMotion()
    const frames = installFrames()
    const text = ref('abcdefghij')
    const wrapper = mountText(text, ref(true), 'fast')
    await frames.flush(1)
    expect(wrapper.text()).toBe('abcd')
  })
})
