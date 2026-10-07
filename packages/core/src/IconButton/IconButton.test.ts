import { mount } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import ButtonGroup from '../ButtonGroup/ButtonGroup.vue'
import IconButton from './IconButton.vue'

describe('iconButton', () => {
  it('renders its required default slot as an icon-only button', () => {
    const wrapper = mount(IconButton, {
      props: {
        label: 'Open settings',
      },
      slots: {
        default: '<svg data-testid="settings-icon" />',
      },
    })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('aria-label')).toBe('Open settings')
    expect(wrapper.attributes('data-icon-only')).toBe('true')
    expect(wrapper.find('[data-testid="settings-icon"]').exists()).toBe(true)
    expect(wrapper.find('.astryx-button__label').exists()).toBe(false)
  })

  it('inherits size and disabled state from ButtonGroup', () => {
    const wrapper = mount(ButtonGroup, {
      props: {
        isDisabled: true,
        label: 'Icon actions',
        size: 'sm',
      },
      slots: {
        default: () => h(IconButton, {
          label: 'Settings',
        }, {
          default: () => h('svg'),
        }),
      },
    })
    const button = wrapper.find('.astryx-button')

    expect(button.attributes('data-size')).toBe('sm')
    expect(button.attributes('disabled')).toBe('')
  })
})
