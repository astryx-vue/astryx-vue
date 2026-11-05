import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import ChatMessageList from './ChatMessageList.vue'
import ChatSystemMessage from './ChatSystemMessage.vue'

describe('chatSystemMessage 播报边界', () => {
  it.each(['default', 'divider'] as const)('%s 行交给外层 Chat log，不另建 live role', (variant) => {
    const wrapper = mount(ChatMessageList, {
      slots: {
        default: () => h(ChatSystemMessage, { variant, class: 'notice' }, () => 'Ana joined'),
      },
    })
    const notice = wrapper.get('.notice')

    expect(notice.element.closest('[role="log"]')).not.toBeNull()
    for (const element of [notice.element, ...notice.element.querySelectorAll('*')]) {
      expect(element.getAttribute('aria-live')).toBeNull()
      expect(['status', 'alert', 'log']).not.toContain(element.getAttribute('role'))
    }
  })

  it('保留调用方明确给出的非 live role', () => {
    const wrapper = mount(ChatSystemMessage, {
      attrs: { role: 'note' },
      slots: { default: 'Session started' },
    })

    expect(wrapper.get('.astryx-chat-system-message').attributes('role')).toBe('note')
  })
})
