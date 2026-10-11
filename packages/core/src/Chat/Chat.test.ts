import type { ChatToolCallItem } from './types.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { resetLiveRegionsForTest } from '../composables/testing/resetLiveRegions.js'
import { provideAstryxLocale } from '../locale/index.js'
import ChatLayout from './ChatLayout.vue'
import ChatLayoutScrollButton from './ChatLayoutScrollButton.vue'
import ChatMessage from './ChatMessage.vue'
import ChatMessageBubble from './ChatMessageBubble.vue'
import ChatMessageList from './ChatMessageList.vue'
import ChatMessageMetadata from './ChatMessageMetadata.vue'
import ChatReasoning from './ChatReasoning.vue'
import ChatSystemMessage from './ChatSystemMessage.vue'
import ChatToolCalls from './ChatToolCalls.vue'
import ChatTypingIndicator from './ChatTypingIndicator.vue'
import ChatUnreadDivider from './ChatUnreadDivider.vue'

afterEach(() => {
  resetLiveRegionsForTest()
})

const calls: ChatToolCallItem[] = [
  { name: 'search_docs', status: 'complete', target: 'notes.md', duration: '0.4s', detail: 'Matched the release section' },
  { name: 'read_file', status: 'error', target: 'missing.md', errorMessage: 'File not found' },
]

describe('chat layout', () => {
  it('scrolls itself and keeps the transcript in a column', () => {
    const wrapper = mount(ChatLayout, {
      slots: {
        default: '<p class="transcript">Hello</p>',
        composer: '<form class="composer" />',
      },
    })

    const root = wrapper.get('.astryx-chat-layout')
    expect(root.attributes('data-density')).toBe('balanced')
    expect(root.attributes('data-scroll')).toBe('self')
    expect(wrapper.get('.transcript').text()).toBe('Hello')
    expect(wrapper.get('.composer').element.tagName).toBe('FORM')
    expect(wrapper.get('.astryx-chat-layout__messages').element.tagName).toBe('DIV')
    expect(wrapper.find('.astryx-chat-scroll-button').exists()).toBe(true)
  })

  it('marks an external scroll parent and can hide the scroll button', () => {
    const scrollParent = document.createElement('div')
    const wrapper = mount(ChatLayout, {
      props: { density: 'compact', scrollRef: scrollParent, showScrollButton: false },
      slots: { default: '<p>Hello</p>' },
    })

    const root = wrapper.get('.astryx-chat-layout')
    expect(root.attributes('data-density')).toBe('compact')
    expect(root.attributes('data-scroll')).toBe('external')
    expect(wrapper.find('.astryx-chat-scroll-button').exists()).toBe(false)
  })

  it('renders the empty slot only when the transcript slot is omitted', () => {
    const wrapper = mount(ChatLayout, {
      slots: { empty: '<p class="empty">Nothing yet</p>' },
    })

    expect(wrapper.get('.empty').text()).toBe('Nothing yet')
  })
})

