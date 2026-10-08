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
})
