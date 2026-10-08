import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import Spinner from './Spinner.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
})

describe('spinner', () => {
  it('renders an unlabelled status with a default accessible name', () => {
    const wrapper = mount(Spinner, { attachTo: document.body })
    const status = wrapper.get('[role="status"]')

    expect(status.classes()).toContain('astryx-spinner')
    expect(status.attributes('aria-label')).toBe('Loading')
    expect(status.attributes('aria-labelledby')).toBeUndefined()
    expect(status.attributes('data-size')).toBe('md')
    expect(status.attributes('data-shade')).toBe('default')
  })

  it('draws a track circle and an arc circle inside a hidden svg', () => {
    const wrapper = mount(Spinner, { attachTo: document.body })
    const svg = wrapper.get('svg')

    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.find('.astryx-spinner__track').exists()).toBe(true)
    expect(svg.find('.astryx-spinner__arc').exists()).toBe(true)
  })

  it('uses the string label as the accessible name through aria-labelledby', () => {
    const wrapper = mount(Spinner, {
      attachTo: document.body,
      props: { label: 'Saving' },
    })
    const status = wrapper.get('[role="status"]')
    const labelId = wrapper.get('.astryx-spinner-label').attributes('id')

    expect(labelId).toBeTruthy()
    expect(status.attributes('aria-labelledby')).toBe(labelId)
    expect(status.attributes('aria-label')).toBeUndefined()
    expect(wrapper.get('.astryx-spinner-label').text()).toBe('Saving')
  })

  it('prefers an explicit aria-label over the visible label', () => {
    const wrapper = mount(Spinner, {
      attachTo: document.body,
      props: { label: 'Saving' },
      attrs: { 'aria-label': 'Saving your changes' },
    })
    const status = wrapper.get('[role="status"]')

    expect(status.attributes('aria-label')).toBe('Saving your changes')
    expect(status.attributes('aria-labelledby')).toBeUndefined()
  })

  it('keeps the default accessible name when the label is a slot', () => {
    const wrapper = mount(Spinner, {
      attachTo: document.body,
      slots: { label: '<strong>Fetching</strong>' },
    })

    expect(wrapper.get('[role="status"]').attributes('aria-label')).toBe('Loading')
    expect(wrapper.get('.astryx-spinner-label strong').text()).toBe('Fetching')
  })

  it.each(['sm', 'md', 'lg', 'xl'] as const)('exposes size %s on the ring', (size) => {
    const wrapper = mount(Spinner, { attachTo: document.body, props: { size } })

    expect(wrapper.get('[role="status"]').attributes('data-size')).toBe(size)
  })

  it.each(['default', 'subtle', 'onMedia', 'inherit'] as const)('exposes shade %s on the ring', (shade) => {
    const wrapper = mount(Spinner, { attachTo: document.body, props: { shade } })

    expect(wrapper.get('[role="status"]').attributes('data-shade')).toBe(shade)
  })

  it('passes class and data attributes to the root element', () => {
    const wrapper = mount(Spinner, {
      attachTo: document.body,
      attrs: { 'class': 'custom', 'data-testid': 'spinner' },
    })

    expect(wrapper.get('[data-testid="spinner"]').classes()).toContain('custom')
  })

  it('moves class and data attributes to the group wrapper when labelled', () => {
    const wrapper = mount(Spinner, {
      attachTo: document.body,
      props: { label: 'Loading data' },
      attrs: { 'class': 'custom', 'data-testid': 'spinner' },
    })
    const group = wrapper.get('[data-testid="spinner"]')

    expect(group.classes()).toContain('astryx-spinner-group')
    expect(group.classes()).toContain('custom')
    expect(group.find('[role="status"]').exists()).toBe(true)
  })
})
