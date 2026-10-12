import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Thumbnail from './Thumbnail.vue'

describe('thumbnail', () => {
  it('shows the image placeholder when there is no source', () => {
    const wrapper = mount(Thumbnail, { props: { label: 'report.pdf' } })
    expect(wrapper.get('[role="group"]').attributes('aria-label')).toBe('report.pdf')
    expect(wrapper.find('.astryx-thumbnail__placeholder').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('renders a remove button only when a listener is provided', async () => {
    const wrapper = mount(Thumbnail, {
      props: { label: 'photo.jpg', showRemoveOn: 'always' },
      attrs: { onRemove: () => {} },
    })
    const button = wrapper.get('button')
    expect(button.attributes('aria-label')).toBe('Remove photo.jpg')
    await button.trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
  })

  it('dims a disabled thumbnail and drops the remove button', () => {
    const wrapper = mount(Thumbnail, {
      props: { label: 'photo.jpg', isDisabled: true },
      attrs: { onRemove: () => {} },
    })
    expect(wrapper.get('.astryx-thumbnail').attributes('data-disabled')).toBe('true')
    expect(wrapper.find('button').exists()).toBe(false)
  })
})
