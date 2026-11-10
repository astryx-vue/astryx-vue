import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { computed, defineComponent, nextTick } from 'vue'
import Heading from '../Heading/Heading.vue'
import Text from './Text.vue'
import { useTruncation } from './useTruncation.js'

enableAutoUnmount(afterEach)

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
    await nextTick()
    expect(wrapper.get('output').text()).toBe('planning the first step')

    await wrapper.setProps({ text: 'writing the second step' })
    await vi.waitFor(() => expect(wrapper.get('output').text()).toBe('writing the second step'))
  })

  it('does not measure Text or Heading when the truncation tooltip is off', () => {
    const reads = countScrollWidthReads(() => {
      mount(Text, { props: { maxLines: 1, hasTruncateTooltip: false }, slots: { default: 'Long text' } })
      mount(Heading, { props: { level: 2, maxLines: 1, hasTruncateTooltip: false }, slots: { default: 'Long heading' } })
    })
    expect(reads).toBe(0)
  })

  it('still measures when the tooltip is enabled', () => {
    const reads = countScrollWidthReads(() => {
      mount(Text, { props: { maxLines: 1 }, slots: { default: 'Long text' } })
    })
    expect(reads).toBeGreaterThan(0)
  })
})
