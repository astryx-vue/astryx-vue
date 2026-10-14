import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Avatar from './Avatar.vue'
import AvatarStatusDot from './AvatarStatusDot.vue'

describe('avatar', () => {
  it('renders a span with role img and aria-label from name', () => {
    const wrapper = mount(Avatar, {
      props: {
        name: 'John Doe',
      },
    })

    const root = wrapper.find('.astryx-avatar')
    expect(root.exists()).toBe(true)
    expect(root.element.tagName).toBe('SPAN')
    expect(root.attributes('role')).toBe('img')
    expect(root.attributes('aria-label')).toBe('John Doe')
  })

  it('uses alt over name for aria-label', () => {
    const wrapper = mount(Avatar, {
      props: {
        name: 'John Doe',
        alt: 'Profile picture',
      },
    })

    expect(wrapper.find('.astryx-avatar').attributes('aria-label')).toBe('Profile picture')
  })

  it('renders presentation role when no name or alt is provided', () => {
    const wrapper = mount(Avatar)

    const root = wrapper.find('.astryx-avatar')
    expect(root.attributes('role')).toBe('presentation')
    expect(root.attributes('aria-hidden')).toBe('true')
  })

  it('renders initials from name when no src is provided', () => {
    const wrapper = mount(Avatar, {
      props: {
        name: 'John Doe',
      },
    })

    const fallback = wrapper.find('.astryx-avatar__fallback--initials')
    expect(fallback.exists()).toBe(true)
    expect(fallback.text()).toBe('JD')
  })

  it('renders a single initial for a one-word name', () => {
    const wrapper = mount(Avatar, {
      props: {
        name: 'Alice',
      },
    })

    expect(wrapper.find('.astryx-avatar__fallback--initials').text()).toBe('A')
  })

  it('renders default icon when no name and no src are provided', () => {
    const wrapper = mount(Avatar)

    expect(wrapper.find('.astryx-avatar__fallback--icon').exists()).toBe(true)
    expect(wrapper.find('.astryx-avatar__fallback--icon svg').exists()).toBe(true)
  })

  it('renders an image when src is provided', () => {
    const wrapper = mount(Avatar, {
      props: {
        src: 'https://example.com/avatar.png',
        name: 'John Doe',
      },
    })

    const img = wrapper.find('.astryx-avatar__image')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/avatar.png')
  })

  it('falls back to initials after image fails to load', async () => {
    const wrapper = mount(Avatar, {
      props: {
        src: 'https://example.com/missing.png',
        name: 'John Doe',
      },
    })

    const img = wrapper.find('.astryx-avatar__image')
    await img.trigger('error')

    expect(wrapper.find('.astryx-avatar__image').exists()).toBe(false)
    expect(wrapper.find('.astryx-avatar__fallback--initials').text()).toBe('JD')
  })

  it('uses fallbackSrc when primary src fails', async () => {
    const wrapper = mount(Avatar, {
      props: {
        src: 'https://example.com/missing.png',
        fallbackSrc: 'https://example.com/fallback.png',
        name: 'John Doe',
      },
    })

    await wrapper.find('.astryx-avatar__image').trigger('error')

    const imgs = wrapper.findAll('.astryx-avatar__image')
    expect(imgs).toHaveLength(1)
    expect(imgs[0].attributes('src')).toBe('https://example.com/fallback.png')
  })

  it('applies size and shape classes', () => {
    const wrapper = mount(Avatar, {
      props: {
        name: 'John Doe',
        size: 'lg',
        shape: 'rounded',
      },
    })

    const root = wrapper.find('.astryx-avatar')
    expect(root.classes()).toContain('astryx-avatar--rounded')
    expect(root.attributes('style')).toContain('width: 48px')
    expect(root.attributes('style')).toContain('height: 48px')
  })

  it('supports numeric size', () => {
    const wrapper = mount(Avatar, {
      props: {
        name: 'John Doe',
        size: 64,
      },
    })

    const style = wrapper.find('.astryx-avatar').attributes('style')
    expect(style).toContain('width: 64px')
    expect(style).toContain('height: 64px')
  })

  it('renders status slot content', () => {
    const wrapper = mount(Avatar, {
      props: {
        name: 'John Doe',
      },
      slots: {
        status: '<span data-testid="custom-status">online</span>',
      },
    })

    expect(wrapper.find('[data-testid="custom-status"]').exists()).toBe(true)
  })

  it('emits error event when image fails', async () => {
    const onError = vi.fn()
    const wrapper = mount(Avatar, {
      props: {
        src: 'https://example.com/missing.png',
        name: 'John Doe',
        onError,
      },
    })

    await wrapper.find('.astryx-avatar__image').trigger('error')
    expect(onError).toHaveBeenCalledOnce()
  })
})

describe('avatarStatusDot', () => {
  it('renders a span with data-variant', () => {
    const wrapper = mount(AvatarStatusDot, {
      props: {
        variant: 'success',
      },
    })

    const dot = wrapper.find('.astryx-avatar-status-dot')
    expect(dot.exists()).toBe(true)
    expect(dot.attributes('data-variant')).toBe('success')
  })

  it('exposes a label when one is provided', () => {
    const wrapper = mount(AvatarStatusDot, {
      props: { label: 'Online', variant: 'success' },
    })

    const dot = wrapper.find('.astryx-avatar-status-dot')
    expect(dot.attributes('role')).toBe('img')
    expect(dot.attributes('aria-label')).toBe('Online')
    expect(dot.attributes('aria-hidden')).toBeUndefined()
  })
})

describe('avatar interaction', () => {
  it('renders a link when href is set', () => {
    const wrapper = mount(Avatar, {
      props: { href: 'https://example.com/people/itai-jordaan', name: 'Itai Jordaan' },
    })

    const link = wrapper.find('a.astryx-avatar')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://example.com/people/itai-jordaan')
    expect(link.attributes('role')).toBeUndefined()
    expect(link.attributes('aria-label')).toBe('Itai Jordaan')
  })

  it('renders a button when a click listener is set', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Avatar, {
      props: { name: 'Margot Schroder', onClick },
    })

    const button = wrapper.find('button.astryx-avatar')
    expect(button.exists()).toBe(true)
    expect(button.attributes('type')).toBe('button')
    await button.trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('shows the name in a tooltip by default', () => {
    const wrapper = mount(Avatar, {
      attachTo: document.body,
      props: { name: 'Ana Thomas' },
    })

    expect(document.body.textContent).toContain('Ana Thomas')
    wrapper.unmount()
  })

  it('shows a custom tooltip string', () => {
    const wrapper = mount(Avatar, {
      attachTo: document.body,
      props: { name: 'Itai Jordaan', tooltip: 'Itai Jordaan · Engineering Lead' },
    })

    expect(document.body.textContent).toContain('Itai Jordaan · Engineering Lead')
    wrapper.unmount()
  })

  it('renders no tooltip when tooltip is false', () => {
    document.body.innerHTML = ''
    const wrapper = mount(Avatar, {
      attachTo: document.body,
      props: { name: 'Ana Thomas', tooltip: false },
    })

    expect(document.body.querySelector('[role="tooltip"]')).toBeNull()
    wrapper.unmount()
  })
})
