import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'
import ClickableCard from './ClickableCard.vue'

const Harness = defineComponent({
  components: { ClickableCard },
  setup() {
    const clicks = ref(0)
    const nested = ref(0)
    return { clicks, nested }
  },
  template: `
    <ClickableCard label="View product" @click="clicks += 1">
      <span data-testid="title">Headphones</span>
      <button type="button" data-testid="cart" @click="nested += 1">Add to cart</button>
    </ClickableCard>
  `,
})

describe('clickable card', () => {
  it('activates from the surface and from the hidden button', async () => {
    const wrapper = mount(Harness)
    await wrapper.get('[data-testid="title"]').trigger('click')
    expect(wrapper.vm.clicks).toBe(1)

    const control = wrapper.get('button[aria-label="View product"]')
    expect(control.classes()).toContain('astryx-visually-hidden')
    await control.trigger('click')
    expect(wrapper.vm.clicks).toBe(2)
  })

  it('leaves nested buttons alone', async () => {
    const wrapper = mount(Harness)
    await wrapper.get('[data-testid="cart"]').trigger('click')
    expect(wrapper.vm.nested).toBe(1)
    expect(wrapper.vm.clicks).toBe(0)
  })

  it('renders a link when href is set and disables it', () => {
    const wrapper = mount(ClickableCard, {
      props: { label: 'Docs', href: '/docs', isDisabled: true },
      slots: { default: 'Docs' },
    })
    const link = wrapper.get('a')
    expect(link.attributes('aria-disabled')).toBe('true')
    expect(link.attributes('tabindex')).toBe('-1')
    expect(wrapper.get('.astryx-card').attributes('data-disabled')).toBe('true')
    expect(wrapper.get('.astryx-card').attributes('data-astryx-pressable')).toBeUndefined()
  })

  it('marks an enabled card as pressable', () => {
    const wrapper = mount(ClickableCard, {
      props: { label: 'Docs' },
      slots: { default: 'Docs' },
    })
    expect(wrapper.get('.astryx-card').attributes('data-astryx-pressable')).toBe('')
  })
})
