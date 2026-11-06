import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Switch from './Switch.vue'

const { announce } = vi.hoisted(() => ({ announce: vi.fn() }))

vi.mock('../composables/useAnnounce.js', () => ({
  useAnnounce: () => announce,
}))

beforeEach(() => {
  announce.mockClear()
})

describe('switch 忙碌播报', () => {
  it('同一次忙碌只播报一次，结束后再进入忙碌才重新播报', async () => {
    const wrapper = mount(Switch, {
      props: { label: 'Sync photos', modelValue: false, isLoading: true },
    })
    await nextTick()
    await wrapper.setProps({ label: 'Sync photos' })
    expect(announce.mock.calls).toEqual([['Loading']])

    await wrapper.setProps({ isLoading: false })
    await wrapper.setProps({ isLoading: true })
    expect(announce.mock.calls).toEqual([
      ['Loading'],
      ['Loading'],
    ])
  })
})
