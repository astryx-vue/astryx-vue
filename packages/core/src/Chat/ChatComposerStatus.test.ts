import type { ChatComposerStatus } from './composerTypes.js'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import ChatComposer from './ChatComposer.vue'

const { announce } = vi.hoisted(() => ({ announce: vi.fn() }))

vi.mock('../composables/useAnnounce.js', () => ({
  useAnnounce: () => announce,
}))

beforeEach(() => {
  announce.mockClear()
})

function renderStatus(status?: ChatComposerStatus) {
  return mount(ChatComposer, { props: { status } })
}

describe('chatComposer 状态播报', () => {
  it('状态文字保持可见，但节点自身不带 live role', () => {
    const wrapper = renderStatus({ type: 'error', message: 'Send failed' })
    const message = wrapper.get('.astryx-chat-composer__status')

    expect(message.text()).toContain('Send failed')
    expect(message.attributes('role')).toBeUndefined()
    expect(message.attributes('aria-live')).toBeUndefined()
  })

  it('error 走 assertive，warning 走 polite', async () => {
    const wrapper = renderStatus()
    expect(announce).not.toHaveBeenCalled()

    await wrapper.setProps({ status: { type: 'error', message: 'Send failed' } })
    await wrapper.setProps({ status: { type: 'warning', message: 'Offline' } })
    expect(announce.mock.calls).toEqual([
      ['Send failed', 'assertive'],
      ['Offline', 'polite'],
    ])
  })

  it('相同状态重渲染不重复，清除后可以再次播报', async () => {
    const status = { type: 'error', message: 'Send failed' } as const
    const wrapper = renderStatus(status)
    await nextTick()
    await wrapper.setProps({ status: { ...status } })
    expect(announce.mock.calls).toEqual([['Send failed', 'assertive']])

    await wrapper.setProps({ status: undefined })
    await wrapper.setProps({ status })
    expect(announce.mock.calls).toEqual([
      ['Send failed', 'assertive'],
      ['Send failed', 'assertive'],
    ])
  })

  it('没有消息文字时不播报', () => {
    renderStatus({ type: 'warning' })
    expect(announce).not.toHaveBeenCalled()
  })
})
