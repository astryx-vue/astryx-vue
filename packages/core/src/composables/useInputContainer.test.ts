import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { useInputContainer } from './useInputContainer.js'

function mountInput(disabled = ref(false)) {
  const containerRef = ref<HTMLElement | null>(null)
  const inputRef = ref<HTMLElement | null>(null)
  let handlers!: ReturnType<typeof useInputContainer>

  const wrapper = mount(defineComponent({
    name: 'InputContainerHost',
    setup() {
      handlers = useInputContainer({ containerRef, inputRef, disabled })
      return () => h('div', { ref: containerRef, class: 'container', onClick: handlers.onClick, onMouseUp: handlers.onMouseUp }, [
        h('span', { class: 'icon' }, '*'),
        h('input', { ref: inputRef, class: 'control', type: 'text' }),
        h('button', { class: 'clear', type: 'button' }, 'x'),
      ])
    },
  }), { attachTo: document.body })

  return { wrapper, inputRef, disabled }
}

describe('useInputContainer', () => {
  it('focuses the input when the container surface is clicked', async () => {
    const { wrapper, inputRef } = mountInput()
    await wrapper.get('.container').trigger('click')

    expect(document.activeElement).toBe(inputRef.value)
    expect(wrapper.get('.container').attributes('data-pressable-container')).toBe('true')
  })

  it('leaves clicks on nested controls to those controls', async () => {
    const { wrapper, inputRef } = mountInput()
    const clear = wrapper.get('.clear').element as HTMLButtonElement
    const onClick = vi.fn()
    clear.addEventListener('click', onClick)

    await wrapper.get('.clear').trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(document.activeElement).not.toBe(inputRef.value)
  })

  it('click()s an input that is not text-like instead of focusing it', async () => {
    const containerRef = ref<HTMLElement | null>(null)
    const inputRef = ref<HTMLElement | null>(null)
    const wrapper = mount(defineComponent({
      name: 'CheckboxHost',
      setup() {
        const handlers = useInputContainer({ containerRef, inputRef })
        return () => h('div', { ref: containerRef, class: 'container', onClick: handlers.onClick }, [
          h('input', { ref: inputRef, class: 'control', type: 'checkbox' }),
        ])
      },
    }), { attachTo: document.body })

    const checkbox = wrapper.get('.control').element as HTMLInputElement
    const click = vi.fn()
    checkbox.addEventListener('click', click)
    await wrapper.get('.container').trigger('click')
    expect(click).toHaveBeenCalledTimes(1)
  })

  it('does nothing while disabled', async () => {
    const disabled = ref(true)
    const { wrapper, inputRef } = mountInput(disabled)

    await wrapper.get('.container').trigger('click')
    expect(document.activeElement).not.toBe(inputRef.value)

    disabled.value = false
    await wrapper.get('.container').trigger('click')
    expect(document.activeElement).toBe(inputRef.value)
  })

  it('keeps the focus where it is when the user has a text selection', async () => {
    const { wrapper, inputRef } = mountInput()
    const icon = wrapper.get('.icon').element as HTMLElement
    const range = document.createRange()
    range.selectNodeContents(icon)
    const selection = document.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)

    await wrapper.get('.container').trigger('click')
    expect(document.activeElement).not.toBe(inputRef.value)
    selection?.removeAllRanges()
  })
})
