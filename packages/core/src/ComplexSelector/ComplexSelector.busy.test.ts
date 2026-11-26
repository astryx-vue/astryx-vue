import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import { resetLiveRegionsForTest } from '../composables/internal/announce.js'
import ComplexSelector from './ComplexSelector.vue'

function nextFrame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()))
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('complexSelector 忙碌时的播报', () => {
  it('框里的转圈对读屏隐藏，进入忙碌只念一次 Loading', async () => {
    resetLiveRegionsForTest()
    const wrapper = mount(ComplexSelector, {
      attachTo: document.body,
      props: { modelValue: 'a', label: 'Plan', isLoading: false },
      slots: { default: () => h('div', 'Body') },
    })
    await nextFrame()
    await nextFrame()
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent ?? '').toBe('')

    await wrapper.setProps({ isLoading: true })
    await nextFrame()
    await nextFrame()
    expect(wrapper.get('.astryx-spinner').attributes('aria-hidden')).toBe('true')
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('Loading')
    wrapper.unmount()
  })
})