describe('chat layout scroll button', () => {
  it('stays inert while hidden and exposes the localized name', async () => {
    const wrapper = mount(ChatLayoutScrollButton, {
      props: { isVisible: false },
    })

    expect(wrapper.get('.astryx-chat-scroll-button__pill').attributes('inert')).toBeDefined()
    expect(wrapper.get('button').attributes('aria-label')).toBe('Scroll to bottom')

    await wrapper.setProps({ isVisible: true, label: 'New messages' })
    expect(wrapper.get('.astryx-chat-scroll-button__pill').attributes('inert')).toBeUndefined()
    expect(wrapper.get('button').text()).toContain('New messages')

    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})

describe('chat message list', () => {
  it('is a polite log and marks itself busy while streaming', () => {
    const wrapper = mount(ChatMessageList, {
      props: { isStreaming: true, label: 'Transcript' },
      slots: { default: '<p>Hi</p>' },
    })

    const log = wrapper.get('.astryx-chat-message-list')
    expect(log.attributes('role')).toBe('log')
    expect(log.attributes('aria-live')).toBe('polite')
    expect(log.attributes('aria-busy')).toBe('true')
    expect(log.attributes('aria-label')).toBe('Transcript')
  })

  it('uses the localized log name and the empty slot', () => {
    const wrapper = mount(defineComponent({
      setup() {
        provideAstryxLocale('zh-CN')
        return () => h(ChatMessageList, null, { empty: () => '还没有消息' })
      },
    }))

    expect(wrapper.get('.astryx-chat-message-list').attributes('aria-label')).toBe('消息列表')
    expect(wrapper.text()).toContain('还没有消息')
  })
})

describe('chat message', () => {
  it('names a user row from the sender when no display name is set', () => {
    const wrapper = mount(ChatMessage, {
      props: { sender: 'user' },
      slots: {
        default: '<p class="body">Hello</p>',
        avatar: '<span class="avatar" />',
      },
    })

    const article = wrapper.get('article.astryx-chat-message')
    expect(article.attributes('data-sender')).toBe('user')
    expect(article.attributes('aria-label')).toBe('Message from user')
    expect(wrapper.get('.avatar').element.tagName).toBe('SPAN')
    expect(wrapper.get('.body').text()).toBe('Hello')
  })

  it('labels the row from the name and ignores avatar on system rows', () => {
    const named = mount(ChatMessage, {
      props: { sender: 'assistant', name: 'Ada' },
      slots: { default: 'Answer' },
    })
    const name = named.get('[data-chat-name]')
    expect(named.get('article').attributes('aria-labelledby')).toBe(name.attributes('id'))
    expect(name.text()).toBe('Ada')

    const system = mount(ChatMessage, {
      props: { sender: 'system' },
      slots: {
        avatar: '<span class="avatar" />',
        metadata: '<span class="meta" />',
        default: 'Joined',
      },
    })
    expect(system.find('.avatar').exists()).toBe(false)
    expect(system.find('.meta').exists()).toBe(false)
  })

  it('paints a bubble from the message context and aligns metadata', () => {
    const wrapper = mount(ChatMessage, {
      props: { sender: 'assistant', density: 'compact' },
      slots: {
        default: () => h(ChatMessageBubble, { variant: 'ghost', group: 'first' }, {
          default: () => 'Noted',
          metadata: () => h(ChatMessageMetadata, { timestamp: '09:41', footer: 'fig-small', status: 'read' }),
        }),
      },
    })

    const bubble = wrapper.get('.astryx-chat-message-bubble')
    expect(bubble.attributes('data-sender')).toBe('assistant')
    expect(bubble.attributes('data-variant')).toBe('ghost')
    expect(bubble.attributes('data-density')).toBe('compact')
    expect(bubble.attributes('data-group')).toBe('first')
    expect(bubble.text()).toContain('Noted')

    const status = wrapper.get('.astryx-chat-metadata__status')
    expect(status.attributes('data-status')).toBe('read')
    expect(status.attributes('aria-label')).toBe('Message read')
    expect(status.text()).toContain('Read')
  })

  it('localizes a failed status and renders nothing without metadata', () => {
    const zh = mount(defineComponent({
      setup() {
        provideAstryxLocale('zh-CN')
        return () => h(ChatMessage, { sender: 'user' }, {
          default: () => h(ChatMessageMetadata, { status: 'error' }),
        })
      },
    }))
    expect(zh.get('.astryx-chat-metadata__status').attributes('aria-label')).toBe('消息发送失败')
    expect(zh.text()).toContain('发送失败')

    const empty = mount(ChatMessageMetadata)
    expect(empty.find('.astryx-chat-metadata').exists()).toBe(false)
  })
})

describe('chat system message', () => {
  it('centers a status line and can render a divider', () => {
    const line = mount(ChatSystemMessage, {
      slots: {
        default: 'Session started',
        icon: '<span class="mark" />',
      },
    })
    expect(line.get('.astryx-chat-system-message').attributes('role')).toBe('status')
    expect(line.get('.astryx-chat-system-message').attributes('data-variant')).toBe('default')
    expect(line.text()).toContain('Session started')
    expect(line.get('.mark').element.tagName).toBe('SPAN')

    const divider = mount(ChatSystemMessage, {
      props: { variant: 'divider' },
      slots: { default: 'Today' },
    })
    expect(divider.get('.astryx-chat-system-message').attributes('data-variant')).toBe('divider')
    expect(divider.text()).toContain('Today')
  })
})

describe('chat tool calls', () => {
  it('renders nothing for an empty list and one row for a single call', async () => {
    expect(mount(ChatToolCalls, { props: { calls: [] } }).find('.astryx-chat-tool-calls').exists()).toBe(false)

    const wrapper = mount(ChatToolCalls, {
      props: {
        calls: [{ name: 'search_docs', status: 'complete', additions: 12, deletions: 3, duration: '1.2s', detail: 'notes.md' }],
      },
    })
    expect(wrapper.get('.astryx-chat-tool-calls__name').text()).toBe('search_docs')
    expect(wrapper.text()).toContain('+12')
    expect(wrapper.text()).toContain('-3')
    expect(wrapper.text()).toContain('1.2s')
    expect(wrapper.find('.astryx-chat-tool-calls__detail').exists()).toBe(false)

    await wrapper.get('button').trigger('click')
    expect(wrapper.get('button').attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('.astryx-chat-tool-calls__detail').text()).toContain('notes.md')
  })

  it('collapses a group, speaks an error, and honors a custom label', async () => {
    const expanded = ref(false)
    const wrapper = mount(defineComponent({
      setup() {
        return () => h(ChatToolCalls, {
          calls,
          'label': 'Lookups',
          'isExpanded': expanded.value,
          'onUpdate:isExpanded': (value: boolean | undefined) => {
            expanded.value = value ?? false
          },
          'onExpandedChange': (value: boolean) => {
            expanded.value = value
          },
        })
      },
    }))

    expect(wrapper.get('.astryx-chat-tool-calls__name').text()).toBe('read_file')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('Error: File not found')
    expect(wrapper.get('.astryx-chat-tool-calls > button').attributes('aria-expanded')).toBe('false')
    expect(wrapper.get('.astryx-chat-tool-calls__panel').attributes('inert')).toBeDefined()

    await wrapper.get('.astryx-chat-tool-calls > button').trigger('click')
    await nextTick()
    expect(expanded.value).toBe(true)
    expect(wrapper.text()).toContain('Lookups')
    expect(wrapper.get('.astryx-chat-tool-calls__panel').attributes('inert')).toBeUndefined()
  })

  it('uses the localized group label', async () => {
    const wrapper = mount(defineComponent({
      setup() {
        provideAstryxLocale('zh-CN')
        return () => h(ChatToolCalls, { calls, defaultIsExpanded: true })
      },
    }))
    expect(wrapper.text()).toContain('2 个工具调用')
  })
})

describe('chat reasoning', () => {
  it('starts collapsed, previews plain text, and expands on click', async () => {
    const wrapper = mount(ChatReasoning, {
      props: { duration: '4s' },
      slots: { default: 'Checked the changelog first.' },
    })

    const button = wrapper.get('button')
    expect(button.attributes('aria-expanded')).toBe('false')
    expect(button.text()).toContain('Thinking')
    expect(button.text()).toContain('4s')
    expect(button.text()).toContain('Checked the changelog first.')
    expect(wrapper.get('.astryx-chat-reasoning__panel').attributes('inert')).toBeDefined()

    await button.trigger('click')
    expect(wrapper.emitted('expandedChange')?.[0]).toEqual([true])
    expect(button.attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('.astryx-chat-reasoning__panel').attributes('inert')).toBeUndefined()
    expect(wrapper.get('.astryx-chat-reasoning__body').text()).toContain('Checked the changelog first.')
  })

  it('hides the duration and preview while streaming', () => {
    const wrapper = mount(ChatReasoning, {
      props: { isStreaming: true, duration: '4s', label: 'Drafting' },
      slots: { default: 'Still writing.' },
    })

    const root = wrapper.get('.astryx-chat-reasoning')
    expect(root.attributes('data-streaming')).toBeDefined()
    expect(wrapper.text()).toContain('Drafting')
    expect(wrapper.text()).not.toContain('4s')
    expect(wrapper.get('.astryx-chat-reasoning__header').text()).not.toContain('Still writing.')
  })
})

describe('chat typing indicator', () => {
  it('builds a sentence from the name count and exposes one status region', () => {
    const dots = mount(ChatTypingIndicator)
    expect(dots.find('.astryx-chat-typing__label').exists()).toBe(false)
    expect(dots.get('.astryx-chat-typing').attributes('role')).toBe('status')

    const one = mount(ChatTypingIndicator, { props: { names: ['Ada'] } })
    const region = one.get('.astryx-chat-typing')
    expect(one.get('.astryx-chat-typing__label').text()).toBe('Ada is typing…')
    expect(region.attributes('role')).toBe('status')
    expect(region.attributes('aria-live')).toBe('polite')
    expect(region.attributes('aria-label')).toBeUndefined()
    expect(document.querySelector('[data-astryx-live-region="polite"]')).toBeNull()

    expect(mount(ChatTypingIndicator, { props: { names: ['Ada', 'Grace'] } }).text()).toContain('Ada and Grace are typing…')
    expect(mount(ChatTypingIndicator, { props: { names: ['Ada', 'Grace', 'Lin'] } }).text()).toContain('Ada and 2 others are typing…')
  })

  it('localizes the sentence', () => {
    const wrapper = mount(defineComponent({
      setup() {
        provideAstryxLocale('zh-CN')
        return () => h(ChatTypingIndicator, { names: ['阿青'] })
      },
    }))
    expect(wrapper.text()).toContain('阿青 正在输入…')
  })
})

describe('chat unread divider', () => {
  it('names the unread region and accepts a custom label', () => {
    const wrapper = mount(ChatUnreadDivider)
    const root = wrapper.get('.astryx-chat-unread')
    expect(root.attributes('role')).toBe('separator')
    expect(root.attributes('aria-label')).toBe('New messages below')
    expect(root.classes()).not.toContain('astryx-chat-message')
    expect(root.text()).toContain('New')

    const custom = mount(defineComponent({
      setup() {
        provideAstryxLocale('zh-CN')
        return () => h(ChatUnreadDivider)
      },
    }))
    expect(custom.get('.astryx-chat-unread').attributes('aria-label')).toBe('新消息以下是未读消息')
    expect(custom.text()).toContain('新消息')
  })

  it('stays ahead of messages that arrive after the first unread row', async () => {
    const sent = ref<string[]>([])
    const wrapper = mount(defineComponent({
      setup() {
        return () => h(ChatMessageList, null, {
          default: () => [
            h(ChatMessage, { sender: 'user' }, {
              default: () => h(ChatMessageBubble, null, () => 'Read'),
            }),
            h(ChatUnreadDivider),
            ...sent.value.map(text => h(ChatMessage, { key: text, sender: 'assistant' }, {
              default: () => h(ChatMessageBubble, null, () => text),
            })),
            h(ChatTypingIndicator, { names: ['Ada'] }),
          ],
        })
      },
    }))

    const inner = wrapper.get('.astryx-chat-message-list__inner').element
    const classes = () => [...inner.children].map(el => el.classList[0])
    expect(classes()).toEqual([
      'astryx-chat-message-list__spacer',
      'astryx-chat-message',
      'astryx-chat-unread',
      'astryx-chat-typing',
    ])

    sent.value = ['A new line']
    await nextTick()

    expect(classes()).toEqual([
      'astryx-chat-message-list__spacer',
      'astryx-chat-message',
      'astryx-chat-unread',
      'astryx-chat-message',
      'astryx-chat-typing',
    ])
    const nodes = [...inner.children]
    const dividerIndex = nodes.findIndex(el => el.classList.contains('astryx-chat-unread'))
    const messageIndexes = nodes.flatMap((el, index) => el.classList.contains('astryx-chat-message') ? [index] : [])
    expect(nodes[messageIndexes[1] ?? -1]?.textContent).toContain('A new line')
    expect(messageIndexes[0]).toBeLessThan(dividerIndex)
    expect(dividerIndex).toBeLessThan(messageIndexes[1] ?? -1)
  })
})
