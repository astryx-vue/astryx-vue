import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import { useClickableContainer } from './useClickableContainer.js'

const Host = defineComponent({
  props: {
    href: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
  },
  emits: ['surface'],
  setup(props, { emit }) {
    const containerRef = ref<HTMLElement | null>(null)
    const interactiveRef = ref<HTMLElement | null>(null)
    const handlers = useClickableContainer({
      containerRef,
      interactiveRef,
      disabled: props.disabled,
      href: props.href,
      onClick: () => emit('surface'),
    })
    return { containerRef, interactiveRef, handlers }
  },
  template: `
    <div ref="containerRef" data-testid="card" @click="handlers.onClick" @mouseup="handlers.onMouseUp">
      <button ref="interactiveRef" type="button" data-testid="primary">Open</button>
      <button type="button" data-testid="nested">Add</button>
      <span data-testid="label">Title</span>
    </div>
  `,
})

describe('useClickableContainer', () => {
  it('activates the surface and ignores clicks on nested controls', async () => {
    const wrapper = mount(Host)
    await wrapper.get('[data-testid="label"]').trigger('click')
    expect(wrapper.emitted('surface')).toHaveLength(1)

    await wrapper.get('[data-testid="nested"]').trigger('click')
    expect(wrapper.emitted('surface')).toHaveLength(1)
    expect(wrapper.get('[data-testid="card"]').attributes('data-pressable-container')).toBe('true')
  })

  it('does nothing while disabled', async () => {
    const wrapper = mount(Host, { props: { disabled: true } })
    await wrapper.get('[data-testid="label"]').trigger('click')
    expect(wrapper.emitted('surface')).toBeUndefined()
  })

  it('opens a blank target without calling through the hidden control', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    const wrapper = mount(Host, { props: { href: 'https://example.com' } })
    await wrapper.get('[data-testid="label"]').trigger('click', { metaKey: true })
    expect(open).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener')
    open.mockRestore()
  })
})
