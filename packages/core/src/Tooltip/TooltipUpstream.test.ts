import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import Tooltip from './Tooltip.vue'

enableAutoUnmount(afterEach)

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

describe('tooltip 上游场景回归', () => {
  it('锚点包含 Tooltip 自身时也能绑定、打开并在卸载时还原', async () => {
    const openChange = vi.fn()
    const Host = defineComponent({
      components: { Tooltip },
      setup() {
        return { anchor: ref<HTMLElement | null>(null), openChange }
      },
      template: `
        <div ref="anchor">
          <button type="button">Inner</button>
          <Tooltip content="Sibling tooltip" :anchor="anchor" :delay="0" @open-change="openChange" />
        </div>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    const anchor = wrapper.get('div').element as HTMLElement
    const bubble = document.querySelector<HTMLElement>('[role="tooltip"]')!

    expect(anchor.getAttribute('aria-describedby')).toBe(bubble.id)
    anchor.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(0)
    await nextTick()
    expect(openChange).toHaveBeenCalledWith(true)

    wrapper.unmount()
    expect(anchor.hasAttribute('aria-describedby')).toBe(false)
  })

  it('svg 触发器保留 ARIA 关联并能通过悬停打开', async () => {
    const wrapper = mount(Tooltip, {
      attachTo: document.body,
      props: { content: 'Shared memory', delay: 0 },
      slots: { default: '<svg data-testid="icon" aria-hidden="true"><circle cx="8" cy="8" r="6" /></svg>' },
    })
    const icon = wrapper.get('[data-testid="icon"]')
    const bubble = document.querySelector<HTMLElement>('[role="tooltip"]')!

    expect(icon.attributes('aria-describedby')).toBe(bubble.id)
    icon.trigger('mouseenter')
    vi.advanceTimersByTime(0)
    await nextTick()
    expect(bubble.style.display).not.toBe('none')
    expect(wrapper.emitted('openChange')).toEqual([[true]])
  })
})
