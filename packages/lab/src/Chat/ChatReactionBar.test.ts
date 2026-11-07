import { provideAstryxLocale } from '@astryx-vue/core'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import ChatReactionBar from './ChatReactionBar.vue'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
})

const REACTIONS = [
  {
    emoji: '🎉',
    count: 4,
    isSelected: true,
    label: 'You and Dana reacted with 🎉',
  },
  { emoji: '👀', count: 2 },
]

describe('chatReactionBar', () => {
  it('renders a pill per reaction with its count', () => {
    const wrapper = mount(ChatReactionBar, { props: { reactions: REACTIONS }, attachTo: document.body })
    expect(wrapper.get('button[aria-label="You and Dana reacted with 🎉"]').text()).toContain('4')
    expect(wrapper.get('button[aria-label="2 reactions with 👀"]').text()).toContain('2')
  })

  it('reflects isSelected via aria-pressed and data-selected', () => {
    const wrapper = mount(ChatReactionBar, { props: { reactions: REACTIONS }, attachTo: document.body })
    const selected = wrapper.get('button[aria-label="You and Dana reacted with 🎉"]')
    const unselected = wrapper.get('button[aria-label="2 reactions with 👀"]')
    expect(selected.attributes('aria-pressed')).toBe('true')
    expect(unselected.attributes('aria-pressed')).toBe('false')
    expect(selected.attributes('data-selected')).toBe('true')
    expect(unselected.attributes('data-selected')).toBeUndefined()
  })

  it('uses a singular label for a single reaction', () => {
    const wrapper = mount(ChatReactionBar, {
      props: { reactions: [{ emoji: '🔥', count: 1 }] },
      attachTo: document.body,
    })
    expect(wrapper.find('button[aria-label="1 reaction with 🔥"]').exists()).toBe(true)
  })

  it('emits toggle with the pill emoji', async () => {
    const wrapper = mount(ChatReactionBar, { props: { reactions: REACTIONS }, attachTo: document.body })
    await wrapper.get('button[aria-label="2 reactions with 👀"]').trigger('click')
    expect(wrapper.emitted('toggle')).toEqual([['👀']])
  })

  it('renders as a labeled group and keeps the stable class', () => {
    const wrapper = mount(ChatReactionBar, {
      props: { reactions: REACTIONS },
      attrs: { 'data-testid': 'bar' },
      attachTo: document.body,
    })
    const bar = wrapper.get('[data-testid="bar"]')
    expect(bar.attributes('role')).toBe('group')
    expect(bar.attributes('aria-label')).toBe('Reactions')
    expect(bar.classes()).toContain('astryx-chat-reaction-bar')
  })

  it('hides the add button when add is not listened to', () => {
    const wrapper = mount(ChatReactionBar, { props: { reactions: REACTIONS }, attachTo: document.body })
    expect(wrapper.find('button[aria-label="Add reaction"]').exists()).toBe(false)
  })

  it('shows the add button when add is listened to and emits the picked emoji', async () => {
    const onAdd = vi.fn()
    const wrapper = mount(ChatReactionBar, {
      props: { reactions: REACTIONS, onAdd },
      attachTo: document.body,
    })
    expect(wrapper.find('button[aria-label="Add reaction"]').exists()).toBe(true)
    document.querySelector<HTMLButtonElement>('button[data-emoji="🔥"]')?.click()
    await nextTick()
    expect(onAdd).toHaveBeenCalledWith('🔥')
    expect(wrapper.emitted('add')).toEqual([['🔥']])
  })

  it('localizes the group label, the add button, and the count sentence', () => {
    const wrapper = mount(defineComponent({
      setup() {
        provideAstryxLocale('zh-CN')
        return () => h(ChatReactionBar, {
          reactions: [{ emoji: '🔥', count: 1 }],
          onAdd: () => {},
        })
      },
    }), { attachTo: document.body })
    expect(wrapper.get('[role="group"]').attributes('aria-label')).toBe('回应')
    expect(wrapper.find('button[aria-label="1 次 🔥 回应"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="添加回应"]').exists()).toBe(true)
  })
})
