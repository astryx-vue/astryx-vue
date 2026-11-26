import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import ChatLayout from './ChatLayout.vue'

const mounted: Array<{ unmount: () => void }> = []

afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  vi.restoreAllMocks()
})

function mountLayout(props: Record<string, unknown> = {}) {
  const wrapper = mount(ChatLayout, {
    attachTo: document.body,
    props,
    slots: {
      default: () => h('div', 'messages'),
      composer: () => h('div', 'composer'),
    },
  })
  mounted.push(wrapper)
  return wrapper
}

function stubDockHeight(dockHeight: number): void {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const height = this.classList.contains('astryx-chat-layout__dock') ? dockHeight : 0
    return { top: 0, left: 0, bottom: height, x: 0, y: 0, width: 0, height, toJSON: () => ({}) } as DOMRect
  })
}

describe('chatLayout 外部滚动时的底部留白', () => {
  it('消息区的底部留白加上固定输入区的高度，最新一条消息落在它上面', async () => {
    stubDockHeight(142)
    const wrapper = mountLayout({ scrollRef: document.createElement('div') })
    await nextTick()

    const area = wrapper.get('.astryx-chat-layout__messages').element as HTMLElement
    expect(area.style.paddingBlockEnd).toBe('calc(var(--astryx-spacing-6, 24px) + 142px)')
  })

  it('自己滚动时输入区在文档流里（sticky），不额外加留白', async () => {
    stubDockHeight(142)
    const wrapper = mountLayout()
    await nextTick()
    const area = wrapper.get('.astryx-chat-layout__messages').element as HTMLElement
    expect(area.style.paddingBlockEnd).toBe('')
  })

  it('从外部滚动切回自己滚动时留白撤掉', async () => {
    stubDockHeight(100)
    const wrapper = mountLayout({ scrollRef: document.createElement('div') })
    await nextTick()
    const area = wrapper.get('.astryx-chat-layout__messages').element as HTMLElement
    expect(area.style.paddingBlockEnd).toContain('100px')

    await wrapper.setProps({ scrollRef: undefined })
    await nextTick()
    expect(area.style.paddingBlockEnd).toBe('')
  })
})
