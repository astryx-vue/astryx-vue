import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
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

  it('renders a disabled link that keeps its tab stop and stays inert', () => {
    const onClick = vi.fn()
    const wrapper = mount(ClickableCard, {
      attachTo: document.body,
      props: { label: 'Docs', href: '/docs', isDisabled: true, onClick },
      slots: { default: 'Docs' },
    })
    const link = wrapper.get('a')

    expect(link.attributes('aria-disabled')).toBe('true')
    expect(link.attributes('role')).toBe('link')
    expect(link.attributes('tabindex')).toBe('0')
    expect(link.attributes('href')).toBeUndefined()
    expect(wrapper.get('.astryx-card').attributes('data-disabled')).toBe('true')
    expect(wrapper.get('.astryx-card').attributes('data-astryx-pressable')).toBeUndefined()

    ;(link.element as HTMLElement).focus()
    expect(document.activeElement).toBe(link.element)

    const click = new MouseEvent('click', { bubbles: true, cancelable: true })
    link.element.dispatchEvent(click)
    expect(click.defaultPrevented).toBe(true)
    expect(onClick).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('keeps a disabled action card focusable and inert', async () => {
    const onClick = vi.fn()
    const wrapper = mount(ClickableCard, {
      attachTo: document.body,
      props: { label: 'Docs', isDisabled: true, onClick },
      slots: { default: 'Docs' },
    })
    const button = wrapper.get('button')

    expect(button.attributes('disabled')).toBeUndefined()
    expect(button.attributes('aria-disabled')).toBe('true')

    ;(button.element as HTMLElement).focus()
    expect(document.activeElement).toBe(button.element)

    for (const key of ['Enter', ' ']) {
      const keydown = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
      button.element.dispatchEvent(keydown)
      expect(keydown.defaultPrevented).toBe(true)
    }

    await button.trigger('click')
    expect(onClick).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('marks an enabled card as pressable', () => {
    const wrapper = mount(ClickableCard, {
      props: { label: 'Docs' },
      slots: { default: 'Docs' },
    })
    expect(wrapper.get('.astryx-card').attributes('data-astryx-pressable')).toBe('')
  })
})
