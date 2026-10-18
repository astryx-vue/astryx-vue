import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Avatar } from '../Avatar/index.js'
import AvatarGroup from './AvatarGroup.vue'
import AvatarGroupOverflow from './AvatarGroupOverflow.vue'

describe('avatarGroup', () => {
  it('renders a group with avatars', () => {
    const wrapper = mount(AvatarGroup, {
      props: {
        size: 'sm',
        shape: 'rounded',
      },
      slots: {
        default: [
          '<Avatar name="Ana Thomas" />',
          '<Avatar name="Ben Lee" />',
          '<Avatar name="Carol Davis" />',
        ],
      },
      global: {
        components: { Avatar },
      },
    })

    const group = wrapper.find('.astryx-avatar-group')
    expect(group.exists()).toBe(true)
    expect(group.attributes('role')).toBe('group')
    expect(wrapper.findAll('.astryx-avatar')).toHaveLength(3)
  })

  it('overrides child avatar size and shape from context', () => {
    const wrapper = mount(AvatarGroup, {
      props: {
        size: 'lg',
        shape: 'square',
      },
      slots: {
        default: '<Avatar name="Ana Thomas" size="xsm" shape="circle" />',
      },
      global: {
        components: { Avatar },
      },
    })

    const avatar = wrapper.find('.astryx-avatar')
    expect(avatar.classes()).toContain('astryx-avatar--square')
    expect(avatar.attributes('style')).toContain('width: 48px')
  })

  it('follows the group size when it changes', async () => {
    const wrapper = mount(AvatarGroup, {
      props: { size: 'sm' },
      slots: {
        default: '<Avatar name="Ana Thomas" />',
      },
      global: {
        components: { Avatar },
      },
    })

    expect(wrapper.find('.astryx-avatar').attributes('style')).toContain('width: 24px')

    await wrapper.setProps({ size: 'lg' })

    expect(wrapper.find('.astryx-avatar').attributes('style')).toContain('width: 48px')
  })

  it('renders overflow indicator', () => {
    const wrapper = mount(AvatarGroup, {
      props: {
        size: 'md',
      },
      slots: {
        default: [
          '<Avatar name="Ana Thomas" />',
          '<Avatar name="Ben Lee" />',
          '<AvatarGroupOverflow :count="5" />',
        ],
      },
      global: {
        components: { Avatar, AvatarGroupOverflow },
      },
    })

    const overflow = wrapper.find('.astryx-avatar-group-overflow')
    expect(overflow.exists()).toBe(true)
    expect(overflow.text()).toBe('+5')
  })

  it('renders the overflow indicator as a button once it has a click listener', async () => {
    const wrapper = mount(AvatarGroupOverflow, {
      props: { count: 7 },
      attrs: { onClick: () => {} },
    })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.attributes('role')).toBeUndefined()
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('keeps a static indicator without a click listener and accepts custom text', () => {
    const wrapper = mount(AvatarGroupOverflow, {
      props: { count: 12 },
      slots: { default: '12+' },
    })

    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.text()).toBe('12+')
  })

  it('names the group, and accepts a custom label', () => {
    const wrapper = mount(AvatarGroup, {
      slots: { default: '<span />' },
    })
    expect(wrapper.get('.astryx-avatar-group').attributes('aria-label')).toBe('Avatar group')

    const named = mount(AvatarGroup, {
      props: { label: 'Reviewers' },
      slots: { default: '<span />' },
    })
    expect(named.get('.astryx-avatar-group').attributes('aria-label')).toBe('Reviewers')
  })
})
