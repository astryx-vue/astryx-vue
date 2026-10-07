import { mount } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'
import HStack from './HStack.vue'
import Stack from './Stack.vue'
import VStack from './VStack.vue'

describe('stack', () => {
  it('lets axis padding override all-sides padding, including with zero', () => {
    const wrapper = mount(Stack, {
      props: {
        padding: 4,
        paddingBlock: 0,
        paddingInline: 2,
      },
    })

    expect(wrapper.element.style.getPropertyValue('--astryx-stack-padding-block')).toBe('var(--astryx-spacing-0, 0px)')
    expect(wrapper.element.style.getPropertyValue('--astryx-stack-padding-inline')).toBe('var(--astryx-spacing-2, 8px)')
  })

  it('formats numeric sizes as pixels and preserves string sizes', () => {
    const wrapper = mount(Stack, {
      props: {
        height: 320,
        maxWidth: '70rem',
        minHeight: 0,
        width: '100%',
      },
    })

    expect(wrapper.element.style.height).toBe('320px')
    expect(wrapper.element.style.maxWidth).toBe('70rem')
    expect(wrapper.element.style.minHeight).toBe('0px')
    expect(wrapper.element.style.width).toBe('100%')
  })
})

describe('hStack and VStack', () => {
  it('locks HStack to a horizontal direction', () => {
    const wrapper = mount(HStack, {
      slots: {
        default: 'Actions',
      },
    })

    expect(wrapper.attributes('data-direction')).toBe('horizontal')
    expect(wrapper.text()).toBe('Actions')
  })

  it('locks VStack to a vertical direction', () => {
    const wrapper = mount(VStack)

    expect(wrapper.attributes('data-direction')).toBe('vertical')
  })
})
