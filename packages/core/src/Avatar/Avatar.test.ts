import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import Avatar from './Avatar.vue'
import AvatarStatusDot from './AvatarStatusDot.vue'
import { resolveStatusDotMetrics } from './utils.js'

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

  it('builds initials from letters, digits and emoji, skipping punctuation', () => {
    expect(mount(Avatar, { props: { name: 'Northwind Workbench (automation)' } }).find('.astryx-avatar__fallback--initials').text()).toBe('NA')
    expect(mount(Avatar, { props: { name: '- Alice' } }).find('.astryx-avatar__fallback--initials').text()).toBe('A')
    expect(mount(Avatar, { props: { name: 'A1 9' } }).find('.astryx-avatar__fallback--initials').text()).toBe('A9')
    expect(mount(Avatar, { props: { name: '🎉 Party' } }).find('.astryx-avatar__fallback--initials').text()).toBe('🎉P')
    expect(mount(Avatar, { props: { name: '()' } }).find('.astryx-avatar__fallback--icon').exists()).toBe(true)
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

  it('defaults to the success variant', () => {
    const wrapper = mount(AvatarStatusDot)

    expect(wrapper.find('.astryx-avatar-status-dot').attributes('data-variant')).toBe('success')
  })

  it('maps the legacy info and warning names onto the current variants', () => {
    const info = mount(AvatarStatusDot, { props: { variant: 'info' } })
    const warning = mount(AvatarStatusDot, { props: { variant: 'warning' } })

    expect(info.find('.astryx-avatar-status-dot').attributes('data-variant')).toBe('success')
    expect(warning.find('.astryx-avatar-status-dot').attributes('data-variant')).toBe('error')
  })

  it('draws no glyph for success and a shape per variant otherwise', () => {
    const success = mount(AvatarStatusDot, { props: { variant: 'success' } })
    const neutral = mount(AvatarStatusDot, { props: { variant: 'neutral' } })
    const error = mount(AvatarStatusDot, { props: { variant: 'error' } })

    expect(success.find('.astryx-avatar-status-dot__glyph').exists()).toBe(false)
    expect(neutral.find('.astryx-avatar-status-dot__glyph').attributes('data-shape')).toBe('ring')
    expect(neutral.find('circle').exists()).toBe(true)
    expect(error.find('.astryx-avatar-status-dot__glyph').attributes('data-shape')).toBe('minus')
    expect(error.find('line').exists()).toBe(true)
  })

  it('sizes itself from the enclosing avatar', async () => {
    const wrapper = mount({
      components: { Avatar, AvatarStatusDot },
      data: () => ({ size: 'lg' }),
      template: `
        <Avatar name="Ana Thomas" :size="size">
          <template #status><AvatarStatusDot variant="success" label="Online" /></template>
        </Avatar>`,
    })

    const dot = wrapper.get('.astryx-avatar-status-dot')
    expect(dot.attributes('style')).toContain('--astryx-avatar-status-dot-computed-size: 20px')
    expect(dot.attributes('style')).toContain('--astryx-avatar-status-dot-computed-border-width: 2px')

    wrapper.setData({ size: 'xl' })
    await nextTick()

    expect(dot.attributes('style')).toContain('--astryx-avatar-status-dot-computed-size: 32px')
    expect(dot.attributes('style')).toContain('--astryx-avatar-status-dot-computed-border-width: 4px')
  })

  it('uses the small tier and hides the icon on tiny avatars', () => {
    const wrapper = mount({
      components: { Avatar, AvatarStatusDot },
      template: `
        <Avatar name="Ana Thomas" size="sm">
          <template #status>
            <AvatarStatusDot label="Online"><template #icon><svg data-testid="glyph" /></template></AvatarStatusDot>
          </template>
        </Avatar>`,
    })

    const dot = wrapper.get('.astryx-avatar-status-dot')
    expect(dot.attributes('style')).toContain('--astryx-avatar-status-dot-computed-size: 10px')
    expect(dot.find('[data-testid="glyph"]').exists()).toBe(false)
    expect(dot.find('circle').exists()).toBe(false)
  })

  it('renders the icon slot and drops the built-in glyph', () => {
    const wrapper = mount({
      components: { Avatar, AvatarStatusDot },
      template: `
        <Avatar name="Ana Thomas" size="lg">
          <template #status>
            <AvatarStatusDot variant="neutral" label="Verified">
              <template #icon><svg data-testid="glyph" /></template>
            </AvatarStatusDot>
          </template>
        </Avatar>`,
    })

    const dot = wrapper.get('.astryx-avatar-status-dot')
    expect(dot.find('[data-testid="glyph"]').exists()).toBe(true)
    expect(dot.find('.astryx-avatar-status-dot__glyph').exists()).toBe(false)
    expect(dot.find('.astryx-avatar-status-dot__icon').attributes('style')).toContain('width: 12px')
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

  it('composes the status label into the avatar accessible name', async () => {
    const wrapper = mount({
      components: { Avatar, AvatarStatusDot },
      template: `
        <Avatar name="Jane Doe">
          <template #status><AvatarStatusDot variant="success" label="Online" /></template>
        </Avatar>`,
    })

    await nextTick()

    const root = wrapper.get('.astryx-avatar')
    expect(root.attributes('role')).toBe('img')
    expect(root.attributes('aria-label')).toBe('Jane Doe, Online')
  })

  it('names the avatar from the status label alone', async () => {
    const wrapper = mount({
      components: { Avatar, AvatarStatusDot },
      template: `
        <Avatar>
          <template #status><AvatarStatusDot variant="neutral" label="Offline" /></template>
        </Avatar>`,
    })

    await nextTick()

    const root = wrapper.get('.astryx-avatar')
    expect(root.attributes('aria-label')).toBe('Offline')
    expect(root.attributes('aria-hidden')).toBeUndefined()
  })

  it('follows a status label that changes later', async () => {
    const wrapper = mount({
      components: { Avatar, AvatarStatusDot },
      data: () => ({ label: 'Online' }),
      template: `
        <Avatar name="Jane Doe">
          <template #status><AvatarStatusDot :label="label" /></template>
        </Avatar>`,
    })

    await nextTick()
    expect(wrapper.get('.astryx-avatar').attributes('aria-label')).toBe('Jane Doe, Online')

    wrapper.setData({ label: 'Busy' })
    await nextTick()
    expect(wrapper.get('.astryx-avatar').attributes('aria-label')).toBe('Jane Doe, Busy')
  })
})

describe('resolveStatusDotMetrics', () => {
  it('picks a discrete tier per avatar size', () => {
    expect(resolveStatusDotMetrics(20)).toEqual({ size: 10, borderWidth: 1, iconSize: 0, field: 8, stroke: 1 })
    expect(resolveStatusDotMetrics(36)).toEqual({ size: 10, borderWidth: 1, iconSize: 0, field: 8, stroke: 1 })
    expect(resolveStatusDotMetrics(40)).toEqual({ size: 20, borderWidth: 2, iconSize: 12, field: 16, stroke: 1.5 })
    expect(resolveStatusDotMetrics(72)).toEqual({ size: 20, borderWidth: 2, iconSize: 12, field: 16, stroke: 1.5 })
    expect(resolveStatusDotMetrics(96)).toEqual({ size: 32, borderWidth: 4, iconSize: 18, field: 24, stroke: 2 })
    expect(resolveStatusDotMetrics(128)).toEqual({ size: 32, borderWidth: 4, iconSize: 18, field: 24, stroke: 2 })
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

  it('passes href and to to a custom link component', () => {
    const RouterLink = defineComponent({
      name: 'RouterLink',
      props: { to: String, href: String },
      setup(props, { slots }) {
        return () => h('a', { 'data-to': props.to, 'href': props.href }, slots.default?.())
      },
    })
    const wrapper = mount(Avatar, {
      props: { as: RouterLink, href: '/people/ana', name: 'Ana Thomas', tooltip: false },
    })
    const link = wrapper.get('a.astryx-avatar')
    expect(link.attributes('href')).toBe('/people/ana')
    expect(link.attributes('data-to')).toBe('/people/ana')
  })
})
