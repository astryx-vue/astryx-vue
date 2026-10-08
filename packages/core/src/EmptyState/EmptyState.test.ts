import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import EmptyState from './EmptyState.vue'

describe('emptyState', () => {
  it('renders the title as a level 3 heading inside a status region', () => {
    const wrapper = mount(EmptyState, { props: { title: 'No results found' } })

    const root = wrapper.find('.astryx-empty-state')
    expect(root.exists()).toBe(true)
    expect(root.element.tagName).toBe('DIV')
    expect(root.attributes('role')).toBe('status')

    const heading = wrapper.find('h3.astryx-empty-state-title')
    expect(heading.exists()).toBe(true)
    expect(heading.text()).toBe('No results found')
  })

  it('renders the title at the requested heading level', () => {
    for (const level of [1, 2, 3, 4, 5, 6] as const) {
      const wrapper = mount(EmptyState, {
        props: { title: `Level ${level}`, headingLevel: level },
      })

      expect(wrapper.find(`h${level}.astryx-empty-state-title`).exists()).toBe(true)
      expect(wrapper.find('.astryx-empty-state').attributes('role')).toBe('status')
      wrapper.unmount()
    }
  })

  it('renders the description as a div so block content composes', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'No results', description: 'Try another search term.' },
    })

    const description = wrapper.find('.astryx-empty-state-description')
    expect(description.element.tagName).toBe('DIV')
    expect(description.text()).toBe('Try another search term.')
    expect(wrapper.find('.astryx-empty-state p').exists()).toBe(false)
  })

  it('does not render the description when it is not provided', () => {
    const wrapper = mount(EmptyState, { props: { title: 'No results' } })

    expect(wrapper.find('.astryx-empty-state-description').exists()).toBe(false)
  })

  it('lets a slot replace the title and the description text', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'No results', description: 'Try another search term.' },
      slots: {
        title: '<span class="custom-title">Nothing here</span>',
        description: '<ul class="custom-description"><li>Clear the filters</li></ul>',
      },
    })

    expect(wrapper.find('.astryx-empty-state-title .custom-title').text()).toBe('Nothing here')
    expect(wrapper.find('.astryx-empty-state-description .custom-description').exists()).toBe(true)
  })

  it('renders the icon slot in a wrapper hidden from assistive technology', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'No results' },
      slots: { icon: '<svg class="artwork" viewBox="0 0 24 24" />' },
    })

    const icon = wrapper.find('.astryx-empty-state-icon')
    expect(icon.exists()).toBe(true)
    expect(icon.attributes('aria-hidden')).toBe('true')
    expect(icon.find('svg.artwork').exists()).toBe(true)
  })

  it('does not render the icon wrapper when no icon is given', () => {
    const wrapper = mount(EmptyState, { props: { title: 'No results' } })

    expect(wrapper.find('.astryx-empty-state-icon').exists()).toBe(false)
    expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(false)
  })

  it('renders the actions slot in an actions row', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'No results' },
      slots: {
        actions: '<button type="button" class="retry">Retry</button>',
      },
    })

    const actions = wrapper.find('.astryx-empty-state-actions')
    expect(actions.exists()).toBe(true)
    expect(actions.find('button.retry').text()).toBe('Retry')
  })

  it('does not render the actions row when no actions are given', () => {
    const wrapper = mount(EmptyState, { props: { title: 'No results' } })

    expect(wrapper.find('.astryx-empty-state-actions').exists()).toBe(false)
  })

  it('marks the compact variant on the container, title, and description', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'No results', description: 'Try another search term.', isCompact: true },
    })

    expect(wrapper.find('.astryx-empty-state').attributes('data-variant')).toBe('compact')
    expect(wrapper.find('.astryx-empty-state-title').attributes('data-variant')).toBe('compact')
    expect(wrapper.find('.astryx-empty-state-description').attributes('data-variant')).toBe('compact')
  })

  it('leaves the variant off in the default layout', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'No results', description: 'Try another search term.' },
    })

    expect(wrapper.find('.astryx-empty-state').attributes('data-variant')).toBeUndefined()
    expect(wrapper.find('.astryx-empty-state-title').attributes('data-variant')).toBeUndefined()
    expect(wrapper.find('.astryx-empty-state-description').attributes('data-variant')).toBeUndefined()
  })

  it('keeps the rendered output in step with props changed after mount', async () => {
    const wrapper = mount(EmptyState, { props: { title: 'No results' } })
    expect(wrapper.find('h3.astryx-empty-state-title').exists()).toBe(true)

    await wrapper.setProps({ isCompact: true })
    expect(wrapper.find('.astryx-empty-state').attributes('data-variant')).toBe('compact')
    expect(wrapper.find('.astryx-empty-state-title').attributes('data-variant')).toBe('compact')

    await wrapper.setProps({ headingLevel: 2 })
    expect(wrapper.find('h2.astryx-empty-state-title').exists()).toBe(true)
    expect(wrapper.find('h3.astryx-empty-state-title').exists()).toBe(false)

    await wrapper.setProps({ description: 'Added later' })
    await nextTick()
    expect(wrapper.find('.astryx-empty-state-description').text()).toBe('Added later')
  })

  it('exposes the root element', () => {
    const wrapper = mount(EmptyState, { props: { title: 'No results' } })

    expect(wrapper.vm.element).toBe(wrapper.find('.astryx-empty-state').element)
  })

  it('forwards attributes to the root and lets an explicit role win', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'No results' },
      attrs: { 'class': 'custom-class', 'data-testid': 'empty-state', 'role': 'region' },
    })

    const root = wrapper.find('.astryx-empty-state')
    expect(root.classes()).toContain('custom-class')
    expect(root.attributes('data-testid')).toBe('empty-state')
    expect(root.attributes('role')).toBe('region')
  })
})
