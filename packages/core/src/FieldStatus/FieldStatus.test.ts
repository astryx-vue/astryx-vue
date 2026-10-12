import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FieldStatus from '../Field/FieldStatus.vue'

describe('field status', () => {
  it('renders a detached message from its own entry', () => {
    const wrapper = mount(FieldStatus, {
      props: { type: 'error', message: 'This field is required', variant: 'detached' },
    })
    expect(wrapper.get('.astryx-field-status').attributes('data-variant')).toBe('detached')
    expect(wrapper.text()).toContain('This field is required')
  })
})
