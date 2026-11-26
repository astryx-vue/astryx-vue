import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import ChatLayout from './ChatLayout.vue'
import ChatMessageList from './ChatMessageList.vue'
import ChatSystemMessage from './ChatSystemMessage.vue'

const { announce } = vi.hoisted(() => ({ announce: vi.fn() }))

vi.mock('../composables/internal/announce.js', async importOriginal => ({
  ...await importOriginal<typeof import('../composables/internal/announce.js')>(),
  useAnnouncer: () => announce,
}))

type ObserverCallback = (entries: Array<{ isIntersecting: boolean }>) => void
let observerCallback: ObserverCallback | null = null

class FakeIntersectionObserver {
  constructor(callback: ObserverCallback) {
    observerCallback = callback
  }

  observe(): void {}
  disconnect(): void {}
  unobserve(): void {}
  takeRecords(): [] {
    return []
  }
}

const mounted: Array<{ unmount: () => void }> = []

beforeEach(() => {
  announce.mockClear()
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
})

afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  vi.unstubAllGlobals()
})

function frame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()))
}

describe('chatMessageList 顶部加载', () => {
  it('转圈自己静音，加载由列表通过共用通道念一次', async () => {
    let finish: () => void = () => {}
    const scrollToTopAction = vi.fn(() => new Promise<void>((resolve) => {
      finish = resolve
    }))
    const wrapper = mount(ChatMessageList, {
      attachTo: document.body,
      props: { scrollToTopAction },
      slots: { default: () => h('div', 'row') },
    })
    mounted.push(wrapper)
    await nextTick()

    observerCallback?.([{ isIntersecting: true }])
    await nextTick()

    const spinner = wrapper.get('.astryx-chat-message-list__loading .astryx-spinner')
    expect(spinner.attributes('aria-hidden')).toBe('true')
    await frame()
    expect(announce.mock.calls.map(([message]) => message)).toEqual(['Loading'])

    await nextTick()
    await frame()
    expect(announce).toHaveBeenCalledTimes(1)

    finish()
    await vi.waitFor(() => expect(wrapper.find('.astryx-chat-message-list__loading').exists()).toBe(false))
  })
})

describe('空内容判断', () => {
  it('列表的默认插槽只渲染出注释时显示空状态', () => {
    const wrapper = mount(ChatMessageList, {
      slots: {
        default: () => [null],
        emptyState: () => h('p', { class: 'empty' }, 'Nothing yet'),
      },
    })
    expect(wrapper.find('.empty').exists()).toBe(true)
  })

  it('布局的默认插槽没有内容时显示 empty 插槽', () => {
    const wrapper = mount(ChatLayout, {
      slots: {
        default: () => [null],
        empty: () => h('p', { class: 'empty' }, 'Start a conversation'),
      },
    })
    expect(wrapper.find('.astryx-chat-layout__empty .empty').exists()).toBe(true)
  })

  it('系统消息的图标插槽没有内容时不画图标外壳', () => {
    const wrapper = mount(ChatSystemMessage, {
      slots: { default: 'Joined', icon: () => [null, ''] },
    })
    expect(wrapper.find('.astryx-chat-system-message__icon').exists()).toBe(false)

    const withIcon = mount(ChatSystemMessage, {
      slots: { default: 'Joined', icon: () => h('i', 'x') },
    })
    expect(withIcon.find('.astryx-chat-system-message__icon').exists()).toBe(true)
  })
})
