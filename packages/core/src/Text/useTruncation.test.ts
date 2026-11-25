import type { FakeResizeObserver } from '../composables/testing/fakeResizeObserver.js'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, defineComponent, effectScope, nextTick } from 'vue'
import { installFakeResizeObserver } from '../composables/testing/fakeResizeObserver.js'
import Heading from '../Heading/Heading.vue'
import { observeResize } from '../utils/sharedResizeObserver.js'
import Text from './Text.vue'
import { useTruncation } from './useTruncation.js'

enableAutoUnmount(afterEach)

let resize: FakeResizeObserver

beforeEach(() => {
  resize = installFakeResizeObserver()
})

afterEach(() => {
  resize.restore()
})

const Probe = defineComponent({
  props: { text: { type: String, required: true } },
  setup() {
    const truncation = useTruncation(computed(() => 1))
    return { truncation }
  },
  template: '<span :ref="truncation.bind">{{ text }}</span><output>{{ truncation.fullText }}</output>',
})

function countScrollWidthReads(run: () => void): number {
  const prototype = window.HTMLElement.prototype
  const original = Object.getOwnPropertyDescriptor(prototype, 'scrollWidth')
  let reads = 0
  Object.defineProperty(prototype, 'scrollWidth', {
    configurable: true,
    get() {
      reads++
      return 0
    },
  })
  try {
    run()
  }
  finally {
    if (original)
      Object.defineProperty(prototype, 'scrollWidth', original)
    else
      delete (prototype as { scrollWidth?: number }).scrollWidth
  }
  return reads
}

describe('useTruncation', () => {
  it('updates the captured text when content changes without a resize', async () => {
    const wrapper = mount(Probe, { attachTo: document.body, props: { text: 'planning the first step' } })
    resize.notify()
    await nextTick()
    expect(wrapper.get('output').text()).toBe('planning the first step')

    await wrapper.setProps({ text: 'writing the second step' })
    await vi.waitFor(() => expect(wrapper.get('output').text()).toBe('writing the second step'))
  })

  it('does not measure Text or Heading when the truncation tooltip is off', () => {
    const reads = countScrollWidthReads(() => {
      mount(Text, { props: { maxLines: 1, hasTruncateTooltip: false }, slots: { default: 'Long text' } })
      mount(Heading, { props: { level: 2, maxLines: 1, hasTruncateTooltip: false }, slots: { default: 'Long heading' } })
      resize.notify()
    })
    expect(reads).toBe(0)
  })

  it('takes the first measurement from the shared observer, not while mounting', () => {
    const readsWhileMounting = countScrollWidthReads(() => {
      mount(Text, { props: { maxLines: 1 }, slots: { default: 'Long text' } })
    })
    expect(readsWhileMounting).toBe(0)
    expect(countScrollWidthReads(() => resize.notify())).toBeGreaterThan(0)
  })

  it('measures an element another subscriber already observes in a microtask', async () => {
    const element = document.createElement('span')
    element.textContent = 'Shared cell'
    const stopOther = observeResize(element, () => {})
    const scope = effectScope()
    const truncation = scope.run(() => useTruncation(() => 1))!

    truncation.bind(element)
    expect(truncation.fullText.value).toBe('')
    await Promise.resolve()
    expect(truncation.fullText.value).toBe('Shared cell')

    scope.stop()
    stopOther()
  })

  it('measures at once where there is no ResizeObserver', () => {
    vi.stubGlobal('ResizeObserver', undefined)
    try {
      const element = document.createElement('span')
      element.textContent = 'Old browser'
      const scope = effectScope()
      const truncation = scope.run(() => useTruncation(() => 1))!
      truncation.bind(element)
      expect(truncation.fullText.value).toBe('Old browser')
      scope.stop()
    }
    finally {
      vi.unstubAllGlobals()
    }
  })
})
