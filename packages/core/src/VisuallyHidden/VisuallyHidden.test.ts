import { mount } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import VisuallyHidden from './VisuallyHidden.vue'

describe('visuallyHidden', () => {
  it('renders required slot content in a span without removing it from the accessibility tree', () => {
    const wrapper = mount(VisuallyHidden, {
      slots: {
        default: 'Delete incident',
      },
    })

    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.text()).toBe('Delete incident')
    expect(wrapper.attributes('hidden')).toBeUndefined()
    expect(wrapper.attributes('aria-hidden')).toBeUndefined()
  })

  it('supports structural HTML elements through the as prop', () => {
    const wrapper = mount(VisuallyHidden, {
      attrs: {
        'aria-live': 'polite',
        'role': 'status',
      },
      props: {
        as: 'div',
      },
      slots: {
        default: 'Task moved to Done',
      },
    })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.attributes('aria-live')).toBe('polite')
    expect(wrapper.attributes('role')).toBe('status')
  })

  it('keeps the hidden presentation fixed by ignoring class and style attrs', () => {
    const wrapper = mount(VisuallyHidden, {
      attrs: {
        class: 'consumer-class',
        style: 'position: static; width: auto;',
      },
      slots: {
        default: 'Hidden',
      },
    })

    expect(wrapper.classes()).toEqual(['astryx-visually-hidden'])
    expect(wrapper.attributes('style')).toBeUndefined()
  })

  it('can supply the accessible text of an icon-only control', () => {
    const wrapper = mount(defineComponent({
      components: {
        VisuallyHidden,
      },
      template: `
        <button type="button">
          <span aria-hidden="true">icon</span>
          <VisuallyHidden>Delete</VisuallyHidden>
        </button>
      `,
    }))
    const hiddenLabel = wrapper.find('.astryx-visually-hidden')

    expect(wrapper.find('button').text()).toContain('Delete')
    expect(hiddenLabel.text()).toBe('Delete')
    expect(hiddenLabel.attributes('aria-hidden')).toBeUndefined()
  })
})
