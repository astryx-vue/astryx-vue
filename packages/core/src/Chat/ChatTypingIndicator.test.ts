import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import ChatTypingIndicator from './ChatTypingIndicator.vue'

const { announce } = vi.hoisted(() => ({ announce: vi.fn() }))

vi.mock('../composables/useAnnounce.js', () => ({
  useAnnounce: () => announce,
}))

beforeEach(() => {
  announce.mockClear()
})

describe('chatTypingIndicator 状态播报', () => {
  it('标签可见且挂载时只播报一次，自身不带 live role', async () => {
    const wrapper = mount(ChatTypingIndicator, { props: { names: ['Ana'] } })
    const root = wrapper.get('.astryx-chat-typing')

    expect(root.text()).toContain('Ana is typing…')
    expect(root.attributes('role')).toBeUndefined()
    expect(root.attributes('aria-live')).toBeUndefined()
    await nextTick()
    await wrapper.setProps({ names: ['Ana'] })
    expect(announce.mock.calls).toEqual([['Ana is typing…', 'polite']])
  })

  it('新标签分别播报，清空不播报，同一组人再次出现算新的一次', async () => {
    const wrapper = mount(ChatTypingIndicator, { props: { names: [] } })
    expect(announce).not.toHaveBeenCalled()

    await wrapper.setProps({ names: ['Ana'] })
    await wrapper.setProps({ names: ['Ana', 'Ben'] })
    await wrapper.setProps({ names: [] })
    await wrapper.setProps({ names: ['Ana', 'Ben'] })
    expect(announce.mock.calls).toEqual([
      ['Ana is typing…', 'polite'],
      ['Ana and Ben are typing…', 'polite'],
      ['Ana and Ben are typing…', 'polite'],
    ])
  })

  it('位于 Chat log 内时交给 log，不重复播报', async () => {
    const wrapper = mount({
      components: { ChatTypingIndicator },
      template: '<div role="log"><ChatTypingIndicator :names="[\'Ana\']" /></div>',
    })
    await nextTick()

    expect(wrapper.find('[role="log"] [role="status"]').exists()).toBe(false)
    expect(announce).not.toHaveBeenCalled()
  })
})
