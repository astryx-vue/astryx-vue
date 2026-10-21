import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { provideAstryxLocale } from '../locale/context.js'
import InputClearButton from './InputClearButton.vue'

function mountClear(label: string, locale?: string) {
  const Parent = defineComponent({
    setup() {
      if (locale != null)
        provideAstryxLocale(locale)
      return () => h(InputClearButton, { label, class: 'extra-clear' })
    },
  })
  return mount(Parent, { attachTo: document.body })
}

describe('inputClearButton', () => {
  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('提示只说 Clear，无障碍名保留字段名', async () => {
    vi.useFakeTimers()
    const wrapper = mountClear('Clear Name')
    const button = wrapper.get('button')
    expect(button.attributes('aria-label')).toBe('Clear Name')
    expect(button.classes()).toContain('astryx-input-clear-button')
    expect(button.classes()).toContain('extra-clear')
    expect(wrapper.find('.astryx-input-clear-icon').exists()).toBe(true)

    await button.trigger('pointerenter')
    vi.advanceTimersByTime(200)
    await nextTick()
    expect(document.body.querySelector('[role="tooltip"]')?.textContent).toBe('Clear')
    wrapper.unmount()
  })

  it('中文提示是「清除」，无障碍名仍然带字段名', async () => {
    vi.useFakeTimers()
    const wrapper = mountClear('清除姓名', 'zh-CN')
    expect(wrapper.get('button').attributes('aria-label')).toBe('清除姓名')
    await wrapper.get('button').trigger('pointerenter')
    vi.advanceTimersByTime(200)
    await nextTick()
    expect(document.body.querySelector('[role="tooltip"]')?.textContent).toBe('清除')
    wrapper.unmount()
  })
})
