import type { ChatComposerStatus } from './composerTypes.js'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import ChatComposer from './ChatComposer.vue'

const { announce } = vi.hoisted(() => ({ announce: vi.fn() }))

vi.mock('../composables/internal/announce.js', async importOriginal => ({
  ...await importOriginal<typeof import('../composables/internal/announce.js')>(),
  useAnnouncer: () => announce,
}))

const mounted: Array<{ unmount: () => void }> = []

beforeEach(() => {
  announce.mockClear()
})

afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
})

function renderStatus(status?: ChatComposerStatus) {
  const wrapper = mount(ChatComposer, { attachTo: document.body, props: { status } })
  mounted.push(wrapper)
  return wrapper
}

function spoken(): Array<[string, string]> {
  return announce.mock.calls.map(([message, politeness]) => [message, politeness])
}

describe('chatComposer 状态播报', () => {
  it('状态文字保持可见，但节点自身不带 live role', () => {
    const wrapper = renderStatus({ type: 'error', message: 'Send failed' })
    const message = wrapper.get('.astryx-chat-composer__status')

    expect(message.text()).toContain('Send failed')
    expect(message.attributes('role')).toBeUndefined()
    expect(message.attributes('aria-live')).toBeUndefined()
  })

  it('状态图标坐在浅色状态底上，跟随整条的浅底内容色', () => {
    for (const type of ['error', 'warning'] as const) {
      const wrapper = renderStatus({ type, message: 'Status' })
      expect(wrapper.get('.astryx-chat-composer__status .astryx-icon').attributes('data-color')).toBe('inherit')
    }
  })

  it('error 走 assertive，warning 走 polite', async () => {
    const wrapper = renderStatus()
    expect(announce).not.toHaveBeenCalled()

    await wrapper.setProps({ status: { type: 'error', message: 'Send failed' } })
    await wrapper.setProps({ status: { type: 'warning', message: 'Offline' } })
    expect(spoken()).toEqual([
      ['Send failed', 'assertive'],
      ['Offline', 'polite'],
    ])
  })

  it('相同状态重渲染不重复，清除后可以再次播报', async () => {
    const status = { type: 'error', message: 'Send failed' } as const
    const wrapper = renderStatus(status)
    await nextTick()
    await wrapper.setProps({ status: { ...status } })
    expect(spoken()).toEqual([['Send failed', 'assertive']])

    await wrapper.setProps({ status: undefined })
    await wrapper.setProps({ status })
    expect(spoken()).toEqual([
      ['Send failed', 'assertive'],
      ['Send failed', 'assertive'],
    ])
  })

  it('文字不变、类型变了算新的一次', async () => {
    const wrapper = renderStatus({ type: 'warning', message: 'Check your connection' })
    await wrapper.setProps({ status: { type: 'error', message: 'Check your connection' } })
    expect(spoken()).toEqual([
      ['Check your connection', 'polite'],
      ['Check your connection', 'assertive'],
    ])
  })

  it('页面加载完成之前就显示的状态保持安静', async () => {
    const readyState = vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading')
    try {
      renderStatus({ type: 'error', message: 'Send failed' })
      await nextTick()
      expect(announce).not.toHaveBeenCalled()
    }
    finally {
      readyState.mockRestore()
    }
  })

  it('没有消息文字时不播报', () => {
    renderStatus({ type: 'warning' })
    expect(announce).not.toHaveBeenCalled()
  })
})
