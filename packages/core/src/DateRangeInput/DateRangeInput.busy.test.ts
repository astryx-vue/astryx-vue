import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { resetLiveRegionsForTest } from '../composables/internal/announce.js'
import DateRangeInput from './DateRangeInput.vue'

function nextFrame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()))
}

afterEach(() => {
  resetLiveRegionsForTest()
  document.body.innerHTML = ''
})

describe('dateRangeInput 弹层和忙碌', () => {
  it('关着时不挂日历，打开时才挂', async () => {
    const wrapper = mount(DateRangeInput, { attachTo: document.body, props: { label: 'Period', modelValue: null } })
    expect(document.querySelector('.astryx-date-range-calendar')).toBeNull()
    await wrapper.get('.astryx-date-range-trigger').trigger('click')
    await nextTick()
    expect(document.querySelector('.astryx-date-range-calendar')).not.toBeNull()
  })

  it('转圈不出声，进入忙碌时字段自己播报一次', async () => {
    const wrapper = mount(DateRangeInput, { attachTo: document.body, props: { label: 'Period', modelValue: null } })
    await wrapper.setProps({ isLoading: true })
    await nextFrame()
    await nextFrame()
    expect(wrapper.get('.astryx-spinner').attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('[role="status"]:not([aria-hidden="true"])').exists()).toBe(false)
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('Loading')
  })
})
